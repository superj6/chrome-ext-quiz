//dataScript = document.getElementById('__NEXT_DATA__');
//data = JSON.parse(dataScript.textContent);
//stateKey = JSON.parse(data.props.pageProps.dehydratedReduxStateKey)
//terms = stateKey.studyModesCommon.studiableData.studiableItems;

var cardSection = document.getElementsByClassName('SetPageTerms-termsList')[0];

function loadCards(){
  return new Promise((resolve, reject) => { 
    function loadCardsLoop(){
      let cardButton = cardSection.getElementsByTagName('button')[0];
      if(cardButton == null){
        resolve();
        return;
      }

      cardButton.click();
      setTimeout(loadCardsLoop, 1000);
    }
    loadCardsLoop();
  });
}

function getQAFromCards(){
  let cards = cardSection.getElementsByClassName('SetPageTerms-term');
  
  qlist = Array.from(cards).map((card) => {
    sides = card.querySelectorAll('[data-testid=set-page-card-side]');
    return {question: sides[0].textContent, answer: sides[1].textContent};
  });

  return qlist;
}

function sendQA(qlist){
  chrome.runtime.sendMessage({ 
    greeting: 'extractedQuizlet',
    url: window.location.href,
    qlist: qlist
  });
}

function processCards(){
  loadCards().then(getQAFromCards).then(sendQA);
}

processCards();
