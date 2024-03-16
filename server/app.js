const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
require('./db/conn');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT;
const app = express();
app.use(bodyParser.json({ limit: '20mb' })); // Adjust the limit as needed
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(require('./routes/auth'));
app.use(require('./routes/intruders'));
app.use(require('./routes/allowedlist'));
app.use(require('./routes/emergencylist'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;