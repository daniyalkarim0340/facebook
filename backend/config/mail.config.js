import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host:process.env.HOST,
  port: process.env.PORTNO,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD  ,
  },
});


