import { fetcher } from './fetcher';
import type { Group, GroupCreateRequest } from '../types';

export const groupsService = {
  getAll: (): Promise<Group[]> => {
    return fetcher<Group[]>('/groups');
  },

  getById: (id: number): Promise<Group> => {
    return fetcher<Group>(`/groups/${id}`);
  },

  create: (group: GroupCreateRequest): Promise<Group> => {
    return fetcher<Group>('/groups', {
      method: 'POST',
      body: group,
    });
  },

  update: (id: number, group: GroupCreateRequest): Promise<Group> => {
    return fetcher<Group>(`/groups/${id}`, {
      method: 'PUT',
      body: group,
    });
  },

  delete: (id: number): Promise<void> => {
    return fetcher<void>(`/groups/${id}`, {
      method: 'DELETE',
    });
  },
};
