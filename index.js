const express = require('express');
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');
require('dotenv').config()

// middleware
app.use(cors())
app.use(express.static("public"))
app.use(express.json())


// uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zmpua4z.mongodb.net/?retryWrites=true&w=majority`;

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
    // awaitclient.connect();

    // db and Collection
    const userCollection = client.db("EasyAdmission").collection("users")
    const collegeCollection = client.db("EasyAdmission").collection("colleges");
    const reviewsCollection = client.db("EasyAdmission").collection("review");
    const researchPaperCollection = client.db("EasyAdmission").collection("research-paper");
    const selectedCollegesCollection = client.db("EasyAdmission").collection("selectedCollege");
    

   // colleges data
    app.get("/colleges", async (req, res) => {
      const result = await collegesCollection.find().toArray();
      res.send(result);
    });

    app.get("/colleges/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collegesCollection.findOne(query);
      res.send(result);
    });

    // review data
    app.get("/review", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });
    // research paper data
    app.get("/researchPapers", async (req, res) => {
      const result = await researchPaperCollection.find().toArray();
      res.send(result);
    });
    // selected colleges
    app.get("/selectedColleges", async (req, res) => {
      const result = await selectedCollegesCollection.find().toArray();
      res.send(result);
    });
    app.post("/selectedColleges", async (req, res) => {
      const college = req.body;
      const result = await selectedCollegesCollection.insertOne(college);
      res.send(result);
    });


    // -----END-----

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
  res.send('Easy Admission On going.')
})

// Start the server
app.listen(port, () => {
  console.log(`Server listening by me at port ${port}`);
});