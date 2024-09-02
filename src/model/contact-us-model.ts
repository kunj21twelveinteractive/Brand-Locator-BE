import { Schema, model } from "mongoose";
import { IContactUs } from "../interface/contact-us-Interface"

const ContactUsSchema = new Schema<IContactUs>(
  {
    email: {
      type: String,

    },
    topic: {
      type: String,
      
    },
    name: {
      type: String,
    
    },
    message: {
      type: String,
 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ContactUs = model<IContactUs>("ContactUs", ContactUsSchema);

export default ContactUs;
