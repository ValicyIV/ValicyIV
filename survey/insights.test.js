/**
 * Tests for /api/insights endpoint
 */
import { createMocks } from 'node-mocks-http'
import handler from './insights'

describe('/api/insights', () => {
  const validPayload = {
    respondent: {
      department: 'Engineering',
      role: 'Software Engineer',
    },
    sentimentScores: [
      { id: 'optimism', question: 'Level of optimism', score: 4 },
      { id: 'efficiency', question: 'Expected speedup', score: 5 },
    ],
    qualitative: [
      { id: 'useCases', label: 'TARGETED ASSISTANCE', response: 'Code review' },
      { id: 'roadblocks', label: 'HESITATION', response: 'Privacy concerns' },
    ],
    summary: {
      avg: '4.5',
      text: 'HIGH ALIGNMENT',
    },
    capturedAt: new Date().toISOString(),
  }

  describe('POST requests', () => {
    it('should accept valid payload and return 200', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: validPayload,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(true)
      expect(data.message).toBe('Insight data received successfully')
      expect(data.timestamp).toBeDefined()
    })

    it('should reject request with missing body', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: null,
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toBe('Bad request')
      expect(data.message).toBe('Request body is required')
    })

    it('should reject request with missing respondent', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          ...validPayload,
          respondent: null,
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toBe('Validation failed')
      expect(data.details).toContain('Missing or invalid "respondent" field')
    })

    it('should reject request with missing department', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          ...validPayload,
          respondent: {
            role: 'Software Engineer',
          },
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.details).toContain('Missing or invalid "respondent.department" field')
    })

    it('should reject request with missing role', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          ...validPayload,
          respondent: {
            department: 'Engineering',
          },
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.details).toContain('Missing or invalid "respondent.role" field')
    })

    it('should reject request with missing sentimentScores', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          ...validPayload,
          sentimentScores: null,
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.details).toContain('Missing or invalid "sentimentScores" array')
    })

    it('should reject request with missing qualitative', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          ...validPayload,
          qualitative: null,
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.details).toContain('Missing or invalid "qualitative" array')
    })

    it('should reject request with missing summary', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          ...validPayload,
          summary: null,
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.details).toContain('Missing or invalid "summary" field')
    })

    it('should reject request with missing summary.avg', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          ...validPayload,
          summary: {
            text: 'HIGH ALIGNMENT',
          },
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.details).toContain('Missing or invalid "summary.avg" field')
    })

    it('should reject request with missing summary.text', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          ...validPayload,
          summary: {
            avg: '4.5',
          },
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.details).toContain('Missing or invalid "summary.text" field')
    })

    it('should reject request with missing capturedAt', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          ...validPayload,
          capturedAt: null,
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.details).toContain('Missing or invalid "capturedAt" timestamp')
    })

    it('should handle multiple validation errors', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          respondent: {},
          sentimentScores: null,
          qualitative: null,
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.details.length).toBeGreaterThan(1)
    })
  })

  describe('Non-POST requests', () => {
    it('should reject GET requests', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
      const data = JSON.parse(res._getData())
      expect(data.error).toBe('Method not allowed')
      expect(data.message).toBe('Only POST requests are supported')
    })

    it('should reject PUT requests', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
    })

    it('should reject DELETE requests', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
    })
  })

  describe('Error handling', () => {
    it('should handle unexpected errors gracefully', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const { req, res } = createMocks({
        method: 'POST',
        body: validPayload,
      })

      // Force an error by corrupting the request object
      req.body = undefined
      Object.defineProperty(req, 'body', {
        get: () => {
          throw new Error('Unexpected error')
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      const data = JSON.parse(res._getData())
      expect(data.error).toBe('Internal server error')
      expect(data.message).toBe('An error occurred while processing the submission')

      consoleSpy.mockRestore()
    })
  })
})

