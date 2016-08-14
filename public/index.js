var source = new EventSource('/tweets');

// source.onmessage = function (event) {
//   console.log(event)
//   log.innerText += '\n' + event.data;
// }, false);
console.log('STARTING!')
document.addEventListener("DOMContentLoaded", function(event) {
  console.log('READY!')
  source.onmessage = function(event) {
    console.log(event)
    log.innerText += '\n' + event.data;
  };
})


