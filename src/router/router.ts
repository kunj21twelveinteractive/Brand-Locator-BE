import { Router } from "express";
import validate from "../middleware/validate-middleware";
import {
  contactUsValidation,
  geoLocationSchema,
} from "../validation/contact-us-validation";
import {
  allData,
  contactUs,
  countData,
  countryCities,
  currentLocationData,
  getAllBrands,
} from "../controller/shopController";
import express, { Request, Response } from "express";

import multer from "multer";
import path from "path";
import { Store } from "../interface/storeDataInterface";
import StoreModel from "../model/storeDataModel";

// Set up storage with Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); // Generate a unique filename
  },
});

const upload = multer({
  storage: storage,
}).fields([
  { name: "brands[0][brandLogo]", maxCount: 1 },
  { name: "brands[1][brandLogo]", maxCount: 1 },
  { name: "brands[2][brandLogo]", maxCount: 1 },
  { name: "brands[3][brandLogo]", maxCount: 1 },
  { name: "brands[4][brandLogo]", maxCount: 1 },
]);

const router = Router();

//Insert Data
router.post("/store", upload, async (req: Request, res: Response) => {
  try {
    console.log(req.body, "store data");

    const { country, city, storeName, storeAddress, brands } = req.body;
    const { type, coordinates } = req.body.location;

    // Remove quotes and parse coordinates as numbers
    const latitude = parseFloat(coordinates[1].replace(/"/g, ""));
    const longitude = parseFloat(coordinates[0].replace(/"/g, ""));

    if (type !== "Point" || isNaN(latitude) || isNaN(longitude)) {
      return res
        .status(400)
        .json({ error: "Invalid latitude or longitude values" });
    }

    const brandFiles = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const brandData = brands.map((brand: any, index: number) => {
      return {
        brandName: brand["brandName"],
        brandLogo: `/${brandFiles[`brands[${index}][brandLogo]`][0].path}`, // Save file path in database
      };
    });

    const newStore: Store = new StoreModel({
      country,
      city,
      location: {
        type,
        coordinates: [longitude, latitude], // Use the parsed values
      },
      storeName,
      storeAddress,
      brands: brandData,
    });

    await newStore.save();
    res.status(201).json(newStore);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Contact-Us
router.post("/contact-us", validate(contactUsValidation), contactUs);

// Get Data in Home- page
router.post("/geo-location", validate(geoLocationSchema), currentLocationData);

router.get("/all-brands", getAllBrands);

router.get("/country-city", countryCities);

// Will Get All Data, Response is Set as Brand-> Country-> city-> Store->
router.get("/all-data", allData);

router.get("/count-data", countData);

export default router;
