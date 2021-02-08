const like_counter = document.getElementById("like_counter");
const dislike_counter = document.getElementById("dislike_counter");
const graph_containers = document.getElementsByClassName("graph-container");

var likes = 0;
var dislikes = 0;

LikesCounter_Main(likes, dislikes)
GetValues('thisurl.ok');

async function CounterInteraction(url, options){
  const response = await fetch(`https://sheldon-rating.herokuapp.com/${url}/rating`, options);
  const r_data = await response.json();

  console.log(r_data);

  LikesCounter_Main(r_data.likes, r_data.dislikes);
}

function Like(url, action){
  const data = {user: '', url: url, action: action};
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  CounterInteraction(url, options);
}

async function GetValues(url){
  const data = {url: url};
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  CounterInteraction(url, options);
}

function LikesCounter_Main(likes, dislikes){ 
  like_counter.innerHTML = PrintCount(likes);
  dislike_counter.innerHTML = PrintCount(dislikes);
  
  const values = likes + dislikes; 

  if(values != 0){
    like_prcntg = 100 * likes / (likes + dislikes);
    dislike_prcntg = 100 - like_prcntg;  
  } else {
    like_prcntg = 50;
    dislike_prcntg = 50;
  }
  
  for (i = 0; i < graph_containers.length; i++) {
    graph_containers[i].style.gridTemplateColumns = `${like_prcntg}% ${dislike_prcntg}%`;
  }
}

function PrintCount(count){
    if(count > 1_000_000)
        return round(count / 1_000_000, 2) + "M";
    else if(count > 1_000)
        return round(count / 1_000, 2) + "k";
    else
        return count;
}

function round(value, precision){
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}