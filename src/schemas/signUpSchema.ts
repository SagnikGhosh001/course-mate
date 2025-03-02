import { z } from "zod";
import { emailValidation, genderValidation, nameValidation, passwordValidation } from "./userSchema";




export const signUpSchema = z.object({
    name: nameValidation,

    email: emailValidation,

    password: passwordValidation,

    gender: genderValidation


});
