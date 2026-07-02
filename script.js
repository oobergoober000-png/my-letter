const dearContent = "Dear Audrey,";
const closingContent = "\nLove,\nDan";

const input = document.getElementById('password');

// Format input as MM/DD/YYYY as the user types
input.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2 && val.length <= 4) {
        val = val.slice(0, 2) + '/' + val.slice(2);
    } else if (val.length > 4) {
        val = val.slice(0, 2) + '/' + val.slice(2, 4) + '/' + val.slice(4);
    }
    e.target.value = val;
});

// Show hint text and image
function showHint() {
    const hintText = document.getElementById('hint-text');
    const hintWrapper = document.getElementById('hint-image-wrapper');

    hintText.style.display = 'block';
    hintWrapper.style.display = 'block';
}

// After password, show loading screen instead of letter directly
function checkPassword() {
    const cleanInput = document.getElementById('password').value.replace(/\D/g, '');
    if (cleanInput === "01222023") {
        document.getElementById('login').style.display = 'none';

        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'flex';

        // Initialize spinner interaction
        initSpinner();
    } else {
        alert("Incorrect date.");
    }
}

// Typewriter function that respects \n by turning them into <br>
function typeWriter(id, text, i, speed, callback) {
    if (i < text.length) {
        const ch = text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
        document.getElementById(id).innerHTML += ch;
        setTimeout(() => typeWriter(id, text, i + 1, speed, callback), speed);
    } else if (callback) {
        callback();
    }
}

// Spinner / loading logic
function initSpinner() {
    const spinner = document.getElementById('spinner');
    const loadingScreen = document.getElementById('loading-screen');
    const content = document.getElementById('content');
    const progressBar = document.getElementById('loading-progress-bar');
    const percentText = document.getElementById('loading-percent');

    let isDragging = false;
    let lastAngle = null;
    let totalRotation = 0; // in degrees
    const targetRotation = 1080; // 3 full turns

    function getCenter(el) {
        const rect = el.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    function getAngle(event, center) {
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        const dx = clientX - center.x;
        const dy = clientY - center.y;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI); // -180 to 180
        if (angle < 0) angle += 360;
        return angle;
    }

    function pointerDown(event) {
        event.preventDefault();
        isDragging = true;
        const center = getCenter(spinner);
        lastAngle = getAngle(event, center);
    }

    function pointerMove(event) {
        if (!isDragging) return;
        event.preventDefault();
        const center = getCenter(spinner);
        const angle = getAngle(event, center);

        if (lastAngle === null) {
            lastAngle = angle;
            return;
        }

        let delta = angle - lastAngle;
        // Handle wrap-around at 0/360
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        totalRotation += delta;
        lastAngle = angle;

        // Apply visual rotation
        spinner.style.transform = `rotate(${totalRotation}deg)`;

        // Update progress
        let progress = Math.max(0, Math.min(1, totalRotation / targetRotation));
        const percent = Math.round(progress * 100);
        progressBar.style.width = percent + "%";
        percentText.textContent = percent + "%";

        // When done, reveal content and run typewriter
        if (percent >= 100) {
            isDragging = false;

            setTimeout(() => {
                loadingScreen.style.display = 'none';
                content.style.display = 'flex';

                typeWriter("dear-area", dearContent, 0, 100, () => {
                    document.getElementById("body-area").style.opacity = '1';
                    setTimeout(() => {
                        typeWriter("closing-area", closingContent, 0, 100, null);
                    }, 3000);
                });
            }, 300); // tiny delay so she can see 100%
        }
    }

    function pointerUp(event) {
        if (!isDragging) return;
        event.preventDefault();
        isDragging = false;
        lastAngle = null;
    }

    // Mouse events
    spinner.addEventListener('mousedown', pointerDown);
    window.addEventListener('mousemove', pointerMove);
    window.addEventListener('mouseup', pointerUp);

    // Touch events
    spinner.addEventListener('touchstart', pointerDown, { passive: false });
    window.addEventListener('touchmove', pointerMove, { passive: false });
    window.addEventListener('touchend', pointerUp);
}
