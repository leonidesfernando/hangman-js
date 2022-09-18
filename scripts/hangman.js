
//import localDataBase from './database.json'
//import {getDatabase as database } from './scripts/database.js'

//var database = require('getDatabase')

//console.log(JSON.stringify(localDataBase))

const data =  JSON.parse(getDatabaseNew())
const word = generateWord(data)
const TOTAL = 7
const LAST_IMAGE = 'img/7.png'

function start(){
    console.log('no start')
    console.log(word)

    generateTables(word)
    var input = document.getElementById('inputLetterOrWord')
    input.focus();
}

function restart(){
    location.reload()
}

function check(){

    const input = document.getElementById('inputLetterOrWord');
    const letter = input.value.trim().toLowerCase();
    var inputedLetters = document.getElementById('inputedLetters');

    if(inputedLetters.innerHTML != undefined && inputedLetters.innerHTML.lastIndexOf(letter.toUpperCase()) > -1){
        return;
    }
    
    checkLetterOrWord(inputedLetters, letter);
    input.focus()
    input.value = ''

    const hasChance = parseInt(getCurrentImageStatus()) < TOTAL
    if (!hasChance) {
        document.getElementById('sendData').style = 'display: none'
        document.getElementById('restart').style = ''
        youLose()
    }

    else if(ifWin()){
        document.getElementById('sendData').style = 'display: none'
        document.getElementById('restart').style = ''
        youWin()
    }
}

function checkLetterOrWord(inputedLetters, letter){
    let img = document.getElementById('playerStatus');
    let hasTheLetter = false;
    if (letter.length == 1 && !hasLetter(letter)) {
        console.log(getCurrentImageStatus());
        img.src = getNextImageName();
    } else if (letter.length > 1) {
        let size = letter.length;
        let matchAll = true;
        for (let i = 0; i < size; i++) {
            if (!hasLetter(letter.charAt(i))) {
                matchAll = false;
            }
        }

        if (!matchAll) {
            img.src = LAST_IMAGE;
        }

        hasTheLetter = matchAll;

    } else if (hasLetter(letter.toLowerCase())) {
        hasTheLetter = true;
    }
    chooseColor(hasTheLetter, inputedLetters, letter);
}

function chooseColor(hasTheLetter, inputedLetters, letter){
    let label = document.createElement('label')
    label.innerHTML = letter.toUpperCase()
    label.setAttribute('style', 'color:' + (hasTheLetter ? 'lightblue' : 'red'))
    inputedLetters.appendChild(label)
    inputedLetters.innerHTML = inputedLetters.innerHTML + ', '
}

function ifWin(){
    var filedOutAnyWord = true;
    for(var w in word){
        filedOutAnyWord = true;
        
        const lenByLang = parseInt(word[w].original.length)
        for(var i = 0; i < lenByLang; i++){
            if(getInputTableContent(word[w], i) == ''){
                filedOutAnyWord = false;
                break;
            }
        }
        if(filedOutAnyWord){
            break
        }
    }
    return filedOutAnyWord;
}

function youWin(){

    for(var w in word){
        const lengWord = parseInt(word[w].canonical.length)
        for(var i = 0; i < lengWord; i++){
            updateTableWithLetter(word[w], i)
        }
    }
    showFinalMessage('Parabéns!! Você conseguiu! Vamos mais uma rodada?', document.getElementById('resultWin'))
}

function youLose(){
    var words = `A palavra era: ${word[0].original} em ${word[0].lang}, ${word[1].original} em ${word[1].lang} e ${word[2].original} em ${word[2].lang}. `;
    showFinalMessage(words + 'Não foi dessa vez! Tente outra novamente, a prática te leva à perfeição!',
    	   document.getElementById('resultLose'))
}

function showFinalMessage(msg, result){
    var div  = document.createElement('div')
    div.setAttribute('style', 'margin: 10px')
    result.appendChild(div)
    div.innerHTML = msg;
    result.style=""
}

function generateWord(){
    //TODO: criar cookie com local data, hora  milisegundo e armezenar os indices gerados e desconsiderar esses indices para pegar uma nova palavra
    var len = data.words.length
    console.log('len: ' +len)
    var index = Math.floor(Math.random() * len);
    console.log('index: ' + index)
    return data.words[index].word
}

function hasLetter(letter){
    
    var hasAnyLetter = false

    for(var w in word){
        const lengWord = parseInt(word[w].canonical.length)
        for(var i = 0; i < lengWord; i++){
            var char = word[w].canonical.charAt(i)
            if(char == letter){
                updateTableWithLetter(word[w], i)
                hasAnyLetter = true
            }
        }
    }
    return hasAnyLetter
}

function getInputTableContent(wordLang, index){
    return document.getElementById(`${wordLang.lang}RowLetter${index}`).value
}

function updateTableWithLetter(wordLang, index){
    document.getElementById(`${wordLang.lang}RowLetter${index}`).value = wordLang.original.charAt(index).toUpperCase()
}

function generateTables(word){
    
    for(w in word){
        generateHints(word[w].lang, word[w].hint)
        generateTableByLanguage(word[w].lang, word[w].original)
    }
}

function generateHints(language, hint){

    const row = document.getElementById(`${language}Row`);
    const td = document.createElement('td')
    const img = document.createElement('img')
    img.innerText = hint
    img.setAttribute('src', 'img/hint-ideia.png')
    img.setAttribute('title', hint)
    td.appendChild(img)
    row.appendChild(td)
}

function generateTableByLanguage(language, orignalWord){
    let len = orignalWord.length

    const row = document.getElementById(`${language}Row`);
    for(var i = 0; i < len; i++){
        const td = document.createElement('td')
        
        const input = document.createElement('input')
        configureInput(input, language, i)
        td.appendChild(input)
        row.appendChild(td)
    }
}


function configureInput(input, language, index){
    input.setAttribute('id', `${language}RowLetter${index}`)
    input.setAttribute('size', 1)
    input.setAttribute('maxlength', 1)
    input.setAttribute('class', 'text-center')
    input.setAttribute('disabled',true)
    input.setAttribute('style', 'border-bottom: 4px solid; font-weight: bold;')
}

function getNextImageName(){
    var number = parseInt(getCurrentImageStatus())
    if(number < TOTAL){
        number++;
    }
    return `img/${number}.png`

}

function getCurrentImageStatus(){
    var img = document.getElementById('playerStatus')
    return img.src.substring(img.src.lastIndexOf('/')+1).split('.')[0];
}

//


function getDatabase() {

    return `{"words":[{"word":[{"original":"carne","canonical":"carne","hint":"NO_HINT_TOO_EASY","lang":"pt"},{"original":"meat","canonical":"meat","hint":"NO_HINT_TOO_EASY","lang":"us"},{"original":"mięso","canonical":"mieso","hint":"NO_HINT_TOO_EASY","lang":"pl"}]},{"word":[{"original":"pato","canonical":"pato","hint":"NO_HINT_TOO_EASY","lang":"pt"},{"original":"duck","canonical":"duck","hint":"NO_HINT_TOO_EASY","lang":"us"},{"original":"kaczka","canonical":"kaczka","hint":"NO_HINT_TOO_EASY","lang":"pl"}]}]}`;
    
    /*return `{
        "words":
        [
            {
                "word":[
                    {
                        "original": "carne",
                        "canonical": "carne",
                        "lang": "pt"
                    },
                    {
                        "original": "mięso",
                        "canonical": "mieso",
                        "lang": "pl"
                    },
                    {
                        "original": "meat",
                        "canonical": "meat",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "cebola",
                        "canonical": "cebola",
                        "lang": "pt"
                    },
                    {
                        "original": "cebula",
                        "canonical": "cebula",
                        "lang": "pl"
                    },
                    {
                        "original": "onion",
                        "canonical": "onion",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "moeda",
                        "canonical": "moeda",
                        "lang": "pt"
                    },
                    {
                        "original": "moneta",
                        "canonical": "moneta",
                        "lang": "pl"
                    },
                    {
                        "original": "coin",
                        "canonical": "coin",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "preto",
                        "canonical": "preto",
                        "lang": "pt"
                    },
                    {
                        "original": "czarny",
                        "canonical": "czarny",
                        "lang": "pl"
                    },
                    {
                        "original": "black",
                        "canonical": "black",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "salsinha",
                        "canonical": "salsinha",
                        "lang": "pt"
                    },
                    {
                        "original": "pietruszka",
                        "canonical": "pietruszka",
                        "lang": "pl"
                    },
                    {
                        "original": "parsley",
                        "canonical": "parsley",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "faca",
                        "canonical": "faca",
                        "lang": "pt"
                    },
                    {
                        "original": "nóż",
                        "canonical": "noz",
                        "lang": "pl"
                    },
                    {
                        "original": "knife",
                        "canonical": "knife",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "cenoura",
                        "canonical": "cenoura",
                        "lang": "pt"
                    },
                    {
                        "original": "marchew",
                        "canonical": "marchew",
                        "lang": "pl"
                    },
                    {
                        "original": "carrot",
                        "canonical": "carrot",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "grande",
                        "canonical": "grande",
                        "lang": "pt"
                    },
                    {
                        "original": "duże",
                        "canonical": "duze",
                        "lang": "pl"
                    },
                    {
                        "original": "big",
                        "canonical": "big",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "leão",
                        "canonical": "leao",
                        "lang": "pt"
                    },
                    {
                        "original": "lew",
                        "canonical": "lew",
                        "lang": "pl"
                    },
                    {
                        "original": "lion",
                        "canonical": "lion",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "cachorro",
                        "canonical": "cachorro",
                        "lang": "pt"
                    },
                    {
                        "original": "pies",
                        "canonical": "pies",
                        "lang": "pl"
                    },
                    {
                        "original": "dog",
                        "canonical": "dog",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "internet",
                        "canonical": "internet",
                        "lang": "pt"
                    },
                    {
                        "original": "internet",
                        "canonical": "internet",
                        "lang": "pl"
                    },
                    {
                        "original": "internet",
                        "canonical": "internet",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "pepino",
                        "canonical": "pepino",
                        "lang": "pt"
                    },
                    {
                        "original": "ogórek",
                        "canonical": "ogorek",
                        "lang": "pl"
                    },
                    {
                        "original": "cucumber",
                        "canonical": "cucumber",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "uva",
                        "canonical": "uva",
                        "lang": "pt"
                    },
                    {
                        "original": "winogrono",
                        "canonical": "winogrono",
                        "lang": "pl"
                    },
                    {
                        "original": "grape",
                        "canonical": "grape",
                        "lang": "us"
                    }
                ]
            },
            {
                "word":[
                    {
                        "original": "bandeira",
                        "canonical": "bandeira",
                        "lang": "pt"
                    },
                    {
                        "original": "flag",
                        "canonical": "flag",
                        "lang": "pl"
                    },
                    {
                        "original": "flaga",
                        "canonical": "flaga",
                        "lang": "us"
                    }
                ]
            }
        ]
    }`; */
}

function getDatabaseNew() {
    return `{"words":[{"word":[{"original":"carne","canonical":"carne","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"meat","canonical":"meat","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"mięso","canonical":"mieso","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"pato","canonical":"pato","hint":"É um animal","lang":"pt"},{"original":"duck","canonical":"duck","hint":"It\u0027s an animal","lang":"us"},{"original":"kaczka","canonical":"kaczka","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"maçã","canonical":"maca","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"apple","canonical":"apple","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"jabłko","canonical":"jablko","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"café","canonical":"cafe","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"coffee","canonical":"coffee","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"kawa","canonical":"kawa","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"cebola","canonical":"cebola","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"onion","canonical":"onion","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"cebula","canonical":"cebula","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"cenoura","canonical":"cenoura","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"carrot","canonical":"carrot","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"marchew","canonical":"marchew","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"computador","canonical":"computador","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"computer","canonical":"computer","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"komputer","canonical":"komputer","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"caneca","canonical":"caneca","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"mug","canonical":"mug","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"kubek","canonical":"kubek","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"animal","canonical":"animal","hint":"Essa não vai ter dica porque é muito fácil!","lang":"pt"},{"original":"animal","canonical":"animal","hint":"This one won\u0027t have a tip because it\u0027s very easy!","lang":"us"},{"original":"zwierzę","canonical":"zwierze","hint":"Ten nie będzie miał napiwku, bo to bardzo proste!","lang":"pl"}]},{"word":[{"original":"brinquedo","canonical":"brinquedo","hint":"É um brinquedo","lang":"pt"},{"original":"toy","canonical":"toy","hint":"It\u0027s a toy","lang":"us"},{"original":"zabawka","canonical":"zabawka","hint":"To jest zabawka","lang":"pl"}]},{"word":[{"original":"cadeira","canonical":"cadeira","hint":"É um móvel(mobilia)","lang":"pt"},{"original":"chair","canonical":"chair","hint":"It\u0027s a furniture","lang":"us"},{"original":"krzesło","canonical":"krzeslo","hint":"To jest meble","lang":"pl"}]},{"word":[{"original":"pão","canonical":"pao","hint":"É de comer","lang":"pt"},{"original":"bread","canonical":"bread","hint":"It\u0027s food","lang":"us"},{"original":"chleb","canonical":"chleb","hint":"To jest jedzenie","lang":"pl"}]},{"word":[{"original":"bola","canonical":"bola","hint":"É um brinquedo","lang":"pt"},{"original":"piłka","canonical":"pilka","hint":"It\u0027s a toy","lang":"us"},{"original":"ball","canonical":"ball","hint":"To jest zabawka","lang":"pl"}]},{"word":[{"original":"banana","canonical":"banana","hint":"É uma fruta","lang":"pt"},{"original":"banana","canonical":"banana","hint":"It\u0027s a fruit","lang":"us"},{"original":"banan","canonical":"banan","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"uva","canonical":"uva","hint":"É uma fruta","lang":"pt"},{"original":"grape","canonical":"grape","hint":"It\u0027s a fruit","lang":"us"},{"original":"winogrono","canonical":"winogrono","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"limão","canonical":"limao","hint":"É uma fruta","lang":"pt"},{"original":"lemom","canonical":"lemom","hint":"It\u0027s a fruit","lang":"us"},{"original":"cytryna","canonical":"cytryna","hint":"To jest owoce","lang":"pl"}]},{"word":[{"original":"cachorro","canonical":"cachorro","hint":"É um animal","lang":"pt"},{"original":"dog","canonical":"dog","hint":"It\u0027s an animal","lang":"us"},{"original":"pies","canonical":"pies","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"gato","canonical":"gato","hint":"É um animal","lang":"pt"},{"original":"cat","canonical":"cat","hint":"It\u0027s an animal","lang":"us"},{"original":"kot","canonical":"kot","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"cavalo","canonical":"cavalo","hint":"É um animal","lang":"pt"},{"original":"horse","canonical":"horse","hint":"It\u0027s an animal","lang":"us"},{"original":"koń","canonical":"kon","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"repolho","canonical":"repolho","hint":"É um vegetal","lang":"pt"},{"original":"cabage","canonical":"cabage","hint":"It\u0027s a vegetable","lang":"us"},{"original":"kapusta","canonical":"kapusta","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"salsinha","canonical":"salsinha","hint":"É um vegetal","lang":"pt"},{"original":"parsley","canonical":"parsley","hint":"It\u0027s a vegetable","lang":"us"},{"original":"pietruszka","canonical":"pietruszka","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"coentro","canonical":"coentro","hint":"É um vegetal","lang":"pt"},{"original":"cilantro","canonical":"cilantro","hint":"It\u0027s a vegetable","lang":"us"},{"original":"kolendra","canonical":"kolendra","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"pepino","canonical":"pepino","hint":"É um vegetal","lang":"pt"},{"original":"cucumber","canonical":"cucumber","hint":"It\u0027s a vegetable","lang":"us"},{"original":"ogórek","canonical":"ogorek","hint":"To jest warzywo","lang":"pl"}]},{"word":[{"original":"leão","canonical":"leao","hint":"É um animal","lang":"pt"},{"original":"lion","canonical":"lion","hint":"It\u0027s an animal","lang":"us"},{"original":"lew","canonical":"lew","hint":"To jest zwierzę","lang":"pl"}]},{"word":[{"original":"caderno","canonical":"caderno","hint":"Usado para estudar","lang":"pt"},{"original":"notebook","canonical":"notebook","hint":"Used to study","lang":"us"},{"original":"notes","canonical":"notes","hint":"Używany do nauki","lang":"pl"}]},{"word":[{"original":"borracha","canonical":"borracha","hint":"Usado para estudar","lang":"pt"},{"original":"rubber","canonical":"rubber","hint":"Used to study","lang":"us"},{"original":"gumka","canonical":"gumka","hint":"Używany do nauki","lang":"pl"}]}]}`;
}
