# My Photo App 📸

A modern web application to create and share photo albums from events easily and securely.

## ✨ Features

- **🔐 Secure Authentication**: Create your account and manage your albums
- **📷 Upload Photos**: Upload photos directly or capture with your camera
- **🔗 Share Albums**: Generate a public link for guests to upload photos
- **🎥 Live Capture**: Take photos with your device's camera
- **📊 Statistics**: See how many photos and videos you have in each album
- **👥 Guest Control**: Manage who can upload photos

## 🚀 Quick Start

### Requirements
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Gabo1794/myPhotoApp.git
cd my-photo-app

# Install dependencies
npm install

# Set up environment variables
# Copy .env.example to .env and fill in your Supabase credentials
cp .env.example .env

# Run in development mode
npm run dev

# Build for production
npm run build
```

## 🎯 How to Use

### For Album Owners

1. **Sign Up**: Create an account with your email
2. **Create Album**: Click "New Album" and fill in the details
3. **Upload Photos**: Upload your photos or capture with your camera
4. **Share**: Copy the public link and share with guests
5. **Manage**: View all your photos and statistics on the dashboard

### For Guests

1. **Get the Link**: The album owner sends you a public link
2. **Access Without Registration**: No account needed
3. **View Photos**: See all the photos in the album
4. **Upload Your Photos**: Take photos with your camera or upload from your device
5. **Done!**: Your photos appear automatically in the album

## 📁 Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Application pages
├── services/        # Supabase services
├── hooks/           # Custom React hooks
├── config/          # Configuration (Supabase)
└── styles/          # Global styles
```

## 🛠 Tech Stack

- **Frontend**: React 18.3 + Vite
- **UI**: Material-UI v6
- **Backend**: Supabase (PostgreSQL + Storage)
- **Authentication**: Supabase Auth
- **Routing**: React Router v6

## 📱 Features by Role

### Album Owner
- ✅ Create/edit/delete albums
- ✅ Upload and manage photos
- ✅ View complete statistics
- ✅ Generate public links
- ✅ Control guest permissions

### Guest (No account)
- ✅ View album photos
- ✅ Upload photos without registration
- ✅ Capture photos with camera
- ✅ View upload progress

## 🔒 Security

- Email and password authentication
- Secure public codes for sharing albums
- Permission-based access control
- Secure storage in Supabase

## 🐛 Bug Reports

If you find a bug, please:
1. Check if it's already reported
2. Create an issue with detailed description
3. Include steps to reproduce it

## 💡 Feature Suggestions

Have ideas? We'd love to hear them! Open an issue with the `enhancement` label.

## 📄 License

This project is under the MIT license. See `LICENSE` for details.

## 👨‍💻 Author

**Gabriel** - [GitHub](https://github.com/Gabo1794)

---

**Questions?** Open an issue or contact the author.

Enjoy sharing your moments! 📸✨