import { useState, useEffect, useCallback } from 'react';
import { IoAdd } from 'react-icons/io5';
import { TermCard } from '../components/TermCard';
import { SearchBar } from '../components/SearchBar';
import { AddTermModal } from '../components/AddTermModal';
import { EditTermModal } from '../components/EditTermModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { ThemeToggle } from '../components/ThemeToggle';
import { GroupsList } from '../components/GroupsList';
import { termsService } from '../services/terms.service';
import type { Term } from '../types';
import './HomePage.css';

export default function HomePage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Edit and Delete states
  const [termToEdit, setTermToEdit] = useState<Term | null>(null);
  const [termToDelete, setTermToDelete] = useState<Term | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setIsAddModalOpen(false);
    fetchTerms();
  };

  const handleTermUpdated = () => {
    setTermToEdit(null);
    fetchTerms();
  };

  const handleDeleteConfirm = async () => {
    if (!termToDelete) return;
    
    setIsDeleting(true);
    try {
      await termsService.delete(termToDelete.id);
      setTermToDelete(null);
      fetchTerms();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="home-page">
      <header className="home-page__header">
        <div className="home-page__title-wrapper">
          <h1>ProDict</h1>
          <ThemeToggle />
        </div>
        <p className="home-page__subtitle">Your Programming Dictionary</p>
      </header>

      <div className="home-page__content">
        <main className="home-page__main">
          <div className="home-page__actions">
            <SearchBar value={search} onChange={setSearch} />
            <button 
              className="home-page__add-btn"
              onClick={() => setIsAddModalOpen(true)}
            >
              <IoAdd size={20} />
              Add Term
            </button>
          </div>

          {isLoading && <p className="home-page__status">Loading...</p>}
          
          {error && <p className="home-page__status home-page__status--error">{error}</p>}

          {!isLoading && !error && terms.length === 0 && (
            <p className="home-page__status">No terms found. Add your first term!</p>
          )}

          <div className="home-page__terms-list">
            {terms.map((term) => (
              <TermCard 
                key={term.id} 
                term={term}
                onEdit={setTermToEdit}
                onDelete={setTermToDelete}
              />
            ))}
          </div>
        </main>

        <aside className="home-page__sidebar">
          <GroupsList onGroupsChange={fetchTerms} />
        </aside>
      </div>

      <AddTermModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTermAdded={handleTermAdded}
      />

      <EditTermModal
        isOpen={!!termToEdit}
        term={termToEdit}
        onClose={() => setTermToEdit(null)}
        onTermUpdated={handleTermUpdated}
      />

      <ConfirmModal
        isOpen={!!termToDelete}
        title="Delete Term"
        message={`Are you sure you want to delete "${termToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTermToDelete(null)}
      />
    </div>
  );
}
