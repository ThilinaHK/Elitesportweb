@echo off
echo Deploying to Vercel...
git add .
git commit -m "Fix API routing conflicts for PUT methods"
git push
echo Deployment initiated. Check Vercel dashboard for status.
pause