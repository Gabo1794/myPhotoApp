# Refactor Supabase - Guía de Implementación

## 📋 Resumen de Cambios

Se ha completado la re-arquitectura de la aplicación con la siguiente estructura:

### Nuevas Carpetas y Archivos Creados

```
src/
├── domain/
│   └── types.ts                 # Tipos TypeScript unificados
├── services/
│   ├── interfaces/
│   │   ├── IAuthService.ts
│   │   ├── IAlbumService.ts
│   │   ├── IMediaService.ts
│   │   └── ISubscriptionService.ts
│   └── supabase/
│       ├── SupabaseAuthService.ts
│       ├── SupabaseAlbumService.ts
│       ├── SupabaseMediaService.ts
│       └── SupabaseSubscriptionService.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useAlbums.ts
│   └── useMedia.ts
├── context/
│   └── ServiceContext.tsx       # Inyección de servicios
├── utils/
│   ├── codeGenerator.ts         # Generador de código público
│   └── formatters.ts            # Utilidades de formato
└── database/
    └── schema.sql               # SQL para crear tablas
```

---

## 🚀 Pasos Siguientes

### 1. **Crear Base de Datos en Supabase**

Ve al dashboard de Supabase → SQL Editor y ejecuta el contenido de `src/database/schema.sql`:

```bash
# Copiar todo el contenido de src/database/schema.sql
# Pegarlo en: https://app.supabase.com/[tu-proyecto]/sql/new
```

Esto creará:
- `public.users`
- `public.event_albums`
- `public.album_stats`
- `public.media_files`

### 2. **Crear Storage Bucket**

En Supabase Dashboard → Storage:
- Click en "Create a new bucket"
- Nombre: `event-media`
- Hacer público (Public bucket)
- Guardar

### 3. **Migrar Componentes Existentes**

Tenemos ejemplos refactorizados para reemplazar:

#### Login (`src/pages/Login/Index.jsx`)
Reemplazar con contenido de `Index.refactored.jsx`:
```javascript
// Ahora usa useAuth() en lugar de SignInWithEmailAndPassword()
const { signIn } = useAuth();
```

#### Album (`src/pages/Album/Index.jsx`)
Reemplazar con `Index.refactored.jsx`:
```javascript
// Ahora usa useAlbums() para gestionar álbumes
const { albums, create, update, delete: deleteAlbum } = useAlbums(user?.id);
```

#### MyPhotos (`src/pages/MyPhotos/Index.jsx`)
Reemplazar con `Index.refactored.jsx`:
```javascript
// Ahora usa useMedia() para galería pública
const { media, upload, deleteMedia } = useMedia();
```

### 4. **Reemplazar Imports en App.jsx**

Ya se ha actualizado `App.jsx` para:
- Importar `ServiceProvider` de `context/ServiceContext`
- Envolver la aplicación con `<ServiceProvider>`

### 5. **Variables de Entorno**

Asegúrate de que `.env` tenga:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=tu-clave-publica
```

### 6. **Eliminar Firebase**

Una vez todo funcione con Supabase:
```bash
# Eliminar archivos Firebase innecesarios
rm src/config/firebase.js
rm firebase.json (si ya no lo necesitas)

# Desinstalar Firebase
npm uninstall firebase
```

---

## 🏗️ Arquitectura de Servicios

### Flujo de Datos

```
React Components (UI Layer)
        ↓
Custom Hooks (useAuth, useAlbums, useMedia)
        ↓
ServiceContext (Dependency Injection)
        ↓
Service Interfaces (IAuthService, IAlbumService...)
        ↓
Supabase Implementations (SupabaseAuthService...)
        ↓
Supabase JS Client
        ↓
PostgreSQL + Storage
```

### Ventajas

✅ **Portabilidad**: Cambiar de Supabase a otro backend solo requiere nuevas implementaciones de servicios
✅ **Testabilidad**: Fácil crear mocks de servicios para testing
✅ **Mantenibilidad**: Lógica de negocio separada de UI
✅ **Escalabilidad**: Multi-tenant SaaS ready

---

## 📝 Ejemplos de Uso

### En un Componente

```jsx
import { useAuth } from '../../hooks/useAuth';
import { useAlbums } from '../../hooks/useAlbums';

function MyComponent() {
  const { user, signIn } = useAuth();
  const { albums, create } = useAlbums(user?.id);

  const handleCreate = async (name) => {
    await create({ name, is_active: true });
  };

  return (
    // JSX aquí
  );
}
```

---

## 🔐 Seguridad (Implementar Después)

Cuando quieras añadir Row Level Security (RLS):

1. En Supabase SQL Editor, ejecutar:
```sql
-- Encontrarás ejemplos en el documento anterior de arquitectura
-- Básicamente:
alter table public.event_albums enable row level security;
alter table public.media_files enable row level security;
-- Luego crear policies específicas por tabla
```

2. Los servicios ya validan permisos, pero RLS asegura que la BD lo enforce también.

---

## 🧪 Testing

Próximo paso: Crear tests para servicios

```typescript
// services/__tests__/SupabaseAlbumService.test.ts
import { SupabaseAlbumService } from '../supabase/SupabaseAlbumService';

describe('SupabaseAlbumService', () => {
  it('should create an album', async () => {
    // Tests aquí
  });
});
```

---

## 📊 Dashboard (Siguiente Fase)

Una vez todo funcione, crear dashboard que muestre:

```jsx
// Será fácil porque:
// 1. useAlbums() da lista de álbumes por usuario
// 2. useMedia() da stats del álbum
// 3. album_stats table evita queries costosas

function Dashboard() {
  const { user } = useAuth();
  const { albums } = useAlbums(user?.id);
  const { stats } = useMedia();
  
  // Render con Charts (Recharts, etc.)
}
```

---

## ✅ Checklist de Implementación

- [ ] Ejecutar `schema.sql` en Supabase
- [ ] Crear bucket `event-media` en Storage
- [ ] Verificar variables de entorno
- [ ] Actualizar componentes (Login, Album, MyPhotos)
- [ ] Testear flujo de auth
- [ ] Testear creación de álbum
- [ ] Testear subida de archivos
- [ ] Migrar datos de Firebase (si es necesario)
- [ ] Remover Firebase del proyecto
- [ ] Implementar RLS (fase posterior)
- [ ] Crear Dashboard

---

## 🆘 Troubleshooting

### Error: "Album not found" al subir
- Verificar que el album fue creado correctamente en DB
- Verificar que `is_active = true`

### Error: "Unauthorized" al eliminar media
- Verificar que `uploaded_by_id` se guardó correctamente
- Para guests, asegurar que el `guestId` se guarda en localStorage

### Error: Storage upload fails
- Verificar que el bucket `event-media` existe y es público
- Verificar permisos del bucket en Supabase

---

## 📞 Contacto / Dudas

Referirse a:
- `src/domain/types.ts` para tipos disponibles
- `src/hooks/useAuth.ts` para ejemplos de manejo de estado
- `.refactored.jsx` para ejemplos completos de componentes

---

**Refactor completado: 2026-03-07** ✨
