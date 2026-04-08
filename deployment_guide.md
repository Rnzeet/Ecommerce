
# Deployment Guide

This guide will walk you through deploying your backend to Render and configuring your frontend on Vercel.

## 1. Deploying the Backend to Render

1.  **Create a new Web Service on Render.**
2.  **Connect your Git repository.**
3.  **Configure the service:**
    *   **Name:** `myteastore-backend` (or a name of your choice)
    *   **Region:** Choose a region close to your users.
    *   **Branch:** `main` (or your default branch)
    *   **Root Directory:** `myteastore-backend`
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`

## 2. Setting Environment Variables in Render

After creating the service, go to the "Environment" tab and add the following environment variables:

*   `REACT_APP_SUPABASE_URL`: Your Supabase project URL.
*   `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key.

## 3. Finding Your Backend URL in Render

Once your backend is deployed, you can find its public URL on the Render dashboard. It will look something like this: `https://myteastore-backend.onrender.com`.

## 4. Setting Environment Variables in Vercel

Go to your Vercel project settings, and under "Environment Variables", add the following:

*   `VITE_API_URL`: The URL of your deployed backend from Render (e.g., `https://myteastore-backend.onrender.com`).
*   `VITE_ADMIN_LOGIN`: The admin username you want to use.
*   `VITE_ADMIN_PASS`: The admin password you want to use.

After setting these environment variables, you will need to redeploy your Vercel project for the changes to take effect.
