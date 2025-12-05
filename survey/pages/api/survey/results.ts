import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const responses = await prisma.surveyResponse.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Parse implementationAreas back to JSON
        const formattedResponses = responses.map((r) => ({
            ...r,
            implementationAreas: JSON.parse(r.implementationAreas),
        }));

        res.status(200).json(formattedResponses);
    } catch (error) {
        console.error('Request error', error);
        res.status(500).json({ error: 'Error fetching results', details: error });
    }
}
