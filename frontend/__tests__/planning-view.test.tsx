import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PlanningView } from '@/components/planning-view'
import { NextIntlClientProvider } from 'next-intl';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children
}));

// Mock api call
jest.mock('@/lib/api', () => ({
  generateStudyPlan: jest.fn(() => Promise.resolve({
    plan: [
      { date: "2023-11-01", topic: "Topic 1", activity: "Read", duration: "1h", description: "Start here" }
    ]
  }))
}));

describe('PlanningView', () => {
  const mockTopics = ["Topic 1", "Topic 2"];

  it('renders form initially', () => {
    render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <PlanningView topics={mockTopics} locale="en" />
      </NextIntlClientProvider>
    );
    
    expect(screen.getByText('configure_title')).toBeInTheDocument(); // Title key mocked
    expect(screen.getByRole('button', { name: 'generate_button' })).toBeInTheDocument();
  });

  it('generates and displays plan', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <PlanningView topics={mockTopics} locale="en" />
      </NextIntlClientProvider>
    );
    
    const button = screen.getByRole('button', { name: 'generate_button' });
    const dateInput = screen.getByLabelText('exam_date');
    
    fireEvent.change(dateInput, { target: { value: '2023-11-01' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Topic 1')).toBeInTheDocument();
      expect(screen.getByText('Read')).toBeInTheDocument();
    });
  });
});

