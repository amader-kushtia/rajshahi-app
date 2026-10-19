/**
 * Script: scripts/setAdminClaim.js
 * Purpose: Sets custom user claim { admin: true } for UID '5PxY5hH298NZtmUBluWf7cCoB7W2'
 * using Firebase Admin SDK.
 * 
 * Usage:
 *   1. Download Service Account Key JSON from Firebase Console:
 *      Project Settings -> Service Accounts -> Generate new private key
 *   2. Save as 'serviceAccountKey.json' in root directory
 *   3. Execute: node scripts/setAdminClaim.js
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const TARGET_UID = '5PxY5hH298NZtmUBluWf7cCoB7W2';
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '..', 'serviceAccountKey.json');

async function setAdminCustomClaim() {
  console.log('🚀 Initializing Firebase Admin SDK...');

  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error(`❌ Service account key file missing: '${SERVICE_ACCOUNT_PATH}'`);
    console.error('Please place your serviceAccountKey.json in the project root directory.');
    process.exit(1);
  }

  const serviceAccount = require(SERVICE_ACCOUNT_PATH);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  try {
    // 1. Verify User Exists
    const userRecord = await admin.auth().getUser(TARGET_UID);
    console.log(`👤 Found target user: ${userRecord.email || userRecord.uid}`);

    // 2. Set Custom User Claims
    const updatedClaims = {
      ...(userRecord.customClaims || {}),
      admin: true,
      role: 'admin'
    };

    await admin.auth().setCustomUserClaims(TARGET_UID, updatedClaims);
    console.log(`✅ Successfully applied Custom Claims { admin: true } to UID: ${TARGET_UID}`);

    // 3. Confirm Claim Attachment
    const updatedUser = await admin.auth().getUser(TARGET_UID);
    console.log('🎉 Verified Claims on Firebase Auth Server:', updatedUser.customClaims);

  } catch (error) {
    console.error('❌ Error setting custom claims:', error);
  } finally {
    process.exit(0);
  }
}

setAdminCustomClaim();
