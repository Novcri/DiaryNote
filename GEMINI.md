# DiaryNote

This is a simple diary/note-taking application.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express, ts-node
- **Database**: libSQL (Turso or local replica)
- **Styling**: Basic CSS

## Project Structure

- `src/`: Contains the React frontend code.
  - `App.tsx`: The main application component.
  - `api/index.ts`: Functions for making API calls to the backend.
  - `components/`: Reusable React components.
  - `utils/`: Utility functions.
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
