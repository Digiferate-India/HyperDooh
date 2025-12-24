# HyperDooh - Digital Signage CMS

A modern, real-time digital signage management system built with React, Vite, and Supabase. HyperDooh allows you to manage, upload, and assign content to digital displays with ease.

## ✨ Features

- 🎨 **Modern UI** - Beautiful, responsive design built with Tailwind CSS
- 🔐 **Authentication** - Secure user authentication with Supabase
- 📊 **Dashboard** - Comprehensive analytics and management dashboard
- 📺 **Screen Pairing** - Easy screen pairing and management
- 📁 **Media Management** - Upload and organize your media files
- 🎬 **Content Assignment** - Assign content to specific screens
- 🔄 **Real-time Updates** - Real-time synchronization across devices
- 📱 **Responsive Design** - Works on all devices and screen sizes

## 🚀 Tech Stack

- **Frontend Framework:** React 19
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS v4
- **Authentication:** Supabase Auth
- **Database:** Supabase PostgreSQL
- **Routing:** React Router v7
- **State Management:** React Context API
- **Animations:** GSAP
- **UI Components:** Lucide React Icons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase** account (for backend services)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd my-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Get your Supabase credentials**
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard)
   - Navigate to **Settings** → **API**
   - Copy your **Project URL** and **anon public** key
   - Add them to your `.env.local` file

## 🏃 Running the Project

### Development Mode

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal).

### Production Build

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
my-project/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── layout/       # Layout components (Sidebar, AppLayout)
│   │   └── ui/           # UI components (StatCard, etc.)
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── pages/            # Page components
│   │   ├── dashboard/    # Dashboard pages
│   │   ├── Home.jsx      # Landing page
│   │   ├── Login.jsx     # Login page
│   │   └── SignUp.jsx    # Sign up page
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   ├── App.css           # App styles
│   └── index.css         # Global styles
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── vite.config.js        # Vite configuration
└── README.md
```

## 🌐 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

3. **Deploy**
   - Vercel will automatically detect it's a Vite project
   - Click "Deploy"
   - Your app will be live!

### Environment Variables in Vercel

Make sure to add these in **Settings** → **Environment Variables**:
- `VITE_SUPABASE_URL` = Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous public key | Yes |

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🎨 Styling

This project uses **Tailwind CSS v4** for styling. All utility classes are available throughout the project.

### Configuration Files

- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration with autoprefixer
- `@tailwindcss/vite` - Vite plugin for Tailwind CSS

## 🔐 Authentication

Authentication is handled by Supabase Auth. Users can:
- Sign up with email/password
- Log in to their accounts
- Log out securely

Protected routes require authentication and redirect to the login page if not authenticated.

## 📊 Dashboard Features

The dashboard provides:
- **Analytics** - View key metrics and statistics
- **Screen Management** - Pair and manage digital screens
- **Media Upload** - Upload images and videos
- **Content Assignment** - Assign content to specific screens
- **Playback Control** - Control what plays on which screens

## 🐛 Troubleshooting

### Environment Variables Not Working

If you see "supabaseUrl is required" error:
1. Check that your `.env.local` file exists in the root directory
2. Verify the variable names are exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Restart your development server after adding variables
4. For Vercel: Ensure variables are added in Settings → Environment Variables

### Build Issues

If the build fails:
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Check for TypeScript/ESLint errors: `npm run lint`


## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Lucide Icons](https://lucide.dev/)
- [GSAP](https://greensock.com/gsap/)

---
