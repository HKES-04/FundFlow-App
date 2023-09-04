"use strict";

// FUNDFLOW APP

// DIFFERENT DATA! Contains movement dates, currency and locale
const account1 = {
  owner: "Hussein Sultan",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 1111,

  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2023-01-25T14:18:46.235Z",
    "2023-02-05T16:33:06.386Z",
    "2023-04-10T14:43:26.374Z",
    "2023-08-25T18:49:59.371Z",
    "2023-08-30T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account2 = {
  owner: "John Smith",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 2222,

  movementsDates: [
    "2022-11-18T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2023-01-28T09:15:04.904Z",
    "2023-04-01T10:17:24.185Z",
    "2023-05-08T14:11:59.604Z",
    "2023-05-27T17:01:17.194Z",
    "2023-07-11T23:36:17.929Z",
    "2023-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Functions //
function changeDisplay(account) {
  displayMovements(account);
  calcPrintBalance(account);
  calcPrintInfo(account);
}

function displayDate(date, local) {
  function calcDaysDifference(date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  }
  const daysDifference = calcDaysDifference(new Date(), date);
  console.log(daysDifference);
  if (daysDifference === 0) {
    return "Today";
  }
  if (daysDifference === 1) {
    return "Yesterday";
  }
  if (daysDifference <= 7) {
    return `${daysDifference} days ago`;
  } else {
    return new Intl.DateTimeFormat(local).format(date);
  }
}

function displayCurrency(value, local, currency) {
  return new Intl.NumberFormat(local, {
    style: "currency",
    currency: currency,
  }).format(value);
}

function timerLogOut() {
  function timerCountDown() {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${minutes}:${seconds}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = "Log in to get started";
    }

    time--;
  }
  let time = 300;
  timerCountDown();
  const timer = setInterval(timerCountDown, 1000);
  return timer;
}
// //

// Displays the deposits and withdrawals of an account as well as thie dates
function displayMovements(account, sort = false) {
  containerMovements.innerHTML = "";
  const mov = sort
    ? account.movements.slice().sort(function (a, b) {
        return a - b;
      })
    : account.movements;
  mov.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(account.movementsDates[i]);
    const movDate = displayDate(date, account.locale);

    const movFormat = displayCurrency(mov, account.locale, account.currency);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${movDate}</div>
      <div class="movements__value">${movFormat}</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

// Displays the current balance of an account
function calcPrintBalance(account) {
  account.balance = account.movements.reduce(function (acc, val) {
    return acc + val;
  }, 0);
  const movFormat = displayCurrency(
    account.balance,
    account.locale,
    account.currency
  );
  labelBalance.textContent = movFormat;
}

// Displays the incomes, outcomes and interests of an account
function calcPrintInfo(account) {
  const incomes = account.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = displayCurrency(
    incomes,
    account.locale,
    account.currency
  );

  const outcomes = account.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumOut.textContent = displayCurrency(
    Math.abs(outcomes),
    account.locale,
    account.currency
  );

  const interest = account.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (ammount) {
      return (ammount * account.interestRate) / 100;
    })
    .reduce(function (acc, interest) {
      return acc + interest;
    }, 0);
  labelSumInterest.textContent = displayCurrency(
    interest,
    account.locale,
    account.currency
  );
}

// Displays the initials of a username for an account
function createUserNames(userAccounts) {
  userAccounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map(function (name) {
        return name[0];
      })
      .join("");
  });
}
createUserNames(accounts);

// Logs the user in to their account & displays information
let currentAccount, timer;

btnLogin.addEventListener("click", function (e) {
  // Stops page from submitting/releading
  e.preventDefault();

  currentAccount = accounts.find(function (account) {
    return account.username === inputLoginUsername.value;
  });
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }!`;
    containerApp.style.opacity = 100;

    const dateNow = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(dateNow);
    changeDisplay(currentAccount);
  }
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
  inputLoginPin.blur();

  if (timer) {
    clearInterval(timer);
  }
  timer = timerLogOut();
});

// Allows the user to transfer money
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferTo = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  inputTransferAmount.value = "";
  inputTransferTo.value = "";

  if (
    amount > 0 &&
    transferTo &&
    currentAccount.balance >= amount &&
    transferTo?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    transferTo.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    transferTo.movementsDates.push(new Date().toISOString());
    changeDisplay(currentAccount);
    clearInterval(timer);
    timer = timerLogOut();
  }
});

// Allows the user to request a loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const value = Math.floor(inputLoanAmount.value);

  if (
    value > 0 &&
    currentAccount.movements.some(function (val) {
      return val >= value / 10;
    })
  ) {
    setTimeout(function () {
      currentAccount.movements.push(value);
      currentAccount.movementsDates.push(new Date().toISOString());
      changeDisplay(currentAccount);
      clearInterval(timer);
      timer = timerLogOut();
    }, 2500);
  }
  inputLoanAmount.value = "";
});

// Allows the user to close thier account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const removeAcc = accounts.findIndex(function (account) {
      return account.username === currentAccount.username;
    });
    accounts.splice(removeAcc, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = "";
  inputClosePin.value = "";
});

// Sorts the deposits and withdraws
let sortClick = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sortClick);
  sortClick = !sortClick;
});
