function ingresar($this,tipo){

 var url;
 if($("#modalLogin").attr('data-tipo') == "entidad"){
 url = "/formularios/nuevosform/ingresa.php";
 }else{
 url = "/portal/rupe/ingresaProv.php";
 }
 if(url){
 $.ajax({
 type:"POST",
 url:url,
 async:false,
 data:$this.serialize() + "&tipo=" + tipo + "&token=" + $("#token").val(),
 dataType:"json",
 success:function(data){
 if(data.ESTADO==0){
 if(url=="/portal/rupe/ingresaProv.php"){
 var resultado=data.RUTA.split("?");
 if(resultado.length > 1){
 var resultado2=resultado\[1\].split('=');
 resultado2\[1\]=encodeURIComponent(resultado2\[1\]);
 data.RUTA=resultado\[0\]+"?"+resultado2\[0\]+"="+resultado2\[1\];
 }
 }
 window.location.href = data.RUTA;
 }else{

 $div = '

'+data.ERROR+'

';
 $($div).insertBefore("form");
 resetCaptcha($("#captcha span"));
 //tiempo duracion alert
 window.setTimeout(function() {
 $(".alert").fadeTo(500, 0).slideUp(500, function(){
 $(this).remove();
 });
 }, 5000);
 }
 }
 });
 }
};

function textoAjustarServicios(){
 var valor;
 var div = ".servicioSICOES";
 var width = $(div).width();
 if(width){
 if(width <= 351){ valor = 65; }
 else{ valor = 999999; }
 reducirTexto(div,valor);
 }
};

/\\*\\*
 \\* funcion para el reset del captcha
 \\* @param $this
 \*/
function resetCaptcha($this){
 $captcha = $this.parent();
 $captcha.find('img').attr('src', '/lib/php/captcha/captcha8.php' + "?" + Math.random());
 $captcha.find('input').val('');
};

var $modalGuia = $("#modalGuia");
function getModalGuia(){
 $modalGuia.find('.modal-dialog').removeClass('modal-lg');
 $modalGuia.find('.atras').removeClass('visible').addClass('hidden');
 $modalGuia.find(".modal-title").html('Tutoriales');
 $modalGuia.find('.modal-body').show();
 $modalGuia.find('.modal-footer').hide();
 $modalGuia.find('iframe').attr('src','');
};

function getModalGuiaPDF($this){
 $modalGuia.find('.modal-dialog').addClass('modal-lg');
 $modalGuia.find('.atras').removeClass('hidden').addClass('visible');
 $modalGuia.find(".modal-title").html($this.find('h4').text());
 $modalGuia.find('.modal-body').hide();
 $modalGuia.find('.modal-footer').show();
 $modalGuia.find('iframe').attr('src','docs/' + $this.data('pdf') + '.pdf');
};

function verificarVersionNavegador(){
 if(navigator.appName == "Microsoft Internet Explorer"){
 var ie = navigator.userAgent.toLowerCase();
 var version = parseInt(ie.split('msie')\[1\]);
 if(version <= 9){
 alert("Se recomienda utilizar una versi\\u00F3n mayor a 9 para Microsoft Internet Explorer");
 }
 }
};

function irLink(link){
 if(link.endsWith(".php")){
 location.replace(link + "?token=" + $("#token").val())
 }else{
 location.replace(link + "&token=" + $("#token").val())
 }

}

$(document).ready(function() {
 //Verifica version IE
 verificarVersionNavegador();

 //Top pagina
 $().UItoTop({ easingType: 'easeOutQuart' });

 //Tooltip
 $('\[data-toggle="tooltip"\]').tooltip();

 //Popover
 $('\[data-toggle="popover"\]').popover();

 //Datepicker
 $('.datePicker').datepicker({
 language: 'es',
 format: 'dd/mm/yyyy'
 });

 //Menu
 $('body').click(function(e){
 if(!$(e.target).is('span.dropdown')){
 $('ul.menu').hide();
 $('.menu-cabecera span.dropdown').removeClass('active');
 }
 });
 $("ul.menu-cabecera span.dropdown").click(function() {
 if($(this).hasClass('active')){
 $(this).removeClass('active');
 $(this).next().hide();
 }else{
 $menu = $(this).parent().parent();
 $menu.find('.dropdown').removeClass('active');
 $menu.find('ul.menu').hide();
 $(this).addClass('active');
 $(this).next().show();
 }
 });

 //Texto servicios
 textoAjustarResolucion(textoAjustarServicios);

 //Login
 $(".modal-login").click(function() {
 $('form .form-group input').val("");
 var titulo;
 var tipo = $(this).data('tipo');
 var $login = $("#modalLogin");
 var $opcionModal = $("#opcionesLogin");
 var panelCiudadania = $("#panelCiudadania");
 panelCiudadania.hide();
 if (tipo == 'rupe') {
 $login.find('.soloEntidad').hide();
 } else {
 $login.find('.soloEntidad').show();
 }
 if($("#nuevoLoginEntidades").val() != "S"){
 if(tipo == 'entidad'){
 titulo = "Entidades";
 $login.find('.checkbox').hide();
 $login.find('.page-header').hide();
 $opcionModal.hide();
 $login.find('.form-login').show();
 $login.find('.modal-dialog').addClass('modal-sm');
 } else {
 titulo = "Proveedores";
 panelCiudadania.show();
 $login.find('.checkbox').show();
 $login.find('.page-header').hide();
 $opcionModal.hide();
 $login.find('.form-login').show();
 $("#modalLogin").find('.modal-dialog').removeClass('modal-sm');
 $("#modalLogin").find('.modal-dialog').addClass('modal-md');
 }
 }else{
 $login.find('.page-header').hide();
 if(tipo == 'entidad'){
 titulo = "Entidades";
 $login.find('.checkbox').hide();
 $opcionModal.find('.opcion-uno').find('.servc-grid-right h4').text("Formularios de Registro");
 $opcionModal.find('.opcion-uno').find('.servc-grid-right p').text("Acceso para el registro de Formularios SICOES");
 $opcionModal.find('.opcion-dos').find('.servc-grid-right h4').text("Actividades Electrónicas");
 $opcionModal.find('.opcion-dos').find('.servc-grid-right p').text("Acceso para registrar los documentos para la Compra por Catálogo Electrónico Compro Hecho en Bolivia y Destino de Bienes Dados de Baja");
 $opcionModal.find('.opcion-uno').find('.servc-grid-left span').removeClass("glyphicon glyphicon-user");
 $opcionModal.find('.opcion-uno').find('.servc-grid-left span').removeClass("glyphicon glyphicon-briefcase");
 $opcionModal.find('.opcion-uno').find('.servc-grid-left span').addClass("glyphicon glyphicon-user");
 $("#modalLogin").find('.modal-dialog').removeClass('modal-sm');
 $login.find('.form-login').hide();
 $('#opcionesLogin').show();
 }else{
 titulo = "Proveedores";
 panelCiudadania.show();
 $("#opcionesLogin").hide();
 $("#modalLogin").find('.modal-dialog').removeClass('modal-sm');
 $("#modalLogin").find('.modal-dialog').addClass('modal-md');
 $login.find('.form-login').show();
 $login.find('.checkbox').show();
 }
 }

 $('#modalLogin .modal-title').text(titulo);
 $("#modalLogin").attr('data-tipo',tipo);
 $("#modalLogin").modal('show');
 });

 $('.login form').submit(function() {
 ingresar($(this),"login");
 return false;
 });
 $('.login-rupe').click(function() {
 ingresar($('.login form'),$(this).data("tipo"));
 return false;
 });
 $('.opcion-uno').click(function() {
 var $login = $("#modalLogin");
 $('#opcionesLogin').hide();
 $login.find('.form-login').show();
 if ($login.find('.soloEntidad').css('display') == 'none') {
 $("#modalLogin").find('.modal-dialog').addClass('modal-md');
 } else {
 $("#modalLogin").find('.modal-dialog').addClass('modal-sm');
 }
 return false;
 });
 $('.opcion-dos').click(function() {
 $("#modalLogin").modal('toggle');
 $('form .form-group input').val("");
 var $login = $("#modalLogin");
 var tipo = $login.data('tipo');
 var a = document.createElement('a');
 a.href=$("#rutaSigep").val() +"/rsseguridad/#/login";
 a.target = '\_blank';
 document.body.appendChild(a);
 a.click();
 $("#modalLogin").find('.modal-dialog').addClass('modal-sm');
 return false;
 });

 //Captcha
 $("#captcha").on('click', 'span', function() {
 resetCaptcha($(this));
 });

 //modal pdf guia
 $modalGuia.on('show.bs.modal', function(){
 getModalGuia();
 });
 $modalGuia.find(".servicioSICOES").click(function(){
 getModalGuiaPDF($(this));
 });
 $modalGuia.find(".atras").click(function(){
 getModalGuia();
 });

 var menu\_active = $.trim($(".menu-cabecera li.active").text());
 if(menu\_active == "Inicio"){
 comunicadosInicio(); //modal comunicados corregido
 }
});