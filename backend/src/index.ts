import express from 'express';
import cors from 'cors';
import { db } from './connectDb';
import { ResultSet } from '@libsql/client';
import jwt from 'jsonwebtoken';

const app = express();
const port = process.env.PORT || 3001;
const TABLE_DATA = process.env.TABLE_DATA;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // 実際には環境変数から取得してください

app.use(cors());
app.use(express.json());

// JWT認証ミドルウェア
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    (req as any).user = user;
    next();
  });
};

// 仮のユーザーデータ (実際にはDBから取得します)
const users: { email: string | undefined; password: string | undefined; name: string | undefined }[] = [
  { email: process.env.EMAIL, password: process.env.PASSWORD, name: process.env.NAME }
];

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // 認証成功: JWTトークンを発行
    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ 
      message: 'Login successful', 
      user: { email: user.email, name: user.name },
      token: token 
    });
  } else {
    // 認証失敗
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

const formatResultSet = (resultSet: ResultSet) => {
  if (!resultSet.rows) {
    return [];
  }
  return resultSet.rows.map(row => {
    const obj: { [key: string]: unknown } = {};
    resultSet.columns.forEach((col, index) => {
      obj[col] = row[index];
    });
    return obj;
  });
};

app.get('/api/posts', async (req, res) => {
  try {
    const { date, genre } = req.query;
    const whereClauses: string[] = [];
    const params: (string | number)[] = [];

    if (date && typeof date === 'string') {
      whereClauses.push(`strftime('%Y-%m-%d', timestamp) = ?`);
      params.push(date);
    }

    if (genre && typeof genre === 'string') {
      whereClauses.push(`genre = ?`);
      params.push(genre);
    }

    let query = `SELECT id, text, timestamp, likes, genre FROM ${TABLE_DATA}`;
    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }
    query += ` ORDER BY timestamp DESC`;

    const resultSet = await db.execute({ sql: query, args: params });
    const posts = formatResultSet(resultSet);
    res.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

app.post('/api/posts', authenticateToken, async (req, res) => {
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

app.patch('/api/posts/:id', authenticateToken, async (req, res) => {
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