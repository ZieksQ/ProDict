import { useNavigate } from 'react-router-dom';
import { IoPencil, IoTrash } from 'react-icons/io5';
import { DropdownMenu } from './DropdownMenu';
import type { Term } from '../types';
import './TermCard.css';

interface TermCardProps {
  term: Term;
  onEdit: (term: Term) => void;
  onDelete: (term: Term) => void;
}

export function TermCard({ term, onEdit, onDelete }: TermCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/terms/${term.id}`);
  };

  const menuItems = [
    {
      label: 'Edit',
      icon: <IoPencil size={16} />,
      onClick: () => onEdit(term),
    },
    {
      label: 'Delete',
      icon: <IoTrash size={16} />,
      onClick: () => onDelete(term),
      variant: 'danger' as const,
    },
  ];

  return (
    <div className="term-card" onClick={handleClick}>
      <div className="term-card__content">
        <h3 className="term-card__name">{term.name}</h3>
        <span className="term-card__group">{term.group}</span>
      </div>
      <DropdownMenu items={menuItems} />
    </div>
  );
}
