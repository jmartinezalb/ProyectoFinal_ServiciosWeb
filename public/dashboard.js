document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login.html";

    const messageDiv = document.getElementById("message");
    const expensesTableBody = document.querySelector("#expensesTable tbody");
    const categoriesList = document.getElementById("categoriesList");
    const expenseForm = document.getElementById("expenseForm");
    const categoryForm = document.getElementById("categoryForm");
    const expenseCategorySelect = document.getElementById("expenseCategory");

    let categories = [];

    // ------------------ FUNCIONES ------------------
    function showMessage(msg, type = "info") {
        if (!messageDiv) return;
        messageDiv.textContent = msg;
        messageDiv.className = `alert alert-${type}`;
        setTimeout(() => {
            messageDiv.textContent = "";
            messageDiv.className = "";
        }, 4000);
    }

    async function getCategories() {
        try {
            const res = await fetch("/api/category/", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            if (res.ok && json.success) {
                categories = json.data || [];
                renderCategories();
            } else {
                showMessage(json.message || json.error || "Error al cargar categorías", "danger");
            }
        } catch (err) {
            console.error(err);
            showMessage("Error de conexión con el servidor", "danger");
        }
    }

    function renderCategories() {
        categoriesList.innerHTML = "";
        expenseCategorySelect.innerHTML = '<option value="">Selecciona una categoría</option>';
        
        categories.forEach(cat => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";

            li.innerHTML = `
                <span>${cat.catname} - ${cat.desc}</span>
                <div>
                    <button class="btn btn-sm btn-warning edit-cat">Editar</button>
                    <button class="btn btn-sm btn-danger delete-cat">Eliminar</button>
                </div>
            `;
            categoriesList.appendChild(li);

            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.catname;
            expenseCategorySelect.appendChild(option);

            li.querySelector(".edit-cat").addEventListener("click", () => editCategory(cat));
            li.querySelector(".delete-cat").addEventListener("click", () => deleteCategory(cat.id));
        });
    }

    async function getExpenses() {
        try {
            const res = await fetch("/api/expenses/", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            if (res.ok && json.success) {
                const data = json.data || [];
                renderExpenses(data);
                return data.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
            } else {
                showMessage(json.message || json.error || "Error al cargar gastos", "danger");
                return 0;
            }
        } catch (err) {
            console.error(err);
            showMessage("Error de conexión con el servidor", "danger");
            return 0;
        }
    }

    function renderExpenses(expenses) {
        console.log("Datos recibidos para renderizar:", expenses);
        expensesTableBody.innerHTML = "";
        expenses.forEach(exp => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>$${(parseFloat(exp.amount) || 0).toFixed(2)}</td>
                <td>${exp.date}</td>
                <td>${exp.desc || ""}</td>
                <td>${exp.category?.catname || "Sin categoría"}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-btn">Editar</button>
                    <button class="btn btn-sm btn-danger delete-btn">Eliminar</button>
                </td>
            `;
            expensesTableBody.appendChild(tr);
    
            tr.querySelector(".edit-btn").addEventListener("click", () => editExpense(exp));
            tr.querySelector(".delete-btn").addEventListener("click", () => deleteExpense(exp.id));
        });
    }

    async function getIncomes() {
        try {
            const res = await fetch("/api/incomes/", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            if (res.ok && json.success) {
                const data = json.data || [];
                return data.reduce((sum, inc) => sum + (parseFloat(inc.amount) || 0), 0);
            } else {
                showMessage(json.message || json.error || "Error al cargar ingresos", "danger");
                return 0;
            }
        } catch (err) {
            console.error(err);
            showMessage("Error de conexión con el servidor", "danger");
            return 0;
        }
    }

    async function showBalance() {
        const totalExpenses = await getExpenses();
        const totalIncome = await getIncomes();
        const balanceSpan = document.getElementById("balance");
        if (balanceSpan) {
            const balance = totalIncome - totalExpenses;
            balanceSpan.textContent = `$${balance.toFixed(2)}`;
            balanceSpan.className = balance >= 0 ? "text-success" : "text-danger";
        }
    }

    // ------------------ AGREGAR GASTO ------------------
    async function addExpenseHandler(e) {
        e.preventDefault();
        
        const amount = document.getElementById("expenseAmount").value;
        const date = document.getElementById("expenseDate").value;
        const desc = document.getElementById("expenseDesc").value;
        const categoryId = document.getElementById("expenseCategory").value;
    
        console.log("AGREGAR - Datos del formulario:", { amount, date, desc, categoryId });
    
        // PRUEBA: Enviar sin conversiones
        const requestBody = { 
            amount: amount,  // ← Sin parseFloat
            date: date, 
            desc: desc,      // ← Valor directo
            category_id: categoryId  // ← Sin parseInt
        };
    
        console.log("🔍 PRUEBA - Request Body simple:", requestBody);
    
        try {
            const res = await fetch("/api/expenses/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });
    
            const data = await res.json();
            console.log("Respuesta del servidor (AGREGAR):", data);
            
            if (res.ok && data.success) {
                showMessage("Gasto agregado correctamente", "success");
                expenseForm.reset();
                // Restablecer fecha actual
                document.getElementById("expenseDate").value = new Date().toISOString().split('T')[0];
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('addExpenseModal'));
                modal.hide();
                showBalance();
            } else {
                showMessage(data.message || data.error || "Error al agregar gasto", "danger");
            }
        } catch (err) {
            console.error(err);
            showMessage("Error de conexión con el servidor", "danger");
        }
    }
    // ------------------ AGREGAR CATEGORÍA ------------------
    async function addCategoryHandler(e) {
        e.preventDefault();
        
        const catname = document.getElementById("categoryName").value;
        const desc = document.getElementById("categoryDesc").value;

        try {
            const res = await fetch("/api/category/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ catname, desc })
            });

            const data = await res.json();
            
            if (res.ok && data.success) {
                showMessage("Categoría agregada correctamente", "success");
                categoryForm.reset();
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('addCategoryModal'));
                modal.hide();
                getCategories();
            } else {
                showMessage(data.message || data.error || "Error al agregar categoría", "danger");
            }
        } catch (err) {
            console.error(err);
            showMessage("Error de conexión con el servidor", "danger");
        }
    }

   // ------------------ EDITAR GASTO ------------------
   async function editExpense(expense) {
    console.log("Editando gasto:", expense);
    
    // Llenar el formulario con los datos existentes
    document.getElementById("expenseAmount").value = expense.amount;
    document.getElementById("expenseDate").value = expense.date;
    document.getElementById("expenseDesc").value = expense.desc || "";
    document.getElementById("expenseCategory").value = expense.category_id;

    const submitBtn = expenseForm.querySelector("button[type=submit]");
    submitBtn.textContent = "Actualizar";
    submitBtn.className = "btn btn-warning w-100";

    // Crear una copia del event listener original
    const originalSubmitHandler = expenseForm.onsubmit;

    // Función temporal para editar
    const editSubmitHandler = async (e) => {
        e.preventDefault();
        
        const amount = document.getElementById("expenseAmount").value;
        const date = document.getElementById("expenseDate").value;
        const desc = document.getElementById("expenseDesc").value;
        const categoryId = document.getElementById("expenseCategory").value;

        console.log("EDITAR - Enviando datos:", { amount, date, desc, categoryId, expenseId: expense.id });

        try {
            const res = await fetch(`/api/expenses/${expense.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    amount: parseFloat(amount), 
                    date, 
                    desc, 
                    category_id: parseInt(categoryId) 
                })
            });

            const data = await res.json();
            console.log("Respuesta del servidor (EDITAR):", data);
            
            if (res.ok && data.success) {
                showMessage("Gasto actualizado correctamente", "success");
                expenseForm.reset();
                // Restablecer el botón y event listener original
                submitBtn.textContent = "Agregar";
                submitBtn.className = "btn btn-success w-100";
                expenseForm.removeEventListener("submit", editSubmitHandler);
                expenseForm.addEventListener("submit", addExpenseHandler);
                // Restablecer fecha actual
                document.getElementById("expenseDate").value = new Date().toISOString().split('T')[0];
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('addExpenseModal'));
                modal.hide();
                showBalance();
            } else {
                showMessage(data.message || data.error || "Error al actualizar gasto", "danger");
            }
        } catch (err) {
            console.error(err);
            showMessage("Error de conexión con el servidor", "danger");
        }
    };

    // Remover event listeners existentes y agregar el nuevo
    expenseForm.removeEventListener("submit", addExpenseHandler);
    expenseForm.addEventListener("submit", editSubmitHandler);

    // Abrir el modal
    const modal = new bootstrap.Modal(document.getElementById('addExpenseModal'));
    modal.show();
}


    // ------------------ ELIMINAR CATEGORÍA ------------------
    async function deleteCategory(id) {
        if (!confirm("¿Seguro que quieres eliminar esta categoría?")) return;
        
        try {
            const res = await fetch(`/api/category/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const data = await res.json();
            
            if (res.ok && data.success) {
                showMessage("Categoría eliminada correctamente", "success");
                getCategories();
                showBalance();
            } else {
                showMessage(data.message || data.error || "Error al eliminar categoría", "danger");
            }
        } catch (err) {
            console.error(err);
            showMessage("Error de conexión con el servidor", "danger");
        }
    }
    // ------------------ ELIMINAR GASTO ------------------
    async function deleteExpense(id) {
    if (!confirm("¿Seguro que quieres eliminar este gasto?")) return;
    
    try {
        const res = await fetch(`/api/expenses/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await res.json();
        
        if (res.ok && data.success) {
            showMessage("Gasto eliminado correctamente", "success");
            showBalance();
        } else {
            showMessage(data.message || data.error || "Error al eliminar gasto", "danger");
        }
    } catch (err) {
        console.error(err);
        showMessage("Error de conexión con el servidor", "danger");
    }
    }

    // ------------------ LOGOUT ------------------
    function logout() {
        localStorage.removeItem("token");
        window.location.href = "/login.html";
    }
    const logoutBtn = document.createElement("button");
    logoutBtn.className = "btn btn-outline-danger position-absolute top-0 end-0 m-3";
    logoutBtn.textContent = "Cerrar sesión";
    logoutBtn.addEventListener("click", logout);
    
    // Agregar contenedor relativo para posicionamiento absoluto
    document.querySelector('.container').style.position = 'relative';
    document.querySelector('.container').prepend(logoutBtn);

    // ------------------ EVENTOS ------------------
    expenseForm.addEventListener("submit", addExpenseHandler);
    categoryForm.addEventListener("submit", addCategoryHandler);

    // Establecer fecha actual por defecto
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("expenseDate").value = today;

    // ------------------ INICIALIZACIÓN ------------------
    getCategories();
    showBalance();
});