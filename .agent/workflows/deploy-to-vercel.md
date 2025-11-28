---
description: Deploy the ETF platform to Vercel for pre-production testing
---

# Deploy to Vercel Workflow

This workflow guides you through deploying the ETF platform to Vercel for pre-production testing with committee members.

## Prerequisites

Before deploying, ensure:
1. You have a Vercel account (sign up at https://vercel.com if needed)
2. Vercel CLI is installed (`npm i -g vercel`)
3. All environment variables are documented
4. The application builds successfully locally

## Step 1: Verify Local Build

First, ensure the application builds without errors:

```bash
npm run build
```

This will catch any build-time errors before deploying.

## Step 2: Login to Vercel

If not already logged in, authenticate with Vercel:

```bash
vercel login
```

This will open a browser window for authentication.

## Step 3: Review Environment Variables

Check your `.env` file and identify which variables need to be set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- Any other custom environment variables

**Important**: Never commit `.env` to git. Environment variables will be set in Vercel dashboard.

## Step 4: Deploy to Vercel (Preview)

Deploy to a preview environment first:

// turbo
```bash
vercel
```

This command will:
- Link your project to Vercel (first time only)
- Ask you to confirm project settings
- Deploy to a preview URL
- Provide a URL for testing

**During first deployment**, you'll be asked:
- Set up and deploy? (Y)
- Which scope? (Select your account/team)
- Link to existing project? (N for new project)
- Project name? (Accept default or customize)
- In which directory is your code located? (./)
- Want to override settings? (N)

## Step 5: Set Environment Variables in Vercel

After deployment, add environment variables:

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable for Production, Preview, and Development environments

**Option B: Via CLI**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY
```

## Step 6: Redeploy with Environment Variables

After adding environment variables, redeploy:

```bash
vercel --prod
```

This deploys to production with all environment variables.

## Step 7: Test the Deployment

1. Visit the deployment URL provided by Vercel
2. Test key functionality:
   - Homepage loads correctly
   - Application form works
   - Admin portal is accessible
   - Database connections work
   - Email notifications work (if applicable)

## Step 8: Share with Committee Members

Once testing is successful:
1. Copy the production URL from Vercel
2. Share with committee members for pre-production testing
3. Monitor the deployment for any issues

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript types are correct

### Environment Variables Not Working
- Ensure variables are set for the correct environment (Production/Preview)
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Ensure database migrations are applied

### 404 Errors
- Check `vercel.json` configuration
- Verify Next.js routing is correct
- Check build output directory

## Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you push to other branches or open PRs

To enable this, connect your GitHub repository in Vercel dashboard.

## Useful Commands

- `vercel` - Deploy to preview
- `vercel --prod` - Deploy to production
- `vercel logs` - View deployment logs
- `vercel env ls` - List environment variables
- `vercel domains` - Manage custom domains
- `vercel inspect <url>` - Get deployment details
