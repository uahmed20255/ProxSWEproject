// supabase/client.js
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

export const supabase = createClient('https://xbkmgoqdubpvavpprmqq.supabase.co', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhia21nb3FkdWJwdmF2cHBybXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjE0MjAsImV4cCI6MjA3MjkzNzQyMH0.P-HZQdAcOQDIcw-yP6g1X1GDVHa4tcbcLu1muJrSrJ8");
