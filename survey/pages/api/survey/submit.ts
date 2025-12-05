import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { sentimentScore, implementationAreas, concerns, comments } = req.body;

        const savedResponse = await prisma.surveyResponse.create({
            data: {
                sentimentScore,
                implementationAreas: JSON.stringify(implementationAreas), // Store array as string
                concerns,
                comments,
            },
        });

        res.status(200).json(savedResponse);
    } catch (error) {
        console.error('Request error', error);
        res.status(500).json({ error: 'Error submitting survey', details: error });
    }
}
