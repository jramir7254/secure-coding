// hooks/useUser.ts
import { useQuery } from '@tanstack/react-query';

import { decodeToken, useTokenStore } from './use-auth';
// import { tokenStore } from './use-auth';

export function useTeam() {
    const token = useTokenStore((s) => s.token); // reactive now!

    return useQuery({
        queryKey: ['team', token],
        queryFn: async () => {
            if (!token) throw new Error('No token')
            const decoded = decodeToken(token);
            if (!decoded) throw new Error('No valid token');
            return decoded;
        },
        enabled: !!token,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
}