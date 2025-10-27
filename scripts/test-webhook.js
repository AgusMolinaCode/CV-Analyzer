// Test script to verify webhook connectivity with FormData
// Run with: node scripts/test-webhook.js [path-to-pdf] [clerk_id]

const https = require('https');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const WEBHOOK_URL = 'https://primary-production-1e497.up.railway.app/webhook/9380627a-7950-4a23-adae-6d5f1218bd10';

// Get PDF path and clerk_id from command line args
const pdfPath = process.argv[2];
const clerkId = process.argv[3] || 'test_clerk_id_12345';

console.log('🧪 Testing webhook with FormData...');
console.log('🔗 URL:', WEBHOOK_URL);
console.log('📄 PDF Path:', pdfPath || 'Not provided - will test connection only');
console.log('🆔 Clerk ID:', clerkId);
console.log('');

if (!pdfPath) {
  console.log('⚠️  No PDF file provided. Testing basic connectivity only.');
  console.log('Usage: node scripts/test-webhook.js <path-to-pdf> [clerk_id]');
  console.log('');
}

// Test with FormData if PDF is provided
if (pdfPath && fs.existsSync(pdfPath)) {
  console.log('📦 Creating FormData with PDF file...');

  const form = new FormData();
  form.append('file', fs.createReadStream(pdfPath));
  form.append('clerk_id', clerkId);

  console.log('📡 Sending POST request with FormData...');
  console.log('⏱️  Note: This may take 30+ seconds...');
  console.log('');

  const startTime = Date.now();

  form.submit(WEBHOOK_URL, (err, res) => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    if (err) {
      console.error('❌ Error:', err.message);
      return;
    }

    console.log('\n📥 Response received after', elapsed, 'seconds');
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('\n📄 Response Body:');
      console.log(data || '(empty)');

      if (data.includes('CV cargado correctamente') || data.includes('PDF processed')) {
        console.log('\n✅ Success! Webhook processed the PDF correctly');
      } else if (res.statusCode === 200) {
        console.log('\n⚠️  200 OK but unexpected response content');
      } else {
        console.log('\n❌ Upload may have failed');
      }
    });
  });
} else {
  // Just test basic POST connectivity
  console.log('🧪 Testing basic POST request...');

  const postData = JSON.stringify({ test: 'connection' });
  const url = new URL(WEBHOOK_URL);

  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  const req = https.request(options, (res) => {
    console.log('\n📥 POST Request Response:');
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Body:', data || '(empty)');
      console.log('\n✅ Test completed!');
    });
  });

  req.on('error', (err) => {
    console.error('❌ POST Error:', err.message);
  });

  req.write(postData);
  req.end();
}
