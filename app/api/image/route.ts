import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey =
      process.env.CLIPDROP_API_KEY ??
      process.env.NEXT_PUBLIC_CLIPDROP_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "ClipDrop API key is not configured. Add CLIPDROP_API_KEY in Vercel environment variables and redeploy.",
        },
        { status: 500 }
      );
    }

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let message = "ClipDrop request failed.";
      try {
        const parsed = JSON.parse(errorText);
        message = parsed.error || parsed.message || message;
      } catch {
        if (errorText) message = errorText;
      }

      return NextResponse.json(
        { error: message },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error("Image API error:", error);
    return NextResponse.json(
      { error: "Internal server error while generating image." },
      { status: 500 }
    );
  }
}
