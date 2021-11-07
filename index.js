const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

// Set MongoDB
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2spjz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const run = async ()=> {
    try {
        await client.connect();
        const database = client.db("image-upload");
        const imagesCollection = database.collection("images");
        console.log('database connected');

        // POST The Image Link 
        app.post('/upload', async (req,res)=> {
            const url = req.body.url;
            const newObj = {url:url}
            const result = await imagesCollection.insertOne(newObj);
            // Inserted
            res.send({res:' '});
        })

        // GET all images link 
        app.get('/images',async (req,res)=> {
            const result = await imagesCollection.find({});
            const converted = await result.toArray();
            res.send(converted);
        })
    }
    finally {
        // client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Home page of NODE");
});
app.listen(port, () => {
  console.log("listening at port", port);
});
