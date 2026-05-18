function busquedadraw(str) {
 if ($('#f-simple').is(':visible')) {
 $this = $('#f-simple').find('.busquedaForm');
 }
 else if ($('#f-avanzada').is(':visible')) {
 $this = $('#f-avanzada').find('.busquedaForm');

 } else {
 $this = $('.busquedaForm');
 }
 var vl\_catpcha = "";
 busquedaPagina($this, str);
}

function getBusqueda($this) {
 busquedaPagina($this, 1);
}

/\\*\\*
 \\* Funcion para búsqueda de páginas del portal
 \\*
 \\* @param $this
 \\* @param nroPagina
 \*/
function busquedaPagina($this, nroPagina){
 errores = "";
 var vl\_catpcha = "";
 var menu\_active = "Contrataciones";
 var operacion = $this.data('operacion');
 var tipo = $this.data('tipo');
 var idForm = $this.parents('form').attr('id');
 var idTabla = "tabla" + tipo;
 $("#" \+ idForm + " .alert").remove();
 if ($(".menu-cabecera").length) {
 menu\_active = $.trim($(".menu-cabecera li.active .nombreMenu").text());
 }
 if(menu\_active=="Contrataciones" && (operacion=="convNacional" \|\| operacion=="convInternacional")) {
 buscarConvocatorias(tipo, idTabla, idForm, nroPagina,operacion);
 } else if (menu\_active == "Compro Hecho en Bolivia") {
 buscarNoFichas(tipo, idTabla, idForm, nroPagina);
 } else if (menu\_active == "institucional") {
 buscarInstitucional(tipo, idTabla, idForm, nroPagina);
 } else if(menu\_active=="ADJ") {
 buscarAdjudicados(idTabla, idForm, nroPagina);
 }
}

function validarFechas(fecha1, fecha2, tipo) {
 if (fecha1 != 0 && fecha2 != 0) {
 fecha1 = fecha1.split("/");
 var fecha1 = new Date(fecha1\[2\], fecha1\[1\], fecha1\[0\]);
 fecha2 = fecha2.split("/");
 var fecha2 = new Date(fecha2\[2\], fecha2\[1\], fecha2\[0\]);
 if (fecha1 > fecha2) {
 var msj = "

La primera fecha especificada para **" \+ tipo + "** no puede ser mayor a la segunda fecha

";
 enviarErrores(msj);
 } else {
 return true;
 }
 } else {
 return true;
 }
}

function validarMontos(valor1, valor2, tipo) {
 if (valor1 != 0 && valor2 != 0) {
 if ($.isNumeric(valor1) && $.isNumeric(valor2)) {
 if (valor1 > valor2) {
 var msj = "

El primer valor especificado para **" \+ tipo + "** no puede ser mayor al segundo valor

";
 enviarErrores(msj);
 } else {
 return true;
 }
 } else {
 var msj = "

El valor ingresado para **" \+ tipo + "** es erróneo";
enviarErrores(msj);
}
} else {
return true;
}
}

function validarDatos(valor, tipo) {
if (valor == "") {
var msj = "

**" \+ tipo + "** no puede estar vac\\u00EDo

";
enviarErrores(msj);
} else {
return true;
}
}

function enviarErrores(msj) {
errores = errores + msj;
}

function deshabilitarEnterBusqueda() {
$("form").keypress(function (e) {
if (e.which == 13) {
return false;
}
});
}

function listarBusqueda() {
var menu\_active = $.trim($(".menu-cabecera li.active .nombreMenu").text());
if (menu\_active != "RUPE" && menu\_active != "ADJ") {
if ($('.busquedaForm').length) {
var $busquedaForm = $('.tab-pane.active .busquedaForm');
if (!$busquedaForm.length) {
$busquedaForm = $('.busquedaForm');
}
getBusqueda($busquedaForm);
$('a\[data-toggle="tab"\]').on('shown.bs.tab', function () {
if (!$("#f-simple table tbody").length) {
getBusqueda($('.busquedaForm:first'));
}
if (!$("#f-avanzada table tbody").length) {
getBusqueda($('.busquedaForm:last'));
}
});
}
}
}
function captcha()
{
captcha\_src = "/lib/download/captchasearch.php";
$("#captchase span").click();
$("#captchase img").attr('src', captcha\_src + "?" + Math.random());
$("#captchase ").on('click', 'span', function () {
$captcha = $(this).parent();
$captcha.find('img').attr('src', captcha\_src + "?" + Math.random());
$captcha.find('input').val('');
});
}
$(document).ready(function () {
//Formularios busquedas
listarBusqueda();
//limpia el formulario
$('.limpiarForm').click(function () {
$(this).parents('form')\[0\].reset();
});
//busquedas
$('.busquedaForm').click(function () {
if($(this).data('form')!="btnConvNacionalInter" && $(this).data('form')!="btnBusqAdjudicados"){
getBusqueda($(this));
}

});
});