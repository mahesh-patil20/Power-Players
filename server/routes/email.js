const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/send-email", async (req, res) => {
  const { time, image } = req.body;
  console.log("INSIDE SEND EMAIL", req.body);

  // Create a Nodemailer transporter using SMTP
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Your SMTP server host
    port: 465, // Port // true for 465, false for other ports
    auth: {
      user: "maxfurry3009@gmail.com", // Your email address
      pass: "ixwx wnax livu utbh", // Your generated app password
    },
  });

  // Email message options
  let mailOptions = {
    from: "maxfurry3009@gmail.com", // Sender address
    to: "udit.rao@spit.ac.in", // List of recipients
    subject: "Intrusion at " + time, // Subject line
    text: "Image captured at " + time, // Plain text body
    attachments: [
      {
        filename: "image.jpg", // Name of the attached file
        content: image, // Base64 encoded image data
        encoding: "base64",
      },
    ],
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred:", error.message);
      res
        .status(500)
        .json({ error: "An error occurred while sending the email." });
    } else {
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Email sent successfully." });
    }
  });
});

module.exports = router;
