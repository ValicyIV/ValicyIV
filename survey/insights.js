/**
 * API endpoint to receive survey insights and store them.
 * This endpoint consumes the summary data (average sentiment and alignment label)
 * that is calculated client-side and sent in the payload.
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported'
    });
  }

  try {
    const payload = req.body;

    // Validate that request body exists
    if (!payload) {
      return res.status(400).json({ 
        error: 'Bad request',
        message: 'Request body is required'
      });
    }

    // Validate required fields
    const errors = [];
    
    if (!payload.respondent || typeof payload.respondent !== 'object') {
      errors.push('Missing or invalid "respondent" field');
    } else {
      if (!payload.respondent.department || typeof payload.respondent.department !== 'string') {
        errors.push('Missing or invalid "respondent.department" field');
      }
      if (!payload.respondent.role || typeof payload.respondent.role !== 'string') {
        errors.push('Missing or invalid "respondent.role" field');
      }
    }

    if (!Array.isArray(payload.sentimentScores)) {
      errors.push('Missing or invalid "sentimentScores" array');
    }

    if (!Array.isArray(payload.qualitative)) {
      errors.push('Missing or invalid "qualitative" array');
    }

    if (!payload.summary || typeof payload.summary !== 'object') {
      errors.push('Missing or invalid "summary" field');
    } else {
      if (!payload.summary.avg || typeof payload.summary.avg !== 'string') {
        errors.push('Missing or invalid "summary.avg" field');
      }
      if (!payload.summary.text || typeof payload.summary.text !== 'string') {
        errors.push('Missing or invalid "summary.text" field');
      }
    }

    if (!payload.capturedAt || typeof payload.capturedAt !== 'string') {
      errors.push('Missing or invalid "capturedAt" timestamp');
    }

    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Request validation failed',
        details: errors
      });
    }

    // Extract the summary data that was calculated client-side
    const { summary, respondent, sentimentScores, qualitative, capturedAt } = payload;

    // Log the received data (in production, you would store this in a database)
    console.log('Received survey insights:', {
      respondent,
      summary: {
        averageSentiment: summary.avg,
        alignmentLabel: summary.text
      },
      sentimentScores: sentimentScores?.length || 0,
      qualitativeResponses: qualitative?.length || 0,
      capturedAt
    });

    // TODO: Store the data in your database/backend system
    // Example:
    // await db.surveyResponses.create({
    //   respondent,
    //   sentimentScores,
    //   qualitative,
    //   summary: {
    //     averageSentiment: parseFloat(summary.avg),
    //     alignmentLabel: summary.text
    //   },
    //   capturedAt: new Date(capturedAt)
    // });

    // Return success response
    // The summary data (avg and text) is now available for your dashboard/backend to use
    return res.status(200).json({ 
      success: true,
      message: 'Insight data received successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing insights:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'An error occurred while processing the submission'
    });
  }
}

