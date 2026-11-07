[README.md](https://github.com/user-attachments/files/34520560/README.md)
# Inventario Pro

Sistema web de control de inventario desarrollado como proyecto final del curso de Desarrollo Web. Permite gestionar productos, registrar entradas y salidas de stock, recibir alertas de reabastecimiento y generar reportes, con acceso diferenciado según el rol del usuario.

## Funcionalidades

- **Autenticación y seguridad:** registro e inicio de sesión con JWT, contraseñas cifradas con BCrypt y rutas protegidas en el frontend y en la API.
- **Roles de usuario:** Administrador, Encargado de almacén y Vendedor, cada uno con permisos distintos.
  - Administrador y Encargado de almacén: crean y editan productos.
  - Solo el Administrador: elimina productos.
  - Vendedor: solo puede registrar salidas de stock.
- **Gestión de productos:** CRUD con nombre, categoría, marca, stock y stock mínimo.
- **Movimientos de inventario:** registro de entradas y salidas, con validación para no dejar el stock en negativo.
- **Alertas:** aviso de productos agotados o por debajo del stock mínimo.
- **Dashboard:** resumen del inventario con gráficos de línea (Chart.js).
- **Reportes:** generación del reporte de stock en CSV y envío al correo del usuario.
- **Perfil:** edición de datos personales y cambio de contraseña.

## Tecnologías

**Frontend** (`inventario-pro-app`)
- React 19, React Router
- Bootstrap 5
- Chart.js y react-chartjs-2

**Backend** (`springboot-backend`)
- Java 21 y Spring Boot
- Spring Data JPA / Hibernate
- SQLite
- JWT (jjwt) y BCrypt (Spring Security Crypto)
- Spring Mail
- Maven

## Estructura del repositorio

```
├── inventario-pro-app/     # Frontend en React
│   └── src/
│       ├── api/            # Cliente HTTP
│       ├── context/        # Contexto de autenticación
│       ├── routes/         # Rutas protegidas y por rol
│       ├── layout/         # Layout del dashboard
│       └── pages/          # Login, Registro, Dashboard, Productos,
│                           # Movimientos, Stock, Alertas, Perfil
└── springboot-backend/     # API REST en Spring Boot
    └── src/main/java/com/inventariopro/backend/
        ├── controller/     # Auth, Productos, Movimientos, Alertas,
        │                   # Dashboard, Reportes
        ├── model/          # Usuario, Producto, Movimiento
        ├── repository/     # Acceso a datos (JPA)
        ├── security/       # Filtro y servicio JWT
        ├── service/        # Envío de reportes por correo
        └── dto/ exception/ config/
```

## API principal

| Recurso | Endpoints |
| --- | --- |
| Autenticación | `POST /api/auth/register`, `POST /api/auth/login`, `GET/PUT /api/auth/me`, `PUT /api/auth/password` |
| Productos | `GET/POST /api/productos`, `PUT/DELETE /api/productos/{id}` |
| Movimientos | `GET/POST /api/movimientos` |
| Alertas | `GET /api/alertas` |
| Dashboard | `GET /api/dashboard/summary` |
| Reportes | `POST /api/reportes/stock` |

## Cómo ejecutarlo

Requisitos: Java 21, Node.js y npm.

### 1. Backend (puerto 4000)

```bash
cd springboot-backend
./mvnw spring-boot:run
```

Configura las variables de entorno, o crea un archivo `secrets.properties` dentro de `springboot-backend` (ya está ignorado por Git):

```properties
JWT_SECRET=una_clave_larga_y_segura
MAIL_USERNAME=tu_correo@gmail.com
MAIL_PASSWORD=tu_contraseña_de_aplicación
```

El correo es opcional: solo se necesita para enviar reportes de stock. La base de datos SQLite se crea automáticamente en la carpeta `data/`.

### 2. Frontend (puerto 3000)

```bash
cd inventario-pro-app
npm install
npm start
```

Abre [http://localhost:3000](http://localhost:3000). El frontend se conecta a la API en `http://localhost:4000`.

## Autor

**Jean Piero Mera Alvarado**
Estudiante de Ingeniería de Sistemas e Informática, UTP
[LinkedIn](https://linkedin.com/in/jean-piero-mera-alvarado-77b621420) · [GitHub](https://github.com/PieroMera)
