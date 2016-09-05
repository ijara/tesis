var trackURL = document.URL;
if (trackURL.indexOf("?") != -1) {
	trackURL += "&async=true";
}
else {
	trackURL += "?async=true";
}

var _elqQ = _elqQ || [];

_elqQ.push(['elqSetSiteId', '1795']);

_elqQ.push(['elqTrackPageView', trackURL]);



(function () {

	function async_load() {

		var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true;

		s.src = '//img.en25.com/i/elqCfg.min.js';

		var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);

	}

	if (typeof define !== "undefined" && define.amd) {
		async_load();
	} else if (window.addEventListener) {
		window.addEventListener('DOMContentLoaded', async_load, false);
	} else if (window.attachEvent) {
		window.attachEvent('onload', async_load); 
	}

})();
