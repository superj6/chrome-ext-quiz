const questionNum = document.getElementById('question-num');
const questionStatement = document.getElementById('question-statement');
const questionChoiceList = document.getElementById('question-choice-list');

let questions = [];

async function getQuestionList(){
  return chrome.runtime.sendMessage({ greeting: 'getQuizQuestionList'});
}

async function init(){
  questions = await getQuestionList();
  console.log(questions);
}

init();
