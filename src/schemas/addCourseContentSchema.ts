import {z} from "zod";
import { descriptionValidation,titleValidation } from "./courseContent";


export const addCourseContentSchema=z.object({
    title:titleValidation,
    description:descriptionValidation
})