/**
 * Tests for AI_sentiment survey component
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../AI_sentiment'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Terminal: () => <div data-testid="terminal-icon">Terminal</div>,
  Cpu: () => <div data-testid="cpu-icon">Cpu</div>,
  Shield: () => <div data-testid="shield-icon">Shield</div>,
  Send: () => <div data-testid="send-icon">Send</div>,
  Activity: () => <div data-testid="activity-icon">Activity</div>,
  ChevronRight: () => <div data-testid="chevron-icon">ChevronRight</div>,
  User: () => <div data-testid="user-icon">User</div>,
  GitBranch: () => <div data-testid="gitbranch-icon">GitBranch</div>,
  Layers: () => <div data-testid="layers-icon">Layers</div>,
  CheckCircle: () => <div data-testid="checkcircle-icon">CheckCircle</div>,
  RefreshCw: () => <div data-testid="refresh-icon">RefreshCw</div>,
}))

describe('AI_sentiment Survey Component', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Landing Page (Step 0)', () => {
    it('should render landing page with start button', () => {
      render(<App />)
      
      expect(screen.getByText(/VALICY.AI INITIATIVE/i)).toBeInTheDocument()
      expect(screen.getByText(/Sentiment Calibration Protocol/i)).toBeInTheDocument()
      expect(screen.getByText(/START DATA UPLOAD/i)).toBeInTheDocument()
    })

    it('should navigate to step 1 when start button is clicked', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      const startButton = screen.getByText(/START DATA UPLOAD/i)
      await user.click(startButton)

      expect(screen.getByText(/ACCESS LEVEL \(DEPARTMENT\)/i)).toBeInTheDocument()
    })
  })

  describe('Step 1: Identity/Department', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      render(<App />)
      const startButton = screen.getByText(/START DATA UPLOAD/i)
      await user.click(startButton)
    })

    it('should render department selection buttons', () => {
      expect(screen.getByText('Engineering')).toBeInTheDocument()
      expect(screen.getByText('Design')).toBeInTheDocument()
      expect(screen.getByText('Marketing')).toBeInTheDocument()
      expect(screen.getByText('Operations')).toBeInTheDocument()
    })

    it('should allow selecting a department', async () => {
      const user = userEvent.setup()
      const engineeringButton = screen.getByText('Engineering')
      
      await user.click(engineeringButton)
      
      // Check that the button is selected (has active styling)
      expect(engineeringButton).toHaveClass('bg-green-500/30')
    })

    it('should render role input field', () => {
      const roleInput = screen.getByPlaceholderText(/ENTER ROLE TITLE/i)
      expect(roleInput).toBeInTheDocument()
    })

    it('should allow entering role', async () => {
      const user = userEvent.setup()
      const roleInput = screen.getByPlaceholderText(/ENTER ROLE TITLE/i)
      
      await user.type(roleInput, 'Software Engineer')
      
      expect(roleInput).toHaveValue('Software Engineer')
    })

    it('should disable next button when department and role are not filled', () => {
      const nextButton = screen.getByText(/NEXT: CALIBRATE LIKERT SCORES/i)
      expect(nextButton).toBeDisabled()
    })

    it('should enable next button when department and role are filled', async () => {
      const user = userEvent.setup()
      
      await user.click(screen.getByText('Engineering'))
      await user.type(screen.getByPlaceholderText(/ENTER ROLE TITLE/i), 'Engineer')
      
      const nextButton = screen.getByText(/NEXT: CALIBRATE LIKERT SCORES/i)
      expect(nextButton).not.toBeDisabled()
    })

    it('should navigate to step 2 when next is clicked with valid data', async () => {
      const user = userEvent.setup()
      
      await user.click(screen.getByText('Engineering'))
      await user.type(screen.getByPlaceholderText(/ENTER ROLE TITLE/i), 'Engineer')
      
      const nextButton = screen.getByText(/NEXT: CALIBRATE LIKERT SCORES/i)
      await user.click(nextButton)

      expect(screen.getByText(/RATING MATRIX: Core Sentiment Vectors/i)).toBeInTheDocument()
    })
  })

  describe('Step 2: Likert Scores', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      render(<App />)
      
      // Navigate through steps
      await user.click(screen.getByText(/START DATA UPLOAD/i))
      await user.click(screen.getByText('Engineering'))
      await user.type(screen.getByPlaceholderText(/ENTER ROLE TITLE/i), 'Engineer')
      await user.click(screen.getByText(/NEXT: CALIBRATE LIKERT SCORES/i))
    })

    it('should render all 5 Likert questions', () => {
      expect(screen.getByText(/Level of optimism on AI pipeline integration/i)).toBeInTheDocument()
      expect(screen.getByText(/Expected speedup of specific daily tasks/i)).toBeInTheDocument()
      expect(screen.getByText(/Concern level: AI replacing creative aspects/i)).toBeInTheDocument()
      expect(screen.getByText(/Confidence level: AI-generated quality standards/i)).toBeInTheDocument()
      expect(screen.getByText(/Concern level: Copyright and ethical implications/i)).toBeInTheDocument()
    })

    it('should render score buttons (1-5) for each question', () => {
      const scoreButtons = screen.getAllByText('1')
      expect(scoreButtons.length).toBeGreaterThan(0)
      
      // Check that we have buttons for 1-5
      expect(screen.getAllByText('5').length).toBeGreaterThan(0)
    })

    it('should allow selecting scores for each question', async () => {
      const user = userEvent.setup()
      
      // Find and click score 4 for the first question
      const scoreButtons = screen.getAllByText('4')
      await user.click(scoreButtons[0])
      
      // The button should be selected (have active styling)
      expect(scoreButtons[0]).toHaveClass('bg-green-500')
    })

    it('should disable next button when not all questions are answered', () => {
      const nextButton = screen.getByText(/NEXT: QUALITATIVE FEEDBACK/i)
      expect(nextButton).toBeDisabled()
    })

    it('should enable next button when all questions are answered', async () => {
      const user = userEvent.setup()
      
      // Answer all 5 questions
      const questions = [
        'optimism',
        'efficiency',
        'security',
        'quality',
        'ethics',
      ]
      
      for (let i = 0; i < questions.length; i++) {
        const scoreButtons = screen.getAllByText('3')
        await user.click(scoreButtons[i])
      }
      
      const nextButton = screen.getByText(/NEXT: QUALITATIVE FEEDBACK/i)
      expect(nextButton).not.toBeDisabled()
    })
  })

  describe('Step 3: Qualitative Feedback', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      render(<App />)
      
      // Navigate through steps
      await user.click(screen.getByText(/START DATA UPLOAD/i))
      await user.click(screen.getByText('Engineering'))
      await user.type(screen.getByPlaceholderText(/ENTER ROLE TITLE/i), 'Engineer')
      await user.click(screen.getByText(/NEXT: CALIBRATE LIKERT SCORES/i))
      
      // Answer all Likert questions
      for (let i = 0; i < 5; i++) {
        const scoreButtons = screen.getAllByText('3')
        await user.click(scoreButtons[i])
      }
      await user.click(screen.getByText(/NEXT: QUALITATIVE FEEDBACK/i))
    })

    it('should render all 3 text input fields', () => {
      expect(screen.getByText(/TARGETED ASSISTANCE \(TASK\)/i)).toBeInTheDocument()
      expect(screen.getByText(/HESITATION\/ROADBLOCKS/i)).toBeInTheDocument()
      expect(screen.getByText(/#1 HYPOTHETICAL ASK/i)).toBeInTheDocument()
    })

    it('should allow entering text in useCases field', async () => {
      const user = userEvent.setup()
      const textarea = screen.getByPlaceholderText(/Describe one specific task/i)
      
      await user.type(textarea, 'Code review assistance')
      
      expect(textarea).toHaveValue('Code review assistance')
    })

    it('should allow entering text in roadblocks field', async () => {
      const user = userEvent.setup()
      const textarea = screen.getByPlaceholderText(/What is your biggest fear/i)
      
      await user.type(textarea, 'Privacy concerns')
      
      expect(textarea).toHaveValue('Privacy concerns')
    })

    it('should allow entering text in blueSky field', async () => {
      const user = userEvent.setup()
      const textarea = screen.getByPlaceholderText(/If you had a perfect AI assistant/i)
      
      await user.type(textarea, 'Automate testing')
      
      expect(textarea).toHaveValue('Automate testing')
    })

    it('should disable next button when required fields are not filled', () => {
      const nextButton = screen.getByText(/NEXT: TRANSMIT DATA/i)
      expect(nextButton).toBeDisabled()
    })

    it('should enable next button when required fields are filled', async () => {
      const user = userEvent.setup()
      
      await user.type(screen.getByPlaceholderText(/Describe one specific task/i), 'Task')
      await user.type(screen.getByPlaceholderText(/What is your biggest fear/i), 'Fear')
      
      const nextButton = screen.getByText(/NEXT: TRANSMIT DATA/i)
      expect(nextButton).not.toBeDisabled()
    })
  })

  describe('Step 4: Submission', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      render(<App />)
      
      // Navigate through all steps
      await user.click(screen.getByText(/START DATA UPLOAD/i))
      await user.click(screen.getByText('Engineering'))
      await user.type(screen.getByPlaceholderText(/ENTER ROLE TITLE/i), 'Engineer')
      await user.click(screen.getByText(/NEXT: CALIBRATE LIKERT SCORES/i))
      
      // Answer all Likert questions
      for (let i = 0; i < 5; i++) {
        const scoreButtons = screen.getAllByText('3')
        await user.click(scoreButtons[i])
      }
      await user.click(screen.getByText(/NEXT: QUALITATIVE FEEDBACK/i))
      
      // Fill text fields
      await user.type(screen.getByPlaceholderText(/Describe one specific task/i), 'Task')
      await user.type(screen.getByPlaceholderText(/What is your biggest fear/i), 'Fear')
      await user.click(screen.getByText(/NEXT: TRANSMIT DATA/i))
    })

    it('should render final data review section', () => {
      expect(screen.getByText(/FINAL DATA REVIEW/i)).toBeInTheDocument()
      expect(screen.getByText(/LIKERT FIELDS \(5\):/i)).toBeInTheDocument()
      expect(screen.getByText(/TEXT FIELDS \(3\):/i)).toBeInTheDocument()
    })

    it('should show transmit button', () => {
      expect(screen.getByText(/TRANSMIT FINAL DATA/i)).toBeInTheDocument()
    })

    it('should submit data successfully', async () => {
      const user = userEvent.setup()
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Insight data received successfully',
          timestamp: new Date().toISOString(),
        }),
      })

      const transmitButton = screen.getByText(/TRANSMIT FINAL DATA/i)
      await user.click(transmitButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.any(String),
        })
      })
    })

    it('should handle submission error', async () => {
      const user = userEvent.setup()
      
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      const transmitButton = screen.getByText(/TRANSMIT FINAL DATA/i)
      await user.click(transmitButton)

      await waitFor(() => {
        expect(screen.getByText(/Unable to sync to admin dashboard/i)).toBeInTheDocument()
      })
    })

    it('should handle API error response', async () => {
      const user = userEvent.setup()
      
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      })

      const transmitButton = screen.getByText(/TRANSMIT FINAL DATA/i)
      await user.click(transmitButton)

      await waitFor(() => {
        expect(screen.getByText(/Unable to sync to admin dashboard/i)).toBeInTheDocument()
      })
    })
  })

  describe('Step 5: Success Screen', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      render(<App />)
      
      // Navigate through all steps and submit
      await user.click(screen.getByText(/START DATA UPLOAD/i))
      await user.click(screen.getByText('Engineering'))
      await user.type(screen.getByPlaceholderText(/ENTER ROLE TITLE/i), 'Engineer')
      await user.click(screen.getByText(/NEXT: CALIBRATE LIKERT SCORES/i))
      
      for (let i = 0; i < 5; i++) {
        const scoreButtons = screen.getAllByText('3')
        await user.click(scoreButtons[i])
      }
      await user.click(screen.getByText(/NEXT: QUALITATIVE FEEDBACK/i))
      
      await user.type(screen.getByPlaceholderText(/Describe one specific task/i), 'Task')
      await user.type(screen.getByPlaceholderText(/What is your biggest fear/i), 'Fear')
      await user.click(screen.getByText(/NEXT: TRANSMIT DATA/i))
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Insight data received successfully',
          timestamp: new Date().toISOString(),
        }),
      })

      await user.click(screen.getByText(/TRANSMIT FINAL DATA/i))
    })

    it('should render success screen after submission', async () => {
      await waitFor(() => {
        expect(screen.getByText(/TRANSMISSION RECEIVED/i)).toBeInTheDocument()
      })
    })

    it('should display department in summary', async () => {
      await waitFor(() => {
        expect(screen.getByText(/ENGINEERING/i)).toBeInTheDocument()
      })
    })

    it('should display average sentiment', async () => {
      await waitFor(() => {
        expect(screen.getByText(/AVG SENTIMENT:/i)).toBeInTheDocument()
      })
    })

    it('should have end session button', async () => {
      await waitFor(() => {
        expect(screen.getByText(/END SESSION/i)).toBeInTheDocument()
      })
    })

    it('should reset form when end session is clicked', async () => {
      const user = userEvent.setup()
      
      await waitFor(() => {
        const endSessionButton = screen.getByText(/END SESSION/i)
        expect(endSessionButton).toBeInTheDocument()
      })
      
      const endSessionButton = screen.getByText(/END SESSION/i)
      await user.click(endSessionButton)

      // Should return to landing page
      expect(screen.getByText(/START DATA UPLOAD/i)).toBeInTheDocument()
    })
  })

  describe('Step Indicator', () => {
    it('should show step indicator on survey steps', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await user.click(screen.getByText(/START DATA UPLOAD/i))
      
      // Step indicator should be visible (it's a div with multiple child divs)
      const stepIndicators = document.querySelectorAll('.h-2')
      expect(stepIndicators.length).toBeGreaterThan(0)
    })
  })
})

