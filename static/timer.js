document.addEventListener('DOMContentLoaded', function() {
  // Get all the timer input fields
  var timerInputs = document.querySelectorAll('.timer-input');

  // Attach an event listener to each timer input field
  for (var i = 0; i < timerInputs.length; i++) {
    timerInputs[i].addEventListener('change', function() {
      // Get the target time and countdown element for this timer
      var timerName = this.dataset.timer;
      var targetTimeInput = this;
      var countdownElement = document.getElementById(timerName);

      // Start the timer for this countdown element
      startETimer(targetTimeInput, countdownElement);
    });
  }
});

function startETimer(targetTimeInput, countdownElement) {
  // Get the target time from the input field
  var targetTime = new Date();
  targetTime.setHours(targetTimeInput.value.split(":")[0]);
  targetTime.setMinutes(targetTimeInput.value.split(":")[1]);
  targetTime.setSeconds(0);

  // Update the countdown element every second
  const countdownInterval = setInterval(function() {
    var currentTime = new Date();
  
    var remainingTime = targetTime.getTime() - currentTime.getTime();
    var hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    var seconds = Math.floor((remainingTime / 1000) % 60);
  
    countdownElement.innerHTML = hours + " hours " + minutes + " minutes " + seconds + " seconds ";
  
    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      countdownElement.innerHTML = "Time's up!";
    }
  }, 1000);
}
