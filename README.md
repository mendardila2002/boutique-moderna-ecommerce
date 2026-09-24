# 🛍️ Boutique Moderna — Plataforma E-commerce Web

<div align="center">


### **SERVICIO NACIONAL DE APRENDIZAJE (SENA)**
**Tecnólogo en Análisis y Desarrollo de Software (ADSO)**  

---

**Aprendiz:** Iván Andrés Méndez Ardila  
**Proyecto Formativo:** Plataforma Web E-commerce para Boutique de Moda con Panel Administrativo  

---

</div>

## Descripción del Proyecto

El proyecto **Boutique Moderna** es una solución web de comercio electrónico de alta gama diseñada bajo el concepto de *"lujo silencioso"*, permitiendo la visualización de catálogo con filtros, gestión de bolsa de compras, proceso de checkout con carga de comprobantes de pago (Nequi / Efectivo) y un panel administrativo privado para la gestión de inventario, actualización de pedidos y atención de mensajes de clientes.

---

## 🎯 Criterios y Elementos Técnicos Cumplidos

De acuerdo con las directrices formativas de la evidencia:

1. **Alineación con artefactos del ciclo de vida del software:**
   - Codificación basada en los requerimientos, historias de usuario, diagramas de clases, casos de uso y prototipos UI/UX diseñados previamente.
2. **Estándares de codificación y buenas prácticas:**
   - Tipado estricto mediante **TypeScript** para interfaces, modelos y server actions.
   - Principios de código limpio (*Clean Code*), modularidad de componentes y separación de responsabilidades.
3. **Código comentado y documentado:**
   - Funciones del backend, server actions y utilidades documentadas con comentarios explicativos.
4. **Herramientas de versionamiento:**
   - Control de versiones estructurado mediante **Git** y repositorio alojado en GitHub.
5. **Seguridad y protección de datos:**
   - Variables de entorno aisladas para credenciales de base de datos, servicios cloud y API keys.

---

## 🚀 Tecnologías y Frameworks Implementados

### Frontend (Cliente & UI)
- **Next.js 14+ (App Router):** Framework React full-stack con Server-Side Rendering (SSR), Server Components y Client Components optimizados.
- **TypeScript:** Tipado estático robusto en toda la base de código.
- **Tailwind CSS:** Diseño responsivo, moderno y estilizado bajo estándares de experiencia de usuario (UX/UI).
- **Lucide React:** Iconografía vectorial minimalista y consistente.
- **Sonner:** Sistema de notificaciones tipo Toast interactivo.
- **Zustand:** Manejo de estado global reactivo y persistente para el carrito de compras y favoritos.

### Backend, Lógica de Negocio & Persistencia
- **Next.js Server Actions & API Routes:** Procesamiento de transacciones en el lado del servidor sin exponer secretos.
- **Prisma ORM:** Mapeador objeto-relacional optimizado para NoSQL con esquemas tipados.
- **MongoDB Atlas:** Base de datos NoSQL documental y escalable en la nube.
- **Middleware de Autenticación:** Protección de rutas administrativas (`/admin`) mediante cookies de sesión HTTP-only seguras.

### Integraciones y Servicios Cloud
- **Cloudinary:** Almacenamiento en la nube (CDN) para optimización y entrega rápida de imágenes de productos y comprobantes de pago.
- **Resend / Nodemailer:** Servicio transaccional para el envío automatizado de correos de confirmación de órdenes y respuestas a clientes.

---

## 📂 Estructura Arquitectónica del Software

```text
ecoomerce/
├── app/                              # Rutas principales (Next.js App Router)
│   ├── about/                        # Página institucional "Nosotros"
│   ├── admin/                        # Módulo del Panel Administrativo (Protegido)
│   │   ├── login/                    # Pantalla de acceso privado
│   │   ├── products/new/             # Formulario de alta de productos con subida CDN
│   │   ├── actions.ts                # Server Actions para pedidos y productos
│   │   ├── AdminDashboardClient.tsx  # Dashboard interactivo (Órdenes, Inventario, Mensajes)
│   │   └── page.tsx                  # Servidor de datos para el dashboard
│   ├── api/                          # Endpoints RESTful
│   │   ├── admin/login/ & logout/    # Endpoints de autenticación de sesión admin
│   │   ├── checkout/                 # Procesamiento de pedidos
│   │   ├── contact/                  # Recepción de mensajes de contacto
│   │   ├── orders/                   # Consulta y actualización de pedidos
│   │   ├── search/                   # Búsqueda dinámica de productos
│   │   └── upload/                   # Carga de archivos a Cloudinary
│   ├── checkout/                     # Pasarela de finalización de compra
│   │   ├── success/                  # Confirmación de compra generada
│   │   └── page.tsx                  # Formulario de datos de envío y pago
│   ├── contact/                      # Módulo de contacto y atención al cliente
│   ├── favorites/                    # Módulo de prendas favoritas (Wishlist)
│   ├── product/[id]/                 # Detalle dinámico del producto con selector de tallas
│   ├── globals.css                   # Tokens de diseño y estilos globales
│   ├── layout.tsx                    # Layout raíz con Header, Footer y Providers
│   └── page.tsx                      # Landing page con vitrina y categorías
├── components/                       # Componentes UI reutilizables y modulares
│   ├── CartDrawer.tsx                # Carrito deslizable lateral interactivo
│   ├── EditProductModal.tsx          # Modal de edición rápida de producto
│   ├── Header.tsx                    # Barra de navegación con buscador y badges
│   ├── OrderDetailsModal.tsx         # Modal detallado de orden para el administrador
│   ├── ProductCard.tsx               # Tarjeta interactiva de producto
│   └── ReceiptModal.tsx              # Visor de comprobante de pago
├── lib/                              # Configuraciones de clientes (Prisma, Cloudinary, Mail)
├── prisma/                           # Esquema de base de datos y scripts de población
│   ├── schema.prisma                 # Definición de modelos y tipos compuestos NoSQL
│   └── seed.ts                       # Semilla de datos iniciales
├── store/                            # Stores de Zustand (Carrito y Favoritos)
├── types/                            # Tipos e interfaces de TypeScript
├── middleware.ts                     # Protección perimetral de rutas
└── README.md                         # Documentación del proyecto y de la evidencia
```

---

## 🗄️ Modelo de Datos (Prisma & MongoDB)

El sistema aprovecha los **Composite Types** (tipos embebidos) de MongoDB para garantizar integridad histórica en las ventas:

1. **`Product`**:
   - `id`, `nombre`, `descripcion`, `precio`, `categoria` (`HOMBRE`, `MUJER`).
   - `stock` total calculado y `sizeStock` estructurado por talla (`S`, `M`, `L`, `XL`, etc.).
   - `imagenes` (URLs de Cloudinary), `tallas`, `colores`.

2. **`Order`**:
   - `id`, `total`, `tipoEntrega` (`PICKUP`, `DELIVERY`), `metodoPago` (`CASH`, `NEQUI`).
   - `comprobantePago` (imagen del soporte de transferencia).
   - `estado` (`PENDIENTE`, `CONFIRMADO`, `ENTREGADO`, `CANCELADO`).
   - `cliente` (*Composite Type* con nombre, email, celular y dirección).
   - `productos` (*Composite Type* con snapshot inmutable de producto, precio y talla al comprar).

3. **`Message`**:
   - `id`, `nombre`, `email`, `celular`, `mensaje`, `leido`, `createdAt`.

---

## ⚙️ Guía de Instalación y Ejecución Local

### 1. Clonar el Repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd ecoomerce
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto tomando como referencia las siguientes variables:

```env
# Conexión a MongoDB Atlas
DATABASE_URL="mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<database>?appName=..."

# Clave Maestra de Acceso Administrativo
ADMIN_PASSWORD="tu_clave_de_administrador"

# Cloudinary (Gestión de multimedia)
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"

# Servicio de Correo Electrónico (Resend / Mailer)
RESEND_TOKEN="tu_resend_token"
EMAIL_USER="tu_correo@gmail.com"
EMAIL_APP_PASS="tu_contraseña_de_aplicacion"
```

### 4. Generar Cliente de Base de Datos y Poblar
```bash
# Generar el cliente de Prisma
npx prisma generate

# Poblar la base de datos con catálogo de demostración
npm run seed
# o: npx ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts
```

### 5. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en: **`http://localhost:3000`**

---

## 🔐 Acceso al Módulo Administrativo

Para evaluar las funciones del panel administrativo del software:
- **Ruta de acceso:** `http://localhost:3000/admin/login`
- **Contraseña maestra de prueba:** Configurada en la variable `ADMIN_PASSWORD` del archivo `.env`.

**Funcionalidades del módulo administrativo:**
- ✅ **Gestión de Órdenes:** Visualización de pedidos, revisión de comprobantes de pago Nequi y actualización de estados (`Confirmado`, `Entregado`, `Cancelado`) con notificación automática por correo al cliente.
- ✅ **Gestión de Inventario:** Modificación en tiempo real de precios, stock total y disponibilidad por talla; creación de nuevos productos con subida de fotografías a CDN.
- ✅ **Gestión de Mensajes:** Bandeja de entrada de PQRS/contacto con enlace directo de respuesta a WhatsApp del remitente.

---

## 👨‍💻 Información del Aprendiz

- **Aprendiz:** Iván Andrés Méndez Ardila
- **Programa:** Análisis y Desarrollo de Software (ADSO)
- **Centro de Formación:** Servicio Nacional de Aprendizaje — SENA
- **Año:** 2026
