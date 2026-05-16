"use client";

import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Volume2, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showCustomToast } from "@/app/utils/toast";

// 🔑 API Key from .env
const API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

// 🎙️ 20+ Eleven Labs Voices
const voices = [
  { name: "Boy (Young)", id: "JBFqnCBsd6RMkjVDRZzb" },
  { name: "Deep Voice (Male)", id: "21m00Tcm4TlvDq8ikWAM" },
  { name: "Old Man", id: "AZnzlk1XvdvUeBnXmlld" },
  { name: "Narrator (Deep)", id: "ErXwobaYiN019PkySvjV" },
  { name: "Young Girl", id: "TxGEqnHWrfWFTfGW9XjX" },
  { name: "Soft Female", id: "MF3mGyEYCl7XYWbV9V6O" },
  { name: "Professional", id: "EXAVITQu4vr4xnSDxMaL" },
  { name: "Casual Male", id: "pNInz6obpgDQGcFmaJgB" },
  { name: "Casual Female", id: "3nXKqjvVdpXh2lS4I5xE" },
  { name: "Deep Radio", id: "5gYbF9KX39uWtYa4c1rZ" },
  { name: "Energetic Male", id: "A5hX1KEgr6oGaf7Ex78C" },
  { name: "Smooth Storyteller", id: "g5CIjZEefAph4UTdW6gV" },
];

const formSchema = z.object({
  prompt: z.string().min(1, "Text is required"),
  voice: z.string().min(1, "Voice is required"),
  cloneFile: z.any().optional(),
});

const TTSPage = () => {
  const router = useRouter();
  const [audios, setAudios] = useState<{ url: string; name: string }[]>([]);
  const [clonedVoiceId, setClonedVoiceId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      voice: voices[0].id,
      cloneFile: null,
    },
  });

  // 🧬 Upload & Clone Voice
  const handleCloneVoice = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
        method: "POST",
        headers: {
          "xi-api-key": API_KEY!,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Voice cloning failed.");
      }

      const data = await response.json();
      setClonedVoiceId(data.voice_id);
      form.setValue("voice", data.voice_id);
      showCustomToast("🎤 Voice cloned successfully!");
    } catch (error) {
      console.error("Error cloning voice:", error);
      showCustomToast("❌ Voice cloning failed.");
    }
  };

  // 🎯 Fetch Audio from ElevenLabs API
  const queryTTS = async (text: string, voiceId: string) => {
    const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate audio");
    }

    return await response.blob();
  };

  // 📝 Handle Submit
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setAudios([]);

      const voiceId = values.voice || clonedVoiceId || voices[0].id;
      const audioBlob = await queryTTS(values.prompt, voiceId);
      const url = URL.createObjectURL(audioBlob);

      setAudios([{ url, name: values.prompt.replace(/[^a-zA-Z0-9]/g, "_") }]);
      showCustomToast("🔥 Generated successfully!");
    } catch (error) {
      console.error("Error generating audio:", error);
      showCustomToast("❌ Failed to generate audio.");
    } finally {
      router.refresh();
    }
  };

  // ⬇️ Download Audio File
  const downloadAudio = (url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showCustomToast("📥 Audio downloaded!");
  };

  return (
    <div>
      <Heading
        title="Text-to-Speech"
        description="Turn your text into speech with multiple voices."
        icon={Volume2}
        iconColor="text-blue-700"
        bgColor="bg-blue-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 grid grid-cols-12 gap-2"
            >
              {/* 📌 Text Input */}
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-8">
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="Enter your text here"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* 🎤 Voice Selection */}
              <FormField
                name="voice"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-4">
                    <Select
                      disabled={form.formState.isSubmitting}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Voice" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {voices.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            {voice.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* 🎙️ Generate Button */}
              <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={form.formState.isSubmitting}>
                Generate
              </Button>
            </form>
          </Form>

          {audios.map(({ url, name }) => (
            <Card key={url} className="mt-4">
              <audio controls className="w-full">
                <source src={url} type="audio/mp3" />
              </audio>
              <CardFooter>
                <Button onClick={() => downloadAudio(url, name)}>
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TTSPage;
