document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login.html";
      return;
    }
  
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
          categoriesList.innerHTML = "";
          expenseCategorySelect.innerHTML = "";
          categories.forEach(cat => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.textContent = cat.catname;
            categoriesList.appendChild(li);
  
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.catname;
            expenseCategorySelect.appendChild(option);
          });
        } else {
          showMessage(json.message || json.error || "Error al cargar categorías", "danger");
        }
      } catch (err) {
        console.error(err);
        showMessage("Error de conexión con el servidor", "danger");
      }
    }
  
    async function getExpenses() {
      try {
        const res = await fetch("/api/expenses/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (res.ok && json.success) {
          const data = json.data || [];
          expensesTableBody.innerHTML = "";
          let totalExpenses = 0;
          data.forEach(exp => {
            totalExpenses += parseFloat(exp.amount) || 0;
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${exp.id}</td>
              <td>$${(parseFloat(exp.amount) || 0).toFixed(2)}</td>
              <td>${exp.date}</td>
              <td>${exp.descrip}</td>
              <td>${exp.category?.catname || "Sin categoría"}</td>
            `;
            expensesTableBody.appendChild(tr);
          });
          return totalExpenses;
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
        balanceSpan.textContent = `$${(totalIncome - totalExpenses).toFixed(2)}`;
      }
    }
  
    // ------------------ EVENTOS ------------------
    expenseForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById("expenseAmount").value);
      const date = document.getElementById("expenseDate").value;
      const desc = document.getElementById("expenseDesc").value;
      const category_id = parseInt(document.getElementById("expenseCategory").value);
  
      if (isNaN(amount) || !date || !desc || isNaN(category_id)) {
        showMessage("Por favor completa todos los campos correctamente", "danger");
        return;
      }
  
      try {
        const res = await fetch("/api/expenses/", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ amount, date, desc, category_id })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showMessage("Gasto agregado correctamente", "success");
          expenseForm.reset();
          showBalance();
        } else {
          showMessage(data.message || data.error || "Error al agregar gasto", "danger");
        }
      } catch (err) {
        console.error(err);
        showMessage("Error de conexión con el servidor", "danger");
      }
    });
  
    categoryForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const catname = document.getElementById("categoryName").value;
      const desc = document.getElementById("categoryDesc").value;
  
      if (!catname || !desc) {
        showMessage("Por favor completa todos los campos de categoría", "danger");
        return;
      }
  
      try {
        const res = await fetch("/api/category/", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ catname, desc })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showMessage("Categoría agregada correctamente", "success");
          categoryForm.reset();
          getCategories();
        } else {
          showMessage(data.message || data.error || "Error al agregar categoría", "danger");
        }
      } catch (err) {
        console.error(err);
        showMessage("Error de conexión con el servidor", "danger");
      }
    });
  
    // ------------------ INICIALIZACIÓN ------------------
    getCategories();
    showBalance();
  });
  