import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const headers: HeadersInit = {}; // Initialize headers object
  let bodyToSend: BodyInit | undefined = undefined;

  // Always set Content-Type for POST, PUT, PATCH and send an empty JSON body if no data
  if (method === "POST" || method === "PUT" || method === "PATCH") {
    headers["Content-Type"] = "application/json";
    bodyToSend = data ? JSON.stringify(data) : JSON.stringify({}); // Send {} if no data
  } else if (data) {
    // For other methods that might have data (though rare for GET)
    headers["Content-Type"] = "application/json";
    bodyToSend = JSON.stringify(data);
  }

  // 'credentials: "include"' is important for sessions/cookies if you use them later,
  // but not directly related to this 400 error unless Netlify has specific requirements.
  // For now, let's keep it as you had it, assuming it might be needed for other parts.
  const fetchOptions: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  if (bodyToSend !== undefined) {
    fetchOptions.body = bodyToSend;
  }

  const res = await fetch(url, fetchOptions);

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
