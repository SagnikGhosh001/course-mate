import { z } from "zod";
import { emailValidation, verifiedOtpValidation } from "./userSchema";





export const verifyAccountSchema = z.object({
    email:emailValidation,
    verifiedOtp:verifiedOtpValidation
});
