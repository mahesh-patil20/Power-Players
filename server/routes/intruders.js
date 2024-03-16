const express = require('express');
const router = express.Router();
const Intruders = require('../models/Intruders'); // Assuming your Blog model is defined in a separate file


router.get('/getIntruders', async (req, res) => {
    try {
        const intruders = await Intruders.find();
        return res.status(200).json(intruders);
    } catch (error) {
        return res.status(500).json({ error: "Some error occured" });
    }
}
);


router.post('/deleteintruders', async (req, res) => {
    console.log("Inside deleteintruders")
    try {
        const intruders = await Intruders.deleteMany();
        return res.status(200).json(intruders);
    } catch (error) {
        return res.status(500).json({ error: "Some error occured" });
    }
}
);


module.exports = router;
