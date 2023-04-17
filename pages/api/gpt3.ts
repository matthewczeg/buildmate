import type { NextApiRequest, NextApiResponse } from 'next';
import { getGpt3Response } from '../../lib/gpt3';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const messages = req.body.messages;
  try {
    const response = await getGpt3Response(messages);
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}