const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching orders...");
  const { data: orders, error: fetchError } = await supabase.from("orders").select("id").limit(1);
  
  if (fetchError) {
    console.error("Fetch Error:", fetchError);
    return;
  }
  
  console.log("Found orders:", orders);
  
  if (orders && orders.length > 0) {
    const orderId = orders[0].id;
    console.log(`Trying to delete order ${orderId}...`);
    const { data, error } = await supabase.from("orders").delete().eq("id", orderId).select();
    
    if (error) {
      console.error("Delete Error:", error);
    } else {
      console.log("Delete Success:", data);
    }
  } else {
    console.log("No orders to delete.");
  }
}

run();
