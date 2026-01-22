require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function main() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase credentials');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { data, count, error } = await supabase
            .from('Application')
            .select('*', { count: 'exact' });

        if (error) {
            console.error('Supabase error:', error);
        } else {
            console.log('Supabase success!');
            console.log('Count:', count);
            console.log('Sample data length:', data.length);
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}

main();
