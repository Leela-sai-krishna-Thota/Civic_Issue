# 🏙️ Civic Tracker — Civic Issue Reporting System

A comprehensive, state-of-the-art web application that connects citizens, administrators, and municipal workers to resolve community concerns (such as potholes, broken streetlights, water leakages, and illegal dumping). 

---

## 🌟 Key Features

### 👤 For Citizens
- **📝 High-Accuracy Reporting:** Submit civic issues with optional photos and geographical coordinates.
- **🗺️ Interactive Geocoding & Map Pinning:** 
  - Integrated a search bar leveraging **OpenStreetMap's Nominatim API** to search location names or ZIP/PIN codes.
  - Interactive marker clicking and dragging allows pinpointing coordinates precisely even on desktops lacking GPS hardware.
  - Automatically flags low-accuracy detections with citizen notification hints.
- **📊 Real-time Dashboard:** Track submitted reports and their real-time state changes (`Submitted` ➡️ `In Progress` ➡️ `Resolved`).
- **🏆 Gamified Leaderboard:** Earn community points for active reporting, encouraging engagement.
- **🤖 Premium AI Assistant:** Redesigned interactive floating chatbot powered by **Gemini 2.5 Flash** with predefined quick-action queries.

### 👑 For Administrators
- **🎯 Unified Management Control Panel:** Monitor all issues on a central interactive map dashboard.
- **🗺️ Dedicated Single-Issue Maps:** Inside the structured report details view, a dedicated map centers on the selected report's coordinates with status modification dropdowns.
- **👷 Departmental Delegation:** Automatically routes categories to the appropriate departments (e.g. *Public Works*, *Sanitation*, *Water & Sewerage*).
- **👤 Worker Registration:** Directly create and manage municipal worker accounts.

### 👷 For Workers
- **📋 Departmental Task Queue:** View and filter reports assigned specifically to their designated category.
- **🔄 Status Synchronization:** Fast updates to modify task states as work progresses.

---

## 🛠️ Tech Stack

| Frontend | Backend | Database & Storage |
| :--- | :--- | :--- |
| React | Node.js | MongoDB |
| Leaflet & React Leaflet | Express.js | Mongoose (ODM) |
| React Hot Toast | JSON Web Tokens (JWT) | Cloudinary (Image Hosting) |
| Tailwind CSS & Custom CSS | Bcrypt.js (Password Hashing) | Local MongoDB Fallback |
| Google Gemini API | Helmet & CORS | Multer (File Handling) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Cloud Atlas URI or local MongoDB installation)

---

### Setup Instructions

#### 1. Clone & Install
```bash
git clone <repository-url>
cd sihfinal2025
```

#### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend/` folder:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   ```
   > [!NOTE]
   > If no `MONGODB_URI` is supplied or the connection fails, the backend will automatically spin up an in-memory persistent database under `.mongo-data` using `mongodb-memory-server`.

#### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   npm install
   ```
2. Create a `.env` file in the `frontend/` folder:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_GEMINI_API_KEY=your_google_gemini_api_key
   ```

#### 4. Seed Seed-Data (Optional)
Populate the database with pre-configured accounts:
```bash
cd ../backend
npm run seed
```

**Default Accounts:**
*   **Administrator:** `admin@civic.com` / `admin123`
*   **Worker:** `worker@civic.com` / `worker123`
*   **Citizen:** `user@civic.com` / `user123`

---

## 🎯 Running Locally

Run the development servers:

*   **Backend Server:**
    ```bash
    cd backend
    npm run dev
    ```
    *(Runs on `http://localhost:5000`)*

*   **Frontend Client:**
    ```bash
    cd frontend
    npm start
    ```
    *(Runs on `http://localhost:3002`)*

---

## 📁 Directory Structure

```text
sihfinal2025/
├── backend/
│   ├── config/          # Database & configuration
│   ├── controllers/     # Route logic controllers
│   ├── middleware/      # JWT validation middlewares
│   ├── models/          # MongoDB/Mongoose schemas
│   ├── routes/          # API route definitions
│   └── server.js        # Backend entrance script
│
└── frontend/
    ├── public/          # HTML templates & assets
    └── src/
        ├── components/  # React views & components
        ├── api.js       # Base Axios instance
        └── App.js       # Root React component
```

---

## 🤝 Contributing
1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License
This project is licensed under the MIT License.
