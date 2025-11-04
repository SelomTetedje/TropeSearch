import fs from "fs";
import csv from "csv-parser";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const OMDB_API = process.env.OMDB_API_KEY;

// Utility to clean movie title like "ABBAtheMovie" → "Abba The Movie"  
function cleanTitle(raw) {
  let result = raw
    // Add space between letter and number: "Death2" → "Death 2"
    .replace(/([a-zA-Z])(\d)/g, "$1 $2")
    // Add space between number and letter: "2Fast" → "2 Fast"  
    .replace(/(\d)([a-zA-Z])/g, "$1 $2")
    // Add space before uppercase that follows lowercase (but not 's'): "theMovie" → "the Movie"
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    // Add space between acronyms and words: "ABCDef" → "ABC Def"
    // Match: capital letters followed by (capital + lowercase), but keep last capital with lowercase
    .replace(/([A-Z]+)([A-Z][a-rt-z])/g, "$1 $2");  // exclude 's' from second group

  // Now handle capitalization
  const words = result.split(/\s+/);
  const formatted = words.map(word => {
    // Keep acronym-style words: "ABC", "ABCs", "USA", "USAs"
    if (word.match(/^[A-Z]{2,}s?$/i) && word !== word.toLowerCase()) {
      return word.toUpperCase().replace(/S$/i, 's');
    }
    // Regular words: capitalize first letter, lowercase rest
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
  
  return formatted.trim();
}

// Normalize titles for comparison (remove special chars, lowercase)
function normalizeTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// --- Config: which rows to process ---
const startRow = 40;
const endRow = 50;

// --- Read CSV ---
const results = [];
fs.createReadStream("../frontend/src/data/film_tropes.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", async () => {
    const subset = results.slice(startRow, endRow);

    for (const row of subset) {
      const rawTitle = row["Title"];
      const rawTropeName = row["Trope"];
      const example = row["Example"];

      const title = cleanTitle(rawTitle);
      const tropeName = cleanTitle(rawTropeName);
      console.log("\nProcessing row:", title, "-", tropeName);

      // --- Step 1: Check if film exists (using normalized title matching) ---
      const { data: allFilms } = await supabase
        .from("films")
        .select("*");

      const normalizedSearchTitle = normalizeTitle(title);
      let film = allFilms?.find(f => normalizeTitle(f.name) === normalizedSearchTitle);

      if (!film) {
        console.log("Fetching OMDb for:", title);
        const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API}`;
        const res = await fetch(url);
        const omdb = await res.json();

        if (omdb.Response === "True") {
          // Check again if OMDb title already exists in DB
          const omdbNormalized = normalizeTitle(omdb.Title);
          film = allFilms?.find(f => normalizeTitle(f.name) === omdbNormalized);

          if (!film) {
            const runtime = parseInt(omdb.Runtime) || null;
            const rating = parseFloat(omdb.imdbRating) || null;

            const { data: newFilm, error: insertErr } = await supabase
              .from("films")
              .insert({
                name: omdb.Title,
                year: parseInt(omdb.Year) || null,
                runtime,
                director: omdb.Director,
                plot: omdb.Plot,
                poster_url: omdb.Poster,
                imdb_id: omdb.imdbID,
                imdb_rating: rating,
                language: omdb.Language,
              })
              .select()
              .single();

            if (insertErr) {
              console.error("Film insert error:", insertErr);
              continue;
            }

            film = newFilm;

            // --- Step 2: Add genres ---
            if (omdb.Genre) {
              const genres = omdb.Genre.split(",").map((g) => g.trim());
              for (const g of genres) {
                let { data: genre } = await supabase
                  .from("genres")
                  .select("*")
                  .eq("name", g)
                  .single();

                if (!genre) {
                  const { data: newGenre } = await supabase
                    .from("genres")
                    .insert({ name: g })
                    .select()
                    .single();
                  genre = newGenre;
                }

                await supabase
                  .from("film_genres")
                  .upsert({ film_id: film.id, genre_id: genre.id }, { onConflict: "film_id,genre_id" });
              }
            }

            // --- Step 3: Add languages ---
            if (omdb.Language) {
              const languages = omdb.Language.split(",").map((l) => l.trim());
              for (const langName of languages) {
                let { data: lang } = await supabase
                  .from("languages")
                  .select("*")
                  .eq("name", langName)
                  .single();

                if (!lang) {
                  const { data: newLang, error: langInsertErr } = await supabase
                    .from("languages")
                    .insert({ name: langName })
                    .select()
                    .single();

                  if (langInsertErr) {
                    console.error("Language insert error:", langInsertErr);
                    continue;
                  }

                  lang = newLang;
                }

                await supabase
                  .from("film_languages")
                  .upsert({ film_id: film.id, language_id: lang.id }, { onConflict: "film_id,language_id" });
              }
            }
          } else {
            console.log("Film already exists in DB (from OMDb title match):", film.name);
          }
        } else {
          console.warn("OMDb not found for", title);
          continue;
        }
      } else {
        console.log("Film already exists:", film.name);
      }

      // --- Step 4: Handle trope ---
      let { data: trope } = await supabase
        .from("tropes")
        .select("*")
        .eq("name", tropeName)
        .single();

      if (!trope) {
        const { data: newTrope } = await supabase
          .from("tropes")
          .insert({ name: tropeName })
          .select()
          .single();
        trope = newTrope;
      }

      // --- Step 5: Create join in film_tropes ---
      const { error: joinErr } = await supabase
        .from("film_tropes")
        .upsert({ film_id: film.id, trope_id: trope.id, example }, { onConflict: "film_id,trope_id" });

      if (joinErr) console.error("Film-Trope join error:", joinErr);
      else console.log("✅ Added trope:", tropeName, "to film:", film.name);
    }

    console.log("\n✅ All done for rows", startRow, "to", endRow - 1);
  });