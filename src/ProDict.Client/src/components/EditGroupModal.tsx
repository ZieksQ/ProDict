import { useState, useEffect } from 'react';
import { groupsService } from '../services/groups.service';
import type { Group, GroupCreateRequest } from '../types';
import './AddTermModal.css';

interface EditGroupModalProps {
  isOpen: boolean;
  group: Group | null;
  onClose: () => void;
  onGroupUpdated: () => void;
}

export function EditGroupModal({ isOpen, group, onClose, onGroupUpdated }: EditGroupModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    if (group) {
      setName(group.name);
    }
  }, [group]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!group) return;
    
    if (!name.trim()) {
      setError('Group name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload: GroupCreateRequest = { name: name.trim() };
      await groupsService.update(group.id, payload);
      onGroupUpdated();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message: string }).message);
      } else if (err && typeof err === 'object' && 'errors' in err) {
        const errors = (err as { errors: Record<string, string[]> }).errors;
        setError(Object.values(errors).flat().join(', '));
      } else {
        setError('Failed to update group');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen || !group) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__header">
          <h2>Rename Group</h2>
          <button className="modal__close" onClick={handleClose}>×</button>
        </header>

        <form onSubmit={handleSubmit} className="modal__form">
          {error && <p className="modal__error">{error}</p>}

          <div className="form-group">
            <label htmlFor="edit-group-name">Group Name *</label>
            <input
              type="text"
              id="edit-group-name"
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
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
