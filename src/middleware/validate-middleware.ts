import { Request, Response, NextFunction } from "express";
import { Schema, ValidationResult } from "joi";

const validate = (schema: Schema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value }: ValidationResult = schema.validate(req.body, { abortEarly: false });

    if (error) {
      console.error('Validation error:', error); // Log the full error object
      const status = 400;
      const message = error.details.map(detail => ({
        path: detail.path,
        message: detail.message
      }));
      return res.status(status).json({ status, message });
    }

    req.body = value; // Assign the validated value to req.body
    next();
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ status: 500, message: "Server Error" });
  }
};

export default validate;
