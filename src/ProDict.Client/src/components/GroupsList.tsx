import { useState, useEffect } from 'react';
import { IoPencil, IoTrash, IoAdd } from 'react-icons/io5';
import { groupsService } from '../services/groups.service';
import { DropdownMenu } from './DropdownMenu';
import { ConfirmModal } from './ConfirmModal';
import { EditGroupModal } from './EditGroupModal';
import { AddGroupModal } from './AddGroupModal';
import type { Group } from '../types';
import './GroupsList.css';

interface GroupsListProps {
  onGroupsChange?: () => void;
}

export function GroupsList({ onGroupsChange }: GroupsListProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Modal states
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  const [groupToEdit, setGroupToEdit] = useState<Group | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await groupsService.getAll();
      setGroups(data);
    } catch (err) {
      setError('Failed to load groups');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!groupToDelete) return;
    
    setIsDeleting(true);
    try {
      await groupsService.delete(groupToDelete.id);
      setGroupToDelete(null);
      await fetchGroups();
      onGroupsChange?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGroupUpdated = () => {
    setGroupToEdit(null);
    fetchGroups();
    onGroupsChange?.();
  };

  const handleGroupAdded = () => {
    setIsAddModalOpen(false);
    fetchGroups();
  };

  const getMenuItems = (group: Group) => [
    {
      label: 'Rename',
      icon: <IoPencil size={16} />,
      onClick: () => setGroupToEdit(group),
    },
    {
      label: 'Delete',
      icon: <IoTrash size={16} />,
      onClick: () => setGroupToDelete(group),
      variant: 'danger' as const,
    },
  ];

  return (
    <div className="groups-list">
      <div className="groups-list__header">
        <h3 className="groups-list__title">Manage Groups</h3>
        <button
          className="groups-list__add-btn"
          onClick={() => setIsAddModalOpen(true)}
          title="Add Group"
        >
          <IoAdd size={20} />
        </button>
      </div>

      {isLoading && <p className="groups-list__status">Loading groups...</p>}
      
      {error && <p className="groups-list__status groups-list__status--error">{error}</p>}

      {!isLoading && !error && groups.length === 0 && (
        <p className="groups-list__status">No groups found. Add your first group!</p>
      )}

      {!isLoading && !error && groups.length > 0 && (
        <ul className="groups-list__items">
          {groups.map((group) => (
            <li key={group.id} className="groups-list__item">
              <span className="groups-list__name">{group.name}</span>
              <DropdownMenu items={getMenuItems(group)} />
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        isOpen={!!groupToDelete}
        title="Delete Group"
        message={`Are you sure you want to delete "${groupToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setGroupToDelete(null)}
      />

      <EditGroupModal
        isOpen={!!groupToEdit}
        group={groupToEdit}
        onClose={() => setGroupToEdit(null)}
        onGroupUpdated={handleGroupUpdated}
      />

      <AddGroupModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onGroupAdded={handleGroupAdded}
      />
    </div>
  );
}
