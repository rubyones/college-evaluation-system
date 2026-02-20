# CITE-ES: College of Information Technology Evaluation System

A production-ready frontend application for managing academic evaluations in the College of Information Technology.

## Features

### Core Functionality
- **Student Evaluations**: Students can evaluate their instructors anonymously
- **Teacher Peer Reviews**: Teachers can evaluate their colleagues
- **Dean Administration**: Full admin dashboard for managing evaluations
- **Automated Scoring**: Weighted calculation of evaluation scores
- **AI Insights**: AI-powered feedback analysis and recommendations
- **Analytics & Reporting**: Comprehensive performance analytics and reports

### User Roles
1. **Student**
   - View pending evaluations
   - Submit teacher evaluations with Likert scale ratings
   - Track evaluation history
   - View completion rates

2. **Teacher**
   - View own evaluation results
   - Evaluate peer instructors
   - Access AI coaching insights
   - Download performance reports
   - Track teaching load

3. **Dean (Administrator)**
   - Command center dashboard with KPI metrics
   - Academic period management
   - Evaluation form creation and management
   - User administration
   - System reports and analytics
   - Audit logging
   - System settings and configuration

### Technical Features
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Mode**: Full dark mode support with theme persistence
- **Animations**: Smooth transitions with Framer Motion
- **Performance**: Animated counters with motion preference detection
- **Loading States**: Skeleton loaders for all async operations
- **Role Switcher**: Demo mode for testing different user roles
- **Accessibility**: WCAG compliant components and keyboard navigation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom CSS
- **UI Components**: ShadCN UI patterns
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Theme**: next-themes
- **Icons**: Lucide React
- **State Management**: Zustand (for auth context)
- **Date Handling**: date-fns

## Installation

### Prerequisites
- Node.js 18+ and npm/yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
/app                      # Next.js App Router routes
  /dean                  # Dean admin interface
  /teacher               # Teacher interface
  /student               # Student interface
  /login                 # Login page
  layout.tsx             # Root layout
  globals.css            # Global styles
  page.tsx               # Home page

/components              # Reusable components
  /ui                   # Base UI components (Button, Card, Input, etc)
  /layout               # Layout components (Sidebar, TopNavbar)
  /loading              # Loading skeletons
  /animations           # Animation components
  DashboardCard.tsx     # Dashboard statistics card
  DataTable.tsx         # Reusable data table
  RatingScale.tsx       # Star rating component
  FormStepper.tsx       # Multi-step form indicator
  ChartCard.tsx         # Chart wrapper
  ConfirmationDialog.tsx # Confirmation modal
  NotificationDropdown.tsx

/context               # React contexts
  AuthContext.tsx      # Authentication and role management

/hooks               # Custom React hooks
  index.ts            # useAuth, useFetch, useLocalStorage, etc

/types              # TypeScript type definitions
  index.ts           # All application types and interfaces

/utils              # Utility functions
  helpers.ts         # Date formatting, calculations, styling helpers

/data               # Mock data
  mock.ts            # Mock users, courses, evaluations, etc

/lib                # Library utilities
```

## Key Components

### Base UI Components
- `Button`: Customizable button with variants and loading states
- `Card`: Container component with header, content, footer
- `Input`: Text input with label, error, and helper text
- `Textarea`: Multi-line text input
- `Select`: Dropdown selector
- `Checkbox`: Checkbox input
- `Badge`: Status badge with variants
- `Avatar`: User avatar with fallback
- `Modal`: Dialog modal component
- `Tabs`: Tab navigation
- `ProgressBar`: Progress indicator
- `Alert`: Alert messages with variants
- `Dropdown`: Dropdown menu

### Custom Components
- `DashboardCard`: Statistics card with icon and trend
- `DataTable`: Reusable sortable table
- `RatingScale`: 5-star rating input
- `FormStepper`: Multi-step form progress indicator
- `AnimatedCounter`: Animated number counter
- `ChartCard`: Chart container with title
- `Skeleton Loaders`: Loading states for various components

### Layout Components
- `Sidebar`: Navigation sidebar with role-based items
- `TopNavbar`: Top navigation with theme toggle, role switcher, notifications
- `RoleSwitcher`: Demo mode role switcher dropdown

## Demo Users

Quick login options available on the login page:

- **Student**: Ruby Grace Ones (john.doe@student.college.edu)
- **Teacher**: Ryan Billera (jane.smith@college.edu)
- **Dean**: Jannete Claro (alan.turing@college.edu)

Simply click any user card to instantly log in without password.

## Evaluation Workflow

### 1. Setup Phase (Dean)
- Set academic year and semester
- Create evaluation periods
- Design evaluation forms with criteria and weights
- Assign courses and instructors

### 2. Active Phase (Students/Teachers)
- Students complete teacher evaluations
- Teachers complete peer evaluations
- Deadline enforcement and reminders

### 3. Processing Phase (System)
- Automatic weighted score calculation
- AI sentiment analysis on comments
- Performance trend generation

### 4. Results Phase (All Roles)
- Teachers view personal results
- Dean accesses comprehensive analytics
- Download reports (PDF/Excel)

### 5. Archive Phase
- Evaluation periods close
- Data becomes read-only
- Historical reports accessible

## Evaluation Form Structure

Default criteria template:

1. **Clarity** (30% weight)
   - Max score: 5
   - Measures: Presentation clarity

2. **Subject Mastery** (40% weight)
   - Max score: 5
   - Measures: Content knowledge

3. **Engagement** (30% weight)
   - Max score: 5
   - Measures: Student motivation

Weighted Score = (Clarity × 0.3) + (Mastery × 0.4) + (Engagement × 0.3)

## Dark Mode

The application respects system dark mode preference and allows manual toggling. Theme preference is persisted in localStorage.

Toggle theme:
- Click moon/sun icon in top navbar
- Changes apply instantly across all components

## Mock Data

The application comes pre-loaded with realistic mock data including:

- **5 Users** across all roles
- **4 Courses** with sections and enrollment
- **Multiple Evaluations** showing different completion states
- **Performance Trends** showing score evolution
- **Department Rankings** showing instructor performance
- **Audit Logs** showing system activity

All data is stored in `/data/mock.ts` and can be easily modified or connected to a real backend API.

## Performance Features

- **Code Splitting**: Automatic by Next.js
- **Image Optimization**: Built-in image optimization
- **Motion Preferences**: Respects `prefers-reduced-motion`
- **Animated Counters**: Smooth number animations
- **Lazy Loading**: Components load on demand
- **CSS-in-JS**: Tailwind for optimized styles

## Accessibility

- Semantic HTML throughout
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
- Focus indicators
- Screen reader friendly

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Backend API integration
- Real database connection
- Email notifications
- Two-factor authentication
- API rate limiting
- Data export to multiple formats
- Advanced filtering and search
- Automated scheduling
- Multi-language support

## Contributing

This is a frontend-only demo application designed to showcase a complete evaluation system UI/UX.

## License

Educational project - All rights reserved

## Support

For issues or questions, refer to the codebase structure and component documentation embedded in comments.

---

**Built with ❤️ using Next.js 14, React, and TypeScript**
