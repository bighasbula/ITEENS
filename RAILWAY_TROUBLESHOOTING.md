# Railway Troubleshooting Guide

## 🚨 502 Error - Application Failed to Respond

Your Railway service is returning a 502 error, which means the application is not responding properly.

## 🔍 **Common Causes & Solutions**

### **1. Insufficient Resources**
**Problem**: Railway free tier has limited resources
**Solution**: 
- Upgrade to a paid plan for more resources
- Or use RapidAPI as fallback (currently configured)

### **2. Service Not Started**
**Problem**: The Judge0 service might not be running
**Solution**:
1. Go to your Railway dashboard
2. Check if the service is "Running"
3. If not, restart the service
4. Check the logs for startup errors

### **3. Port Configuration**
**Problem**: Wrong port configuration
**Solution**:
- Ensure your Judge0 service is configured to use port 2358
- Check Railway environment variables for PORT

### **4. Memory/CPU Limits**
**Problem**: Service hitting resource limits
**Solution**:
- Monitor Railway dashboard for resource usage
- Consider upgrading plan or optimizing the service

## 🛠️ **Quick Fixes**

### **Option 1: Use RapidAPI (Current Setup)**
The code is currently configured to use RapidAPI as fallback:
1. Get a free RapidAPI key from [Judge0 CE](https://rapidapi.com/judge0-official/api/judge0-ce/)
2. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
   ```

### **Option 2: Fix Railway Service**
1. **Check Railway Dashboard**:
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Find your Judge0 service
   - Check status and logs

2. **Restart Service**:
   - Click "Deploy" to restart
   - Check logs for errors

3. **Verify Configuration**:
   - Ensure Judge0 is properly configured
   - Check environment variables
   - Verify port settings

### **Option 3: Switch to Railway (When Fixed)**
Once your Railway service is working:
1. Edit `lib/judge0-config.ts`
2. Change `SERVICE: 'rapidapi'` to `SERVICE: 'railway'`
3. Restart your Next.js app

## 🔧 **Service Configuration**

### **Railway Environment Variables**
Make sure these are set in Railway:
```env
PORT=2358
JUDGE0_SECRET=your_secret_here
```

### **Docker Configuration**
If using Docker, ensure:
- Port 2358 is exposed
- Health checks are configured
- Resource limits are appropriate

## 📊 **Monitoring**

### **Railway Dashboard**
- Monitor CPU usage
- Check memory consumption
- View deployment logs
- Track request volume

### **Service Health**
Test your service with:
```bash
curl https://worker-production-347a.up.railway.app/languages
```

## 🚀 **Recommended Action**

For now, **use RapidAPI** (already configured) while you fix your Railway service. This ensures your app continues to work while you troubleshoot the deployment issues.

To switch back to Railway later:
1. Fix the Railway service
2. Change `SERVICE: 'rapidapi'` to `SERVICE: 'railway'` in `lib/judge0-config.ts`
3. Restart your app
