# 🕊️ Ang's Cranes - Senbazuru for Healing

> *Honoring the Japanese tradition of **senbazuru** - folding 1000 paper cranes for healing and good fortune*

A web application to coordinate community support for Angela's stem cell transplant journey through the beautiful tradition of origami crane folding.

[![Deploy to Cloudflare Pages](https://github.com/abirismyname/angs-cranes-1000-wis/actions/workflows/deploy.yml/badge.svg)](https://github.com/abirismyname/angs-cranes-1000-wis/actions/workflows/deploy.yml)

## 🎯 Mission

Angela is receiving a stem cell transplant on **October 22, 2025**. We're asking friends and community to fold and send origami cranes to celebrate her healing journey, following the Japanese tradition that 1000 cranes bring good fortune and healing.

**🔗 Live Site**: [angs-cranes-1000-wis.pages.dev](https://angs-cranes-1000-wis.pages.dev)

## ✨ Features

- **📊 Real-time Progress Tracking** - Live count of pledged and received cranes
- **🏆 Community Leaderboard** - Celebrate top contributors
- **⏰ Countdown Timer** - Days until transplant day
- **📮 Pledge System** - Easy crane commitment tracking
- **🎉 Goal Celebrations** - Confetti when milestones are reached
- **📱 Responsive Design** - Works on all devices
- **🌐 Global CDN** - Fast loading worldwide via Cloudflare

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Shadcn/ui components
- **Icons**: Phosphor Icons
- **Hosting**: Cloudflare Pages
- **Storage**: Cloudflare KV (Key-Value)
- **Functions**: Cloudflare Pages Functions
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account (for deployment)

### Local Development

```bash
# Clone the repository
git clone https://github.com/abirismyname/angs-cranes-1000-wis.git
cd angs-cranes-1000-wis

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Local Development with Cloudflare

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Start local development with KV storage
npm run build && wrangler pages dev dist --kv PLEDGE_KV
```

## 📁 Project Structure

```text
angs-cranes-1000-wis/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Shadcn/ui components
│   │   └── CraneIcon.tsx # Custom crane icon
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── assets/           # Images and static assets
│   └── App.tsx           # Main application
├── functions/
│   └── api/
│       └── pledges.ts    # Cloudflare Pages Function
├── database/
│   └── schema.sql        # Database schema (future D1 support)
├── public/               # Static assets
├── wrangler.toml         # Cloudflare configuration
└── package.json          # Dependencies and scripts
```

## 🔧 Configuration

### Environment Setup

The application uses Cloudflare KV for data storage. Configuration is handled in `wrangler.toml`:

```toml
name = "angs-cranes-1000-wis"
compatibility_date = "2024-10-10"
pages_build_output_dir = "dist"

[[kv_namespaces]]
binding = "PLEDGE_KV"
id = "your-production-kv-id"
preview_id = "your-preview-kv-id"
```

### GitHub Secrets

For automated deployment, set these secrets in your GitHub repository:

- `CLOUDFLARE_API_TOKEN` - API token with Pages:Edit permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

## 📊 Data Management

### KV Storage Structure

```javascript
// Pledges data
"pledges" → [
  {
    "id": "unique-id",
    "name": "Contributor Name", 
    "craneCount": 25,
    "timestamp": 1728592800000
  }
]

// Total received count (updated by admins)
"total-received" → 150
```

### Admin Functions

Update received crane count via browser console:

```javascript
// Update total received cranes
await fetch('/api/pledges', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ totalReceived: 250 })
});
```

Or via Wrangler CLI:

```bash
wrangler kv key put "total-received" "250" --binding=PLEDGE_KV --remote
```

## 🚢 Deployment

### Automatic Deployment (Recommended)

Push to `main` branch triggers automatic deployment via GitHub Actions.

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist
```

## 📮 Mailing Information

**Send completed origami cranes to:**

```text
Angela's Cranes
3410 E Escuda Rd
Phoenix, AZ 85050
```

**Goal**: 1000 cranes by October 22, 2025

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Acknowledgments

- **Angela** - For inspiring this beautiful community effort
- **Senbazuru Tradition** - The ancient Japanese art of crane folding for healing
- **Contributors** - Everyone folding cranes and spreading hope
- **Cloudflare** - For providing excellent hosting and storage solutions
- **GitHub** - For code hosting and CI/CD capabilities

---

*Made with love and hope for Angela's healing journey* 💝

**🕊️ Every crane counts. Every prayer matters. Every person makes a difference.**
