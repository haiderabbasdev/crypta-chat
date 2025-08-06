# Overview

Crypta is a secure, end-to-end encrypted chat application designed with a stealth-mode terminal aesthetic. The application provides real-time messaging with military-grade encryption, self-destructing messages, and panic mode functionality. Built as a full-stack web application using modern technologies, it prioritizes user privacy and security while maintaining an intuitive user experience disguised as a hacker terminal interface.

## Recent Updates (January 2025)
- ✅ Added beautiful "Love" theme with purple vibes and heart-shaped animations
- ✅ Fixed button positioning overlaps with improved z-index management  
- ✅ Enhanced file download and voice message playback with proper base64 handling
- ✅ Created comprehensive multi-user testing guide with INVITE button
- ✅ Implemented dynamic themed backgrounds (matrix grid + floating elements)
- ✅ Added multi-user connection guide with URL sharing functionality
- ✅ Fixed voice message recording and playback with proper audio blob conversion
- ✅ Enhanced settings modal with new theme selection options

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: TailwindCSS with custom CSS variables for terminal themes (green-on-black), glassmorphism, and light mode variants
- **UI Components**: Radix UI primitives with shadcn/ui component library providing accessible, customizable components
- **State Management**: React Context API for chat state, theme management, and user session handling
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query for server state management and caching

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for HTTP server
- **Real-time Communication**: WebSocket Server (ws library) for instant messaging capabilities
- **Data Storage**: In-memory storage implementation with automatic cleanup of expired messages
- **Database**: Drizzle ORM configured for PostgreSQL with Neon Database serverless integration
- **Session Management**: PostgreSQL session store with connect-pg-simple for persistent user sessions

## Encryption & Security
- **Client-side Encryption**: Web Crypto API using AES-GCM for message encryption and RSA-OAEP for key exchange
- **Key Management**: Client-side key generation and storage with public key sharing for end-to-end encryption
- **Message Expiration**: Automatic message deletion with configurable timers (5s to 1hr)
- **Panic Mode**: Ctrl+Shift+X keyboard shortcut for immediate data destruction and session termination

## Real-time Features
- **WebSocket Events**: User join/leave, typing indicators, message delivery, and panic mode activation
- **Message Types**: Text messages, file sharing (10MB limit), and voice note recording
- **User Management**: Anonymous username generation with session-based authentication
- **Room System**: Multi-room chat support with user presence tracking

## Theme System
- **Terminal Theme**: Black background with green monospace text mimicking hacker terminals
- **Glassmorphism Theme**: Dark mode with translucent elements and neon accents
- **Love Theme**: Purple vibes with pink accents, heart-shaped animations, and romantic styling
- **Light Theme**: Professional appearance for stealth mode in office environments
- **CSS Variables**: Dynamic theme switching with CSS custom properties
- **Dynamic Backgrounds**: Theme-specific animated grids and floating elements

# External Dependencies

## Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection for Neon Database
- **drizzle-orm**: Type-safe ORM for database operations with automatic migration support
- **ws**: WebSocket server implementation for real-time communication
- **express**: Web application framework for HTTP server and API routes

## Frontend Libraries
- **@radix-ui/***: Comprehensive suite of accessible UI primitives (dialogs, dropdowns, forms, etc.)
- **@tanstack/react-query**: Server state management with caching and synchronization
- **wouter**: Minimalist routing library for single-page application navigation
- **tailwindcss**: Utility-first CSS framework with custom color schemes
- **class-variance-authority**: Type-safe variant API for component styling
- **date-fns**: Date utility library for timestamp formatting and manipulation

## Development Tools
- **vite**: Build tool with hot module replacement and optimized bundling
- **typescript**: Static type checking for enhanced developer experience
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay for Replit environment
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling integration

## Security & Validation
- **zod**: Runtime type validation for WebSocket messages and data schemas
- **drizzle-zod**: Integration between Drizzle ORM and Zod for schema validation
- **connect-pg-simple**: PostgreSQL session store for secure session management

## Media & File Handling
- **embla-carousel-react**: Carousel component for media galleries
- **Web Audio API**: Browser-native audio recording for voice notes
- **FileReader API**: Client-side file processing for secure file sharing