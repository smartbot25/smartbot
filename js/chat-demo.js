/* ============================================================
   chat-demo.js — Simulación animada del chat en la sección
   de beneficios. Muestra una conversación real en loop.
   ============================================================ */

'use strict';

/* ── Datos de la conversación demo ── */
const CHAT_MESSAGES = [
  { type: 'user', text: 'Hola, ¿cuánto cuesta el servicio de catering?', time: '2:14 PM' },
  { type: 'bot',  text: '¡Hola! 👋 Tenemos paquetes desde S/25 por persona. ¿Para cuántas personas y qué fecha?', time: '2:14 PM ✓✓' },
  { type: 'user', text: 'Para 80 personas, el sábado 22', time: '2:15 PM' },
  { type: 'bot',  text: 'Perfecto 🎉 ¡Te agendo una cotización personalizada! ¿Me das tu nombre?', time: '2:15 PM ✓✓' },
  { type: 'user', text: 'Soy Carlos Vargas', time: '2:16 PM' },
  { type: 'bot',  text: 'Listo Carlos ✅ Te contactamos en menos de 1 hora para confirmar disponibilidad.', time: '2:16 PM ✓✓' },
];

/* ── HTML del header del chat ── */
const CHAT_HEADER_HTML = `
  <div class="chat-header">
    <div class="chat-avatar">🤖</div>
    <div>
      <div class="chat-name">SmartBot Asistente</div>
      <div class="chat-status">En línea ahora</div>
    </div>
  </div>
`;

/* ── Crear elemento mensaje ── */
function createMessage(msg) {
  const div = document.createElement('div');
  div.className = `msg msg-${msg.type}`;
  div.innerHTML = `
    ${msg.text}
    <div class="msg-time">${msg.time}</div>
  `;
  return div;
}

/* ── Crear indicador de escritura ── */
function createTyping() {
  const div = document.createElement('div');
  div.className = 'typing';
  div.innerHTML = '<span></span><span></span><span></span>';
  return div;
}

/* ── Limpiar y reiniciar chat ── */
function resetChat(container) {
  container.innerHTML = CHAT_HEADER_HTML;
}

/* ── Renderizar mensajes uno a uno con delays ── */
async function renderMessages(container) {
  resetChat(container);

  for (let i = 0; i < CHAT_MESSAGES.length; i++) {
    const msg = CHAT_MESSAGES[i];

    // Si es bot, mostrar typing primero
    if (msg.type === 'bot') {
      await delay(600);
      const typing = createTyping();
      container.appendChild(typing);
      scrollToBottom(container);

      await delay(1200);
      container.removeChild(typing);
    } else {
      await delay(800);
    }

    const el = createMessage(msg);
    container.appendChild(el);
    scrollToBottom(container);

    // Pausa antes del siguiente mensaje
    await delay(i === CHAT_MESSAGES.length - 1 ? 3000 : 500);
  }

  // Loop: reiniciar después de 2 segundos
  await delay(2000);
  renderMessages(container);
}

/* ── Helpers ── */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function scrollToBottom(container) {
  container.scrollTop = container.scrollHeight;
}

/* ══════════════════════════════════════
   INIT — Arrancar cuando el elemento esté visible
══════════════════════════════════════ */
function initChatDemo() {
  const container = document.getElementById('chatDemo');
  if (!container) return;

  // Solo arrancar cuando la sección entre en pantalla
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          renderMessages(container);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(container);
}

document.addEventListener('DOMContentLoaded', initChatDemo);
