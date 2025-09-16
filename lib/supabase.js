import { createClient } from "@supabase/supabase-js";

// your Supabase credentials
const supabaseUrl = "https://xbkmgoqdubpvavpprmqq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhia21nb3FkdWJwdmF2cHBybXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjE0MjAsImV4cCI6MjA3MjkzNzQyMH0.P-HZQdAcOQDIcw-yP6g1X1GDVHa4tcbcLu1muJrSrJ8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
