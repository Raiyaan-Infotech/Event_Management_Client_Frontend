import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,   // 10 minutes
      gcTime: 15 * 60 * 1000,      // 15 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
