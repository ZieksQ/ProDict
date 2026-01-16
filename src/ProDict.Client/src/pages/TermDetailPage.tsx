import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { termsService } from '../services/terms.service';
import type { Term } from '../types';
import './TermDetailPage.css';

export default function TermDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [term, setTerm] = useState<Term | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerm = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await termsService.getById(Number(id));
        setTerm(data);
      } catch (err) {
        setError('Term not found');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerm();
  }, [id]);

  const handleBack = () => {
    navigate('/');
  };

  const handleDelete = async () => {
    if (!term || !confirm('Are you sure you want to delete this term?')) return;
    
    try {
      await termsService.delete(term.id);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete term:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="term-detail-page">
        <button className="term-detail-page__back" onClick={handleBack}>
          ← Back
        </button>
        <p className="term-detail-page__status">Loading...</p>
      </div>
    );
  }

  if (error || !term) {
    return (
      <div className="term-detail-page">
        <button className="term-detail-page__back" onClick={handleBack}>
          ← Back
        </button>
        <p className="term-detail-page__status term-detail-page__status--error">
          {error || 'Term not found'}
        </p>
      </div>
    );
  }

  return (
    <div className="term-detail-page">
      <button className="term-detail-page__back" onClick={handleBack}>
        ← Back
      </button>

      <article className="term-detail">
        <header className="term-detail__header">
          <h1 className="term-detail__name">{term.name}</h1>
          <span className="term-detail__group">{term.group}</span>
        </header>

        <section className="term-detail__section">
          <h2>Description</h2>
          <p className="term-detail__description">
            {term.description || 'No description provided.'}
          </p>
        </section>

        {term.referenceLinks && (
          <section className="term-detail__section">
            <h2>Reference</h2>
            <a 
              href={term.referenceLinks} 
              target="_blank" 
              rel="noopener noreferrer"
              className="term-detail__link"
            >
              {term.referenceLinks}
            </a>
          </section>
        )}

        <footer className="term-detail__actions">
          <button 
            className="term-detail__delete-btn"
            onClick={handleDelete}
          >
            Delete Term
          </button>
        </footer>
      </article>
    </div>
  );
}
