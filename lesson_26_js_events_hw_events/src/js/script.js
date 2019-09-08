// ;(function(){
//   'use strict';

//   document.onkeydown = function(e) {
//       if (e.keyCode == 13) { // escape
//         cancel();
//         return false;
//       }

//       if ((e.ctrlKey && e.keyCode == 'E'.charCodeAt(0)) && !area.offsetHeight) {
//         edit();
//         console.log("Продолжаем!")
//         return false;
//       }

//       if ((e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)) && area.offsetHeight) {
//         save();
//         return false;
//       }
//   }

//   function cancel() {
//     area.style.display = 'none';
//     view.style.display = 'block';
//     view.value = view.innerHTML;
//   }

//   function edit() {
//     view.style.display = 'none';
//     area.value = view.innerHTML;
//     area.style.display = 'block';
//     area.focus();
//   }

//   function save() {
//     area.style.display = 'none';
//     view.innerHTML = area.value;
//     view.style.display = 'block';
//   }

//   // document.addEventListener("keydown", (event) => {
//   //   if (event.keyCode == 69) {
//   //     if (event.keyCode == 16)
//   //       console.log("Продолжаем!");
//   //   }
//   // })

//  /* document.onkeydown = function(e) {
//       if ((e.ctrlKey && e.keyCode == 'M'.charCodeAt(0)) && !area.offsetHeight) {
//         console.log("Продолжаем!")
//         return false;
//       }
//     }*/

//     });





