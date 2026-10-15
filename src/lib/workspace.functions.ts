import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { recordSchema } from './quote-history';
import { z } from 'zod';
export const listQuotes = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async ({context}) => {
 const result = await context.supabase.from('quote_records').select('id,date,filename,quote,saved').order('date',{ascending:false});
 if(result.error) throw new Error(result.error.message);
 return result.data.map(row=>({...recordSchema.parse(row),saved:row.saved}));
});
export const saveQuote = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({id:z.string().uuid()})).handler(async ({context,data}) => {
 const result=await context.supabase.from('quote_records').update({saved:true}).eq('id',data.id).select('id').single(); if(result.error) throw new Error(result.error.message);
});
