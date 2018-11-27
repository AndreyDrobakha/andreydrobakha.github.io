const tails = () => {
	const tailsField = document.createElement('div');
	tailsField.style.border = '2px solid white';
	tailsField.style.margin = '2em';
	tailsField.style.padding = '2em';
	tailsField.style.textAlign = 'center';
	tailsField.style.color = 'black';


	const button = document.createElement('button');
	button.innerText = 'Play';
	button.style.fontSize = '2em';
	button.style.marginBottom = '1em';

	const coin = document.createElement('span');

	coin.style.display = 'flex';
	coin.style.justifyContent = 'center';
	coin.style.alignItems = 'center';
	coin.style.fontSize = '1.5em';
	coin.style.width = '100px';
	coin.style.height = '100px';
	coin.style.background = 'yellow';
	coin.style.border = '5px solid orange';
	coin.style.borderRadius = '50%';

	tailsField.appendChild(button);
	tailsField.appendChild(coin);
	document.body.appendChild(tailsField);

	button.onclick = (e) => {
		e.preventDefault();

		const random = Math.ceil(Math.random() * 2);

		let res = random === 1 ? 'Opeл' : 'Решка';

		console.log(random);

		coin.innerText = res;
	}
}

export default tails();