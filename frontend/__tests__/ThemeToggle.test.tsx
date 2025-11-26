import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../components/theme-toggle';
import { useTheme } from 'next-themes';

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('ThemeToggle', () => {
  it('toggles between light and dark mode', () => {
    const setThemeMock = jest.fn();
    
    useTheme.mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });
});
