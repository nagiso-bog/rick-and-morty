const emailInput = document.querySelector('.input-email');
const username = document.querySelector('.input-name');
const passwordInput = document.querySelector('.input-password');
const todoList = document.querySelector('.list');
const form = document.querySelector('.form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = {
        name: username.value,
        data: {
            email: emailInput.value,
            password: passwordInput.value
        }
    };

    fetch('https://api.restful-api.dev/objects', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then((response) => {
            console.log('Response:', response);

            if (!response.ok) {
                const errorMessage = response.status === 404
                    ? 'User not found'
                    : 'An error occurred';
                throw new Error(errorMessage);
            }
            return response.json();
        })
        .then((json) => {
            console.log('json:', json);
            window.location.href = `success.html?name=${encodeURIComponent(json.name)}`;
        })
        .catch((error) => {
            todoList.textContent = error.message;
        });
});
