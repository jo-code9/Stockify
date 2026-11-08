
const API_URL = 'http://localhost:3000/api/products';
let allProducts = [];


// Mengambil dan menampilkan data produk
async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        
        updateDashboard(result.data);
        allProducts = result.data;
        updateCategoryFilter();

        const productList = document.getElementById('product-list');

        productList.innerHTML = '';

        if (result.data.length === 0) {
            productList.innerHTML = `
                <tr>
                    <td colspan="7">Belum ada data barang.</td>
                </tr>
            `;
            return;
        }

        result.data.forEach((product, index) => {
            productList.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>Rp ${product.price}</td>
                    <td>${product.stock}</td>
                    <td>${product.category || '-'}</td>
                    <td>
                    ${
                        Number(product.stock) === 0
                        ? '<span class="status-habis">Habis</span>'
                        : Number(product.stock) <= 5
                        ? '<span class="status-menipis">Menipis</span>'
                        : '<span class="status-tersedia">Tersedia</span>'
                    }
                    </td>    
                    <td>
                    <button onclick="editProduct(${product.id})">Edit</button>
                    <button onclick="deleteProduct(${product.id})">Hapus</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error('Gagal mengambil data:', error);
    }
}

loadProducts();

// Mengisi pilihan kategori secara otomatis
function updateCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');

    const selectedCategory = categoryFilter.value;

    const categories = [
        ...new Set(
            allProducts
                .map(product => product.category)
                .filter(category => category && category.trim() !== '')
        )
    ];

    categoryFilter.innerHTML = '<option value="">Semua Kategori</option>';

    categories.forEach(category => {
        categoryFilter.innerHTML += `
            <option value="${category}">${category}</option>
        `;
    });

    categoryFilter.value = selectedCategory;
}
// Menambahkan produk baru
document.getElementById('product-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const product = {
        name: document.getElementById('name').value,
        price: Number(document.getElementById('price').value),
        stock: Number(document.getElementById('stock').value),
        category: document.getElementById('category').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        const result = await response.json();

        if (result.success) {
            alert('Barang berhasil ditambahkan!');
            document.getElementById('product-form').reset();
            loadProducts();
        } else {
            alert('Gagal menambahkan barang: ' + result.message);
        }

    } catch (error) {
        console.error('Gagal menambahkan barang:', error);
        alert('Terjadi kesalahan saat menambahkan barang.');
    }
});

// Mengedit produk
async function editProduct(id) {
    try {
        // Mengambil data produk berdasarkan ID
        const response = await fetch(`${API_URL}/${id}`);
        const result = await response.json();

        if (!result.success) {
            alert('Produk tidak ditemukan!');
            return;
        }

        const product = result.data;

        // Meminta data baru dari pengguna
        const name = prompt('Nama Barang:', product.name);
        if (name === null) return;

        const price = prompt('Harga:', product.price);
        if (price === null) return;

        const stock = prompt('Stok:', product.stock);
        if (stock === null) return;

        const category = prompt('Kategori:', product.category || '');
        if (category === null) return;

        // Mengirim perubahan ke API
        const updateResponse = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                price: Number(price),
                stock: Number(stock),
                category: category
            })
        });

        const updateResult = await updateResponse.json();

        if (updateResult.success) {
            alert('Barang berhasil diperbarui!');
            loadProducts();
        } else {
            alert('Gagal mengubah barang: ' + updateResult.message);
        }

    } catch (error) {
        console.error('Gagal mengedit barang:', error);
        alert('Terjadi kesalahan saat mengedit barang.');
    }
}

// Menghapus produk
async function deleteProduct(id) {
    const confirmation = confirm('Apakah kamu yakin ingin menghapus barang ini?');

    if (!confirmation) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            alert('Barang berhasil dihapus!');
            loadProducts();
        } else {
            alert('Gagal menghapus barang: ' + result.message);
        }

    } catch (error) {
        console.error('Gagal menghapus barang:', error);
        alert('Terjadi kesalahan saat menghapus barang.');
    }
}

function updateDashboard(products) {
    document.getElementById('total-products').textContent = products.length;

    const totalStock = products.reduce((total, product) => {
        return total + Number(product.stock);
    }, 0);

    document.getElementById('total-stock').textContent = totalStock;

    const categories = new Set(
        products
            .map(product => product.category)
            .filter(category => category && category.trim() !== '')
    );

    document.getElementById('total-categories').textContent = categories.size;

    // Menghitung barang dengan stok menipis
const lowStock = products.filter(product => {
    return Number(product.stock) > 0 && Number(product.stock) <= 5;
});

// Menghitung barang dengan stok habis
const outStock = products.filter(product => {
    return Number(product.stock) === 0;
});

// Menampilkan hasil ke dashboard
document.getElementById('low-stock').textContent = lowStock.length;
document.getElementById('out-stock').textContent = outStock.length;
}

// Menghubungkan pencarian dan filter
document.getElementById('search-input').addEventListener('input', filterProducts);

document.getElementById('category-filter').addEventListener('change', filterProducts);

document.getElementById('status-filter').addEventListener('change', filterProducts);

// Menggabungkan fitur pencarian dan filter
function filterProducts() {
    const keyword = document.getElementById('search-input').value.toLowerCase();
    const selectedCategory = document.getElementById('category-filter').value;
    const selectedStatus = document.getElementById('status-filter').value;

    const rows = document.querySelectorAll('#product-list tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const category = row.cells[4]?.textContent.trim();

        const stock = Number(row.cells[3]?.textContent);

        let status = 'tersedia';

        if (stock === 0) {
            status = 'habis';
        } else if (stock <= 5) {
            status = 'menipis';
        }

        const cocokKeyword = text.includes(keyword);
        const cocokKategori = !selectedCategory || category === selectedCategory;
        const cocokStatus = !selectedStatus || status === selectedStatus;

        row.style.display =
            cocokKeyword && cocokKategori && cocokStatus ? '' : 'none';
    });
}