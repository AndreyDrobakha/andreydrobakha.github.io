/*const numbers = alert ('Введите промежуток чисел');
    const numbers1 = prompt ('Введите начальное целое число промежутка больше единицы');
    numbers1 === number1;
    const numbers2 = prompt ('Введите конечное число промежутка');
    numbers2 === number2;*/

    /*const title = document.createElement('h1');
    title.classList.add('title');
    title.id = "title";
    title.style.fontSize = "10rem";

    document.body.appendChild(title);
    title.innerText = "dfdf";*/

    /*let ourPlanet = 'Earth';
    let clientName = 'Petya';

    let userName = prompt('What is your name?')
    console.log(userName);*/
/*
    const form = document.createElement('form');
    form.setAttribute('name', 'myForm');

    const input_1 = document.createElement('input');

    input_1.setAttribute('type', 'text');
    input_1.setAttribute('name', 'inputFirst');
    input_1.setAttribute('placeholder', 'enter first number');
    input_1.classList.add('text-input');

    const input_2 = document.createElement('input');

    input_2.setAttribute('type', 'text');
    input_2.setAttribute('name', 'inputSecond');
    input_2.setAttribute('placeholder', 'enter second number');
    input_2.classList.add('text-input');

    const input_3 = document.createElement('input');

    input_3.setAttribute('type', 'submit');
    input_3.setAttribute('value', 'Add');

    // const button = document.createElement('input');
    // button.setAttribute('type', 'submit');
    // button.setAttribute('name', 'submit');
    // button.setAttribute('value', 'Push');


    form.appendChild(input_1);
    form.appendChild(input_2);
    form.appendChild(input_3);
    
    

    const result = document.createElement('p');
    let resultValue = 'The result will be here';
    result.innerText = resultValue;

    document.body.appendChild(form);
    document.body.appendChild(result);

    const rootElement = document.createElement('root')

    /*rootElement.appendChild(form);
    rootElement.appendChild(result);*/

   /* form.addEventListener('submit', (e)=> {
        e.preventDefault(); 
        const value_1 = document.forms['myForm'].elements.inputFirst.value;
        const value_2 = document.forms['myForm'].elements.inputSecond.value;

        // const sum = Number(value_1) + Number(value_2);
        const sum = +value_1 + +value_2;

        result.innerText = sum; 

         const rootElement = document.getElementById('root');

    const form = document.createElement('form');
    form.setAttribute('name', 'myForm');

    const input_1 = document.createElement('input');

    input_1.setAttribute('type', 'text');
    input_1.setAttribute('name', 'inputFirst');
    input_1.setAttribute('placeholder', 'enter first number');

    const input_2 = document.createElement('input');

    input_2.setAttribute('type', 'text');
    input_2.setAttribute('name', 'inputSecond');
    input_2.setAttribute('placeholder', 'enter second number');

    const input_3 = document.createElement('input');

    input_3.setAttribute('type', 'submit');
    input_3.setAttribute('value', 'Add');

    form.appendChild(input_1);
    form.appendChild(input_2);
    form.appendChild(input_3);

    const result = document.createElement('p');
    let resultValue = 'The result will be here';
    result.innerText = resultValue;

    rootElement.appendChild(form);
    rootElement.appendChild(result);

    const isNumeric = (num) => {
        return !isNaN(parseFloat(num) && isFinite(num));
    }


    form.addEventListener('submit', (event)=> { 
        event.preventDefault(); // cancel default action

        const value_1 = document.forms['myForm'].elements.inputFirst.value;
        const value_2 = document.forms['myForm'].elements.inputSecond.value;

        let sum;

        if(!(isNumeric(value_1) && isNumeric(value_2))){
            sum = 'Something is going wrong';
        } else {
            // const sum = Number(value_1) + Number(value_2);

            sum = +value_1 + +value_2; // сокращенная запись
        }



        result.innerText = sum;
})
})*/
    // form.appendChild(button);
    /**/


   /* const result = document.createElement('p');
    document.body.appendChild(result);
    */
 //    let userName = '';*/

 //    form.addEventListener('submit', (event) => {
 //        event.preventDefault();
 //        userName = document.forms['myForm'].elements.textInput.value;
 //        res*/ult.innerText = userName;
 //    });

/* const random = Math.floor(Math.random() * 10);
console.log(random);*/

 /*Math.floor()
 Math.floor()
 Math.round() - округление как в математике*/

 /*let random = 0;

 do {
    random = Math.floor(Math.random() * 11);        
 } while (random <= 5);

 console.log(random);*/

 /*const leftCube = document.createElement('div');
 const rightCube = document.createElement('div');

 leftCube.classList.add('cube');
 rightCube.classList.add('cube');

 rightCube.innerText = '1';
 leftCube.innerText = '1';

 const coin = document.createElement('div');
 coin.classList.add('coin');

 rootElement.appendChild(playButton);
 wrapper.appendChild(leftCube);
 wrapper.appendChild(rightCube);

 rootElement.appendChild(wrapper);
 rootElement.appendChild(coin);



 playButton.addEventListener('click', () => {
    const getRandom = (limit) => {
        return Math.ceil(Math.random() * (limit));
    }
    const random_1 = getRandom(6);
    const random_2 = getRandom(6);

    leftCube.innerText = random_2;
    rightCube.innerText = random_1;

    const getCoinRandom = () => {
        return Math.floor(Math.random() * 2);
    }

    let coinText = getCoinRandom() ? 'O' : 'R';



    coin.innerText = coinText;*/

    /*let userAnswer = prompt('Каково «официальное» название JavaScript?');

    const ourAnswer = userAnswer.toLowerCase() === 'ECMAScript'.toLowerCase() ? 'Верно!' : 'Не знаете? «ECMAScript»!';

    const div = document.createElement('div');
    div.innerText = ourAnswer;

    document.body.appendChild(div);

    let result;

    const a = 2;
    const b = 2;*/

    /*if (a + b < 4) {  
        result = 'Мало';
    } else {  
        result = 'Много';
    }

    result = a + b < 4 ? 'Мало' : a + b === 4 ? 'В самый раз' : 'Много';*/

    /*const ucFirst = (str) => {
    if(!str.length) return '';
    let newStr = str.charAt(0).toUpperCase();
    for(let i = 1; i < str.length; i++){
        newStr += str[i];
    }
    return newStr;
}

console.log(ucFirst("вася") );
console.log(ucFirst(""));
*/
/*}*/