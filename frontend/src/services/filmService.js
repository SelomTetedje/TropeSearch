import { supabase } from "../lib/supabase";
import { getCacheItem, setCacheItem } from "../utils/cache";


export async function fetchFilmDetails(filmId) {
  // Check localStorage cache first
  const CACHE_KEY = `film_details_${filmId}`;
  const cached = getCacheItem(CACHE_KEY);

  if (cached) {
    console.log(`Loading film ${filmId} details from cache`);
    return cached;
  }

  console.log(`Fetching film ${filmId} details from database`);
  const { data, error } = await supabase
    .from("films")
    .select(`
      id,
      plot,
      language,
      genre,
      imdb_id
    `)
    .eq("id", filmId)
    .single();

  if (error) {
    console.error("Error fetching film details:", error);
    return null;
  }

  // Cache the result for 60 minutes (film details rarely change)
  setCacheItem(CACHE_KEY, data, 60);
  return data;
}
