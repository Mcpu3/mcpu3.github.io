window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('loading').style.display = 'none';
});
const date = Date.now();

function update() {
    const elapsed_time = 0.001 * (Date.now() - date);
    document.getElementById('loading_title').innerText = elapsed_time.toFixed(3);
    requestAnimationFrame(update);
}

requestAnimationFrame(update);