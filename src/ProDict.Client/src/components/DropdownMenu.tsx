import { useState, useRef, useEffect } from 'react';
import { IoEllipsisVertical } from 'react-icons/io5';
import './DropdownMenu.css';

export interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
}

export function DropdownMenu({ items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleItemClick = (e: React.MouseEvent, onClick: () => void) => {
    e.stopPropagation();
    onClick();
    setIsOpen(false);
  };

  return (
    <div className={`dropdown-menu ${isOpen ? 'dropdown-menu--open' : ''}`} ref={menuRef}>
      <button
        className="dropdown-menu__trigger"
        onClick={handleToggle}
        aria-label="More options"
      >
        <IoEllipsisVertical size={20} />
      </button>

      {isOpen && (
        <div className="dropdown-menu__content">
          {items.map((item, index) => (
            <button
              key={index}
              className={`dropdown-menu__item ${item.variant === 'danger' ? 'dropdown-menu__item--danger' : ''}`}
              onClick={(e) => handleItemClick(e, item.onClick)}
            >
              {item.icon && <span className="dropdown-menu__item-icon">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
