let currentUser = null;

window.onload = function() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'Courier') {
        window.location.href = 'login.html';
        return;
    }
    loadAvailableOrders();
};

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function loadAvailableOrders() {
    fetch('api/Orders/available')
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('available-list');
            list.innerHTML = '';
            
            if (data.length === 0) {
                list.innerHTML = '<div class="text-center py-5 text-muted"><i class="bi bi-emoji-smile fs-1 d-block mb-2"></i>Вільних замовлень поки немає</div>';
                return;
            }

            data.forEach(o => {
                list.innerHTML += `
                    <div class="modern-card p-3 border-start border-4 border-primary">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="badge bg-primary">Замовлення #${o.id}</span>
                            <span class="fw-bold text-success">${o.totalAmount.toFixed(2)} ₴</span>
                        </div>
                        <h6 class="fw-bold mb-1"><i class="bi bi-geo-alt me-1"></i> ${o.deliveryAddress}</h6>
                        <p class="small text-muted mb-2"><i class="bi bi-person me-1"></i> ${o.clientName} (${o.clientPhone})</p>
                        ${o.chefComment ? `<div class="alert alert-warning py-1 px-2 small mb-3"><i class="bi bi-info-circle me-1"></i>${o.chefComment}</div>` : ''}
                        <button class="btn btn-primary w-100" onclick="takeOrder(${o.id})">Взяти в роботу</button>
                    </div>
                `;
            });
        });
}

function loadMyOrders() {
    fetch(`api/Orders/courier/${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('my-list');
            list.innerHTML = '';

            if (data.length === 0) {
                list.innerHTML = '<div class="text-center py-5 text-muted">Ви зараз нічого не доставляєте</div>';
                return;
            }

            data.forEach(o => {
                list.innerHTML += `
                    <div class="modern-card p-3 border-start border-4 border-warning">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="badge bg-warning text-dark">В дорозі (#${o.id})</span>
                            <a href="tel:${o.clientPhone}" class="btn btn-sm btn-outline-success"><i class="bi bi-telephone"></i> Дзвонити</a>
                        </div>
                        <h6 class="fw-bold mb-3"><i class="bi bi-geo-alt-fill text-danger me-1"></i> ${o.deliveryAddress}</h6>
                        <div class="d-flex gap-2">
                            <button class="btn btn-success w-75" onclick="changeStatus(${o.id}, 3)">Доставлено</button>
                            <button class="btn btn-danger w-25" onclick="changeStatus(${o.id}, 4)"><i class="bi bi-exclamation-triangle"></i></button>
                        </div>
                    </div>
                `;
            });
        });
}

function takeOrder(orderId) {
    fetch(`api/Orders/${orderId}/take`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser.id)
    }).then(res => {
        if (res.ok) {
            document.getElementById('my-tab').click();
        }
    });
}

function changeStatus(orderId, statusId) {
    let msg = statusId === 3 ? "Підтвердити доставку?" : "Повідомити про проблему?";
    if (confirm(msg)) {
        fetch(`api/Orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(statusId)
        }).then(res => {
            if (res.ok) {
                if (statusId === 3) alert('Чудова робота! Замовлення доставлено.');
                loadMyOrders(); 
            }
        });
    }
}