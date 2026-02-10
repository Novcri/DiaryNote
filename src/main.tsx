import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';
import { BrowserRouter } from 'react-router-dom';
import { PostFilterProvider } from './context/PostFilterContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <PostFilterProvider>
                <App />
            </PostFilterProvider>
        </BrowserRouter>
    </React.StrictMode>
);