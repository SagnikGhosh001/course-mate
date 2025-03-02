import { z } from "zod";
import { descriptionValidation, titleValidation } from "./topicSchema";





export const addTopicSChema = z.object({
    title:titleValidation,
    description:descriptionValidation


});
