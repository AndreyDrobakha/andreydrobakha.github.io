import isNumeric from './is-numeric';

const randomFromOne = () => {
	const field = document.createElement('div');
	field.style.border = '2px solid white';
	field.style.margin = '2em';
	field.style.padding = '2em';
	field.style.textAlign = 'center';


	const form = document.createElement('form');
	const input = document.createElement('input');
	input.setAttribute('type', 'text');
	const submit = document.createElement('input');
	submit.setAttribute('type', 'submit');
	submit.setAttribute('value', 'Рандом');
	const res = document.createElement('div');

	form.style.marginBottom = '2em';
	input.style.fontSize = '2em';
	input.style.textAlign = 'center';
	submit.style.fontSize = '2em';
	submit.style.textAlign = 'center';
	res.style.fontSize = '2em';
	res.style.fontWeight = 'bold';
	res.style.color = 'green';
	res.style.textAlign = 'center';

	res.innerText = 'Здесь будет результат!';

	form.appendChild(input);
	form.appendChild(submit);

	field.appendChild(form);
	field.appendChild(res);

	document.body.appendChild(field);


	form.onsubmit = (e) => {
		e.preventDefault();

		let value = input.value;

		if(!(isNumeric(value))){
			res.innerText = 'Ошибка! Введенное значение должно быть цифрой!';
			return;
		}

		const result = Math.ceil(Math.random() * +value);

		res.innerText = result;
	}
}

export default randomFromOne();