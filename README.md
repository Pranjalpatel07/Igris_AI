# IgrisAI 🤖

IgrisAI is a chat-based AI workspace for conversation, coding assistance, web research, document analysis, and generated visual content. It combines a React client with a set of Express services and a LangChain/LangGraph agent workflow.

## ✨ Features

- 💬 Google sign-in and saved conversations
- 🧠 Multi-agent requests for general chat, coding, and web search
- 🔎 Web search powered by Tavily
- 📄 PDF question answering and PDF generation
- 🖼️ Image analysis and image generation
- 📊 PowerPoint presentation generation
- 💳 Credit plans and Razorpay checkout
- ☁️ AWS S3 storage for generated files, delivered through temporary download links

The available plans in the code are Free (100 credits), Starter (₹199 for 500 credits), and Pro (₹499 for 1,000 credits).

## 🧱 Architecture and technology

| Area | Technologies |
| --- | --- |
| Client | React 19, Vite, Tailwind CSS, Redux Toolkit |
| API gateway | Express, cookie-based session checks, service proxying |
| Services | Node.js and Express: auth, chat, agent, and billing |
| Persistence | MongoDB with Mongoose; Redis for sessions, agent memory, and limits |
| AI workflows | LangChain, LangGraph, Groq, Google Generative AI, OpenRouter |
| Search and retrieval | Tavily; optional Qdrant-backed PDF retrieval |
| Cloud and payments | AWS S3, Razorpay |
| Delivery configuration | Dockerfiles and a GitHub Actions workflow targeting AWS |

### Request flow

The client sends requests to the gateway. The gateway checks sessions for protected routes and forwards requests to the auth, chat, agent, or billing service. The agent service selects a workflow and calls configured AI/search providers. MongoDB stores user and conversation data; Redis supports sessions and short-lived agent data.

## 📁 Repository layout

```text
Igris_Ai/
├── .github/workflows/deploy.yml
├── client/                    # React/Vite web client
└── server/
    ├── gateway/               # API gateway
    ├── services/
    │   ├── auth/
    │   ├── chat/
    │   ├── agent/
    │   └── billing/
    ├── shared/redis/
    └── docker-compose.yml     # Local Redis container
```

## 🚀 Run locally

### Requirements

- Node.js and npm
- Docker Desktop (for the provided local Redis setup)
- A MongoDB instance
- Firebase project credentials and the API keys for any AI, search, storage, and payment integrations you want to use

### 1. Configure environment variables

Create a `.env` file in each service directory that needs configuration. The backend services load environment variables from their working directory.

Client `.env` (`client/.env`):

```env
VITE_SERVER_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Gateway `.env` (`server/gateway/.env`):

```env
PORT=8000
FRONTEND_URL=http://localhost:5173
AUTH_SERVICE=http://localhost:8001
CHAT_SERVICE=http://localhost:8002
AGENT_SERVICE=http://localhost:8003
BILLING_SERVICE=http://localhost:8004
REDIS_URL=redis://localhost:6379
```

Set the following values in the relevant backend service `.env` files:

| Variable | Used by |
| --- | --- |
| `PORT` | Each backend service |
| `MONGO_URL` | Auth, chat, agent, and billing |
| `REDIS_URL` | Gateway, auth, and agent |
| `AUTH_SERVICE` | Agent and billing service URLs |
| `CHAT_SERVICE` | Agent service URL |
| `GROQ_API_KEY` | Agent model provider |
| `GOOGLE_API_KEY` | Agent model provider, embeddings, and image analysis |
| `OPENROUTER_API_KEY` | Agent model provider |
| `TAVILY_API_KEY` | Agent web search |
| `QDRANT_URL` | Optional vector search for PDF retrieval |
| `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_KEY`, `AWS_BUCKET_NAME` | Agent file storage in S3 |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Billing service |

The auth service imports its Firebase Admin service-account JSON from `server/services/auth/serviceAccountKey.json`. Supply this credential securely and do not commit service-account files or other secrets. Use separate credentials and appropriately restricted permissions outside local development.

### 2. Start Redis

From the repository root:

```bash
docker compose -f server/docker-compose.yml up -d
```

This Compose file starts Redis only. MongoDB and the other external integrations must be available separately.

### 3. Install dependencies

Install dependencies in the client and each backend package:

```bash
cd client
npm install

cd ../server/gateway
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

### 4. Start the services

Run each command in its own terminal, with the corresponding `.env` configured:

```bash
cd server/gateway
npm run dev
```

```bash
cd server/services/auth
npm run dev
```

```bash
cd server/services/chat
npm run dev
```

```bash
cd server/services/agent
npm run dev
```

```bash
cd server/services/billing
npm run dev
```

Start the client in another terminal:

```bash
cd client
npm run dev
```

Open the Vite URL printed in the terminal (typically `http://localhost:5173`).

## 🐳 Docker

Dockerfiles are provided for the gateway and each backend service. Build them from the repository root, using `server` as the build context:

```bash
docker build -f server/gateway/Dockerfile -t igris-gateway server
docker build -f server/services/auth/Dockerfile -t igris-auth server
docker build -f server/services/chat/Dockerfile -t igris-chat server
docker build -f server/services/agent/Dockerfile -t igris-agent server
docker build -f server/services/billing/Dockerfile -t igris-billing server
```

The current Compose file does not orchestrate these application containers; it only provides Redis. Configure service environment variables, networking, and external dependencies when running the images.

## ☁️ AWS and CI/CD

The agent service uses AWS S3 for generated-file storage and temporary download links. The GitHub Actions workflow at `.github/workflows/deploy.yml` describes an intended deployment on pushes to `main`: build and push backend images to Amazon ECR, update Amazon ECS services, then upload the client build to S3 and invalidate CloudFront.

**Deployment status:** the checked-in workflow is not ready to run successfully as written. It contains invalid job keys (`runs_on`), misspelled `secrects` references, a frontend path that does not match this repository (`frontend` instead of `client`), and an incorrectly named AWS region input. Correct these items, configure the required GitHub Actions secrets and AWS resources, and test the workflow before relying on it for deployment. No AWS infrastructure is provisioned by this repository.

## 🧪 Available checks

From `client/`:

```bash
npm run lint
npm run build
```

The backend package manifests do not currently define test scripts.

## 🔐 Security notes

- Never commit `.env` files, Firebase Admin credentials, or cloud/payment secrets.
- Restrict AWS credentials and bucket access to the permissions the app needs.
- Configure production CORS origins, session settings, and service networking for your deployment.

## 📄 License

No formal license is currently declared in this repository.
