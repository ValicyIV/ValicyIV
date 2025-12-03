/**
 * Test utilities and helpers
 */

/**
 * Creates a mock fetch response
 * @param {Object} data - Response data
 * @param {number} status - HTTP status code
 * @returns {Promise} Mock fetch response
 */
export const createMockFetchResponse = (data, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  })
}

/**
 * Creates a mock fetch error
 * @param {string} message - Error message
 * @returns {Promise} Mock fetch error
 */
export const createMockFetchError = (message = 'Network error') => {
  return Promise.reject(new Error(message))
}

/**
 * Waits for a specified amount of time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise}
 */
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Valid survey payload for testing
 */
export const validSurveyPayload = {
  respondent: {
    department: 'Engineering',
    role: 'Software Engineer',
  },
  sentimentScores: [
    { id: 'optimism', question: 'Level of optimism on AI pipeline integration (1=Low, 5=High)', score: 4 },
    { id: 'efficiency', question: 'Expected speedup of specific daily tasks (1=None, 5=Significant)', score: 5 },
    { id: 'security', question: 'Concern level: AI replacing creative aspects (1=Low, 5=High)', score: 3 },
    { id: 'quality', question: 'Confidence level: AI-generated quality standards (1=Low, 5=High)', score: 4 },
    { id: 'ethics', question: 'Concern level: Copyright and ethical implications (1=Low, 5=High)', score: 2 },
  ],
  qualitative: [
    { id: 'useCases', label: 'TARGETED ASSISTANCE (TASK)', response: 'Code review assistance' },
    { id: 'roadblocks', label: 'HESITATION/ROADBLOCKS', response: 'Privacy and security concerns' },
    { id: 'blueSky', label: '#1 HYPOTHETICAL ASK', response: 'Automate testing workflows' },
  ],
  summary: {
    avg: '3.6',
    text: 'MODERATE ALIGNMENT',
  },
  capturedAt: new Date().toISOString(),
}

