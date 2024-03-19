function getRandomInt(min, max){
  return min + Math.floor(Math.random() * (max - min + 1));
}

function setQuizInterval(interval){
  chrome.storage.local.set({
    quizInterval: interval
  });
}

async function getQuizInterval(){
  let interval = await chrome.storage.local.get('quizInterval').quizInterval;
  if(typeof interval === 'undefined'){
    interval = {min: 1, max: 2};
    setQuizInterval(interval);
  }
  return interval;
}

async function setQuizTimer(){
  let interval = await getQuizInterval();
  let delay = getRandomInt(interval.min, interval.max);

  console.log(`setQuizTimer delay: ${delay}`);

  chrome.alarms.create('popquiz', { 
    delayInMinutes: delay
  });
}

function removeQuizTimer(){
  chrome.alarms.clear('popquiz');
}

function startQuiz(){
  chrome.windows.create({
    focused: true,
    url: ["/views/index.html"],
  });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log(`Alarm: ${alarm.name}`)
  switch(alarm.name){
    case 'popquiz':
      startQuiz();
    break;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`Message: ${message.greeting}`)
  switch(message.greeting){
    case 'quizon':
      setQuizTimer();
      break;
    case 'quizoff':
      removeQuizTimer();
      break;
  }
});
