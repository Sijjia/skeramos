import { locales } from '@/i18n/config';
import fs from 'fs';
import path from 'path';
import MasterDetailContent from './MasterDetailContent';

// Generate static params for all masters and locales
export async function generateStaticParams() {
  // Read masters data at build time
  const mastersPath = path.join(process.cwd(), 'data', 'masters.json');
  let masters: { id: string }[] = [];

  try {
    const data = fs.readFileSync(mastersPath, 'utf-8');
    masters = JSON.parse(data);
  } catch (error) {
    console.error('Error reading masters.json:', error);
    // Return empty array if file doesn't exist
    return [];
  }

  // Generate all combinations of locale and master id
  const params: { locale: string; id: string }[] = [];

  for (const locale of locales) {
    for (const master of masters) {
      params.push({
        locale,
        id: master.id,
      });
    }
  }

  return params;
}

export default function MasterDetailPage() {
  return <MasterDetailContent />;
}
