import { z } from "zod";
import { messageValidation, ratingValidation } from "./feedbackSchema";

export const addFeedbackSchema=z.object({
    message:messageValidation,
    rating:ratingValidation
})