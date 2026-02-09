describe('Test setup', () => {
  it('should run tests successfully', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have mocked supabase', () => {
    const { supabase, isSupabaseConfigured } = require('../lib/supabase');
    expect(supabase).toBeDefined();
    expect(supabase.from).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(isSupabaseConfigured).toBeDefined();
    expect(typeof isSupabaseConfigured()).toBe('boolean');
  });
});
