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
			autoplay: true,
			speed: 2000,
			autoplaySpeed: 3000,
		});

	

		const getUserData = () => {
			const userData = {};
			Array.prototype.forEach.call(form[0].elements, (el) => {
				if(!el.value) return;
				userData[el.name] = el.value;
				el.value = '';
			})
			console.log(userData);
			return userData;
		};

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
