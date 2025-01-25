"use client"
import React, { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heading } from '@/components/heading';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from '@/components/loader';
import { Empty } from '@/components/ui/empty';
import { UserAvatar } from '@/components/user-avatar';
import { BotAvatar } from '@/components/bot-avatar';
import ReactMarkdown from 'react-markdown';
import { ScanEye, ImagePlus, XCircleIcon } from 'lucide-react'; // Import XCircle icon

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
});

const Smart = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Manage loading state

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: '' },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true); // Set loading state to true when submitting
    try {
      const userMessage = { role: 'user', content: values.prompt };
      setMessages((prev) => [...prev, userMessage]);

      const base64Image = await new Promise<string>((resolve) => {
        if (image) {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(image);
        } else {
          resolve('');
        }
      });

      const payload = {
        contents: [
          {
            parts: [
              { text: values.prompt },
              {
                inline_data: {
                  mime_type: image ? image.type : '',
                  data: base64Image,
                },
              },
            ],
          },
        ],
      };

      const API_KEY = process.env.NEXT_PUBLIC_GEMINI_AI_API_KEY!;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const result = await response.json();
      const botMessage = {
        role: 'assistant',
        content: result?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response',
      };

      setMessages((prev) => [...prev, botMessage]);
      form.reset();
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false); // Reset loading state after submission
    }
  };

  return (
    <>
      <Heading
        title="Smart Sense"
        description="Our most advanced smart model."
        icon={ScanEye}
        iconColor="text-blue-700"
        bgColor="bg-blue-700/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 bg-white dark:bg-[#080c14] p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center gap-x-4">
              {/* Image Preview Section */}
              {imagePreview && (
                <div className="w-20 h-20 relative mx-auto">
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleImageRemove}
                    className="absolute top-0 right-0 bg-white dark:bg-[#1f2937] text-black dark:text-white hover:text-red-700 p-1 rounded-full shadow-md"
                  >
                    <XCircleIcon size={14} />
                  </button>
                </div>
              )}

              {/* Text Input */}
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Enter your text prompt"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Image Upload Button */}
              <label htmlFor="image-upload" className="cursor-pointer">
                <ImagePlus size={24} />
              </label>
              <input
                id="image-upload"
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button type="submit" disabled={isLoading} className="ml-4">
                {isLoading ? <Loader /> : 'Generate'}
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-6">
          {messages.length === 0 && <Empty label="No conversations yet." />}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-8 w-full flex items-start gap-x-8 rounded-lg ${
                message.role === 'user'
                  ? 'bg-white border border-gray-200 dark:bg-[#080c14] dark:border-[#080c14]'
                  : 'bg-gray-100 dark:bg-[#080c14]'
              }`}
            >
              {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
              <div className="text-sm whitespace-pre-wrap text-black dark:text-white">
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg dark:bg-[#080c14]">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code className="bg-black/10 rounded-lg p-1 dark:bg-[#080c14]" {...props} />
                    ),
                  }}
                  className="text-sm overflow-hidden leading-7"
                >
                  {message.content || ''}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Smart;
