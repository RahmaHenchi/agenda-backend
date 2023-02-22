const express = require('express');
const mongoose = require('mongoose');


const app = express();

app.use((req, res) => {
    res.json({ message: "Hello from Express" });
})

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.DB_CONNECTION)
        .then(() => {
            console.log('Successfully connected to MongoDB');
            app.listen(PORT, () => {
                console.log(`Server is listening on port ${PORT}`);
            });
        })
        .catch(error => {
            console.log(error);
        })