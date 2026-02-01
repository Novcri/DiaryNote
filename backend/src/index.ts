import express from 'express';
import cors from 'cors';
import { db } from './connectDb';
import { ResultSet } from '@libsql/client';

const app = express();
const port = process.env.PORT || 3001;
const TABLE_DATA = process.env.TABLE_DATA;

app.use(cors());
app.use(express.json());

const formatResultSet = (resultSet: ResultSet) => {
  if (!resultSet.rows) {
    return [];
  }
  return resultSet.rows.map(row => {
    const obj: { [key: string]: any } = {};
    resultSet.columns.forEach((col, index) => {
      obj[col] = row[index];
    });
    return obj;
  });
};

app.get('/api/posts', async (req, res) => {
  try {
    const resultSet = await db.execute(`SELECT id, text, timestamp, likes, genre FROM ${TABLE_DATA} ORDER BY timestamp DESC`);
    const posts = formatResultSet(resultSet);
    res.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { text, timestamp, genre } = req.body;
    if (!text || !timestamp) {
      return res.status(400).json({ message: 'Missing text or timestamp' });
    }
    const newPost = {
      id: Date.now(),
      text,
      timestamp,
      likes: 0,
      genre: genre || '',
    };
    await db.execute({
      sql: `INSERT INTO ${TABLE_DATA} (id, text, timestamp, likes, genre) VALUES (?, ?, ?, ?, ?)`,
      args: [newPost.id, newPost.text, newPost.timestamp, newPost.likes, newPost.genre],
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Failed to create post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

app.patch('/api/posts/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const { likes } = req.body;

    if (likes === undefined) {
      return res.status(400).json({ message: 'Missing likes count' });
    }

    const updateResult = await db.execute({
      sql: `UPDATE ${TABLE_DATA} SET likes = ? WHERE id = ?`,
      args: [likes, postId],
    });

    if (updateResult.rowsAffected === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const resultSet = await db.execute({
        sql: `SELECT * FROM ${TABLE_DATA} WHERE id = ?`,
        args: [postId]
    });
    const updatedPost = formatResultSet(resultSet)[0];

    res.json(updatedPost);
  } catch (error) {
    console.error('Failed to update post:', error);
    res.status(500).json({ message: 'Failed to update post' });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});