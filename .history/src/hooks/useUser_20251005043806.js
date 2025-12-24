// Create this new file at: src/hooks/useUser.js
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed

export function useUser() {
  const { data: user, isLoading } = useQuery({
    // The queryKey is a unique identifier for this query
    queryKey: ['user'],
    // The queryFn is the function that fetches the data
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  return { user, isLoading, isAuthenticated: user?.role === 'authenticated' };
}