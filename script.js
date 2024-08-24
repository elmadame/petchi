document.addEventListener('DOMContentLoaded', function () {
    const petSound = document.getElementById('pet-sound');
    
    let pet = {
        hunger: 5,
        cleanliness: 5,
        days: 0,
        score: 0,
        hearts: 0,
        sleeping: false,
        lastFed: new Date(),
        lastCleaned: new Date(),
        lastInteracted: new Date(),
        name: '',
        alive: true
    };

    const petElement = document.getElementById('pet');
    const zzzzElement = document.getElementById('zzzz');
    const poopElement = document.getElementById('poop');
    const ripElement = document.getElementById('rip');
    const petNameElement = document.getElementById('pet-name');
    const eggElement = document.getElementById('egg');
    const heartsElement = document.getElementById('hearts');
    const feedButton = document.getElementById('feed');
    const feedOptions = document.getElementById('feed-options');
    const infoButton = document.getElementById('info-button');

    function requestName() {
        const name = prompt("Please enter your pet's name:");
        pet.name = name || "Pet";
        petNameElement.innerText = pet.name;
        savePet();
        startEggHatchingAnimation();
    }

    function startEggHatchingAnimation() {
        renderEgg();
        setTimeout(() => {
            eggElement.innerHTML = '';
            updatePetStage();
        }, 2000);
    }

    function loadPet() {
        const savedPet = JSON.parse(localStorage.getItem('tamagotchi-pet'));
        if (savedPet) {
            pet = savedPet;
            eggElement.style.display = 'none';
        } else {
            requestName();
        }
        updatePetStage();
        updateDisplay();
    }

    function savePet() {
        localStorage.setItem('tamagotchi-pet', JSON.stringify(pet));
    }

    function updateDisplay() {
        document.getElementById('hunger').innerText = "🍲 " + "I".repeat(pet.hunger);
        document.getElementById('cleanliness').innerText = "🧼 " + "I".repeat(pet.cleanliness);
        document.getElementById('days').innerText = "⌛ " + pet.days;
        document.getElementById('score').innerText = "Score: " + pet.score;
        heartsElement.innerHTML = "❤️".repeat(pet.hearts);

        if (pet.sleeping) {
            zzzzElement.style.display = 'block';
            document.getElementById('frame').classList.add('sleeping');
            document.getElementById('sleep').style.display = 'none';
            document.getElementById('awake').style.display = 'inline-block';
        } else {
            zzzzElement.style.display = 'none';
            document.getElementById('frame').classList.remove('sleeping');
            poopElement.style.display = pet.cleanliness <= 2 ? 'block' : 'none';
        }
    }

    function updatePetStage() {
        if (!pet.alive) return;
        petElement.innerHTML = '';
        if (pet.days < 4) {
            renderStage([
                'transparent transparent black black black transparent transparent',
                'transparent black gray gray gray black transparent',
                'black gray gray white gray gray black',
                'black gray gray white gray gray black',
                'black gray gray gray gray gray black',
                'transparent pink pink pink pink pink transparent',
                'transparent yellow yellow transparent transparent yellow yellow'
            ]);
        } else if (pet.days < 8) {
            renderStage([
                'transparent transparent black black black transparent transparent',
                'transparent black gray gray gray black transparent',
                'black gray gray white gray gray black',
                'black gray gray white gray gray black',
                'black gray gray gray gray gray black',
                'transparent pink pink pink pink pink transparent',
                'transparent yellow yellow transparent transparent yellow yellow'
            ]);
        } else if (pet.days < 16) {
            renderStage([
                'transparent transparent black black black transparent transparent',
                'transparent black gray gray gray black transparent',
                'black gray gray white gray gray black',
                'black gray gray white gray gray black',
                'black gray gray gray gray gray black',
                'transparent pink pink pink pink pink transparent',
                'transparent yellow yellow transparent transparent yellow yellow'
            ]);
        } else {
            renderStage([
                'transparent transparent black black black transparent transparent',
                'transparent black gray gray gray black transparent',
                'black gray gray white gray gray black',
                'black gray gray white gray gray black',
                'black gray gray gray gray gray black',
                'transparent pink pink pink pink pink transparent',
                'transparent yellow yellow transparent transparent yellow yellow'
            ]);
        }
        animateMovement();
    }

    function renderEgg() {
        renderStage([
            'transparent transparent white white white transparent transparent',
            'transparent white black black black white transparent',
            'white black black black black black white',
            'white black black black black black white',
            'white black black black black black white',
            'transparent white black black black white transparent',
            'transparent transparent white white white transparent transparent'
        ]);
    }

    function renderStage(pixels) {
        pixels.forEach(row => {
            row.split(' ').forEach(color => {
                const pixel = document.createElement('div');
                pixel.className = `pixel ${color}`;
                petElement.appendChild(pixel);
            });
        });
    }
    function feedPet(amount) {
        if (!pet.sleeping && pet.alive) {
            pet.hunger = Math.min(pet.hunger + amount, 10);
            pet.lastFed = new Date();
            pet.score += (amount === 1 ? 10 : 20); // Different scores for Vegetable and Tacos
            savePet();
            updateDisplay();

            // Play sound when pet is fed
            petSound.play();

            setTimeout(() => {
                if (!pet.sleeping && pet.alive) {
                    pet.cleanliness = Math.max(pet.cleanliness - 1, 0);
                    renderPoop();
                    updateDisplay();

                    // Play sound when pet poops
                    petSound.play();
                }
            }, 7 * 60 * 1000); // 7 minutes in milliseconds
        }
        feedOptions.style.display = 'none'; // Hide feed options after selecting
    }

    function cleanPet() {
        if (!pet.sleeping && pet.alive) {
            pet.cleanliness = Math.min(pet.cleanliness + 1, 10);
            pet.lastCleaned = new Date();
            pet.score += 10;
            savePet();
            updateDisplay();

            // Hide poop after cleaning
            poopElement.style.display = 'none';
        }
    }

    function putPetToSleep() {
        if (pet.alive) {
            pet.sleeping = true;
            savePet();
            updateDisplay();
        }
    }

    function wakePetUp() {
        if (pet.alive) {
            pet.sleeping = false;
            savePet();
            updateDisplay();
        }
    }

    function resetGame() {
        localStorage.removeItem('tamagotchi-pet');
        location.reload();
    }

    function renderPoop() {
        poopElement.innerHTML = '';
        renderStage([
            'transparent transparent black black black transparent transparent',
            'transparent black brown brown black black transparent',
            'black brown brown brown brown brown black',
            'black brown brown brown brown brown black',
            'transparent black brown brown brown black transparent',
            'transparent transparent black black black transparent transparent',
            'transparent pink pink transparent pink pink transparent'
        ]);
    }

    function animateMovement() {
        petElement.classList.add('moving');
    }

    // Event Listeners
    feedButton.addEventListener('click', () => {
        feedOptions.style.display = 'block';
    });
    document.getElementById('feed-vegetable').addEventListener('click', () => feedPet(1));
    document.getElementById('feed-tacos').addEventListener('click', () => feedPet(2));
    document.getElementById('clean').addEventListener('click', cleanPet);
    document.getElementById('sleep').addEventListener('click', putPetToSleep);
    document.getElementById('awake').addEventListener('click', wakePetUp);
    document.getElementById('reset').addEventListener('click', resetGame);

    infoButton.addEventListener('click', () => {
        alert("PETCHI 1.1 created by Luis Villanueva DIGITAL GOD, contact: contacto.luisvillanueva@gmail.com");
    });

    loadPet();
});
