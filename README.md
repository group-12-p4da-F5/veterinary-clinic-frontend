# 🐾 Clínica Veterinaria Margarita - Frontend

Este es el **panel de administración** de la **Clínica Veterinaria Margarita**, desarrollado con **React + Vite**.  
Está pensado para que la propia Margarita pueda **gestionar sus pacientes, citas, horarios y el estado de las mismas** de manera sencilla e intuitiva.

Este repositorio corresponde al **frontend** del proyecto.  
👉 El backend se encuentra en este repositorio: [veterinary-clinic-backend](https://github.com/group-12-p4da-F5/veterinary-clinic-backend)

---

## 🚀 Funcionalidades principales

- 📅 Gestión de **citas** (creación, edición, actualización de estado).  
- 🐶 Gestión de **pacientes** (datos, historial).  
- ⏰ Control de **horarios y disponibilidad**.  
- 👩‍⚕️ Interfaz pensada para la veterinaria y su equipo.  
- ⚡ Aplicación **rápida y ligera** gracias a **Vite**.

---

## ⚙️ Requisitos previos

Antes de comenzar asegúrate de tener instalado en tu máquina:

- [Node.js](https://nodejs.org/) (versión recomendada: 18 o superior)  
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)  

---

## 📥 Instalación y despliegue local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/group-12-p4da-F5/veterinary-clinic-frontend.git
    ```
 2. **Ir al directorio**
 ```bash
  cd veterinary-clinic-frontend
 ```
3. **Instalar dependencias**
```bash
  npm install
 ```
4. **Ejecutar en modo desarrollo**
```bash
  npm run dev
 ```
El proyecto se abrirá en:
👉 http://localhost:5173

---
Este frontend se conecta con la API del backend desarrollada en Spring Boot.
📌 Repositorio: [veterinary-clinic-backend](https://github.com/group-12-p4da-F5/veterinary-clinic-backend)

El backend se encarga de:

Persistencia de datos (pacientes, citas, usuarios).

Lógica de negocio.

Endpoints REST para el panel de administración.
