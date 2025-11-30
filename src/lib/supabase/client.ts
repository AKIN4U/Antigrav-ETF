import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function createClient() {
    try {
        return createClientComponentClient()
    } catch (e) {
        console.warn("Failed to create Supabase client:", e);
        return {} as any;
    }
}
