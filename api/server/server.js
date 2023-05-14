import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { dirname } from 'node:path'
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node'
import { fileURLToPath } from 'node:url'
import cookieParser from 'cookie-parser'

import dotenv from 'dotenv';

dotenv.config()
const secretKey = process.env.SECRET_KEY;
const app = express();
const allowlist = ['http://localhost:9000'];
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true, credentials: true }
  } else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate));
app.use(express.json())
app.use(cookieParser())
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname,"..","..","dist")
// Reading the data from ../../data/users.json
const dbFilePath = path.join(__dirname, '..' ,'..' ,'data', 'users.json');
const adapter = new JSONFile(dbFilePath)
const defaultData = { users: [] }
const db = new Low(adapter,defaultData)


await db.read()

function authenticate(req, res, next) {
  const token = req.cookies.jwt;

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, secretKey);

    // Find the user with the corresponding token
    const user = db.data.users.find((user) => user._id === decoded.userId);

    if (!user) {
      // User not found
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const matchingToken = db.data.tokens.find((t) => t.token === token);

    if (!matchingToken) {
      // Token not found or already used
      return res.status(401).json({ error: 'Invalid token' });
    }
    // Set the user object on the request for further use
    req.user = user;

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    // Token verification failed
    console.log(error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user with the provided email
  const user = db.data.users.find((user) => user.email === email);

  if (!user) {
    // User not found
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.password !== password) {
    // Incorrect password
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate a token
  const token = jwt.sign({ userId: user._id }, secretKey);

  // Store the token in the tokens array in the db
  db.data.tokens.push({ _id: user._id, token })
  
  db.write();

  // Set the JWT token as a cookie
  res.cookie('jwt', token, { httpOnly: true });

  // Return the token to the client
  return res.status(200).json();
});
// For this specific route the client is meant to send in the request an object contaning each of the attributes 
// in key:value pairs that they want to update out of the user. 
// Not allowing to update everything (such as the image) because it would take much longer
// to implement the logic for it
app.put('/user', authenticate, (req, res) => {
  const { name, email, phone, address } = req.body;
  const currentUser = req.user;

  // Find the user with the provided _id
  const user = db.data.users.find((user) => user._id === currentUser._id);

  if (!user) {
    // User not found
    return res.status(404).json({ error: 'User not found' });
  }

  // Update the attributes of the user object
  user.name = name;
  user.email = email;
  user.phone = phone;
  user.address = address;

  // Write the updated data to the database
  db.write();

  return res
    .status(200)
    .json({ message: 'User details updated successfully' });
});

app.get('/user', authenticate, (req, res) => {
  // Retrieve user details
  const user = req.user; // Access the user object from the middleware

  // Prepare the user details to be returned
  const userDetails = {
    name: user.name,
    email: user.email,
    address: user.address,
    picture: user.picture,
    age: user.age,
    phone: user.phone
  };

  return res
    .status(200)
    .json(userDetails);
});

app.get('/get-balance', authenticate, (req, res) => {
  // Retrieve account balance for the authenticated user
  const user = req.user; // Access the user object from the middleware
  const accountBalance = user.balance;

  return res
    .status(200)
    .json({ balance: accountBalance });
});

app.post('/logout', authenticate, (req, res) => {
  const token = req.cookies.jwt;

  // Clear the JWT token cookie
  res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' }).send('Logged out successfully');

  // Find the index of the matching token in the tokens array
  const tokenIndex = db.data.tokens.findIndex((t) => t.token === token);

  if (tokenIndex !== -1) {
    // Token found, remove it from the tokens array
    db.data.tokens.splice(tokenIndex, 1);
    // Write the updated data to the database
    db.write();
    }
  });

  app.get("*", (req, res) => {
    res
      .status(200)
      .sendFile(path.join(distPath,"index.html"))
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

