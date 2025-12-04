/**
 * API endpoint to receive survey insights and store them.
 * This endpoint consumes the summary data (average sentiment and alignment label)
 * that is calculated client-side and sent in the payload.
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;

    // Validate that the payload contains the required structure
    if (!payload || !payload.summary) {
      return res.status(400).json({ 
        error: 'Invalid payload: missing summary data',
        message: 'Payload must include summary with avg and text fields'
      });
    }

    // Extract the summary data that was calculated client-side
    const { summary, respondent, sentimentScores, qualitative, capturedAt } = payload;

    // Validate summary structure
    if (!summary.avg || !summary.text) {
      return res.status(400).json({ 
        error: 'Invalid summary: missing avg or text',
        message: 'Summary must include avg (average sentiment) and text (alignment label)'
      });
    }

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
      message: 'Insights received and processed',
      summary: {
        averageSentiment: summary.avg,
        alignmentLabel: summary.text
      },
      // Echo back the summary to confirm it was received correctly
      receivedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing insights:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process insights'
    });
  }
}

