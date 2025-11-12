# 🚂 RAILWAY DEPLOYMENT - STEP BY STEP

## ✅ CONFIRMED SETUP

**Platform:** Railway (for everything)
**Database:** Railway PostgreSQL
**Redis:** Railway Redis
**OpenAI Key:** ✅ You have it

---

## 📦 WHAT RAILWAY WILL HOST

```
Railway Project:
├── Backend Service (Node.js/Express)
├── Frontend Service (Next.js)
├── PostgreSQL Database (Railway add-on)
└── Redis (Railway add-on)
```

**Everything in one platform!** 🎉

---

## 🚀 DEPLOYMENT STEPS

### **STEP 1: Install Railway CLI**

```bash
npm install -g @railway/cli
```

**Verify installation:**
```bash
railway --version
```

---

### **STEP 2: Login to Railway**

```bash
railway login
```

This will open your browser to authenticate.

---

### **STEP 3: Create New Project**

```bash
# Create a new Railway project
railway init
```

**Choose:**
- Create new project: Yes
- Project name: `ai-exam-platform` (or your choice)

---

### **STEP 4: Deploy Backend**

```bash
# Navigate to backend folder
cd backend

# Link to Railway project
railway link

# Add PostgreSQL database
railway add --plugin postgresql

# Add Redis
railway add --plugin redis

# Deploy backend
railway up
```

**This will:**
- Upload your backend code
- Install dependencies
- Build the project
- Start the server

---

### **STEP 5: Add Environment Variables (Backend)**

**Option A: Using Railway Dashboard (Easier)**

1. Go to https://railway.app/dashboard
2. Click on your project
3. Click on "backend" service
4. Go to "Variables" tab
5. Click "New Variable"
6. Add these variables:

```bash
# REQUIRED - Add these manually:
NODE_ENV=production
PORT=5000
API_PREFIX=/api/v1

# Your OpenAI Key (REPLACE WITH YOUR ACTUAL KEY):
OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_OPENAI_KEY_HERE
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=2000

# JWT Secrets (generate new ones!):
JWT_SECRET=your_new_64_character_random_string_here_CHANGE_THIS
JWT_REFRESH_SECRET=your_different_64_character_random_string_CHANGE_THIS
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# File Upload:
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=20971520
ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.txt

# Logging:
LOG_LEVEL=info

# Rate Limiting:
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Database (Railway provides these automatically as references):
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

# Redis (Railway provides these automatically):
REDIS_URL=${{Redis.REDIS_URL}}
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}

# Frontend URL (add after deploying frontend):
FRONTEND_URL=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}
```

**Option B: Using CLI**

```bash
# Set variables one by one
railway variables set NODE_ENV=production
railway variables set OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_OPENAI_KEY_HERE
# ... add all others
```

---

### **STEP 6: Generate JWT Secrets**

**Run this command twice to generate 2 different secrets:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example output:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**Add these to Railway variables:**
- `JWT_SECRET` = first generated string
- `JWT_REFRESH_SECRET` = second generated string

---

### **STEP 7: Deploy Frontend**

```bash
# Navigate to frontend folder
cd ../frontend

# Link to same Railway project
railway link

# Deploy frontend
railway up
```

---

### **STEP 8: Add Environment Variables (Frontend)**

**In Railway Dashboard:**

1. Click on "frontend" service
2. Go to "Variables" tab
3. Add:

```bash
NEXT_PUBLIC_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}/api/v1
```

**This automatically links frontend to backend!**

---

### **STEP 9: Update Backend with Frontend URL**

1. Go back to "backend" service
2. Go to "Variables" tab
3. Update or add:

```bash
FRONTEND_URL=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}
```

---

### **STEP 10: Redeploy Both Services**

```bash
# Redeploy backend
cd backend
railway up

# Redeploy frontend
cd ../frontend
railway up
```

---

## ✅ VERIFICATION

### **Check if everything is running:**

1. **Backend:**
   - Go to Railway dashboard
   - Click on backend service
   - Click "View Logs"
   - Should see: "Server running on port 5000"

2. **Frontend:**
   - Click on frontend service
   - Click "View Logs"
   - Should see: "Ready on http://0.0.0.0:3000"

3. **Database:**
   - Click on PostgreSQL plugin
   - Should show "Running"

4. **Redis:**
   - Click on Redis plugin
   - Should show "Running"

---

## 🌐 GET YOUR URLS

**Backend URL:**
```
https://your-backend-name.up.railway.app
```

**Frontend URL:**
```
https://your-frontend-name.up.railway.app
```

**Test backend:**
```bash
curl https://your-backend-name.up.railway.app/health
```

**Should return:**
```json
{"status": "ok", "timestamp": "..."}
```

---

## 🧪 TESTING

### **1. Test Frontend:**
Visit: `https://your-frontend-name.up.railway.app`

Should see your landing page ✅

### **2. Test Registration:**
1. Click "Get Started"
2. Fill registration form
3. Should create account ✅

### **3. Test Login:**
1. Login with credentials
2. Should redirect to dashboard ✅

### **4. Test AI Grading:**
1. Login as teacher
2. Create exam with essay question
3. Login as student
4. Take exam and submit essay
5. Check if AI grades it ✅

### **5. Test Communications:**
1. Send message between roles
2. Check inbox/sent
3. Verify file attachments work ✅

---

## 🔧 TROUBLESHOOTING

### **Backend won't start:**
```bash
# Check logs
railway logs --service backend

# Common issues:
# - Missing environment variables
# - Database connection failed
# - Port already in use
```

### **Frontend won't build:**
```bash
# Check logs
railway logs --service frontend

# Common issues:
# - Missing NEXT_PUBLIC_API_URL
# - Build errors
# - Memory limit exceeded
```

### **Database connection failed:**
```bash
# Verify PostgreSQL is running
# Check DATABASE_URL is set correctly
# Ensure DB variables reference Postgres plugin
```

### **AI grading not working:**
```bash
# Verify OPENAI_API_KEY is set
# Check OpenAI API quota
# Review backend logs for errors
```

---

## 💰 COST MONITORING

**Railway Free Tier:**
- 500 hours/month execution time
- $5 credit/month
- 512 MB PostgreSQL
- Redis included

**Monitor usage:**
1. Go to Railway dashboard
2. Click "Usage"
3. Check current consumption

**If you exceed free tier:**
- Railway will charge $0.000231/minute
- ~$10-20/month for small apps
- Set spending limit in settings

---

## 🎯 QUICK REFERENCE

### **Deploy Backend:**
```bash
cd backend
railway link
railway add --plugin postgresql
railway add --plugin redis
railway up
```

### **Deploy Frontend:**
```bash
cd frontend
railway link
railway up
```

### **View Logs:**
```bash
railway logs --service backend
railway logs --service frontend
```

### **Open in Browser:**
```bash
railway open
```

### **Check Status:**
```bash
railway status
```

---

## 📝 ENVIRONMENT VARIABLES SUMMARY

### **Backend (Required):**
- ✅ `OPENAI_API_KEY` - Your OpenAI key (you have it)
- ✅ `JWT_SECRET` - Generate new
- ✅ `JWT_REFRESH_SECRET` - Generate new
- ✅ `NODE_ENV=production`
- ✅ Database variables (auto from Railway)
- ✅ Redis variables (auto from Railway)
- ✅ `FRONTEND_URL` (auto reference)

### **Frontend (Required):**
- ✅ `NEXT_PUBLIC_API_URL` (auto reference to backend)

**Total manual variables: 3**
- OpenAI key (you have)
- JWT secret (generate)
- JWT refresh secret (generate)

**Everything else: Automatic!** ✅

---

## 🎉 SUCCESS!

**Once deployed, you'll have:**
- ✅ Live backend API
- ✅ Live frontend app
- ✅ PostgreSQL database
- ✅ Redis cache
- ✅ AI grading working
- ✅ All features functional
- ✅ Automatic deployments
- ✅ Professional URLs

**Time to deploy: ~30 minutes**

**Your AI Exam Platform is LIVE!** 🚀🎓

---

## 🔄 FUTURE DEPLOYMENTS

**After initial setup, deploying updates is simple:**

```bash
# Make changes to code
# Commit to git (optional)

# Deploy backend
cd backend
railway up

# Deploy frontend
cd frontend
railway up
```

**Railway auto-deploys on git push if connected to GitHub!**

---

## 📞 NEXT STEPS

1. **Install Railway CLI**
2. **Run the commands above**
3. **Add environment variables in dashboard**
4. **Test your app**
5. **Share with users!**

**Need help? Check Railway logs or documentation.**

**Your app is ready to go live!** 🚀
