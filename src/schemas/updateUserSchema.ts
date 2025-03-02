import { z } from "zod";
import {genderValidation, nameValidation } from "./userSchema";




export const updateUserSchema = z.object({
    name: nameValidation,

    gender: genderValidation


});
