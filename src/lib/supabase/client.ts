import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'
import { SupabaseClient } from '@supabase/supabase-js'

let cachedClient: SupabaseClient<Database> | null = null

export function createClient(): SupabaseClient<Database> {
    // Return cached client if available
    if (cachedClient) {
        return cachedClient
    }

    // Only create client in browser environment
    if (typeof window === 'undefined') {
        // During build/SSR, return a mock client that won't be used
        // We cast to unknown first to avoid partial type errors, then to SupabaseClient
        return {
            auth: {
                signUp: async () => ({ data: null, error: new Error('Client not available during build') }),
                signInWithPassword: async () => ({ data: null, error: new Error('Client not available during build') }),
                signOut: async () => ({ error: new Error('Client not available during build') }),
                getSession: async () => ({ data: { session: null }, error: null }),
                getUser: async () => ({ data: { user: null }, error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            }
        } as unknown as SupabaseClient<Database>
    }

    try {
        cachedClient = createBrowserClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
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
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            }
        } as unknown as SupabaseClient<Database>
    }
}
