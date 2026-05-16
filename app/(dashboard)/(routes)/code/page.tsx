'use client';

import * as z from 'zod';
import { useState } from 'react';
import { Code } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { BotAvatar } from '@/components/bot-avatar';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Loader } from '@/components/loader';
import { UserAvatar } from '@/components/user-avatar';
import { Empty } from '@/components/ui/empty';
import { formSchema } from './constants';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import { showCustomToast } from '@/app/utils/toast';

const ConversationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage = {
        role: 'user',
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const API_KEY = process.env.NEXT_PUBLIC_GEMINI_AI_API_KEY!;
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent(values.prompt);
      const response = await result.response;
      const botMessage = {
        role: 'assistant',
        content: await response.text(),
      };

      setMessages((current) => [...current, userMessage, botMessage]);
      form.reset();
      showCustomToast("🔥 Background removed successfully!");
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-[#080c14] text-black dark:text-white">
      <Heading
        title="Code Generation"
        description="Our most advanced conversation model."
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
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
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent bg-white dark:bg-[#080c14] text-black dark:text-white"
                      disabled={isLoading}
                      placeholder="Simple toggle button using react hooks."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="col-span-12 lg:col-span-2 w-full"
              type="submit"
              disabled={isLoading}
              size="icon"
            >
              Generate
            </Button>
          </form>
        </Form>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-gray-200 dark:bg-[#080c14]">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'p-8 w-full flex items-start gap-x-8 rounded-lg',
                  message.role === 'user'
                    ? 'bg-white border border-gray-200 dark:bg-[#080c14] dark:border-[#080c14]'
                    : 'bg-gray-100 dark:bg-[#080c14]'
                )}
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
      </div>
    </div>
  );
};

export default ConversationPage;
