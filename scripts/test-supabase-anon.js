require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function main() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('Using URL:', supabaseUrl);
    console.log('Using ANON key starting with:', supabaseKey.substring(0, 10) + '...');

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { data, count, error } = await supabase
            .from('Application')
            .select('*', { count: 'exact' });

        if (error) {
            console.error('ANON query error:', error);
        } else {
            console.log('ANON query success!');
            console.log('Count:', count);
            console.log('Data length:', data.length);
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}

main();
