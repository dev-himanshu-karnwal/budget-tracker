'use strict';

////////////////////////////////////////////////////////
////////////////// HTML SELECTORS //////////////////////
////////////////////////////////////////////////////////

// Element Selectors for Summary Section
const totalBalance = document.querySelector('.balance');
const totalIncome = document.querySelector('.income');
const totalExpense = document.querySelector('.expense');

// Element Selectors for Add new transaction Section
const [incomeRadio, expenseRadio] = [...document.querySelectorAll('.type')];
const transactionDescription = document.querySelector('#description');
const transactionAmount = document.querySelector('#amount');
const submitBtn = document.querySelector('.submit_button');

// Element Selectors for Show Transactions section
const incomeTable = document.querySelector('.all_incomes');
const expenseTable = document.querySelector('.all_expenses');

//////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////
//////////////////// FUNCTIONS ///////////////////////////
//////////////////////////////////////////////////////////

// Function to receive amount and return formatted currency string
const returnFormatCur = (amt) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR'
}).format(amt);


// Function to update all three values balance,income, expense on page top
const updateTotalValues = function (transactions) {
  totalIncome.textContent = returnFormatCur(transactions.inc);
  totalExpense.textContent = returnFormatCur(transactions.exp) + `(${Math.round(transactions.exp / transactions.inc * 100)}%)`;
  totalBalance.textContent = returnFormatCur(transactions.bal);
}


// Function to update summary on top of Page and transactions object
const updateSummary = function (type, amt, transactions) {

  if (type === 'expense') {
    transactions.exp += amt;
    transactions.bal -= amt;
  }

  else if (type === 'income') {
    transactions.inc += amt;
    transactions.bal += amt;
  }

  updateTotalValues(transactions);
}


// Function to add one table row of transaction to income/expense table and update summary
const addTransactionToPage = function (type, data) {

  // Get in which table transaction to be added 
  let table;
  if (type === 'income')
    table = incomeTable;
  else if (type === 'expense')
    table = expenseTable;

  // Remove hidden class if there to show table
  if (table.closest('div').classList.contains('hidden'))
    table.closest('div').style.opacity = 1;

  // Insert row (transaction)
  table.insertAdjacentHTML('beforeend', `
    <tr>
      <td class="serial_no">${data.no}</td>
      <td>${data.desc}</td>
      <td class="amt">${returnFormatCur(data.amt)}</td>
    </tr >
  `);

}


// Displays error in input details by border red of input field and showing error in placeholder
const displayInputError = function (element, err) {
  element.style.border = 'red solid 2px';
  element.placeholder = err;
}


// Function to add new transaction in records
const addNewTransaction = function (e) {
  e.preventDefault();

  // Get which type of transaction is checked
  const type = ((incomeRadio.checked && incomeRadio) || (expenseRadio.checked && expenseRadio)).value;

  // Get Description of transaction
  const desc = transactionDescription.value;

  // Get Amount of Transaction in number type
  const amt = +transactionAmount.value;

  // Validate the Data Supplied
  // Validate Description
  if (!desc) {
    displayInputError(transactionDescription, 'Input Tranasction Description');
    return;
  }

  // Validate Amount
  if (amt <= 0) {
    displayInputError(transactionAmount, 'Input Valid Tranasction Amount');
    return;
  }

  // Make Object of all details
  const transaction = {
    no: transactions[type].length + 1,
    desc,
    amt
  };

  // Push new transaction in array of respective type
  transactions[type].push(transaction);

  // Update summary on page
  updateSummary(type, transaction.amt, transactions);

  // Show new transaction to the page
  addTransactionToPage(type, transaction);

  // Remove contents from input field
  document.querySelector('form').reset();
  transactionAmount.blur();
  transactionDescription.blur();

  // Save transactions object to local storage
  localStorage.setItem('transactions', JSON.stringify(transactions));
}


// Removes error styles from input field
const removeInputError = function (e) {
  e.target.style.border = 'none';
  e.target.placeholder = '';
}


// Function to display all transacions stored in local storage
const displayAll = function (transactions) {
  // Update all three values of summary on page
  updateTotalValues(transactions);

  // Show all Transactions on page 
  transactions.income.forEach(trans => addTransactionToPage('income', trans));
  transactions.expense.forEach(trans => addTransactionToPage('expense', trans));
}


//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
////////////////// EVENT LISTENERS ///////////////////////
//////////////////////////////////////////////////////////

// Even Listener attached to submit button for adding new transaction
submitBtn.addEventListener('click', addNewTransaction);

// Event Listeners attached to remove red border and validation info in placeholders  
transactionDescription.addEventListener('focus', removeInputError);
transactionAmount.addEventListener('focus', removeInputError);


///////////////////////////////////////////////////////////
///////////////// First to execute code ///////////////////
///////////////////////////////////////////////////////////

// Fetch old  transations from local storage 
let transactions = JSON.parse(localStorage.getItem('transactions'));

// If previous any then display them 
if (transactions)
  displayAll(transactions);
// else assign a new transactions object
else
  transactions = {
    bal: 0,
    inc: 0,
    exp: 0,
    income: [],
    expense: []
  };

// Get fade out animation on load of page
document.body.style.opacity = 1;
