import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChatInterface } from '@/components/chat-interface'
import { NextIntlClientProvider } from 'next-intl';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children
}));

// Mock api call
jest.mock('@/lib/api', () => ({
  chatWithAI: jest.fn(() => Promise.resolve({ response: "C'est la centrale énergétique." }))
}));

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('ChatInterface', () => {
  const mockContext = "Course content...";

  it('renders input and send button', () => {
    render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <ChatInterface context={mockContext} />
      </NextIntlClientProvider>
    );
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('sends a message and displays response', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <ChatInterface context={mockContext} />
      </NextIntlClientProvider>
    );
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'What is a mitochondria?' } });
    fireEvent.click(button);
    
    // Check if message appears
    expect(screen.getByText('What is a mitochondria?')).toBeInTheDocument();
    
    // Check if loading state appears (optional, but good practice)
    
    // Check if response appears
    await waitFor(() => {
      expect(screen.getByText("C'est la centrale énergétique.")).toBeInTheDocument();
    });
  });
});

