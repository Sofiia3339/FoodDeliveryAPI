const uri = 'api/Categories';
let categories = [];

// Утиліта для красивих сповіщень (Toast)
function showToast(title, message, isError = false) {
    const toastEl = document.getElementById('liveToast');
    const toastHeader = document.getElementById('toastHeader');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    toastTitle.innerText = title;
    toastMessage.innerText = message;

    if (isError) {
        toastHeader.className = 'toast-header border-0 text-white bg-danger';
        toastIcon.className = 'bi bi-exclamation-triangle-fill me-2';
    } else {
        toastHeader.className = 'toast-header border-0 text-white bg-success';
        toastIcon.className = 'bi bi-check-circle-fill me-2';
    }

    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}

function getCategories() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayCategories(data))
        .catch(error => {
            console.error('Помилка', error);
            showToast('Помилка сервера', 'Не вдалося завантажити дані', true);
        });
}

function addCategory() {
    const addNameTextbox = document.getElementById('add-name');
    const category = { name: addNameTextbox.value.trim() };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    })
    .then(response => {
        if (response.ok) {
            getCategories();
            addNameTextbox.value = '';
            showToast('Успіх!', 'Нову категорію успішно додано.');
        } else {
            showToast('Помилка', 'Перевірте введені дані', true);
        }
    })
    .catch(error => showToast('Помилка', 'Щось пішло не так', true));
}

function deleteCategory(id) {
    if (confirm("Ви дійсно хочете видалити цю категорію?")) {
        fetch(`${uri}/${id}`, { method: 'DELETE' })
        .then(response => {
            if(response.ok){
                getCategories();
                showToast('Видалено', 'Категорію успішно видалено.');
            }
        })
        .catch(error => showToast('Помилка', 'Не вдалося видалити', true));
    }
}

function displayEditForm(id) {
    const category = categories.find(c => c.id === id);
    document.getElementById('edit-id').value = category.id;
    document.getElementById('edit-name').value = category.name;
    
    // Плавна поява
    const form = document.getElementById('editForm');
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
}

function updateCategory() {
    const categoryId = document.getElementById('edit-id').value;
    const category = {
        id: parseInt(categoryId, 10),
        name: document.getElementById('edit-name').value.trim()
    };

    fetch(`${uri}/${categoryId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    })
    .then(response => {
        if (response.ok) {
            getCategories();
            closeInput();
            showToast('Оновлено', 'Зміни успішно збережено.');
        }
    })
    .catch(error => showToast('Помилка', 'Не вдалося оновити', true));
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function _displayCategories(data) {
    const tBody = document.getElementById('categories');
    tBody.innerHTML = '';

    if (data.length === 0) {
        tBody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-muted">Поки немає жодної категорії</td></tr>`;
        return;
    }

    data.forEach(category => {
        let tr = tBody.insertRow();
        
        let td1 = tr.insertCell(0);
        td1.className = "ps-4 fw-bold text-secondary";
        td1.appendChild(document.createTextNode(`#${category.id}`));

        let td2 = tr.insertCell(1);
        td2.className = "fw-medium";
        td2.appendChild(document.createTextNode(category.name));

        let td3 = tr.insertCell(2);
        td3.className = "text-end pe-4";

        let editButton = document.createElement('button');
        editButton.innerHTML = '<i class="bi bi-pencil-fill me-1"></i> Змінити';
        editButton.className = 'action-btn edit-btn me-2';
        editButton.setAttribute('onclick', `displayEditForm(${category.id})`);

        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="bi bi-trash3-fill"></i>';
        deleteButton.className = 'action-btn delete-btn';
        deleteButton.setAttribute('onclick', `deleteCategory(${category.id})`);

        td3.appendChild(editButton);
        td3.appendChild(deleteButton);
    });

    categories = data;
}