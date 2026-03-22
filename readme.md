# KrishiSangh – Project Setup Guide

This guide will help you run the project locally (Frontend + Backend).

---

## 📁 Project Structure

```
backend/
frontend/krishi-sangh/
```

---

# 🚀 1. Backend Setup (Flask)

## Step 1: Go to backend folder

```bash
cd backend
```

## Step 2: Activate virtual environment

```bash
venv\Scripts\activate
```

## Step 3: Install dependencies

```bash
pip install -r requirements.txt
```

If requirements.txt is not present, install manually:

```bash
pip install flask flask-cors psycopg2 requests feedparser beautifulsoup4 scikit-learn tensorflow
```

## Step 4: Run backend server

```bash
python app.py
```

Backend will run on:

```
http://127.0.0.1:5001
```

---

# 🌐 2. Frontend Setup (React)

## Step 1: Go to frontend folder

```bash
cd Frontend/krishi-sangh
```

## Step 2: Install dependencies

```bash
npm install
```

## Step 3: Start frontend

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

# 🔗 3. Important Notes

* Backend must be running before frontend
* API base URL used:

```
http://127.0.0.1:5001/api
```

---

# 🤖 4. Running Loan Agent (Important)

To fetch and insert latest loan data:

Open in browser:

```
http://127.0.0.1:5001/api/loan-agent/run
```

---

# 📊 5. Available APIs

* Loans → `/api/loans`
* Schemes → `/api/schemes`
* Tools → `/api/tools`
* AI → `/api/...`

---

# ⚠️ Common Issues

### 1. Module not found

👉 Run:

```bash
pip install -r requirements.txt
```

### 2. Frontend not starting

👉 Run:

```bash
npm install
```

### 3. Backend not connecting

👉 Check `.env` database credentials

---

# ✅ Final Flow

1. Start backend
2. Start frontend
3. Open browser
4. Use system

---

# 🎯 Demo Flow

Home → Dashboard → Crop Detection → Schemes → Loans → Tools Rental

---

Everything should now run smoothly 👍
