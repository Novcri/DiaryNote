
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, '..', 'db.json');

// Helper function to read data from db.json
const readData = () => {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write data to db.json
const writeData = (data: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// API endpoints
app.get('/api/posts', (req, res) => {
  const data = readData();
  // Sort posts by timestamp in descending order
  const sortedPosts = data.posts.sort((a: any, b: any) => {
    // Assuming timestamp is in a format that can be converted to a Date object
    const dateA = new Date(a.timestamp.replace(/[/]/g, '-')).getTime();
    const dateB = new Date(b.timestamp.replace(/[/]/g, '-')).getTime();
    return dateB - dateA;
  });
  res.json(sortedPosts);
});

app.post('/api/posts', (req, res) => {
  const data = readData();
  const newPost = {
    id: Date.now(),
    ...req.body,
  };
  data.posts.push(newPost);
  writeData(data);
  res.status(201).json(newPost);
});

app.patch('/api/posts/:id', (req, res) => {
  const data = readData();
  const postId = parseInt(req.params.id, 10);
  const postIndex = data.posts.findIndex((post: any) => post.id === postId);

  if (postIndex !== -1) {
    // Only update the likes count
    data.posts[postIndex].likes = req.body.likes;
    writeData(data);
    res.json(data.posts[postIndex]);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
