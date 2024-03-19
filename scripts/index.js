const inputOnOff = document.getElementById('input-on-off');

const inputLink = document.getElementById('input-link');
const buttonLinkAdd = document.getElementById('button-link-add');
const listLinks = document.getElementById('list-links');

const spanRateMin = document.getElementById('span-rate-min');
const spanRateMax = document.getElementById('span-rate-max');
const inputRateMin = document.getElementById('input-rate-min');
const inputRatemax = document.getElementById('input-rate-max');
const buttonRateChange = document.getElementById('button-rate-change');

const spanQuizLen = document.getElementById('span-quizlen');

let settings;

function drawStateOnOff(state){
  inputOnOff.checked = state;
}

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
  drawLinks(settings.quizletLinks);
}

function removeLink(index){
  quizletLinks.splice(index, 1);
  drawLinks(settings.quizletLinks);
}

function drawInterval(interval){
  spanRateMin.textContent = interval.min;
  spanRateMax.textContent = interval.max;
}

function changeRateInterval(interval){
  settings.interval = interval;
}

function drawLen(quizLen){
  spanQuizLen.textContent = quizLen;
}

function drawSettings(settings){
  drawStateOnOff(settings.stateOnOff);
  drawLinks(settings.quizletLinks);
  drawInterval(settings.quizInterval);
  drawLen(settings.quizLen);
}

async function init(){
  settings = await chrome.runtime.sendMessage({ greeting: 'getQuizSettings'});  
  drawSettings(settings);
}

init();

inputOnOff.addEventListener('change', (e) => {
  if(e.currentTarget.checked){
    chrome.runtime.sendMessage({ greeting: 'quizOn'}); 
  }else{
    chrome.runtime.sendMessage({ greeting: 'quizOff'});
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
    changeRateInterval({min: inputRateMin.value, max: inputRateMax.value});
  }
});
