
import nodeMiler from "nodemailer"

export const sendEmail = async(options)=>{
   const transporter = nodeMiler.createTransport({
     service: process.env.SMPT_SERVICE,
     auth: {
       user: process.env.SMPT_USER,
       pass: process.env.SMPT_PASSWORD,
     },
   });
   const mailOptions = {
     from: process.env.SMPT_USER,
     to: options.email,
     subject: options.subject,
     text: options.message,
   };
   await transporter.sendMail(mailOptions)

}