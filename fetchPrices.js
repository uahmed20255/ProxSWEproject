import { supabase } from './lib/supabase';

export async function getProductPrices() {
  const { data, error } = await supabase
    .from('product_prices') // your table with prices
    .select('*');

  if (error) {
    console.log('Error fetching prices:', error);
    return [];
  }

  return data;
}
