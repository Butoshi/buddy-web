// Script pour générer des license keys pour Buddy

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Pas de 0/O/1/I pour éviter confusion
  const segments = [];

  for (let s = 0; s < 3; s++) {
    let segment = '';
    for (let i = 0; i < 4; i++) {
      segment += chars[Math.floor(Math.random() * chars.length)];
    }
    segments.push(segment);
  }

  return `BUDDY-${segments.join('-')}`;
}

function generateLicenses(count) {
  const licenses = new Set();

  while (licenses.size < count) {
    licenses.add(generateCode());
  }

  return Array.from(licenses);
}

// Générer 200 codes
const codes = generateLicenses(200);

// Afficher les codes
console.log('='.repeat(50));
console.log(`${codes.length} LICENSE KEYS GENERATED`);
console.log('='.repeat(50));
console.log('');

codes.forEach((code, index) => {
  console.log(`${(index + 1).toString().padStart(3, '0')}. ${code}`);
});

console.log('');
console.log('='.repeat(50));

// Sauvegarder en JSON
const fs = require('fs');
const licensesData = codes.map(code => ({
  code: code,
  used: false,
  usedBy: null,
  usedAt: null
}));

fs.writeFileSync('licenses.json', JSON.stringify(licensesData, null, 2));
console.log('Saved to licenses.json');
