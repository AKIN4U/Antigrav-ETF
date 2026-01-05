import { createClient as createRobustClient } from "@/lib/supabase/client";

export const createClient = () => createRobustClient();
