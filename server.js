const { MongoClient, ObjectId } = require('mongodb');
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

        // data single get 
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const quary = { _id: ObjectId(id) }
            const result = await mydatabase.findOne(quary)
            res.send(result)
        })
        //put api 
        app.put('/places/:id', async (req, res) => {
            const id = req.params.id;
            const quare = { _id: ObjectId(id) }
            const data = req.body
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    title: data.title,
                    img: data.img,
                    ticket: data.ticket,
                    hotelP: data.hotelP,
                    discription: data.discription,
                    date: data.date,
                },
            };
            console.log("data", data)
            const result = await mydatabase.updateOne(quare, updateDoc, options)
            console.log('updating users', id)
            res.json(result)
        })
        // data post
        app.post('/places', async (req, res) => {
            console.log(req.body)
            const result = await mydatabase.insertOne(req.body)
            res.json('result')
        })
        //delete user
        app.delete('/places/:id', async (req, res) => {
            const id = req.params.id;
            const quare = { _id: ObjectId(id) }
            const result = await mydatabase.deleteOne(quare)
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