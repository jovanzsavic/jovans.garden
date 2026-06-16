# Cottage Reservation System

A full MEAN-stack web application for managing cottage rentals, reservations, and reviews with role-based features for tourists, owners, and administrators.

![Cottage Reservation Banner](https://github.com/user-attachments/assets/41c2c225-da26-4660-9527-c1d221dcfd04)


## 🏠 Project Overview

This project is a comprehensive cottage reservation platform built with Angular for the frontend and Node.js with Express and MongoDB for the backend. The application allows:

- Tourists to browse cottages, make reservations, and leave reviews
- Cottage owners to manage their properties and handle reservation requests
- Administrators to oversee user registrations and manage the platform

## Technologies Used

| Category | Technologies |
|----------|-------------|
| **Frontend** | • Angular 18<br>• TypeScript<br>• RxJS<br>• FullCalendar<br>• Leaflet Maps |
| **Backend** | • Node.js<br>• Express<br>• TypeScript<br>• MongoDB<br>• Mongoose |
| **Security & Utils** | • Bcrypt (password hashing)<br>• Multer (file uploads)<br>• JWT authentication |

## Project Structure

### Backend

```
backend_Node/
├── src/
│   ├── controllers/        # Request handlers
│   ├── models/            # Database models (Mongoose schemas)
│   ├── routes/            # API routes
│   └── server.ts          # Main server file
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

### Frontend

```
frontend/
├── src/
│   ├── app/
│   │   ├── admin/         # Admin components
│   │   ├── authentication/ # Login/register components
│   │   ├── cottage-detail/ # Cottage details view
│   │   ├── header/        # Header component
│   │   ├── home/          # Home page component
│   │   ├── models/        # TypeScript interfaces
│   │   ├── owner/         # Cottage owner components
│   │   ├── services/      # API services
│   │   ├── shared/        # Shared components
│   │   ├── tourist/       # Tourist user components
│   │   ├── app.component.ts # Root component
│   │   └── app.routes.ts   # Application routes
│   ├── assets/            # Static assets
│   └── index.html         # Main HTML file
├── angular.json           # Angular configuration
└── package.json           # Dependencies and scripts
```

## Core Features

### For Tourists
- Browse available cottages
- Search and filter by location, price, etc.
- View detailed cottage information with images
- Make reservation requests
- Manage personal reservations
- Leave reviews for visited cottages
- Update profile information

### For Cottage Owners
- Manage cottage listings (add, edit, delete)
- Upload cottage images
- Set pricing and availability
- Review and respond to reservation requests
- View reservation calendar
- View statistics about rentals and earnings
- Update profile information

### For Administrators
- Approve new user registrations
- Manage all users (activate/deactivate)
- Monitor and moderate cottage listings
- Handle system settings

## Data Models

| Model | Properties |
|-------|-----------|
| **User** | • Username, password, personal info<br>• Role (tourist/owner/admin)<br>• Email, phone, address<br>• Profile image<br>• Account status |
| **Cottage** | • Name, location, services<br>• Price per night range<br>• Owner reference<br>• Geographic coordinates<br>• Image gallery<br>• Reviews and ratings |
| **Reservation** | • Cottage and tourist references<br>• Date range (from/to)<br>• Guest count (adults/children)<br>• Status workflow<br>• Price and payment details<br>• Reviews and comments |

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB
- Angular CLI

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend_Node
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Build the TypeScript files:
   ```
   npm run build
   ```
4. Start the server:
   ```
   npm start
   ```
   The backend server will run on http://localhost:4000

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
   The application will be available at http://localhost:4200

## API Endpoints

| Resource | Endpoint | Method | Description | Access |
|----------|----------|--------|-------------|--------|
| **Authentication** | `/auth/login` | POST | User login | Public |
| | `/auth/register` | POST | User registration | Public |
| **Users** | `/users` | GET | Get all users | Admin |
| | `/users/:id` | GET | Get specific user | Authenticated |
| | `/users/:id` | PUT | Update user | Owner/Admin |
| | `/users/:id` | DELETE | Delete user | Admin |
| **Cottages** | `/cottages` | GET | Get all cottages | Public |
| | `/cottages/:id` | GET | Get specific cottage | Public |
| | `/cottages` | POST | Create cottage | Owner |
| | `/cottages/:id` | PUT | Update cottage | Owner |
| | `/cottages/:id` | DELETE | Delete cottage | Owner |
| **Reservations** | `/reservations` | GET | Get all reservations | Admin |
| | `/reservations` | POST | Create reservation | Tourist |
| | `/reservations/:id` | PUT | Update reservation | Tourist/Owner |
| | `/reservations/:id/approve` | POST | Approve reservation | Owner |
| | `/reservations/:id/reject` | POST | Reject reservation | Owner |
| | `/reservations/:id/cancel` | POST | Cancel reservation | Tourist/Owner |
| **Reviews** | `/reviews` | POST | Add review | Tourist |
| | `/reviews/cottage/:id` | GET | Get reviews for cottage | Public |
| | `/reviews/tourist/:id` | GET | Get reviews by tourist | Public |

## Key Features Implementation

### Interactive Calendar
The system uses FullCalendar for visualizing reservations in an interactive calendar, making it easy for owners to see bookings at a glance.

### Map Integration
Leaflet maps are integrated to show cottage locations and allow tourists to find accommodations in their preferred areas.

### Image Management
The application handles multiple image uploads for cottages, enhancing property listings with visual content.

### Reservation Workflow
The system implements a complete workflow for reservations, from initial request through approval/rejection, to post-stay reviews.

### User Roles and Permissions
Different user types (tourist, owner, admin) have specific permissions and tailored interfaces for their needs.

## Future Improvements
- Implement payment processing
- Add real-time notifications for reservation status changes
- Enhance search capabilities with more filters
- Add multi-language support
- Implement mobile responsive design improvements


<img width="1911" height="919" alt="image" src="https://github.com/user-attachments/assets/6ef1782b-2768-4de1-bc96-089c0f3e0770" />

<img width="1920" height="916" alt="image" src="https://github.com/user-attachments/assets/3bc0a4d4-877b-4525-9db6-e9575e850ccd" />

<img width="844" height="915" alt="image" src="https://github.com/user-attachments/assets/ef1f77a4-dc57-4101-b4b5-1059fd95d65f" />

<img width="1920" height="792" alt="image" src="https://github.com/user-attachments/assets/88a2b32b-fc26-44ab-8386-5f7b8fab88e5" />

<img width="1915" height="908" alt="image" src="https://github.com/user-attachments/assets/bdcc7153-439e-4612-9fc9-04ba9bb5f447" />

<img width="1908" height="919" alt="image" src="https://github.com/user-attachments/assets/066b7f06-fa12-4140-9368-7d7b29aa91ce" />

<img width="1920" height="841" alt="image" src="https://github.com/user-attachments/assets/fb4e0c36-c041-4b86-8156-6cdb26df2e85" />
