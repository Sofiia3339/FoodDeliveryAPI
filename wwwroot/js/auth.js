const apiBase = 'api/Users';

// Метод реєстрації
function registerUser() {
    const data = {
        fullName: document.getElementById('reg-name').value,
        phone: document.getElementById('reg-phone').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value,
        role: document.getElementById('reg-role').value
    };

    fetch(`${apiBase}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(async response => {
        if (response.ok) {
            alert('Реєстрація успішна! Тепер увійдіть.');
            document.getElementById('login-tab').click();
        } else {
            const err = await response.text();
            alert('Помилка: ' + err);
        }
    })
    .catch(err => console.error('Помилка:', err));
}

// Метод входу
function loginUser() {
    const data = {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value
    };

    fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(async response => {
        if (response.ok) {
            const user = await response.json();
            
            // ЗБЕРІГАЄМО ЮЗЕРА В ПАМ'ЯТІ БРАУЗЕРА (localStorage)
            localStorage.setItem('currentUser', JSON.stringify(user));

            if (user.role === 'Admin') {
                window.location.href = 'index.html'; 
            } else if (user.role === 'Client') {
                window.location.href = 'client.html'; 
            } else if (user.role === 'Courier') {
                window.location.href = 'courier.html'; 
            }
        } else {
            alert('Невірний логін або пароль!');
        }
    })
    .catch(err => console.error('Помилка:', err));
}

// Перевірка при завантаженні сторінки 
window.onload = function() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser.role === 'Admin') window.location.href = 'index.html';
        else if (parsedUser.role === 'Client') window.location.href = 'client.html';
        else if (parsedUser.role === 'Courier') window.location.href = 'courier.html';
    }
}