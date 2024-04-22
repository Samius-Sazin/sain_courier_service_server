//For env
require('dotenv').config();

//For MongoDB
const { MongoClient } = require('mongodb');

//For CORS
const cors = require('cors');

//for use nodeJS by using expressJS
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Access-Control-Allow-Origin / CORS policy
// Set up CORS
app.use(cors());
app.use(express.json());

//MongoDB Part
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jmx7rsi.mongodb.net/`;
const client = new MongoClient(uri);

async function run() {
    try {
        // Access Database
        const database = client.db("sain_courier_service");
        //Access Collection of sain_courier_service database
        const servicesCollection = database.collection("services");

        app.get('/services', async (req, res) => {
            //Cursor is like have all services
            const cursor = servicesCollection.find({});
            //Convert to Array to use the data that curos holding
            const services = await cursor.toArray();
            //sendi response of all services
            res.send(services);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

//Send response From Server
app.get('/', (req, res) => {
    res.send("Responsing from 5000");
})

app.listen(port, () => {
    console.log("PORT : ", port);
})