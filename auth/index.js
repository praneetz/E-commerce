const auth = require("../models/auth");
const { validateAuth } = require("../models/validation/auth");
exports.createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { error } = validateAuth(req.body);
    if (error) {
      let ErrorData = [];
      error.details.map((er) => {
        let splitedError = er.message.split(`"`);
        ErrorData.push(`${splitedError[1]}${splitedError[2]}`);
      });
      return res.status(400).json({ message: ErrorData });
    }

    const isEmailExist = await auth.findOne({ email: req.body.email });
    const isPhoneExist = await auth.findOne({ mobile: req.body.mobile });
    if (isEmailExist || isPhoneExist)
      return res
        .status(400)
        .json({
          message: "Already existing user with given email and mobile number",
        });
    const newAuth = new auth(req.body);
    const isCreated = await newAuth.save();
    if (!isCreated)
      return res.status(400).json({ message: "Something went wrong" });
    return res.status(200).json({ message: "Register Successfull!" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Something went wrong" });
  }
};
