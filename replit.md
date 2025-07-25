# Facebook Gift Code Bot System

## Overview

This is a full-stack web application that manages a Facebook Messenger bot for distributing gift codes. The system features a React-based admin dashboard for managing codes and bot settings, with an Express.js backend that handles Facebook webhooks and code distribution logic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend concerns:

- **Frontend**: React + TypeScript with Vite bundler
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend (Client)
- **Dashboard Interface**: Single-page admin panel for managing gift codes, bot users, and settings
- **UI Components**: Comprehensive shadcn/ui component library for consistent design
- **Query Management**: TanStack Query handles API calls and caching
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Backend (Server)
- **Express Server**: Handles API routes and Facebook webhook integration
- **Storage Layer**: Abstract storage interface with in-memory implementation (ready for database migration)
- **Facebook Service**: Manages webhook verification, message parsing, and user profile fetching
- **Code Manager**: File-based code storage system for bulk code management

### Database Schema
- **Users**: Basic user authentication system
- **Bot Users**: Facebook user profiles who interact with the bot
- **Gift Codes**: Manages code inventory with usage tracking
- **Bot Settings**: Configurable bot behavior and messaging

## Data Flow

1. **Facebook Integration**: Webhook receives messages → parses content → handles user interactions
2. **Code Distribution**: Bot checks for available codes → assigns to user → sends via Facebook Messenger
3. **Admin Management**: Dashboard provides real-time views of users, codes, and statistics
4. **Settings Control**: Admins can toggle auto-reply and customize messages through the interface

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **State Management**: TanStack Query for server state
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Form Handling**: React Hook Form with Zod validation

### Backend Dependencies
- **Database**: Drizzle ORM with PostgreSQL support (Neon serverless)
- **Validation**: Zod schemas for type-safe data validation
- **Session Management**: Connect-pg-simple for PostgreSQL sessions

### Facebook Integration
- **Webhook Handling**: Custom Facebook service for message processing
- **User Profile Fetching**: Facebook Graph API integration
- **Message Sending**: Facebook Messenger Platform API

## Deployment Strategy

### Development Setup
- **Vite Dev Server**: Hot module replacement for frontend development
- **Express Server**: TypeScript execution with tsx for backend development
- **Database Migrations**: Drizzle Kit for schema management

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild bundles Node.js application
- **Database**: Drizzle migrations handle schema updates

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **FACEBOOK_PAGE_ACCESS_TOKEN**: For sending messages
- **FACEBOOK_VERIFY_TOKEN**: For webhook verification

The system is designed for easy deployment to platforms like Replit, with development-friendly features like runtime error overlays and automatic reloading. The modular architecture allows for easy scaling and maintenance of both the bot functionality and admin interface.