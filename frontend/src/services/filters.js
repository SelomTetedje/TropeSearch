import { supabase } from '../lib/supabase';

export async function fetchGenres() {
  const { data, error } = await supabase
    .from('genres')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function fetchLanguages() {
  const { data, error } = await supabase
    .from('languages')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function fetchTropes() {
  const { data, error } = await supabase
    .from('tropes')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}