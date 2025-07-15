# EchoMind

EchoMind is an AI-powered chat application that allows users to interact with Google's Gemini AI using both text and image inputs. The project is split into two main parts:

- **Backend**: Node.js/Express API (deployed as a Vercel serverless function)
- **Frontend**: React app (Vite + Tailwind CSS)

---

## Features
- Chat with Gemini AI using text and images
- Modern, responsive UI built with React and Tailwind CSS
- Image upload support (handled via Multer on the backend)
- Deployed on Vercel for easy scalability

---


## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### 1. Clone the repository
```sh
git clone https://github.com/rishishanbhag/EchoMind.git
cd EchoMind
```

### 2. Backend Setup
```
cd api
npm install
```

Create a `.env` file in the `api` folder:
```
GOOGLE_API_KEY=your_google_gemini_api_key
PORT=3000
```

#### Local Development
```
npm run dev
```

### 3. Frontend Setup
```
cd ../client/geminiapp
npm install
npm run dev
```

#### Environment Variable (optional)
Create a `.env` file in `client/geminiapp` if you want to override the backend URL:
```
VITE_API_URL=http://localhost:3000
```

---

## Deployment

Both frontend and backend are designed to be deployed on Vercel:
- The backend (`api/`) is deployed as a serverless function
- The frontend (`client/geminiapp/`) is deployed as a static site

Make sure to set the `GOOGLE_API_KEY` environment variable in your Vercel dashboard for the backend project.

---

## Usage
- Visit the deployed frontend URL
- Enter a message and/or upload an image
- Click "Submit" to chat with Gemini AI

---

## License
MIT
