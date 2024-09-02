import { Schema, model } from "mongoose";
import { IBrand } from "../interface/brandInterface";
// Define the Brand schema

const brandSchema = new Schema<IBrand>({
    brandName: {
      type: String,

    },
    brandLogo: {
      type: String,
    },
  }, {
    timestamps: true, // Adds createdAt and updatedAt fields
  });
  
  // Create the Brand model
  const Brand = model<IBrand>('Brand', brandSchema);
  
  export default Brand;