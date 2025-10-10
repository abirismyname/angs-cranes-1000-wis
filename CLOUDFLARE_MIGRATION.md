# Cloudflare Pages Migration Guide

This document explains how to deploy your Ang's Cranes application to Cloudflare Pages with data persistence.

## 🗄️ Data Storage Options

Your pledge information can be stored using **three different Cloudflare storage solutions**:

### 1. **Cloudflare KV (Recommended for Simple Use Cases)**
- **Best for**: Simple key-value storage, perfect for your current pledge system
- **Pros**: Simple API, fast global distribution, built-in caching
- **Cons**: Limited query capabilities, eventually consistent
- **Cost**: Very generous free tier (100k reads/day, 1k writes/day)

### 2. **Cloudflare D1 (Recommended for Complex Queries)**
- **Best for**: Relational data, complex queries, analytics
- **Pros**: Full SQL support, ACID transactions, familiar interface
- **Cons**: More complex setup, newer service
- **Cost**: Generous free tier (5 million rows read/day, 100k rows written/day)

### 3. **Cloudflare R2 (For File Storage)**
- **Best for**: Large files, backups, media
- **Not needed**: For your pledge data use case

## 🚀 Deployment Steps

### Step 1: Create Cloudflare Account
1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Go to **Cloudflare Dashboard** → **Pages**

### Step 2: Set Up KV Storage (Option 1)
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create KV namespaces
wrangler kv:namespace create "PLEDGE_KV"
wrangler kv:namespace create "PLEDGE_KV" --preview
```

Copy the namespace IDs and update `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "PLEDGE_KV"
id = "your-actual-kv-namespace-id"
preview_id = "your-actual-preview-kv-namespace-id"
```

### Step 3: Set Up D1 Database (Option 2)
```bash
# Create D1 database
wrangler d1 create angs-cranes-db

# Run the schema
wrangler d1 execute angs-cranes-db --file=./database/schema.sql
```

### Step 4: Deploy via GitHub (Automated)
1. **Set Repository Secrets** in GitHub:
   - `CLOUDFLARE_API_TOKEN`: Get from Cloudflare → My Profile → API Tokens
   - `CLOUDFLARE_ACCOUNT_ID`: Get from Cloudflare Dashboard → Right sidebar

2. **Push to main branch**: Deployment happens automatically via GitHub Actions

### Step 5: Deploy via Wrangler (Manual)
```bash
# Build the application
npm run build

# Deploy to Cloudflare Pages
npm run pages:deploy
```

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Run locally with Cloudflare Pages Functions
npm run cf:dev
```

This starts a local server with KV access for testing.

## 📊 Managing Pledge Data

### View Current Data
```bash
# List all KV data
wrangler kv:key list --binding=PLEDGE_KV

# Get pledges
wrangler kv:key get pledges --binding=PLEDGE_KV

# Get total received
wrangler kv:key get total-received --binding=PLEDGE_KV
```

### Update Admin Data
```bash
# Update total received cranes
wrangler kv:key put total-received "150" --binding=PLEDGE_KV
```

### Browser Console (Admin)
Once deployed, admin users can update data via browser console:
```javascript
// Update total received cranes
await fetch('/api/pledges', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ totalReceived: 250 })
});
```

## 🌐 Custom Domain (Optional)

1. **Cloudflare Dashboard** → **Pages** → Your project
2. **Custom domains** → **Set up a custom domain**
3. Add your domain (e.g., `angscranes.com`)
4. Cloudflare automatically handles SSL certificates

## 🔒 Security Features

- **DDoS Protection**: Automatic protection against attacks
- **SSL/TLS**: Free certificates with automatic renewal
- **Edge Caching**: Global CDN for fast loading
- **Bot Management**: Protection against spam pledges

## 💰 Cost Expectations

**For your use case (1000 pledges max):**
- **Cloudflare Pages**: Free (500 builds/month included)
- **KV Storage**: Free (well within limits)
- **D1 Database**: Free (well within limits)
- **Custom Domain**: Free (if you use Cloudflare as DNS)

## 🚨 Migration Checklist

- [ ] Update `wrangler.toml` with your actual KV namespace IDs
- [ ] Set GitHub repository secrets
- [ ] Test local development with `npm run cf:dev`
- [ ] Deploy and verify pledge functionality works
- [ ] Verify admin functions work
- [ ] Set up custom domain (optional)
- [ ] Update any hardcoded URLs in your app

## 📞 Support

- **Cloudflare Docs**: [developers.cloudflare.com](https://developers.cloudflare.com)
- **Community Discord**: [Cloudflare Developers Discord](https://discord.gg/cloudflaredev)
- **GitHub Issues**: For app-specific problems

---

**Your app is now ready for global deployment with persistent data storage! 🎉**