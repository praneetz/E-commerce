const joi = require("joi");
 exports.validateAuth=  (data) => {
  try {
    const validateSchema = joi.object({
      firstName: joi.string().required().min(2).max(10),
      lastName: joi.string().required().min(2).max(10),
      email: joi.string().required().email(),
      mobile: joi
        .string()
        .required()
        .regex(/^[0-9]{10}$/),
      password: joi.string().required().min(4),
    });
     return validateSchema.validate(data, {
      abortEarly: false,
    });
  } catch (err) {
    console.log(err);
  }
};
