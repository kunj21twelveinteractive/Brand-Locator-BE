import mongoose, { Schema, model } from 'mongoose';
import { Store } from '../interface/storeDataInterface';
const brandSchema: Schema = new Schema({
    brandName: { type: String},
    brandLogo: { type: String },
  });
  
  // Create the Store schema
  const StoreSchema: Schema = new Schema({
    country: { type: String },
    city: { type: String},
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number]}, // [longitude, latitude]
      },
    storeName: { type: String },
    storeAddress: { type: String },
    brands: [brandSchema],
  });
  
  StoreSchema.index({ location: '2dsphere' });
  // Create the Store model
  const StoreModel = mongoose.model<Store>('Store', StoreSchema);
  
  export default StoreModel;