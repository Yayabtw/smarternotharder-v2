import { renderHook, act } from '@testing-library/react';
import { useGamification, GamificationProvider } from '@/contexts/gamification-context';

// Mock localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: function(key: string) {
      return store[key] || null;
    },
    setItem: function(key: string, value: string) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
    removeItem: function(key: string) {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useGamification', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GamificationProvider>{children}</GamificationProvider>
  );

  it('initializes with default values', () => {
    const { result } = renderHook(() => useGamification(), { wrapper });
    
    expect(result.current.xp).toBe(0);
    expect(result.current.level).toBe(1);
  });

  it('adds XP and updates level', () => {
    const { result } = renderHook(() => useGamification(), { wrapper });
    
    act(() => {
      result.current.addXp(50);
    });
    
    expect(result.current.xp).toBe(50);
    expect(result.current.level).toBe(1);

    // Level up logic
    act(() => {
      result.current.addXp(60); // Total 110
    });
    
    expect(result.current.xp).toBe(110);
    expect(result.current.level).toBe(2);
  });
});
