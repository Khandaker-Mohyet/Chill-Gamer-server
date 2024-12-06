const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 4000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json());

// Chill-Gamer
// kLXRUXoTRFoECUN7



const uri = "mongodb+srv://Chill-Gamer:kLXRUXoTRFoECUN7@cluster0.47f5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.47f5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const gameCollection = client.db('gamerDB').collection('gamer');
    const userCollection = client.db('gamerDB').collection('users');

    app.post("/gamer", async (req, res) => {
      const newGamer = req.body;
      const result = await gameCollection.insertOne(newGamer)
      res.send(result)
    })

    app.get("/gamer", async (req, res) => {
      const cursor = gameCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get("/gamer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await gameCollection.findOne(query)
      res.send(result)
    })

    app.get("/gamer/:email", async (req, res) => {
      const email = req.body.email;
      const filter = {email}
    })

    // user

    app.get('/users', async (req, res) => {
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const newUsers = req.body;
      const result = await userCollection.insertOne(newUsers)
      res.send(result)
    })

    app.patch('/users', async(req, res) => {
      const email = req.body.email;
      const filter = { email }
      const updatedDoc = {
        $set: {
          lastSignInTime:req.body?.lastSignInTime
        }
      }
      const result = await userCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Khandaker Mohyet work station')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})