const fs = require('node:fs/promises');
const path = require('node:path');

// Resolve items.json relative to the project root (two levels up when this file is in data/)
const itemsFile = path.resolve(__dirname, '..', 'items.json');

async function ensureFileExists() {
  try {
    await fs.access(itemsFile);
  } catch (err) {
    // create with empty items list
    await fs.writeFile(itemsFile, JSON.stringify({ items: [] }));
  }
}

async function getStoredItems() {
  await ensureFileExists();
  try {
    const rawFileContent = await fs.readFile(itemsFile, { encoding: 'utf-8' });
    const data = JSON.parse(rawFileContent || '{}');
    const storedItems = data.items ?? [];
    return storedItems;
  } catch (err) {
    console.error('Error reading or parsing items.json:', err);
    // If parse fails, overwrite with empty items to recover
    await fs.writeFile(itemsFile, JSON.stringify({ items: [] }));
    return [];
  }
}

async function storeItems(items) {
  await ensureFileExists();
  return fs.writeFile(itemsFile, JSON.stringify({ items: items || [] }, null, 2));
}

exports.getStoredItems = getStoredItems;
exports.storeItems = storeItems;