import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://zhdabrdtfkuhotjzybsa.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoZGFicmR0Zmt1aG90anp5YnNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDgwMTg1NiwiZXhwIjoyMDQwMzc3ODU2fQ.BuWY0Zl-FYzoFo1QipepagPRVflXjkQRuDHVXqO2yDU";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
