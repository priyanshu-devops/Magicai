// pages/api/imageGeneration.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type RequestBody = {
  prompt: string;
  resolution: string;
};

type ErrorResponse = {
  error: string;
};

type SuccessResponse = {
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (req.method === 'POST') {
    try {
      const { prompt, resolution }: RequestBody = req.body;

      if (!prompt || !resolution) {
        return res.status(400).json({ error: 'Invalid input' });
      }

      const response = await fetch(process.env.NEXT_PUBLIC_API_URL as string, {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: prompt,
          options: {
            resolution: resolution,
          },
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        return res.status(response.status).json({ error: errorResponse.message || 'Failed to generate image' });
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      res.status(200).json({ url: imageUrl });
    } catch (error) {
      console.error('Error generating image:', error);
      res.status(500).json({ error: 'Failed to generate image' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
