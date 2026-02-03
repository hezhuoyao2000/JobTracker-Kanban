<div align="center">

# ✨ Job Tracker ✨

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

[简体中文](./README.md) | English

</div>

## 📋 Project Overview

Job Tracker is a modern, kanban-style job application management tool built with Next.js and TypeScript. It helps job seekers organize and track their job applications through a visual board interface, representing different stages of the job search process (e.g., Preparing, Applied, Interviewing, Offer, Rejected).

## ✨ Key Features

- **Visual Kanban Board**: Drag-and-drop interface for managing job applications across customizable columns
- **Local Storage**: All data persists in browser localStorage (no backend required)
- **Drag & Drop**: Smooth drag-and-drop functionality using @dnd-kit
- **Dark/Light Mode**: Built-in theme switching

## 🛠 Technology Stack

### Frontend Framework
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript** - Type safety and better developer experience

### UI & Styling
- **gluestack-ui**system
- **NativeWind** - Tailwind CSS for React Native/Web
- **Tailwind CSS 3.4.17**
- **@dnd-kit/core** - Drag-and-drop functionality
- **lucide-react** - Icon library




## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm/bun

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

### Adding a Job Application
1. Click the "Add New" button or click on an empty area in any column
2. Fill in the job title and company name (required)
3. Optionally add job link, location, tags, and notes
4. Select the current status (column) for the application
5. Click "Save" to add the application to the board

### Managing Applications
- **Drag & Drop**: Click and drag cards between columns to update their status
- **Edit**: Click on any card to open the edit form
- **Delete**: Click the trash icon in the edit form (confirmation dialog coming soon)
- **Filter**: Cards are automatically filtered by their status column

### Data Persistence
All data is automatically saved to your browser's localStorage. No account or internet connection is required. Your data will persist across browser sessions.



## 📈 Project Status

**Current Version**: MVP (Minimum Viable Product) - 96% Complete

### ✅ Completed Features
- Data models and TypeScript types
- Business logic layer with full test coverage
- Storage layer with localStorage integration
- React hooks for state management
- Complete UI components (Kanban board, columns, cards, forms)
- Drag-and-drop functionality
- Theme switching (dark/light mode)
- Responsive design
- Source platform selection
- Dynamic hover styles and visual feedback

### 🔄 In Progress / Planned
- Delete confirmation dialog
- Enhanced error handling and user feedback
- Loading states and success notifications
- Column customization (add/rename/reorder)
- Search and filtering capabilities
- Statistics and analytics dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

