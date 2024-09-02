
import Joi from "joi";

export const contactUsValidation = Joi.object({
  email: Joi.string().email().required(),
  topic:Joi.required(),
  name: Joi.string().required(),
  message: Joi.string().required()
});


export const geoLocationSchema = Joi.object({
  latitude: Joi.number()
      .required()
      .min(-90)
      .max(90)
      .messages({
          'number.base': 'Latitude must be a number',
          'number.min': 'Latitude must be between -90 and 90',
          'number.max': 'Latitude must be between -90 and 90',
          'any.required': 'Latitude is required',
      }),
  longitude: Joi.number()
      .required()
      .min(-180)
      .max(180)
      .messages({
          'number.base': 'Longitude must be a number',
          'number.min': 'Longitude must be between -180 and 180',
          'number.max': 'Longitude must be between -180 and 180',
          'any.required': 'Longitude is required',
      }),
});
;
