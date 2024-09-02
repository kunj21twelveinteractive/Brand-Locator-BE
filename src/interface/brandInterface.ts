import { Schema, model, Document } from 'mongoose';

// Define an interface for the Brand document
export interface IBrand extends Document {
  brandName: string;
  brandLogo: string;
}