'use client';

import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import confetti from 'canvas-confetti';

import { ImageIcon } from 'lucide-react';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Loader } from '@/components/loader';
import { Empty } from '@/components/ui/empty';

import Meteors from '@/components/magicui/meteors';

const formSchema = z.object({
  file: z
    .any()
    .refine((file) => file && file.length > 0, 'File is required')
    .transform((file) => file && file[0]),
});

const ImagePage = () => {
  const router = useRouter();

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: null,
    },
  });

  const isLoading = form.formState.isSubmitting || loading;

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      setOriginalImage(null);
      setProcessedImage(null);
      setError(null);

      const formData = new FormData();
      formData.append('image_file', values.file);
      formData.append('size', 'auto');

      const response = await axios.post(
        'https://api.remove.bg/v1.0/removebg',
        formData,
        {
          headers: {
            'X-Api-Key': 'wEEoCfEGnMkoxJM1oh7wJuAJ',
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], { type: 'image/png' });
      const url = URL.createObjectURL(blob);

      setOriginalImage(URL.createObjectURL(values.file));
      setProcessedImage(url);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (error) {
      console.error('Error removing background:', error);
      setError('Failed to remove background. Please try again.');
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  const downloadImage = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed_image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-100 dark:bg-[#080c14] text-black dark:text-white">
      <Meteors number={20} />
      <div className="relative z-10 h-full overflow-hidden p-4 lg:p-8">
        <Heading
          title="Remove Background"
          description="Upload an image to remove its background."
          icon={ImageIcon}
          iconColor="text-pink-700"
          bgColor="bg-pink-700/10"
        />
        <div className="px-4 lg:px-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
                bg-white
                dark:bg-[#080c14]
                border-gray-200
                dark:border-[#080c14]
              "
            >
              <FormField
                name="file"
                render={({ field }) => (
                  <FormItem className="col-span-12">
                    <FormControl className="m-0 p-0">
                      <Input
                        type="file"
                        accept="image/*"
                        disabled={isLoading}
                        onChange={(e) => {
                          const file = e.target.files;
                          if (file) {
                            form.setValue('file',file);
                          }
                        }}
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent bg-white dark:bg-[#080c14] text-black dark:text-white"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 w-full"
                type="submit"
                disabled={isLoading}
              >
                Remove Background
              </Button>
            </form>
          </Form>
          {isLoading && (
            <div className="p-20">
              <Loader />
            </div>
          )}
          {error && <div className="p-4 text-red-500">{error}</div>}
          {!originalImage && !isLoading && <Empty label="No images uploaded." />}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {originalImage && (
              <Card className="rounded-lg overflow-hidden">
                <h3 className="text-center">Original Image</h3>
                <div className="relative w-full h-64">
                  <Image fill alt="Original Image" src={originalImage} />
                </div>
              </Card>
            )}
            {processedImage && (
              <Card className="rounded-lg overflow-hidden">
                <h3 className="text-center">Processed Image</h3>
                <div className="relative w-full h-64">
                  <Image fill alt="Processed Image" src={processedImage} />
                </div>
                <CardFooter className="p-2">
                  <Button
                    className="w-full"
                    onClick={() => downloadImage(processedImage)}
                  >
                    Download
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
