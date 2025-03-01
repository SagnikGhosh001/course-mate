import { z } from "zod";
import { emailValidation, nameValidation, passwordValidation, usernameValidation } from "./userSchema";




export const signUpSchema = z.object({
    name: nameValidation,

    username: usernameValidation,

    email: emailValidation,

    password: passwordValidation


});
