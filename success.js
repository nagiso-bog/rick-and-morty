const welcome = document.querySelector('.welcome');
const username = new URLSearchParams(window.location.search).get('name');

if (username) {
    welcome.textContent = `Welcome ${username}`;
}
