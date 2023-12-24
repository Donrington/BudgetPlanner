const transactions = 
JSON.parse(localStorage.getItem('transactions')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderList();
    updateTotal();
});

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
    signDisplay: 'always'
});

const list = document.getElementById("transactionList");
const form = document.getElementById('transactionForm');
const status = document.getElementById('status');
const balance = document.getElementById('balance');
const expense = document.getElementById('expense');


const addTransactionButton = document.getElementById('addTransactionButton');

// Add event listener to the button
addTransactionButton.addEventListener('click', addTransaction);

function updateTotal() {
    const incomeTotal = transactions.filter((trx) => trx.type === 'income').reduce((total, trx) => total + trx.amount, 0);

    const expenseTotal = transactions.filter((trx) => trx.type === 'expense').reduce((total, trx) => total + trx.amount, 0);

    const balanceTotal = incomeTotal - expenseTotal;

    console.log('Income:', incomeTotal);
    console.log('Expense:', expenseTotal);
    console.log('Balance:', balanceTotal);

    balance.textContent = formatter.format(balanceTotal).substring(1);
    income.textContent = formatter.format(incomeTotal);
    expense.textContent = formatter.format(expenseTotal * -1);
}


function renderList() {
    list.innerHTML = "";

    if (transactions.length === 0) {
        status.textContent = "No transactions";
        return;
    }
    transactions.forEach(({ id, name, amount, date, type }) => {
        const sign = 'income' === type ? 1 : -1;

        const li = document.createElement('li');

        li.innerHTML = `
        <div class='name'>
            <h4>${name}</h4>
            <p>${new Date(date).toLocaleDateString()}</p>
        </div>

        <div class="amount ${type}">
            <span>${type === 'income' ? '+' : '-'}${formatter.format(Math.abs(amount))}</span>
        </div>

        <div class="action">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" onclick="deleteTransaction(${id})">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        </div>
        `;

        list.appendChild(li);
    });
}

renderList();
updateTotal();

function deleteTransaction(id) {
    const index = transactions.findIndex((trx) => trx.id === id);
    transactions.splice(index, 1);

    updateTotal();
    saveTransaction();
    renderList();
}

function addTransaction() {
    const formData = new FormData(form);

    transactions.push({
        id: transactions.length + 1,
        name: formData.get('name'),
        amount: parseFloat(formData.get('amount')),
        date: new Date(formData.get('date')),
        type: 'on' === formData.get('type') ? 'income' : 'expense',
    });

    form.reset(); // Reset the form fields

    updateTotal();
    saveTransaction();
    renderList();
}


function saveTransaction(){

transactions.sort((a, b)=> new Date(b.date)- new Date(a.date));

// transactions.forEach((trx) => {
//     const sign = 'income' === trx.type ? 1 : -1;
//     trx.amount = trx.amount * sign;
// });

    localStorage.setItem('transactions', JSON.stringify(transactions));
}