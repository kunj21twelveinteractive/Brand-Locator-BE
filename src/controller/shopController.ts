import { Request, Response } from "express";
import nodemailer from "nodemailer";
import ContactUs from "../model/contact-us-model"; // Adjust the import path as necessary
import StoreModel from "../model/storeDataModel";
import { Brand, Store } from "../interface/storeDataInterface";
import Brands from "../model/brandModel";

export const contactUs = async (req: Request, res: Response) => {
  try {
    console.log(req.body, "  data");

    const { email, topic, name, message } = req.body;

    const newContact = new ContactUs({
      email,
      topic,
      name,
      message,
    });

    await newContact.save();

    // // Send confirmation email using nodemailer
    // const transporter = nodemailer.createTransport({
    //   service: "gmail", // or use "smtp" with custom SMTP settings
    //   auth: {
    //     user: process.env.EMAIL_USER, // Your email address
    //     pass: process.env.EMAIL_PASS, // Your email password or app password
    //   },
    // });

    // const mailOptions = {
    //   from: email , // Sender address
    //   to: process.env.EMAIL_USER, // List of recipients (you can add more if needed)
    //   subject: `Contact Submission: ${topic}`,
    //   text: `Hi ${name},\n\nThank you for contacting us!\n\nYour message: ${message}\n\nWe'll get back to you shortly.\n\nBest regards,\nLoco-Shop Team`,
    //   html: `<p>Hi ${name},</p><p>Thank you for contacting us!</p><p>Your message: ${message}</p><p>We'll get back to you shortly.</p><p>Best regards,<br/>Loco-Shop Team</p>`,
    // };

    // await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ message: "Contact submission received and email sent." });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "An error occurred.", error });
  }
};

export const currentLocationData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { latitude, longitude }: { latitude: number; longitude: number } =
      req.body;

    console.log(req.body, "loggg");

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({ message: "Invalid latitude or longitude" });
    }

    // Find stores within a 10 km radius of the user's location
    const nearbyStores = await StoreModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          distanceMultiplier: 0.001, // Convert distance to kilometers
          maxDistance: 10000, // 10 km in meters
          spherical: true,
        },
      },
      {
        $match: {
          city: { $exists: true },
        },
      },
    ]);

    // Group by brand name
    const brandsWithStores = await StoreModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          distanceMultiplier: 0.001, // Convert distance to kilometers
          maxDistance: 10000, // 10 km in meters
          spherical: true,
        },
      },
      {
        $match: {
          city: { $exists: true },
        },
      },
      {
        $unwind: "$brands", // Unwind the brands array to work with individual brands
      },
      {
        $group: {
          _id: {
            brandName: "$brands.brandName", // Group by brand name
            city: "$city",
            country: "$country",
          },
          stores: {
            $addToSet: {
              // Use $addToSet to avoid duplicates
              storeName: "$storeName",
              storeAddress: "$storeAddress",
              location: "$location",
              distance: "$distance",
            },
          },
          brandLogo: { $first: "$brands.brandLogo" }, // Get the brandLogo for each brand
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id field
          brandName: "$_id.brandName", // Rename _id to brandName
          city: "$_id.city", // Include city
          country: "$_id.country", // Include country
          brandLogo: 1, // Include brandLogo
          stores: 1, // Include stores array
        },
      },
      {
        $sort: { brandName: 1 }, // Sort brands alphabetically by brandName
      },
    ]);

    return res.status(200).json({
      nearbyStores,
      brandsWithStores,
      message: "Success",
    });
  } catch (error) {
    console.error("Error finding nearby stores:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllBrands = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Fetch only the _id, brandName, and brandLogo fields from the database
    const brands = await Brands.find<Brand>(
      {},
      "_id brandName brandLogo"
    ).lean();

    // Initialize an object to store the grouped brands
    const alphabeticallyGroupedBrands: {
      [key: string]: Array<{
        _id: string;
        brandName: string;
        brandLogo: string;
      }>;
    } = {};

    // Iterate over the fetched brands and group them alphabetically
    brands.forEach((brand) => {
      const firstLetter = brand.brandName.charAt(0).toUpperCase();
      const key = /^[A-Z]$/.test(firstLetter) ? firstLetter : "#";

      if (!alphabeticallyGroupedBrands[key]) {
        alphabeticallyGroupedBrands[key] = [];
      }

      // Explicitly cast _id to string
      alphabeticallyGroupedBrands[key].push({
        _id: brand._id.toString(), // Ensure _id is treated as a string
        brandName: brand.brandName,
        brandLogo: brand.brandLogo,
      });
    });

    // Sort each group alphabetically by brand name
    Object.keys(alphabeticallyGroupedBrands).forEach((key) => {
      alphabeticallyGroupedBrands[key].sort((a, b) =>
        a.brandName.localeCompare(b.brandName)
      );
    });

    // Prepare the response with sorted keys
    const sortedBrandsArray = Object.keys(alphabeticallyGroupedBrands)
      .sort() // Sort the group keys (A-Z, then #)
      .map((key) => ({
        letter: key,
        brands: alphabeticallyGroupedBrands[key],
      }));

    // Send the sorted array in the response
    return res.status(200).json({
      success: true,
      data: sortedBrandsArray,
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const countryCities = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Aggregate data to filter and group by country and list cities
    const CountryCities = await StoreModel.aggregate([
      {
        $match: {
          country: { $ne: "", $exists: true }, // Filter out empty or missing countries
          city: { $ne: "", $exists: true }, // Filter out empty or missing cities
        },
      },
      {
        $group: {
          _id: "$country",
          cities: { $addToSet: "$city" }, // Add unique cities for each country
        },
      },
      {
        $project: {
          _id: 0,
          countryName: "$_id", // Rename _id to countryName
          cities: 1, // Keep cities field
        },
      },
    ]);

    // Send the response
    return res.status(200).json({
      success: true,
      data: CountryCities,
    });
  } catch (error) {
    console.error("Error fetching countries and cities:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const allData = async (req: Request, res: Response) => {
  try {
    // Fetch all stores from the database with brands populated
    const stores = await StoreModel.find().populate(
      "brands",
      "brandName brandLogo"
    );

    // Create a map to hold the formatted data
    const brandMap: any = {};

    // Iterate over each store
    stores.forEach((store: any) => {
      store.brands.forEach((brand: any) => {
        // Check if the brand already exists in the map
        if (!brandMap[brand.brandName]) {
          brandMap[brand.brandName] = {
            brand_name: brand.brandName,
            brand_logo: brand.brandLogo,
            country: {},
          };
        }

        // Check if the country exists under the brand
        if (!brandMap[brand.brandName].country[store.country]) {
          brandMap[brand.brandName].country[store.country] = {
            country_name: store.country,
            country_city: {},
          };
        }

        // Check if the city exists under the country
        if (
          !brandMap[brand.brandName].country[store.country].country_city[
            store.city
          ]
        ) {
          brandMap[brand.brandName].country[store.country].country_city[
            store.city
          ] = {
            city_name: store.city,
            city_stores: [],
          };
        }

        // Add the store under the city
        brandMap[brand.brandName].country[store.country].country_city[
          store.city
        ].city_stores.push({
          store_name: store.storeName,
          store_address: store.storeAddress,
          latitude: store.location.coordinates[1], // Latitude
          longitude: store.location.coordinates[0], // Longitude
          googleMapUrl: store.googleMapUrl,
          store_id: store._id, // Object ID of the store
        });
      });
    });

    // Convert the map to the desired array format and sort brands alphabetically
    const sortedBrands = Object.keys(brandMap)
      .sort((a, b) => a.localeCompare(b)) // Sorting brand names alphabetically
      .map((brandKey) => {
        const countries = Object.keys(brandMap[brandKey].country).map(
          (countryKey) => {
            const cities = Object.keys(
              brandMap[brandKey].country[countryKey].country_city
            ).map((cityKey) => {
              return {
                city_name: cityKey,
                city_stores:
                  brandMap[brandKey].country[countryKey].country_city[cityKey]
                    .city_stores,
              };
            });

            return {
              country_name: countryKey,
              country_city: cities,
            };
          }
        );

        return {
          brand_name: brandMap[brandKey].brand_name,
          brand_logo: brandMap[brandKey].brand_logo,
          country: countries,
        };
      });

    // Group by alphabet
    const data: any[] = [];
    let currentAlphabet = "";

    sortedBrands.forEach((brandData) => {
      const brandFirstLetter = brandData.brand_name.charAt(0).toUpperCase();

      // Check if the alphabet section needs to be created
      if (brandFirstLetter !== currentAlphabet) {
        currentAlphabet = brandFirstLetter;

        // Add the new alphabet group
        data.push({
          alphabet: currentAlphabet,
          brands: [],
        });
      }

      // Add brand under the current alphabet group
      data[data.length - 1].brands.push(brandData);
    });

    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};


export const countData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Filter out empty or null values for cities, countries, and brands
    const totalCities = (
      await StoreModel.distinct("city", { city: { $ne: "", $exists: true } })
    ).length;

    const totalCountries = (
      await StoreModel.distinct("country", { country: { $ne: "", $exists: true } })
    ).length;

    const totalBrands = (
      await StoreModel.distinct("brands.brandName", { "brands.brandName": { $ne: "", $exists: true } })
    ).length;

    // Log the counts
    console.log(`Total Cities: ${totalCities}`);
    console.log(`Total Countries: ${totalCountries}`);
    console.log(`Total Brands: ${totalBrands}`);

    // Return the counts in the response
    return res.status(200).json({
      totalCities,
      totalCountries,
      totalBrands,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
           