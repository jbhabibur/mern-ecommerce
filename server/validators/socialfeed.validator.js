import Joi from "joi";

export const socialmediaSchema = Joi.object({
  // URL এবং public_id অপশনাল রাখুন
  url: Joi.string().uri().optional().allow("", null),
  public_id: Joi.string().optional().allow("", null),

  // 'images' ফিল্ডটি আসার অনুমতি দিন (এটিই আপনার এরর ফিক্স করবে)
  images: Joi.any().optional(),
});
