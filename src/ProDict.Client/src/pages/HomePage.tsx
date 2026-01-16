import { useState, useEffect, useCallback } from 'react';
import { TermCard } from '../components/TermCard';
import { SearchBar } from '../components/SearchBar';
import { AddTermModal } from '../components/AddTermModal';
import { termsService } from '../services/terms.service';
import type { Term } from '../types';
import './HomePage.css';

export default function HomePage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTerms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await termsService.getAll(search || undefined);
      setTerms(data);
    } catch (err) {
      setError('Failed to load terms');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTerms();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchTerms]);

  const handleTermAdded = () => {
    setIsModalOpen(false);
    fetchTerms();
  };

  return (
    <div className="home-page">
      <header className="home-page__header">
        <h1>ProDict</h1>
        <p className="home-page__subtitle">Your Programming Dictionary</p>
      </header>

      <div className="home-page__actions">
        <SearchBar value={search} onChange={setSearch} />
        <button 
          className="home-page__add-btn"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Term
        </button>
      </div>

      {isLoading && <p className="home-page__status">Loading...</p>}
      
      {error && <p className="home-page__status home-page__status--error">{error}</p>}

      {!isLoading && !error && terms.length === 0 && (
        <p className="home-page__status">No terms found. Add your first term!</p>
      )}

      <div className="home-page__terms-list">
        {terms.map((term) => (
          <TermCard key={term.id} term={term} />
        ))}
      </div>

      <AddTermModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTermAdded={handleTermAdded}
      />
    </div>
  );
}
