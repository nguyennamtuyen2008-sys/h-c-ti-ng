let vocab = [];
let remainWords = [];
let current = null;
let currentPart = 1;
let isLoading = false;

let correct = 0;
let wrong = 0;
let total = 0;

// DOM
const lesson = document.getElementById("lesson");
const word = document.getElementById("word");

const backWord = document.getElementById("backWord");
const backPinyin = document.getElementById("backPinyin");
const backMeaning = document.getElementById("backMeaning");

const answer = document.getElementById("answer");
const result = document.getElementById("result");
const card = document.getElementById("card");
const lessonSelect = document.getElementById("lessonSelect");

const correctText = document.getElementById("correct");
const wrongText = document.getElementById("wrong");
const remainText = document.getElementById("remain");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const part1Btn = document.getElementById("part1Btn");
const part2Btn = document.getElementById("part2Btn");
const partTitle = document.getElementById("partTitle");
const partStatus = document.getElementById("partStatus");

// =====================
// Khởi động
// =====================
loadPart(1);

// =====================
// Chuyển Phần 1 / Phần 2
// =====================
function loadPart(part){

    if(isLoading) return;

    currentPart = part;
    isLoading = true;

    part1Btn.classList.toggle("active", part === 1);
    part2Btn.classList.toggle("active", part === 2);

    partTitle.textContent = part === 1 ? "📕 Phần 1" : "📗 Phần 2";
    partStatus.textContent = part === 1
        ? "Giáo trình Đương Đại – Tập 1"
        : "Giáo trình Đương Đại – Tập 2";

    const file = part === 1 ? "./vocab.json" : "./vocab2.json";

    fetch(file)
    .then(response => {
        if(!response.ok){
            throw new Error("Không đọc được " + file);
        }
        return response.json();
    })
    .then(data => {
        vocab = Array.isArray(data) ? data : [];

        correct = 0;
        wrong = 0;
        correctText.textContent = 0;
        wrongText.textContent = 0;

        lessonSelect.value = "all";
        createWordList();

        if(vocab.length > 0){
            nextWord();
        }else{
            showNoWords();
        }
    })
    .catch(err => {
        console.error(err);
        vocab = [];
        remainWords = [];
        updateProgress();
        word.textContent = "Chưa có dữ liệu";
        lesson.textContent = currentPart === 2 ? "Phần 2" : "Phần 1";
        partStatus.textContent = "Chưa tải được dữ liệu từ vựng.";
    })
    .finally(() => {
        isLoading = false;
    });
}

function showNoWords(){
    current = null;
    remainWords = [];
    updateProgress();

    lesson.textContent = currentPart === 2 ? "Phần 2" : "Phần 1";
    word.textContent = "📚";
    result.textContent = "Không có từ vựng trong lựa chọn này.";
    result.style.color = "#2563eb";

    backWord.textContent = "";
    backPinyin.textContent = "";
    backMeaning.textContent = "Hãy chọn một bài khác hoặc kiểm tra dữ liệu từ vựng.";

    answer.value = "";
    answer.disabled = true;
    document.getElementById("checkBtn").disabled = true;
    document.getElementById("nextBtn").disabled = true;
    card.classList.remove("flip");
}


// =====================
// Chọn bài
// =====================
lessonSelect.addEventListener("change", function(){
    answer.disabled = false;
    document.getElementById("checkBtn").disabled = false;
    document.getElementById("nextBtn").disabled = false;

    correct = 0;
    wrong = 0;
    correctText.textContent = 0;
    wrongText.textContent = 0;

    createWordList();

    if(remainWords.length > 0){
        nextWord();
    }else{
        showNoWords();
    }
});

// =====================
// Bỏ dấu pinyin
// =====================
function removeTone(str){
    return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/ü/g,"u")
    .replace(/\s+/g,"")
    .toLowerCase()
    .trim();
}

// =====================
// Xáo trộn
// =====================
function shuffle(array){
    for(let i=array.length-1;i>0;i--){
        let j=Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
    }
}

// =====================
// Tạo danh sách
// =====================
function createWordList(){
    if(lessonSelect.value === "all"){
        remainWords = [...vocab];
    }else{
        remainWords = vocab.filter(v => v.lesson === "Bài " + lessonSelect.value);
    }

    total = remainWords.length;
    shuffle(remainWords);
    updateProgress();
}

// =====================
// Thanh tiến độ
// =====================
function updateProgress(){
    remainText.textContent = remainWords.length;
    progressText.textContent = (total-remainWords.length) + " / " + total + " từ";

    let percent = 0;
    if(total > 0){
        percent = ((total-remainWords.length)/total)*100;
    }

    progressBar.style.width = percent + "%";
}

// =====================
// Từ tiếp theo
// =====================
function nextWord(){
    if(remainWords.length === 0){
        if(total > 0){
            alert("🎉 Chúc mừng! Bạn đã học hết bài này.");
            createWordList();
        }else{
            showNoWords();
            return;
        }
    }

    current = remainWords.shift();

    if(!current){
        word.textContent = "Không có dữ liệu";
        return;
    }

    lesson.textContent = current.lesson;
    word.textContent = current.hanzi;

    answer.value = "";
    result.textContent = "";
    card.classList.remove("flip");

    answer.disabled = false;
    document.getElementById("checkBtn").disabled = false;
    document.getElementById("nextBtn").disabled = false;

    answer.focus();
    updateProgress();
}

// =====================
// Kiểm tra
// =====================
function checkAnswer(){
    if(!current) return;

    if(answer.value.trim() === ""){
        alert("⚠️ Hãy nhập đáp án trước.");
        return;
    }

    let input = removeTone(answer.value);
    let hanzi = current.hanzi;
    let pinyin = removeTone(current.pinyin);
    let ok = false;

    if(answer.value.trim() === hanzi){
        ok = true;
    }

    if(input === pinyin){
        ok = true;
    }

    if(ok){
        correct++;
        correctText.textContent = correct;

        result.textContent = "✅ Chính xác!";
        result.style.color = "#16a34a";

        backWord.textContent = current.hanzi;
        backPinyin.textContent = "🔊 " + current.pinyin;
        backMeaning.textContent = "🇻🇳 " + current.meaning;

        card.classList.add("flip");

        setTimeout(function(){
            card.classList.remove("flip");
            setTimeout(function(){
                nextWord();
            },250);
        },2000);

    }else{
        wrong++;
        wrongText.textContent = wrong;
        result.textContent = "";
        result.style.color = "red";
        showWrongPopup(current);
    }
}

// =====================
// Nút từ tiếp theo
// =====================
document.getElementById("checkBtn").addEventListener("click", checkAnswer);
document.getElementById("nextBtn").addEventListener("click", nextWord);

answer.addEventListener("keydown", function(e){
    if(e.key === "Enter") checkAnswer();
});

// =====================
// Popup Sai
// =====================
function showWrongPopup(word){
    document.getElementById("popupIcon").innerHTML = "😢";
    document.getElementById("popupTitle").innerHTML = "Sai rồi bạn ơi!";
    document.getElementById("popupHanzi").textContent = word.hanzi;
    document.getElementById("popupPinyin").textContent = word.pinyin;
    document.getElementById("popupMeaning").textContent = word.meaning;
    document.getElementById("popupMessage").innerHTML = "💪 Đừng nản nhé, học thêm một chút là nhớ ngay!";
    document.getElementById("resultPopup").style.display = "flex";
}

function closePopup(){
    document.getElementById("resultPopup").style.display = "none";
    answer.focus();
}

// =====================
// Chế độ luyện ngữ pháp
// =====================
let grammarData = [];
let grammarRemain = [];
let grammarCurrent = null;
let grammarSelected = [];
let grammarTotal = 0;
let grammarCorrect = 0;
let grammarWrong = 0;
let grammarLoaded = false;

const vocabPanel = document.getElementById('vocabPanel');
const grammarPanel = document.getElementById('grammarPanel');
const vocabModeBtn = document.getElementById('vocabModeBtn');
const grammarModeBtn = document.getElementById('grammarModeBtn');
const grammarLessonSelect = document.getElementById('grammarLessonSelect');
const wordBank = document.getElementById('wordBank');
const sentenceAnswer = document.getElementById('sentenceAnswer');
const grammarLesson = document.getElementById('grammarLesson');
const grammarResult = document.getElementById('grammarResult');
const grammarProgressBar = document.getElementById('grammarProgressBar');
const grammarProgressText = document.getElementById('grammarProgressText');
const grammarCorrectText = document.getElementById('grammarCorrect');
const grammarWrongText = document.getElementById('grammarWrong');
const grammarRemainText = document.getElementById('grammarRemain');

function showMode(mode){
    const grammar = mode === 'grammar';
    vocabPanel.style.display = grammar ? 'none' : 'block';
    grammarPanel.style.display = grammar ? 'block' : 'none';
    vocabModeBtn.classList.toggle('active', !grammar);
    grammarModeBtn.classList.toggle('active', grammar);

    if(grammar && !grammarLoaded){
        loadGrammar();
    }
}

function loadGrammar(){
    fetch('./grammar.json')
        .then(response => {
            if(!response.ok) throw new Error('Không đọc được grammar.json');
            return response.json();
        })
        .then(data => {
            grammarData = Array.isArray(data) ? data : [];
            grammarLoaded = true;
            resetGrammarScore();
            createGrammarList();
            nextGrammar();
        })
        .catch(err => {
            console.error(err);
            grammarResult.textContent = '⚠️ Không tải được dữ liệu ngữ pháp.';
            grammarResult.style.color = '#dc2626';
        });
}

grammarLessonSelect.addEventListener('change', function(){
    resetGrammarScore();
    createGrammarList();
    nextGrammar();
});

document.getElementById('grammarCheckBtn').addEventListener('click', checkGrammar);
document.getElementById('grammarClearBtn').addEventListener('click', clearGrammarAnswer);
document.getElementById('grammarNextBtn').addEventListener('click', nextGrammar);

function resetGrammarScore(){
    grammarCorrect = 0;
    grammarWrong = 0;
    grammarCorrectText.textContent = '0';
    grammarWrongText.textContent = '0';
}

function createGrammarList(){
    const selected = grammarLessonSelect.value;
    grammarRemain = selected === 'all'
        ? [...grammarData]
        : grammarData.filter(q => q.lesson === 'Bài ' + selected);

    grammarTotal = grammarRemain.length;
    shuffle(grammarRemain);
    updateGrammarProgress();
}

function nextGrammar(){
    if(grammarRemain.length === 0){
        if(grammarTotal > 0){
            grammarResult.textContent = '🎉 Bạn đã hoàn thành phần câu này!';
            grammarResult.style.color = '#16a34a';
            grammarCurrent = null;
            wordBank.innerHTML = '';
            sentenceAnswer.innerHTML = '';
            return;
        }
        grammarResult.textContent = 'Chưa có câu cho bài này.';
        grammarResult.style.color = '#2563eb';
        return;
    }

    grammarCurrent = grammarRemain.shift();
    grammarSelected = [];
    grammarLesson.textContent = grammarCurrent.lesson;
    grammarResult.textContent = '';
    renderGrammarQuestion();
    updateGrammarProgress();
}

function renderGrammarQuestion(){
    wordBank.innerHTML = '';
    sentenceAnswer.innerHTML = '';

    const shuffledWords = [...grammarCurrent.words];
    shuffle(shuffledWords);

    shuffledWords.forEach((token, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'grammarWord';
        btn.textContent = token;
        btn.dataset.token = token;
        btn.dataset.index = String(index);
        btn.addEventListener('click', () => selectGrammarWord(btn));
        wordBank.appendChild(btn);
    });
}

function selectGrammarWord(button){
    if(!grammarCurrent) return;
    if(button.disabled) return;

    button.disabled = true;
    button.classList.add('answerWord');
    grammarSelected.push(button.dataset.token);

    const answerBtn = document.createElement('button');
    answerBtn.type = 'button';
    answerBtn.className = 'grammarWord answerWord';
    answerBtn.textContent = button.dataset.token;
    answerBtn.addEventListener('click', () => {
        const index = grammarSelected.indexOf(button.dataset.token);
        if(index !== -1) grammarSelected.splice(index, 1);
        button.disabled = false;
        button.classList.remove('answerWord');
        answerBtn.remove();
    });
    sentenceAnswer.appendChild(answerBtn);
}

function clearGrammarAnswer(){
    grammarSelected = [];
    document.querySelectorAll('#wordBank .grammarWord').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('answerWord');
    });
    sentenceAnswer.innerHTML = '';
    grammarResult.textContent = '';
}

function checkGrammar(){
    if(!grammarCurrent) return;

    if(grammarSelected.length === 0){
        grammarResult.textContent = '⚠️ Hãy chọn các từ trước.';
        grammarResult.style.color = '#d97706';
        return;
    }

    const correctAnswer = grammarCurrent.answer.join('');
    const userAnswer = grammarSelected.join('');

    if(userAnswer === correctAnswer && grammarSelected.length === grammarCurrent.answer.length){
        grammarCorrect++;
        grammarCorrectText.textContent = grammarCorrect;
        grammarResult.innerHTML = '✅ Chính xác!<br><span>' + grammarCurrent.answer.join('') + '</span>' +
            (grammarCurrent.meaning ? '<br><small>🇻🇳 ' + grammarCurrent.meaning + '</small>' : '');
        grammarResult.style.color = '#16a34a';
    }else{
        grammarWrong++;
        grammarWrongText.textContent = grammarWrong;
        grammarResult.innerHTML = '❌ Chưa đúng!<br>Đáp án: <strong>' + grammarCurrent.answer.join('') +
            '</strong><br><small>🇻🇳 ' + grammarCurrent.meaning + '</small>';
        grammarResult.style.color = '#dc2626';
    }
}

function updateGrammarProgress(){
    const done = grammarTotal - grammarRemain.length;
    grammarRemainText.textContent = grammarRemain.length;
    grammarProgressText.textContent = done + ' / ' + grammarTotal + ' câu';
    grammarProgressBar.style.width = grammarTotal > 0 ? ((done / grammarTotal) * 100) + '%' : '0%';
}
