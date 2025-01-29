import type { Database } from "@/integrations/supabase/types";

export type Contest = Database['public']['Tables']['contests']['Row'];

export type Submission = {
  name: string;
  caption: string;
  votes: number;
  id: string;
  voters: string[];
};