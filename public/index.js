var source = new EventSource('/tweets');

document.addEventListener("DOMContentLoaded", function(event) {
  source.onmessage = function(event) {
    console.log(event.data)
    data = JSON.parse(event.data)
    log.innerText += '\n' + data.message;
  };
})


