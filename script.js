let vocab = [];
let remainWords = [];
let current = null;

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

// =====================
// Đọc vocab.json
// =====================

fetch("./vocab.json")
.then(response => {

    if(!response.ok){
        throw new Error("Không đọc được vocab.json");
    }

    return response.json();

})
.then(data => {

    vocab = data;

    createWordList();

    nextWord();

})
.catch(err => {

    console.error(err);

    word.textContent = "Lỗi tải dữ liệu";

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

    if(lessonSelect.value==="all"){

        remainWords=[...vocab];

    }else{

        remainWords=vocab.filter(v=>v.lesson==="Bài "+lessonSelect.value);

    }

    total=remainWords.length;

    shuffle(remainWords);

    updateProgress();

}

// =====================
// Thanh tiến độ
// =====================

function updateProgress(){

    remainText.textContent=remainWords.length;

    progressText.textContent=(total-remainWords.length)+" / "+total+" từ";

    let percent=0;

    if(total>0){

        percent=((total-remainWords.length)/total)*100;

    }

    progressBar.style.width=percent+"%";

}

// =====================
// Từ tiếp theo
// =====================

function nextWord(){

    if(remainWords.length===0){

        alert("🎉 Chúc mừng! Bạn đã học hết bài này.");

        createWordList();

    }

    current=remainWords.shift();

    if(!current){

        word.textContent="Không có dữ liệu";

        return;

    }

    lesson.textContent=current.lesson;

    word.textContent=current.hanzi;

    answer.value="";

    result.textContent="";

    card.classList.remove("flip");

    answer.focus();

    updateProgress();

}

// =====================
// Kiểm tra
// =====================

function checkAnswer(){

    if(answer.value.trim()===""){

        alert("⚠️ Hãy nhập đáp án trước.");

        return;

    }

    let input = removeTone(answer.value);

    let hanzi = current.hanzi;

    let pinyin = removeTone(current.pinyin);

    let ok = false;

    // Nhập đúng chữ Hán
    if(answer.value.trim() === hanzi){
        ok = true;
    }

    // Hoặc đúng pinyin
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

setTimeout(function () {
    card.classList.remove("flip");

    setTimeout(function () {
        nextWord();
    }, 250);

}, 2000);

    }else{

        wrong++;
        wrongText.textContent = wrong;

        result.textContent = "";
        result.style.color = "red";

        showWrongPopup(current);

    }

}

// =====================
// Popup Sai
// =====================

function showWrongPopup(word){

    document.getElementById("popupIcon").innerHTML="😢";

    document.getElementById("popupTitle").innerHTML="Sai rồi bạn ơi!";

    document.getElementById("popupHanzi").textContent=word.hanzi;

    document.getElementById("popupPinyin").textContent=word.pinyin;

    document.getElementById("popupMeaning").textContent=word.meaning;

    document.getElementById("popupMessage").innerHTML=
    "💪 Đừng nản nhé, học thêm một chút là nhớ ngay!";

    document.getElementById("resultPopup").style.display="flex";

}

function closePopup(){

    document.getElementById("resultPopup").style.display="none";

    answer.focus();

}

// =====================
// Sự kiện
// =====================

document.getElementById("checkBtn").onclick=checkAnswer;

document.getElementById("nextBtn").onclick=nextWord;

lessonSelect.onchange=function(){

    createWordList();

    nextWord();

};

answer.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        checkAnswer();

    }

});
