/* const min = (a, b) => {
    if (a <= b) {
        return a;
    } else {
        return b;
    }
}*/
    // return a <= b ? a : b;
    /*const needHugeNumber = () => {
        let number = 0;

        do {
            number = prompt('Type huge number, please!');
        } while (number && number <= 100);

        alert ('Thank you!')
    }

    needHugeNumber();*/

   /* var salaries = {
        "Вася": 100,
        "Петя": 200,
        "Даша": 300,
        "Вова": 300
    };*/

 /*   const getSalariesSum = (obj) => {
        for(let key in obj) {
            console.log(obj[key]);
        }
    }

    getSalariesSum(salaries);*/

    /*const getSalariesSum = (obj) => {
        
        let acc = 0;

        for(let key in obj) {
            acc += obj[key];
        }
        return acc
    }*/
/*
    const getReachest = (obj) => {
        let max = 0;
        
        for (let key in obj) {
           if (max <= obj[key]) {
            max = obj[key];
        }
    }

    let reachest = [];

    for (let key in obj) {
       if (max === obj[key]) {
        reachest.push(key);
    }
}
return reachest.length ? reachest.join(', ') : "Нет сотрудников";
}

console.log(getReachest(salaries));

const a = {};

console.log(getReachest(a))*/

/*const min = (a, b) => {
    // if(a <= b ){ 
    //     return a;
    // } else {
    //     return b;
    // }

    return a <= b ? a : b;
}; 

console.log(min(1, 1));

console.log(min(2, 3));

console.log(min(5, 4));

const needHugeNumber = () => {
    let number = 0;

    do {
        number = prompt('Type huge number, please!');
    } while(number && number <= 100);

    alert('Thank you!');
}

needHugeNumber();



var salaries = {
    "Вася": 100,
    "Петя": 300,
    "Даша": 250,
    "Вова": 300
};


const getSalariesSum = (obj) => {

    let acc = 0;

    for(let key in obj){
        acc += obj[key];
    }

    return acc;

}

const getReachest = (obj) => {
    let max = 0;

    for(let key in obj){
        if(max <= obj[key]){
            max = obj[key];
        }
    }

    let reachestNames = [];
    let reachestEmpls = {};

    for(let key in obj){
        if(obj[key] === max) {
            reachestNames.push(key);
            reachestEmpls[key] = obj[key];
        }
    }

    console.log(reachestEmpls);

    return reachestNames.length ? reachestNames.join(', ') : 'Hет сотрудников';
}

console.log(getReachest(salaries));

const a = {};

console.log(getReachest(a));
*/

/*const wrapper = document.createElement('div');
wrapper.classList.add('test-item');

const question = document.createElement('span');
wrapper.classList.add('test-item');
rootElement.appendChild(wrapper);*/

// };