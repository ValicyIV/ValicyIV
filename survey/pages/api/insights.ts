import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { logEvent } from '../../lib/logger';

const payloadSchema = z.object({
  respondent: z.object({
    department: z.string().min(2),
    role: z.string().min(2),
    location: z.string().min(2),
    tenure: z.string().min(2),
    email: z.string().email().optional(),
  }),
  sentimentScores: z
    .array(
      z.object({
        id: z.string(),
        question: z.string(),
        score: z.number().min(1).max(5),
      }),
    )
    .min(3),
  adoption: z.object({
    automationReady: z.boolean(),
    securityAligned: z.boolean(),
  }),
  qualitative: z
    .array(
      z.object({
        id: z.string(),
        response: z.string().min(5),
      }),
    )
    .min(1),
  summary: z.object({
    avg: z.string(),
    text: z.string(),
  }),
  capturedAt: z.string(),
});

export type InsightPayload = z.infer<typeof payloadSchema>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are supported',
    });
  }

  try {
    if (!req.body) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Request body is required',
      });
    }

    const parsed = payloadSchema.safeParse(req.body);
    if (!parsed.success) {
      logEvent('insights:validation_error', { issues: parsed.error.flatten().fieldErrors });
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    logEvent('insights:accepted', { respondent: parsed.data.respondent.department, avg: parsed.data.summary.avg });

    return res.status(200).json({
      success: true,
      message: 'Insight data received successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logEvent('insights:error', { message: error instanceof Error ? error.message : 'Unknown error' });
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing the submission',
    });
  }
}
