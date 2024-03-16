const mongoose = require('mongoose');

const db = process.env.MONGODB_URL;
mongoose.connect(db).then(()=>{
    console.log("Connection Successful");
}).catch((err) => {
    console.log("Connection failed");
    console.log(err)
});