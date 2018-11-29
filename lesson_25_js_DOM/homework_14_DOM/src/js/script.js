;(function(){
    'use strict';

    const playList = [
    {
        author: "led zeppelin",
        song: "stairway to heaven",
        duration: "2:03"
    },
    {
        author: "queen",
        song: "bohemian rhapsody",
        duration: "2:30"
    },
    {
        author: "lynyrd skynyrd",
        song: "free bird",
        duration: "1:56"
    },
    {
        author: "deep purple",
        song: "smoke on the water",
        duration: "3:03"
    },
    {
        author: "jimi hendrix",
        song: "all along the watchtower",
        duration: "2:53"
    },
    {
        author: "AC/DC",
        song: "back in black",
        duration: "2:43"
    },
    {
        author: "queen",
        song: "we will rock you",
        duration: "2:13"            
    },
    {
        author: "metallica",
        song: "enter sandman",
        duration: "3:03"            
    }
    ];

    const body = document.body;
    document.body.style.background = 'grey';
    const container = document.createElement('div');
    const div = document.createElement('div');
    const h3 = document.createElement('h3');
    const ul = document.createElement('ul');
   // const li;

   h3.innerText = 'Playlist';

   body.style.fontFamily = 'Roboto, sans-serif';
   body.style.background = '#003056 url(../img/816831.jpg) 50%/cover';
   body.style.color = '#574d72';

   container.style.padding = '50px 20px';
   container.style.maxWidth = '1200px';
   container.style.margin = '0 auto';
   div.style.maxWidth = '400px';
   div.style.borderRadius = '20px';
   div.style.boxShadow = '1px 0 5px rgba(0, 0, 0, 0.4)';
   div.style.background = '#fff';
   div.style.padding = '30px 20px';
   div.style.margin = '0 auto';

   h3.style.fontWeight = '500';
   h3.style.textAlign = 'center';
   h3.style.margin = '0 0 25px';
   h3.style.fontSize = '1.17em';

   ul.style.listStyle = 'none';
   ul.style.padding = '0';
   ul.style.margin = '0';


   body.appendChild(container);
   container.appendChild(div);
   div.appendChild(h3);
   div.appendChild(ul);

   for (let i = 0; i < 8; i ++) {
    const li = document.createElement('li');
    const divLiTop = document.createElement('div');
    const spanDuration = document.createElement('span');
    const spanAuthor = document.createElement('span');
    const song = document.createElement('div');
    const img = document.createElement('img');
    const styleElem = document.createElement('style');
    img.src = 'img/heart1.svg'

    li.style.borderTop = '1px solid #e4e2e2';
    li.style.paddingTop = '10px';
    li.style.marginTop = '10px';
    divLiTop.style.fontSize = '80%';
    divLiTop.style.marginBottom = '5px';
    divLiTop.style.color = '#a4a3a9';
    spanDuration.style.paddingRight = '10px';
    spanDuration.style.marginRight = '8px';
    spanDuration.style.borderRight = '1px solid rgba(164, 163, 169, 0.6)';
    spanAuthor.style.textTransform = 'capitalize';
    // spanAuthor:firstLetter.style.textTransform = 'uppercase';
    song.style.fontWeight = '500';

    img.style.width = '20px';
    img.style.height = '20px'
    img.style.float = 'right';
    img.style.marginTop = '10px';
    img.style.cursor = 'pointer';
    img.style.fill = '#ed5e75';

    ul.appendChild(li);
    li.appendChild(img);
    li.appendChild(divLiTop);
    li.appendChild(song);
    divLiTop.appendChild(spanDuration);
    divLiTop.appendChild(spanAuthor);
    spanAuthor.appendChild(styleElem);

    song.innerText = playList[i].song;
    spanDuration.innerText = playList[i].duration;
    spanAuthor.innerText = playList[i].author;
   // spanAuthor.innerHTML = "spanAuthor:first-letter {text-transform: uppercase;}"
   styleElem.innerHTML = "spanAuthor:firstLetter {textTransform: uppercase;}";

} 
    /*var styleElem = document.head.appendChild(document.createElement("style"));

styleElem.innerHTML = "#theDiv:before {background: black;}";*/
     
      /* display: inline-block;
    padding-right: 10px;
    margin-right: 6px;
    border-right: 1px solid rgba(164, 163, 169, 0.6);*/
})();
