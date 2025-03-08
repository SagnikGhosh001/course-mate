


import { z } from "zod";

import { descriptionValidation, priceValidation, titleValidation, typeValidation } from "./courseSchema";





export const updateCourseSchema = z.object({
    title:titleValidation,
    description:descriptionValidation,
    price:priceValidation,
    type:typeValidation,




});
