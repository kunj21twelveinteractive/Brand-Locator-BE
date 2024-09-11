import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore
import Papa from 'papaparse';

import mongoose from 'mongoose';
import StoreModel from './src/model/storeDataModel';


// Define the CSV row interface
interface CsvRow {
  country: string;
  city: string;
  latitude: string;
  longitude: string;
  storeName: string;
  storeAddress: string;
  brandName: string;
  googleMapUrl: string;
}

// Function to read and parse CSV
export function parseCsvFile(): void {
  fs.readFile('store-sample-data.csv', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    Papa.parse<CsvRow>(data, {
      header: true,
      complete: async function (results:any) {
        const parsedData = results.data;

        // Process and save parsed data to the database
        for (const row of parsedData) {
          try {
            await saveStoreToDatabase(row);
          } catch (error) {
            console.error('Error saving store:', error);
          }
        }
        console.log('All data saved successfully!');
      },
      error: function (error:any) {
        console.error('Error parsing the file:', error);
      },
    });
  });
}

// Function to save the parsed data to the database
async function saveStoreToDatabase(row: CsvRow): Promise<void> {
  const brands = row.brandName?.split(',').map((brandName: string) => {
    const trimmedBrandName = brandName.trim();
    const brandLogo = getBrandLogo(trimmedBrandName);
    return {
      brandName: trimmedBrandName || '',
      brandLogo: brandLogo || '',
    };
  }) || [];

  const store = new StoreModel({
    country: row.country || '',
    city: row.city || '',
    location: {
      type: 'Point',
      coordinates: [
        parseFloat(row.longitude) || 0,
        parseFloat(row.latitude) || 0,
      ],
    },
    storeName: row.storeName || '',
    storeAddress: row.storeAddress || '',
    brands: brands,
    googleMapUrl: row.googleMapUrl || '',
  });

  await store.save();
}

// Function to get brand logo based on brand name
// function getBrandLogo(brandName: string): string | null {
//   const logoPath = path.join(__dirname, 'brand-logo', `${brandName}.png`);
//   if (fs.existsSync(logoPath)) {
//     return logoPath;
//   }
//   return null;
// }

function getBrandLogo(brandName: string): string | null {
  const logoFileName = `${brandName}.png`;
  const logoPath = path.join(__dirname, 'brand-logo', logoFileName);
  
  if (fs.existsSync(logoPath)) {
    return logoFileName; // Return just the file name
  }
  
  return null;
}















  
