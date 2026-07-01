const dearContent = "Dear xxx,";
const closingContent = "\nWith all my love,\n[Your Name]";

const input = document.getElementById('password');

input.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2 && val.length <= 4) {
        val = val.slice(0, 2) + '/' + val.slice(2);
    } else if (val.length > 4) {
        val = val.slice(0, 2) + '/' + val.slice(2, 4) + '/' + val.slice(4);
    }
    e.target.value = val;
});

function showHint() {
    const hintText = document.getElementById('hint-text');
    const hintImage = document.getElementById('hint-image');

    // Show hint text
    hintText.style.display = 'block';

    // Show and animate the hint image inside the yellow box
    hintImage.classList.add('hint-visible');
}

function checkPassword() {
    const cleanInput = document.getElementById('password').value.replace(/\D/g, '');
    if (cleanInput === "01222023") {
        document.getElementById('login').style.display = 'none';

        const content = document.getElementById('content');
        content.style.display = 'flex';

        typeWriter("dear-area", dearContent, 0, 100, () => {
            document.getElementById("body-area").style.opacity = '1';
            setTimeout(() => {
                typeWriter("closing-area", closingContent, 0, 100, null);
            }, 3000);
        });
    } else {
        alert("Incorrect date.");
    }
}

function typeWriter(id, text, i, speed, callback) {
    if (i < text.length) {
        const ch = text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
        document.getElementById(id).innerHTML += ch;
        setTimeout(() => typeWriter(id, text, i + 1, speed, callback), speed);
    } else if (callback) {
        callback();
    }
}
