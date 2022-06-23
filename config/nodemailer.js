const nodemailer=require("nodemailer")

module.exports=nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODE_MAILER_EMAIL, 
      pass: process.env.NODE_MAILER_PASSWORD
    }
})