'use strict';
const form = $('#contactForm');
form.on('submit', (e) => {
	e.preventDefault();
});

// document.querySelectorAll('.grid-item__text')
// const servicesTexts = $('.grid-item__text')
// 						.text()
// 						.split('');
// 						.slice(0, 80);

// const indexOfLastSpace = servicesTexts.lastIndexOf('')

// // servicesTexts.slice(0, indexOfLastSpace);						
// // 						.join('') + '...';

// $('.grid-item__text').text(servicesTexts.slice(0, indexOfLastSpace)).join('') + '...';