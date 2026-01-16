import { useNavigate } from 'react-router-dom';
import type { Term } from '../types';
import './TermCard.css';

interface TermCardProps {
  term: Term;
}

export function TermCard({ term }: TermCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/terms/${term.id}`);
  };

  return (
    <div className="term-card" onClick={handleClick}>
      <h3 className="term-card__name">{term.name}</h3>
      <span className="term-card__group">{term.group}</span>
    </div>
  );
}
