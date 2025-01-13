import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getSession() {
  const { data } = await supabase.auth.getSession();
  console.log(data,"data");
  return data.session;

  
}


export default supabase;
