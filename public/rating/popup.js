import {URL} from '../modules/public_const.js';

const like_counter = document.getElementById("like_counter");
const dislike_counter = document.getElementById("dislike_counter");
const like_graph = document.getElementById("likes");
const dislike_graph = document.getElementById("dislikes");

//query extraction
var url_array = window.location.href.split('?')

document.getElementById('like').addEventListener('click', () => Like(1));
document.getElementById('dislike').addEventListener('click', () => Like(-1));

var likes = 0;
var dislikes = 0;

LikesCounter_Main(likes, dislikes);
GetValues();

var accdata = {};

window.onmessage = (e) => {
  accdata = e.data.alldata;
};

async function CounterInteraction(options){
  const response = await fetch(`${URL}rating?${url_array[1]}`, options);
  const r_data = await response.json();

  LikesCounter_Main(r_data.likes, r_data.dislikes);
  return r_data;
}

async function Like(action){
  //contacting API
  const data = {action: action, accdata: accdata};
  const options = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  };
  const response = await CounterInteraction(options);
  if(response.status == 0) {
    window.open(`${URL}login/`);
  }
}

async function GetValues(){
  const options = {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  };
  CounterInteraction(options);
}

function LikesCounter_Main(likes, dislikes){ 
  like_counter.innerHTML = PrintCount(likes);
  dislike_counter.innerHTML = PrintCount(dislikes);
  
  const values = likes + dislikes; 

  if(values != 0){
    var like_prcntg = 100 * likes / (likes + dislikes);
    var dislike_prcntg = 100 - like_prcntg;  
  } else {
    var like_prcntg = 50;
    var dislike_prcntg = 50;
  }
  
  like_graph.style.width = `${like_prcntg}%`;
  dislike_graph.style.width = `${dislike_prcntg}%`
}

// PRINTER 
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
