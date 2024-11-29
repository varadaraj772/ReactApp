import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://xogfofzsbbpmicdbabey.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZ2ZvZnpzYmJwbWljZGJhYmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMDA2NTQsImV4cCI6MjA0NzY3NjY1NH0.OshSUxDB9jgfgNNYiZa72HW4aGi9iUx0RSfIm2ERTc8");

function App() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    getCountries();
  }, []);

  async function getCountries() {
    const { data } = await supabase.from("countries").select();
    setCountries(data);
  }

  return (
    <ul>
      {countries.map((country) => (
        <li key={country.name}>{country.name}</li>
      ))}
    </ul>
  );
}

export default App;