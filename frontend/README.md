# PCS-B-LTD - Professional Construction Services Management Platform

A comprehensive Progressive Web App (PWA) for construction project management with real-time updates, multi-language support, and offline capabilities.

## 🌟 Features

### Core Functionality
- **Role-Based Access Control**: Secure authentication for Admin, Manager, Worker, and Client roles
- **Project Management**: Complete project lifecycle management with real-time updates
- **Inventory Management**: Track materials, equipment, and resources
- **Financial Management**: Transaction tracking and budget management
- **ESG Metrics**: Environmental, Social, and Governance reporting
- **Real-time Communication**: Socket.io powered live updates and notifications

### Technical Features
- **Progressive Web App**: Installable on all devices with offline support
- **Multi-language Support**: English, Swahili, French, Kinyarwanda, and Luganda
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Offline-First**: Service worker caching for uninterrupted usage
- **Gamification**: Badge system and leaderboards for engagement

## 🛠 Tech Stack

- **Frontend**: Next.js 13+ with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + Custom Hooks
- **Authentication**: JWT with refresh tokens
- **Real-time**: Socket.io client
- **Internationalization**: next-i18next
- **PWA**: next-pwa with Workbox
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **API Client**: Axios with interceptors

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── DashboardLayout.tsx
│   │   └── AuthLayout.tsx
│   ├── ui/                    # shadcn/ui components
│   └── ProtectedRoute.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── SocketContext.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useSocket.ts
├── lib/
│   ├── api.ts                # API client
│   ├── auth.ts               # Auth utilities
│   ├── socket.ts             # Socket.io config
│   └── utils.ts              # General utilities
├── pages/
│   ├── dashboard/
│   │   ├── admin/
│   │   ├── manager/
│   │   ├── worker/
│   │   └── client/
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── projects/
│   ├── inventory/
│   ├── transactions/
│   └── esg-metrics/
└── locales/
    ├── en/
    ├── sw/
    ├── fr/
    ├── rw/
    └── lg/
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Your backend API running (see backend documentation)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd pcs-b-ltd-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
# Copy environment template
cp .env.local.example .env.local

# Edit environment variables
# NEXT_PUBLIC_API_URL=http://localhost:3001
# NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Development Server**
```bash
npm run dev
```

5. **Build for Production**
```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables

#### Development (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_JWT_SECRET=your-development-secret
```

#### Production (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
NEXT_PUBLIC_JWT_SECRET=your-production-secret
```

### PWA Configuration

The app is configured as a PWA with:
- Service worker for offline caching
- Web app manifest for installation
- Background sync for offline actions
- Push notifications support

## 🌐 Internationalization

The app supports 5 languages:
- English (en) - Default
- Swahili (sw)
- French (fr)
- Kinyarwanda (rw)
- Luganda (lg)

### Adding New Languages

1. Create translation files in `public/locales/[locale]/`
2. Update `next-i18next.config.js`
3. Add language option to language selector

## 🔐 Authentication & Authorization

### User Roles

- **Admin**: Full system access
- **Manager**: Project and team management
- **Worker**: Task execution and inventory updates
- **Client**: Project visibility and communication

### Protected Routes

Routes are protected based on user roles:
- `/dashboard/admin` - Admin only
- `/dashboard/manager` - Admin + Manager
- `/dashboard/worker` - Admin + Manager + Worker
- `/dashboard/client` - Admin + Manager + Client

## 📱 PWA Features

### Installation
Users can install the app on:
- Mobile devices (iOS/Android)
- Desktop (Chrome, Edge, Safari)
- Tablets

### Offline Functionality
- Cached UI components
- Offline data access
- Background sync when online
- Offline notifications

### Push Notifications
- Real-time project updates
- Task assignments
- Payment notifications
- System alerts

## 🚀 Deployment

### Docker Deployment

1. **Build Docker image**
```bash
docker build -t pcs-b-ltd-frontend .
```

2. **Run with Docker Compose**
```bash
docker-compose up -d
```

### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

### Traditional Hosting

1. **Build the application**
```bash
npm run build
```

2. **Deploy the `out` folder** to your hosting provider

## 📊 Performance Optimization

### Built-in Optimizations
- Next.js automatic code splitting
- Image optimization
- Service worker caching
- Lazy loading components
- Bundle analysis

### Monitoring
- Web Vitals tracking
- Error boundary implementation
- Performance metrics
- User analytics

## 🔒 Security

### Implemented Security Measures
- JWT token authentication
- XSS protection
- CSRF prevention
- Input validation
- Rate limiting (nginx)
- Security headers

### Best Practices
- Environment variable protection
- API endpoint security
- Client-side validation
- Secure storage practices

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Test Structure
- Unit tests for components
- Integration tests for API calls
- E2E tests for user workflows
- PWA functionality tests

## 📈 Analytics & Monitoring

### Integrated Analytics
- User behavior tracking
- Performance monitoring
- Error tracking
- Usage statistics

### Custom Events
- Feature usage
- User engagement
- Conversion tracking
- PWA install rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write comprehensive tests
- Document new features
- Follow commit message conventions

## 📞 Support

For support and questions:
- **Email**: support@pcs-b-ltd.com
- **Documentation**: [Link to docs]
- **Issues**: GitHub Issues
- **Community**: [Link to community]

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Roadmap

### Upcoming Features
- Advanced reporting dashboard
- Mobile app (React Native)
- AI-powered insights
- Advanced ESG analytics
- Integration marketplace
- White-label solutions

### Version History
- v1.0.0 - Initial release
- v1.1.0 - PWA features
- v1.2.0 - Multi-language support
- v1.3.0 - Advanced analytics

---

Built with ❤️ by the PCS-B-LTD Team