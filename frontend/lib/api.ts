import { AUTH } from "./paths";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
type FetchOptions = RequestInit;

let getAccessToken: () => string | null = () => null;
let setAccessToken: (token: string | null) => void = () => {};
let onSessionExpired: () => void = () => {};
let refreshPromise: Promise<string | null> | null = null;

export const configureApi = (config: {
  getToken: () => string | null;
  setToken: (token: string | null) => void;
  onExpired: () => void;
}) => {
  getAccessToken = config.getToken;
  setAccessToken = config.setToken;
  onSessionExpired = config.onExpired;
};

export const apiFetch = async (
  endpoint: string,
  options: FetchOptions = {},
  isRetry = false,
): Promise<Response> => {
  const token = getAccessToken();

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const isAuthEndpoint =
    endpoint === `${AUTH.BASE}${AUTH.LOGIN}` ||
    endpoint === `${AUTH.BASE}${AUTH.REGISTER}` ||
    endpoint === `${AUTH.BASE}${AUTH.REFRESH}`;

  if (response.status === 401 && !isRetry && !isAuthEndpoint) {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const refreshRes = await fetch(`${API_URL}${AUTH.BASE}${AUTH.REFRESH}`, {
            method: "POST",
            credentials: "include",
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            setAccessToken(data.accessToken);
            return data.accessToken;
          }
          return null;
        } catch {
          return null;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    const newToken = await refreshPromise;

    if (newToken) {
      return apiFetch(endpoint, options, true);
    } else {
      setAccessToken(null);
      onSessionExpired();
    }
  }

  return response;
};

export const getApiError = async (response: Response, defaultMsg: string): Promise<string> => {
  try {
    const data = await response.json();
    if (data.details) {
      const firstFieldErrors = Object.values(data.details)[0] as string[];
      return firstFieldErrors?.[0] || defaultMsg;
    }
    return data.error || defaultMsg;
  } catch {
    return defaultMsg;
  }
};
