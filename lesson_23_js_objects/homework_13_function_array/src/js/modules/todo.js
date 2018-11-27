const todo = () => {

	const addForm = document.forms['addForm'];

	if(!addForm) return;

	const appendChilds = (parent, ...childs) => {
		childs.forEach((child) => {
			parent.appendChild(child);
		})
	}

	const addItem = (text) => {
		const todoItem = document.createElement('div');
		todoItem.classList.add('form-check', 'todo-item');

		const inputSide = document.createElement('form');
		inputSide.classList.add('input-side');
		appendChilds(inputSide, ...addTodoFormElements(text));

		const buttonsSide = document.createElement('div');
		buttonsSide.classList.add('buttons-side');

		const editBtn = document.createElement('button');
		editBtn.classList.add('btn', 'btn-warning');
		editBtn.innerText = 'Edit';

		const deleteBtn = document.createElement('button');
		deleteBtn.classList.add('btn', 'btn-danger');
		deleteBtn.innerText = 'Delete';

		appendChilds(buttonsSide, editBtn, deleteBtn);

		appendChilds(todoItem, inputSide, buttonsSide);

		ActiveTodos.appendChild(todoItem);
	}

	const addEditElement = (text) => {
		const input = document.createElement('input');
		input.classList.add('input-edit');
		input.value = text;
		input.focus();
		return input;
	}

	const addTodoFormElements = (text) => {
		const checkbox = document.createElement('input');
		checkbox.setAttribute('type', 'checkbox');
		checkbox.classList.add('form-check-input');
		const id = `customCheck${Math.floor(Math.random()*1000000)}`;
		checkbox.id = id;

		const label = document.createElement('label');
		label.classList.add('form-check-label');
		label.setAttribute('for', id);
		label.innerText = text;

		return [checkbox, label]
	}

	const hideChildren = (parent) => {
		const children = parent.children;
		for(let i = 0; i < children.length; i++){
			parent.removeChild(children[i]);
			i--;
		}
	}

	addForm.addEventListener('submit', (e) => {
		e.preventDefault();

		let todotext = addForm.elements.addInput.value;

		if(!todotext) return;

		addItem(todotext);

		addForm.elements.addInput.value = '';
	});

	document.body.addEventListener('click', (e) => {
		const target = e.target;

		// Removing TODO item
		if(target.classList.contains('btn-danger')) {
			const thisTodoItem = target.parentElement.parentElement;
			thisTodoItem.parentElement.removeChild(thisTodoItem);
		};

		// Editing TODO item
		if(target.classList.contains('btn-warning')){
			target.setAttribute('disabled', 'disabled');
			const editValue = target.parentElement.previousElementSibling.lastElementChild.innerText;
			const inputSide = target.parentElement.previousElementSibling;
			hideChildren(inputSide);
			appendChilds(inputSide, addEditElement(editValue));

			inputSide.firstElementChild.select();

			inputSide.addEventListener('submit', (e) => {
				e.preventDefault();
				const newValue = inputSide.lastElementChild.value;
				inputSide.removeChild(inputSide.lastElementChild);
				appendChilds(inputSide, ...addTodoFormElements(newValue));
				target.removeAttribute('disabled');
			});
		};

		// Move to COMPLETE/ACTIVE section
		if(target.classList.contains('form-check-input')){
			const todoItem = target.parentElement.parentElement;
			if(target.checked){
				CompletedTodos.appendChild(todoItem);
				todoItem.classList.add('completed');
			} else {
				ActiveTodos.appendChild(todoItem);
				todoItem.classList.remove('completed');
			}
		}
	});

}

export default todo();