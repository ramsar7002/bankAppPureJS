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

const accounts = [account1, account2, account3, account4];
let currentActiveAccount = null

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
const displayMovments = movements => {
  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
    const html = `<div class="movements__row">
                    <div class="movements__type movements__type--${mov > 0 ? 'deposit' : 'withdrawal'
      }">
                        ${i + 1}: ${mov > 0 ? 'DEPOSIT' : 'WITHDRAWAL'}
                    </div>
                    <div class="movements__date">24/01/2037</div>
                    <div class="movements__value">${mov}€</div>
                </div>`;
    containerMovements.insertAdjacentHTML('afterBegin', html);
  });
};

displayMovments(account1.movements);

//calculate the incomes, outcomes and interest
const calculateincomesOutComesAndInterest = accounts => {
  accounts.forEach(account => {
    let movements = account.movements;
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
      return acc + cur
    })
  });



};

calculateincomesOutComesAndInterest(accounts);

//show thr incomes, outcomes, intersts on the screeen
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

btnLogin.addEventListener('click', (e) => {
  e.preventDefault()
  const userName = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value)

  accounts.forEach(account => {
    if (account.userName === userName && account.pin === pin) {
      calcDisplayBalance(account);
      containerApp.style.opacity = 1
      labelWelcome.textContent = `Welcome back ${account.owner.split(' ')[0]}`
      inputLoginUsername.value = ''
      inputLoginPin.value = ''
      inputLoginUsername.blur()
      inputLoginPin.blur()
      currentActiveAccount = account;
    }
  })
})

//Transfer Money
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const to = inputTransferTo.value
  const amount = Number(inputTransferAmount.value)
  console.log(to, amount)

  if (amount < currentActiveAccount.currentBalance) {
    const accountFound = accounts.find(acc => {
      return acc.owner === to;
    })
    console.log(accountFound)

    if (!accountFound) {
      alert('Account not found');
    }
    else {
      accountFound.movements.push(amount);
      currentActiveAccount.movements.push(-1 * amount);
      calculateincomesOutComesAndInterest(accounts);
      calcDisplayBalance(currentActiveAccount);

    }
  }

})