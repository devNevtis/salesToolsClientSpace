# PROMPT MAESTRO - SALES TOOLS PRO
## PARTE 1: CONTEXTO Y ARQUITECTURA

## CONTEXTO DEL PROYECTO

### Overview del Sistema
- Aplicación de gestión de leads B2B
- Multi-tenancy con personalización por compañía
- Sistema de roles jerárquico (admin > owner > manager > seller)
- Gestión de leads con modelo Business + Contacts
- Personalización de temas y etapas del funnel
- Next.js 14 con App Router
- Gestión completa de pipeline de ventas

### Estado de Implementación

#### Completado
```javascript
// 1. Personalización
   - Sistema de temas por compañía
   - Gestión de etapas del funnel
   - Configuración de productos
{
  theme: true,        // Sistema de temas
  stages: true,       // Etapas de funnel
  products: true      // Productos/oportunidades
}

// 2. Gestión de Leads (Parcial)
   - Creación de Business
   - Creación de Contacts
   - Visualización filtrada por roles
   - Vista de tabla con expansión de contactos
   - Edición rapida de leads
   - eliminacion de leads
{
  business: {
    create: true,     // Creación de business
    read: true        // Lectura y filtrado
  },
  contacts: {
    create: true,     // Creación de contactos
    read: true        // Visualización asociada
  }
}
```

#### Pendiente
1. Fix requerido:
    ##### Bug Actual
    - Al abrir un menú de acciones, los demás se vuelven no clickeables
    - Requiere recarga para volver a funcionar
    - Posible problema con el estado de DropdownMenu y Dialogs
    ##### Causa Probable
    - Estados de diálogos interfiriendo entre sí
    - Posible propagación incorrecta de eventos
    - Manejo incorrecto de múltiples instancias de DropdownMenu
2. Edición completa en ruta dedicada
3. Gestión de oportunidades
4. Otros que surgirán mas adelante
```javascript
{
  leads: {
    update: {
      quick: true,   // Edición rápida
      full: false     // Edición completa
    },
    delete: true     // Eliminación
  },
  opportunities: {
    management: false // Gestión avanzada
  }
}
```

## Objetivos
- Sistema escalable de gestión de leads
- Experiencia personalizable por compañía
- Interfaz intuitiva para usuarios B2B
- Flujos de trabajo optimizados por rol


## ARQUITECTURA TÉCNICA

### Stack Tecnológico
1. Frontend Base:
  - Next.js 14 (App Router)
  - React 18
  - Node.js 18+

2. UI/Componentes:
  - Tailwind CSS
  - shadcn/ui
  - Lucide Icons
  - React Hook Form

3. Estado y Datos:
  - Zustand para estado global
  - Axios para API requests
  - Cookies para autenticación

4. Utilidades:
  - clsx/tailwind-merge para estilos
  - JS-Cookie para manejo de cookies

```javascript
{
  core: {
    framework: "Next.js 14",
    runtime: "Node.js 18+",
    language: "JavaScript/TypeScript"
  },
  frontend: {
    ui: "shadcn/ui",
    styling: "Tailwind CSS",
    icons: "Lucide React",
    forms: "React Hook Form"
  },
  state: {
    global: "Zustand",
    api: "Axios",
    auth: "JWT + Cookies"
  }
}
```

### Estructura del Proyecto
```
src/
├── app/                    
│   ├── (auth)/            # Rutas protegidas
│   │   ├── main/          # Área principal
│   │   │   ├── leads/     # Gestión de leads
│   │   │   └── company/   # Configuración
│   │   └── layout.tsx    
│   ├── login/             # Autenticación
│   └── page.tsx           # Redirect
├── components/           
│   ├── ui/                # Base components
│   ├── leads/             # Lead components
│   ├── companies/         # Company config
│   └── auth/              # Auth components
├── hooks/               
│   ├── use-toast.js
│   ├── use-logo-uploader.js
│   └── useCompanyData.js
├── store/              
│   ├── useLeadsStore.js
│   ├── useCompanyTheme.js
│   └── useCompanyStages.js
├── lib/
│   ├── axios.js          # Axios config
│   └── utils.js          # Utilities
└── config/
    └── env.js            # Environment
```

### Patrones Arquitectónicos

1. Auth & Protection:
```javascript
// Middleware de protección de rutas
export function middleware(request) {
  // Token validation
  const token = request.cookies.get('token')?.value;
  const user = request.cookies.get('user') ? 
    JSON.parse(request.cookies.get('user').value) : null;

  // Route protection
  if (!token && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based access
  if (request.nextUrl.pathname.startsWith('/main/company')) {
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      return NextResponse.redirect(new URL('/main/leads', request.url));
    }
  }

  return NextResponse.next();
}
```

2. State Management:Stores modulares con Zustand
```javascript
// Zustand store pattern
const useStore = create((set, get) => ({
  // State
  data: [],
  loading: false,
  error: null,

  // Actions
  fetch: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('/endpoint');
      set({ data: response.data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  }
}));
```

3. Component Organization(Componentes reutilizables):
```javascript
// Composable components with shadcn
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const BusinessCard = ({ 
  business, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{business.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Business details */}
      </CardContent>
      <CardFooter>
        <Button onClick={onEdit}>Edit</Button>
        <Button onClick={onDelete} variant="destructive">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
```
4. Data Fetching:
```javascript
// Hooks personalizados para datos
export const useCompanyData = () => {
  const { user } = useAuth();
  const { setTheme } = useCompanyTheme();
  const { setStages } = useCompanyStages();

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      const response = await axios.get(
        env.endpoints.company.getById(user.companyId)
      );
      // Actualización de estados
    };

    fetchData();
  }, [user]);
};

```

# PROMPT MAESTRO - SALES TOOLS PRO
## PARTE 2: FUNCIONALIDADES Y DATOS

## FUNCIONALIDADES CORE

### 1. Sistema de Roles
```javascript
const ROLE_PERMISSIONS = {
  admin: {
    access: 'full',
    views: ['config', 'leads', 'team', 'reports'],
    scope: 'company',
    canManage: ['users', 'config', 'leads']
  },
  owner: {
    access: 'elevated',
    views: ['config', 'leads', 'team'],
    scope: 'company',
    canManage: ['config', 'leads']
  },
  manager: {
    access: 'team',
    views: ['leads', 'team'],
    scope: 'team',
    canManage: ['team_leads']
  },
  sale: {
    access: 'basic',
    views: ['leads'],
    scope: 'personal',
    canManage: ['own_leads']
  }
};
```

### 2. Sistema de Personalización

```javascript
// Company Configuration Structure
interface CompanyConfig {
  theme: {
    base1: string;       // Primary color
    base2: string;       // Secondary color
    highlighting: string;// Accent color
    callToAction: string;// CTA color
    logo: string;       // Company logo URL
  };
  stages: Array<{
    _id: string;
    name: string;
    show: boolean;
    order: number;
  }>;
  products: Array<{
    _id: string;
    name: string;
    description: string;
    active: boolean;
  }>;
}
```

### 3. Gestión de Leads

#### Modelo de Datos
```javascript
// Business Model
interface Business {
  _id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdBy: string;    // User ID
  createdAt: Date;
  updatedAt: Date;
}

// Contact Model
interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  business: {
    _id: string;
    name: string;
  };
  assignedTo: string;   // User ID
  dndSettings: {
    Call: { status: boolean };
    Email: { status: boolean };
    SMS: { status: boolean };
    WhatsApp: { status: boolean };
    GMB: { status: boolean };
    FB: { status: boolean };
  };
  opportunities: Array<{
    titles: string[];
    description: string;
    value: number;
    stage: string;
  }>;
}
```
### Flujos principales:
1.	Creacion de Lead:
```javascript
// Flujo de dos pasos
async function createLead(businessData, contactData) {
  // 1. Crear Business
  const business = await createBusiness(businessData);
  
  // 2. Crear Contact
  const contact = await createContact({
    ...contactData,
    business: {
      _id: business._id,
      name: business.name
    }
  });
  
  return { business, contact };
}
2.	Visualizacion de Leads
// Filtrado basado en rol
function getFilteredLeads(user, leads) {
  switch(user.role) {
    case 'owner':
    case 'admin':
      return leads;
    case 'manager':
      return leads.filter(lead => 
        lead.assignedTo === user._id || 
        userIsInTeam(lead.assignedTo, user.team)
      );
    case 'sale':
      return leads.filter(lead => 
        lead.assignedTo === user._id
      );
  }
}
```

## ENDPOINTS API

### Autenticación
```javascript
// Login
POST /dialtools/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  user: {
    _id: string,
    name: string,
    email: string,
    role: string,
    companyId: string
  },
  token: string
}
```

### Business
```javascript
// Create Business
POST /dialtools/business/create
Body: {
  name: string,
  email: string,
  phone: string,
  // ... otros campos
  createdBy: string
}

// Get All Business
GET /dialtools/business/all

// Get Business by User
GET /dialtools/business/createdBy/{userId}
```

### Leads/Contacts
```javascript
// Create Lead
POST /dialtools/leads/create
Body: {
  firstName: string,
  lastName: string,
  email: string,
  business: {
    _id: string,
    name: string
  },
  // ... otros campos
}

// Get All Leads
GET /dialtools/leads/allLeads
```

### Company Configuration
```javascript
// Get Company Config
GET /dialtools/company/{companyId}

// Update Company Config
PUT /dialtools/company/{companyId}
Body: {
  configuration: {
    theme: {...},
    stages: [...]
  }
}
```

## ESTADOS GLOBALES

### 1. Company Theme Store
```javascript
const useCompanyTheme = create((set) => ({
  theme: {
    base1: '',
    base2: '',
    highlighting: '',
    callToAction: '',
    logo: '',
  },
  setTheme: (themeData) => set({ theme: themeData }),
  resetTheme: () => set({ /* initial state */ })
}));
```

### 2. Leads Store
```javascript
const useLeadsStore = create((set, get) => ({
  businesses: [],
  contacts: {},
  isLoading: false,
  error: null,
  
  // UI State
  searchTerm: '',
  visibleColumns: [
    'companyName',
    'email',
    'phone',
    'location',
    'contacts',
    'actions'
  ],

  // Actions
  fetchBusinesses: async (user) => {
    set({ isLoading: true });
    try {
      // Fetch logic based on user role
    } catch (error) {
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  }
}));
```
## FLUJO DE DATOS
1.	Autenticación: 
•	Login → Token JWT
•	Cookie Storage
•	Middleware Validation
•	Role-based Access
2.	Personalización: 
•	Company Config Fetch
•	Theme Store Update
•	Stages Store Update
•	UI Reflection
3.	Leads Management: 
•	Business Creation
•	Contact Association
•	Role-based Filtering
•	State Updates

## Ejemplos de Request/Response
### Login
```javascript
// Request
POST /dialtools/auth/login
{
    "email": "example@nevtistest.com",
    "password": "****"
}

// Response
{
    "user": {
        "_id": "user_id",
        "companyId": "company_id",
        "name": "User Name",
        "email": "example@nevtistest.com",
        "role": "sale",
        "position": "Sales Representative"
    },
    "token": "jwt_token"
}
```

### Create Business
```javascript
// Request
POST /business/create
{
    "name": "Business Name",
    "phone": "+1-555-555-5555",
    "email": "business@example.com",
    "website": "https://www.example.com",
    "address": "123 Business St",
    "city": "City",
    "description": "Description",
    "state": "State",
    "postalCode": "12345",
    "country": "USA",
    "createdBy": "user_id"
}

// Response
{
    "_id": "business_id",
    "name": "Business Name",
    // ... resto de datos
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
}
```
### Craete Contact/Lead
```javascript
// Request
POST /leads/create
{
    "firstName": "John",
    "lastName": "Doe",
    "user": {
        "_id": "user_id",
        "name": "User Name"
    },
    "business": {
        "_id": "business_id",
        "name": "Business Name"
    },
    "email": "contact@example.com",
    "status": "new",
    "dndSettings": {
        "Call": { "status": false },
        "Email": { "status": false },
        "SMS": { "status": false }
    },
    "opportunities": [
        {
            "titles": ["Product A"],
            "description": "Description",
            "value": 1000,
            "stage": "new"
        }
    ]
}

// Response
{
    "_id": "contact_id",
    // ... datos del contacto
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
}
```


