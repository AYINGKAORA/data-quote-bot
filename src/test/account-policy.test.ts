import {describe,it,expect} from 'vitest';
import {CODE_RESEND_SECONDS,canUseWorkspace} from '@/lib/account-policy';
describe('account access requirements',()=>{
 it('does not allow guests to process or view quotes',()=>expect(canUseWorkspace(false,true)).toBe(false));
 it('blocks registered accounts until administrator approval',()=>expect(canUseWorkspace(true,false)).toBe(false));
 it('allows approved signed-in accounts',()=>expect(canUseWorkspace(true,true)).toBe(true));
 it('waits 60 seconds before resending an email code',()=>expect(CODE_RESEND_SECONDS).toBe(60));
});