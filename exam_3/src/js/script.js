		'use strict';

		console.dir($('#welcome'));

		const requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame;
		window.requestAnimationFrame = requestAnimationFrame;

		// $('.carousel').carousel({
		// 	interval: 3000,
		// 	autoplay: false,
		// })
		
		$('.team__row').slick({
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 3,
			autoplay: true,
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

		// $(function () { 
		// 	$('.navigation__link').each(function () {
		// 		var location = window.location.href;
		// 		var link = this.href; 
		// 		if(location == link) {
		// 			$(this).addClass('active');
		// 		}
		// 	});
		// });

		// $(function () {
		// 	var location = window.location.href;
		// 	var cur_url = '/' + location.split('/').pop();

		// 	$('.navigation__item').each(function () {
		// 		var link = $(this).find('a').attr('href');

		// 		if (cur_url == link)
		// 		{
		// 			$(this).addClass('active');
		// 		}
		// 	});
		// });

		// Cache selectors
		var lastId,
		topMenu = $("#menu"),
		topMenuHeight = topMenu.outerHeight() + 15,
  // All list items
  menuItems = topMenu.find("a"),
  // Anchors corresponding to menu items
  scrollItems = menuItems.map(function() {
  	var item = $($(this).attr("href"));
  	if (item.length) {
  		return item;
  	}
  });
  
// // Bind click handler to menu items
// // so we can get a fancy scroll animation
// menuItems.click(function(e) {
//   var href = $(this).attr("href"),
//     offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight + 1;
//   $('html, body').stop().animate({
//     scrollTop: offsetTop
//   }, 300);
//   e.preventDefault();
// });

// Bind to scroll
$(window).scroll(function() {
  // Get container scroll position
  var fromTop = $(this).scrollTop() + topMenuHeight;
  
  // Get id of current scroll item
  var cur = scrollItems.map(function() {
  	if ($(this).offset().top < fromTop)
  		return this;
  });
  // Get the id of the current element
  cur = cur[cur.length - 1];
  var id = cur && cur.length ? cur[0].id : "";
  if (lastId !== id) {
  	lastId = id;
    // Set/remove active class
    menuItems
    .parent().removeClass("active")
    .end().filter("[href='#" + id + "']").parent().addClass("active");
}
});


const mobileMenuButton = $('.navbar-toggler');
const mobileMenu = $('#navbar');

mobileMenuButton.on('click', function() {
			// this.style.display='none' 
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
};

(function($) {
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
