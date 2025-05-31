import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rkavpoplyhacbzzzakmb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrYXZwb3BseWhhY2J6enpha21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MDYxMjcsImV4cCI6MjA2NDI4MjEyN30.mcBZloI5-HQv2GJncBNJ2hdPMVHmV_799oaJvvuj2ZE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 