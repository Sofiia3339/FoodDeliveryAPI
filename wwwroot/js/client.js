let cart = [];
let currentUser = null;

window.onload = function() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'Client') {
        window.location.href = 'login.html';
        return;
    }
    loadMenu();
};

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function loadMenu() {
    fetch('api/Dishes')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('menu-container');
            container.innerHTML = '';
            
            data.forEach(dish => {
                container.innerHTML += `
                    <div class="col-md-4 col-lg-3">
                        <div class="modern-card h-100 d-flex flex-column">
                            <div class="card-body-custom flex-grow-1">
                                <span class="badge bg-light text-secondary mb-2">${dish.categoryName}</span>
                                <h6 class="fw-bold mb-1">${dish.name}</h6>
                                <p class="small text-muted mb-3">${dish.description}</p>
                                <h5 class="fw-bold text-primary mb-0">${dish.currentPrice.toFixed(2)} ₴</h5>
                            </div>
                            <div class="card-footer bg-white border-0 pb-3 px-3">
                                <button class="btn btn-outline-primary w-100" onclick="addToCart(${dish.id}, '${dish.name.replace(/'/g, "\\'")}', ${dish.currentPrice})">
                                    <i class="bi bi-plus-lg"></i> Додати
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        });
}

function addToCart(id, name, price) {
    let existingItem = cart.find(item => item.dishId === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ dishId: id, name: name, price: price, quantity: 1 });
    }
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.dishId !== id);
    updateCartUI();
}

function updateCartUI() {
    const cartItemsDiv = document.getElementById('cart-items');
    const badge = document.getElementById('cart-badge');
    const formContainer = document.getElementById('checkout-form-container');
    
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
        badge.innerText = totalItems;
        badge.classList.remove('d-none');
        formContainer.style.display = 'block';
    } else {
        badge.classList.add('d-none');
        formContainer.style.display = 'none';
        cartItemsDiv.innerHTML = '<p class="text-muted text-center mt-4">Кошик порожній</p>';
        return;
    }

    cartItemsDiv.innerHTML = '';
    let totalAmount = 0;

    cart.forEach(item => {
        let rowTotal = item.price * item.quantity;
        totalAmount += rowTotal;
        cartItemsDiv.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <div>
                    <h6 class="mb-0 fw-semibold">${item.name}</h6>
                    <small class="text-muted">${item.quantity} шт x ${item.price.toFixed(2)} ₴</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="fw-bold">${rowTotal.toFixed(2)} ₴</span>
                    <button class="btn btn-sm btn-light text-danger" onclick="removeFromCart(${item.dishId})"><i class="bi bi-x-lg"></i></button>
                </div>
            </div>
        `;
    });

    document.getElementById('cart-total').innerText = totalAmount.toFixed(2) + ' ₴';
}

function placeOrder() {
    const orderData = {
        clientId: currentUser.id, 
        deliveryAddress: document.getElementById('order-address').value.trim(),
        chefComment: document.getElementById('order-comment').value.trim(),
        items: cart.map(i => ({ dishId: i.dishId, quantity: i.quantity }))
    };

    fetch('api/Orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    })
    .then(res => {
        if (res.ok) {
            alert('Ваше замовлення успішно прийнято! Смачного!');
            cart = []; 
            updateCartUI();
            document.getElementById('order-address').value = '';
            document.getElementById('order-comment').value = '';
            var offcanvasElement = document.getElementById('cartOffcanvas');
            var offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
            offcanvasInstance.hide();
        } else {
            alert('Сталася помилка при оформленні замовлення.');
        }
    });
}