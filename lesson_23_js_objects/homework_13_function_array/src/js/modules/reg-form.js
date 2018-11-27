const regForm = () => {
	const form = document.forms['myForm'];

	if(!form) return;

	form.onsubmit = (e) => {
		e.preventDefault();

		let login = form.elements.login.value.toLowerCase();
		let password = form.elements.pass.value;

		if(login !== 'admin'){
			alert('I don`t know you! Gerara here!!!');
			login.focus();
			return;
		}

		if(password !== 'Чёрный властелин'){
			alert('Wrong Password!!!');
			password.focus();
			return;
		}

		alert('Welcome, Master!');
		return;
	}
}

export default regForm();