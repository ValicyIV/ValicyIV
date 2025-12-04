import type { NextApiRequest, NextApiResponse } from 'next';
import { logEvent } from '../../lib/logger';

type InsightPayload = {
  respondent?: {
    department?: string;
    role?: string;
    location?: string;
    tenure?: string;
    email?: string;
  };
  sentimentScores?: Array<{ id: string; question?: string; score?: number }>;
  qualitative?: Array<{ id: string; response?: string }>;
  summary?: {
    avg?: string;
    text?: string;
  };
  capturedAt?: string;
  adoption?: Record<string, unknown>;
};

const validatePayload = (body: InsightPayload) => {
  const details: string[] = [];

  if (!body.respondent || typeof body.respondent !== 'object') {
    details.push('Missing or invalid "respondent" field');
  } else {
    if (!body.respondent.department) {
      details.push('Missing or invalid "respondent.department" field');
    }
    if (!body.respondent.role) {
      details.push('Missing or invalid "respondent.role" field');
    }
  }

  if (!Array.isArray(body.sentimentScores) || body.sentimentScores.length < 2) {
    details.push('Missing or invalid "sentimentScores" array');
  }

  if (!Array.isArray(body.qualitative) || body.qualitative.length < 1) {
    details.push('Missing or invalid "qualitative" array');
  }

  if (!body.summary || typeof body.summary !== 'object') {
    details.push('Missing or invalid "summary" field');
  } else {
    if (!body.summary.avg) {
      details.push('Missing or invalid "summary.avg" field');
    }
    if (!body.summary.text) {
      details.push('Missing or invalid "summary.text" field');
    }
  }

  if (!body.capturedAt) {
    details.push('Missing or invalid "capturedAt" timestamp');
  }

  return details;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are supported',
    });
  }

  try {
    const hasUsableBody =
      req.body &&
      typeof req.body === 'object' &&
      Object.values(req.body).some((value) => value !== null && value !== undefined);

    if (!hasUsableBody) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Request body is required',
      });
    }

    const body = req.body as InsightPayload;
    const validationErrors = validatePayload(body);

    if (validationErrors.length > 0) {
      logEvent('insights:validation_error', { details: validationErrors });
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
      });
    }

    logEvent('insights:accepted', { respondent: body.respondent?.department, avg: body.summary?.avg });

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
