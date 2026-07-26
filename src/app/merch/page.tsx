import fs from 'fs';
import path from 'path';
import MerchClient from './MerchClient';

export default function MerchPage() {
  // Read all files from public/assets/merch
  const merchDir = path.join(process.cwd(), 'public/assets/merch');
  let items: string[] = [];

  try {
    const files = fs.readdirSync(merchDir);
    // Filter out hidden files like .DS_Store and only keep likely image extensions
    items = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return !file.startsWith('.') && ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });
  } catch (error) {
    console.error('Error reading merch directory:', error);
  }

  return <MerchClient items={items} />;
}
