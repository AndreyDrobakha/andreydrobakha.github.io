"use strict";

/*'use strict';
const form = $('#contactForm');
form.on('submit', (e) => {
	e.preventDefault();	
});

const servicesTexts = $('.grid-item__text');

servicesTexts.map = [].map;
servicesTexts.forEach = [].forEach;

const arr = servicesTexts.map(el => {
	let a = el.innerText.split('');
	if(a.length < 85) return el.innerText;
	let newA = a.slice(0, 85);
	let index = newA.lastIndexOf(' ');
	return newA.slice(0, index).join('') + '...';
});

servicesTexts.forEach((el, idx) => {
	el.innerText = arr[idx];
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



$(document).ready(function(){
  $('.partners__list').slick({
  	autoplay: true,
  	slidesToShow: 6,
  	arrows: false
  });
});*/
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
// // left: 37, up: 38, right: 39, down: 40,
// // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
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
$(document).ready(function () {
  $('.img__div').slick();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjcmlwdC5qcyJdLCJuYW1lcyI6WyIkIiwiZG9jdW1lbnQiLCJyZWFkeSIsInNsaWNrIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdEQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsQ0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWUMsS0FBWixDQUFrQixZQUFVO0FBQzFCRixFQUFBQSxDQUFDLENBQUMsV0FBRCxDQUFELENBQWVHLEtBQWY7QUFDRCxDQUZEIiwic291cmNlc0NvbnRlbnQiOlsiLyondXNlIHN0cmljdCc7XHJcbmNvbnN0IGZvcm0gPSAkKCcjY29udGFjdEZvcm0nKTtcclxuZm9ybS5vbignc3VibWl0JywgKGUpID0+IHtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHRcclxufSk7XHJcblxyXG5jb25zdCBzZXJ2aWNlc1RleHRzID0gJCgnLmdyaWQtaXRlbV9fdGV4dCcpO1xyXG5cclxuc2VydmljZXNUZXh0cy5tYXAgPSBbXS5tYXA7XHJcbnNlcnZpY2VzVGV4dHMuZm9yRWFjaCA9IFtdLmZvckVhY2g7XHJcblxyXG5jb25zdCBhcnIgPSBzZXJ2aWNlc1RleHRzLm1hcChlbCA9PiB7XHJcblx0bGV0IGEgPSBlbC5pbm5lclRleHQuc3BsaXQoJycpO1xyXG5cdGlmKGEubGVuZ3RoIDwgODUpIHJldHVybiBlbC5pbm5lclRleHQ7XHJcblx0bGV0IG5ld0EgPSBhLnNsaWNlKDAsIDg1KTtcclxuXHRsZXQgaW5kZXggPSBuZXdBLmxhc3RJbmRleE9mKCcgJyk7XHJcblx0cmV0dXJuIG5ld0Euc2xpY2UoMCwgaW5kZXgpLmpvaW4oJycpICsgJy4uLic7XHJcbn0pO1xyXG5cclxuc2VydmljZXNUZXh0cy5mb3JFYWNoKChlbCwgaWR4KSA9PiB7XHJcblx0ZWwuaW5uZXJUZXh0ID0gYXJyW2lkeF07XHJcbn0pO1xyXG5cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcclxuXHRzZXRNZW51Rml4ZWQoKTtcclxufSk7XHJcblxyXG5cclxuY29uc3Qgc2V0TWVudUZpeGVkID0gKCkgPT4ge1xyXG5cdGNvbnN0IG5hdmJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ25hdmlnYXRpb24nKVswXTtcdFxyXG5cdGlmKHdpbmRvdy5wYWdlWU9mZnNldCA+PSAzNCl7XHJcblx0XHRuYXZiYXIuY2xhc3NMaXN0LmFkZCgnZml4ZWQtdG9wJyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdG5hdmJhci5jbGFzc0xpc3QucmVtb3ZlKCdmaXhlZC10b3AnKTtcclxuXHR9XHJcbn07XHJcblxyXG5cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgJCgnLnBhcnRuZXJzX19saXN0Jykuc2xpY2soe1xyXG4gIFx0YXV0b3BsYXk6IHRydWUsXHJcbiAgXHRzbGlkZXNUb1Nob3c6IDYsXHJcbiAgXHRhcnJvd3M6IGZhbHNlXHJcbiAgfSk7XHJcbn0pOyovXHJcblxyXG4vLyBcdFx0J3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gXHRcdGNvbnN0IHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuLy8gXHRcdHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuLy8gXHRcdHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuLy8gXHRcdHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZTtcclxuLy8gXHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XHJcblxyXG4vLyBcdFx0JCgnLnBhcnRuZXJzX19saXN0Jykuc2xpY2soe1xyXG4vLyBcdFx0XHRhdXRvcGxheTogdHJ1ZSxcclxuLy8gXHRcdFx0c2xpZGVzVG9TaG93OiA2LFxyXG4vLyBcdFx0XHRhcnJvd3M6IGZhbHNlXHJcbi8vIFx0XHR9KTtcclxuXHJcbi8vIFx0XHRjb25zdCBmb3JtID0gJCgnI2NvbnRhY3RGb3JtJyk7XHJcblxyXG4vLyBcdFx0Zm9ybS5vbignc3VibWl0JywgKGUpID0+IHtcclxuLy8gXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4vLyBcdFx0XHRnZXRVc2VyRGF0YSgpO1xyXG4vLyBcdFx0XHRzaG93TW9kYWwoKTtcclxuLy8gXHRcdH0pO1xyXG5cdFx0XHJcbi8vICQoJy5tb2RhbF9fY2xvc2UnKS5vbignY2xpY2snLCAoKSA9PiB7XHJcbi8vIFx0XHRcdGNsb3NlTW9kYWwoKTtcclxuLy8gXHRcdH0pO1xyXG5cclxuLy8gXHRcdGNvbnN0IHNob3dNb2RhbCA9ICgpID0+IHtcclxuLy8gXHRcdFx0JCgnLm1vZGFsJylbMF0uY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xyXG4vLyBcdFx0XHRkaXNhYmxlU2Nyb2xsKCk7XHJcbi8vIFx0XHR9XHJcblxyXG4vLyBcdFx0Y29uc3QgY2xvc2VNb2RhbCA9ICgpID0+IHtcclxuLy8gXHRcdFx0JCgnLm1vZGFsJylbMF0uY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4vLyBcdFx0XHRlbmFibGVTY3JvbGwoKTtcclxuLy8gXHRcdH1cclxuXHJcbi8vIFx0XHRjb25zdCBnZXRVc2VyRGF0YSA9ICgpID0+IHtcclxuLy8gXHRcdFx0Y29uc3QgdXNlckRhdGEgPSB7fTtcclxuLy8gXHRcdFx0QXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChmb3JtWzBdLmVsZW1lbnRzLCAoZWwpID0+IHtcclxuLy8gXHRcdFx0XHRpZighZWwudmFsdWUpIHJldHVybjtcclxuLy8gXHRcdFx0XHR1c2VyRGF0YVtlbC5uYW1lXSA9IGVsLnZhbHVlO1xyXG4vLyBcdFx0XHRcdGVsLnZhbHVlID0gJyc7XHJcbi8vIFx0XHRcdH0pXHJcbi8vIFx0XHRcdHJldHVybiB1c2VyRGF0YTtcclxuLy8gXHRcdH07XHJcblxyXG4vLyBcdFx0Y29uc3Qgc2VydmljZXNUZXh0cyA9ICQoJy5ncmlkLWl0ZW1fX3RleHQnKTtcclxuXHJcbi8vIFx0XHRjb25zdCBhcnIgPSBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoc2VydmljZXNUZXh0cyAsZWwgPT4ge1xyXG4vLyBcdFx0XHRsZXQgYSA9IGVsLmlubmVyVGV4dC5zcGxpdCgnJyk7XHJcbi8vIFx0XHRcdGlmKGEubGVuZ3RoIDwgODUpIHJldHVybiBlbC5pbm5lclRleHQ7XHJcbi8vIFx0XHRcdGxldCBuZXdBID0gYS5zbGljZSgwLCA4NSk7XHJcbi8vIFx0XHRcdGxldCBpbmRleCA9IG5ld0EubGFzdEluZGV4T2YoJyAnKTtcclxuLy8gXHRcdFx0cmV0dXJuIG5ld0Euc2xpY2UoMCwgaW5kZXgpLmpvaW4oJycpICsgJy4uLic7XHJcbi8vIFx0XHR9KTtcclxuXHJcbi8vIFx0XHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKHNlcnZpY2VzVGV4dHMsIChlbCwgaWR4KSA9PiB7XHJcbi8vIFx0XHRcdGVsLmlubmVyVGV4dCA9IGFycltpZHhdO1xyXG4vLyBcdFx0fSk7XHJcblxyXG4vLyBcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xyXG4vLyBcdFx0XHRzZXRNZW51Rml4ZWQoKTtcclxuLy8gXHRcdH0pO1xyXG5cclxuLy8gXHRcdGNvbnN0IHNldE1lbnVGaXhlZCA9ICgpID0+IHtcclxuLy8gXHRcdFx0Y29uc3QgbmF2YmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbmF2aWdhdGlvbicpWzBdO1xyXG4vLyBcdFx0XHRpZih3aW5kb3cucGFnZVlPZmZzZXQgPj0gMzQpe1xyXG4vLyBcdFx0XHRcdG5hdmJhci5jbGFzc0xpc3QuYWRkKCdmaXhlZC10b3AnKTtcclxuLy8gXHRcdFx0fSBlbHNlIHtcclxuLy8gXHRcdFx0XHRuYXZiYXIuY2xhc3NMaXN0LnJlbW92ZSgnZml4ZWQtdG9wJyk7XHJcbi8vIFx0XHRcdH1cclxuLy8gXHRcdH07XHJcblxyXG4vLyBcdFx0bGV0IHByb2dyZXNzID0gMDtcclxuXHJcbi8vIFx0XHRmdW5jdGlvbiBzdGVwKCkge1xyXG4vLyBcdFx0XHRjb25zdCBwcm9ncmVzc2JhciA9ICQoJyNwcm9ncmVzc2JhcicpWzBdO1xyXG4vLyBcdFx0XHRsZXQgcHJvZ3Jlc3MgPSBNYXRoLmZsb29yKHdpbmRvdy5zY3JvbGxZICogMTAwIC8gKGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0IC0gd2luZG93LmlubmVySGVpZ2h0KSk7XHJcbi8vIFx0XHRcdGlmKHByb2dyZXNzIDw9IDEwMCkge1xyXG4vLyBcdFx0XHRcdHByb2dyZXNzYmFyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKC0kezEwMCAtIHByb2dyZXNzfSUpYDtcclxuLy8gXHRcdFx0fVxyXG4vLyBcdFx0fTtcclxuXHJcbi8vIFx0XHRkb2N1bWVudC5vbnNjcm9sbCA9ICgpID0+IHtcclxuLy8gXHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG4vLyBcdFx0fTtcclxuXHJcbi8vIFx0XHRjb25zdCBtb2JpbGVNZW51QnV0dG9uID0gJCgnLm5hdmJhci10b2dnbGVyJyk7XHJcbi8vIFx0XHRjb25zdCBtb2JpbGVNZW51ID0gJCgnI25hdmJhcicpO1xyXG5cclxuLy8gXHRcdG1vYmlsZU1lbnVCdXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbi8vIFx0XHRcdG1vYmlsZU1lbnUudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuLy8gXHRcdH0pO1xyXG5cclxuLy8gXHRcdCQoJy5uYXZpZ2F0aW9uX19saW5rJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbi8vIFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuLy8gXHRcdFx0Y29uc3QgdG9wID0gJCgkKHRoaXMpLmF0dHIoJ2hyZWYnKSlbMF0ub2Zmc2V0VG9wO1xyXG4vLyBcdFx0XHR3aW5kb3cuc2Nyb2xsVG8oe1xyXG4vLyBcdFx0XHRcdHRvcDogdG9wLFxyXG4vLyBcdFx0XHRcdGJlaGF2aW9yOiAnc21vb3RoJ1xyXG4vLyBcdFx0XHR9KTtcclxuLy8gXHRcdH0pO1xyXG5cclxuLy8gXHRcdCQoJy51cCcpLm9uKCdjbGljaycsICgpID0+IHtcclxuLy8gXHRcdFx0d2luZG93LnNjcm9sbFRvKHtcclxuLy8gXHRcdFx0XHR0b3A6IDAsXHJcbi8vIFx0XHRcdFx0YmVoYXZpb3I6ICdzbW9vdGgnXHJcbi8vIFx0XHRcdH0pO1xyXG4vLyBcdFx0fSk7XHJcblxyXG5cclxuXHJcbi8vIC8vIGxlZnQ6IDM3LCB1cDogMzgsIHJpZ2h0OiAzOSwgZG93bjogNDAsXHJcbi8vIC8vIHNwYWNlYmFyOiAzMiwgcGFnZXVwOiAzMywgcGFnZWRvd246IDM0LCBlbmQ6IDM1LCBob21lOiAzNlxyXG4vLyB2YXIga2V5cyA9IHszNzogMSwgMzg6IDEsIDM5OiAxLCA0MDogMX07XHJcblxyXG4vLyBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdChlKSB7XHJcbi8vIFx0ZSA9IGUgfHwgd2luZG93LmV2ZW50O1xyXG4vLyBcdGlmIChlLnByZXZlbnREZWZhdWx0KVxyXG4vLyBcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4vLyBcdGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuLy8gfVxyXG5cclxuLy8gZnVuY3Rpb24gcHJldmVudERlZmF1bHRGb3JTY3JvbGxLZXlzKGUpIHtcclxuLy8gXHRpZiAoa2V5c1tlLmtleUNvZGVdKSB7XHJcbi8vIFx0XHRwcmV2ZW50RGVmYXVsdChlKTtcclxuLy8gXHRcdHJldHVybiBmYWxzZTtcclxuLy8gXHR9XHJcbi8vIH1cclxuXHJcbi8vIGZ1bmN0aW9uIGRpc2FibGVTY3JvbGwoKSB7XHJcbi8vICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSAvLyBvbGRlciBGRlxyXG4vLyAgIFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJywgcHJldmVudERlZmF1bHQsIGZhbHNlKTtcclxuLy8gICB3aW5kb3cub253aGVlbCA9IHByZXZlbnREZWZhdWx0OyAvLyBtb2Rlcm4gc3RhbmRhcmRcclxuLy8gICB3aW5kb3cub25tb3VzZXdoZWVsID0gZG9jdW1lbnQub25tb3VzZXdoZWVsID0gcHJldmVudERlZmF1bHQ7IC8vIG9sZGVyIGJyb3dzZXJzLCBJRVxyXG4vLyAgIHdpbmRvdy5vbnRvdWNobW92ZSAgPSBwcmV2ZW50RGVmYXVsdDsgLy8gbW9iaWxlXHJcbi8vICAgZG9jdW1lbnQub25rZXlkb3duICA9IHByZXZlbnREZWZhdWx0Rm9yU2Nyb2xsS2V5cztcclxuLy8gfVxyXG5cclxuLy8gZnVuY3Rpb24gZW5hYmxlU2Nyb2xsKCkge1xyXG4vLyBcdGlmICh3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcilcclxuLy8gXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Nb3VzZVNjcm9sbCcsIHByZXZlbnREZWZhdWx0LCBmYWxzZSk7XHJcbi8vIFx0d2luZG93Lm9ubW91c2V3aGVlbCA9IGRvY3VtZW50Lm9ubW91c2V3aGVlbCA9IG51bGw7XHJcbi8vIFx0d2luZG93Lm9ud2hlZWwgPSBudWxsO1xyXG4vLyBcdHdpbmRvdy5vbnRvdWNobW92ZSA9IG51bGw7XHJcbi8vIFx0ZG9jdW1lbnQub25rZXlkb3duID0gbnVsbDtcclxuLy8gfTtcclxuXHJcbi8vIDsoZnVuY3Rpb24oJCkge1xyXG4vLyBcdCd1c2Ugc3RyaWN0JztcclxuXHJcbi8vIFx0JChmdW5jdGlvbigpe1xyXG4vLyBcdFx0JCgnLmltZ19fZGl2Jykuc2xpY2soKTtcclxuLy8gXHR9KVxyXG4vLyB9KShqUXVlcnkpO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAkKCcuaW1nX19kaXYnKS5zbGljaygpO1xyXG59KTsiXSwiZmlsZSI6InNjcmlwdC5qcyJ9
