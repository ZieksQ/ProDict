export interface Term {
  id: number;
  name: string;
  group: string;
  groupId?: number;
  description: string | null;
  referenceLinks: string | null;
}

export interface TermCreateRequest {
  name: string;
  groupId: number;
  description: string | null;
  referenceLinks: string | null;
}

export interface Group {
  id: number;
  name: string;
}

export interface GroupCreateRequest {
  name: string;
}

export interface ValidationError {
  title: string;
  errors: Record<string, string[]>;
}

export interface ApiError {
  error: string;
  message: string;
  ok: false;
}
