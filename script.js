let vocab = [];
let remainWords = [];
let current = null;

let correct = 0;
let wrong = 0;
let total = 0;

// DOM
const card = document.getElementById("card");

const lesson = document.getElementById("lesson");
const word = document.getElementById("word");

const backWord = document.getElementById("backWord");
const backPinyin = document.getElementById("backPinyin");
const backMeaning = document.getElementById("backMeaning");

const answer = document.getElementById("answer");

const result = document.getElementById("result");

const lessonSelect = document.getElementById("lessonSelect");

const correctText = document.getElementById("correct");
const wrongText = document.getElementById("wrong");
const remainText = document.getElementById("remain");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

// Đọc JSON
fetch("vocab.json")
.then(res=>res.json())
.then(data=>{

    vocab=data;

    createWordList();

    nextWord();

})
.catch(err=>{

    alert("Không đọc được vocab.json");

    console.error(err);

});


// Bỏ dấu pinyin
function removeTone(str){

    return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/ü/g,"u")
    .replace(/\s+/g,"")
    .toLowerCase()
    .trim();

}


// Tạo danh sách
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


// Xáo trộn
function shuffle(arr){

    for(let i=arr.length-1;i>0;i--){

        let j=Math.floor(Math.random()*(i+1));

        [arr[i],arr[j]]=[arr[j],arr[i]];

    }

}


// Thanh tiến độ
function updateProgress(){

    remainText.textContent=remainWords.length;

    progressText.textContent=(total-remainWords.length)+" / "+total+" từ";

    let percent=0;

    if(total>0){

        percent=((total-remainWords.length)/total)*100;

    }

    progressBar.style.width=percent+"%";

}


// Hiện từ mới
function nextWord(){

    if(remainWords.length===0){

        alert("🎉 Bạn đã học hết từ của bài này!");

        createWordList();

    }

    current=remainWords.shift();

    updateProgress();

    card.classList.remove("flip");

    result.textContent="";

    answer.value="";

    lesson.textContent=current.lesson;

    word.textContent=current.hanzi;

}


// Kiểm tra
function checkAnswer(){

    if(answer.value.trim()===""){

        alert("Nhập đáp án trước.");

        return;

    }

    let user=answer.value.trim();

    let ok=false;

    // Hán
    if(user===current.hanzi){

        ok=true;

    }

    // Pinyin
    if(removeTone(user)===removeTone(current.pinyin)){

        ok=true;

    }

    if(ok){

        correct++;

        correctText.textContent=correct;

        result.textContent="✅ Chính xác";

        result.style.color="green";

    }else{

        wrong++;

        wrongText.textContent=wrong;

        result.textContent="❌ Sai";

        result.style.color="red";

    }

    backWord.textContent=current.hanzi;

    backPinyin.textContent=current.pinyin;

    backMeaning.textContent=current.meaning;

    card.classList.add("flip");

}


// Sự kiện
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
