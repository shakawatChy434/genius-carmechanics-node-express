const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kmnbr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const serviceCollection = database.collection("services");

        // GET API(Work no:02)
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        // Get Single data (Work no:03) [Single id nethe cayle age Opore "ObjectId " ke input korthe hobe]
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const querry = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(querry);
            res.json(result);
        })

        //POST API(Work no:01)
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            // console.log('Hit the post api');
            res.json(result);
        });
        // DELETE API 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const querry = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(querry);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

// Server Site Testing
app.get('/', (req, res) => {
    // console.log("Simple Cur Services are connected", req);
    res.send("Server is connected")
});
//  Server Testing
app.listen(port, () => {
    console.log('server location port is', port)
});