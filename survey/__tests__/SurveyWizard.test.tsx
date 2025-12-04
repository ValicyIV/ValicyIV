import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SurveyWizard from '../components/SurveyWizard';

global.fetch = jest.fn();

describe('SurveyWizard', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: () => Promise.resolve({ success: true }) });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('walks through the survey steps and submits', async () => {
    const user = userEvent.setup();
    render(<SurveyWizard />);

    await user.click(screen.getByText('Engineering'));
    await user.click(screen.getByText('Remote'));
    await user.type(screen.getByPlaceholderText('e.g. Staff Engineer'), 'Engineer');
    await user.click(screen.getByText('1-3 years'));

    await user.click(screen.getByText('Continue'));

    const firstLikert = screen.getAllByLabelText(/score 3$/i)[0];
    await user.click(firstLikert);
    await user.click(screen.getAllByLabelText(/score 4$/i)[1]);
    await user.click(screen.getAllByLabelText(/score 4$/i)[2]);
    await user.click(screen.getAllByLabelText(/score 5$/i)[3]);
    await user.click(screen.getAllByLabelText(/score 5$/i)[4]);

    await user.click(screen.getByText('Continue'));

    await user.click(screen.getAllByText('Yes')[0]);
    await user.click(screen.getAllByText('Yes')[1]);

    await user.click(screen.getByText('Continue'));

    await user.type(screen.getByPlaceholderText(/most time/i), 'We need automated regression triage');
    await user.type(screen.getByPlaceholderText(/go wrong/i), 'Data leakage and hallucinations');
    await user.type(screen.getByPlaceholderText(/guardrails/i), 'Hands-on labs with red-team playbooks');

    await user.click(screen.getByText('Send responses'));

    await waitFor(() => {
      expect(screen.getByText(/Submission complete/i)).toBeInTheDocument();
    });
  });

  it('shows validation error if required fields missing', async () => {
    const user = userEvent.setup();
    render(<SurveyWizard />);

    await user.click(screen.getByText('Continue'));

    expect(screen.getByText(/complete the required inputs/i)).toBeInTheDocument();
  });
});
