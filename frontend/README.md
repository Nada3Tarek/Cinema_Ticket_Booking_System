# Cinema Ticket Booking System - Frontend

Angular 17 frontend for the Cinema Ticket Booking System.

## Features

- **Authentication**: Login, Signup with JWT via HttpOnly cookies
- **Browse Movies**: Search, filter, and browse movies with showtimes
- **Movie Details**: View movie information, showtimes, and reviews
- **Booking Flow**: Select seats and book tickets (booking-driven, no direct seat routes)
- **Reviews**: View and create reviews, like and reply
- **Admin Panel**: Manage movies, shows, and halls (CRUD operations)
- **My Bookings**: View booking history

## Tech Stack

- Angular 17
- TypeScript
- Angular Material
- RxJS
- Reactive Forms
- HttpClient with withCredentials for cookies

## Installation

```bash
npm install
```

## Development

```bash
ng serve
```

Navigate to `http://localhost:4200`

## Build

```bash
ng build
```

## Important Notes

- **API Base URL**: `http://localhost:3000/api`
- **Authentication**: Uses HttpOnly cookies (withCredentials: true)
- **Seat Operations**: All seat operations are handled via booking endpoints only
- **Booking Flow**: Reserve → Confirm → Cancel (no direct seat locking/unlocking)

## Project Structure

```
src/
├── app/
│   ├── components/       # Feature components
│   ├── core/            # Core services and interceptors
│   ├── guards/          # Route guards
│   ├── models/         # TypeScript interfaces
│   └── services/       # API services
├── assets/             # Static assets
└── styles.scss         # Global styles
```

