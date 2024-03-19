function setQuizTimer(){
  chrome.alarms.create('popquiz', { 
    delayInMinutes: 1
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
