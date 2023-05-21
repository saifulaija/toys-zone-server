const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pfbgofj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    

    //     const toyCollection = client.db('toysZone').collection('toys');

    const toysCollection = client.db("toysZone").collection("newToys");
    console.log("database connected");

    //     index created

    const indexKeys = { toyName: 1, Category: 1 };
    const indexOptions = { name: "category" };
    const result = await toysCollection.createIndex(indexKeys, indexOptions);

    app.get("/toysSearch/:text", async (req, res) => {
      const searchText = req.params.text;
      const result = await toysCollection
        .find({
          $or: [
            { toyName: { $regex: searchText, $options: "i" } },
            { Category: { $regex: searchText, $options: "i" } },
          ],
        })
        .limit(20)
        .toArray();
      res.send(result);
    });

   
    app.get("/someToys", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const result = await toysCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/setToys", async (req, res) => {
      console.log(req.body);

      const body = req.body;

      body.createdAt = new Date();
      const result = await toysCollection.insertOne(body);
      res.send(result);
    });

    app.delete("/setToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    app.put("/setToys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedToy = req.body;
      const toy = {
        $set: {
          price: updatedToy.price,
          quantity: updatedToy.quantity,
          description: updatedToy.description,
        },
      };

      const result = await toysCollection.updateOne(filter, toy, options);
      res.send(result);
    });

    app.get("/allToys", async(req, res) => {
      const result = await toysCollection.find({}).toArray();
      res.send(result);
    });


//     view details id get

app.get('/detailsId/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toysCollection.findOne(query);
      res.send(result);
})


// filter by category
 app.get("/filter/:text", async(req,res)=>{
  console.log(req.params.text);
   if(req.params.text == "Police" || req.params.text == "Regular" || req.params.text == "Sports"){
    const result = await toysCollection.find({Category:req.params.text}).toArray();
    console.log(result);
    return res.send(result)
   }

   const result = await toysCollection.find({}).toArray();
   res.send(result)



 })
// for sorting

 app.get('/toys', async(req, res)=>{
  const result = await toysCollection.find({}).sort({name:1}).toArray();
  res.send(result);
 })



 app.get('/sorts', async(req, res)=>{
   const result = await toysCollection.find({}).sort({price:-1}).toArray();
   res.send(result)
 })

 app.get('/sortsD', async(req, res)=>{
  const result = await toysCollection.find({}).sort({price: 1}).toArray();
  res.send(result)
 })

    


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //     await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("Toys is running.....");
});

app.listen(port, () => {
  console.log(`Toys is running on port:${port}`);
});

