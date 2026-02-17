let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let chart;

function addTransaction() {
    const amountInput = document.getElementById("amount").value;
    const amount = parseFloat(amountInput);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value.trim();
    const subcategory = document.getElementById("subcategory").value.trim();

    // Validate amount properly
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount 💗");
        return;
    }

    // Only require category for expense
    if (type === "expense" && category === "") {
        alert("Please enter a category for expense 💗");
        return;
    }

    const transaction = {
        id: Date.now(),
        amount: amount,
        type: type,
        category: type === "expense" ? category : null,
        subcategory: type === "expense" ? subcategory : null
    };

    transactions.push(transaction);
    saveData();
    render();

    // Clear fields after adding
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
    document.getElementById("subcategory").value = "";
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

        if (t.type === "income") {
            income += t.amount;
        } else {
            expense += t.amount;

            if (!categoryTotals[t.category]) {
                categoryTotals[t.category] = 0;
            }
            categoryTotals[t.category] += t.amount;
        }

        const div = document.createElement("div");
        div.className = "transaction-item";

        div.innerHTML = `
            <span>
                ${t.type === "income"
                    ? "💰 Income"
                    : t.category + (t.subcategory ? " - " + t.subcategory : "")
                }
            </span>
            <span style="color:${t.type === "income" ? "#2ecc71" : "#e74c3c"}">
                ${t.type === "income" ? "+" : "-"} ₹${t.amount}
            </span>
        `;

        list.appendChild(div);
    });

    const balance = income - expense;

    document.getElementById("income").textContent = income;
    document.getElementById("expense").textContent = expense;
    document.getElementById("balance").textContent = balance;

    renderChart(categoryTotals);
    calculateSavings();
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
function finalizeSavings() {

    const salary = parseFloat(document.getElementById("salaryAmount").value);
    const goal = parseFloat(document.getElementById("goalAmount").value);

    if (isNaN(salary) || salary <= 0) {
        alert("Please enter a valid salary 💗");
        return;
    }

    if (isNaN(goal) || goal <= 0) {
        alert("Please enter a valid savings goal 💗");
        return;
    }

    let totalExpense = 0;

    transactions.forEach(t => {
        if (t.type === "expense") {
            totalExpense += t.amount;
        }
    });

    const remaining = salary - totalExpense;

    // Update UI
    document.getElementById("remainingSavings").textContent = remaining;
    document.getElementById("displayGoal").textContent = goal;

    const percent = Math.min((remaining / goal) * 100, 100);
    document.getElementById("progressFill").style.width = percent + "%";

    let message = "";

    if (remaining >= goal) {
        message = "You absolutely crushed your savings goal! 🎉";
    } 
    else if (remaining > 0) {
        message = "Not bad at all — you're building awareness 💗";
    } 
    else {
        message = "Overspent this time. Reset, refocus, glow up next month ✨";
    }

    document.getElementById("savingsMessage").textContent = message;
}

document.getElementById("salaryAmount")
    .addEventListener("input", calculateSavings);

document.getElementById("goalAmount")
    .addEventListener("input", calculateSavings);

    // Re-render UI
    render();


}
