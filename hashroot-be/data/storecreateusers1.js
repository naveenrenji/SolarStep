import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import { MongoClient, ObjectId } from 'mongodb';
import { mongoConfig } from '../config/settings.js';

const url = mongoConfig.serverUrl;
const dbName = mongoConfig.database;

async function dbConnect() {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);
  return db;
}

// const url = 'mongodb://localhost:27017';

const client = new MongoClient(url);
/**
* Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
* See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
*/
//const uri = "mongodb+srv://:<password>@<your-cluster-url>/sample_airbnb?retryWrites=true&w=majority";       

console.log("FIRST ")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/users', async function(req, res) {
    try {
      const db = await dbConnect();
      const collection = db.collection('users');
  
      const userData = req.body;
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.password || !userData.role) {
        return res.status(400).json({ error: 'firstame,lastname, email, password and role are required' });
      }
  
      const result = await collection.insertOne(userData);
      res.json({ success: true, userId: result.insertedId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error creating user' });
    }
  });

app.get('/api/users', async function(req, res) {
    try {
      const db = await dbConnect();
      const collection = db.collection('users');
  
      const users = await collection.find({}).toArray();
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error getting users' });
    }
  });
  

  // Update a user

  app.put('/api/users/:id', async function(req, res) {
    try {
      const db = await dbConnect();
      const collection = db.collection('users');
  
      const userId = req.params.id;
      const filter = { _id: new ObjectId(userId) };
      const update = { $set: req.body };
  
      const result = await collection.updateOne(filter, update);
      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating user' });
    }
  });


app.listen(3001, function() {
    console.log('Server listening on port 3001');
  });