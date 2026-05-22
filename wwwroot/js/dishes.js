const apiDishes = 'api/Dishes';
const apiCategories = 'api/Categories';
let dishesData = [];

// Перевірка авторизації (щоб сюди не зайшов Гість)
window.onload = function() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'Admin') {
        window.location.href = 'login.html';
        return;
    }
    loadCategories();
    loadDishes();
};

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function showToast(message) {
    document.getElementById('toastMessage').innerText = message;
    new bootstrap.Toast(document.getElementById('liveToast'), {delay: 3000}).show();
}

// Завантаження категорій у <select>
function loadCategories() {
    fetch(apiCategories)
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById('dish-category');
            select.innerHTML = '<option value="">-- Оберіть --</option>';
            data.forEach(c => {
                select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
            });
        });
}

function loadDishes() {
    fetch(apiDishes)
        .then(res => res.json())
        .then(data => {
            dishesData = data;
            const tBody = document.getElementById('dishes-list');
            tBody.innerHTML = '';
            
            data.forEach(d => {
                tBody.innerHTML += `
                    <tr>
                        <td class="ps-4 text-muted small">${d.categoryName}</td>
                        <td class="fw-bold">${d.name}</td>
                        <td class="small text-secondary">${d.description}</td>
                        <td class="fw-bold text-success">${d.currentPrice.toFixed(2)} ₴</td>
                        <td class="text-end pe-4">
                            <button class="action-btn edit-btn me-1" onclick="editDish(${d.id})"><i class="bi bi-pencil"></i></button>
                            <button class="action-btn delete-btn" onclick="deleteDish(${d.id})"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        });
}

function saveDish() {
    const id = parseInt(document.getElementById('dish-id').value);
    const dish = {
        id: id,
        categoryId: parseInt(document.getElementById('dish-category').value),
        name: document.getElementById('dish-name').value.trim(),
        description: document.getElementById('dish-desc').value.trim(),
        currentPrice: parseFloat(document.getElementById('dish-price').value)
    };

    const method = id === 0 ? 'POST' : 'PUT';
    const url = id === 0 ? apiDishes : `${apiDishes}/${id}`;

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dish)
    })
    .then(res => {
        if (res.ok) {
            loadDishes();
            resetForm();
            showToast(id === 0 ? 'Страву створено!' : 'Страву успішно оновлено!');
        } else {
            alert('Помилка збереження. Перевірте дані.');
        }
    });
}

function editDish(id) {
    const d = dishesData.find(x => x.id === id);
    document.getElementById('dish-id').value = d.id;
    document.getElementById('dish-category').value = d.categoryId;
    document.getElementById('dish-name').value = d.name;
    document.getElementById('dish-desc').value = d.description;
    document.getElementById('dish-price').value = d.currentPrice;

    document.getElementById('form-title').innerHTML = '<i class="bi bi-pencil-square me-2"></i>Редагувати страву';
    document.getElementById('btn-submit').innerText = 'Зберегти зміни';
    document.getElementById('btn-cancel').style.display = 'block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteDish(id) {
    if(confirm('Видалити страву?')) {
        fetch(`${apiDishes}/${id}`, { method: 'DELETE' })
        .then(() => loadDishes());
    }
}

function resetForm() {
    document.getElementById('dish-id').value = '0';
    document.getElementById('dish-category').value = '';
    document.getElementById('dish-name').value = '';
    document.getElementById('dish-desc').value = '';
    document.getElementById('dish-price').value = '';
    
    document.getElementById('form-title').innerHTML = '<i class="bi bi-plus-circle me-2"></i>Додати страву';
    document.getElementById('btn-submit').innerText = 'Зберегти страву';
    document.getElementById('btn-cancel').style.display = 'none';
}