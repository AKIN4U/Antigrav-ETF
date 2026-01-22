require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function main() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        console.log('Testing join query...');
        const { data, error } = await supabase
            .from('Application')
            .select(`
                *,
                applicant:Applicant(
                    firstName,
                    surname,
                    email,
                    phone
                )
            `)
            .limit(1);

        if (error) {
            console.error('Join query error:', error);
        } else {
            console.log('Join query success!');
            console.log('Result sample:', JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}

main();
