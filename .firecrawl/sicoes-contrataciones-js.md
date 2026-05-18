function getRutaColumnasContrataciones(operacion, tipo) {
 var columnas, aut, ruta = "/portal/contrataciones/operacion.php";
 var rpto = botcolobt(operacion, tipo, new Date().getTime());
 var columnastmp = jsontovec(rpto.sectorsec);
 columnas = proord(columnastmp, rpto.a, rpto.b, rpto.fx, rpto.fy);
 return \[ruta, columnas, aut\];
}

function getRutaColumnasADJ(operacion, tipo) {
 var columnas, aut, ruta = "/portal/contrataciones/operacion.php";
 var rpto = botcolobt(operacion, tipo, new Date().getTime());
 var columnastmp = jsontovec(rpto.sectorsec);
 columnas = proord(columnastmp, rpto.a, rpto.b, rpto.fx, rpto.fy);

 return \[ruta, columnas, aut\];
}

function jsontovec(jObject)
{
 var arr = \[\];
 for (var prop in jObject) {
 arr.push(jObject\[prop\]);
 }
 return arr;
}
;
function botcolobt(operacion, tipo, timehour)
{
 var res;
 $.ajax({
 type: 'POST',
 url: '/portal/contrataciones/operacion2.php',
 data: {opetpo: operacion, tpoope: tipo, time: timehour},
 dataType: "json",
 async: false,
 success: function (data) {
 res = data;
 }
 });
 return res;
}
;
function colAdicionalesAvanzada(idForm, idTablaPaginacion) {
 $("#" \+ idForm).find('input:checkbox').each(function (index, value) {
 var res;
 //pamm160819-COMENTAR-SUBASTA-COLOCAR-NRO-13-REEMPLAZANDO 12
 var numeroAdicionalSubasta = 1;
 var posicion = 12 + numeroAdicionalSubasta + parseFloat(index);

 var columnaHeader = $("#" + idTablaPaginacion + " td:nth-child(" + posicion + "), #" + idTablaPaginacion + " th:nth-child(" + posicion + ")");
 if ($(value).prop("checked")) {
 res = true;
 columnaHeader.show();
 } else {
 res = false;
 columnaHeader.hide();
 }
 });
}
;

function validarCamposContrataciones(operacion, tipo, $form) {
 if (operacion == "convNacional" \|\| operacion == "convInternacional") {
 if (tipo == "Simple") {
 return validaConvocatoriaSimple($form);
 } else {
 return validaConvocatoriaAvanzada($form);
 }
 } else if (operacion == "contResueltos") {
 if (tipo == "Simple") {
 return validaContResueltosSimple($form);
 }
 if (tipo == "Avanzada") {
 return validaContResueltosAvanzada($form);
 }
 } else if (operacion == "desistimientoCont") {
 return validaDesistimientoCont($form);
 } else if (operacion == "pacEntidad" \|\| operacion == "pacProceso") {
 return true;
 } else if (operacion == "requerimientoPersonal" \|\| operacion == "convDisposicionBienes") {
 if (tipo == "Simple") {
 return true;
 }
 if (tipo == "Avanzada") {
 return validaConvocatoriaSimple($form);
 }
 }
 if(operacion == "convAdjudicados"){
 return validaConvocatoriaAvanzada($form);
 }
}
;

function validaConvocatoriaSimple($form) {
 var publicacionDesde = $form.find("input\[name='publicacionDesde'\]").val();
 var publicacionHasta = $form.find("input\[name='publicacionHasta'\]").val();
 var propuestaDesde = $form.find("input\[name='presentacionPropuestasDesde'\]").val();
 var propuestaHasta = $form.find("input\[name='presentacionPropuestasHasta'\]").val();
 var publicacion = validarFechas(publicacionDesde, publicacionHasta, "Fecha de publicación");
 var presentacion = validarFechas(propuestaDesde, propuestaHasta, "Fecha de presentación de propuestas");
 return publicacion && presentacion;
}
;

function validaConvocatoriaAvanzada($form) {
 var desiertaDesde = $form.find("input\[name='desiertaDesde'\]").val();
 var desiertaHasta = $form.find("input\[name='desiertaHasta'\]").val();
 var montoDesde = $form.find("input\[name='montoDesde'\]").val();
 var montoHasta = $form.find("input\[name='montoHasta'\]").val();
 var desierta = validarFechas(desiertaDesde, desiertaHasta, "Fecha Desierta/Adjudicación");
 var monto = validarMontos(montoDesde, montoHasta, "Monto en Bs.");
 return validaConvocatoriaSimple($form) && desierta && monto;
}
;

function validaContResueltosSimple($form) {
 var resolucionDesde = $form.find("input\[name='resolucionDesde'\]").val();
 var resolucionHasta = $form.find("input\[name='resolucionHasta'\]").val();
 return validarFechas(resolucionDesde, resolucionHasta, "Fecha de resolución del contrato");
}
;

function validaContResueltosAvanzada($form) {
 var suscripcionDesde = $form.find("input\[name='suscripcionDesde'\]").val();
 var suscripcionHasta = $form.find("input\[name='suscripcionHasta'\]").val();
 var suscripcion = validarFechas(suscripcionDesde, suscripcionHasta, "Fecha de suscripción del contrato");
 return validaContResueltosSimple($form) && suscripcion;
}
;

function validaDesistimientoCont($form) {
 var desistimientoDesde = $form.find("input\[name='desistimientoDesde'\]").val();
 var desistimientoHasta = $form.find("input\[name='desistimientoHasta'\]").val();
 return validarFechas(desistimientoDesde, desistimientoHasta, "Fecha de desistimiento");
}
;

function esContOtrosPaises() {
 if (window.location.pathname.indexOf("contOtrosPaises") > 0) {
 $(".banner-bottom-grids").attr('class', '');
 }
}
;

function mostrarContOtrosPaises() {
 $("#contOtrosPaises").on('click', 'img', function () {
 var pdf = $(this).data('pdf').toString();
 if (pdf.indexOf("http") != 0) {
 pdf = "/portal/contrataciones/otrasPublicaciones/contOtrosPaises/docs/" + pdf + ".pdf";
 }
 $("#modalDecreto .modal-title").html($(this).parents('tr').find('td:nth-child(2)').text());
 $('#modalDecreto iframe').attr('src', pdf);
 $('#modalDecreto').modal('show');
 });
}
;

esContOtrosPaises();
mostrarContOtrosPaises();