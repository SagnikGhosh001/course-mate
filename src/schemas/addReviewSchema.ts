import {z} from"zod"
import { messageValidation, ratingValidation } from "./reviewSchema"

export const addReviewSchema = z.object({
    rating:ratingValidation,
    message:messageValidation
});