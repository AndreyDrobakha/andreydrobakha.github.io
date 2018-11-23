;(function(){
	'use strict'

	let userName = prompt('Кто пришел?', 'Админ');

	if (userName == 'Админ') {
		let password = prompt('Пароль?');

		if (password == 'Черный Властелин') {
			alert('Добро пожаловать!');
		}

		else if (password == null) {
			alert('Вход отменен');
		}

		else {
			alert('Пароль неверен');
		}
	}

	else if (userName == null) {
		alert('Вход отменен');
	}

	else { 
		alert('Я Вас не знаю');
	}

})();
