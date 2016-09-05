jQuery(document).ready(function($) {

	// $('#wpbody').prepend('<div id="modal_postulaciones" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">Modal title</h4></div><div class="modal-body"><p>One fine body&hellip;</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary">Save changes</button></div></div><!-- /.modal-content --></div><!-- /.modal-dialog --></div><!-- /.modal -->');

	alto = $(window).height() - 50;

	$("#modal_postulaciones .modal-content").css({
		'max-height': alto + 'px',
		'overflow': 'auto'
	});


	$(".ver_postulaciones").on('click', function(event) {
		event.preventDefault();
		post_id = $(this).attr('data-id');
		$.ajax({
			url: postulaciones_ajax.ajaxurl,
			type: 'POST',
			dataType: 'html',
			data: {
				'action'  : 'ver_postulaciones',
				'id_oferta' : post_id
			},
			beforeSend: function(){
				$("#modal-body").html("");
			}
		})
		.done(function(data) {
			$("#contiene-postulaciones").html(data);
			$("#contiene-postulaciones h1").remove();
			$("#modal_postulaciones")
				.modal('show')
				.on('shown.bs.modal', function(event) {
					$("#adminmenuwrap").css('z-index', '950');
					$("#wpadminbar").css('z-index', '950');
				})
				.on('hide.bs.modal', function(event) {
					$("#adminmenuwrap").css('z-index', '1050');
					$("#wpadminbar").css('z-index', '1050');
				})
			;

			console.log("success");
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
	});
});