const data =  JSON.parse(getDatabase());
const word = generateWord();
const TOTAL = 7;
const LAST_IMAGE = "img/f7.png";
const EMPTY_VALUE = " ";

//TODO: https://www.w3schools.com/howto/howto_js_countdown.asp

function start(){
    //console.log('no start: ', word);

    generateWordList();
    setFocus();
}

function setFocus(){
    const input = document.getElementById('inputLetterOrWord');
    input.focus();
}

function restart(){
    location.reload()
}

function getChoosedLang(){
    return document.querySelector('input[name="langOptions"]:checked').attributes["id"].value;
}

function check(){

    const input = document.getElementById('inputLetterOrWord');
    const letter = input.value.trim().toLowerCase();
    const inputedLetters = document.getElementById('inputedLetters');
    

    let myTimeout;
    if(inputedLetters.innerHTML != undefined && inputedLetters.innerHTML.lastIndexOf(letter.toUpperCase()) > -1){
        if(letter.trim().length > 0){
            const choosedLang = getChoosedLang();
            myTimeout = displayLetterAlreadyInformedMessage(choosedLang, letter);
            input.value = "";
        }
        return;
    }
    
    if(myTimeout != undefined){
        clearTimeout(myTimeout);
    }

    disableHowToFinalizeTheGame();
    checkLetterOrWord(inputedLetters, letter);
    input.focus();
    input.value = '';

    checkIfWinOrLose();
}


function hideLetterAlreadyDisplayed() {
    document.getElementById("letterAlreadyInformedDiv").style.display = "none";
}


function displayLetterAlreadyInformedMessage(choosedLang, letter) {

    const langManager = new LanguageManager();
    
    const myTimeout = setTimeout(hideLetterAlreadyDisplayed, 4000);
    document.getElementById("letterAlreadyInformedDiv").style.display = "block";
    document.getElementById("letterAlreadyInformedText").innerHTML = langManager.getLetterAlreadyInformed().replace("#letter#", letter.toUpperCase());

    return myTimeout;
}


function disableHowToFinalizeTheGame(){
    document.getElementById("allWords").disabled = true;
}

function checkIfWinOrLose(){
    const allWords = document.getElementById('allWords');
    const hasChance = parseInt(getCurrentImageStatus()) < TOTAL;
    if(allWords.checked){
        checkWinOrLoseWithAllWordsFilledOut(hasChance);
    }else{
        checkWinOrLoseOnlyOneWordIsEnough(hasChance);
    }
}

function checkWinOrLoseWithAllWordsFilledOut(hasChance){
    if(!hasChance){
        hideInputAndDisplayRestart();
        youLose();
    }
    else if(ifWinWithAllWords()){
        hideInputAndDisplayRestart();
        youWin();
    }
}

function ifWinWithAllWords(){
    for(let w in word){
        const lenByLang = parseInt(word[w].original.length)
        for(let i = 0; i < lenByLang; i++){
            if(getInputTableContent(word[w], i) == ''){
                return false;
            }
        }
    }
    return true;
}

function hideInputAndDisplayRestart(){
    document.getElementById('sendData').style = 'display: none';
    document.getElementById('btnNew').style = 'display: none';
    document.getElementById('btnSend').style = 'display: none';
    document.getElementById('restart').style = '';
}

function checkWinOrLoseOnlyOneWordIsEnough(hasChance){
    
    if (!hasChance) {
        hideInputAndDisplayRestart();
        youLose();
    }

    else if (ifWin()) {
        hideInputAndDisplayRestart();
        youWin();
    }
}

function checkLetterOrWord(inputedLetters, letter){
    let img = document.getElementById('playerStatus');
    let hasTheLetter = false;
    if (letter.length == 1 && !hasLetter(letter)) {
        //console.log(getCurrentImageStatus());
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
    let label = document.createElement('label');
    label.innerHTML = letter.toUpperCase();
    label.setAttribute('style', 'color:' + (hasTheLetter ? 'lightblue' : 'red'));
    inputedLetters.appendChild(label)
    inputedLetters.innerHTML = inputedLetters.innerHTML + ', ';
}

function ifWin(){
    let filedOutAnyWord = true;
    for(let w in word){
        filedOutAnyWord = true;
        
        const lenByLang = parseInt(word[w].original.length)
        for(let i = 0; i < lenByLang; i++){
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

    for(let w in word){
        const lengWord = parseInt(word[w].canonical.length)
        for(let i = 0; i < lengWord; i++){
            updateTableWithLetter(word[w], i)
        }
    }
    //let winMessage = `Parabéns!! Você conseguiu! Vamos mais uma rodada?`;
    //FIXME: put this as a attribute of HangmanGame class
    const langManager = new LanguageManager();
    showFinalMessage(langManager.getWinMessage(), document.getElementById('resultWin'))
}

function youLose(){

    const langManager = new LanguageManager();
    const theWord = langManager.getWordWas();

    let hint = `<label>${theWord}</label> <ul>`;
    
    for (let w in word) {
        hint += `<li><img class='icon-flag-img' src='${getImageByLanguage(word[w].lang)}'/>: ${word[w].original}</li>`;
    }
    hint += '</ul>';
    //document.getElementById('resultLose').style = "";
    showFinalMessage(hint + `<label class="fw-bold white-space: nowrap; overflow: hidden;text-overflow: ellipsis;">${langManager.getDefeatMessage()}</label>`,
        document.getElementById('resultLose'));
}

function showFinalMessage(msg, result){
    const div  = document.createElement("div");
    div.setAttribute("style", "margin: 10px");
    div.setAttribute("class", "row");
    //const img = document.createElement("img");
    //img.setAttribute("src", "img/minion-win.gif");
    result.appendChild(div);
    //result.appendChild(img);
    div.innerHTML = msg;
    result.style=""
}

function generateWord(){
    //TODO: criar cookie com local data, hora  milisegundo e armezenar os indices gerados e desconsiderar esses indices para pegar uma nova palavra
    const len = data.words.length
    //console.log('len:', len)
    const index = (Math.floor(new Date().getTime()*Math.random())%(len)); //Math.floor(Math.random() * len);
    //console.log('index:', index)
    return data.words[index].word
}

function hasLetter(letter){
    
    let hasAnyLetter = false

    for(let w in word){
        const lengWord = parseInt(word[w].canonical.length)
        for(let i = 0; i < lengWord; i++){
            const char = word[w].canonical.charAt(i)
            if(char == letter){
                updateTableWithLetter(word[w], i)
                hasAnyLetter = true
            }
        }
    }
    return hasAnyLetter
}

function getInputTableContent(wordLang, index){
    return document.getElementById(`${wordLang.lang}RowLetter${index}`).innerHTML;
}

function updateLettersWithLetter(wordLang, index) {
    const item = document.getElementById(`${wordLang.lang}RowLetter${index}`);
    item.innerHTML = wordLang.original.charAt(index).toUpperCase();
    item.style['background'] = 'lightcyan';
}

function updateTableWithLetter(wordLang, index){
    const item = document.getElementById(`${wordLang.lang}RowLetter${index}`);
    item.innerHTML = wordLang.original.charAt(index).toUpperCase();
    //item.value = wordLang.original.charAt(index).toUpperCase();
    item.style['background'] = 'lightcyan';
}

function generateWordList(){
    for(let w in word){
        generateWordByLanguage(word[w].lang, word[w].original);
    }
    generateHints();
}

//@deprecated
function generateTables(word){
    
    const colspan = getSizeLargestWord(word)
    for(let w in word){
        generateTableByLanguage(word[w].lang, word[w].original, colspan);
    }
    generateHints();
}

//@deprecated
function getSizeLargestWord(word){
    let smallest = 0;
    let biggest = 0;
    for (let w in word) {
        if (biggest < word[w].canonical.length){
            biggest = word[w].canonical.length;
        }
        if (smallest > word[w].canonical.length){
            smallest = word[w].canonical.length;
        }
    }
    return biggest - smallest;
}

function generateHints() {
    let hint = '<ul>';
    const img = document.getElementById('hint');
    for (const w in word) {
        hint += `<li><img class='icon-flag-img' src='${getImageByLanguage(word[w].lang)}'/>: ${word[w].hint}</li>`;
    }
    hint += '</ul>';

    const langManager = new LanguageManager();

    const closeMessage = langManager.getCloseHintMessage()
    const div = `<div><em><small>${closeMessage}</small></em></div>`

    hint += div;
    img.setAttribute('data-bs-content', hint);

}


function getImageByLanguage(lang){
    switch(lang){
        case 'pt':
            return 'img/brazil.png';
        case 'pl':
            return 'img/poland.png';
        case 'us':
            return 'img/usa.png'
    }
}


function generateWordByLanguage(language, originalWord){
    let len = originalWord.length;

    const divRow = document.getElementById(`${language}Row`);
    for (let i = 0; i < len; i++) {
        const element = getInputCharacterType(originalWord.charAt(i), language, i);
        divRow.appendChild(element);
    }
}

function getInputCharacterType(char, language, index){
    let element;
    element = document.createElement("label");
    if (char == " " || char == "-") {
        configureSpaceOrHifen(element, language, index, char);
    }else{
        configureLetter(element, language, index);
    }
    return element;
}

function generateTableByLanguage(language, orignalWord, colspan){
    let len = orignalWord.length

    const row = document.getElementById(`${language}Row`);
    let td;
    for(let i = 0; i < len; i++){
        td = document.createElement('td');
        
        const input = document.createElement(orignalWord.charAt(i) == " " ? "span" : "input");
        configureInput(input, language, i);
        td.appendChild(input);
        row.appendChild(td);
    }
    td.setAttribute('colspan', colspan);
}

function configureSpaceOrHifen(letter, language, index, spaceOrHifen){
    letter.setAttribute("id", `${language}RowLetter${index}`);
    let color = "gray";
    if(spaceOrHifen == " "){
        color = "white";
    }
    letter.setAttribute("style", `width:3%;margin-right: 1.3%;text-align:center;border-bottom: 2px solid white;color:${color}`);
    letter.innerHTML = `${spaceOrHifen}`;
}

function configureLetter(letter, language, index){
    letter.setAttribute("id", `${language}RowLetter${index}`);
    letter.setAttribute("style", "width:5%; border-bottom: 2px solid; font-weight: bold;margin-right: .88%;");
    letter.setAttribute('class', 'text-center');
    letter.innerHTML = "";
}

function configureInput(input, language, index){
    input.setAttribute('id', `${language}RowLetter${index}`);
    input.setAttribute('size', 1);
    input.setAttribute('maxlength', 1);
    input.setAttribute('class', 'text-center form-control-sm');
    input.setAttribute('disabled',true);
    input.setAttribute('style', 'border-bottom: 4px solid; font-weight: bold;');
}

function getNextImageName(){
    let number = parseInt(getCurrentImageStatus());
    if(number < TOTAL){
        number++;
    }
    return `img/f${number}.png`

}

function getCurrentImageStatus(){
    const img = document.getElementById('playerStatus')
    return img.src.substring(img.src.lastIndexOf('/')+2).split('.')[0];
}

 