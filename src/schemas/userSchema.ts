import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(3, "Username Must be ateleast 3 characters")
    .max(20, "Username Must not be longer that 50 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special characters")

export const nameValidation = z
    .string()
    .min(2, "Name Must be atleast 2 characters")
    .max(50, "Name Must not be longer that 50 characters")

export const emailValidation = z.string().email({ message: "invalid email address" })

export const passwordValidation = z.string().min(6, "password must contain atleast 6 characters")

export const verifiedOtpValidation = z.string().length(6, "OTP must be 6 characters long")

export const isVerifiedValidation = z.boolean()