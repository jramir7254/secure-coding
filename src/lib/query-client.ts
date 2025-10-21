import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // ✅ Make data short-lived
            staleTime: 0,              // Always consider data stale immediately
            gcTime: 1000 * 30,         // Garbage collect unused data after 30s

            // ✅ Behavior
            retry: 1,                  // Retry once on network error
            refetchOnMount: true,      // Always refetch when component mounts
            refetchOnWindowFocus: false, // Don’t spam fetches when players switch tabs
            refetchOnReconnect: true,  // Good if a player reconnects mid-game
            networkMode: 'always',     // Allow offline → online retries

            // ✅ Loading handling
            // suspense: false,           // Optional: disable suspense if you prefer manual handling
        },
        mutations: {

            retry: 0, // Don’t retry failed actions — surface the error immediately
            onError: (err) => console.error('Mutation failed:', err),
        },

    },
})
