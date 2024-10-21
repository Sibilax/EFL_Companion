# Cambios Propuestos  17/10

## Modificación inicial

- Cambio de imagen y texto de pestaña del navegador [x]

De este modo estará presente siempre aunque haya que volver una o varias versiones atrás.

## Estilos y apariencia

- Aumentar el contraste de colores para mejorar la accesibilidad []

- Eliminar el fondo del logo con paint.net []

- Justificar el texto y aumentar los márgenes para mejorar la lectura, similar a la apariencia de un periódico (verificar si es similar a los estilos ya aplicados a los resultados de la barra de búsqueda) []

- Renderizar resultados con flexbox en crud panel a modo de columna []

- Dar márgenes a los resultados del panel cuando esté mobile responsive []

## Cambios al código

- Ordenar las rutas por orden de prioridad []

- Utilizar flexbox dentro de los resultados obtenidos en el admin dashboard para que se rendericen en una columna []

- Guardias de seguridad. Comprobar y mejorar []

- Modificar el home para que lleve a la sección incial de cursos y de ahí de acceso a cada uno en específico []

## Nuevas Features

- Agregarles botón de eliminar y editar a los resultados de users en el crud panel []

- Agregar un user status al modelo y schema user para que puedan ser activo e incativo []

- Planificar los modelos gregar los modelos que haga falta para manjear los pagos []

- Relacionar cursos con alumnos para poder manejarlos por grupos []

- Agregar stripe []

- Posibilidad de mostrar u ocultar el carrito de compra según el rol del usuario []

- Gestionar la subida masiva de preguntas []

- Gestionar la subida masiva de alumnos []

- Bloquear la posibilidad de descarga de los recursos []

- Integrar diferentes cursos []

- Que los links se puedan refrescar []

- Crear un arbol con la nueva estructura dentro de los cursos: Curso, lección, subcategoría del contenido, videos (una  vez dentro poder seleccionar el video correspondiente), pdfs, abrir pdfs, ejercicios (evaluación final) []

- Llevar un registro del progreso []

- Agregar un botón de visto []

- Agregar el manejo de preguntas y respuestas al panel de administración []

## Mejoras al quiz

- Mejorar apariencia (evitar que mvaríe el tamaño de la barra de bsúsqueda. Verificación entre sticky y absolute []

- Agregar customización del cuestionario []

- Selección del número de preguntas []

- Deplegable con la selección de temas psobibles para que se rendericen las preguntas en función de sus tags (en función del curso y del tag) []

- Valores de las preguntas, por defecto 1, si quiere que reste que sea 0,33 []

- Tiempo en minutos (que se pueda ingresar de manera manual []

## Pantalla de incio una vez configurado el quiz con las intrucciones

- Formatted string que indique que va a comenzar el quiz []

- Tiempo del que dispone para contestar []

- Número de preguntas []

- Valor de las preguntas []

- Botón para volver al menú anterior []

- Botón para comenzar el test[]

## Mejoras iniciales que quedaron pendientes

- Desactivar click derecho []

- Evitar que más de un alumno comparta cuenta (huella digital navegador) []

- Detectar otra pantalla conectada []

- Desactivar click derecho apra que no se pueda copiar el contenido []

## Investigar

- Strapi
- Paint.net
- dayjs
- luxor
- reactjs.wiki
- csv carga masiva de contenido a la bd
