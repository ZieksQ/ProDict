import { useState } from 'react';
import { groupsService } from '../services/groups.service';
import type { GroupCreateRequest } from '../types';
import './AddTermModal.css'; // Reusing the same modal styles

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupAdded: () => void;
}

export function AddGroupModal({ isOpen, onClose, onGroupAdded }: AddGroupModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Group name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload: GroupCreateRequest = { name: name.trim() };
      await groupsService.create(payload);
      setName('');
      onGroupAdded();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message: string }).message);
      } else if (err && typeof err === 'object' && 'errors' in err) {
        const errors = (err as { errors: Record<string, string[]> }).errors;
        setError(Object.values(errors).flat().join(', '));
      } else {
        setError('Failed to create group');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__header">
          <h2>Add New Group</h2>
          <button className="modal__close" onClick={handleClose}>×</button>
        </header>

        <form onSubmit={handleSubmit} className="modal__form">
          {error && <p className="modal__error">{error}</p>}

          <div className="form-group">
            <label htmlFor="group-name">Group Name *</label>
            <input
              type="text"
              id="group-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter group name"
            />
          </div>

          <div className="modal__actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
