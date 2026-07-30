let vocab = [];
let current = null;

let correct = 0;
let wrong = 0;

const word = document.getElementById("word");
const lesson = document.getElementById("lesson");

const answer = document.getElementById("answer");

const result = document.getElementById("result");

const backWord = document.getElementById("backWord");
const backPinyin = document.getElementById("backPinyin");
const backMeaning = document.getElementById("backMeaning");

const card = document.getElementById("card");

const lessonSelect = document.getElementById("lessonSelect");

const correctText = document.getElementById("correct");
const wrongText = document.getElementById("wrong");

fetch("vocab.json")
.then(r=>r.json())
.then(data=>{

    vocab=data;

    nextWord();

});

function removeTone(str){

return str
.normalize("NFD")
.replace(/[\u0300-\u036f]/g,"")
.toLowerCase()
.replace(/\s+/g,"")
.trim();

}

function nextWord(){

card.classList.remove("flip");

result.innerHTML="";

answer.value="";

let list;

if(lessonSelect.value=="all"){

list=vocab;

}else{

list=vocab.filter(v=>v.lesson==="Bài "+lessonSelect.value);

}

current=list[Math.floor(Math.random()*list.length)];

lesson.innerHTML=current.lesson;

word.innerHTML=current.hanzi;

}

lessonSelect.onchange=nextWord;

document.getElementById("nextBtn").onclick=nextWord;

document.getElementById("checkBtn").onclick=function(){

let user=answer.value.trim();

if(user==""){

alert("Nhập đáp án trước.");

return;

}

let hanzi=current.hanzi.trim();

let py=removeTone(current.pinyin);

let input=removeTone(user);

let ok=false;

if(user===hanzi) ok=true;

if(input===py) ok=true;

if(ok){

correct++;

correctText.innerHTML=correct;

result.innerHTML="✅ Chính xác";

result.style.color="green";

}else{

wrong++;

wrongText.innerHTML=wrong;

result.innerHTML="❌ Sai";

result.style.color="red";

}

backWord.innerHTML=current.hanzi;

backPinyin.innerHTML="🔊 "+current.pinyin;

backMeaning.innerHTML="🇻🇳 "+current.meaning;

card.classList.add("flip");

}

answer.addEventListener("keypress",function(e){

if(e.key==="Enter"){

document.getElementById("checkBtn").click();

}

});
