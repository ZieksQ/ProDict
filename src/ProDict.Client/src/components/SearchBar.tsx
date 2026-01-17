import { IoSearch } from 'react-icons/io5';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search terms...' }: SearchBarProps) {
  return (
    <div className="search-bar">
      <IoSearch className="search-bar__icon" />
      <input
        type="text"
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
