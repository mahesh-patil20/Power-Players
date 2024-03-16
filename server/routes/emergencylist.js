const express = require('express');
const router = express.Router();
const EmergencyContactList = require('../models/EmergencyContacts'); // Assuming your Blog model is defined in a separate file

router.get('/getEmergencyList', async (req, res) => {
    try {
        const emergencyList = await EmergencyContactList.find();
        res.status(200).json(emergencyList);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the emergency list" });
    }
});

router.post('/addEmergencyList', async (req, res) => {
    try {
        const { name, contact, email, relationship } = req.body;
        console.log("INSIDE ADD EMERGENCY LIST", req.body)
        if (!name || !contact || !email || !relationship) {
            return res.status(400).json({ error: "Please fill the required fields" });
        }
        const emergencyContact = new EmergencyContactList({ name, contact, email, relationship });
        await emergencyContact.save();
        return res.status(200).json({ msg: "Emergency contact added successfully" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while adding the emergency contact" });
    }
}

);

router.delete('/deleteEmergencyList/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const emergencyContact = await EmergencyContactList.findByIdAndDelete(id);
        if (!emergencyContact) {
            return res.status(400).json({ error: "No emergency contact found with this id" });
        }
        return res.status(200).json({ msg: "Emergency contact deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while deleting the emergency contact" });
    }
}
);


module.exports = router;
