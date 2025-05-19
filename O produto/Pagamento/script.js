    let timeLeft = 60 * 60;

      function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent = 
        `${minutes} minutos e ${seconds}s`;
        if (timeLeft > 0) {
        timeLeft--;
        setTimeout(updateTimer, 1000);
        } else {
        document.getElementById('timer').textContent = "Expirado";
        }
      }
      updateTimer();