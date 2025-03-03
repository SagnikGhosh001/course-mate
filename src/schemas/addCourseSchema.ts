import { z } from "zod";

import { descriptionValidation, priceValidation, titleValidation, typeValidation } from "./courseSchema";





export const addCourseSChema = z.object({
    title:titleValidation,
    description:descriptionValidation,
    price:priceValidation,
    type:typeValidation



});
