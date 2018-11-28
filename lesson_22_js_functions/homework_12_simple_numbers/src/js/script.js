;(function(){
	'use strict'
 

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

        h3.innerText = 'Введите два числа';
        h3.style.fontSize = '2em';
        h3.style.textAlign = 'center';
        h3.style.marginBottom = '1em';
        form.style.textAlign = 'center';
        form.style.margin = 'auto';
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

        res.innerText = 'Здесь будет результат!';

        form.appendChild(input_1);
        form.appendChild(input_2);
        form.appendChild(input_3);

        adder.appendChild(h3);
        adder.appendChild(form);
        adder.appendChild(res);
        document.body.appendChild(adder);

        form.onsubmit = (e) => {
            e.preventDefault();

            let number1 = input_1.value;
            let number2 = input_2.value;
            // let result

            /*if(!(isNumeric(number_1) && isNumeric(number_2))){
                res.innerText = 'Ошибка! Введенные значения должны быть цифрами!';
                return;
            }*/
            
            function simpleNumber (number1, number2) {
                
                bet: for (let j = number1; j < number2; j++) {
                    for (let i = 2; i < j; i++)
                        if (j % i == 0) {
                            continue bet;
                        }
                        
                        // result = simpleNumber(number1, number2);
                        return [j];
                      //  return j;
                       // alert(j);
                   }
               }
               res.innerText = simpleNumber(number1, number2);
                // res.innerText = result;
            }
        }

        add();
    /*const getSimpleNumber = () => {
    const field = document.createElement('div');
    field.style.border = '2px solid black';
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

getSimpleNumber();*/

 /*document.onload = () => {
    'use strict';*/

     /*   let number1 = prompt("Задайте начальное чило промежутка");
        if (!(isNumeric(number1))){
            prompt('Ошибка! Введенное значение должно быть цифрой!');
        }
        let number2 = prompt("Задайте конечное число промежутка");
        if (!(isNumeric(number2))){
            prompt('Ошибка! Введенное значение должно быть цифрой!');
        }*/

            // simpleNumber (5, 25);
           /* simpleNumber (8, 35);
            simpleNumber (10, 45);
            simpleNumber (11, 55);
            simpleNumber (2, 15);*/

    // (simpleNumber(10, 26));

})();