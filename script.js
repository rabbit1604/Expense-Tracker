let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let chart;

function addTransaction() {
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;
    const subcategory = document.getElementById("subcategory").value;

    if (!amount || !category) return;

    const transaction = {
        id: Date.now(),
        amount,
        type,
        category,
        subcategory
    };

    transactions.push(transaction);
    saveData();
    render();
}

function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function render() {
    let income = 0;
    let expense = 0;

    const list = document.getElementById("transactionList");
    list.innerHTML = "";

    const categoryTotals = {};

    transactions.forEach(t => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;

        if (!categoryTotals[t.category]) {
            categoryTotals[t.category] = 0;
        }
        if (t.type === "expense") {
            categoryTotals[t.category] += t.amount;
        }

        const div = document.createElement("div");
        div.className = "transaction-item";
        div.innerHTML = `
            <span>${t.category} - ${t.subcategory}</span>
            <span>₹${t.amount}</span>
        `;
        list.appendChild(div);
    });

    document.getElementById("balance").textContent = income - expense;
    document.getElementById("income").textContent = income;
    document.getElementById("expense").textContent = expense;

    renderChart(categoryTotals);
}

function renderChart(data) {
    const ctx = document.getElementById("expenseChart");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    "#f3a6d5",
                    "#f7c8e0",
                    "#c26dbc",
                    "#f1d4ea",
                    "#eabfff"
                ]
            }]
        }
    });
}

function updateSavings() {
    const goal = parseFloat(document.getElementById("goalAmount").value);
    const saved = parseFloat(document.getElementById("savedAmount").value);

    if (!goal || !saved) return;

    const percent = Math.min((saved / goal) * 100, 100);

    document.getElementById("progressFill").style.width = percent + "%";

    const message = percent >= 100 
        ? "You did it! 🌸 So proud of you!"
        : percent >= 70
        ? "Almost there! Keep going!✨"
        : "Slow progress is still progress 💗";

    document.getElementById("savingsMessage").textContent = message;
}

render();
function clearAllData() {
    const confirmReset = confirm(
        "Are you sure you want to clear all data? This cannot be undone"
    );

    if (!confirmReset) return;

    // Clear transactions array
    transactions = [];

    // Clear localStorage
    localStorage.removeItem("transactions");

    // Reset savings fields
    document.getElementById("goalAmount").value = "";
    document.getElementById("savedAmount").value = "";
    document.getElementById("progressFill").style.width = "0%";
    document.getElementById("savingsMessage").textContent = "";

    // Destroy chart if exists
    if (chart) {
        chart.destroy();
    }
function calculateSavings() {
    const salary = parseFloat(document.getElementById("salaryAmount").value) || 0;
    const goal = parseFloat(document.getElementById("goalAmount").value) || 0;

    let totalExpense = 0;

    transactions.forEach(t => {
        if (t.type === "expense") {
            totalExpense += t.amount;
        }
    });

    const remaining = salary - totalExpense;

    if (salary === 0 || goal === 0) return;

    const percent = Math.min((remaining / goal) * 100, 100);

    document.getElementById("progressFill").style.width = percent + "%";

    let message = "";

    if (remaining >= goal) {
        message = "You did it! 🎉 You reached your savings goal!";
    } else if (remaining > 0) {
        message = "You're close! Keep managing wisely 💗";
    } else {
        message = "Oops! Overspending happened. No worries, next month glow up ✨";
    }

    document.getElementById("savingsMessage").textContent =
        `Remaining Savings: ₹${remaining} — ${message}`;
}
document.getElementById("salaryAmount")
    .addEventListener("input", calculateSavings);

document.getElementById("goalAmount")
    .addEventListener("input", calculateSavings);

    // Re-render UI
    render();
    calculateSavings();

}
