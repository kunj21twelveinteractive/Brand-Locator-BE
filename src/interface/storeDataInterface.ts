import { Document } from 'mongoose';

export interface Brand {
    brandName: string;
    brandLogo: string;
  }
  
  // Define the Store interface extending Document
 export interface Store extends Document {
    country: string;
    city: string;
    lat: number;
    long: number;
    storeName: string;
    storeAddress: string;
    brands: Brand[];
    googleMapUrl:string;
  }