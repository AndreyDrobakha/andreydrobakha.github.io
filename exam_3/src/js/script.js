		'use strict';

		console.dir($('#welcome'));

		const requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame;
		window.requestAnimationFrame = requestAnimationFrame;

		$('.carousel').carousel({
			interval: 3000,

		})
		
		$('.team__row').slick({
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 3,
			// autoplay: true,
			speed: 2000,
			autoplaySpeed: 3000,

			responsive: [
			{
				breakpoint: 920,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					infinite: true,
				}
			},

			{
				breakpoint: 550,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: true,
				}
			}
			]

		});

		document.addEventListener('scroll', () => {
			setMenuFixed();
		});

		const setMenuFixed = () => {
			const navbar = document.getElementsByClassName('navigation')[0];
			if(window.pageYOffset >= 34){
				navbar.classList.add('fixed-top');
			} else {
				navbar.classList.remove('fixed-top');
			}
		};

		const mobileMenuButton = $('.navbar-toggler');
		const mobileMenu = $('#navbar');

		mobileMenuButton.on('click', function() {
			mobileMenu.toggleClass('open');
		});

		$('.navigation__link').on('click', function(e){
			e.preventDefault();
			const top = $($(this).attr('href'))[0].offsetTop;
			window.scrollTo({
				top: top,
				behavior: 'smooth'
			});
		});

		$('.arrow-up').on('click', () => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		});

		const keys = {37: 1, 38: 1, 39: 1, 40: 1};

		function preventDefault(e) {
			e = e || window.event;
			if (e.preventDefault)
				e.preventDefault();
			e.returnValue = false;
		}

		function preventDefaultForScrollKeys(e) {
			if (keys[e.keyCode]) {
				preventDefault(e);
				return false;
			}
		}

		function disableScroll() {
  if (window.addEventListener) // older FF
  	window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
	if (window.removeEventListener)
		window.removeEventListener('DOMMouseScroll', preventDefault, false);
	window.onmousewheel = document.onmousewheel = null;
	window.onwheel = null;
	window.ontouchmove = null;
	document.onkeydown = null;
}

;(function($) {
	'use strict';
	$(window).on('load', function() {
		var map;
		var mapContainer = $('#map')[0];
		var mapCenter = {lat: -7.9377956, lng: 112.6274228};
		var markerPosition = {lat: -7.9307459, lng: 112.6355576};

		map = new google.maps.Map(mapContainer, {
			center: mapCenter,
			zoom: 15,
			disableDefaultUI: true, 
		});

		var marker = new google.maps.Marker({
			position: markerPosition, 
			map: map,
			title: 'Hello',
			icon: 'img/pin.svg',
		});
	});
})(jQuery);
