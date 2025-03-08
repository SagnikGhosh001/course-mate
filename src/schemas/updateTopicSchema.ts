


import { z } from "zod";
import { descriptionValidation, titleValidation } from "./topicSchema";





export const updateTopicSchema = z.object({
    title:titleValidation,
    description:descriptionValidation,


});
