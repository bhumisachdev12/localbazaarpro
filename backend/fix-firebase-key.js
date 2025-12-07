/**
 * Helper script to format Firebase private key correctly for .env file
 * 
 * Usage:
 * 1. Download your Firebase service account JSON file
 * 2. Run: node fix-firebase-key.js path/to/your-firebase-key.json
 * 3. Copy the output and paste it into your .env file
 */

const fs = require('fs');
const path = require('path');

// Get the JSON file path from command line argument
const jsonFilePath = process.argv[2];

if (!jsonFilePath) {
    console.error('❌ Error: Please provide the path to your Firebase JSON file');
    console.log('\nUsage: node fix-firebase-key.js path/to/firebase-key.json');
    process.exit(1);
}

try {
    // Read the Firebase JSON file
    const absolutePath = path.resolve(jsonFilePath);
    const fileContent = fs.readFileSync(absolutePath, 'utf8');
    const firebaseConfig = JSON.parse(fileContent);

    // Extract the values
    const projectId = firebaseConfig.project_id;
    const privateKey = firebaseConfig.private_key;
    const clientEmail = firebaseConfig.client_email;

    // Validate required fields
    if (!projectId || !privateKey || !clientEmail) {
        console.error('❌ Error: JSON file is missing required fields (project_id, private_key, or client_email)');
        process.exit(1);
    }

    // Format the private key for .env (escape newlines)
    const formattedPrivateKey = privateKey.replace(/\n/g, '\\n');

    console.log('\n✅ Firebase credentials extracted successfully!\n');
    console.log('Copy the following lines to your .env file:\n');
    console.log('─'.repeat(80));
    console.log(`FIREBASE_PROJECT_ID=${projectId}`);
    console.log(`FIREBASE_PRIVATE_KEY="${formattedPrivateKey}"`);
    console.log(`FIREBASE_CLIENT_EMAIL=${clientEmail}`);
    console.log('─'.repeat(80));
    console.log('\n💡 Tip: Replace lines 9-11 in your .env file with the above lines\n');

} catch (error) {
    if (error.code === 'ENOENT') {
        console.error(`❌ Error: File not found: ${jsonFilePath}`);
    } else if (error instanceof SyntaxError) {
        console.error('❌ Error: Invalid JSON file');
    } else {
        console.error('❌ Error:', error.message);
    }
    process.exit(1);
}
