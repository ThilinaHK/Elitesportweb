# Deployment Checklist for Elite Sports Academy

## Pre-Deployment Steps:

### 1. Environment Variables
- [ ] Update NEXTAUTH_URL to your production domain
- [ ] Generate a secure NEXTAUTH_SECRET (32+ characters)
- [ ] Verify MONGODB_URI is accessible from your server
- [ ] Set NODE_ENV=production

### 2. Build Process
```bash
npm run build
npm start
```

### 3. Server Requirements
- [ ] Node.js 18+ installed
- [ ] MongoDB connection accessible
- [ ] Port 3000 available (or configure different port)

### 4. Common Issues & Solutions:

#### Issue: "Module not found" errors
**Solution:** Run `npm install` on the server

#### Issue: Database connection fails
**Solution:** 
- Check MongoDB URI format
- Ensure IP whitelist includes server IP
- Verify network connectivity

#### Issue: Static files not loading
**Solution:**
- Check public folder permissions
- Verify Next.js build completed successfully
- Ensure images are optimized

#### Issue: API routes returning 500 errors
**Solution:**
- Check server logs for detailed errors
- Verify environment variables are set
- Test database connection

### 5. Performance Optimization
- [ ] Enable gzip compression
- [ ] Configure CDN for static assets
- [ ] Set up proper caching headers
- [ ] Monitor memory usage

### 6. Security Checklist
- [ ] Use HTTPS in production
- [ ] Secure MongoDB connection
- [ ] Set secure session cookies
- [ ] Implement rate limiting

### 7. Monitoring
- [ ] Set up error logging
- [ ] Monitor application performance
- [ ] Configure health checks
- [ ] Set up backup procedures

## Deployment Commands:

### For VPS/Dedicated Server:
```bash
# Clone repository
git clone <your-repo-url>
cd Elitesportweb

# Install dependencies
npm install

# Set environment variables
cp .env.production .env.local
# Edit .env.local with your production values

# Build application
npm run build

# Start application
npm start
```

### For PM2 (Process Manager):
```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start npm --name "elite-sports" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### For Docker:
```bash
# Build Docker image
docker build -t elite-sports .

# Run container
docker run -p 3000:3000 --env-file .env.production elite-sports
```

## Troubleshooting:

### Check Application Logs:
```bash
# If using PM2
pm2 logs elite-sports

# If running directly
npm start 2>&1 | tee app.log
```

### Test Database Connection:
```bash
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('DB Connected'))
  .catch(err => console.error('DB Error:', err));
"
```

### Verify Build Output:
- Check `.next` folder exists
- Verify `package.json` scripts
- Test API endpoints manually

## Support:
If issues persist, check:
1. Server error logs
2. Browser console errors
3. Network connectivity
4. Environment variable values