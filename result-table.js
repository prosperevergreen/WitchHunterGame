var scores = localStorage.getItem("lastScore");
document.getElementById("score").innerText = `Ваши очки: ${scores}`;

var allScores = JSON.parse(localStorage.getItem("allScores"));
var scoresNumber = Number(scores);
if(scoresNumber > 0){
    if(!allScores){
        allScores = [scoresNumber];
    }
    
    if(!allScores.find(x=>x == scoresNumber)){
        allScores.push(scoresNumber);
    }
}

localStorage.setItem("allScores",JSON.stringify(allScores));

var allScores = allScores.sort((x,y)=>{
    if(x<y) return 1;
    return -1;
});
var list = "";

for (let index = 0; index < allScores.length; index++) {
    list += `<li>Результат №${index+1}: ${allScores[index]}</li>`;
}

document.getElementById("score-table").innerHTML = list;


