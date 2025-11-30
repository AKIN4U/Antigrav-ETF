import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

let cachedClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export function createClient() {
    // Return cached client if available
    if (cachedClient) {
        return cachedClient
    }

    // Only create client in browser environment
    if (typeof window === 'undefined') {
        // During build/SSR, return a mock client that won't be used
        return {
            auth: {
                signUp: async () => ({ data: null, error: new Error('Client not available during build') }),
                signInWithPassword: async () => ({ data: null, error: new Error('Client not available during build') }),
                signOut: async () => ({ error: new Error('Client not available during build') }),
                getSession: async () => ({ data: { session: null }, error: null }),
                getUser: async () => ({ data: { user: null }, error: null }),
            }
        } as any
    }

    try {
        cachedClient = createClientComponentClient<Database>()
        return cachedClient
    } catch (e) {
        console.error("Failed to create Supabase client:", e);
        // Return a mock client with error methods
        return {
            auth: {
                signUp: async () => ({ data: null, error: new Error('Failed to initialize Supabase client') }),
                signInWithPassword: async () => ({ data: null, error: new Error('Failed to initialize Supabase client') }),
                signOut: async () => ({ error: new Error('Failed to initialize Supabase client') }),
                getSession: async () => ({ data: { session: null }, error: new Error('Failed to initialize Supabase client') }),
                getUser: async () => ({ data: { user: null }, error: new Error('Failed to initialize Supabase client') }),
            }
        } as any
    }
}
