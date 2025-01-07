# Sales Tools Pro (English)

B2B lead management system with company customization, built on Next.js 14.

## ✨ Features

- 🔑 **Multi-tenancy** with company customization
- 👥 Hierarchical role system (admin > owner > manager > seller)
- 🎨 Customizable themes
- 📊 Configurable funnel stages
- 📱 Responsive design
- 🚀 Optimized performance
- 📊 Advanced Lead Management
  - Pipeline view with status-based filtering
  - Separate Customers view for won deals
  - Visual indicators for lost leads
  - Real-time status updates
  - Unified contact management

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Frontend:** React 18
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand
- **API:** Axios
- **Auth:** JWT + Cookies

## 📋 Requirements

- Node.js 18+
- npm or yarn
- Sales Tools API access

## 🚀 Quick Start

1. **Clone repository**
```bash
git clone [repository-url]
cd sales-tools-pro
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```env
NEXT_PUBLIC_API_URL=https://api.nevtis.com
NEXT_PUBLIC_AUTH_ENDPOINT=/dialtools/auth
NEXT_PUBLIC_COMPANY_ENDPOINT=/dialtools/company
```

4. **Start development**
```bash
npm run dev
# or
yarn dev
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js routes
│   ├── main/              # Main area
│   │   ├── leads/        # Leads management
│   │   └── company/      # Configuration
│   └── login/            # Authentication
├── components/           # React components
├── hooks/               # Custom hooks
├── store/              # Zustand states
├── lib/                # Utilities
└── config/             # Configurations
```

## 🔐 Roles and Permissions

| Role    | Access                    | Scope          |
|---------|---------------------------|----------------|
| Owner   | Configuration + Leads     | Company-wide   |
| Admin   | Configuration + Leads     | Company-wide   |
| Manager | Leads                     | Team           |
| Sale    | Leads                     | Personal       |

## 🎨 Customization

Companies can configure:

- **Branding**
  - Corporate logo
  - Custom color scheme

- **Sales Process**
  - Funnel stages
  - Order and visibility
  - Products/services

## 📊 Leads Management

- Business creation
- Contact management
- Sales pipeline
- DND system by channel
- Sales opportunities

## 🔄 Current Status

### ✅ Implemented
- Authentication system
- Theme customization
- Stage configuration
- Lead creation
- Leads view
- Full lead management system
  - Status-based filtering (Leads/Customers)
  - Visual treatment for different statuses
  - Real-time updates across views
  - Contact association and management
  - Quick edit and deletion features

### 🚧 Under Development
- Milestones section
- Advanced analytics features
- Bulk operations

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 📚 API Documentation

### Authentication
- `POST /auth/login` - User login

### Business
- `POST /business/create` - Create business
- `GET /business/all` - Get all
- `GET /business/createdBy/:userId` - Filter by creator

### Leads
- `POST /leads/create` - Create lead
- `GET /leads/allLeads` - Get all

### Company
- `GET /company/:id` - Get configuration
- `PUT /company/:id` - Update configuration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Create Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙋‍♂️ Support

For support and questions:
- 📧 Email: diego.b@nevtis.com
- 💬 Slack: sales-tools-pro.slack.com

<!-- ------------------------------------------------------------- -->

# Sales Tools Pro(Español)

Sistema de gestión de leads B2B con personalización por compañía, implementado en Next.js 14.

## ✨ Características

- 🔑 **Multi-tenancy** con personalización por compañía
- 👥 Sistema de roles jerárquico (admin > owner > manager > seller)
- 🎨 Temas personalizables
- 📊 Etapas de funnel configurables
- 📱 Diseño responsive
- 🚀 Rendimiento optimizado

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Frontend:** React 18
- **Estilos:** Tailwind CSS + shadcn/ui
- **Estado:** Zustand
- **Charts:** Recharts 2.12.7
- **API:** Axios
- **Auth:** JWT + Cookies

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- Acceso a API Sales Tools

## 🚀 Inicio Rápido

1. **Clonar repositorio**
```bash
git clone [repository-url]
cd sales-tools-pro
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**
```env
NEXT_PUBLIC_API_URL=https://api.nevtis.com
NEXT_PUBLIC_AUTH_ENDPOINT=/dialtools/auth
NEXT_PUBLIC_COMPANY_ENDPOINT=/dialtools/company
```

4. **Iniciar desarrollo**
```bash
npm run dev
# o
yarn dev
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Rutas Next.js
│   ├── main/              # Área principal
│   │   ├── dashboard/    # Analiticas y funnels
│   │   ├── leads/        # Gestión de leads
│   │   └── company/      # Configuración
│   └── login/            # Autenticación
├── components/           # Componentes React
├── hooks/               # Custom hooks
├── store/              # Estados Zustand
├── lib/                # Utilidades
└── config/             # Configuraciones
```

## 🔐 Roles y Permisos

| Rol     | Acceso                    | Scope          |
|---------|---------------------------|----------------|
| Owner   | Configuración + Leads     | Compañía       |
| Admin   | Configuración + Leads     | Compañía       |
| Manager | Leads                     | Equipo         |
| Sale    | Leads                     | Personal       |

## 🎨 Personalización

Las compañías pueden configurar:

- **Marca**
  - Logo corporativo
  - Esquema de colores personalizados

- **Proceso de Ventas**
  - Etapas del funnel
  - Orden y visibilidad
  - Productos/servicios

## 📊 Gestión de Leads

- Creación de business
- Gestión de contactos
- Pipeline de ventas
- Sistema DND por canal
- Oportunidades de venta

## 🔄 Estado Actual

### ✅ Implementado
- Sistema de autenticación
- Personalización de temas
- Configuración de etapas
- Creación de leads
- Vista de leads
- Full lead edit con múltiples pestañas
  - Edit: Información completa del lead y contactos asociados
  - Notes: Sistema de notas con etiquetas
  - Opportunities: Gestión de oportunidades de venta
- Analytics Dashboard
  - Sales funnel visualization
  - Opportunity funnel tracking
  - Stage-based monetary tracking
- Sistema de feedback mejorado
  - Toasts informativos con estados
  - Transiciones suaves
  - Loading states optimizados

### 🚧 En Desarrollo
- Gestión avanzada de oportunidades

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests con coverage
npm run test:coverage
```

## 📚 Documentación API

### Autenticación
- `POST /auth/login` - Login de usuario

### Business
- `POST /business/create` - Crear business
- `GET /business/all` - Obtener todos
- `GET /business/createdBy/:userId` - Filtrar por creador

### Leads
- `POST /leads/create` - Crear lead
- `GET /leads/allLeads` - Obtener todos

### Compañía
- `GET /company/:id` - Obtener configuración
- `PUT /company/:id` - Actualizar configuración

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit cambios
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push a la rama
   ```bash
   git push origin feature/amazing-feature
   ```
5. Crear Pull Request

## 📄 Licencia

Distribuido bajo licencia MIT. Ver `LICENSE` para más información.

## 🙋‍♂️ Soporte

Para soporte y preguntas:
- 📧 Email: support@sales-tools-pro.com
- 💬 Slack: sales-tools-pro.slack.com