import { execFileSync } from 'node:child_process';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, remove, update } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const replace = args.includes('--replace');
const xlsxPath = args.find((arg) => !arg.startsWith('--')) || 'KAUSHALAM final.xlsx';

const pythonCandidates = ['python3', 'python'];
let extractorOutput = '';
let pythonUsed = '';

for (const py of pythonCandidates) {
  try {
    extractorOutput = execFileSync(py, ['scripts/extract_team_from_xlsx.py', xlsxPath], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    pythonUsed = py;
    break;
  } catch (error) {
    if (py === pythonCandidates[pythonCandidates.length - 1]) {
      console.error('Failed to run extractor with python3/python.');
      console.error(error?.message || error);
      process.exit(1);
    }
  }
}

let members;
try {
  members = JSON.parse(extractorOutput);
} catch (error) {
  console.error('Extractor returned invalid JSON.');
  console.error(error?.message || error);
  process.exit(1);
}

if (!Array.isArray(members) || members.length === 0) {
  console.error('No members found in workbook:', xlsxPath);
  process.exit(1);
}

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 64);

const keyed = {};
const seen = new Map();

for (const member of members) {
  const base = slugify(member.name) || 'member';
  const n = seen.get(base) || 0;
  seen.set(base, n + 1);
  const key = n === 0 ? base : `${base}_${n + 1}`;
  keyed[key] = member;
}

console.log(`Extractor: ${pythonUsed}`);
console.log(`Workbook: ${xlsxPath}`);
console.log(`Parsed members: ${members.length}`);

if (dryRun) {
  const preview = Object.entries(keyed)
    .slice(0, 8)
    .map(([id, item]) => ({ id, ...item }));
  console.log('Dry run enabled. Preview:');
  console.log(JSON.stringify(preview, null, 2));
  process.exit(0);
}

const required = ['apiKey', 'authDomain', 'projectId', 'appId', 'databaseURL'];
for (const key of required) {
  if (!firebaseConfig[key]) {
    throw new Error(`Missing Firebase config: ${key}`);
  }
}

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

if (replace) {
  console.log('Replacing /team (remove + write)...');
  await remove(ref(db, 'team'));
}

console.log('Seeding members into /team ...');
await update(ref(db, 'team'), keyed);
console.log(`Seeded ${Object.keys(keyed).length} team members.`);
