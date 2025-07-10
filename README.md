# 🧩 Sistema de Gestión de Productos para Pequeñas Empresas

Un sistema web completo para gestionar productos, costos, ventas y ganancias de manera eficiente. Diseñado específicamente para pequeñas empresas y emprendedores.

## ✨ Características Principales

### 📦 Gestión de Productos
- **Registro de productos** con nombre, precio de venta y costos
- **Cálculo automático** del costo unitario basado en lotes
- **Edición y eliminación** de productos existentes
- **Interfaz intuitiva** con tarjetas visuales

### 💰 Control de Costos
- **Registro detallado** de insumos y cantidades
- **Cálculo de costos** por lote y por unidad
- **Mano de obra** incluida en los cálculos
- **Asociación directa** con productos específicos

### 🛒 Registro de Ventas
- **Ventas individuales** y agrupadas
- **Cálculo automático** de totales
- **Fechas personalizables** para cada venta
- **Historial completo** de transacciones

### 📊 Análisis de Ganancias
- **Cálculo automático** de ingresos, costos y ganancias
- **Rentabilidad por producto** en tiempo real
- **Métricas visuales** con tarjetas informativas
- **Análisis detallado** por producto

### 📈 Reportes Inteligentes
- **Reportes por período**: Hoy, semana, mes, todo
- **Ranking de productos** más rentables
- **Evolución de ventas** en el tiempo
- **Filtros dinámicos** para análisis específicos

## 🚀 Cómo Usar

### 1. Inicio Rápido
1. Abre el archivo `index.html` en tu navegador
2. El sistema se cargará automáticamente con datos de ejemplo
3. Explora las diferentes secciones usando la navegación superior

### 2. Registro de Productos
1. Ve a la sección **Productos**
2. Haz clic en **"Nuevo Producto"**
3. Completa la información:
   - **Nombre del producto** (ej. "Chocotejas")
   - **Precio de venta** por unidad (ej. 1.00 soles)
   - **Costo total del lote** (ej. 40.00 soles)
   - **Cantidad en el lote** (ej. 100 unidades)
4. El sistema calculará automáticamente el costo unitario

### 3. Registro de Costos
1. Ve a la sección **Costos**
2. Haz clic en **"Nuevo Costo"**
3. Selecciona el producto asociado
4. Registra los insumos:
   - **Nombre del insumo** (ej. "Chocolate")
   - **Cantidad utilizada**
   - **Costo del insumo**
   - **Mano de obra** (si aplica)

### 4. Registro de Ventas
1. Ve a la sección **Ventas**
2. Haz clic en **"Nueva Venta"**
3. Completa la información:
   - **Producto vendido**
   - **Cantidad vendida**
   - **Precio unitario** (se auto-completa)
   - **Fecha de venta**
4. El total se calcula automáticamente

### 5. Análisis de Ganancias
1. Ve a la sección **Ganancias**
2. Visualiza las métricas principales:
   - **Ingresos totales**
   - **Costos totales**
   - **Ganancia neta**
   - **Rentabilidad porcentual**
3. Revisa el análisis detallado por producto

### 6. Reportes
1. Ve a la sección **Reportes**
2. Selecciona el período de análisis
3. Revisa:
   - **Productos más rentables**
   - **Evolución de ventas**

## 📱 Ejemplo Práctico: Chocotejas

### Configuración del Producto
- **Nombre**: Chocotejas
- **Precio de venta**: S/ 1.00 por unidad
- **Costo del lote**: S/ 40.00 (para 100 unidades)
- **Costo unitario calculado**: S/ 0.40 por unidad

### Registro de Costos
- **Chocolate**: 2kg - S/ 20.00
- **Manjar**: 1kg - S/ 8.00
- **Moldes y empaques**: S/ 2.00
- **Mano de obra**: S/ 10.00
- **Total costos**: S/ 40.00

### Venta de Ejemplo
- **Cantidad vendida**: 30 chocotejas
- **Ingreso**: S/ 30.00
- **Costo de producción**: S/ 12.00 (30 × S/ 0.40)
- **Ganancia neta**: S/ 18.00
- **Rentabilidad**: 60%

## 💾 Almacenamiento de Datos

El sistema utiliza **localStorage** del navegador para guardar todos los datos:
- **Productos**: Información completa de cada producto
- **Costos**: Detalles de insumos y costos de producción
- **Ventas**: Historial completo de transacciones

### Ventajas del localStorage:
- ✅ **Sin conexión a internet** requerida
- ✅ **Datos persistentes** entre sesiones
- ✅ **Acceso inmediato** sin configuración
- ✅ **Privacidad total** - datos solo en tu navegador

### Consideraciones:
- ⚠️ Los datos se almacenan solo en tu navegador
- ⚠️ Limpiar el caché del navegador eliminará los datos
- ⚠️ Recomendamos hacer respaldos regulares

## 🎨 Características de la Interfaz

### Diseño Responsive
- **Adaptable** a dispositivos móviles y tablets
- **Navegación intuitiva** con pestañas
- **Modales elegantes** para formularios
- **Animaciones suaves** para mejor UX

### Colores y Estilo
- **Gradiente moderno** en el header
- **Tarjetas informativas** para datos importantes
- **Iconos FontAwesome** para mejor visualización
- **Estados vacíos** con mensajes útiles

## 🔧 Personalización

### Adaptable a Cualquier Producto
El sistema funciona con cualquier tipo de producto:
- 🍪 **Alimentos**: Galletas, empanadas, dulces
- 🧵 **Artesanías**: Bisutería, tejidos, manualidades
- 🥤 **Bebidas**: Jugos, smoothies, café
- 🎨 **Servicios**: Diseño, fotografía, consultoría

### Solo Cambia:
1. **Nombre del producto**
2. **Insumos específicos**
3. **Costos de producción**
4. **Precios de venta**

El sistema calcula automáticamente todo lo demás.

## 📋 Requisitos Técnicos

- **Navegador moderno** (Chrome, Firefox, Safari, Edge)
- **JavaScript habilitado**
- **Sin instalación** requerida
- **Sin servidor** necesario

## 🚀 Instalación

1. **Descarga** todos los archivos en una carpeta
2. **Abre** `index.html` en tu navegador
3. **¡Listo!** El sistema está funcionando

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:
- Revisa los datos de ejemplo incluidos
- Explora todas las secciones del sistema
- Los mensajes de confirmación te guiarán

## 🎯 Beneficios del Sistema

### Para Emprendedores:
- 📊 **Control total** de costos y ganancias
- 💡 **Toma de decisiones** basada en datos reales
- ⚡ **Ahorro de tiempo** en cálculos manuales
- 📈 **Optimización** de precios y rentabilidad

### Para Pequeñas Empresas:
- 🎯 **Enfoque** en productos más rentables
- 💰 **Maximización** de ganancias
- 📋 **Organización** de inventario y costos
- 🚀 **Escalabilidad** del negocio

---

**¡Comienza a gestionar tu negocio de manera profesional y eficiente!** 🚀 # web-negocios
