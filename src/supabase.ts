import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qysrvozgigoacwgenedd.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5c3J2b3pnaWdvYWN3Z2VuZWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3ODY0NzEsImV4cCI6MjA2OTM2MjQ3MX0.GpBcz-Tq5a4hG1ye8U9xX2NflPew5UEcckGCAv1d1aM";

export const supabase = createClient(supabaseUrl, supabaseKey);
