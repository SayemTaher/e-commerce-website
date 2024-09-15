const express = require("express");
const bcrypt = require("bcrypt"); // bcrypt for hashing passwords
const app = express();
const port = process.env.PORT || 3000;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vybo3pc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    const userCollection = client.db("users").collection("user");

    // Register a user
    app.post("/register", async (req, res) => {
      const { firstName, lastName, email, password } = req.body;

      // Check if the user already exists
      const existingUser = await userCollection.findOne({ email });
      if (existingUser) {
        return res
            .status(400)
            .send({ message: "User with this email already exists" });
      }

      // Hash the password before storing it
      const saltRounds = 10; 
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const userData = {
        firstName,
        lastName,
        email,
        password: hashedPassword, // Store the hashed password
      };

      const result = await userCollection.insertOne(userData);
      res.send({
        success: true,
        message: "User registered successfully",
        result,
      });
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
