# DiaryNote

This is a simple diary/note-taking application.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, React Router
- **Backend**: Node.js, Express, ts-node
- **Database**: libSQL (Turso or local replica)
- **Styling**: Basic CSS

## Project Structure

- `src/`: Contains the React frontend code.
  - `App.tsx`: The main application component, which sets up the routing.
  - `main.tsx`: The entry point of the React application.
  - `style.css`: Global styles for the application.
  - `api/`: Functions for making API calls to the backend.
    - `index.ts`: API functions for posts.
  - `components/`: Reusable React components.
    - `LikeButton.tsx`: A button component for liking posts.
  - `pages/`: Page components for different routes.
    - `PostPage.tsx`: A page for creating and viewing posts.
    - `ViewOnlyPage.tsx`: A read-only page for viewing posts.
  - `utils/`: Utility functions.
    - `date.ts`: Utility functions for date formatting.
    - `fetchPosts.ts`: Utility function for fetching posts.
    - `addPost.ts`: Utility function for adding a new post.
    - `handleUpdateLikes.ts`: Utility function for updating likes.
- `backend/`: Contains the Node.js backend code.
  - `src/index.ts`: The main Express server file, defining API endpoints.
  - `src/connectDb.ts`: Database connection logic.
  - `table/schema.sql`: SQL schema for the database table.
- `package.json`: Defines project scripts and dependencies for the frontend.
- `backend/package.json`: Defines project scripts and dependencies for the backend.

## How to Run

### Frontend

1.  Navigate to the root directory.
2.  Run `npm install` to install dependencies.
3.  Run `npm run dev` to start the Vite development server.

### Backend

1.  Navigate to the `backend` directory.
2.  Run `npm install` to install dependencies.
3.  Set up your `.env` file based on the required environment variables (see `backend/src/connectDb.ts`).
4.  Run `npm start` to start the backend server.
