# 🚀 Configuración de Supabase

## ⚠️ IMPORTANTE: RLS Deshabilitado

El schema SQL **deshabilita RLS inicialmente** para que funcione en desarrollo. Esto es seguro porque:
- ✅ Solo tú tienes acceso a la base de datos en desarrollo
- ✅ Supabase Auth sigue protegiendo el acceso
- ✅ Más tarde habilitarás RLS en producción

## Paso 1: Ejecutar el Schema SQL

1. **Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)**
2. **SQL Editor** → **New Query**
3. **Copia TODO** el contenido de `src/database/schema.sql`
4. **Pégalo** en el editor SQL
5. **Haz clic en "Run"** (o presiona `Cmd + Enter`)

✅ Esto creará:
- Tabla `users` (auto-crea usuario al registrarse)
- Tabla `event_albums`
- Tabla `album_stats`
- Tabla `media_files`
- Índices para performance
- Trigger automático para nuevos usuarios

## Paso 2: Crear el Bucket de Storage

1. **Storage** → **Create a new bucket**
2. **Nombre**: `event-media`
3. **Visibility**: Public (para que invitados vean fotos)
4. **Haz clic en "Create bucket"**

## Paso 3: Verificar Variables de Entorno

En la **raíz del proyecto**, crea un archivo llamado `.env.local`:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=YOUR_PUBLIC_KEY
```

**Dónde obtener estas variables:**
1. En Supabase: **Settings** → **API**
2. Copia el **Project URL**
3. Copia la **Public/Anon Key** (bajo `anon public`)

## Paso 4: Reiniciar la Aplicación

```bash
npm run dev
```

## Paso 5: Testear el Registro

1. Abre `http://localhost:5173/signup`
2. Crea cuenta con email y contraseña
3. Si funciona → se redirige a `/` automáticamente
4. ✅ El usuario se crea en Supabase auth + tabla users

---

## ✅ Verificar que Funcionó

1. **En Supabase Dashboard:**
   - Ve a **SQL Editor**
   - Ejecuta: `SELECT * FROM public.users;`
   - Deberías ver tu usuario registrado ✅

2. **En tu app:**
   - Haz login
   - El navbar muestra tu email ✅
   - Puedes crear álbumes ✅

---

## 🔒 RLS para Producción (Después)

Cuando estés listo para producción, ejecuta esto en SQL Editor:

```sql
-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

-- Políticas de usuarios (solo ven su propia fila)
CREATE POLICY "Users see own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Políticas de álbumes (solo propietario puede ver/editar)
CREATE POLICY "Albums visible to owner" ON public.event_albums
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Albums editable by owner" ON public.event_albums
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Albums deletable by owner" ON public.event_albums
  FOR DELETE USING (auth.uid() = owner_id);

-- Más políticas según necesites...
```

---

## 🚨 Solución de Problemas

| Error | Causa | Solución |
|-------|-------|----------|
| `violates row-level security` | RLS habilitado en tabla | Ya está deshabilitado en el schema nuevo |
| `VITE_SUPABASE_URL not set` | Falta `.env.local` | Crea el archivo con variables |
| `public_code already exists` | Conflicto de código único | Intenta de nuevo, genera otro código |
| `users table not found` | Schema SQL no ejecutado | Ejecuta el SQL en Supabase SQL Editor |

---

## 📋 Checklist

- [ ] Ejecutar schema.sql en Supabase SQL Editor
- [ ] Crear bucket "event-media" en Storage
- [ ] Crear archivo `.env.local` con variables
- [ ] Reiniciar con `npm run dev`
- [ ] Registrarse en signup
- [ ] Verificar usuario en SQL: `SELECT * FROM public.users;`
- [ ] Hacer login
- [ ] Crear primer álbum
- [ ] ✅ DONE!



