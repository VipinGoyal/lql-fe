# Advanced Healthcare Appointment & Patient Management System

A comprehensive healthcare management system built with Next.js and Tailwind CSS.

## Features

- Appointment scheduling and management
- Patient records management
- Doctor profiles and availability
- Secure authentication
- Modern and responsive UI
- Dark mode support

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- React Query
- React Hook Form
- Zod
- NextAuth.js
- Headless UI
- Hero Icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:

   ```bash
   npm run start:dev
   ```

4. Edit the `.env` file with the following content:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Open [http://localhost:8080](http://localhost:8080) in your browser

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # Reusable components
│   ├── ui/          # UI components
│   └── layout/      # Layout components
├── lib/             # Utility functions
└── types/           # TypeScript types
```

## Development

- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
