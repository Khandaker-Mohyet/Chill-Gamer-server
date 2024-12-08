const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 4000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json());

// Chill-Gamer
// kLXRUXoTRFoECUN7

console.log(process.env.DB_USER)




// const uri = "mongodb+srv://Chill-Gamer:kLXRUXoTRFoECUN7@cluster0.47f5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.47f5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const watchList = client.db('gamerDB').collection('watchList');

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

    app.put('/gamer/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true };
      const updateGame = req.body;
      const game = {
        $set: {
          photo: updateGame.photo,
          name: updateGame.name,
          description: updateGame.description,
          rating: updateGame.rating,
          year: updateGame.year,
          genres: updateGame.genres,
          email: updateGame.email,
          userName: updateGame.userName
        }
      }
      const result = await gameCollection.updateOne(filter, game, option)
      res.send(result)
    })

    app.delete('/gamer/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await gameCollection.deleteOne(query)
      res.send(result)
    })

    app.get("/top-reviews", async (req, res) => {
      const topReview = await gameCollection
        .find({})
        .sort({ rating: -1 })
        .limit(6)
        .toArray();
      res.json(topReview);
    });

    // watchList

    app.post("/watchList", async (req, res) => {
      const newGamer = req.body;
      const result = await watchList.insertOne(newGamer)
      res.send(result)
    })

    app.get("/watchList", async (req, res) => {
      const cursor = watchList.find()
      const result = await cursor.toArray()
      res.send(result)
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