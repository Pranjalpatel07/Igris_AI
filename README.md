# IgrisAI

<div align="center">
  <img src="https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-4.3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit" />
  <img src="https://img.shields.io/badge/Express-5.3.0-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Redis-6.0.0-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/LangChain-LangGraph-1F7A8C?style=for-the-badge&logo=langchain&logoColor=white" alt="LangChain" />
  <img src="https://img.shields.io/badge/Razorpay-Checkout-0A7CFF?style=for-the-badge&logo=razorpay&logoColor=white" alt="Razorpay" />
</div>

IgrisAI is a full-stack AI productivity platform built for conversational work, code generation, web research, document processing, and visual content generation. The project combines a modern React frontend with a distributed Express backend, MongoDB storage, Redis session/cache memory, and a multi-agent AI pipeline powered by LangChain and multiple LLM providers.

The application is designed around a chat-first experience where users can create conversations, interact with AI agents, upload files, and manage plan/credit usage in a seamless workflow.

## Why this project matters

IgrisAI brings together several AI workflows into a single product:

- General-purpose chat and assistant interactions
- Web and research-style agent workflows
- Code generation and technical problem solving
- PDF analysis and document understanding
- Presentation generation with PowerPoint output
- Image generation and image analysis
- Credit-based access and payment integration

## Architecture overview

The system is split into a frontend app and a microservice-style backend:

- Client: React + Vite app for the web interface
- Gateway: request router and authentication middleware
- Auth service: Firebase login and session management
- Chat service: conversation and message persistence
- Agent service: routing + LLM orchestration + specialized tools
- Billing service: Razorpay order creation and verification
- Shared services: Redis and MongoDB connectivity

## Tech stack

### Frontend
- React 19
- Vite
- Redux Toolkit
- TailwindCSS
- Firebase Authentication
- Lucide icons and motion-based UI transitions

### Backend
- Node.js + Express
- MongoDB with Mongoose
- Redis for sessions and memory cache
- JWT-style session management via cookie + Redis

### AI and agent platform
- LangChain + LangGraph
- Groq
- Google Generative AI
- OpenRouter
- Tavily for search workflows
- Qdrant support for vector-based retrieval
- AWS S3 for media/object storage

### Payments and billing
- Razorpay
- Credit-based plan system (Free, Starter, Pro)

## Key features

### Multi-agent AI workflow
The agent layer routes requests based on the prompt and file type. Supported flows include:

- Chat agent for general conversations
- Search agent for research or live web lookups
- Coding agent for software implementation and debugging
- Vision/Image agent for image generation and visual prompts
- PDF and PDF-RAG workflows for document analysis
- PowerPoint generation for deck-making tasks
- Image analyzer for uploaded image understanding

### Conversation system
Users can:

- create new conversations
- switch between historical chats
- persist messages in MongoDB
- maintain short memory buffers in Redis

### Auth and user access
- Google Sign-In through Firebase
- Session cookie issued after successful login
- Protected API routes through the gateway middleware
- User profile, plan, and credit state stored for account continuity

### Billing and credits
The billing system allows users to:

- view their current plan and remaining credits
- create Razorpay orders
- verify successful payments
- update account plan and credits after purchase

## Project structure

```text
Igris_Ai/
├── client/
│   ├── src/
│   ├── utils/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── server/
│   ├── gateway/
│   ├── services/
│   ├── shared/
│   ├── docker-compose.yml
│   └── .env.example
├── .gitignore
└── README.md
```

### Server service breakdown

```text
server/
├── gateway/
│   ├── controllers/
│   ├── middleware/
│   ├── utils/
│   └── index.js
├── services/
│   ├── auth/
│   ├── chat/
│   ├── agent/
│   └── billing/
├── shared/
│   └── redis/
└── docker-compose.yml
```

## Environment setup

This project requires several environment variables and platform credentials.

### Client environment
Create a `.env` file inside `client/` with values similar to:

```env
VITE_SERVER_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

### Gateway environment
Create a `.env` file inside `server/gateway/`:

```env
PORT=8000
FRONTEND_URL=http://localhost:5173
AUTH_SERVICE=http://localhost:8001
CHAT_SERVICE=http://localhost:8002
AGENT_SERVICE=http://localhost:8003
BILLING_SERVICE=http://localhost:8004
```

### Service environment
Each service can use its own `.env` file. At minimum, the code expects:

- `PORT`
- `MONGO_URL`
- `REDIS_URL`
- `GROQ_API_KEY`
- `GOOGLE_API_KEY`
- `OPENROUTER_API_KEY`
- `TAVILY_API_KEY`
- `QDRANT_URL`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_KEY`
- `AWS_REGION`
- `AWS_BUCKET_NAME`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

### Firebase admin setup
The auth service initializes Firebase Admin with a service account JSON file:

- `server/services/auth/serviceAccountKey.json`

This file is required for Google token verification and user creation.

## Local development

### 1) Install dependencies

Frontend:

```bash
cd Igris_Ai/client
npm install
```

Backend services:

```bash
cd Igris_Ai/server/gateway
npm install

cd ../services/auth
npm install

cd ../chat
npm install

cd ../agent
npm install

cd ../billing
npm install
```

### 2) Start Redis

```bash
cd Igris_Ai/server
docker compose up -d
```

### 3) Start the backend services

Run each service in a separate terminal:

```bash
cd Igris_Ai/server/gateway
npm run dev
```

```bash
cd Igris_Ai/server/services/auth
npm run dev
```

```bash
cd Igris_Ai/server/services/chat
npm run dev
```

```bash
cd Igris_Ai/server/services/agent
npm run dev
```

```bash
cd Igris_Ai/server/services/billing
npm run dev
```

### 4) Start the frontend

```bash
cd Igris_Ai/client
npm run dev
```

Then open the local Vite URL in your browser (usually `http://localhost:5173`).

## Default app flow

1. User signs in with Google
2. A session is created through the auth service and stored in Redis
3. User creates or selects a conversation
4. Messages are saved in MongoDB
5. The agent service decides which AI workflow to invoke
6. The response is saved back to the conversation and returned to the UI
7. Premium features and billing are handled via the billing service and Razorpay

## Pricing model

The app includes a token/credit-style plan system:

- Free: 100 credits
- Starter: ₹199 for 500 credits
- Pro: ₹499 for 1000 credits

Credits are deducted based on the selected AI agent type and task complexity.

## Notes and production considerations

This project is a strong foundation for a production AI SaaS app, but additional work may be needed before full-scale deployment:

- environment secrets should be managed through a secure secret manager
- production CORS and session rules should be tightened
- request validation and rate limiting should be layered in
- monitoring/error dashboards should be added for service health
- AI provider timeouts and retry policies should be configured based on production load

## License

This project does not currently declare a formal license in the repository. If you plan to distribute or deploy it publicly, add an explicit license file and review compliance requirements before release.

## Contributing

Contributions are welcome. If you plan to extend the system, start with the following areas:

- agent routing improvements
- stronger validation and error-handling
- UI polish and accessibility
- billing and subscription workflows
- observability and deployment automation

## Summary

IgrisAI is a versatile AI workspace that combines chat, document analysis, coding support, web research, image generation, and payment-backed premium access into a single project. It is well-suited for experimentation, demos, and further enhancement into a full SaaS product.
