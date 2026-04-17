const PASSWORD = 'molook2024';
let isAuthenticated = false;

// Elements
const loginForm = document.getElementById('loginForm');
const dashboard = document.getElementById('dashboard');
const formLogin = document.getElementById('formLogin');
const password = document.getElementById('password');
const loginError = document.getElementById('loginError');
const btnAddProduct = document.getElementById('btnAddProduct');
const formContainer = document.getElementById('formContainer');
const formProduct = document.getElementById('formProduct');
const btnCancel = document.getElementById('btnCancel');
const btnLogout = document.getElementById('btnLogout');
const tableBody = document.getElementById('tableBody');
const message = document.getElementById('message');
const productCount = document.getElementById('productCount');

// Login
formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    if (password.value === PASSWORD) {
        isAuthenticated = true;
        loginForm.style.display = 'none';
        dashboard.style.display = 'block';
        document.body.style.background = 'var(--light-bg)';
        loadProducts();
        password.value = '';
    } else {
        loginError.textContent = 'كلمة المرور غير صحيحة';
        loginError.style.display = 'block';
        password.value = '';
        setTimeout(() => {
            loginError.style.display = 'none';
        }, 3000);
    }
});

// Logout
btnLogout.addEventListener('click', () => {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        isAuthenticated = false;
        loginForm.style.display = 'block';
        dashboard.style.display = 'none';
        formContainer.style.display = 'none';
        password.value = '';
        loginError.textContent = '';
        document.body.style.background = 'linear-gradient(135deg, var(--primary-color) 0%, #d4a574 100%)';
    }
});

// Toggle Add Product Form
btnAddProduct.addEventListener('click', () => {
    formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
    if (formContainer.style.display === 'block') {
        document.getElementById('productName').focus();
    }
});

btnCancel.addEventListener('click', () => {
    formContainer.style.display = 'none';
    formProduct.reset();
});

// Add Product
formProduct.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', document.getElementById('productName').value);
    formData.append('description', document.getElementById('productDesc').value);
    formData.append('price', document.getElementById('productPrice').value);
    formData.append('image', document.getElementById('productImage').files[0]);

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showMessage('✅ تم إضافة المنتج بنجاح', 'success');
            formProduct.reset();
            formContainer.style.display = 'none';
            loadProducts();
        } else {
            showMessage('❌ حدث خطأ في إضافة المنتج', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('❌ خطأ في الاتصال بالخادم', 'error');
    }
});

// Load Products
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        
        productCount.textContent = products.length;
        
        if (products.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">لا توجد منتجات</td></tr>';
            return;
        }

        tableBody.innerHTML = products.map(product => `
            <tr>
                <td><img src="${product.image}" alt="${product.name}" class="table-image"></td>
                <td>${product.name}</td>
                <td>${product.description.substring(0, 30)}...</td>
                <td>${product.price} ريال</td>
                <td><button onclick="deleteProduct('${product.id}')" class="btn-delete">حذف</button></td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
        tableBody.innerHTML = '<tr><td colspan="5">خطأ في التحميل</td></tr>';
    }
}

// Delete Product
async function deleteProduct(id) {
    if (!confirm('هل تريد حذف هذا المنتج؟')) return;

    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showMessage('✅ تم حذف المنتج بنجاح', 'success');
            loadProducts();
        } else {
            showMessage('❌ حدث خطأ في الحذف', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('❌ خطأ في الاتصال بالخادم', 'error');
    }
}

// Show Message
function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
    setTimeout(() => {
        message.textContent = '';
        message.className = 'message';
    }, 3000);
}