var scores = localStorage.getItem("lastScore");
document.getElementById("score").innerText = `Your Point: ${scores}`;

var allScores = JSON.parse(localStorage.getItem("allScores"));
var scoresNumber = Number(scores);
if (scoresNumber > 0) {
    if (!allScores) {
        allScores = [scoresNumber];
    }

    if (!allScores.find(x => x == scoresNumber)) {
        allScores.push(scoresNumber);
    }
}

localStorage.setItem("allScores", JSON.stringify(allScores));

let map = new Map();
function write(map) {

    let key;
    for (key in localStorage) {
        if (localStorage.getItem(key) != null && key != "nickname" && localStorage.getItem(key) >= 0) {
            map.set(key, localStorage.getItem(key));
        }
    }



    if (map.numberOfItems == 0) {
        document.getElementById('board').innerText = "No records";
        return;
    }

    let mapSort = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));


    for (key of mapSort.keys()) {
        if(key !== "lastScore"){
            document.getElementById('score-table').innerText += key + ":";
            document.getElementById('score-table').innerText += mapSort.get(key) + "\n";
        }
            
    }

}
write(map);


