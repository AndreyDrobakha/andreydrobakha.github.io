'use strict';

console.dir($('#welcome'));
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame; // $('.works__img-list').slick({
// 	autoplay: true,
// 	slidesToShow: 6,
// 	arrows: false
// });
// 	$(function(){
// 	$('.works__img-list').slick();
// 	})
// (jQuery);

var form = $('#contactForm');
form.on('submit', function (e) {
  e.preventDefault();
  getUserData();
  showModal();
});
$('.modal__close').on('click', function () {
  closeModal();
});

var showModal = function showModal() {
  $('.modal')[0].classList.add('open');
  disableScroll();
};

var closeModal = function closeModal() {
  $('.modal')[0].classList.remove('open');
  enableScroll();
};

var getUserData = function getUserData() {
  var userData = {};
  Array.prototype.forEach.call(form[0].elements, function (el) {
    if (!el.value) return;
    userData[el.name] = el.value;
    el.value = '';
  });
  console.log(userData);
  return userData;
};

var servicesTexts = $('.grid-item__text');
var arr = Array.prototype.map.call(servicesTexts, function (el) {
  var a = el.innerText.split('');
  if (a.length < 85) return el.innerText;
  var newA = a.slice(0, 85);
  var index = newA.lastIndexOf(' ');
  return newA.slice(0, index).join('') + '...';
});
Array.prototype.forEach.call(servicesTexts, function (el, idx) {
  el.innerText = arr[idx];
});
document.addEventListener('scroll', function () {
  setMenuFixed();
});

var setMenuFixed = function setMenuFixed() {
  var navbar = document.getElementsByClassName('navigation')[0];

  if (window.pageYOffset >= 34) {
    navbar.classList.add('fixed-top');
  } else {
    navbar.classList.remove('fixed-top');
  }
};

var progress = 0;

function step() {
  var progressbar = $('#progressbar')[0];
  var progress = Math.floor(window.scrollY * 100 / (document.body.scrollHeight - window.innerHeight));

  if (progress <= 100) {
    progressbar.style.transform = "translateX(-".concat(100 - progress, "%)");
  }
}

;

document.onscroll = function () {
  requestAnimationFrame(step);
};

var mobileMenuButton = $('.navbar-toggler');
var mobileMenu = $('#navbar');
mobileMenuButton.on('click', function () {
  mobileMenu.toggleClass('open');
});
$('.navigation__link').on('click', function (e) {
  e.preventDefault();
  var top = $($(this).attr('href'))[0].offsetTop;
  window.scrollTo({
    top: top,
    behavior: 'smooth'
  });
});
$('.arrow-up').on('click', function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}); // left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36

var keys = {
  37: 1,
  38: 1,
  39: 1,
  40: 1
};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault) e.preventDefault();
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

  window.ontouchmove = preventDefault; // mobile

  document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
  if (window.removeEventListener) window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.onmousewheel = document.onmousewheel = null;
  window.onwheel = null;
  window.ontouchmove = null;
  document.onkeydown = null;
} //старый код!!!!!!!!
// 'use strict';
// const form = $('#contactForm');
// form.on('submit', (e) => {
// 	e.preventDefault();	
// });
// const servicesTexts = $('.grid-item__text');
// servicesTexts.map = [].map;
// servicesTexts.forEach = [].forEach;
// const arr = servicesTexts.map(el => {
// 	let a = el.innerText.split('');
// 	if(a.length < 85) return el.innerText;
// 	let newA = a.slice(0, 85);
// 	let index = newA.lastIndexOf(' ');
// 	return newA.slice(0, index).join('') + '...';
// });
// servicesTexts.forEach((el, idx) => {
// 	el.innerText = arr[idx];
// });
// document.addEventListener('scroll', () => {
// 	setMenuFixed();
// });
// const setMenuFixed = () => {
// 	const navbar = document.getElementsByClassName('navigation')[0];	
// 	if(window.pageYOffset >= 34){
// 		navbar.classList.add('fixed-top');
// 	} else {
// 		navbar.classList.remove('fixed-top');
// 	}
// };
// $(document).ready(function(){
//   $('.partners__list').slick({
//   	autoplay: true,
//   	slidesToShow: 6,
//   	arrows: false
//   });
// });
// 		'use strict';
// 		const requestAnimationFrame = window.requestAnimationFrame ||
// 		window.mozRequestAnimationFrame ||
// 		window.webkitRequestAnimationFrame ||
// 		window.msRequestAnimationFrame;
// 		window.requestAnimationFrame = requestAnimationFrame;
// 		$('.partners__list').slick({
// 			autoplay: true,
// 			slidesToShow: 6,
// 			arrows: false
// 		});
// 		const form = $('#contactForm');
// 		form.on('submit', (e) => {
// 			e.preventDefault();
// 			getUserData();
// 			showModal();
// 		});
// $('.modal__close').on('click', () => {
// 			closeModal();
// 		});
// 		const showModal = () => {
// 			$('.modal')[0].classList.add('open');
// 			disableScroll();
// 		}
// 		const closeModal = () => {
// 			$('.modal')[0].classList.remove('open');
// 			enableScroll();
// 		}
// 		const getUserData = () => {
// 			const userData = {};
// 			Array.prototype.forEach.call(form[0].elements, (el) => {
// 				if(!el.value) return;
// 				userData[el.name] = el.value;
// 				el.value = '';
// 			})
// 			return userData;
// 		};
// 		const servicesTexts = $('.grid-item__text');
// 		const arr = Array.prototype.map.call(servicesTexts ,el => {
// 			let a = el.innerText.split('');
// 			if(a.length < 85) return el.innerText;
// 			let newA = a.slice(0, 85);
// 			let index = newA.lastIndexOf(' ');
// 			return newA.slice(0, index).join('') + '...';
// 		});
// 		Array.prototype.forEach.call(servicesTexts, (el, idx) => {
// 			el.innerText = arr[idx];
// 		});
// 		document.addEventListener('scroll', () => {
// 			setMenuFixed();
// 		});
// 		const setMenuFixed = () => {
// 			const navbar = document.getElementsByClassName('navigation')[0];
// 			if(window.pageYOffset >= 34){
// 				navbar.classList.add('fixed-top');
// 			} else {
// 				navbar.classList.remove('fixed-top');
// 			}
// 		};
// 		let progress = 0;
// 		function step() {
// 			const progressbar = $('#progressbar')[0];
// 			let progress = Math.floor(window.scrollY * 100 / (document.body.scrollHeight - window.innerHeight));
// 			if(progress <= 100) {
// 				progressbar.style.transform = `translateX(-${100 - progress}%)`;
// 			}
// 		};
// 		document.onscroll = () => {
// 			requestAnimationFrame(step);
// 		};
// 		const mobileMenuButton = $('.navbar-toggler');
// 		const mobileMenu = $('#navbar');
// 		mobileMenuButton.on('click', function() {
// 			mobileMenu.toggleClass('open');
// 		});
// 		$('.navigation__link').on('click', function(e){
// 			e.preventDefault();
// 			const top = $($(this).attr('href'))[0].offsetTop;
// 			window.scrollTo({
// 				top: top,
// 				behavior: 'smooth'
// 			});
// 		});
// 		$('.up').on('click', () => {
// 			window.scrollTo({
// 				top: 0,
// 				behavior: 'smooth'
// 			});
// 		});
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
// var keys = {37: 1, 38: 1, 39: 1, 40: 1};
// function preventDefault(e) {
// 	e = e || window.event;
// 	if (e.preventDefault)
// 		e.preventDefault();
// 	e.returnValue = false;
// }
// function preventDefaultForScrollKeys(e) {
// 	if (keys[e.keyCode]) {
// 		preventDefault(e);
// 		return false;
// 	}
// }
// function disableScroll() {
//   if (window.addEventListener) // older FF
//   	window.addEventListener('DOMMouseScroll', preventDefault, false);
//   window.onwheel = preventDefault; // modern standard
//   window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
//   window.ontouchmove  = preventDefault; // mobile
//   document.onkeydown  = preventDefaultForScrollKeys;
// }
// function enableScroll() {
// 	if (window.removeEventListener)
// 		window.removeEventListener('DOMMouseScroll', preventDefault, false);
// 	window.onmousewheel = document.onmousewheel = null;
// 	window.onwheel = null;
// 	window.ontouchmove = null;
// 	document.onkeydown = null;
// };
// ;(function($) {
// 	'use strict';
// 	$(function(){
// 		$('.img__div').slick();
// 	})
// })(jQuery);
// $(document).ready(function(){
//   $('.img__div').slick();
// });
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjcmlwdC5qcyJdLCJuYW1lcyI6WyJjb25zb2xlIiwiZGlyIiwiJCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIndpbmRvdyIsIm1velJlcXVlc3RBbmltYXRpb25GcmFtZSIsIndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiZm9ybSIsIm9uIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZ2V0VXNlckRhdGEiLCJzaG93TW9kYWwiLCJjbG9zZU1vZGFsIiwiY2xhc3NMaXN0IiwiYWRkIiwiZGlzYWJsZVNjcm9sbCIsInJlbW92ZSIsImVuYWJsZVNjcm9sbCIsInVzZXJEYXRhIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJmb3JFYWNoIiwiY2FsbCIsImVsZW1lbnRzIiwiZWwiLCJ2YWx1ZSIsIm5hbWUiLCJsb2ciLCJzZXJ2aWNlc1RleHRzIiwiYXJyIiwibWFwIiwiYSIsImlubmVyVGV4dCIsInNwbGl0IiwibGVuZ3RoIiwibmV3QSIsInNsaWNlIiwiaW5kZXgiLCJsYXN0SW5kZXhPZiIsImpvaW4iLCJpZHgiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZXRNZW51Rml4ZWQiLCJuYXZiYXIiLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwicGFnZVlPZmZzZXQiLCJwcm9ncmVzcyIsInN0ZXAiLCJwcm9ncmVzc2JhciIsIk1hdGgiLCJmbG9vciIsInNjcm9sbFkiLCJib2R5Iiwic2Nyb2xsSGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJzdHlsZSIsInRyYW5zZm9ybSIsIm9uc2Nyb2xsIiwibW9iaWxlTWVudUJ1dHRvbiIsIm1vYmlsZU1lbnUiLCJ0b2dnbGVDbGFzcyIsInRvcCIsImF0dHIiLCJvZmZzZXRUb3AiLCJzY3JvbGxUbyIsImJlaGF2aW9yIiwia2V5cyIsImV2ZW50IiwicmV0dXJuVmFsdWUiLCJwcmV2ZW50RGVmYXVsdEZvclNjcm9sbEtleXMiLCJrZXlDb2RlIiwib253aGVlbCIsIm9u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Q0FBQ3dFLFdBQVAsR0FBcUIsSUFBckI7QUFDQWpDLEVBQUFBLFFBQVEsQ0FBQ2tDLFNBQVQsR0FBcUIsSUFBckI7QUFDQSxDLENBS0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJcdFx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRcdGNvbnNvbGUuZGlyKCQoJyN3ZWxjb21lJykpO1xyXG5cclxuXHRcdGNvbnN0IHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHRcdHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHRcdHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHRcdHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZTtcclxuXHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XHJcblxyXG5cdFx0Ly8gJCgnLndvcmtzX19pbWctbGlzdCcpLnNsaWNrKHtcclxuXHRcdC8vIFx0YXV0b3BsYXk6IHRydWUsXHJcblx0XHQvLyBcdHNsaWRlc1RvU2hvdzogNixcclxuXHRcdC8vIFx0YXJyb3dzOiBmYWxzZVxyXG5cdFx0Ly8gfSk7XHJcblxyXG5cdFx0Ly8gXHQkKGZ1bmN0aW9uKCl7XHJcblx0XHQvLyBcdCQoJy53b3Jrc19faW1nLWxpc3QnKS5zbGljaygpO1xyXG5cdFx0Ly8gXHR9KVxyXG5cdFx0Ly8gKGpRdWVyeSk7XHJcblxyXG5cdFx0Y29uc3QgZm9ybSA9ICQoJyNjb250YWN0Rm9ybScpO1xyXG5cclxuXHRcdGZvcm0ub24oJ3N1Ym1pdCcsIChlKSA9PiB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0Z2V0VXNlckRhdGEoKTtcclxuXHRcdFx0c2hvd01vZGFsKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKCcubW9kYWxfX2Nsb3NlJykub24oJ2NsaWNrJywgKCkgPT4ge1xyXG5cdFx0XHRjbG9zZU1vZGFsKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRjb25zdCBzaG93TW9kYWwgPSAoKSA9PiB7XHJcblx0XHRcdCQoJy5tb2RhbCcpWzBdLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuXHRcdFx0ZGlzYWJsZVNjcm9sbCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGNsb3NlTW9kYWwgPSAoKSA9PiB7XHJcblx0XHRcdCQoJy5tb2RhbCcpWzBdLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuXHRcdFx0ZW5hYmxlU2Nyb2xsKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgZ2V0VXNlckRhdGEgPSAoKSA9PiB7XHJcblx0XHRcdGNvbnN0IHVzZXJEYXRhID0ge307XHJcblx0XHRcdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZm9ybVswXS5lbGVtZW50cywgKGVsKSA9PiB7XHJcblx0XHRcdFx0aWYoIWVsLnZhbHVlKSByZXR1cm47XHJcblx0XHRcdFx0dXNlckRhdGFbZWwubmFtZV0gPSBlbC52YWx1ZTtcclxuXHRcdFx0XHRlbC52YWx1ZSA9ICcnO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHRjb25zb2xlLmxvZyh1c2VyRGF0YSk7XHJcblx0XHRcdHJldHVybiB1c2VyRGF0YTtcclxuXHRcdH07XHJcblxyXG5cdFx0Y29uc3Qgc2VydmljZXNUZXh0cyA9ICQoJy5ncmlkLWl0ZW1fX3RleHQnKTtcclxuXHJcblx0XHRjb25zdCBhcnIgPSBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoc2VydmljZXNUZXh0cyAsZWwgPT4ge1xyXG5cdFx0XHRsZXQgYSA9IGVsLmlubmVyVGV4dC5zcGxpdCgnJyk7XHJcblx0XHRcdGlmKGEubGVuZ3RoIDwgODUpIHJldHVybiBlbC5pbm5lclRleHQ7XHJcblx0XHRcdGxldCBuZXdBID0gYS5zbGljZSgwLCA4NSk7XHJcblx0XHRcdGxldCBpbmRleCA9IG5ld0EubGFzdEluZGV4T2YoJyAnKTtcclxuXHRcdFx0cmV0dXJuIG5ld0Euc2xpY2UoMCwgaW5kZXgpLmpvaW4oJycpICsgJy4uLic7XHJcblx0XHR9KTtcclxuXHJcblx0XHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKHNlcnZpY2VzVGV4dHMsIChlbCwgaWR4KSA9PiB7XHJcblx0XHRcdGVsLmlubmVyVGV4dCA9IGFycltpZHhdO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xyXG5cdFx0XHRzZXRNZW51Rml4ZWQoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGNvbnN0IHNldE1lbnVGaXhlZCA9ICgpID0+IHtcclxuXHRcdFx0Y29uc3QgbmF2YmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbmF2aWdhdGlvbicpWzBdO1xyXG5cdFx0XHRpZih3aW5kb3cucGFnZVlPZmZzZXQgPj0gMzQpe1xyXG5cdFx0XHRcdG5hdmJhci5jbGFzc0xpc3QuYWRkKCdmaXhlZC10b3AnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRuYXZiYXIuY2xhc3NMaXN0LnJlbW92ZSgnZml4ZWQtdG9wJyk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0bGV0IHByb2dyZXNzID0gMDtcclxuXHJcblx0XHRmdW5jdGlvbiBzdGVwKCkge1xyXG5cdFx0XHRjb25zdCBwcm9ncmVzc2JhciA9ICQoJyNwcm9ncmVzc2JhcicpWzBdO1xyXG5cdFx0XHRsZXQgcHJvZ3Jlc3MgPSBNYXRoLmZsb29yKHdpbmRvdy5zY3JvbGxZICogMTAwIC8gKGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0IC0gd2luZG93LmlubmVySGVpZ2h0KSk7XHJcblx0XHRcdGlmKHByb2dyZXNzIDw9IDEwMCkge1xyXG5cdFx0XHRcdHByb2dyZXNzYmFyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKC0kezEwMCAtIHByb2dyZXNzfSUpYDtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHRkb2N1bWVudC5vbnNjcm9sbCA9ICgpID0+IHtcclxuXHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG5cdFx0fTtcclxuXHJcblx0XHRjb25zdCBtb2JpbGVNZW51QnV0dG9uID0gJCgnLm5hdmJhci10b2dnbGVyJyk7XHJcblx0XHRjb25zdCBtb2JpbGVNZW51ID0gJCgnI25hdmJhcicpO1xyXG5cclxuXHRcdG1vYmlsZU1lbnVCdXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdG1vYmlsZU1lbnUudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdCQoJy5uYXZpZ2F0aW9uX19saW5rJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0Y29uc3QgdG9wID0gJCgkKHRoaXMpLmF0dHIoJ2hyZWYnKSlbMF0ub2Zmc2V0VG9wO1xyXG5cdFx0XHR3aW5kb3cuc2Nyb2xsVG8oe1xyXG5cdFx0XHRcdHRvcDogdG9wLFxyXG5cdFx0XHRcdGJlaGF2aW9yOiAnc21vb3RoJ1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdCQoJy5hcnJvdy11cCcpLm9uKCdjbGljaycsICgpID0+IHtcclxuXHRcdFx0d2luZG93LnNjcm9sbFRvKHtcclxuXHRcdFx0XHR0b3A6IDAsXHJcblx0XHRcdFx0YmVoYXZpb3I6ICdzbW9vdGgnXHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cclxuXHJcbi8vIGxlZnQ6IDM3LCB1cDogMzgsIHJpZ2h0OiAzOSwgZG93bjogNDAsXHJcbi8vIHNwYWNlYmFyOiAzMiwgcGFnZXVwOiAzMywgcGFnZWRvd246IDM0LCBlbmQ6IDM1LCBob21lOiAzNlxyXG5jb25zdCBrZXlzID0gezM3OiAxLCAzODogMSwgMzk6IDEsIDQwOiAxfTtcclxuXHJcbmZ1bmN0aW9uIHByZXZlbnREZWZhdWx0KGUpIHtcclxuXHRlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XHJcblx0aWYgKGUucHJldmVudERlZmF1bHQpXHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0ZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwcmV2ZW50RGVmYXVsdEZvclNjcm9sbEtleXMoZSkge1xyXG5cdGlmIChrZXlzW2Uua2V5Q29kZV0pIHtcclxuXHRcdHByZXZlbnREZWZhdWx0KGUpO1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gZGlzYWJsZVNjcm9sbCgpIHtcclxuICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIC8vIG9sZGVyIEZGXHJcbiAgXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBwcmV2ZW50RGVmYXVsdCwgZmFsc2UpO1xyXG4gIHdpbmRvdy5vbndoZWVsID0gcHJldmVudERlZmF1bHQ7IC8vIG1vZGVybiBzdGFuZGFyZFxyXG4gIHdpbmRvdy5vbm1vdXNld2hlZWwgPSBkb2N1bWVudC5vbm1vdXNld2hlZWwgPSBwcmV2ZW50RGVmYXVsdDsgLy8gb2xkZXIgYnJvd3NlcnMsIElFXHJcbiAgd2luZG93Lm9udG91Y2htb3ZlICA9IHByZXZlbnREZWZhdWx0OyAvLyBtb2JpbGVcclxuICBkb2N1bWVudC5vbmtleWRvd24gID0gcHJldmVudERlZmF1bHRGb3JTY3JvbGxLZXlzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBlbmFibGVTY3JvbGwoKSB7XHJcblx0aWYgKHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKVxyXG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJywgcHJldmVudERlZmF1bHQsIGZhbHNlKTtcclxuXHR3aW5kb3cub25tb3VzZXdoZWVsID0gZG9jdW1lbnQub25tb3VzZXdoZWVsID0gbnVsbDtcclxuXHR3aW5kb3cub253aGVlbCA9IG51bGw7XHJcblx0d2luZG93Lm9udG91Y2htb3ZlID0gbnVsbDtcclxuXHRkb2N1bWVudC5vbmtleWRvd24gPSBudWxsO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG4vL9GB0YLQsNGA0YvQuSDQutC+0LQhISEhISEhIVxyXG4vLyAndXNlIHN0cmljdCc7XHJcbi8vIGNvbnN0IGZvcm0gPSAkKCcjY29udGFjdEZvcm0nKTtcclxuLy8gZm9ybS5vbignc3VibWl0JywgKGUpID0+IHtcclxuLy8gXHRlLnByZXZlbnREZWZhdWx0KCk7XHRcclxuLy8gfSk7XHJcblxyXG4vLyBjb25zdCBzZXJ2aWNlc1RleHRzID0gJCgnLmdyaWQtaXRlbV9fdGV4dCcpO1xyXG5cclxuLy8gc2VydmljZXNUZXh0cy5tYXAgPSBbXS5tYXA7XHJcbi8vIHNlcnZpY2VzVGV4dHMuZm9yRWFjaCA9IFtdLmZvckVhY2g7XHJcblxyXG4vLyBjb25zdCBhcnIgPSBzZXJ2aWNlc1RleHRzLm1hcChlbCA9PiB7XHJcbi8vIFx0bGV0IGEgPSBlbC5pbm5lclRleHQuc3BsaXQoJycpO1xyXG4vLyBcdGlmKGEubGVuZ3RoIDwgODUpIHJldHVybiBlbC5pbm5lclRleHQ7XHJcbi8vIFx0bGV0IG5ld0EgPSBhLnNsaWNlKDAsIDg1KTtcclxuLy8gXHRsZXQgaW5kZXggPSBuZXdBLmxhc3RJbmRleE9mKCcgJyk7XHJcbi8vIFx0cmV0dXJuIG5ld0Euc2xpY2UoMCwgaW5kZXgpLmpvaW4oJycpICsgJy4uLic7XHJcbi8vIH0pO1xyXG5cclxuLy8gc2VydmljZXNUZXh0cy5mb3JFYWNoKChlbCwgaWR4KSA9PiB7XHJcbi8vIFx0ZWwuaW5uZXJUZXh0ID0gYXJyW2lkeF07XHJcbi8vIH0pO1xyXG5cclxuXHJcbi8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcclxuLy8gXHRzZXRNZW51Rml4ZWQoKTtcclxuLy8gfSk7XHJcblxyXG5cclxuLy8gY29uc3Qgc2V0TWVudUZpeGVkID0gKCkgPT4ge1xyXG4vLyBcdGNvbnN0IG5hdmJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ25hdmlnYXRpb24nKVswXTtcdFxyXG4vLyBcdGlmKHdpbmRvdy5wYWdlWU9mZnNldCA+PSAzNCl7XHJcbi8vIFx0XHRuYXZiYXIuY2xhc3NMaXN0LmFkZCgnZml4ZWQtdG9wJyk7XHJcbi8vIFx0fSBlbHNlIHtcclxuLy8gXHRcdG5hdmJhci5jbGFzc0xpc3QucmVtb3ZlKCdmaXhlZC10b3AnKTtcclxuLy8gXHR9XHJcbi8vIH07XHJcblxyXG5cclxuXHJcbi8vICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbi8vICAgJCgnLnBhcnRuZXJzX19saXN0Jykuc2xpY2soe1xyXG4vLyAgIFx0YXV0b3BsYXk6IHRydWUsXHJcbi8vICAgXHRzbGlkZXNUb1Nob3c6IDYsXHJcbi8vICAgXHRhcnJvd3M6IGZhbHNlXHJcbi8vICAgfSk7XHJcbi8vIH0pO1xyXG5cclxuLy8gXHRcdCd1c2Ugc3RyaWN0JztcclxuXHJcbi8vIFx0XHRjb25zdCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbi8vIFx0XHR3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbi8vIFx0XHR3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbi8vIFx0XHR3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XHJcbi8vIFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xyXG5cclxuLy8gXHRcdCQoJy5wYXJ0bmVyc19fbGlzdCcpLnNsaWNrKHtcclxuLy8gXHRcdFx0YXV0b3BsYXk6IHRydWUsXHJcbi8vIFx0XHRcdHNsaWRlc1RvU2hvdzogNixcclxuLy8gXHRcdFx0YXJyb3dzOiBmYWxzZVxyXG4vLyBcdFx0fSk7XHJcblxyXG4vLyBcdFx0Y29uc3QgZm9ybSA9ICQoJyNjb250YWN0Rm9ybScpO1xyXG5cclxuLy8gXHRcdGZvcm0ub24oJ3N1Ym1pdCcsIChlKSA9PiB7XHJcbi8vIFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuLy8gXHRcdFx0Z2V0VXNlckRhdGEoKTtcclxuLy8gXHRcdFx0c2hvd01vZGFsKCk7XHJcbi8vIFx0XHR9KTtcclxuXHRcdFxyXG4vLyAkKCcubW9kYWxfX2Nsb3NlJykub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4vLyBcdFx0XHRjbG9zZU1vZGFsKCk7XHJcbi8vIFx0XHR9KTtcclxuXHJcbi8vIFx0XHRjb25zdCBzaG93TW9kYWwgPSAoKSA9PiB7XHJcbi8vIFx0XHRcdCQoJy5tb2RhbCcpWzBdLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuLy8gXHRcdFx0ZGlzYWJsZVNjcm9sbCgpO1xyXG4vLyBcdFx0fVxyXG5cclxuLy8gXHRcdGNvbnN0IGNsb3NlTW9kYWwgPSAoKSA9PiB7XHJcbi8vIFx0XHRcdCQoJy5tb2RhbCcpWzBdLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuLy8gXHRcdFx0ZW5hYmxlU2Nyb2xsKCk7XHJcbi8vIFx0XHR9XHJcblxyXG4vLyBcdFx0Y29uc3QgZ2V0VXNlckRhdGEgPSAoKSA9PiB7XHJcbi8vIFx0XHRcdGNvbnN0IHVzZXJEYXRhID0ge307XHJcbi8vIFx0XHRcdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZm9ybVswXS5lbGVtZW50cywgKGVsKSA9PiB7XHJcbi8vIFx0XHRcdFx0aWYoIWVsLnZhbHVlKSByZXR1cm47XHJcbi8vIFx0XHRcdFx0dXNlckRhdGFbZWwubmFtZV0gPSBlbC52YWx1ZTtcclxuLy8gXHRcdFx0XHRlbC52YWx1ZSA9ICcnO1xyXG4vLyBcdFx0XHR9KVxyXG4vLyBcdFx0XHRyZXR1cm4gdXNlckRhdGE7XHJcbi8vIFx0XHR9O1xyXG5cclxuLy8gXHRcdGNvbnN0IHNlcnZpY2VzVGV4dHMgPSAkKCcuZ3JpZC1pdGVtX190ZXh0Jyk7XHJcblxyXG4vLyBcdFx0Y29uc3QgYXJyID0gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKHNlcnZpY2VzVGV4dHMgLGVsID0+IHtcclxuLy8gXHRcdFx0bGV0IGEgPSBlbC5pbm5lclRleHQuc3BsaXQoJycpO1xyXG4vLyBcdFx0XHRpZihhLmxlbmd0aCA8IDg1KSByZXR1cm4gZWwuaW5uZXJUZXh0O1xyXG4vLyBcdFx0XHRsZXQgbmV3QSA9IGEuc2xpY2UoMCwgODUpO1xyXG4vLyBcdFx0XHRsZXQgaW5kZXggPSBuZXdBLmxhc3RJbmRleE9mKCcgJyk7XHJcbi8vIFx0XHRcdHJldHVybiBuZXdBLnNsaWNlKDAsIGluZGV4KS5qb2luKCcnKSArICcuLi4nO1xyXG4vLyBcdFx0fSk7XHJcblxyXG4vLyBcdFx0QXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChzZXJ2aWNlc1RleHRzLCAoZWwsIGlkeCkgPT4ge1xyXG4vLyBcdFx0XHRlbC5pbm5lclRleHQgPSBhcnJbaWR4XTtcclxuLy8gXHRcdH0pO1xyXG5cclxuLy8gXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcclxuLy8gXHRcdFx0c2V0TWVudUZpeGVkKCk7XHJcbi8vIFx0XHR9KTtcclxuXHJcbi8vIFx0XHRjb25zdCBzZXRNZW51Rml4ZWQgPSAoKSA9PiB7XHJcbi8vIFx0XHRcdGNvbnN0IG5hdmJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ25hdmlnYXRpb24nKVswXTtcclxuLy8gXHRcdFx0aWYod2luZG93LnBhZ2VZT2Zmc2V0ID49IDM0KXtcclxuLy8gXHRcdFx0XHRuYXZiYXIuY2xhc3NMaXN0LmFkZCgnZml4ZWQtdG9wJyk7XHJcbi8vIFx0XHRcdH0gZWxzZSB7XHJcbi8vIFx0XHRcdFx0bmF2YmFyLmNsYXNzTGlzdC5yZW1vdmUoJ2ZpeGVkLXRvcCcpO1xyXG4vLyBcdFx0XHR9XHJcbi8vIFx0XHR9O1xyXG5cclxuLy8gXHRcdGxldCBwcm9ncmVzcyA9IDA7XHJcblxyXG4vLyBcdFx0ZnVuY3Rpb24gc3RlcCgpIHtcclxuLy8gXHRcdFx0Y29uc3QgcHJvZ3Jlc3NiYXIgPSAkKCcjcHJvZ3Jlc3NiYXInKVswXTtcclxuLy8gXHRcdFx0bGV0IHByb2dyZXNzID0gTWF0aC5mbG9vcih3aW5kb3cuc2Nyb2xsWSAqIDEwMCAvIChkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCAtIHdpbmRvdy5pbm5lckhlaWdodCkpO1xyXG4vLyBcdFx0XHRpZihwcm9ncmVzcyA8PSAxMDApIHtcclxuLy8gXHRcdFx0XHRwcm9ncmVzc2Jhci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgtJHsxMDAgLSBwcm9ncmVzc30lKWA7XHJcbi8vIFx0XHRcdH1cclxuLy8gXHRcdH07XHJcblxyXG4vLyBcdFx0ZG9jdW1lbnQub25zY3JvbGwgPSAoKSA9PiB7XHJcbi8vIFx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxuLy8gXHRcdH07XHJcblxyXG4vLyBcdFx0Y29uc3QgbW9iaWxlTWVudUJ1dHRvbiA9ICQoJy5uYXZiYXItdG9nZ2xlcicpO1xyXG4vLyBcdFx0Y29uc3QgbW9iaWxlTWVudSA9ICQoJyNuYXZiYXInKTtcclxuXHJcbi8vIFx0XHRtb2JpbGVNZW51QnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4vLyBcdFx0XHRtb2JpbGVNZW51LnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcbi8vIFx0XHR9KTtcclxuXHJcbi8vIFx0XHQkKCcubmF2aWdhdGlvbl9fbGluaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4vLyBcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcbi8vIFx0XHRcdGNvbnN0IHRvcCA9ICQoJCh0aGlzKS5hdHRyKCdocmVmJykpWzBdLm9mZnNldFRvcDtcclxuLy8gXHRcdFx0d2luZG93LnNjcm9sbFRvKHtcclxuLy8gXHRcdFx0XHR0b3A6IHRvcCxcclxuLy8gXHRcdFx0XHRiZWhhdmlvcjogJ3Ntb290aCdcclxuLy8gXHRcdFx0fSk7XHJcbi8vIFx0XHR9KTtcclxuXHJcbi8vIFx0XHQkKCcudXAnKS5vbignY2xpY2snLCAoKSA9PiB7XHJcbi8vIFx0XHRcdHdpbmRvdy5zY3JvbGxUbyh7XHJcbi8vIFx0XHRcdFx0dG9wOiAwLFxyXG4vLyBcdFx0XHRcdGJlaGF2aW9yOiAnc21vb3RoJ1xyXG4vLyBcdFx0XHR9KTtcclxuLy8gXHRcdH0pO1xyXG5cclxuXHJcblxyXG4vLyBsZWZ0OiAzNywgdXA6IDM4LCByaWdodDogMzksIGRvd246IDQwLFxyXG4vLyBzcGFjZWJhcjogMzIsIHBhZ2V1cDogMzMsIHBhZ2Vkb3duOiAzNCwgZW5kOiAzNSwgaG9tZTogMzZcclxuLy8gdmFyIGtleXMgPSB7Mzc6IDEsIDM4OiAxLCAzOTogMSwgNDA6IDF9O1xyXG5cclxuLy8gZnVuY3Rpb24gcHJldmVudERlZmF1bHQoZSkge1xyXG4vLyBcdGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcclxuLy8gXHRpZiAoZS5wcmV2ZW50RGVmYXVsdClcclxuLy8gXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuLy8gXHRlLnJldHVyblZhbHVlID0gZmFsc2U7XHJcbi8vIH1cclxuXHJcbi8vIGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0Rm9yU2Nyb2xsS2V5cyhlKSB7XHJcbi8vIFx0aWYgKGtleXNbZS5rZXlDb2RlXSkge1xyXG4vLyBcdFx0cHJldmVudERlZmF1bHQoZSk7XHJcbi8vIFx0XHRyZXR1cm4gZmFsc2U7XHJcbi8vIFx0fVxyXG4vLyB9XHJcblxyXG4vLyBmdW5jdGlvbiBkaXNhYmxlU2Nyb2xsKCkge1xyXG4vLyAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikgLy8gb2xkZXIgRkZcclxuLy8gICBcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Nb3VzZVNjcm9sbCcsIHByZXZlbnREZWZhdWx0LCBmYWxzZSk7XHJcbi8vICAgd2luZG93Lm9ud2hlZWwgPSBwcmV2ZW50RGVmYXVsdDsgLy8gbW9kZXJuIHN0YW5kYXJkXHJcbi8vICAgd2luZG93Lm9ubW91c2V3aGVlbCA9IGRvY3VtZW50Lm9ubW91c2V3aGVlbCA9IHByZXZlbnREZWZhdWx0OyAvLyBvbGRlciBicm93c2VycywgSUVcclxuLy8gICB3aW5kb3cub250b3VjaG1vdmUgID0gcHJldmVudERlZmF1bHQ7IC8vIG1vYmlsZVxyXG4vLyAgIGRvY3VtZW50Lm9ua2V5ZG93biAgPSBwcmV2ZW50RGVmYXVsdEZvclNjcm9sbEtleXM7XHJcbi8vIH1cclxuXHJcbi8vIGZ1bmN0aW9uIGVuYWJsZVNjcm9sbCgpIHtcclxuLy8gXHRpZiAod2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIpXHJcbi8vIFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBwcmV2ZW50RGVmYXVsdCwgZmFsc2UpO1xyXG4vLyBcdHdpbmRvdy5vbm1vdXNld2hlZWwgPSBkb2N1bWVudC5vbm1vdXNld2hlZWwgPSBudWxsO1xyXG4vLyBcdHdpbmRvdy5vbndoZWVsID0gbnVsbDtcclxuLy8gXHR3aW5kb3cub250b3VjaG1vdmUgPSBudWxsO1xyXG4vLyBcdGRvY3VtZW50Lm9ua2V5ZG93biA9IG51bGw7XHJcbi8vIH07XHJcblxyXG4vLyA7KGZ1bmN0aW9uKCQpIHtcclxuLy8gXHQndXNlIHN0cmljdCc7XHJcblxyXG4vLyBcdCQoZnVuY3Rpb24oKXtcclxuLy8gXHRcdCQoJy5pbWdfX2RpdicpLnNsaWNrKCk7XHJcbi8vIFx0fSlcclxuLy8gfSkoalF1ZXJ5KTtcclxuXHJcbi8vICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbi8vICAgJCgnLmltZ19fZGl2Jykuc2xpY2soKTtcclxuLy8gfSk7Il0sImZpbGUiOiJzY3JpcHQuanMifQ==
