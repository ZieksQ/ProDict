import { useState, useEffect } from 'react';
import { termsService } from '../services/terms.service';
import { groupsService } from '../services/groups.service';
import type { Group, Term, TermCreateRequest } from '../types';
import './AddTermModal.css';

interface EditTermModalProps {
  isOpen: boolean;
  term: Term | null;
  onClose: () => void;
  onTermUpdated: () => void;
}

export function EditTermModal({ isOpen, term, onClose, onTermUpdated }: EditTermModalProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<TermCreateRequest>({
    name: '',
    groupId: 0,
    description: '',
    referenceLinks: '',
  });

  useEffect(() => {
    if (isOpen) {
      groupsService.getAll().then(setGroups).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (term) {
      setFormData({
        name: term.name,
        groupId: term.groupId || 0,
        description: term.description || '',
        referenceLinks: term.referenceLinks || '',
      });
    }
  }, [term]);

  // Set groupId from term or first group
  useEffect(() => {
    if (groups.length > 0 && formData.groupId === 0) {
      const termGroup = groups.find(g => g.name === term?.group);
      setFormData(prev => ({ ...prev, groupId: termGroup?.id || groups[0].id }));
    }
  }, [groups, formData.groupId, term?.group]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'groupId' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!term) return;

    setIsLoading(true);
    setError(null);

    try {
      const payload: TermCreateRequest = {
        ...formData,
        description: formData.description || null,
        referenceLinks: formData.referenceLinks || null,
      };
      
      await termsService.update(term.id, payload);
      onTermUpdated();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message: string }).message);
      } else if (err && typeof err === 'object' && 'errors' in err) {
        const errors = (err as { errors: Record<string, string[]> }).errors;
        setError(Object.values(errors).flat().join(', '));
      } else {
        setError('Failed to update term');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen || !term) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__header">
          <h2>Edit Term</h2>
          <button className="modal__close" onClick={handleClose}>×</button>
        </header>

        <form onSubmit={handleSubmit} className="modal__form">
          {error && <p className="modal__error">{error}</p>}

          <div className="form-group">
            <label htmlFor="edit-name">Name *</label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter term name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-groupId">Group *</label>
            <select
              id="edit-groupId"
              name="groupId"
              value={formData.groupId}
              onChange={handleChange}
              required
            >
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="edit-description">Description</label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Enter description (max 500 characters)"
              maxLength={500}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-referenceLinks">Reference Link</label>
            <input
              type="url"
              id="edit-referenceLinks"
              name="referenceLinks"
              value={formData.referenceLinks || ''}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          <footer className="modal__actions">
            <button type="button" onClick={handleClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
