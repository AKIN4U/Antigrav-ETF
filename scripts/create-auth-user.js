// Create Supabase Auth user for Matthew Ted
// Run this script with: node create-auth-user.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function createAuthUser() {
    try {
        const { data, error } = await supabase.auth.admin.createUser({
            email: 'tedunjaiyem@gmail.com',
            password: 'jq+PfUyFoqqgqx3c',
            email_confirm: true,
            user_metadata: {
                name: 'Matthew Ted',
                role: 'Admin',
            },
        });

        if (error) {
            console.error('Error creating auth user:', error);
            process.exit(1);
        }

        console.log('✅ Successfully created auth user for Matthew Ted');
        console.log('Email: tedunjaiyem@gmail.com');
        console.log('Temporary Password: jq+PfUyFoqqgqx3c');
        console.log('\n⚠️ IMPORTANT: Share this password securely and ask Matthew to change it after first login.');
    } catch (err) {
        console.error('Unexpected error:', err);
        process.exit(1);
    }
}

createAuthUser();
