# Boutique Moderna - E-commerce Premium

Una plataforma de comercio electrónico sofisticada y minimalista diseñada para una boutique de moda. El sistema incluye una experiencia de compra fluida para los clientes y un panel administrativo integral para la gestión del negocio.

## 🚀 Tecnologías Implementadas

### Core
- **Next.js 14+ (App Router):** Framework principal para React con Renderizado en el Servidor (SSR) y Generación de Sitios Estáticos (SSG).
- **TypeScript:** Tipado estático para un código más robusto y mantenible.
- **Tailwind CSS:** Diseño responsivo y estilizado con una estética de "lujo silencioso".

### Backend & Base de Datos
- **Prisma ORM:** Capa de abstracción para la base de datos con tipado automático.
- **MongoDB:** Base de datos NoSQL escalable para el almacenamiento de productos, órdenes y mensajes.
- **Server Actions:** Manejo de lógica de servidor directamente desde componentes de React.

### Servicios Externos
- **Resend:** Infraestructura de correo electrónico para notificaciones de órdenes y contacto.
- **Cloudinary:** Almacenamiento optimizado de imágenes de productos y comprobantes de pago.
- **Lucide React:** Set de iconos minimalistas de alta calidad.
- **Sonner:** Sistema de notificaciones (toasts) premium.

---

## 📂 Estructura del Proyecto

```text
├── app/                  # Rutas de la aplicación (App Router)
│   ├── admin/            # Panel administrativo (protegido)
│   ├── api/              # Endpoints de API (Contacto, Webhooks)
│   ├── cart/             # Flujo de carrito y checkout
│   ├── collection/       # Catálogo de productos y filtros
│   ├── product/          # Detalles de producto individual
│   └── contact/          # Formulario de contacto
├── components/           # Componentes UI reutilizables
├── lib/                  # Utilidades, configuración de Prisma y Cloudinary
├── prisma/               # Esquema de base de datos y migraciones
├── public/               # Activos estáticos (logos, fuentes)
└── types/                # Definiciones de interfaces globales
```

---

## 🗄️ Esquema de Base de Datos (MongoDB)

El sistema utiliza **Prisma** con tipos incrustados (Composite Types) optimizados para MongoDB.

### Modelos Principales

#### 1. `Product`
Almacena la información de las prendas, incluyendo stock detallado por talla.
- `id`, `nombre`, `descripcion`, `precio`.
- `categoria`: Enum (HOMBRE, MUJER).
- `sizeStock`: Array de objetos `{ talla, cantidad }`.
- `imagenes`, `tallas`, `colores`.

#### 2. `Order`
Gestiona las compras realizadas por los clientes.
- `cliente`: Tipo incrustado con `nombre`, `email`, `celular` y `direccion`.
- `productos`: Copia de seguridad de los items comprados (`nombre`, `precio`, `cantidad`, `talla`).
- `tipoEntrega`: PICKUP o DELIVERY.
- `metodoPago`: NEQUI o CASH.
- `estado`: PENDIENTE, CONFIRMADO, ENTREGADO, CANCELADO.
- `comprobantePago`: URL de la imagen en Cloudinary.

#### 3. `Message`
Registra el contacto de los clientes.
- `nombre`, `email`, `celular`, `mensaje`.
- `leido`: Boolean para gestión administrativa.

---

## 🛠️ Configuración de Desarrollo

### Requisitos Previos
- Node.js 18+
- Instancia de MongoDB (Local o Atlas)
- Cuenta de Cloudinary (para imágenes)
- Cuenta de Resend (para emails)

### Variables de Entorno (`.env`)
```env
DATABASE_URL="mongodb+srv://..."
RESEND_TOKEN="re_..."
CLOUDINARY_CLOUD_NAME="..."
ADMIN_PASSWORD="tu_password_seguro"
```

### Comandos Útiles
- `npm run dev`: Inicia el servidor de desarrollo.
- `npx prisma db push`: Sincroniza el esquema con la base de datos.
- `npx prisma generate`: Regenera el cliente de Prisma (tipado).
- `npm run build`: Prepara la aplicación para producción.

---

## 🎨 Características Destacadas

1. **Checkout Inteligente:** Validación de stock en tiempo real y carga de comprobantes de pago.
2. **Dashboard de Admin:** 
   - Gestión de inventario con actualización rápida de stock.
   - Control de estados de órdenes con envío automático de emails al cliente.
   - Centro de mensajes con integración directa a WhatsApp.
3. **Diseño Premium:** Uso de `backdrop-blur`, tipografías Serif elegantes y animaciones sutiles.
4. **Optimización SEO:** Implementación de metadatos dinámicos y estructura semántica.

---

Desarrollado con ❤️ para **Boutique Moderna**.
