import nodemailer from "nodemailer";
import { config } from "dotenv";
config();

/**
 * transporter con i dati del servizio utilizzato per la mail
 */
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASSWORD,
  },
});

/**
 * funzione che invia un token randomico per email e permette il reset della password
 * @param token token random per il reset della password
 * @param mail mail dell'utente
 */
export async function sendMail(token: string, mail: string) {
  let mailOptions = {
    from: "squealer@noreply.com",
    to: mail,
    subject: "Password reset",
    html: `<h1>Reset passoword</h1><br><p>Your password reset token is ${token}</p>`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
