# 📸 Multi-Tenant Photo Album SaaS

## Arquitectura de Refactor Supabase

Este documento describe la nueva arquitectura de la aplicación tras la migración de Firebase a Supabase.

---

## 🏗️ Estructura del Proyecto

```
src/
├── components/              # Componentes UI reutilizables
│   ├── Album/
│   ├── Camera/
│   ├── Gallery/
│   ├── Navbar/
│   └── ...
│
├── pages/                   # Páginas/rutas principales
│   ├── Home/
│   ├── Login/
│   ├── Signup/
│   ├── Album/
│   ├── MyPhotos/
│   └── PublicViews/
│
├── domain/                  # Tipos TypeScript y modelos
│   └── types.ts            # Tipos unificados de la app
│
├── services/                # Capa de servicios (arquitectura limpia)
│   ├── interfaces/         # Contratos de servicios
│   │   ├── IAuthService.ts
│   │   ├── IAlbumService.ts
│   │   ├── IMediaService.ts
│   │   └── ISubscriptionService.ts
│   │
│   └── supabase/           # Implementaciones Supabase
│       ├── SupabaseAuthService.ts
│       ├── SupabaseAlbumService.ts
│       ├── SupabaseMediaService.ts
│       └── SupabaseSubscriptionService.ts
│
├── hooks/                   # Custom React Hooks
│   ├── useAuth.ts          # State + lógica de autenticación
│   ├── useAlbums.ts        # State + lógica de álbumes
│   └── useMedia.ts         # State + lógica de media
│
├── context/                 # React Context API
│   └── ServiceContext.tsx   # Inyección de dependencias
│
├── utils/                   # Utilidades compartidas
│   ├── codeGenerator.ts    # Generador de códigos públicos
│   └── formatters.ts       # Funciones de formato
│
├── config/
│   └── supabase.js         # Cliente Supabase configurado
│
├── database/
│   └── schema.sql          # DDL para crear tablas
│
└── App.jsx                 # Componente raíz (envuelto con ServiceProvider)
```

---

## 🔄 Flujo de Datos

### 1. **React Component** (UI)
```jsx
import { useAuth } from '../../hooks/useAuth';

function LoginPage() {
  const { signIn } = useAuth();
  // ...
}
```

### 2. **Custom Hook** (State Management)
```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  const services = useContext(ServiceContext);
  const [user, setUser] = useState(null);
  
  const signIn = async (email, password) => {
    const user = await services.auth.signIn(email, password);
    setUser(user);
  };
  
  return { user, signIn };
}
```

### 3. **ServiceContext** (Dependency Injection)
```typescript
// src/context/ServiceContext.tsx
export const ServiceContext = createContext<Services>({
  auth: new SupabaseAuthService(),
  album: new SupabaseAlbumService(),
  media: new SupabaseMediaService(),
  subscription: new SupabaseSubscriptionService(),
});
```

### 4. **Service Interface** (Contract)
```typescript
// src/services/interfaces/IAuthService.ts
export interface IAuthService {
  signIn(email: string, password: string): Promise<User>;
  // ...
}
```

### 5. **Service Implementation** (Supabase)
```typescript
// src/services/supabase/SupabaseAuthService.ts
export class SupabaseAuthService implements IAuthService {
  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // ...
  }
}
```

### 6. **Database** (PostgreSQL + Storage)
```sql
-- src/database/schema.sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY,
  email TEXT,
  subscription_status TEXT,
  -- ...
);
```

---

## ✨ Ventajas de esta Arquitectura

### 1. **Separación de Responsabilidades**
- UI components no conocen detalles de Supabase
- Servicios encapsulan toda la lógica de negocio
- Fácil de entender y mantener

### 2. **Portabilidad** (Cambio Fácil de Backend)
Sin tocar componentes UI, puedes cambiar de Supabase a:
```typescript
// Ejemplo: Cambiar a un backend Node.js
// 1. Crear ApiAuthService implements IAuthService
// 2. Cambiar ServiceContext para usar ApiAuthService
// 3. Listo, todo sigue funcionando
```

### 3. **Testabilidad**
```typescript
// Mock fácil para testing
class MockAuthService implements IAuthService {
  async signIn() { return mockUser; }
}
```

### 4. **Tipado Fuerte** (TypeScript)
- Tipos compartidos en `domain/types.ts`
- Interfaces de servicios previenen errores
- Auto-complete en IDEs

---

## 📊 Modelo de Datos Multi-Tenant

### Tablas Principales

#### `users`
```sql
id (UUID, auth.users)
email (TEXT)
subscription_status (free | active | cancelled)
plan_type (starter | professional | enterprise)
storage_limit_mb (INT)
```

#### `event_albums`
```sql
id (UUID)
owner_id (UUID -> users.id)
name (TEXT)
public_code (TEXT UNIQUE) -- Usado en URLs públicas
is_active (BOOLEAN)
expiration_date (TIMESTAMPTZ)
max_files_per_user (INT)
max_file_size_mb (INT)
max_total_storage_mb (INT)
```

#### `media_files`
```sql
id (UUID)
album_id (UUID -> event_albums.id)
owner_id (UUID -> users.id) -- Album owner
uploaded_by_id (UUID) -- Guest or user who uploaded
uploaded_by_name (TEXT)
file_url (TEXT) -- URL en Storage
file_type (photo | video)
file_size_mb (NUMERIC)
```

#### `album_stats`
```sql
album_id (UUID PRIMARY KEY)
total_photos (INT)
total_videos (INT)
total_uploads (INT)
total_storage_mb (NUMERIC)
```

### Relaciones
```
users (1) ──────→ (N) event_albums
                        ↓
                   (1)  │
                        ↓
                   (N) media_files
users (1) ←─────── (N) media_files (uploaded_by_id)
```

---

## 🔐 Seguridad

### Validaciones en Service Layer
```typescript
async upload(albumId, input, userId) {
  // ✓ Verificar album existe y está activo
  // ✓ Verificar no expirado
  // ✓ Verificar límites de storage
  // ✓ Verificar límites por usuario
  // ✓ Verificar tamaño de archivo
}
```

### Row Level Security (Fase 2)
Cuando sea necesario, habilitar RLS en PostgreSQL:
```sql
ALTER TABLE public.event_albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY album_owner_full ON public.event_albums
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());
```

---

## 🚀 Ejemplos de Uso

### Autenticación
```jsx
import { useAuth } from '../../hooks/useAuth';

function LoginForm() {
  const { user, signIn } = useAuth();
  
  const handleLogin = async (email, password) => {
    await signIn(email, password);
    // user se actualiza automáticamente
  };
  
  return (
    <>
      {user && <p>Hola, {user.email}</p>}
      <button onClick={() => handleLogin(...)}>Login</button>
    </>
  );
}
```

### Gestión de Álbumes
```jsx
import { useAuth } from '../../hooks/useAuth';
import { useAlbums } from '../../hooks/useAlbums';

function AlbumManager() {
  const { user } = useAuth();
  const { albums, create, delete: deleteAlbum } = useAlbums(user?.id);
  
  useEffect(() => {
    user && listForOwner(user.id);
  }, [user]);
  
  const handleCreate = async (name) => {
    const album = await create({ name });
    console.log('Album creado:', album.public_code);
  };
  
  return (
    <div>
      {albums.map(album => (
        <div key={album.id}>
          <h3>{album.name}</h3>
          <p>Código público: {album.public_code}</p>
          <button onClick={() => deleteAlbum(album.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}
```

### Galería Pública (Guests)
```jsx
import { useParams } from 'react-router-dom';
import { useAlbums } from '../../hooks/useAlbums';
import { useMedia } from '../../hooks/useMedia';

function PublicGallery() {
  const { publicCode } = useParams();
  const { getByPublicCode } = useAlbums();
  const { media, upload } = useMedia();
  
  const [album, setAlbum] = useState(null);
  const [guestId] = useState(() => {
    let id = localStorage.getItem('guestId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('guestId', id);
    }
    return id;
  });
  
  useEffect(() => {
    const loadAlbum = async () => {
      const found = await getByPublicCode(publicCode);
      setAlbum(found);
    };
    loadAlbum();
  }, [publicCode]);
  
  const handleUpload = async (file) => {
    await upload(album.id, { file, guestId });
  };
  
  return (
    <div>
      {/* Galería renderizada */}
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
    </div>
  );
}
```

---

## 🔄 Migración desde Firebase

1. **Exportar datos de Firebase**
   - Users → Importar a `auth.users`
   - Firestore → Importar a PostgreSQL
   - Storage → Copiar archivos a Supabase Storage

2. **Actualizar URLs de archivos**
   - Firebase Storage → Supabase Storage URLs

3. **Remover Firebase**
   ```bash
   npm uninstall firebase
   rm src/config/firebase.js
   ```

---

## 📈 Escalabilidad

### Optimizaciones actuales
- ✓ Índices en foreign keys
- ✓ `album_stats` tabla para evitar agregaciones costosas
- ✓ Storage structure: `{albumId}/{mediaId}`

### Futuras mejoras
- [ ] RLS policies (PostgreSQL level)
- [ ] Edge functions para cleanup automático
- [ ] Cron jobs para stats rollups
- [ ] CDN para Storage
- [ ] API .NET/Go dedicada (intercambiable con Supabase)

---

## 🧪 Testing

Próximo: Crear suite de tests

```bash
npm install --save-dev vitest @testing-library/react @testing-library/user-event
```

```typescript
// services/__tests__/SupabaseAlbumService.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SupabaseAlbumService } from '../supabase/SupabaseAlbumService';

describe('SupabaseAlbumService', () => {
  let service: SupabaseAlbumService;
  
  beforeEach(() => {
    service = new SupabaseAlbumService();
    // Mock supabase client
  });
  
  it('should create an album with public code', async () => {
    const album = await service.create('user-123', {
      name: 'Vacaciones 2026'
    });
    
    expect(album.public_code).toMatch(/^[A-Z0-9]{6}$/);
    expect(album.owner_id).toBe('user-123');
  });
});
```

---

## 📞 Recursos

- **Documentación**: Leer `REFACTOR_GUIDE.md`
- **Tipos**: Ver `src/domain/types.ts`
- **Ejemplos**: Ver `*.refactored.jsx`
- **Schema**: Ver `src/database/schema.sql`

---

**Arquitectura implementada: Marzo 2026** ✨
