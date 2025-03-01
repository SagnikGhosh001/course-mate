import { z } from "zod";

export const ratingValidation = z
  .number()
  .int()
  .min(1, "Rating must be atleast 1")
  .max(5, "Rating must not be Greater than 5");

export const messageValidation = z
  .string()
  .min(3, "message must be atleast 3 characters")
  .max(100, "message must not be longer than 100 characters");
  
