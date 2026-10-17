#Recetas - App de Cocina

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

**Recetas** es una aplicación móvil integral para los amantes de la cocina. Permite a los usuarios crear, organizar y compartir sus recetas favoritas, gestionando ingredientes, pasos a seguir y agrupándolas por categorías, todo desde una interfaz moderna y fluida.

##  Características Principales

###  Gestión de Usuarios
- **Registro e Inicio de Sesión** seguro con autenticación JWT.
- **Perfil editable:** Cambia tu nombre, correo y contraseña.
- **Borrado lógico (Soft Delete):** Si eliminas tu cuenta, tus datos se conservan por si decides volver. Al iniciar sesión de nuevo, tu cuenta se reactiva automáticamente.
- Persistencia de sesión: Si cierras la app desde multitarea, pide login por seguridad.

###  Gestión de Recetas
- **CRUD completo** de recetas (Crear, Leer, Actualizar, Eliminar).
- **Fotos personalizadas:** Sube imágenes de tus platillos directamente desde la cámara o galería (integrado con Cloudinary).
- **Detalles exhaustivos:** Título, descripción, tiempo de preparación, tiempo de cocción, porciones, calorías, dificultad y categoría.
- **Ingredientes dinámicos:** Añade nombre, cantidad y selecciona la unidad de medida.
- **Paso a paso:** Lista ordenada de instrucciones.
- **Privacidad:** Decide si tu receta es privada o pública para que otros usuarios la vean en la sección general.
- **Buscador:** Encuentra recetas generales rápidamente por título, categoría o etiquetas.

###  Organización por Grupos
- **CRUD completo** de grupos.
- **Relación Muchos a Muchos:** Una receta puede estar en múltiples grupos y un grupo puede tener múltiples recetas.
- **Borrado inteligente:** Al borrar un grupo, te avisa cuántas recetas se eliminarán (si solo pertenecen a ese grupo) y cuántas se conservarán (si están en otros grupos).

##  Tecnologías Utilizadas

### **Frontend (Móvil)**
- **React Native + Expo** (SDK 54)
- **React Navigation** (Stack y Bottom Tabs)
- **Axios** (Cliente HTTP)
- **AsyncStorage** (Persistencia local de sesión)
- **Expo Image Picker** (Cámara y galería)
- **Cloudinary API** (Almacenamiento de imágenes en la nube)

### **Backend (API REST)**
- **Node.js + Express** (Servidor)
- **MongoDB + Mongoose** (Base de datos NoSQL)
- **JSON Web Tokens (JWT)** (Autenticación)
- **Bcrypt** (Encriptación de contraseñas)
- **CORS + Dotenv** (Seguridad y variables de entorno)

### **Infraestructura**
- **Backend Deployment:** [Render](https://moviles-ez30.onrender.com/)
- **Base de Datos:** [MongoDB Atlas](https://www.mongodb.com/atlas)

---

##  Instalación y Ejecución en Local

Sigue estos pasos para correr el proyecto en tu computadora.

### Requisitos previos
- Node.js (v18 o superior)
- Git
- App **Expo Go** instalada en tu celular (Android/iOS)
- 
### Backend Comandos
cd backend
npm run dev

### Frontend Comandos
cd frontend
npx expo start -c

## Elaborado por: Diego Rojas y Samer Ghattas.


