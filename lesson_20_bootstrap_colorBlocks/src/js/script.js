// let userName = prompt('What is your name?');


// console.log(`Hello, ${userName}`);

// console.log('Hello, ' + userName);

// const num1 = 6;
// const num2 = 12;

// if(num1 > num2) {
// 	console.log('part 1');
// } else if (num1 === num2) {
// 	console.log('part 2');
// } else {
// 	console.log('part 3')
// }

// switch 
// loop

// const age = prompt('How old are you?');

// const a = age >= 18 ? true : false

// let b;

// const f = function(a, b) => {
	
// }

// это тернарное выражение

// const arr = [];

// for (let i = 1; i <= 100; i++) {
// 	arr.push(String(i));
// }

// let i = 1;
// while(i<=100){
// 	arr.push(String(i));
// 	i++;
// }

// console.log(arr);

// let newArr = [];

// arr.forEach(el, idx, arr) => {
//    if (idx >= arr.length - 11){
//    newArr.push(el);
//    }
//   };
  
//  console.log (newArr); 

let random;

do {
	random = Math.floor((Math.random()*10) +50);
} while(random === 3);

console.log('Cheers!!!');