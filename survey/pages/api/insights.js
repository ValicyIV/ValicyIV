/**
 * API endpoint to receive survey insights and store them.
 * This endpoint consumes the summary data (average sentiment and alignment label)
 * that is calculated client-side and sent in the payload.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are supported',
    })
  }

  try {
    const hasUsableBody =
      req.body &&
      typeof req.body === 'object' &&
      Object.values(req.body).some((value) => value !== null && value !== undefined)

    if (!hasUsableBody) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Request body is required',
      })
    }

    const payload = req.body
    const errors = []

    const { respondent, sentimentScores, qualitative, summary, capturedAt } = payload

    if (!respondent || typeof respondent !== 'object') {
      errors.push('Missing or invalid "respondent" field')
    } else {
      if (!respondent.department || typeof respondent.department !== 'string') {
        errors.push('Missing or invalid "respondent.department" field')
      }
      if (!respondent.role || typeof respondent.role !== 'string') {
        errors.push('Missing or invalid "respondent.role" field')
      }
    }

    if (!Array.isArray(sentimentScores) || sentimentScores.length < 2) {
      errors.push('Missing or invalid "sentimentScores" array')
    }

    if (!Array.isArray(qualitative) || qualitative.length === 0) {
      errors.push('Missing or invalid "qualitative" array')
    }

    if (!summary || typeof summary !== 'object') {
      errors.push('Missing or invalid "summary" field')
    } else {
      if (!summary.avg || typeof summary.avg !== 'string') {
        errors.push('Missing or invalid "summary.avg" field')
      }
      if (!summary.text || typeof summary.text !== 'string') {
        errors.push('Missing or invalid "summary.text" field')
      }
    }

    if (!capturedAt || typeof capturedAt !== 'string') {
      errors.push('Missing or invalid "capturedAt" timestamp')
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Insight data received successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error processing submission', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing the submission',
    })
  }
}

