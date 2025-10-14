import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function App() {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    getFilms();
  }, []);

  async function getFilms() {
    const { data } = await supabase.from("Films").select();
    setFilms(data);
    console.log(data);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Database Films:</h1>
      <ul>
        {films.map((film) => (
          <li key={film.name}>{film.name}</li>
        ))}
      </ul>
    </div>
    
  );
}

export default App;