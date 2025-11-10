import { supabase } from '../lib/supabase';

export async function fetchAllFilterData() {
  try {
    const [genresResult, languagesResult, tropesResult] = await Promise.all([
      supabase.from('genres').select('*').order('name'),
      supabase.from('languages').select('*').order('name'),
      supabase.from('tropes').select('*').order('name')
    ]);

    if (genresResult.error) throw genresResult.error;
    if (languagesResult.error) throw languagesResult.error;
    if (tropesResult.error) throw tropesResult.error;

    return {
      genres: genresResult.data || [],
      languages: languagesResult.data || [],
      tropes: tropesResult.data || []
    };
  } catch (error) {
    console.error('Error fetching filter data:', error);
    throw error;
  }
}

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