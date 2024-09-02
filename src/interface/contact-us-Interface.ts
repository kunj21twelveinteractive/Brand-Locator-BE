import { Document } from "mongoose";

export interface IContactUs extends Document {
  email: string;
  topic: string;
  name: string;
  message: string;
  createdAt?: Date;
}
