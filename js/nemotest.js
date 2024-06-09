document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    const winSound = new Audio('win.mp3'); // Agregamos el sonido de victoria

    const flipSound = new Audio('flip.mp3');
    const matchSound = new Audio('match.mp3');
    const nomatchSound = new Audio('nomatch.mp3');

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');
        flipSound.play();

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.name === secondCard.dataset.name;
        if (isMatch) {
            matchSound.play();
            disableCards();
        } else {
            nomatchSound.play();
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        resetBoard();
        checkWin();
    }

    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');

            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function checkWin() {
        if (document.querySelectorAll('.flipped').length === cards.length) {
            winSound.play();
            setTimeout(() => {
                document.getElementById('messageContainer').style.display = 'flex';
            }, 1000);
        }
    }

    (function shuffle() {
        cards.forEach(card => {
            let randomPos = Math.floor(Math.random() * 16);
            card.style.order = randomPos;
        });
    })();

    cards.forEach(card => card.addEventListener('click', flipCard));

    document.getElementById('restartButton').addEventListener('click', () => {
        // Reiniciar el juego
        cards.forEach(card => {
            card.classList.remove('flipped');
            card.addEventListener('click', flipCard);
        });
        document.getElementById('messageContainer').style.display = 'none';
    });
});
