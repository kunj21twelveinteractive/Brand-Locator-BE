
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import StoreModel from "./src/model/storeDataModel";

const countries = {
  USA: [
    { city: "New York", lat: 40.7128, long: -74.006 },
    { city: "Los Angeles", lat: 34.0522, long: -118.2437 },
    { city: "Chicago", lat: 41.8781, long: -87.6298 },
    { city: "Houston", lat: 29.7604, long: -95.3698 },
    { city: "Miami", lat: 25.7617, long: -80.1918 },
  ],
  UK: [
    { city: "London", lat: 51.5074, long: -0.1278 },
    { city: "Manchester", lat: 53.4839, long: -2.2446 },
    { city: "Birmingham", lat: 52.4862, long: -1.8904 },
    { city: "Glasgow", lat: 55.8642, long: -4.2518 },
  ],

  India: [
    { city: "Ahmedabad", lat: 23.0719488, long: 72.5123072 },
    { city: "Mumbai", lat: 19.076, long: 72.8777 },
    { city: "Delhi", lat: 28.6139, long: 77.209 },
    { city: "Bangalore", lat: 12.9716, long: 77.5946 },
  ],
  Australia: [
    { city: "Sydney", lat: -33.8688, long: 151.2093 },
    { city: "Melbourne", lat: -37.8136, long: 144.9631 },
    { city: "Brisbane", lat: -27.4698, long: 153.0251 },
    { city: "Perth", lat: -31.9505, long: 115.8605 },
  ],
  Germany: [
    { city: "Berlin", lat: 52.52, long: 13.405 },
    { city: "Munich", lat: 48.1351, long: 11.582 },
    { city: "Frankfurt", lat: 50.1109, long: 8.6821 },
    { city: "Hamburg", lat: 53.5511, long: 9.9937 },
  ],
  Japan: [
    { city: "Tokyo", lat: 35.6895, long: 139.6917 },
    { city: "Osaka", lat: 34.6937, long: 135.5023 },
    { city: "Kyoto", lat: 35.0116, long: 135.7681 },
    { city: "Nagoya", lat: 35.1815, long: 136.9066 },
  ],
  Brazil: [
    { city: "São Paulo", lat: -23.5505, long: -46.6333 },
    { city: "Rio de Janeiro", lat: -22.9068, long: -43.1729 },
    { city: "Brasília", lat: -15.7942, long: -47.8822 },
    { city: "Salvador", lat: -12.9714, long: -38.5014 },
  ],
  France: [
    { city: "Paris", lat: 48.8566, long: 2.3522 },
    { city: "Marseille", lat: 43.2965, long: 5.3698 },
    { city: "Lyon", lat: 45.764, long: 4.8357 },
    { city: "Nice", lat: 43.7102, long: 7.262 },
  ],
  Italy: [
    { city: "Rome", lat: 41.9028, long: 12.4964 },
    { city: "Milan", lat: 45.4642, long: 9.19 },
    { city: "Naples", lat: 40.8518, long: 14.2681 },
    { city: "Florence", lat: 43.7696, long: 11.2558 },
  ],
  Canada: [
    { city: "Toronto", lat: 43.651, long: -79.347 },
    { city: "Vancouver", lat: 49.2827, long: -123.1207 },
    { city: "Montreal", lat: 45.5017, long: -73.5673 },
    { city: "Calgary", lat: 51.0447, long: -114.0719 },
  ],
};

const storeNames = [
  "Lowe's",
  "The Home Depot",
  "Michaels",
  "Alibaba",
  "Kroger",
  "Target",
  "Walmart",
  "IKEA",
  "Best Buy",
];

const brandNames = [
  "Nike",
  "Adidas",
  "Puma",
  "Under Armour",
  "Reebok",
  "Gucci",
  "Prada",
  "Levi's",
  "H&M",
  "Zara",
];

const brandLogos: { [key: string]: string } = {
  Nike: "/uploads\\1724737004702download4.png",
  Adidas: "/uploads\\1724736682505download1.png",
  Puma: "/uploads\\1724737004702download5.png",
  "Under Armour": "/uploads\\1724736682503download9.png",
  Reebok: "/uploads\\1724736682506download7.png",
  Gucci: "/uploads\\1724737004702download2.png",
  Prada: "/uploads\\1724736682506download6.png",
  "Levi's": "/uploads\\1724736682506download8.png",
  "H&M": "/uploads\\1724737004703download10.png",
  Zara: "/uploads\\1724737004703download3.png",
};

const getRandomCoordinate = (base: number, range: number = 0.01) => {
  return base + (Math.random() * range - range / 2);
};

export const generateFakeStores = async () => {
  const stores: any[] = [];

  for (const [country, cities] of Object.entries(countries)) {
    for (const { city, lat, long } of cities) {
      for (let i = 0; i < 5; i++) {
        const storeName = faker.helpers.arrayElement(storeNames);
        const brands = Array.from({ length: 5 }, () => {
          const brandName = faker.helpers.arrayElement(brandNames);
          return {
            brandName,
            brandLogo: brandLogos[brandName], // Use the mapped image URL
          };
        });

        stores.push({
          country,
          city,
          location: {
            type: "Point",
            coordinates: [getRandomCoordinate(long), getRandomCoordinate(lat)],
          },
          storeName,
          storeAddress: faker.address.streetAddress(),
          brands,
        });
      }
    }
  }

  await StoreModel.insertMany(stores);
  console.log("Data inserted successfully");
};

export const runSeeder = async () => {
  try {
    await generateFakeStores();
  } catch (error) {
    console.error("Error connecting to MongoDB or inserting data:", error);
  }
};

const brands = Array.from({ length: 5 }, () => {
  const brandName = faker.helpers.arrayElement(brandNames);
  return {
    brandName,
    brandLogo: brandLogos[brandName], // Use the mapped image URL
  };
});









// import mongoose from "mongoose";
// import faker from "@faker-js/faker";
// import Brand from "./src/model/brandModel";


// // Array of brand names
// const brandNames = [
//   "Nike",
//   "Adidas",
//   "Puma",
//   "Under Armour",
//   "Reebok",
//   "Gucci",
//   "Prada",
//   "Levi's",
//   "H&M",
//   "Zara",
// ];

// // Object mapping brand names to their respective logos
// const brandLogos: { [key: string]: string } = {
//   Nike: "/uploads\\1724737004702download4.png",
//   Adidas: "/uploads\\1724736682505download1.png",
//   Puma: "/uploads\\1724737004702download5.png",
//   "Under Armour": "/uploads\\1724736682503download9.png",
//   Reebok: "/uploads\\1724736682506download7.png",
//   Gucci: "/uploads\\1724737004702download2.png",
//   Prada: "/uploads\\1724736682506download6.png",
//   "Levi's": "/uploads\\1724736682506download8.png",
//   "H&M": "/uploads\\1724737004703download10.png",
//   Zara: "/uploads\\1724737004703download3.png",
// };

// export async function generateFakeBrands() {
 

//   // Generate fake data for each brand
//   const brands = brandNames.map((brandName) => ({
//     brandName,
//     brandLogo: brandLogos[brandName],
//   }));

//   // Insert the fake brand data into the database
//   await Brand.insertMany(brands);
//   console.log("Fake brand data inserted successfully!");

// }


