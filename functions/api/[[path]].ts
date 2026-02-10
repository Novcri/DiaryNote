import { type Client, type ResultSet, createClient } from '@libsql/client';

interface Env {
  TURSO_URL: string;
  TURSO_TOKEN: string;
  EMAIL: string;
  PASSWORD: string;
  NAME: string;
  TABLE_DATA: string;
}

export async function onRequest(context: EventContext<Env, string, { [key: string]: string | string[] }>) {
  const { request, env } = context; // _params を削除
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', ''); // /api プレフィックスを削除

  // 環境変数チェック
  if (!env.TURSO_URL || !env.TURSO_TOKEN) {
      throw new Error("Missing TURSO_URL or TURSO_TOKEN in environment variables for Pages Function.");
  }

  // データベースクライアントの初期化
  const db: Client = createClient({
      url: env.TURSO_URL,
      authToken: env.TURSO_TOKEN,
  });
  // CORSヘッダーの設定
  const corsHeaders: HeadersInit = {
    'Access-Control-Allow-Origin': '*', // 任意のオリジンからのアクセスを許可
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // OPTIONSリクエストへの対応
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // JSONリクエストボディのパース
  let requestBody: any;
  if (request.method === 'POST' || request.method === 'PATCH') {
    try {
      requestBody = await request.json();
    } catch (_error: any) {
      return new Response(JSON.stringify({ message: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  // 環境変数チェックをcontext.envに対して行う
  if (!env.TURSO_URL || !env.TURSO_TOKEN) {
      throw new Error("Missing TURSO_URL or TURSO_TOKEN in environment variables for Pages Function.");
  }
  
  // ルーティング
  if (path === '/login' && request.method === 'POST') {
    return handleLogin(requestBody, corsHeaders, env);
  } else if (path === '/posts' && request.method === 'GET') {
    return handleGetPosts(url, corsHeaders, env, db);
  } else if (path === '/posts' && request.method === 'POST') {
    return handleCreatePost(requestBody, corsHeaders, env, db);
  } else if (path.startsWith('/posts/') && request.method === 'PATCH') {
    const postId = parseInt(path.split('/')[2], 10);
    if (isNaN(postId)) {
      return new Response(JSON.stringify({ message: 'Invalid post ID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    return handleUpdatePost(postId, requestBody, corsHeaders, env, db);
  }

  // 他のルートまたは見つからないルート
  return new Response(JSON.stringify({ message: 'Not Found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// データベース結果のフォーマットヘルパー関数
const formatResultSet = (resultSet: ResultSet) => {
  if (!resultSet.rows) {
    return [];
  }
  return resultSet.rows.map((row: any) => {
    const obj: { [key: string]: unknown } = {};
    resultSet.columns.forEach((col: string, index: number) => {
      obj[col] = row[index];
    });
    return obj;
  });
};

// --- ハンドラー関数群 ---

async function handleLogin(requestBody: any, corsHeaders: HeadersInit, env: Env) {
  const { email, password } = requestBody;

  if (!email || !password) {
    return new Response(JSON.stringify({ message: 'Email and password are required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 環境変数からユーザー情報を取得
  const envEmail = env.EMAIL;
  const envPassword = env.PASSWORD;
  const envName = env.NAME;

  if (email === envEmail && password === envPassword) {
    return new Response(JSON.stringify({ message: 'Login successful', user: { email: envEmail, name: envName } }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleGetPosts(url: URL, corsHeaders: HeadersInit, env: Env, db: Client) {
  try {
    const date = url.searchParams.get('date');
    const genre = url.searchParams.get('genre');
    const whereClauses: string[] = [];
    const params: (string | number)[] = [];
    const TABLE_DATA = env.TABLE_DATA;

    if (!TABLE_DATA) {
      return new Response(JSON.stringify({ message: 'TABLE_DATA environment variable is not set.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (date) {
      whereClauses.push(`strftime('%Y-%m-%d', timestamp) = ?`);
      params.push(date);
    }

    if (genre) {
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
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (_error: any) { // 'error' を '_error' に変更
    console.error('Failed to fetch posts:', _error);
    return new Response(JSON.stringify({ message: 'Failed to fetch posts' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleCreatePost(requestBody: any, corsHeaders: HeadersInit, env: Env, db: Client) {
  try {
    const { text, timestamp, genre } = requestBody;
    const TABLE_DATA = env.TABLE_DATA;

    if (!TABLE_DATA) {
      return new Response(JSON.stringify({ message: 'TABLE_DATA environment variable is not set.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!text || !timestamp) {
      return new Response(JSON.stringify({ message: 'Missing text or timestamp' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
    return new Response(JSON.stringify(newPost), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (_error: any) { // 'error' を '_error' に変更
    console.error('Failed to create post:', _error);
    return new Response(JSON.stringify({ message: 'Failed to create post' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleUpdatePost(postId: number, requestBody: any, corsHeaders: HeadersInit, env: Env, db: Client) {
  try {
    const { likes } = requestBody;
    const TABLE_DATA = env.TABLE_DATA;

    if (!TABLE_DATA) {
      return new Response(JSON.stringify({ message: 'TABLE_DATA environment variable is not set.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const updateResult = await db.execute({
      sql: `UPDATE ${TABLE_DATA} SET likes = ? WHERE id = ?`,
      args: [likes, postId],
    });

    if (updateResult.rowsAffected === 0) {
      return new Response(JSON.stringify({ message: 'Post not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const resultSet = await db.execute({
      sql: `SELECT * FROM ${TABLE_DATA} WHERE id = ?`,
      args: [postId]
    });
    const updatedPost = formatResultSet(resultSet)[0];

    return new Response(JSON.stringify(updatedPost), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (_error: any) { // 'error' を '_error' に変更
    console.error('Failed to update post:', _error);
    return new Response(JSON.stringify({ message: 'Failed to update post' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}