const express = require('express');
const router = express.Router();
const Intruders = require('../models/Intruders'); // Assuming your Blog model is defined in a separate file
const Status = require('../models/AlarmStatus'); // Assuming your Blog model is defined in a separate file

router.get('/getIntruders', async (req, res) => {
    try {
        const intruders = await Intruders.find();
        return res.status(200).json(intruders);
    } catch (error) {
        return res.status(500).json({ error: "Some error occured" });
    }
}
);

router.get('/getLatestIntruderImage', async (req, res) => {
    try {
        // Find the latest intruder by sorting in descending order and limiting to 1
        // console.log("Inside getLatestIntruderImage")    
        const latestIntruder = await Intruders.find({}, { intruder_image_base64: 1, _id: 0 })
                                            .sort({ timestamp: -1 })
                                            .limit(1);
        return res.status(200).json(latestIntruder);
    } catch (error) {
        return res.status(500).json({ error: "Some error occurred" });
    }
});




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



router.post('/setalarmstatus', async (req, res) => {
    console.log("Inside setalarmstatus")
    try {
        const currStatus = req.body.status;
        // console.log("status:", currStatus);

        // Find the existing document or create a new one if it doesn't exist
        const result = await Status.findOneAndUpdate(
            {},
            { systemStatus: currStatus },
            { upsert: true, new: true }
        );

        // console.log("Result:", result);

        return res.status(200).json({ message: "Status updated successfully", result });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Some error occurred" });
    }
});

router.get('/getalarmstatus', async (req, res) => {
    console.log("Inside getalarmstatus")
    try {
        const status = await Status.find();
        // console.log("CURRENT STATUS: ", status[0].systemStatus);
        return res.status(200).json(statusstatus[0].systemStatus);
    } catch (error) {
        return res.status(500).json({ error: "Some error occurred" });
    }
});
module.exports = router;
