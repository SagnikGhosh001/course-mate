import { z } from "zod";
import { emailValidation, genderValidation, nameValidation, passwordValidation } from "./userSchema";




export const addAdminOrCreatorSchema = z.object({
    name: nameValidation,

    email: emailValidation,

    password: passwordValidation,

    gender: genderValidation,
    role:z.enum(["admin", "creator", "user"],{message:"role must be admin or creator or user"}),
});
