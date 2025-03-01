import { z } from "zod";

export const titleValidation = z
    .string()
    .min(3, "Title must be atleast 3 characters")
    .max(50, "Title must not be Longer than 50 characters")

export const descriptionValidation = z
    .string()
    .min(3, "Description must be atleast 3 characters")
    .max(500, "Description must not be Longer than 500 characters")
