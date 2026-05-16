
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/loader';
import { Copy, ImagePlayIcon, Timer, Download, Eye, X, RefreshCw } from 'lucide-react';
import { showCustomToast } from '@/app/utils/toast';

const formSchema = z.object({
  file: z.instanceof(File, { message: "File is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const ImagePage = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [uuidList, setUuidList] = useState<any[]>(JSON.parse(localStorage.getItem('uuidList') || '[]'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualUUID, setManualUUID] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Stores the URL of the video for preview
  const [isChecking, setIsChecking] = useState(false);

  const form = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    localStorage.setItem('uuidList', JSON.stringify(uuidList));
  }, [uuidList]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      setError(null);

      const file = values.file;
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Image = reader.result?.toString().split(',')[1];

        if (!base64Image) {
          setError("Failed to process image.");
          setLoading(false);
          return;
        }

        const response = await axios.post(
          'https://runwayml.p.rapidapi.com/generate/image',
          {
            img_prompt: `data:image/png;base64,${base64Image}`,
            model: 'gen3',
            image_as_end_frame: false,
            flip: false,
            motion: 5,
            seed: 0,
            callback_url: '',
            time: 5,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-rapidapi-host': 'runwayml.p.rapidapi.com',
              'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
            },
          }
        );

        const newUUID = { uuid: response.data.uuid, status: 'Pending', url: '', timer: 600 };
        setUuidList([...uuidList, newUUID]);
        setOriginalImage(URL.createObjectURL(values.file));
      };

      reader.readAsDataURL(file);
      showCustomToast("🔥 Video will be generated in 10 minutes");

    } catch (error) {
      console.error('Error processing image:', error);
      setError('Failed to generate video. Please try again.');
      showCustomToast("❌ Failed to generate Video.");
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async (uuid: string) => {
    setIsChecking(true);
    try {
      const response = await axios.get(`https://runwayml.p.rapidapi.com/status?uuid=${uuid}`, {
        headers: {
          'x-rapidapi-host': 'runwayml.p.rapidapi.com',
          'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
        },
      });

      setUuidList((prev) =>
        prev.map((item) =>
          item.uuid === uuid ? { ...item, status: response.data.status, url: response.data.url } : item
        )
      );
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const addManualUUID = () => {
    if (manualUUID.trim()) {
      setUuidList([...uuidList, { uuid: manualUUID, status: 'Pending', url: '', timer: 600 }]);
      setManualUUID('');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setUuidList((prev) =>
        prev.map((item) =>
          item.timer > 0 ? { ...item, timer: item.timer - 1 } : item
        )
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#080c14] text-black dark:text-white p-8">
      <Heading
        title="Image to Video"
        description="Upload an image to convert it into a video."
        icon={ImagePlayIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="file"
          accept="image/*"
          disabled={loading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              form.setValue("file", file);
            }
          }}
        />
        <Button type="submit" disabled={loading}>Convert to Video</Button>
      </form>
      {loading && <Loader />}
      {error && <div className="text-red-500">{error}</div>}

      {originalImage && (
        <div className="mt-4">
          <Image src={originalImage} alt="Original" width={200} height={200} className="rounded" />
        </div>
      )}

      {/* Manual UUID Input */}
      <div className="mt-6 flex gap-2">
        <Input
          type="text"
          placeholder="Enter UUID manually"
          value={manualUUID}
          onChange={(e) => setManualUUID(e.target.value)}
        />
        <Button onClick={addManualUUID}>Add UUID</Button>
      </div>

      {uuidList.length > 0 && (
        <div className="mt-6 border rounded-lg p-4 bg-white dark:bg-[#080c14]">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800">
                <th className="p-2 text-left border">UUID</th>
                <th className="p-2 text-left border">Timer</th>
                <th className="p-2 text-left border">Status</th>
                <th className="p-2 text-left border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {uuidList.map((item, index) => (
                <tr key={index} className="border">
                  <td className="p-2 text-left border">{item.uuid}</td>
                  <td className="p-2 text-left border flex items-center gap-2">
                    <Timer className="inline-block w-4 h-4 mr-1" /> {item.timer}s
                  </td>
                  <td className="p-2 text-left border">{item.status}</td>
                  <td className="p-2 text-left border flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(item.uuid)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => checkStatus(item.uuid)} disabled={isChecking}>
                      <RefreshCw className="w-4 h-4 text-blue-500" />
                    </Button>
                    {item.url && (
                      <>
                        <Button variant="outline" onClick={() => setPreviewUrl(item.url)}>
                          <Eye className="w-4 h-4 text-green-500" />
                        </Button>
                        <a href={item.url} download>
                          <Button variant="outline"><Download className="w-4 h-4 text-purple-500" /></Button>
                        </a>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <video src={previewUrl} controls className="w-[600px] h-[400px]" />
            <Button onClick={() => setPreviewUrl(null)}><X className="w-4 h-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePage;