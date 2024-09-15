const express = require("express");
const bcrypt = require("bcrypt"); // bcrypt for hashing passwords
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vybo3pc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("users").collection("user");

    // Register a user and generate a JWT token
    app.post("/register", async (req, res) => {
      const { firstName, lastName, email, password } = req.body;

      // Check if the user already exists
      const existingUser = await userCollection.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
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

      // Generate JWT token
      const token = jwt.sign(
        { email: userData.email, id: result.insertedId },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h", // Token expiration time
        }
      );

      // Return success message and token
      res.json({
        success: true,
        message: "User registered successfully",
          token,
          user: {
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName
          }
      });
    });

    // Sign-in Route to verify user and generate JWT
   app.post("/login", async (req, res) => {
     const { email, password } = req.body;

     const user = await userCollection.findOne({ email });
     if (!user) {
       return res.status(401).json({ message: "Invalid email or password" });
     }

     const isPasswordValid = await bcrypt.compare(password, user.password);
     if (!isPasswordValid) {
       return res.status(401).json({ message: "Invalid email or password" });
     }

     // Generate JWT token
     const token = jwt.sign(
       { email: user.email, id: user._id },
       process.env.JWT_SECRET,
       {
         expiresIn: "1h",
       }
     );

     // Send token and user data in the response
     res.json({
       success: true,
       message: "Login successful",
       token,
       user: {
         firstName: user.firstName,
         lastName: user.lastName,
         email: user.email,
         id: user._id,
       },
     });
   });

    // Middleware to verify JWT
    const verifyToken = (req, res, next) => {
      const token = req.headers["authorization"];
      if (!token) {
        return res.status(403).json({ message: "No token provided" });
      }

      jwt.verify(
        token.split(" ")[1],
        process.env.JWT_SECRET,
        (err, decoded) => {
          if (err) {
            return res
              .status(401)
              .json({ message: "Unauthorized: Invalid token" });
          }
          req.userId = decoded.id;
          next();
        }
      );
    };

   
  } finally {
    // Don't close the client here if the server is long-running
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
