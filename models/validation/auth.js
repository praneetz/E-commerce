const joi = require("joi");
const validateAuth = async (req, res, next) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;
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
    const { error } = await validateSchema.validate(req.body, {
      abortEarly: false,
    });
    if (!error) return next();
    const { details } = error;
    const Errors = [];
    details.map((err) => {
      const splitedMsg = err.message.split(`"`);
      Errors.push(`${splitedMsg[1]}${splitedMsg[2]}`);
    });
    return res.status(400).send(Errors);
  } catch (err) {
    console.log(err);
  }
};
module.exports = validateAuth;
