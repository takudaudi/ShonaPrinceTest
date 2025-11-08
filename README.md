# To-Do Application

A modern, single-page To-Do application built with React, TypeScript, Tailwind CSS, and shadcn/ui components. The application features a neobrutalism design aesthetic with bold borders, vibrant colors, and playful shadows.

## Features

### Core Functionality
- ✅ **To-Do List Display**: View all your to-do items with title, description, and completion status
- ✅ **Add New To-Do**: Create new tasks with a title and optional description
- ✅ **Update To-Do**: Edit existing to-do items via a modal dialog
- ✅ **Mark as Complete**: Toggle completion status with a checkbox
- ✅ **Delete To-Do**: Remove tasks from your list

### Mock API Integration
- Simulated REST API calls with realistic network delays (800ms)
- GET, POST, PUT, and DELETE operations
- Random error simulation for demonstration purposes
- Proper async/await patterns and error handling

### State Management & UI/UX
- ⏳ **Loading States**: Spinner indicators during API operations
- 🚨 **Error Handling**: Clear error messages with dismissible alerts
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Neobrutalism Design**: Bold borders, vibrant colors, and playful shadows

### Technical Features
- **TypeScript**: Strict typing throughout the application
- **Modern React**: Hooks (useState, useEffect) and functional components
- **Component Architecture**: Well-structured, reusable components
- **Accessibility**: ARIA labels and keyboard navigation support

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality component primitives
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shona-prince
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
shona-prince/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (Button, Input, Dialog, etc.)
│   │   ├── ToDoItem.tsx     # Individual to-do item component
│   │   ├── ToDoList.tsx     # List of to-do items
│   │   ├── AddToDoForm.tsx  # Form to add new to-dos
│   │   └── EditTodoDialog.tsx # Modal for editing to-dos
│   ├── services/
│   │   └── mockApi.ts       # Mock API service with simulated delays
│   ├── types/
│   │   └── todo.ts          # TypeScript interfaces and types
│   ├── lib/
│   │   └── utils.ts         # Utility functions (cn helper)
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles and Tailwind imports
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## Component Architecture

### Main Components

- **App**: Root component managing global state and API calls
- **ToDoList**: Container component displaying all to-do items
- **ToDoItem**: Individual to-do item with actions (edit, delete, toggle)
- **AddToDoForm**: Form component for creating new to-dos
- **EditTodoDialog**: Modal dialog for editing existing to-dos

### UI Components

- **Button**: Customizable button with neobrutalism styling
- **Input**: Text input with bold borders
- **Textarea**: Multi-line text input
- **Dialog**: Accessible modal component
- **Alert**: Error and notification display
- **LoadingSpinner**: Loading indicator

## Mock API

The application uses a mock API service (`src/services/mockApi.ts`) that simulates real API behavior:

- **Delays**: Each API call has an 800ms delay to simulate network latency
- **Error Simulation**: 10% chance of random errors for demonstration
- **Data Persistence**: Data is stored in memory (resets on page refresh)

### API Methods

- `fetchTodos()`: GET - Fetch all to-do items
- `createTodo(todo)`: POST - Create a new to-do
- `updateTodo(id, updates)`: PUT - Update an existing to-do
- `deleteTodo(id)`: DELETE - Remove a to-do

## Design System

### Neobrutalism Style

The application uses a neobrutalism design aesthetic characterized by:

- **Bold Borders**: 4-6px black borders on all interactive elements
- **Hard Shadows**: Offset box shadows (8px-12px) creating depth
- **Vibrant Colors**: Yellow, pink, and white backgrounds
- **Bold Typography**: Uppercase, heavy font weights
- **Playful Interactions**: Active states that "press" elements into the page

### Color Palette

- **Primary**: Black (#000000)
- **Accent**: Yellow (#FBBF24)
- **Background**: Gradient from yellow-100 to pink-100
- **Destructive**: Red (#EF4444)
- **Text**: Black and gray shades

## TypeScript

The application uses strict TypeScript typing:

- All components are typed with interfaces
- API responses have defined types
- No `any` types used
- Proper error handling with typed error objects

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Author

Built as a competency task demonstrating modern React development practices, TypeScript proficiency, and UI/UX design skills.

---

**Note**: This application uses mock data and simulated API calls. All data is stored in memory and will reset when the page is refreshed.
# ShonaPrinceTest
