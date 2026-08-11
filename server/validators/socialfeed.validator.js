import Joi from "joi";

export const socialmediaSchema = Joi.object({
  // Social Media Platform Name
  url: Joi.string().uri().optional().allow("", null),
  public_id: Joi.string().optional().allow("", null),

  // Images array
  images: Joi.any().optional(),
});
