import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: products, error } = await supabase.from("products").select("name, is_available").order('id');
  if (error) {
    console.error("Error:", error);
    return;
  }
  products.forEach(p => console.log(`${p.name}: ${p.is_available}`));
}

run();
