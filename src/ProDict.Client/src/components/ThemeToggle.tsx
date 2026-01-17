import { useTheme } from '../context/ThemeContext';
import { IoSunny, IoMoon } from 'react-icons/io5';
import './ThemeToggle.css';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <IoMoon className="theme-toggle__icon" /> : <IoSunny className="theme-toggle__icon" />}
    </button>
  );
}
