// import mongoose, { Schema, model } from 'mongoose';
// import { IStore } from '../interface/staticInterface';

// const StoreSchema: Schema = new Schema({
//     country: { type: String },
//     city: { type: String },
//     location: {
//       type: { type: String, enum: ['Point'], default: 'Point' },
//       coordinates: { type: [Number], required: true }, // [longitude, latitude]
//     },
//     storeName: { type: String },
//     storeAddress: { type: String },
//     brand: {
    
        

//     },
//   });
  
//   // Create a 2dsphere index on the location field
//   StoreSchema.index({ location: '2dsphere' });

//   const Store = mongoose.model<IStore>('Store', StoreSchema);
  
//   export default Store;