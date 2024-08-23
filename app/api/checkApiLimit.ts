// pages/api/checkApiLimit.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { checkApiLimit } from '@/lib/api-limit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const freeTrial = await checkApiLimit();
    res.status(200).json({ freeTrial });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
