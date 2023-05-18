
const express =require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

//     const toyCollection = client.db('toysZone').collection('toys');
    const toysCollection = client.db('toysZone').collection('newToys');
    console.log('database connected');



// some data by email and user name;


//  app.get('/allToys', async(req, res)=>{
//       console.log(req.query.email);
//       let query = {}
//       if(req.query?.email){
//            query = {email:req.query.email}

//       }
//       const result = await toyCollection.find(query).toArray();
//       res.send(result);
//  })

//  app.get('/allToys', async(req, res)=>{
//       console.log(req.query.email);
//       let query = {}
//       if(req.query?.email){
//             query = {email: req.query.name}

//       }
//       const result = await toyCollection.find(query).toArray();
//       res.send(result)
//  })

// //     sent data to db

// app.post('/postToys', async(req, res)=>{
//       const body = req.body;
//       const result = await toyCollection.insertOne(body);
//       res.send(result)


// })

app.get('/someToys', async(req, res)=>{
      let query = {};
      if(req.query.email){
            query = {email: req.query.email};

      }
      const result = await toysCollection.find(query).toArray();
      res.send(result);
})

app.post('/setToys', async(req, res)=>{
      console.log(req.body);

      const body = req.body;
      const result = await toysCollection.insertOne(body);
      res.send(result);
})


app.delete('/setToys/:id',async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await toysCollection.deleteOne(query);
      res.send(result);
})














    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
//     await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res)=>{
      res.send('Toys is running.....')
})

app.listen(port, ()=>{
      console.log(`Toys is running on port:${port}`);
})
