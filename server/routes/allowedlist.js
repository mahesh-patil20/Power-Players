const express = require('express');
const router = express.Router();
const AllowedUserList = require('../models/AllowedUsers'); // Assuming your Blog model is defined in a separate file

const nodemailer = require("nodemailer");

router.post("/send-email", async (req, res) => {
  const { time, image } = req.body;
  console.log("INSIDE SEND EMAIL", req.body);

  // Create a Nodemailer transporter using SMTP
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Your SMTP server host
    port: 587, // Port
    secure: false, // Upgrade later with STARTTLS
    auth: {
      user: "warrior786Test@gmail.com", // Your email address
      pass: "Warrior@123", // Your password
    },
  });

  // Email message options
  let mailOptions = {
    from: "warrior786Test@gmail.com", // Sender address
    to: "mahesh.patil@spit.ac.in", // List of recipients
    subject: "Image at " + time, // Subject line
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
router.post('/addAllowedList', async (req, res) => {
    try {
        const { name, contact, image } = req.body;
        console.log("INSIDE ADD ALLOWED LIST", req.body)
        if (!name || !contact || !image) {
            return res.status(400).json({ error: "Please fill the required fields" });
        }
        const allowedUser = new AllowedUserList({ name, contact, image });
        await allowedUser.save();
        return res.status(200).json({ msg: "Allowed user added successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Some error occured" });
    }
}
);

router.get('/getAllowedList', async (req, res) => {
    try {
        const allowedUsers = await AllowedUserList.find();
        return res.status(200).json(allowedUsers);
    } catch (error) {
        return res.status(500).json({ error: "Some error occured" });
    }
});

router.delete('/deleteAllowedList/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const allowedUser = await AllowedUserList.findByIdAndDelete(id);
        if (!allowedUser) {
            return res.status(400).json({ error: "No allowed user found with this id" });
        }
        return res.status(200).json({ msg: "Allowed user deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Some error occured" });
    }
});



module.exports = router;
