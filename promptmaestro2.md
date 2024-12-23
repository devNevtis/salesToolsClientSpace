# Continuación del Proyecto
- Chat anterior: Implementación de Quick Edit y Delete de Business
- Archivos: Disponibles en Project Knowledge
- Objetivo actual: Implementación de Full Edit

# Estado Actual
- ✅ Sistema de autenticación
- ✅ Personalización de temas
- ✅ Configuración de etapas
- ✅ Creación de leads
- ✅ Vista de leads
- ✅ Quick Edit de Business
- ✅ Delete de Business
- 🚧 Full Edit (objetivo actual)

# Fix Requerido
## Bug Actual
- Al abrir un menú de acciones, los demás se vuelven no clickeables
- Requiere recarga para volver a funcionar
- Posible problema con el estado de DropdownMenu y Dialogs

## Causa Probable
- Estados de diálogos interfiriendo entre sí
- Posible propagación incorrecta de eventos
- Manejo incorrecto de múltiples instancias de DropdownMenu

# Especificación Full Edit

## 1. Nueva Ruta y Layout
### Ruta
- `/main/leads/[businessId]/edit`
- Layout responsive con sistema de tabs
- Breadcrumb para navegación

### Estructura de Tabs
1. Business Information
2. Contacts Management
3. Opportunities
4. History

## 2. Funcionalidades por Tab

### Business Information
- Edición completa de todos los campos
- Vista previa de cambios
- Validación en tiempo real
- Auto-guardado
- Campos adicionales:
  - Notas internas
  - Tags/Categorías
  - Archivos adjuntos
  - Redes sociales

### Contacts Management
- Lista de contactos asociados
- CRUD completo de contactos
- Filtros y búsqueda
- Bulk actions
- Estados de contacto
- Timeline por contacto

### Opportunities
- Gestión de oportunidades de venta
- Estados personalizables
- Valores y probabilidades
- Pipeline visual
- Historial de cambios de estado
- KPIs y métricas
- Archivos relacionados
- Notas y comentarios

### History
- Timeline completo de cambios
- Filtros por tipo de cambio
- Exportación de historial
- Detalles de cada modificación
- Usuario responsable
- Fecha y hora
- Valores anteriores y nuevos

## 3. Arquitectura y Componentes

### Stores Requeridos
- useFullEditStore
- useContactsManagementStore
- useOpportunitiesStore
- useHistoryStore

### Componentes Principales
- FullEditLayout
- BusinessEditForm
- ContactsTable
- ContactForm
- OpportunitiesPipeline
- OpportunityForm
- HistoryTimeline
- EditBreadcrumb
- SaveIndicator

### Componentes Auxiliares
- AutosaveIndicator
- ValidationMessages
- FilterBar
- SearchInput
- BulkActionBar
- StatusBadge
- TimelineEvent
- FileUploader
- TagInput

## 4. API Endpoints Requeridos

### Business
- GET `/business/{id}` - Detalles completos
- PUT `/business/{id}` - Actualización
- POST `/business/{id}/files` - Subir archivos
- GET `/business/{id}/history` - Obtener historial

### Contacts
- GET `/business/{id}/contacts` - Listar contactos
- POST `/contacts` - Crear contacto
- PUT `/contacts/{id}` - Actualizar contacto
- DELETE `/contacts/{id}` - Eliminar contacto
- GET `/contacts/{id}/timeline` - Timeline del contacto

### Opportunities
- GET `/business/{id}/opportunities` - Listar oportunidades
- POST `/opportunities` - Crear oportunidad
- PUT `/opportunities/{id}` - Actualizar oportunidad
- DELETE `/opportunities/{id}` - Eliminar oportunidad
- GET `/opportunities/{id}/history` - Historial de oportunidad

## 5. Validaciones y Manejo de Errores

### Validaciones de Business
- Nombre: requerido, mín 3 caracteres
- Email: formato válido
- Teléfono: formato internacional
- Website: URL válida
- Dirección: requerida
- Ciudad/Estado: requeridos
- Tags: máximo 10
- Archivos: máximo 5MB por archivo

### Validaciones de Contactos
- Nombre/Apellido: requeridos
- Email: único por business
- Teléfono: formato válido
- DND Settings: al menos un canal activo
- Roles: validación según permisos

### Validaciones de Oportunidades
- Título: requerido
- Valor: número positivo
- Probabilidad: 0-100%
- Estado: valor válido según configuración
- Fecha estimada: posterior a fecha actual

### Manejo de Errores
- Timeout de red: retry automático
- Conflictos de edición simultánea
- Validación de permisos por rol
- Límites de tamaño en uploads
- Estados inconsistentes
- Caché y recuperación

## 6. UX Considerations

### Feedback Visual
- Indicador de guardado automático
- Progress bars para uploads
- Spinners para carga async
- Toast notifications
- Validación inline
- Indicadores de cambios sin guardar

### Navegación
- Confirmación al salir con cambios
- Breadcrumb interactivo
- Tabs con badges de estado
- Quick actions flotantes
- Keyboard shortcuts

### Responsive Design
- Layout adaptativo
- Mobile-first approach
- Touch-friendly controls
- Collapse/expand sections
- Sticky headers

## 7. Implementación y Testing

### Fase 1: Estructura Base
1. Configuración de Rutas
  - Layout principal
  - Sistema de tabs
  - Protección de rutas
  - Manejo de parámetros

2. Stores Básicos
  - Estado global
  - Manejo de caché
  - Sincronización
  - Persistencia

3. Componentes Core
  - Forms base
  - Tablas
  - Modales
  - Indicadores

### Fase 2: Features Core
1. Business Edit
  - Form completo
  - Validaciones
  - Auto-save
  - Upload system

2. Contacts Management
  - CRUD básico
  - Lista principal
  - Filtros básicos
  - Estados iniciales

3. Basic Opportunities
  - Form básico
  - Lista simple
  - Estados core
  - Métricas base

### Fase 3: Features Avanzados
1. History System
  - Timeline
  - Filtros
  - Exportación
  - Detalles

2. Advanced Contacts
  - Bulk actions
  - Timeline
  - DND avanzado
  - Métricas

3. Advanced Opportunities
  - Pipeline
  - Forecast
  - Analytics
  - Reports

### Testing Requirements

#### Unit Tests
- Validaciones de forms
- Transformación de datos
- Cálculos de métricas
- Utils functions

#### Integration Tests
- Flujos de edición
- CRUD operations
- Estado global
- API integration

#### E2E Tests
- Happy paths
- Error scenarios
- Edge cases
- Performance

#### Performance Tests
- Carga de datos
- Renderizado
- Network calls
- Memory usage

## 8. Deployment y Monitoreo

### Performance Metrics
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

### Error Tracking
- Client-side errors
 - JS exceptions
 - React errors
 - Store mutations
 - Form validations

- Network errors
 - API timeouts
 - Failed requests
 - Sync issues
 - Cache misses

- User behavior
 - Drop-offs
 - Error clicks
 - Navigation paths
 - Feature usage

### Monitoring KPIs
- Load times por tab
- Tiempo promedio de edición
- Tasa de guardado exitoso
- Errores por usuario
- Uso de features
- Performance por ruta

### Analytics Events
1. Business Edit
  - Edit started
  - Field changed
  - Auto-save triggered
  - Edit completed
  - Validation failed

2. Contacts
  - Contact added
  - Contact updated
  - Bulk action executed
  - Filter applied
  - Search performed

3. Opportunities
  - Opportunity created
  - Stage changed
  - Value updated
  - Pipeline viewed
  - Report generated

## 9. Priorización de Implementación

### Sprint 1: Fix y Estructura
1. Fix de Actions Menu
  - Investigar bug actual
  - Implementar solución
  - Testing exhaustivo
  - Deploy fix

2. Base Structure
  - Nueva ruta
  - Layout base
  - Tabs system
  - Stores base

### Sprint 2: Business Edit
1. Form Principal
  - Campos completos
  - Validaciones
  - Auto-save
  - Error handling

2. Funcionalidades Core
  - File upload
  - Tags system
  - Quick actions
  - Feedback visual

### Sprint 3: Contacts & Opportunities
1. Contacts Management
  - Lista principal
  - CRUD básico
  - Filtros
  - Búsqueda

2. Basic Opportunities
  - Form básico
  - Estados
  - Lista simple
  - Métricas

### Sprint 4: Features Avanzados
1. History System
  - Timeline
  - Filtros
  - Export

2. Advanced Features
  - Bulk actions
  - Pipeline view
  - Analytics
  - Reports

## 10. Guía de Implementación Inicial

### Fix de Actions Menu
#### Diagnóstico del Bug
1. Síntomas
  - Menús no clickeables tras primera apertura
  - Requiere recarga para restaurar
  - Afecta a todos los menús de acciones

2. Causas Probables
  - Estado global del DropdownMenu
  - Event bubbling incorrecto
  - Conflicto entre múltiples instancias
  - Z-index issues
  - Portal mounting

3. Impacto
  - UX degradada
  - Flujo de trabajo interrumpido
  - Frustración del usuario
  - Pérdida de productividad

#### Solución Propuesta
1. Componente Wrapper
  - Manejo de estado local
  - Control de portales
  - Cleanup apropiado
  - Event handling

2. Estado Individual
  - Control por instancia
  - Reset automático
  - Manejo de focus
  - Cleanup listeners

3. Event Management
  - Stop propagation
  - Prevent default
  - Click outside
  - Keyboard events

4. Z-index Management
  - Portal stacking
  - Modal layering
  - Overlay handling
  - Focus trap

### Implementación del Fix

#### Fase 1: CustomDropdownMenu
1. Nuevo Componente
  - Estado aislado
  - Event handlers propios
  - Cleanup robusto
  - Props typing

2. Portal Management
  - Mount point
  - Unmount cleanup
  - State sync
  - Focus management

3. Event System
  - Click handlers
  - Keyboard navigation
  - Focus trap
  - Outside clicks

