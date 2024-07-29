const startDisplay = document.getElementById('start-display');
const endDisplay = document.getElementById('end-display');
const multiChoiceQuestion = document.getElementById('multi-choice-question');

let currentQ = 0;
let questions = [];

async function getQuestionList(){
  return chrome.runtime.sendMessage({ greeting: 'getQuizQuestionList'});
}

function displayEnd(){
  endDisplay.classList.remove('hidden');
}

function displayNextQuestion(){
  multiChoiceQuestion.classList.add('hidden');

  question = questions[currentQ];
  currentQ++;

  multiChoiceQuestion.getElementsByTagName('span')[0].textContent = currentQ.toString();
  multiChoiceQuestion.getElementsByTagName('p')[0].textContent = question.statement;

  ul = multiChoiceQuestion.getElementsByTagName('ul')[0];
  ul.innerHTML = '';
  for(const [key, value] of Object.entries(question.choices)){
    const input = document.createElement('input');
    input.name="multi-choice"
    input.type="radio";
    input.value = key;
    const label = document.createElement('label');
    label.textContent = `${key}. ${value}`;

    const li = document.createElement('li');
    li.replaceChildren(input, label);

    ul.appendChild(li);
  }

  button = multiChoiceQuestion.getElementsByTagName('button')[0];
  output = multiChoiceQuestion.getElementsByTagName('output')[0];
  
  button.textContent = 'Submit';
  output.textContent = '';

  button.onclick = () => {
    selected = document.querySelector('input[name="multi-choice"]:checked');
    if(selected){
      if(selected.value === question.correct){
        output.textContent = `${selected.value} is correct!`;
	if(currentQ < questions.length){
          output.textContent += ' You can now move to the next question.'
	  button.textContent = 'Next';
	  button.onclick = displayNextQuestion;
	}else{
          output.textContent += ' This was the last question.'
	  button.textContent = 'Finish';
	  button.onclick = () => {
            multiChoiceQuestion.classList.add('hidden');
	    displayEnd();
	  };
	}
      }else{
        output.textContent = `${selected.value} is incorrect, try again.`
      }
    }
  };

  multiChoiceQuestion.classList.remove('hidden');
}

function setupStart(){
  startDisplay.getElementsByTagName('span')[0].textContent = questions.length.toString();

  startDisplay.getElementsByTagName('button')[0].onclick = () => {
    startDisplay.classList.add('hidden');
    displayNextQuestion();
  };
}

async function init(){
  questions = await getQuestionList();

  setupStart();
}

init();
