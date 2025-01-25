// pages/api/gemini.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Ensure the API key is available
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_AI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'API key is missing' });
      }

      // Instantiate Google Generative AI with the API key
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Extract prompt and image data from the request body
      const { prompt, image } = req.body;

      // Ensure both prompt and image are provided
      if (!prompt || !image) {
        return res.status(400).json({ error: 'Prompt and image are required' });
      }

      // Convert image data to base64
      const imageBase64 = Buffer.from(image.data).toString('base64');

      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/png',
        },
      };

      // Generate content using the Gemini model
      const result = await model.generateContent([prompt, imagePart]);

      // Send the result back to the frontend
      res.status(200).json({ message: result.response.text() });
    } catch (error) {
      console.error('Error with Gemini API:', error);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  } else {
    // Handle unsupported request methods
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
