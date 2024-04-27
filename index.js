//For env
require('dotenv').config();

//For MongoDB
const { MongoClient, ObjectId } = require('mongodb');

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
        //Access services Collection of sain_courier_service database
        const servicesCollection = database.collection("services");
        //Access booking_info Collection of sain_courier_service database
        const bookingInfoCollection = database.collection("booking_info");

        //return all services
        app.get('/services', async (req, res) => {
            //Cursor is like have all services
            const cursor = servicesCollection.find({});
            //Convert to Array to use the data that curos holding
            const services = await cursor.toArray();
            //sendig response of all services
            res.send(services);
        })

        //get id of service, find from DB with id and return it
        app.get('/services/:id', async (req, res) => {
            //get the id that need to be search
            const id = req.params.id;
            //set query
            const query = { _id: new ObjectId(id) };
            // result will have the searched item
            const service = await servicesCollection.findOne(query);
            //sendig response of that services
            res.send(service);
        })

        //Get booking information from react, set to mongoDB
        app.post('/book-service', async (req, res) => {
            //object that need to be insert
            const bookingInfo = req.body;
            //get time and add to bookingInfo
            bookingInfo.bookedAt = new Date();
            //Insert document into the booking_info collection
            const result = await bookingInfoCollection.insertOne(bookingInfo);
            //sending the response
            res.send(result);
        })

        // return myOrders, searching by gmail
        app.post('/my-orders', async (req, res) => {
            // get the email
            const email = req.body.userEmail;
            //query that need to be search
            const query = { userEmail: email };
            ////Cursor is like have all myOrders
            const cursor = bookingInfoCollection.find(query);
            ////Convert to Array to use the data that cursor holding
            const myOrders = await cursor.toArray();
            //send response
            res.send(myOrders);
        })

        // delete my orders
        app.delete('/orders/delete', async (req, res) => {
            // id of order, that need to be deleted
            const id = req.body;
            //set querry
            const query = { _id: new ObjectId(id) };
            //get the confirmation of delete
            const result = await bookingInfoCollection.deleteOne(query);
            //sending response
            res.send(result);
        })

        //get all orders that have been placed
        app.get('/manage-all-orders', async (req, res) => {
            //Cursor is like have all Orders
            const cursor = bookingInfoCollection.find({});
            //Convert to Array to use the data that curos holding
            const services = await cursor.toArray();
            //sendig response of all services
            res.send(services);
        })

        //Add a new service, get data from react, add to db
        app.post('/add-new-service', async (req, res) => {
            //service that need to be insert
            const newService = req.body;
            //Insert document into the services collection
            const result = await servicesCollection.insertOne(newService);
            //sending the response
            res.send(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

//Send response From Server
app.get('/', (req, res) => {
    res.send("Responsing");
})

app.listen(port, () => {
    console.log("PORT : ", port);
})