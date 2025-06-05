
document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const needle = document.getElementById('needle');
    const startBtn = document.getElementById('startBtn');
    const twoPlayerBtn = document.getElementById('twoPlayerBtn');
    //const threePlayerBtn = document.getElementById('threePlayerBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const timerDisplay = document.getElementById('timerDisplay');
    const strengthLevel = document.getElementById('strengthLevel');
    const angleMarkers = document.getElementById('angleMarkers');
    
    // Game variables
    let animationId = null;
    let currentAngle = 0;
    let direction = 1;
    let gameActive = false;
    let timer = 5.0;

    //let score = 0;
    let timerInterval = null;
    let currentScore = 0;
    let twoPlayerMode = false;
    let player1Score = 0;
    let player2Score = 0;
    let currentPlayer = 1;
    
    // Create angle markers
    createAngleMarkers();
    

 
    startBtn.addEventListener('click', () => startGame(false));
    
    twoPlayerBtn.addEventListener('click', () => startGame(true));
    
    // For stopping the  hammer
    stopBtn.addEventListener('click', stopHammer);
    
    // Reset GAme
    resetBtn.addEventListener('click', resetGame);
    

    // Keyboard controls forinput form user
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && gameActive) {
            stopHammer();
        }
    });
    

    function createAngleMarkers() 
    {
        // at each 15 degree marke created
        for (let angle = 0; angle <= 180; angle += 15) {
            const marker = document.createElement('div');
            marker.className = 'angle-marker';
            marker.style.transform = `rotate(${angle}deg)`;
            angleMarkers.appendChild(marker);
            
            // adding lables for main angles as showm
            if (angle === 0 || angle === 45 || angle === 90 || angle === 135 || angle === 180) {
                const label = document.createElement('div');
                label.className = 'angle-label';
                label.textContent = `${angle}°`;
                
            
                const rad = angle * Math.PI / 180;
                const radius = 170;
                const x = 200 + Math.sin(rad) * radius;
                const y = 200 - Math.cos(rad) * radius;
                
                label.style.left = `${x}px`;
                label.style.top = `${y}px`;
                angleMarkers.appendChild(label);
            }
        }
    }
    

    function startGame(twoPlayer) {
        if (gameActive) return;
        
        twoPlayerMode = twoPlayer;
        currentPlayer = 1;
        player1Score = 0;
        player2Score = 0;
        
       // to reset the  game
        gameActive = true;
        currentAngle = 0;
        direction = 1;
        currentScore = 0;
        timer = 5.0;
       ;
        timerDisplay.textContent = timer.toFixed(1);
        scoreDisplay.textContent = "0";
        scoreDisplay.style.color = "#27ae60";
        strengthLevel.textContent = twoPlayerMode ? 
            "Player 1: Press STOP at 90°!" : "Press STOP at 90°!";
        strengthLevel.style.color = "#d35400";
        
        // enable or disable buttons
        startBtn.disabled = true;
        twoPlayerBtn.disabled = true;
        stopBtn.disabled = false;
        
        animate();
        
        // Start timer
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 100);
    
}
    

    function animate() {
        if (!gameActive) return;
        
        // C+calculate new angle accod. to physics
        const speedFactor = 1 + 0.8 * Math.abs(Math.sin(currentAngle * Math.PI / 180));
        currentAngle += direction * speedFactor * 1.5;
        
        // change direction at limits
        if (currentAngle >= 180) {
            currentAngle = 180;
            direction = -1;
        } else if (currentAngle <= 0) {
            currentAngle = 0;
            direction = 1;
        }
        
        // update needle position
        needle.style.transform = `translateX(-50%) rotate(${currentAngle}deg)`;
        //needle.ATTRIBUTE_NODE
    
        animationId = requestAnimationFrame(animate);
      }
    
 //scoreText.textContent = `Score: ${player1Score} - ${player2Score}`

    function updateTimer() {
        if (!gameActive) return;
        
        timer -= 0.1;
        timerDisplay.textContent = timer.toFixed(1);
        
        // change color when time is running out!!
        if (timer < 2.0) {
            timerDisplay.style.color = "#e74c3c";
        } 
        else {
            timerDisplay.style.color = "white";
        }
        
        // end the game when time runs out!!
        if (timer <= 0) {
            timer = 0;
            timerDisplay.textContent = "0.0";
            endGame(twoPlayerMode ? 
                `Player ${currentPlayer}: Time's up!` : 
                "Time's up! You didn't stop the hammer!");
        }
    }
    

    function stopHammer() {
        if (!gameActive) return;
        
        // calculate the fimal score based on deviation from 90°
        const deviation = Math.abs(currentAngle - 90);
        currentScore = Math.max(0, 100 - deviation);
        

        if (twoPlayerMode) {
            if (currentPlayer === 1) {
                player1Score = Math.round(currentScore);
                currentPlayer = 2;
                strengthLevel.textContent = `Player 1 scored: ${player1Score}. Get ready Player 2!`;
                strengthLevel.style.color = "#3498db";
                
                // Add delay 
                endGame();
                setTimeout(() => {
                    strengthLevel.textContent = "Player 2: Press STOP at 90°!";
                    startPlayer2Turn();
                }, 2000); 
                return;
            } else {
                player2Score = Math.round(currentScore);
                endTwoPlayerGame();
                //endGame ();
                return;
            }
        }
        
        // display results for single player
        displayScoreResults(deviation);
        endGame();
    }
    
    function startPlayer2Turn() {
        // reset game state for player 2
        gameActive = true;
        currentAngle = 0;
        direction = 1;
        timer = 5.0;
        timerDisplay.textContent = timer.toFixed(1);
        timerDisplay.style.color = "white";
        
        // enable stop button
        stopBtn.disabled = false;
        
        // start animation and timer
        animate();
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 100);
    }
    
    function displayScoreResults(deviation) {
        const roundedScore = Math.round(currentScore);
        scoreDisplay.textContent = roundedScore;
        scoreDisplay.style.color = roundedScore === 100 ? "#e74c3c" : "#27ae60";
        

        // set strength level in text
        if (deviation < 5) {
            strengthLevel.textContent = "PERFECT HIT! ★★★★★";
            strengthLevel.style.color = "#e74c3c";
            scoreDisplay.classList.add("perfect");
        } 
        else if (deviation < 15) {
            strengthLevel.textContent = "GREAT STRENGTH! ★★★★";
            strengthLevel.style.color = "#d35400";
        } 
        
        else if (deviation < 30) {
            strengthLevel.textContent = "GOOD EFFORT! ★★★";
            strengthLevel.style.color = "#e67e22";
        } 
        else if (deviation < 60) {
            strengthLevel.textContent = "AVERAGE! ★★";
            strengthLevel.style.color = "#f39c12";
        } 
        else {
            strengthLevel.textContent = "WEAK! ★";
            strengthLevel.style.color = "#7f8c8d";
        }
    }
    

function endTwoPlayerGame() {
        gameActive = false;
        cancelAnimationFrame(animationId);
        clearInterval(timerInterval);
        
        // round scores to integers
        const p1Score = Math.round(player1Score);
        const p2Score = Math.round(player2Score);
        
        // decide winner?
        let resultMessage;
        if (p1Score > p2Score) {
            resultMessage = `Player 1 wins! ${p1Score} vs ${p2Score}`;
        } else if (p2Score > p1Score) {
            resultMessage = `Player 2 wins! ${p2Score} vs ${p1Score}`;
        } else {
            resultMessage = `It's a tie! Both scored ${p1Score}`;
        }
        

        // display total  scores for both
        scoreDisplay.textContent = `${p1Score} : ${p2Score}`;
        strengthLevel.textContent = resultMessage;
        strengthLevel.style.color = p1Score === p2Score ? "#2ecc71" : 
                                   (p1Score > p2Score ? "#e74c3c" : "#3498db");
        

        // enable buttons
        startBtn.disabled = false;
        twoPlayerBtn.disabled = false;
        stopBtn.disabled = true;
    }
    

    function resetNeedle() {
        currentAngle = 0;
        direction = 1;
        timer = 5.0;
        timerDisplay.textContent = timer.toFixed(1);
        timerDisplay.style.color = "white";
        needle.style.transform = `translateX(-50%) rotate(0deg)`;
    }
    
    function endGame(message) {
        gameActive = false;
        
// stops animation and timer
        cancelAnimationFrame(animationId);
        clearInterval(timerInterval);
        
       // button toggle
        startBtn.disabled = false;
        twoPlayerBtn.disabled = false;
        stopBtn.disabled = true;
        
        // Display message #if provided
        if (message) {
            strengthLevel.textContent = message;
            strengthLevel.style.color = "#e74c3c";
        }
    }
    
    function resetGame() {
        // Stopping any active game 
        if (gameActive) {
            cancelAnimationFrame(animationId);
            clearInterval(timerInterval);
            gameActive = false;
        }
        
        // Reset game state
        currentAngle = 0;
        timer = 5.0;
        currentScore = 0;
        twoPlayerMode = false;
        
        // Reset UI
        needle.style.transform = `translateX(-50%) rotate(0deg)`;
        scoreDisplay.textContent = "0";
        scoreDisplay.style.color = "#27ae60";

        scoreDisplay.classList.remove("perfect");
        timerDisplay.textContent = timer.toFixed(1);
        timerDisplay.style.color = "white";
        strengthLevel.textContent = "Press START to play!";
        strengthLevel.style.color = "#d35400";
        
        // Enable/disable buttons
        startBtn.disabled = false;
        twoPlayerBtn.disabled = false;
        stopBtn.disabled = true;
    }
});