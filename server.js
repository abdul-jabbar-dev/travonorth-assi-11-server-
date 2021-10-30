const { MongoClient } = require('mongodb');
const express = require("express")
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()


app.use(express.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.x47kq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//using mongodb atlas database
async function run() {
    try {
        await client.connect();
        const database = client.db("travnorth");
        const mydatabase = database.collection("places");
        // data get
        app.get('/places', async (req, res) => {
            const inter = mydatabase.find({})
            const user = await inter.toArray()
            res.send(user)
        })
        // data post
        app.post('/places', async (req, res) => {
            console.log(req.body)
            const result = await mydatabase.insertOne(req.body)
            res.json(result)
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Runnig server 200')
})

app.listen(port, () => {
    console.log('runnig my port', port)
})