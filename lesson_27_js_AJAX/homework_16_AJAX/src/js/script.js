;(function(){
  'use strict';

  let xhr = new XMLHttpRequest()

  xhr.onreadystatechange = () => {

    if (xhr.readyState === 4) {
      document.getElementById('employeeList').innerHTML = xhr.responseText;
    }
  }

xhr.open('GET', 'employees.json');
xhr.send();
});





