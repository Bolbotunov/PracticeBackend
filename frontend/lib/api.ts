const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  };

  const response = await fetch(`${API_URL}${endpoint}`, defaultOptions);

  return response;
};
