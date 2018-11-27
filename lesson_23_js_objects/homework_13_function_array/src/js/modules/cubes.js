const cubes = () => {
	const cubesField = document.createElement('div');
	cubesField.style.border = '2px solid white';
	cubesField.style.margin = '2em';
	cubesField.style.padding = '2em';
	cubesField.style.textAlign = 'center';

	const button = document.createElement('button');
	button.innerText = 'Play';
	button.style.fontSize = '2em';
	button.style.marginBottom = '1em';

	const cubes = document.createElement('div');
	const cube_1 = document.createElement('span');
	const cube_2 = document.createElement('span');

	cubes.appendChild(cube_1);
	cubes.appendChild(cube_2);

	cubes.style.color = 'black';
	cubes.style.fontSize = '2em';

	cube_1.style.display = 'inline-flex';
	cube_1.style.justifyContent = 'center';
	cube_1.style.alignItems = 'center';
	cube_1.style.width = '100px';
	cube_1.style.height = '100px';
	cube_1.style.background = 'white';
	cube_1.style.marginRight = '1em';

	cube_2.style.display = 'inline-flex';
	cube_2.style.justifyContent = 'center';
	cube_2.style.alignItems = 'center';
	cube_2.style.width = '100px';
	cube_2.style.height = '100px';
	cube_2.style.background = 'white';

	cube_1.innerText = '';
	cube_2.innerText = '';

	document.body.appendChild(cubesField);
	cubesField.appendChild(button);
	cubesField.appendChild(cubes);

	button.onclick = (e) => {
		e.preventDefault();

		const getRandom = () => {
			return Math.ceil(Math.random() * 6);
		}

		let value_1 = getRandom();
		let value_2 = getRandom();

		cube_1.innerText = value_1;
		cube_2.innerText = value_2;
	}
}

export default cubes();