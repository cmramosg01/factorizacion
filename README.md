# 🔧 Factoriza con el Aspa | PWA Interactiva

Aplicación web progresiva diseñada para **alumnos de 2º ESO** que practica la factorización de trinomios cuadráticos mediante el **método del aspa simple**. Sin descargas, sin registro, funciona 100% offline una vez cargada.

## 🎯 Objetivo pedagógico
Transformar la abstracción algebraica en una experiencia visual e interactiva. Los alumnos:
- Identifican patrones de suma y producto sin memorizar fórmulas.
- Manipulan coeficientes con *drag & drop* (táctil y ratón).
- Reciben feedback inmediato y pistas progresivas.
- Construyen confianza antes de enfrentar la fórmula general o el discriminante.

## 📱 Cómo acceder y usarla
1. Abre este enlace en cualquier navegador:  
   🔗 `https://cmramosg01.github.io/factorizacion-aspa/`
2. En móvil: toca `⋮` (Chrome) o `📤 Compartir` (Safari) → **Añadir a pantalla de inicio**.
3. ¡Listo! Funciona como una app nativa, incluso sin conexión a internet.

## 🎮 Instrucciones para el alumno
1. Lee la ecuación y fíjate en el valor `b` (suma) y `a×c` (producto).
2. Arrastra dos números que cumplan **ambas condiciones** a los huecos `(x + __)(x + __)`.
3. Pulsa ✅ Verificar. Si falla, revisa o usa 💡 Pista.
4. Reinicia 🔄 para practicar o avanza a la siguiente ecuación.

## ⚙️ Notas técnicas (para el profesor)
- **Stack:** HTML5, CSS3, JavaScript vanilla. Sin frameworks ni dependencias externas.
- **Offline:** Service Worker cachea los archivos tras la primera visita.
- **Responsive:** Optimizada para móvil/tablet (touch events + mouse fallback).
- **Actualización:** Sube los archivos modificados a GitHub → la web se actualiza en ~30s.
- **Extensible:** Preparada para añadir niveles (`a ≠ 1`), guardado en `localStorage` y generador aleatorio de ejercicios.

## 📜 Licencia
Código abierto bajo licencia MIT. Uso educativo libre. Si la adaptas o mejoras, ¡comparte tus cambios!

---
👨‍🏫 Desarrollada por [@cmramosg01](https://github.com/cmramosg01) para el aula de Matemáticas 2º ESO.  
🐛 ¿Errores, ideas o nuevas ecuaciones? Abre un *Issue* en este repositorio.
