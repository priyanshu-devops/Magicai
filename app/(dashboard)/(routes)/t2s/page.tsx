"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Volume2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { voiceOptions, formSchema } from "./constants";

const TTSPage = () => {
  const router = useRouter();
  
  const [audios, setAudios] = useState<{ url: string, name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      voice: "alloy",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setAudios([]);
      setError(null);

      const response = await query({
        model: "tts-1",
        input: values.prompt,
        voice: values.voice,
      });

      const url = URL.createObjectURL(response);
      setAudios([{ url, name: values.prompt.replace(/[^a-zA-Z0-9]/g, '_') }]);
    } catch (error) {
      console.error('Error generating audio:', error);
      setError('Failed to generate audio. Please try again.');
    } finally {
      router.refresh();
    }
  };

  const query = async (data) => {
    const response = await fetch(
      "https://api.openai.com/v1/audio/speech",
      {
        headers: { 
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error response:', errorResponse);
      throw new Error('Failed to generate audio');
    }

    const blob = await response.blob();
    return blob;
  };

  const downloadAudio = (url, name) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <Heading
        title="Text-to-Speech"
        description="Turn your text into speech."
        icon={Volume2}
        iconColor="text-blue-700"
        bgColor="bg-blue-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
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
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-8">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Enter your text here"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="voice"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {voiceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
          {isLoading && (
            <div className="p-20">
              <Loader />
            </div>
          )}
          {error && (
            <div className="p-4 text-red-500">
              {error}
            </div>
          )}
          {audios.length === 0 && !isLoading && (
            <Empty label="No audio generated." />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {audios.map(({ url, name }) => (
              <Card key={url} className="rounded-lg overflow-hidden">
                <audio controls className="w-full">
                  <source src={url} type="audio/mp3" />
                </audio>
                <CardFooter className="p-2">
                  <Button
                    onClick={() => downloadAudio(url, name)}
                    variant="secondary"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TTSPage;
