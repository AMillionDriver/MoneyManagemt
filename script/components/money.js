const STORAGE_KEY = 'myDashboard.transactions';

// Ambil elemen HTML yang dipakai oleh dashboard.
const form = document.querySelector('#transactionForm');
const incomeInput = document.querySelector('#uangMasuk');
const expenseInput = document.querySelector('#uangKeluar');
const dateInput = document.querySelector('#tanggal');
const totalIncomeEl = document.querySelector('#totalMasuk');
const totalExpenseEl = document.querySelector('#totalKeluar');
const balanceEl = document.querySelector('#saldo');
const tableBody = document.querySelector('#transactionBody');

const transactions = loadTransactions();

// Simpan dan ambil transaksi dari localStorage.
function loadTransactions() {
  const savedTransactions = localStorage.getItem(STORAGE_KEY);

  if (!savedTransactions) {
    return [];
  }

  try {
    return JSON.parse(savedTransactions);
  } catch {
    return [];
  }
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

// Helper untuk angka, rupiah, tanggal, dan label transaksi.
function toNumber(value) {
  return Number(value) || 0;
}

function toPositiveNumber(value) {
  return Math.max(0, toNumber(value));
}

function toRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

function getTransactionNote(income, expense) {
  if (income > 0 && expense > 0) {
    return 'Pemasukan dan pengeluaran';
  }

  if (income > 0) {
    return 'Pemasukan';
  }

  return 'Pengeluaran';
}

function setTodayAsDefault() {
  if (!dateInput) {
    return;
  }

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  dateInput.value = today.toISOString().slice(0, 10);
}

// Render ringkasan saldo dan tabel transaksi.
function renderSummary() {
  const totalIncome = transactions.reduce((total, transaction) => total + transaction.income, 0);
  const totalExpense = transactions.reduce((total, transaction) => total + transaction.expense, 0);
  const balance = totalIncome - totalExpense;

  totalIncomeEl.textContent = toRupiah(totalIncome);
  totalExpenseEl.textContent = toRupiah(totalExpense);
  balanceEl.textContent = toRupiah(balance);
}

function renderTable() {
  if (transactions.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td class="px-5 py-6 text-slate-500" colspan="4">Belum ada data transaksi.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = transactions
    .map((transaction) => `
        <tr class="border-t border-slate-100">
          <td class="px-5 py-4 text-slate-600">${formatDate(transaction.date)}</td>
          <td class="px-5 py-4 font-semibold text-emerald-600">${toRupiah(transaction.income)}</td>
          <td class="px-5 py-4 font-semibold text-rose-600">${toRupiah(transaction.expense)}</td>
          <td class="px-5 py-4 text-slate-600">${transaction.note}</td>
        </tr>
      `)
    .join('');
}

function renderDashboard() {
  renderSummary();
  renderTable();
}

// Submit form dipakai untuk tambah transaksi baru.
function handleSubmit(event) {
  event.preventDefault();

  const income = toPositiveNumber(incomeInput.value);
  const expense = toPositiveNumber(expenseInput.value);
  const date = dateInput.value;

  if (!date) {
    alert('Tanggal wajib diisi.');
    return;
  }

  if (income <= 0 && expense <= 0) {
    alert('Isi uang masuk atau uang keluar terlebih dahulu.');
    return;
  }

  transactions.unshift({
    id: Date.now(),
    date,
    income,
    expense,
    note: getTransactionNote(income, expense),
  });

  saveTransactions();
  renderDashboard();
  form.reset();
  setTodayAsDefault();
}

function handleReset() {
  setTimeout(() => {
    setTodayAsDefault();
  }, 0);
}

// Jalankan logic hanya kalau elemen dashboard tersedia.
if (
  form
  && incomeInput
  && expenseInput
  && dateInput
  && totalIncomeEl
  && totalExpenseEl
  && balanceEl
  && tableBody
) {
  form.addEventListener('submit', handleSubmit);
  form.addEventListener('reset', handleReset);
  setTodayAsDefault();
  renderDashboard();
}
