# uChat - README

# Overview

Welcome to uChat, an innovative platform developed for the FetchAI Hackathon. uChat allows users to create custom chatbots tailored to their specific needs. Leveraging advanced language learning models and Retrieval-Augmented Generation (RAG), uChat bots can be configured with a variety of traits and knowledge derived from uploaded documents.

The platform is built using Next.js for the frontend, PostgreSQL for database management, and hosted via Vercel. Our backend is powered by Python and Flask, running on Render and designed to integrate with Google Cloud for file storage and ChromaDB for context management.

# Key Features

  •	User Authentication: Users can sign up and log in to manage their chatbots.<br/>
  •	Custom Chatbots: Create and configure chatbots with:__
  •	Name: Give your chatbot a unique identity.__
  •	Description: Define the purpose and goals of the chatbot.__
  •	Role: Assign a specific role to the chatbot, such as roleplaying as a particular character or entity.__
  •	PDF Knowledge Upload: Users can upload PDFs to equip their chatbot with specific knowledge from the document. The bot can then respond based on the content of the uploaded PDF.__
  •	Context Extraction: Using Retrieval-Augmented Generation (RAG) with ChromaDB, chatbots can extract and utilize relevant context from the uploaded PDFs during conversations.__
  •	Dynamic Prompt Generation: The platform uses a uAgent called uPrompt to dynamically generate prompts by combining user-provided parameters like context extraction, role, and 		chat history.__

# Technical Details

# Frontend

  •	Framework: Next.js__
  •	Hosting: Vercel__
  •	Database: PostgreSQL__

# Backend

  •	Framework: Python with Flask__
  •	Containerization: Docker__
  •	Hosting: Render (Free Plan)__
  •	Storage: Google Cloud Storage__
  •	Context Management: ChromaDB__

 # Known Limitations

  •	Backend Startup Delay: Since the backend is hosted on a free Render plan, it may take 10 to 15 minutes for the backend to start if it has been inactive.__
  •	PDF Upload Restrictions: Due to memory limitations on the free plan, PDF upload functionality is not supported.__
   # You may run locally to avoid these limitations.__

# Running uChat Locally

To run the uChat platform locally, follow these steps:__

# Prerequisites

  •	Node.js and npm / pnpm installed__
  •	Python and pip installed__
  •	Docker installed and running (optional)__
  •	PostgreSQL installed and running__
  •	Google Cloud Storage access and API key__

 # Frontend Setup

  1.	Clone the repository:__
     
  ```git clone https://github.com/VibhorSaxena2302/FetchAI```__
  ```cd next```__

  2.	Install the dependencies:__

  ```npm install```__
        OR
  ```pnpm install```__

  3.	Create a .env.local file in the root directory with primsa database content (Hosted online). For ease, use vercel to directly connect with postgreSQL:__
  ```POSTGRES_URL="YOUR_POSTGRES_URL"```__
  ```POSTGRES_PRISMA_URL="YOUR_POSTGRES_PRISMA_URL"```__
  ```POSTGRES_URL_NO_SSL="YOUR_POSTGRES_URL_NO_SSL"```__
  ```POSTGRES_URL_NON_POOLING="YOUR_POSTGRES_URL_NON_POOLING"```__
  ```POSTGRES_USER="YOUR_POSTGRES_USER"```__
  ```POSTGRES_HOST="YOUR_POSTGRES_HOST"```__
  ```POSTGRES_PASSWORD="YOUR_POSTGRES_PASSWORD"```__
  ```POSTGRES_DATABASE="YOUR_POSTGRES_DATABASE"```__
  ```DATABASE_URL="YOUR_DATABASE_URL"```__

  4.	Start the front-end development server:__
  ```npm run dev```__

# Backend Setup

  1.	Navigate to the backend directory:__
  ```cd LLM```__

  2.	Create a Python virtual environment:__
  ```python -m venv .venv```__
  ```source venv/bin/activate``` (For Mac)__
  ```.venv/Scripts/activate``` (For Windows)__

  3.	Install the dependencies:__
  ```pip install -r requirements.txt```__

  4.	Set up environment variables for Google Cloud Storage in a .env file:__
  ```GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/credentials.json```__
  (The key can be found by creating a account on Google Cloud, creating a new project and downloading the json keyfile. Store the api_key in a folder like 'google_cloud_api_key' and      give the path to it)__

  5.	Run the Flask application:__
  ```python -m app```__

  6.  Make sure to change the fetch url in frontend in scripts 'next/app/user/[user]/chatbots/[chatbot]/configure/form.tsx' and 'next/app/user/[user]/chatbots/[chatbot]/chatbot.tsx'     with the backend flask port url just before the '/api/llm'. i.e, replace 'https://uchat-wtwo.onrender.com' to local host url of flask in both files.__

# Running Backend with Docker

  1.	Build the Docker image:__
  ```cd LLM```__
  ```docker build -t uchat-backend .```__

  2.	Run the Docker container:__
  ```docker run -p [YOUR_PORT]:5000 uchat-backend```__

# Accessing the Application (Locally)

  Once both the frontend and backend are running, you can access the application in your browser at http://localhost:3000 (default) or whatever port you are running front-end at.__

# Accessing the Application (Online)

  You can access the deployed version of uChat at this link: https://uchat-ivory.vercel.app/__
  # Note: It may take 10 to 15 min to start the chat if the site has been inactive. This is due to the free plan on render which shuts down backend server if left inactive. PDF upload    will also not work due to not enough memory provided by render in the free plan.__

# Contact

For any inquiries or contributions, please reach out to us via our GitHub repository or email.__

Thank you for using uChat! We hope this platform helps you create the most engaging and personalized chatbots possible.

    
