import { fetcher } from './fetcher';
import type { Term, TermCreateRequest } from '../types';

export const termsService = {
  getAll: (search?: string): Promise<Term[]> => {
    const endpoint = search ? `/terms?search=${encodeURIComponent(search)}` : '/terms';
    return fetcher<Term[]>(endpoint);
  },

  getById: (id: number): Promise<Term> => {
    return fetcher<Term>(`/terms/${id}`);
  },

  create: (term: TermCreateRequest): Promise<Term> => {
    return fetcher<Term>('/terms', {
      method: 'POST',
      body: term,
    });
  },

  update: (id: number, term: TermCreateRequest): Promise<Term> => {
    return fetcher<Term>(`/terms/${id}`, {
      method: 'PUT',
      body: term,
    });
  },

  delete: (id: number): Promise<void> => {
    return fetcher<void>(`/terms/${id}`, {
      method: 'DELETE',
    });
  },
};
