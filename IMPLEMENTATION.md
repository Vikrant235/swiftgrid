# SwiftGrid - Implementation Overview

## What's Built

SwiftGrid is a privacy-first visual CSV editor with two main surfaces:

### 1. Landing Page (`/`)
- **Header**: Logo, auth buttons (Log In / Sign Up), and user avatar when logged in
- **Hero Section**: Compelling headline, tagline, and CTA buttons
- **Features Section**: Three technical pillars with icons (Stateless Architecture, Visual Block Merging, Browser-Native Worker Processing)
- **CTA Section**: Secondary call-to-action to encourage signup
- **Footer**: Navigation links and social media placeholders

### 2. Editor Interface (`/editor`)

#### Layout Components
- **Header**: Persistent SwiftGrid branding and user profile
- **Left Sidebar**: File list showing imported files with row counts and removal capability
- **Top Toolbar**: Action buttons (Export Merged, Remove Duplicates, Strip Empty Lines)
- **Main Workspace**: Interactive canvas for CSV block visualization

#### Core Editor Components
- **CsvBlock**: Draggable rectangle representing a CSV file
  - Height proportional to row count (1 row ≈ 0.5px, min 60px)
  - Shows file name and row count as overlay
  - Supports drag-drop operations
  - Hover states for visual feedback

- **SlicerTool**: Horizontal line with grab handle for structural cuts
  - Positioned below each CSV block
  - Shows current line number (e.g., "Line 500")
  - Draggable handle for adjusting cut position
  - Color-coded for active/idle states

- **Sidebar**: File management
  - Displays imported files with row counts
  - "Import Local File" button
  - Hover-to-remove functionality
  - Total row count display

- **Toolbar**: Data operations
  - Export Merged File
  - Remove Duplicates
  - Strip Empty Lines
  - File counter and status

- **Workspace**: Main canvas
  - Displays all CSV blocks stacked vertically
  - Shows Slicer tool between blocks
  - Status bar with total file/row counts
  - Empty state messaging

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Components**: shadcn/ui (Button component)
- **Icons**: Lucide React
- **Color Scheme**: Dark mode by default (emerald/slate)

### Design Tokens (Dark Mode)
- **Primary**: Emerald green (`oklch(0.66 0.22 142)`)
- **Background**: Near black (`oklch(0.11 0 0)`)
- **Card**: Slightly lighter (`oklch(0.16 0 0)`)
- **Foreground**: Off-white (`oklch(0.92 0 0)`)
- **Borders**: Subtle transparency (`oklch(1 0 0 / 8%)`)

### Modular Structure
Each component is standalone and ready for backend integration:
- `Header.tsx` - Navigation and auth UI
- `Sidebar.tsx` - File list management
- `Toolbar.tsx` - Action buttons
- `CsvBlock.tsx` - Data visualization blocks
- `SlicerTool.tsx` - Visual cutting tool
- `Workspace.tsx` - Canvas orchestration

## Next Steps for Production

### Ready for Integration
✅ UI/UX is complete and responsive
✅ All components are modular and reusable
✅ Dark mode theme is production-ready
✅ Drag-drop event handlers scaffolded

### To Implement
- [ ] File import via File Input API or drag-drop
- [ ] CSV parsing with Web Workers (avoid blocking main thread)
- [ ] OPFS integration for local file storage
- [ ] Merge, deduplication, and strip-empty logic
- [ ] Export to CSV file download
- [ ] Authentication integration (Firebase/Supabase)
- [ ] Persistence layer for user files
- [ ] Error handling and user feedback
- [ ] Responsive mobile layout refinements

## Demo Data
The editor loads with two sample files:
- **File 1**: 15,000 rows (green block)
- **File 2**: 8,500 rows (pink block)

Replace with real data source once file import is implemented.

## Running Locally
```bash
pnpm install
pnpm dev
# Open http://localhost:3000
```
