# Sales Tools Client

A Next.js 14 application for managing sales processes with customizable themes and funnel stages.

## Features

- 🔐 JWT Authentication
- 🎨 Company-specific theming
- 📊 Sales funnel management
- 👥 Role-based access control
- 🔄 Real-time theme customization
- 📱 Responsive design

## Requirements

- Node.js 18.x or higher
- npm or yarn

## Tech Stack

- Next.js 14.2.18 (App Router)
- Tailwind CSS
- Zustand for state management
- Axios for API requests
- shadcn/ui components

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd sales-tools-client
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=https://api.nevtis.com
NEXT_PUBLIC_AUTH_ENDPOINT=/user/auth
NEXT_PUBLIC_COMPANY_ENDPOINT=/dialtools/company
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── companies/        # Company-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
├── store/               # Zustand stores
└── config/              # Environment and other configs
```

## Authentication

The application uses JWT tokens stored in cookies for authentication. Protected routes are handled through a middleware that checks for valid tokens.

## Theme Customization

Companies can customize their interface with:
- Custom logo
- Color scheme (base colors, highlighting, call-to-action)
- Funnel stages configuration

## Role-Based Access

- Owner: Full access to all features
- Admin: Company configuration access
- Manager: Limited to assigned features
- Sales: Basic access to sales tools

## Development Notes

- Uses Next.js App Router (not Pages Router)
- Implements shadcn/ui for consistent UI components
- State management with Zustand for better performance
- Axios for API communication with interceptors

## TODO

- [ ] Backend integration for new stage creation
- [ ] Enhanced error handling
- [ ] Performance optimizations
- [ ] Additional user management features

## License

[License Type] - See LICENSE file for details