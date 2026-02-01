# Job Tracker - Kanban-style Job Application Manager

[中文版本](README_zh.md)

## 📋 Project Overview

Job Tracker is a modern, kanban-style job application management tool built with Next.js and TypeScript. It helps job seekers organize and track their job applications through a visual board interface, representing different stages of the job search process (e.g., Preparing, Applied, Interviewing, Offer, Rejected).

## ✨ Key Features

- **Visual Kanban Board**: Drag-and-drop interface for managing job applications across customizable columns
- **Local Storage**: All data persists in browser localStorage (no backend required)
- **Full CRUD Operations**: Create, read, update, and delete job applications with intuitive forms
- **Drag & Drop**: Smooth drag-and-drop functionality using @dnd-kit
- **Modern UI**: Clean, responsive interface built with gluestack-ui and NativeWind (Tailwind CSS)
- **Dark/Light Mode**: Built-in theme switching
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Unit Testing**: Comprehensive test coverage for business logic and storage layers

## 🛠 Technology Stack

### Frontend Framework
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript** - Type safety and better developer experience

### UI & Styling
- **gluestack-ui** - Component library for consistent design system
- **NativeWind** - Tailwind CSS for React Native/Web
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **@dnd-kit/core** - Drag-and-drop functionality
- **lucide-react** - Icon library

### State & Data Management
- **React Context API** - State management for board data
- **Browser localStorage** - Client-side data persistence
- **Custom Hooks** - `useBoard`, `useDragAndDrop`, `useSourcePlatform`

### Development Tools
- **Vitest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📁 Project Structure

```
jobtrackerfrontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── kanban/
│   │   │   │   ├── context/           # BoardContext for state management
│   │   │   │   ├── hooks/             # Custom hooks (useBoard, useDragAndDrop, etc.)
│   │   │   │   ├── services/          # Business logic and storage services
│   │   │   │   ├── KanbanBox.tsx      # Main board component
│   │   │   │   ├── KanbanColumn.tsx   # Individual column component
│   │   │   │   ├── TaskCard.tsx       # Job card component
│   │   │   │   ├── FormEditWindow.tsx # Edit/create form modal
│   │   │   │   ├── AddNewButton.tsx   # Add new job button
│   │   │   │   └── PreviewWindow.tsx  # Preview component
│   │   │   └── theme/                 # Theme context and tokens
│   │   ├── services/
│   │   │   ├── api/                   # API client setup
│   │   │   └── types/                 # TypeScript type definitions
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Home page
│   │   └── globals.css                # Global styles
├── components/ui/                     # gluestack-ui component wrappers
├── doc/                              # Documentation
│   ├── requirement.md                 # Product requirements
│   ├── progress.md                    # Development progress tracking
│   └── README.md                      # This file
├── public/                           # Static assets
└── package.json                      # Dependencies and scripts
```

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

## 🧪 Testing

Run the test suite:
```bash
npm test
# or
yarn test
# or
pnpm test
# or
bun test
```

Run tests with coverage:
```bash
npm run coverage
# or
yarn coverage
# or
pnpm coverage
# or
bun coverage
```

## 🏗 Architecture

The application follows a layered architecture:

1. **Storage Layer** (`StorageService.ts`): Handles localStorage read/write operations with proper error handling and date serialization
2. **Business Logic Layer** (`BoardService.ts`): Pure functions for adding, moving, updating, and deleting job cards. Fully testable and framework-agnostic
3. **Hook Layer** (`useBoard.ts`, `useDragAndDrop.ts`): React hooks that connect business logic to UI state
4. **UI Layer**: React components that render the board and handle user interactions
5. **Context Layer** (`BoardContext.tsx`): Provides global state management to avoid prop drilling

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run coverage` - Run tests with coverage report

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

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [gluestack-ui](https://ui.gluestack.io/)
- Icons from [lucide-react](https://lucide.dev/)
- Drag-and-drop from [@dnd-kit](https://dndkit.com/)