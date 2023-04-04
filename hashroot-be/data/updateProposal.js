import express from 'express';
import multer from 'multer';
import path from 'path';
import mongodb from 'mongodb';
import { MongoClient } from 'mongodb';

const app = express();

// configure multer to store uploaded files in projectAssets folder
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const projectId = req.body.projectid;
    const folderPath = path.join(__dirname, 'projectAssets', projectId);
    cb(null, folderPath);
  },
  filename: function(req, file, cb) {
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const currentDate = new Date().toISOString().slice(0, 10);
    const newName = `proposal-${currentDate}${extension}`;
    cb(null, newName);
  }
});
const upload = multer({ storage: storage });

// connect to MongoDB and start server
const url = 'mongodb://localhost:27017';
const dbName = 'solar_step';
const client = new MongoClient(url);

client.connect(async function(err) {
  if (err) {
    console.log('Error connecting to MongoDB:', err);
    return;
  }

  console.log('Connected to MongoDB successfully.');

  const db = client.db(dbName);

  // handle get project by id request
  app.get('/projects/:id', async function(req, res) {
    const id = req.params.id;

    const project = await db.collection('projects').findOne({ _id: mongodb.ObjectId(id) });

    if (!project) {
      res.status(404).send('Project not found.');
      return;
    }

    res.send(project);
  });

  // handle file upload POST request
  app.post('/upload', upload.single('file'), async function(req, res) {
    const projectId = req.body.projectid;

    const project = await db.collection('projects').findOne({ _id: mongodb.ObjectId(projectId) });

    if (!project) {
      res.status(404).send('Project not found.');
      return;
    }

    // delete previous proposal file if it exists
    const previousProposalPath = project.latest_proposal_path;
    if (previousProposalPath) {
      const filePath = path.join(__dirname, previousProposalPath);
      fs.unlinkSync(filePath);
    }

    // update latest_proposal_path in database
    const newProposalPath = `projectAssets/${projectId}/${req.file.filename}`;
    await db.collection('projects').updateOne({ _id: mongodb.ObjectId(projectId) }, { $set: { latest_proposal_path: newProposalPath } });

    res.send('Proposal uploaded successfully.');
  });

  app.listen(3000, function() {
    console.log('Server started on port 3000');
  });
});

