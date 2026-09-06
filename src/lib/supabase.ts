import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://lzclpkpllxvnfasmctwn.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6Y2xwa3BsbHh2bmZhc21jdHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MjY3MDYsImV4cCI6MjEwNDMwMjcwNn0.o3zsEfaELHe-AWVMfIWrGIdX3Tzby__x8WVVTeZxd6c";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
