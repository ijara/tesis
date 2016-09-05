$(document).ready(function(){

	// Define button rollover behaviors
	var image_path = '/wp-content/themes/opennms/images/';
	$('.home #download-now').hover(function(){ $(this).attr('src', image_path + 'download-now-rollover.png'); }, function(){ $(this).attr('src', image_path + 'download-now.png'); });
	$('.home #get-support').hover(function(){ $(this).attr('src', image_path + 'get-support-button-rollover.png'); }, function(){ $(this).attr('src', image_path + 'get-support-button.png'); });
	$('.home #get-involved').hover(function(){ $(this).attr('src', image_path + 'get-involved-button-rollover.png'); }, function(){ $(this).attr('src', image_path + 'get-involved-button.png'); });
	$('#get-opennms-button').hover(function(){ $(this).attr('src', image_path + 'get-opennms-engage-button-rollover.png'); }, function(){ $(this).attr('src', image_path + 'get-opennms-engage-button.png'); });
	$('#get-support-button').hover(function(){ $(this).attr('src', image_path + 'get-support-engage-button-rollover.png'); }, function(){ $(this).attr('src', image_path + 'get-support-engage-button.png'); });
	$('#get-involved-button').hover(function(){ $(this).attr('src', image_path + 'get-involved-engage-button-rollover.png'); }, function(){ $(this).attr('src', image_path + 'get-involved-engage-button.png'); });


	$('#take-the-tour').hover(function(){ $(this).attr('src', image_path + 'take-the-tour-rollover.png'); }, function(){ $(this).attr('src', image_path + 'take-the-tour.png'); });

	// Define About OpenNMS menu and subsection behavior for the home page
	$('.about-opennms-section').not('.current').css('display', 'none');
	$('#about-opennms-menu li a').click(function(){
		if (!$(this).hasClass('current')){
			$('#about-opennms-menu li a.current').removeClass('current');
			$(this).addClass('current');
			$('.current.about-opennms-section').removeClass('current').slideUp();
			$('#about-opennms-' + $(this).text()).addClass('current').slideDown();
		}
		return false;
	});
});