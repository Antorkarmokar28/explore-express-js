const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.okbjzpm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("createUserDB").collection('users');
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await userCollection.insertOne(user)
            console.log(result);
            res.send(result)
        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const qury = {
                _id: new ObjectId(id)
            }
            const result = await userCollection.deleteOne(qury);
            res.send(result)
        })

        // get single data using id
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const qury = {
                _id: new ObjectId(id)
            }
            const result = await userCollection.findOne(qury);
            res.send(result)
        })
        // udate single user data
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = {
                _id: new ObjectId(id),
            }
            const options = { upsert: true };
            const updateDta = {
                $set: {
                    name: data.name,
                    email: data.email,
                    options: data.password,
                }
            }
            const result = await userCollection.updateOne(filter, updateDta, options);
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result)
        })
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('CRUD is runiing.....')
})

app.listen(port, () => {
    console.log(`App is runnig on port ${port}`)
})