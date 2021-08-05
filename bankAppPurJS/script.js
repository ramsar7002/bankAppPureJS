'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

let accounts = [account1, account2, account3, account4];
let currentActiveAccount = null;
let currentActiveAccountIndex = -1;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//Display the moveements on the screen
let sorttedasc = false;
const displayMovments = (movements, sort = false) => {
  containerMovements.innerHTML = '';

  //Check if want to sort
  const movs = sort
    ? sorttedasc
      ? movements.slice().sort((a, b) => b - a)
      : movements.slice().sort((a, b) => a - b)
    : movements;
  if (sort) sorttedasc = !sorttedasc;
  movs.forEach((mov, i) => {
    const html = `<div class="movements__row">
                    <div class="movements__type movements__type--${
                      mov > 0 ? 'deposit' : 'withdrawal'
                    }">
                        ${i + 1}: ${mov > 0 ? 'DEPOSIT' : 'WITHDRAWAL'}
                    </div>
                    <div class="movements__date">24/01/2037</div>
                    <div class="movements__value">${mov}€</div>
                </div>`;
    containerMovements.insertAdjacentHTML('afterBegin', html);
  });
};

//calculate calculate the incomes, outcomes and interest for a single account
const calculateincomesOutComesAndInterestUnique = account => {
  const movements = account.movements;

  account.incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  account.outcomes = Math.abs(
    movements.filter(mov => mov < 0).reduce((acc, cur) => acc + cur, 0)
  );

  account.interest = movements
    .filter(mov => mov > 0)
    .map(mov => (mov * 1.2) / 100)
    .filter(mov => mov > 1)
    .reduce((acc, cur) => acc + cur);

  account.currentBalance = account.movements.reduce((acc, cur) => {
    return acc + cur;
  });
};

//calculate the incomes, outcomes and interest for all accounts
const calculateincomesOutComesAndInterest = accounts => {
  accounts.forEach(account => {
    calculateincomesOutComesAndInterestUnique(account);
  });
};

calculateincomesOutComesAndInterest(accounts);

//show incomes, outcomes, intersts on the screeen
const calcDisplayBalance = account => {
  labelSumIn.textContent = `${account.incomes}€`;
  labelSumOut.textContent = `${account.outcomes}€`;
  labelSumInterest.textContent = `${account.interest}€`;
  labelBalance.textContent = `${account.currentBalance}€`;
  //labelBalance
};

//Create Users
const createUsers = accounts => {
  accounts.map(account => {
    let user = account.owner;
    let un = user
      .toLowerCase()
      .split(' ')
      .map(word => {
        return word[0];
      })
      .join('');

    account.userName = un;
  });
};

createUsers(accounts);

//Convert euros to usd
const eurToUsd = 1.1;
const totalDepositInUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);

//Login to account logic
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  const userName = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);
  inputLoginUsername.value = '';
  inputLoginPin.value = '';

  accounts.forEach((account, index) => {
    if (account.userName === userName && account.pin === pin) {
      containerApp.style.opacity = 1;
      labelWelcome.textContent = `Welcome back ${account.owner.split(' ')[0]}`;

      inputLoginUsername.blur();
      inputLoginPin.blur();
      currentActiveAccount = account;
      currentActiveAccountIndex = index;
      calculateincomesOutComesAndInterest(accounts);
      calcDisplayBalance(currentActiveAccount);
      displayMovments(currentActiveAccount.movements);
    } else {
      if (index === accounts.length - 1 && currentActiveAccountIndex === -1)
        alert('Username or password are incorrect');
    }
  });
});

//Transfer Money
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const to = inputTransferTo.value;
  const amount = Number(inputTransferAmount.value);
  console.log(to, amount);

  if (amount < currentActiveAccount.currentBalance) {
    const accountFound = accounts.find(acc => {
      return acc.owner === to;
    });
    console.log(accountFound);

    if (!accountFound) {
      alert('Account not found');
    } else {
      inputTransferTo.value = '';
      inputTransferAmount.value = '';
      inputTransferTo.blur();
      inputTransferAmount.blur();
      accountFound.movements.push(amount);
      currentActiveAccount.movements.push(-1 * amount);
      setTimeout(() => {
        calculateincomesOutComesAndInterest(accounts);
        calcDisplayBalance(currentActiveAccount);
        displayMovments(currentActiveAccount.movements);
      }, 2000);
    }
  }
});
//remove accountDisplay from app
const accountDisplayOff = account => {
  document.querySelector('.app').style.opacity = 0;
  labelSumIn.textContent = `0€`;
  labelSumOut.textContent = `0€`;
  labelSumInterest.textContent = `0}€`;
  labelBalance.textContent = `0€`;
};

//Show errorMessage
const showError = (cl, err) => {
  document
    .querySelector(`.${cl}`)
    .insertAdjacentHTML('beforeEnd', `<div class="errorMes">${err}</div>`);

  setTimeout(() => {
    document.querySelector(`.errorMes`).innerHTML = '';
  }, 3000);
};

//Close account
btnClose.addEventListener('click', e => {
  e.preventDefault();
  const user = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  inputCloseUsername.value = '';
  inputClosePin.value = '';
  inputCloseUsername.blur();
  inputClosePin.blur();

  const index = accounts.findIndex(account => {
    return account.userName === user && account.pin === pin;
  });
  if (index != -1) {
    if (currentActiveAccountIndex !== index) {
      showError(
        'operation--close',
        'You should connect to your account and then delete it'
      );
    } else {
      accounts = accounts.filter((acc, i) => {
        return index != i;
      });
      accountDisplayOff(currentActiveAccount);
    }
  } else {
    showError('operation--close', 'Could not find account or incorrect pin');
  }
});

//Request a loan
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';
  const canGetALoan = currentActiveAccount.movements.some(mov => {
    return mov >= amount * 0.1;
  });

  if (canGetALoan) {
    currentActiveAccount.movements.push(amount);
    calcDisplayBalance(currentActiveAccount);
    displayMovments(currentActiveAccount.movements);
  }
});

//Compute overall balance for the bank
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, cur) => acc + cur);

const owners = ['Ram', 'Zach', 'Adam', 'Martha'];

const movs = movements;
movs.sort((a, b) => {
  //return a > b ? 1 : -1;
  return a - b;
});

//Sort the movments
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovments(currentActiveAccount.movements, true);
});

const x = new Array(7);
x.fill(1, 3, 4);
console.log(x);
