import { useState, useEffect } from 'react';
import { termsService } from '../services/terms.service';
import { groupsService } from '../services/groups.service';
import type { Group, TermCreateRequest } from '../types';
import './AddTermModal.css';

interface AddTermModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTermAdded: () => void;
}

export function AddTermModal({ isOpen, onClose, onTermAdded }: AddTermModalProps) {
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
    if (groups.length > 0 && formData.groupId === 0) {
      setFormData(prev => ({ ...prev, groupId: groups[0].id }));
    }
  }, [groups, formData.groupId]);

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
    setIsLoading(true);
    setError(null);

    try {
      const payload: TermCreateRequest = {
        ...formData,
        description: formData.description || null,
        referenceLinks: formData.referenceLinks || null,
      };
      
      await termsService.create(payload);
      setFormData({
        name: '',
        groupId: groups[0]?.id || 0,
        description: '',
        referenceLinks: '',
      });
      onTermAdded();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message: string }).message);
      } else if (err && typeof err === 'object' && 'errors' in err) {
        const errors = (err as { errors: Record<string, string[]> }).errors;
        setError(Object.values(errors).flat().join(', '));
      } else {
        setError('Failed to create term');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__header">
          <h2>Add New Term</h2>
          <button className="modal__close" onClick={onClose}>×</button>
        </header>

        <form onSubmit={handleSubmit} className="modal__form">
          {error && <p className="modal__error">{error}</p>}

          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter term name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="groupId">Group *</label>
            <select
              id="groupId"
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
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Enter description (max 500 characters)"
              maxLength={500}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="referenceLinks">Reference Link</label>
            <input
              type="url"
              id="referenceLinks"
              name="referenceLinks"
              value={formData.referenceLinks || ''}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          <footer className="modal__actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Creating...' : 'Create Term'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
