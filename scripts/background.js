const defaultSettings = {
  stateOnOff: false,
  quizletLinks: [],
  quizInterval: {min: 1, max: 2},
  quizLen: 5
};

function getRandomInt(min, max){
  return min + Math.floor(Math.random() * (max - min + 1));
}

function setQuizSettings(settings, updateAlarm){
  console.log(`setQuizSettings: ${updateAlarm}`);
  console.log(settings);
  chrome.storage.local.set(settings).then(() => {
    if(updateAlarm){
      if(settings.stateOnOff) setQuizAlarm();
      else removeQuizAlarm();
    }
  });
}

async function getQuizSettings(){
  return chrome.storage.local.get(defaultSettings);
}

function getSettings(keys){
  const defaults = Object.keys(defaultSettings)
    .filter(key => keys.includes(key))
    .reduce((obj, key) => {
      obj[key] = defaultSettings[key];
      return obj;
    }, {});
  return chrome.storage.local.get(defaults);
}

async function getSettingsValue(key){
  obj = await getSettings([key]);
  return obj[key];
}

function removeQuizAlarm(){
  return chrome.alarms.clear('popquiz');
}

async function setQuizAlarm(){
  await removeQuizAlarm();

  let interval = await getSettingsValue('quizInterval');
  let delay = getRandomInt(interval.min, interval.max);

  console.log(`setQuizAlarm delay: ${delay}`);

  return chrome.alarms.create('popquiz', { 
    delayInMinutes: delay
  });
}

function startQuiz(){
  chrome.windows.create({
    focused: true,
    url: ["/views/quiz.html"],
  });
}

function genQuestion(quizletLinks){
  
}

function getQuizQuestionList(){
  const settings = await getSettings(['quizLen', 'quizletLinks']);

  let questionList = [];
  for(let i = 0; i < settings.quizLen; i++) questionList.push(genQuestion());

  return questionList;
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
    case 'setQuizSettings':
      setQuizSettings(message.settings, message.updateAlarm);
    case 'getQuizSettings':
      getQuizSettings().then((settings) => {
        sendResponse(settings);
      });
      break;
    case 'getQuizQuestionList':
      getQuizQuestionList().then((questionList) => {
        sendResponse(questionList);
      });
  }
  return true;
});
