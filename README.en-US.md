<div align="center">

# ✨ Job Tracker ✨

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

**[🌐 Live Demo](https://jobtrackerkanban.vercel.app)**

[简体中文](./README.md) | English

</div>

## 📋 Project Overview

Job Tracker is a modern, kanban-style job application management tool built with Next.js and TypeScript. It helps job seekers organize and track their job applications through a visual board interface, representing different stages of the job search process (e.g., Wishlist, Applied, Interviewing, Offer, Rejected).

## ✨ Key Features

- **Visual Kanban Board**: Drag-and-drop interface for managing job applications across columns
- **User Authentication**: Login/Register support with cloud data storage
- **Drag & Drop**: Smooth drag-and-drop functionality using @dnd-kit
- **Dark/Light Mode**: Built-in theme switching
- **Data Persistence**: All data stored via REST API on the backend

## 🛠 Technology Stack

### Frontend Framework
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript** - Type safety and better developer experience

### UI & Styling
- **gluestack-ui v2** - React Native-style UI component library
- **Tailwind CSS 3.4.17** - Atomic CSS framework
- **@dnd-kit/core** - Drag-and-drop functionality
- **lucide-react** - Icon library

### State Management & Networking
- **@tanstack/react-query** - Data fetching and caching
- **axios + axios-auth-refresh** - HTTP client with automatic Token refresh
- **react-toastify** - Toast notifications

### Testing
- **vitest** - Unit testing framework
- **jsdom** - Browser environment simulation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm/bun
- Backend service running at http://localhost:8080 (optional, local storage mode available)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd jobtrackerfrontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### User Authentication
1. Click the "Login" or "Register" button at the top of the page
2. Register a new account or login with an existing account
3. After login, your data will sync to the cloud

### Adding a Job Application
1. Click the "Add New" button
2. Fill in the job title and company name (required)
3. Optionally add job link, location, tags, and notes
4. Select the current status (column) for the application
5. Click "Save" to add the application to the board

### Managing Applications
- **Drag & Drop**: Click and drag cards between columns to update their status
- **Edit**: Click on any card to open the edit form
- **Delete**: Click the trash icon in the edit form

### Data Persistence
After logging in, all data is automatically saved to the backend database. Access your data across different devices.

## 📈 Project Status

**Current Version**: MVP (Minimum Viable Product)

### ✅ Completed Features
- Data models and TypeScript type definitions
- Business logic layer with full test coverage
- User authentication system (Login/Register)
- REST API integration
- JWT Token automatic refresh
- State management via React Context and Hooks
- Complete UI components (Kanban board, columns, cards, forms)
- Drag-and-drop functionality
- Theme switching (dark/light mode)
- Responsive design
- Source platform selection
- Toast notification feedback

### 🔄 In Progress / Planned
- Column customization (add/rename/reorder)
- Search and filtering capabilities
- Statistics and analytics dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.