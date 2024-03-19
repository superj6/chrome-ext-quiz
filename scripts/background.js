const defaultSettings = {
  stateOnOff: false,
  quizletLinks: [],
  quizInterval: {min: 1, max: 2},
  quizLen: 5
};

function getRandomInt(min, max){
  return min + Math.floor(Math.random() * (max - min + 1));
}

async function getSettings(keys){
  const defaults = Object.keys(defaultSettings)
    .filter(key => keys.includes(key))
    .reduce((obj, key) => {
      obj[key] = defaultSettings[key];
      return obj;
    }, {});
  return await chrome.storage.local.get(defaults);
}

async function getSettingsValue(key){
  obj = await getSettings([key]);
  return obj[key];
}

async function setQuizTimer(){
  let interval = await getSettingsValue('quizInterval');
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
  console.log(`Alarm: ${alarm.name}`);
  switch(alarm.name){
    case 'popquiz':
      startQuiz();
    break;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`Message: ${message.greeting}`);
  switch(message.greeting){
    case 'quizOn':
      setQuizTimer();
      break;
    case 'quizOff':
      removeQuizTimer();
      break;
    case 'getQuizSettings':
      chrome.storage.local.get(defaultSettings).then((settings) => {
        sendResponse(settings);
      });
      break;
  }
  return true;
});
