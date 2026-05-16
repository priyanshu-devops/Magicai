"use client";

import * as z from "zod";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Download, Flame, Loader2 } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Empty } from "@/components/ui/empty";

const Ghibli = () => {
  const router = useRouter();
  const [images, setImages] = useState<{ url: string; name: string; prompt: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(
      z.object({
        prompt: z.string().min(3, "Prompt must be at least 3 characters"),
      })
    ),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values: { prompt: string }) => {
    try {
      setLoading(true);
      setImages([]);
      setError(null);

      const finalPrompt = `Ghibli Art: ${values.prompt}`; // Automatically adding "Ghibli Art:"
      const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
      if (!apiKey) {
        throw new Error("Missing Hugging Face API key");
      }

      const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev",
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: finalPrompt }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setImages([{ url, name: finalPrompt.replace(/[^a-zA-Z0-9]/g, "_"), prompt: finalPrompt }]);
    } catch (error) {
      setError("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  const downloadImage = (url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
  };

  return (
    <div>
      <Heading
        title="Ghibli Generation"
        description="Turn your prompt into an ghibli image."
        icon={Flame}
        iconColor="text-blue-700"
        bgColor="bg-blue-700/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg border p-4 w-full grid grid-cols-12 gap-2">
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-9">
                  <FormControl>
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={loading}
                      placeholder="Enter your prompt here..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="col-span-12 lg:col-span-3 w-full" type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Generate"}
            </Button>
          </form>
        </Form>

        {loading && (
          <div className="flex justify-center items-center p-10">
            <Loader2 className="w-10 h-10 animate-spin text-pink-700" />
          </div>
        )}

        {error && <div className="p-4 text-red-500 text-center">{error}</div>}

        {images.length === 0 && !loading && <Empty label="No images generated." />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
          {images.map(({ url, name, prompt }) => (
            <Card key={url} className="rounded-lg overflow-hidden">
              <div className="relative aspect-square">
                <Image fill alt="Generated Image" src={url} className="object-cover" />
              </div>
              <div className="p-2 flex items-center justify-between text-sm text-gray-700">
                <span>{prompt}</span>
                <Copy className="w-4 h-4 cursor-pointer" onClick={() => copyPrompt(prompt)} />
              </div>
              <CardFooter className="p-2">
                <Button onClick={() => downloadImage(url, name)} variant="secondary" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Infinity Scrolling Effect */}
        

        
      </div>
    </div>
  );
};

export default Ghibli;
