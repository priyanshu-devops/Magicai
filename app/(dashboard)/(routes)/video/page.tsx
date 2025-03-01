"use client";

import { useState, useEffect } from "react";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Video, Clipboard, RefreshCw, Eye, Download, Timer, X } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import toast from "react-hot-toast";

const formSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
});

const VideoPage = () => {
  const router = useRouter();
  const [uuidList, setUuidList] = useState<any[]>(JSON.parse(localStorage.getItem("uuidList") || "[]"));
  const [manualUuid, setManualUuid] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    localStorage.setItem("uuidList", JSON.stringify(uuidList));
  }, [uuidList]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setUuidList((prevList) =>
        prevList.map((item) => ({ ...item, timer: Math.max(item.timer - 1, 0) }))
      );
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        "https://runwayml.p.rapidapi.com/generate/text",
        {
          text_prompt: values.prompt,
          model: "gen3",
          width: 1344,
          height: 768,
          motion: 5,
          seed: 0,
          callback_url: "",
          time: 5,
        },
        {
          headers: {
            "x-rapidapi-host": "runwayml.p.rapidapi.com",
            "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          },
        }
      );

      if (response.data?.uuid) {
        setUuidList([...uuidList, { uuid: response.data.uuid, status: "Pending", url: "", timer: 600 }]);
        toast.success("UUID generated! Copy it to check later.");
      } else {
        toast.error("Failed to generate UUID.");
      }
      form.reset();
    } catch (error) {
      toast.error("Failed to generate video.");
    }
  };

  const checkStatus = async (uuidToCheck) => {
    try {
      setIsChecking(true);
      const response = await axios.get(
        `https://runwayml.p.rapidapi.com/status?uuid=${uuidToCheck}`,
        {
          headers: {
            "x-rapidapi-host": "runwayml.p.rapidapi.com",
            "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          },
        }
      );

      setUuidList((prevList) =>
        prevList.map((item) =>
          item.uuid === uuidToCheck
            ? { ...item, status: response.data.status, url: response.data.url || null }
            : item
        )
      );

      if (response.data.url) setPreviewUrl(response.data.url);
      toast.success("Video status updated!");
    } catch {
      toast.error("Failed to check status.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div>
      <Heading title="Video Generation" description="Turn your prompt into video." icon={Video} iconColor="text-orange-700" bgColor="bg-orange-700/10" />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-12 gap-2 p-4 border rounded-lg">
            <FormField name="prompt" render={({ field }) => (
              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl>
                  <Input disabled={isLoading} placeholder="Enter a prompt..." {...field} />
                </FormControl>
              </FormItem>
            )} />
            <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading}>Generate</Button>
          </form>
        </Form>

        <div className="mt-4 flex gap-2">
          <Input value={manualUuid} onChange={(e) => setManualUuid(e.target.value)} placeholder="Enter UUID manually" />
          <Button onClick={() => checkStatus(manualUuid)} disabled={isChecking || !manualUuid.trim()}>Check Status</Button>
        </div>

        <table className="w-full mt-6 border rounded-lg">
  <thead>
    <tr className="bg-gray-200">
      <th className="p-2 text-left">UUID</th>
      <th className="p-2 text-left">Timer</th>
      <th className="p-2 text-left">Status</th>
      <th className="p-2 text-left">Actions</th>
    </tr>
  </thead>
  <tbody>
    {uuidList.map((item) => (
      <tr key={item.uuid} className="border-t">
        <td className="p-2 text-left">{item.uuid}</td>
        <td className="p-2 text-left flex items-center gap-2">
          <Timer className="w-4 h-4 text-red-500" /> {item.timer}s
        </td>
        <td className="p-2 text-left">{item.status}</td>
        <td className="p-2 text-left flex gap-2">
          <Button variant="outline" size="sm" onClick={() => checkStatus(item.uuid)} disabled={isChecking}>
            <RefreshCw className="w-4 h-4 text-blue-500" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(item.uuid)}>
            <Clipboard className="w-4 h-4 text-gray-500" />
          </Button>
          {item.url && (
            <>
              <Button variant="outline" onClick={() => setPreviewUrl(item.url)}>
                <Eye className="w-4 h-4 text-green-500" />
              </Button>
              <a href={item.url} download>
                <Button variant="outline">
                  <Download className="w-4 h-4 text-purple-500" />
                </Button>
              </a>
            </>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>

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

export default VideoPage;
