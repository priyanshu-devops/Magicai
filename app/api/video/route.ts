import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const response = await replicate.run(
      "cjwbw/videocrafter:3a7e6cdc3f95192092fa47346a73c28d1373d1499f3b62cdea25efe355823afb",
      {
        input: {
          prompt,
        },
      }
    );

    // Check if the response contains a valid video URL
    if (typeof response === 'string') {
      return NextResponse.json(response);
    } else {
      console.error("Unexpected response format:", response);
      return new NextResponse("Internal Error", { status: 500 });
    }

  } catch (error) {
    console.log("[VIDEO_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
