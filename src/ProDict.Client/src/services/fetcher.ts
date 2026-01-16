const BASE_URL = '/api/v1';

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

interface ApiError {
  error?: string;
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
  ok: false;
}

export async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { body, ...restOptions } = options;

  const config: RequestInit = {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...restOptions.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  // Handle non-OK responses
  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      error: 'UnknownError',
      message: 'An unexpected error occurred',
      ok: false,
    }));
    throw errorData;
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
