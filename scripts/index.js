const inputOnOff = document.getElementById('input-on-off');

const inputLink = document.getElementById('input-link');
const buttonLinkAdd = document.getElementById('button-link-add');
const listLinks = document.getElementById('list-links');

const inputRateMin = document.getElementById('input-rate-min');
const inputRatemax = document.getElementById('input-rate-max');
const buttonRateChange = document.getElementById('button-rate-change');

let quizletLinks = [];

function drawLinks(quizletLinks){
  if(!quizletLinks.length){
    listLinks.replaceChildren('It does not seem you have any added...');
    return;
  }

  listLinksChildren = [];

  quizletLinks.forEach((url, index) => {
    let button = document.createElement('button');
    button.innerHTML = '&#10006;';
    button.style.marginRight = '0.25rem';
    button.addEventListener('click', () => { removeLink(index);});

    let li = document.createElement('li');
    li.replaceChildren(button, url);

    listLinksChildren.push(li);
  });
  
  listLinks.replaceChildren(...listLinksChildren);
}

function addLink(url){
  quizletLinks.push(url);
  drawLinks(quizletLinks);
}

function removeLink(index){
  quizletLinks.splice(index, 1);
  drawLinks(quizletLinks);
}

function changeRateInterval(min, max){
  
}

drawLinks(quizletLinks);

inputOnOff.addEventListener('change', (e) => {
  if(e.currentTarget.checked){
    chrome.runtime.sendMessage({ greeting: 'quizon'}); 
  }else{
    chrome.runtime.sendMessage({ greeting: 'quizoff'});
  }
});

buttonLinkAdd.addEventListener('click', () => {
  if(inputLink.value){
    addLink(inputLink.value);
    inputLink.value = '';
  }
});

buttonRateChange.addEventListener('click', () => {
  if(inputRateMax.value && inputRateMax.value){
    changeRateInterval(inputRateMin.value, inputRateMax.value);
  }
});
