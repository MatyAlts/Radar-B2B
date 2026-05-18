function createElement(tag, name) {
 if (document.all) {
 return document.createElement('<' + tag + ' name=' + name + '>');
 } else {
 var e = document.createElement(tag);
 e.name = name;
 return e;
 }
}
function fireOnChangeEvent(ele) {
 if (document.all) {
 ele.fireEvent('onchange');
 }
 if (document.createEvent) {
 var evt = document.createEvent('HTMLEvents');
 evt.initEvent('change', true, true);
 ele.dispatchEvent(evt);
 }
}

function addListener(sEvento, elemento, fListener) {
 if (elemento.addEventListener)
 elemento.addEventListener(sEvento, fListener, false);
 else if (elemento.attachEvent)
 elemento.attachEvent('on' + sEvento, fListener);
}

function removeListener(sEvento, elemento, fListener) {
 if (elemento.removeEventListener)
 elemento.removeEventListener(sEvent, fListener, false);
 else if (elemento.detachEvent)
 elemento.detachEvent('on' + sEvent, fListener);
}

function mixin(receivingClass, givingClass) {
 if (arguments\[2\]) { // Copia los metodos nombrados a partir del tercer argumento.
 for (var i = 2, len = arguments.length; i < len; i++) {
 receivingClass.prototype\[arguments\[i\]\] = givingClass.prototype\[arguments\[i\]\];
 }
 } else { // Copia todo los metodos.
 for (methodName in givingClass.prototype) {
 if (!receivingClass.prototype\[methodName\]) {
 receivingClass.prototype\[methodName\] = givingClass.prototype\[methodName\];
 }
 }
 }
}
function removeChildNodes(element) {
 while (element.childNodes\[0\]) {
 element.removeChild(element.childNodes\[0\]);
 }
}

var BrowserDetect = {
 init: function () {
 this.browser = this.searchString(this.dataBrowser) \|\| "An unknown browser";
 this.version = this.searchVersion(navigator.userAgent)
 \|\| this.searchVersion(navigator.appVersion)
 \|\| "an unknown version";
 this.OS = this.searchString(this.dataOS) \|\| "an unknown OS";
 },
 searchString: function (data) {
 for (var i = 0; i < data.length; i++) {
 var dataString = data\[i\].string;
 var dataProp = data\[i\].prop;
 this.versionSearchString = data\[i\].versionSearch \|\| data\[i\].identity;
 if (dataString) {
 if (dataString.indexOf(data\[i\].subString) != -1)
 return data\[i\].identity;
 } else if (dataProp)
 return data\[i\].identity;
 }
 },
 searchVersion: function (dataString) {
 var index = dataString.indexOf(this.versionSearchString);
 if (index == -1)
 return;
 return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
 },
 dataBrowser: \[\
 {\
 string: navigator.userAgent,\
 subString: "Chrome",\
 identity: "Chrome"\
 },\
 {\
 string: navigator.vendor,\
 subString: "KDE",\
 identity: "Konqueror"\
 },\
 {\
 string: navigator.userAgent,\
 subString: "Firefox",\
 identity: "Firefox"\
 },\
 {\
 string: navigator.vendor,\
 subString: "Camino",\
 identity: "Firefox"\
 },\
 {// for newer Netscapes (6+)\
 string: navigator.userAgent,\
 subString: "Netscape",\
 identity: "Netscape"\
 },\
 {\
 string: navigator.userAgent,\
 subString: "MSIE",\
 identity: "Explorer",\
 versionSearch: "MSIE"\
 },\
 {\
 string: navigator.userAgent,\
 subString: "Gecko",\
 identity: "Mozilla",\
 versionSearch: "rv"\
 },\
 {// for older Netscapes (4-)\
 string: navigator.userAgent,\
 subString: "Mozilla",\
 identity: "Netscape",\
 versionSearch: "Mozilla"\
 }\
 \],
 dataOS: \[\
 {\
 string: navigator.platform,\
 subString: "Win",\
 identity: "Windows"\
 },\
 {\
 string: navigator.platform,\
 subString: "Mac",\
 identity: "Mac"\
 },\
 {\
 string: navigator.userAgent,\
 subString: "iPhone",\
 identity: "iPhone/iPod"\
 },\
 {\
 string: navigator.platform,\
 subString: "Linux",\
 identity: "Linux"\
 }\
 \]

};
BrowserDetect.init();

function getViewportSize() {
 var x, y;
 if (self.innerHeight) { // MOS
 y = self.innerHeight;
 x = self.innerWidth;
 } else if (document.documentElement && document.documentElement.clientWidth) { // IE6 Strict
 x = document.documentElement.clientWidth;
 y = document.documentElement.clientHeight;
 } else if (document.body.clientHeight) { // IE quirks
 y = document.body.clientHeight;
 x = document.body.clientWidth;
 }
 return {x: x, y: y};
}

function getFormData($form) {
 var unindexed\_array = $form.serializeArray();
 var indexed\_array = {};

 $.map(unindexed\_array, function (n, i) {
 indexed\_array\[n\['name'\]\] = n\['value'\];
 });

 return indexed\_array;
}
function JSONNULL(obj) {
 for (var i in obj) {
 return false;
 }
 return true;
}

function getOpcionesPaginacionnuevo(idForm, idTablaPaginacion, archivoDestino, operacion, arrayColumnas,
 nroRegistros, autocorector, draw, start, lenght, catpcha, metodoPaginacion) {
 var datos = $("#" + idForm).serialize();
 var $form = $("#form\_data");
 var data = getFormData($("#" + idForm));
 data.operacion = operacion;
 data.autocorrector = autocorector;
 data.nroRegistros = nroRegistros;
 data.draw = draw;
 data.start = start;
 data.length = lenght;
 data.captcha = catpcha;
 $.ajax({
 type: 'POST',
 url: archivoDestino,
 data: data,
 dataType: "json",
 async: false,
 success: function (data) {
 $('#' \+ idTablaPaginacion).find('tbody').remove();
 $('#' \+ idTablaPaginacion + '\_paginate').empty();
 var nreg = numreg(data);
 if (JSONNULL(data.data)) {
 diseniotablavacio(data, arrayColumnas, nroRegistros, idTablaPaginacion, operacion);
 } else {
 diseniotabla(data, arrayColumnas, nroRegistros, idTablaPaginacion, operacion);
 }
 generatePagination(idTablaPaginacion, draw, nroRegistros, data.recordsTotal, nreg, metodoPaginacion);
 tablaData = data.data;
 },
 error: function () {
 location.replace("/portal/index.php");
 }
 });
}
function numreg(datajson) {
 var nroreg = 0;
 for (var i in datajson.data) {
 nroreg = nroreg + 1;

 }
 return nroreg;
}
function diseniotablavacio(datajson, arrayColumnas, nroreg, idTablaPaginacion, operacion)
{
 var tbody = document.createElement("tbody");
 var tabla = document.getElementById(idTablaPaginacion);
 tabla.appendChild(tbody);
 var tabla = document.getElementById(idTablaPaginacion).getElementsByTagName('tbody')\[0\];
 var fila = tabla.insertRow(tabla.rows.length);

 var celda =fila.insertCell(0);
 celda.colSpan = 8;
 celda.innerHTML = "No hay datos registrados";
}

function diseniotabla(datajson, arrayColumnas, nroreg, idTablaPaginacion, operacion)
{
 var tbody = document.createElement("tbody");
 var tabla = document.getElementById(idTablaPaginacion);
 tabla.appendChild(tbody);
 var tabla = document.getElementById(idTablaPaginacion).getElementsByTagName('tbody')\[0\];
 var nroreg = 0;
 for (var i in datajson.data) {
 nroreg = nroreg + 1;
 }
 for (var i = 0; i < nroreg; i++) {
 var fila = tabla.insertRow(tabla.rows.length);
 var j = 0;
 jQuery.each(arrayColumnas, function (index, item) {
 var celda = fila.insertCell(j);
 j++;
 text = datajson\["data"\]\[i\]\[item\];
 if (text === "null" \|\| text === null) {
 celda.innerHTML = unescape('');
 } else
 {
 celda.innerHTML = unescape(text);
 }
 });
 }
}

function getOpcionesPaginacion(idForm, idTablaPaginacion, archivoDestino, operacion, arrayColumnas, nroRegistros, autocorector) {
 var columns = \[\];
 jQuery.each(arrayColumnas, function (index, item) {
 columns.push({data: item});
 });
 var datos = $("#" + idForm).serialize();
 var $form = $("#form\_data");
 var data = getFormData($("#" + idForm));
 data.operacion = operacion;
 data.autocorrector = $("#valsiteips").val(); /\*
 \\* l:select
 \\* p: pagination
 \\* \*/
 var table = $('#' + idTablaPaginacion).DataTable({
 bDestroy: true,
 "bSort": false,
 "iDisplayLength": nroRegistros,
 //<"H"l>
 //"dom": '<"text-center"p>rt<"bottom"i>',
 "dom": '<"top">rt<"bottom"ip>',
 //"processing": true,
 "serverSide": true,
 "ajax": {
 "url": archivoDestino,
 "type": "POST",
 data: data
 },
 columns: columns,
 "language": {
 "lengthMenu": "Mostrando \_MENU\_ registros por p\\xe1gina",
 "zeroRecords": "No hay datos registrados",
 "info": "Se han encontrado \_TOTAL\_ registros",
 "infoEmpty": "",
 "infoFiltered": "(filtered from \_MAX\_ total records)",
 "oPaginate": {
 "sNext": "Siguiente",
 "sPrevious": "Anterior"
 },
 //"sProcessing": "Procesando"
 }
 });
 $('#' \+ idTablaPaginacion + ' tr:odd').addClass('tabla-busqueda-color-plomo');
 $('#' \+ idTablaPaginacion + ' tr:even').addClass('tabla-busqueda-color-blanco');
 return table;
}

function openWindow(strURL) {

 dwsopenwindow0(strURL, 'B');

}
function openWindow1(strURL) {

 dwsopenwindow0(strURL, 'A');
}
function openWindownx0(strURL) {

 dwsopenwindow0(strURL, 'B');

}
function openWindownx1(strURL) {

 dwsopenwindow0(strURL, 'A');
}
function generatePagination(idTablaPaginacion, draw, nroRegistros, recordsTotal, nReg, metodoPaginacion) {
 if(!metodoPaginacion){
 metodoPaginacion = "busquedadraw";
 }
 draw = parseInt(draw);
 var nroPaginas = Math.ceil(recordsTotal / nroRegistros);
 var nroPagsPrevNextMostrar = 2;
 var forBegin = draw - nroPagsPrevNextMostrar;
 var forEnd = draw + nroPagsPrevNextMostrar;
 var clase = "";
 var idDivPagination = idTablaPaginacion + "\_paginate";
 var divPagination = "

";
divPagination += "

Se han encontrado " + recordsTotal + " registros

";
divPagination += "

";
divPagination += "

";
divPagination += "

";
if (draw > 1) {
divPagination += "- [Anterior](javascript:void(0);)
";
}

if (draw > 1 && draw > 1 + nroPagsPrevNextMostrar) {
divPagination += "- [1](javascript:void(0);)
- [...](https://sicoes.gob.bo/lib/js/app/comun.js#)
";
}

for (var i = forBegin; i <= forEnd; i++) {
clase = "";
if (i == draw) {
clase = "active";
}
if (i > 0 && i <= nroPaginas) {
divPagination += "- [" \+ i + "](javascript:void(0);)
";
}
}
if (draw < nroPaginas - nroPagsPrevNextMostrar) {
divPagination += "- [...](https://sicoes.gob.bo/lib/js/app/comun.js#)
- [" \+ nroPaginas + "](javascript:void(0);)
";
}
if (draw < nroPaginas) {
divPagination += "- [Siguiente](javascript:void(0);)
";
}
divPagination += "

";
divPagination += "";
divPagination += "

";
divPagination += "

";

$(divPagination).insertAfter("#" + idTablaPaginacion);
}

$(document).ready(function () {
//Nprogress
$(document).on('ajaxStart', function (e, xhr, settings, exception) {
return NProgress.start();
});
$(document).on('ajaxComplete', function (e, xhr, settings, exception) {
return NProgress.done();
});

})