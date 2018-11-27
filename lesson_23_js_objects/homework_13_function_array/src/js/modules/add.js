import isNumeric from './is-numeric';

const add = () => {
	const adder = document.createElement('div');
	adder.style.border = '2px solid white';
	adder.style.margin = '2em';
	adder.style.padding = '2em';


	const h3 = document.createElement('h3');
	const form = document.createElement('form');
	const input_1 = document.createElement('input');
	input_1.setAttribute('type', 'text');
	const input_2 = document.createElement('input');
	input_2.setAttribute('type', 'text');
	const input_3 = document.createElement('input');
	input_3.setAttribute('type', 'submit');
	input_3.setAttribute('value', 'Go!');
	const res = document.createElement('div');
	const random = document.createElement('div');

	h3.innerText = 'Введите два числа';
	h3.style.fontSize = '2em';
	h3.style.textAlign = 'center';
	form.style.marginBottom = '2em';
	input_1.style.fontSize = '2em';
	input_2.style.fontSize = '2em';
	input_1.style.textAlign = 'center';
	input_2.style.textAlign = 'center';
	input_3.style.fontSize = '2em';
	res.style.fontSize = '2em';
	res.style.fontWeight = 'bold';
	res.style.color = 'green';
	res.style.textAlign = 'center';
	res.style.marginBottom = '1em';
	random.style.fontSize = '2em';
	random.style.fontWeight = 'bold';
	random.style.color = 'green';
	random.style.textAlign = 'center';

	res.innerText = 'Здесь будет результат!';
	random.innerText = 'Здесь будет Random!';

	form.appendChild(input_1);
	form.appendChild(input_2);
	form.appendChild(input_3);

	adder.appendChild(h3);
	adder.appendChild(form);
	adder.appendChild(res);
	adder.appendChild(random);
	document.body.appendChild(adder);

	form.onsubmit = (e) => {
		e.preventDefault();

		let value_1 = input_1.value;
		let value_2 = input_2.value;

		if(!(isNumeric(value_1) && isNumeric(value_2))){
			res.innerText = 'Ошибка! Введенные значения должны быть цифрами!';
			return;
		}

		res.innerText = (+value_1 + +value_2);

		if(+value_1 > +value_2) {
			random.innerText = 'Первое значение должно быть меньше второго!';
			return;
		}

		let randomRes;

		do {
			randomRes = Math.floor(Math.random() * +value_2 + 1)
		} while(+value_1 > randomRes)

		random.innerText = randomRes;
	}
}

export default add();