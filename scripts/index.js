const inputOnOff = document.getElementById('input-on-off');

const inputLink = document.getElementById('input-link');
const buttonLinkAdd = document.getElementById('button-link-add');
const listLinks = document.getElementById('list-links');
const iframeQuizlet = document.getElementById('iframe-quizlet');
const iframeQuizletWrapper = document.getElementById('iframe-quizlet-wrapper');

const spanRateMin = document.getElementById('span-rate-min');
const spanRateMax = document.getElementById('span-rate-max');
const inputRateMin = document.getElementById('input-rate-min');
const inputRateMax = document.getElementById('input-rate-max');
const buttonRateChange = document.getElementById('button-rate-change');

const spanQuizLen = document.getElementById('span-quizlen');
const inputQuizLen = document.getElementById('input-quizlen');
const buttonQuizLenChange = document.getElementById('button-quizlen-change');

let settings = {
  stateOnOff: undefined,
  quizletLinks: undefined,
  quizInterval: undefined,
  quizLen: undefined
};

function setLocalSettings(settings, updateAlarm){
  chrome.runtime.sendMessage({
    greeting: 'setQuizSettings',
    settings: settings,
    updateAlarm: updateAlarm
  });
}

async function getLocalSettings(){
  return chrome.runtime.sendMessage({ greeting: 'getQuizSettings'});
}

function drawStateOnOff(state){
  inputOnOff.checked = state;
}

function changeStateOnOff(state){
  settings.stateOnOff = state;
  setLocalSettings(settings, true);
}

function drawQuizletLinks(quizletLinks){
  if(!quizletLinks.length){
    listLinks.replaceChildren('It does not seem you have any added...');
    return;
  }

  listLinksChildren = [];

  quizletLinks.forEach((url, index) => {
    let button = document.createElement('button');
    button.innerHTML = '&#10006;';
    button.style.marginRight = '0.25rem';
    button.addEventListener('click', () => { removeQuizletLink(index);});

    let li = document.createElement('li');
    li.replaceChildren(button, url);

    listLinksChildren.push(li);
  });
  
  listLinks.replaceChildren(...listLinksChildren);
}

function addQuizletLink(url){
  iframeQuizlet.src = url;
  iframeQuizletWrapper.classList.remove('iframe-quizlet-wrapper--hidden');

  settings.quizletLinks.push(url);
  drawQuizletLinks(settings.quizletLinks);
  setLocalSettings(settings, false);

  setTimeout(() => {
    iframeQuizletWrapper.classList.add('iframe-quizlet-wrapper--hidden');
  }, 10000);
}

function removeQuizletLink(index){
  settings.quizletLinks.splice(index, 1);
  drawQuizletLinks(settings.quizletLinks);
  setLocalSettings(settings, false);
}

function drawRateInterval(interval){
  spanRateMin.textContent = interval.min;
  spanRateMax.textContent = interval.max;
}

function changeRateInterval(interval){
  if(interval.min > interval.max){
    return;
  }
  settings.quizInterval = interval;
  drawRateInterval(settings.quizInterval);
  setLocalSettings(settings, true);
}

function drawQuizLen(quizLen){
  spanQuizLen.textContent = quizLen;
}

function changeQuizLen(quizLen){
  settings.quizLen = quizLen;
  drawQuizLen(settings.quizLen);
  setLocalSettings(settings, false);
}

function drawSettings(settings){
  drawStateOnOff(settings.stateOnOff);
  drawQuizletLinks(settings.quizletLinks);
  drawRateInterval(settings.quizInterval);
  drawQuizLen(settings.quizLen);
}

async function init(){
  settings = await getLocalSettings();  
  drawSettings(settings);
}

init();

inputOnOff.addEventListener('change', (e) => {
  changeStateOnOff(e.currentTarget.checked);
});

buttonLinkAdd.addEventListener('click', () => {
  if(inputLink.value){
    addQuizletLink(inputLink.value);
    inputLink.value = '';
  }
});

buttonRateChange.addEventListener('click', () => {
  if(inputRateMin.value && inputRateMax.value){
    changeRateInterval({
      min: parseInt(inputRateMin.value), 
      max: parseInt(inputRateMax.value)
    });
    inputRateMin.value = '';
    inputRateMax.value = '';
  }
});

buttonQuizLenChange.addEventListener('click', () => {
  if(inputQuizLen.value){
    changeQuizLen(parseInt(inputQuizLen.value));
    inputQuizLen.value = '';
  }
});
