import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
export const getAccount = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async ({context}) => {
 const [profile, access, role] = await Promise.all([context.supabase.from('profiles').select('*').eq('id',context.userId).single(),context.supabase.from('account_access').select('approved').eq('user_id',context.userId).single(),context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'})]);
 if(profile.error || access.error || role.error) throw new Error('Не удалось загрузить аккаунт / 无法读取账号');
 return {profile:profile.data,approved:access.data.approved,admin:role.data};
});
export const listAccounts = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async ({context}) => {
 const role = await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});
 if(role.error || !role.data) throw new Error('Forbidden');
 const rows = await context.supabase.from('profiles').select('id,email,created_at,account_access(approved)').order('created_at',{ascending:false});
 if(rows.error) throw new Error(rows.error.message); return rows.data;
});
export const approveAccount = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({id:z.string().uuid(),approved:z.boolean()})).handler(async ({context,data}) => {
 const role = await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});
 if(role.error || !role.data) throw new Error('Forbidden');
 if(data.id===context.userId) throw new Error('Cannot disable own account');
 const result = await context.supabase.from('account_access').update({approved:data.approved}).eq('user_id',data.id); if(result.error) throw new Error(result.error.message);
});
