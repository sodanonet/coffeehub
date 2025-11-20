# CoffeeHub Admin Portal

A comprehensive Angular admin portal for managing a coffee shop chain, featuring store management, menu editing, and order tracking.

## 🌟 Live Demo & Deployment

### Try It Live

**🔗 [On Render]([https://coffeehub-admin.onrender.com](https://coffeehub-p15i.onrender.com/))**

The application is deployed and running on Render.com's free tier:

| Feature          | Status                                                               |
| ---------------- | -------------------------------------------------------------------- |
| 🌐 **Live URL**  | [On Render](https://coffeehub-p15i.onrender.com/) |
| ☁️ **Platform**  | Render.com (Free Static Site)                                        |
| 🔒 **SSL/HTTPS** | ✅ Automatic via Let's Encrypt                                       |
| 🚀 **CDN**       | ✅ Global distribution                                               |
| 📦 **Build**     | ✅ Automatic on git push                                             |
| 💾 **Bandwidth** | 100GB/month free tier                                                |

### Quick Access

Login with demo credentials:

- **Admin**: `admin / admin123` - Full system access
- **Manager**: `manager / manager123` - Store and menu management
- **Staff**: `staff / staff123` - Read-only access

---

## 🚀 Features

### Core Functionality

- **Dashboard**: Real-time metrics and quick actions
- **Store Management**: Full CRUD operations for coffee shop locations
- **Menu Editor**: Manage menu items, pricing, and availability
- **Order Viewer**: View and manage orders with filtering and pagination

### Technical Features

- **Authentication & Authorization**: Role-based access control (Admin, Manager, Staff)
- **Standalone Components**: Modern Angular architecture
- **Lazy Loading**: Optimized bundle sizes with route-based code splitting
- **Signal-based State Management**: Using Angular signals for reactive state
- **Modern Control Flow**: New `@if`, `@for`, `@switch` syntax (Angular 17+)
- **OnPush Change Detection**: Performance-optimized components
- **Dark Theme Support**: Automatic theme switching with CSS variables
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Reusable Components**: Shared component library (Button, Card, Modal, Table, etc.)
- **Custom Pipes**: Currency formatting, time ago display
- **Guards & Interceptors**: Route protection and HTTP request/response handling

## 🛠️ Technology Stack

- **Angular**: 20.3.0
- **TypeScript**: 5.9.2
- **Tailwind CSS**: 4.1.14 (v4 with CSS-first configuration)
- **PostCSS**: 8.5.6 with @tailwindcss/postcss
- **RxJS**: 7.8.0
- **Node.js**: 18+
- **Docker**: For containerized deployment
- **Nginx**: Production web server

## 📋 Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Angular CLI 20.1.6

## 🔧 Installation

### Clone the repository

```bash
git clone https://github.com/sodanonet/coffeehub.git
cd coffeehub
```

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm start
```

Navigate to `http://localhost:4200/`

### Build for production

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

## 👤 Demo Credentials

The application includes mock authentication with three user roles:

- **Admin**: `admin / admin123`
- **Manager**: `manager / manager123`
- **Staff**: `staff / staff123`

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[📋 Project Summary](docs/SUMMARY.md)** - Complete project overview, metrics, and achievements
- **[🏗️ Architecture Guide](docs/ARCHITECTURE.md)** - Detailed architecture overview, module structure, and design patterns
- **[💡 Design Decisions](docs/DESIGN_DECISIONS.md)** - Rationale behind key technical decisions and trade-offs
- **[📡 API Documentation](docs/API.md)** - Complete API reference for all services
- **[📊 Architecture Diagrams](docs/DIAGRAMS.md)** - Visual representations of system architecture and data flow
- **[✨ Features Guide](docs/FEATURES.md)** - Detailed guide to dark theme, Tailwind CSS, and modern Angular features
- **[🐳 Docker Guide](docs/DOCKER.md)** - Complete Docker deployment guide with examples

## 🏗️ Architecture

### Folder Structure

```
src/app/
├── core/                    # Singleton services, guards, interceptors
│   ├── guards/             # Route guards (auth.ts, role.ts)
│   ├── interceptors/       # HTTP interceptors (auth.ts, error.ts)
│   ├── models/             # Core data models and interfaces
│   └── services/           # Core services (auth.service.ts, api.service.ts)
├── shared/                 # Reusable components, pipes, directives
│   ├── components/         # button.ts, card.ts, modal.ts, table.ts, spinner.ts
│   ├── pipes/             # currency-format.ts, time-ago.ts
│   ├── directives/        # highlight.ts
│   └── utils/             # Utility functions and validators
└── features/              # Feature modules
    ├── auth/              # login.ts - authentication
    ├── dashboard/         # dashboard.ts - main metrics
    ├── stores/            # stores-list.ts, store-form.ts
    ├── menu/              # menu-list.ts, menu-form.ts
    └── orders/            # orders-list.ts, order-detail.ts
```

**Note**: Following Angular 20+ conventions, we remove file type suffixes (`.component`, `.directive`, `.pipe`, `.guard`) from file names and class names for cleaner architecture.

### Key Design Patterns

**Angular 20+ Modern Architecture**:

- Standalone components without NgModules
- New control flow syntax: `@if`, `@for`, `@switch` (Angular 17+)
- Signal-based inputs/outputs: `input()`, `output()`, `model()`
- Dependency injection using `inject()` function instead of constructor injection
- Simplified file naming (remove `.component`, `.directive`, `.pipe` suffixes)
- Protected/readonly modifiers for template-accessed properties

**Smart/Dumb Components**:

- Smart components handle business logic and state
- Dumb components are presentational and reusable

**Signals for State Management**:

- Reactive state using Angular signals
- Type-safe and performant
- Automatic dependency tracking

**OnPush Change Detection**:

- All components use `ChangeDetectionStrategy.OnPush`
- Optimized rendering performance

**Lazy Loading**:

- Feature modules loaded on demand
- Reduced initial bundle size

**Dark Theme Support**:

- CSS variables for theming
- Automatic dark mode with `[data-theme='dark']`
- Smooth transitions between themes
- Tailwind CSS v4 integration for consistent styling
- ThemeService for persistent theme state

**Tailwind CSS v4**:

- CSS-first configuration approach
- Automatic utility generation without explicit theme config
- PostCSS plugin integration
- Optimized CSS output (only used utilities)
- Modern CSS with variables and calc()

**Example Component Structure**:

```typescript
// Modern Angular 20+ component (button.ts)
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    @if (label()) {
      <button (click)="handleClick()">{{ label() }}</button>
    }
  `,
})
export class Button {
  protected readonly label = input<string>('Click me');
  protected readonly clicked = output<void>();

  protected handleClick(): void {
    this.clicked.emit();
  }
}
```

## 🐳 Docker Deployment

### Quick Start with npm scripts

```bash
# Build the Docker image
npm run docker:build

# Run the container (accessible at http://localhost:8080/)
npm run docker:run

# View container logs
npm run docker:logs

# Stop the container
npm run docker:stop

# Start a stopped container
npm run docker:start

# Remove the container
npm run docker:remove

# Full rebuild (remove, build, and run)
npm run docker:rebuild
```

### Manual Docker commands

```bash
# Build Docker image
docker build -t coffeehub-admin .

# Run container in detached mode
docker run -d -p 8080:80 --name coffeehub coffeehub-admin

# Run container in interactive mode (for debugging)
docker run -it -p 8080:80 coffeehub-admin
```

Navigate to `http://localhost:8080/`

### Docker Compose (optional)

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '8080:80'
    environment:
      - NODE_ENV=production
```

## 🧪 Testing

### Run unit tests

```bash
npm test
```

### Run tests with coverage

```bash
npm test -- --code-coverage
```

## 📊 Architecture Decisions

### Why Signals?

- Built-in Angular feature (v16+)
- Better performance than RxJS for simple state
- Simpler mental model for component state
- Automatic dependency tracking

### Why Standalone Components?

- Simplified module structure
- Better tree-shaking
- Easier testing
- Official Angular recommendation

### Why OnPush Change Detection?

- Significant performance improvements
- Forces immutable data patterns
- Better for large applications

### Why Mock Backend?

- Quick prototyping
- No external dependencies
- Easy to demo
- Can be replaced with real API later

## 🔒 Security Features

- Authentication guards on protected routes
- HTTP interceptor for token management
- Role-based access control
- XSS protection headers (via Nginx)
- Content Security Policy ready

## 🚧 Trade-offs & Limitations

### Current Implementation

✅ Full CRUD operations for all features
✅ Mock data for demonstration
✅ Responsive design
✅ Performance optimized

### Future Enhancements

#### Backend & Data Management

- **Real Backend API Integration**: Replace mock services with actual REST/GraphQL API
- **In-Memory Database**: Integrate `json-server` or `@ngrx/entity` for persistent mock data during development
- **Real-time Updates**: WebSocket integration for live order status updates and notifications
- **Advanced Caching Strategy**: Implement service workers and HTTP caching

#### State Management

- **Redux/NgRx Integration**: Migrate from signals to NgRx for complex state management needs
- **State Persistence**: Add `@ngrx/store-devtools` and persist selected state to localStorage
- **Optimistic Updates**: Implement optimistic UI updates with rollback capabilities

#### Architecture & Scalability

- **Micro-Frontend Architecture**:
  - Split admin and customer portals into separate micro-frontends
  - Integrate Vue.js or React micro-frontends alongside Angular using Module Federation
  - Implement shell application for orchestrating multiple frameworks
- **Monorepo Structure**: Migrate to Nx workspace for better code organization and shared libraries
- **Module Federation**: Enable runtime module loading and code sharing between applications

#### Testing & Quality

- **Comprehensive Unit Tests**: Achieve 80%+ code coverage with Jasmine/Jest
- **End-to-End Tests**: Add Cypress or Playwright for full user journey testing
- **Visual Regression Testing**: Integrate Chromatic or Percy for UI consistency
- **Performance Monitoring**: Add Lighthouse CI and real user monitoring (RUM)

#### User Experience

- **Internationalization (i18n)**: Multi-language support with `@angular/localize`
- **Advanced Accessibility**: WCAG 2.1 AA compliance with screen reader testing
- **Progressive Web App (PWA)**: Offline support, push notifications, and app-like experience
- **Advanced Analytics**: Integrate Google Analytics, Mixpanel, or custom analytics
- **Guided Tours**: Add user onboarding with Shepherd.js or Intro.js

#### DevOps & Deployment

- **CI/CD Pipeline**: GitHub Actions or GitLab CI for automated testing and deployment
- **Environment Management**: Multiple environment configurations (dev, staging, prod)
- **Kubernetes Deployment**: K8s manifests with horizontal pod autoscaling
- **Monitoring & Logging**: ELK stack, Prometheus, or Datadog integration
- **Feature Flags**: LaunchDarkly or custom feature toggle system

#### Security Enhancements

- **OAuth 2.0 / OIDC**: Replace mock auth with Auth0, Okta, or AWS Cognito
- **Rate Limiting**: Implement API throttling and DDoS protection
- **Content Security Policy (CSP)**: Strict CSP headers for XSS protection
- **Security Scanning**: Integrate Snyk or Dependabot for vulnerability detection

## 📈 Performance Metrics

### Bundle Sizes (Production Build)

- Initial Bundle: ~79 KB (gzipped)
- Lazy Loaded Chunks: 1-9 KB each
- Total Application: ~280 KB (before gzip)

### Lighthouse Scores (Target)

- Performance: 90+
- Accessibility: 90+
- Best Practices: 95+
- SEO: 90+

## 📝 Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow Angular 20+ style guide and naming conventions
- Use `inject()` function instead of constructor injection
- Remove file type suffixes (`.component`, `.directive`, `.pipe`, `.guard`)
- Use `protected readonly` for template-accessed properties
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Keep components under 300 lines

### Linting & Formatting

- **ESLint**: Code quality and Angular-specific rules
- **Prettier**: Consistent code formatting
- Run `npm run lint` to check for issues
- Run `npm run lint:fix` to auto-fix simple issues
- Run `npm run format` to format all files
- Run `npm run format:check` to verify formatting

### Testing

- Write unit tests for services
- Test component public APIs
- Aim for 80%+ code coverage
- Use TestBed for Angular testing

### Git Workflow

- Use conventional commits
- Keep commits atomic
- Write descriptive commit messages
- Reference issues in commits

## 📄 License

This project is created as a demonstration/portfolio piece.

## 👨‍💻 Author

Created for the Angular Architect Challenge and documented using GitHub Copilot within Visual Studio Code to streamline generation.

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- Community for best practices and patterns
- Mock data generators for realistic testing data

---

**Note**: This is a demonstration project showcasing Angular architecture and best practices. The backend is mocked for demonstration purposes.
