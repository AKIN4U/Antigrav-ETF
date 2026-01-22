const http = require('http');

async function testApi() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/admin/applications',
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };

    console.log('Fetching /api/admin/applications...');

    const req = http.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);

        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log('Body:', body.substring(0, 500));
        });
    });

    req.on('error', (e) => {
        console.error('Problem with request:', e.message);
    });

    req.end();
}

testApi();
