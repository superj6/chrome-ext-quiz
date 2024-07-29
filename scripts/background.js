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

async function getQuizletQlists(){
  let res = await chrome.storage.local.get({quizletQlists: {}});
  return res.quizletQlists;
}

function setQuizletQlists(qlists){
  chrome.storage.local.set({quizletQlists: qlists}); 
}

function saveQuizletQA(url, qlist){
  getQuizletQlists().then((qlists) => {
    qlists[url] = qlist;
    setQuizletQlists(qlists);
  });
}

async function getActiveQlist(){
  let links = await getSettingsValue('quizletLinks');
  let qlists = await getQuizletQlists();
  
  let activeQlist = [].concat(...links.map((link) => qlists[link]));
  return activeQlist;
}

function startQuiz(){
  chrome.windows.create({
    focused: true,
    url: ["/views/quiz.html"],
  });

  setQuizAlarm();
}

function getRandomIndexes(len, indSz){
  let indexes = [];
  while(indexes.length < indSz && indexes.length < len){
    let x = getRandomInt(0, indSz - 1);
    if(indexes.includes(x)) continue;

    indexes.push(x);
  }
  return indexes;
}

function genQuestion(activeQlist){
  let question = {statement: 'Statement?', choices: {A: 'april', B: 'billy', C: 'cat', D: 'dan'}, correct: 'a'};
  
  let qaIndexes = getRandomIndexes(4, activeQlist.length);
  let choiceIndexes = getRandomIndexes(4, 4);

  let qas = qaIndexes.map((i) => activeQlist[i]);
  let choiceMap = choiceIndexes.map((i) => ['A', 'B', 'C', 'D'][i]);

  if(qas.length > 0){
    question.statement = qas[0].question;
    question.correct = choiceMap[0];
  }

  qas.forEach((qa, i) => {
    question.choices[choiceMap[i]] = qa.answer;
  });

  return question;
}

async function getQuizQuestionList(){
  const quizLen = await getSettingsValue('quizLen');
  const activeQlist = await getActiveQlist();
  
  let questionList = [];
  for(let i = 0; i < quizLen; i++) questionList.push(genQuestion(activeQlist));

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
      getQuizQuestionList().then(sendResponse);
      break;
    case 'extractedQuizlet':
      saveQuizletQA(message.url, message.qlist);
      break;
  }
  return true;
});
