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

  movementsDates: [
    '2021-08-04T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2021-08-05T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'US',
  locale: 'pt-PT', // de-DE
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
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

//return full date as string
const getFullDate = (account, i)=>{
  const date = new Date(account.movementsDates[i]);
  const day = `${date.getDay()+1}`.padStart(2,'0')
  const month = `${date.getMonth()+1}`.padStart(2,'0')
  const year = date.getFullYear();
  let nowStr = `${day}/${month}/${year}`
  
  let now = new Date();
  const calcDate = (now-date)/ (1000*60*60*24)

  if(calcDate<1){
    nowStr='Today'
  }
  else
  if(calcDate<2){
    nowStr='Yesterday'
  }
  else if(calcDate<3){
    nowStr='2 Days ago'
  }



  return nowStr;
}


const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//Display the moveements on the screen
let sorttedasc = false;
const displayMovments = (account, sort = false) => {
  const movements = account.movements
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
                    <div class="movements__type movements__type--${mov > 0 ? 'deposit' : 'withdrawal'
      }">
                        ${i + 1}: ${mov > 0 ? 'DEPOSIT' : 'WITHDRAWAL'}
                    </div>
                    <div class="movements__date">${getFullDate(account, i)}</div>
                    <div class="movements__value">${mov}€</div>
                </div>`;
    containerMovements.insertAdjacentHTML('afterBegin', html);
  });

  [...document.querySelectorAll('.movements__row')].forEach((row,i)=>{
    if(i%2===0) row.style.backgroundColor='#ffe6e6'
  })
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
    .reduce((acc, cur) => acc + cur).toFixed(1);

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
  labelSumOut.textContent = `${account.outcomes.toFixed(2)}€`;
  labelSumInterest.textContent = `${account.interest}€`;
  labelBalance.textContent = `${account.currentBalance.toFixed(2)}€`;
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

  //Start a timer 
  const startLogOutTimer = ()=>{
    //Set time to 5 minute
    let time = 300;
    //Call the timer every second
    let countdown = setInterval(() => {

      let min = Math.floor(time / 60);
      // define our seconds by modulating time with 60, our seconds units
      let sec = time % 60;
      
      // tenerary conditional to see if seconds is set to 0 for proper display of formatting as seconds 
      sec = sec < 10 ? '0' + sec : sec;
      labelTimer.textContent=`${min}:${sec}`;
      time--;

      if(min===0 && sec===0){
        clearInterval(countdown);
        containerApp.style.opacity=0;
        currentActiveAccount=null;
      }

    }, 1000);

  }

//Login to account logic
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  const userName = inputLoginUsername.value;
  const pin = +(inputLoginPin.value);
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
      displayMovments(currentActiveAccount);

      const now = new Date();
      const day = `${now.getDay()+1}`.padStart(2,'0')
      const month = `${now.getMonth()+1}`.padStart(2,'0')
      const year = now.getFullYear();
      const hour = `${now.getHours()}`.padStart(2,'0')
      const minutes = `${now.getMinutes()}`.padStart(2,'0')
      const nowStr = `${day}/${month}/${year}, ${hour}:${minutes}`
    
      labelDate.textContent=nowStr

      startLogOutTimer();
      
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
  const amount = (+inputTransferAmount.value).toFixed(1);
  
  

  if (amount < currentActiveAccount.currentBalance) {
    const accountFound = accounts.find(acc => {
      return acc.owner === to;
    });

    if (!accountFound) {
      alert('Account not found');
    } else {
      inputTransferTo.value = '';
      inputTransferAmount.value = '';
      inputTransferTo.blur();
      inputTransferAmount.blur();
      accountFound.movements.push(amount);
      accountFound.movementsDates.push(new Date().toISOString());
      currentActiveAccount.movements.push(-1 * amount);
      currentActiveAccount.movementsDates.push(new Date().toISOString());

      setTimeout(() => {
        calculateincomesOutComesAndInterestUnique(currentActiveAccount);
        calcDisplayBalance(currentActiveAccount);
        displayMovments(currentActiveAccount);
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
  const pin = +(inputClosePin.value);
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
  const amount = +(inputLoanAmount.value);
  inputLoanAmount.value = '';
  const canGetALoan = currentActiveAccount.movements.some(mov => {
    return mov >= amount * 0.1;
  });

  if (canGetALoan) {
    currentActiveAccount.movements.push(amount);
    currentActiveAccount.movementsDates.push(new Date().toISOString())
    calculateincomesOutComesAndInterestUnique(currentActiveAccount);
    calcDisplayBalance(currentActiveAccount);
    displayMovments(currentActiveAccount);
  }
  else alert(`You can't gat a lone`)
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
  displayMovments(currentActiveAccount, true);
});

//Get UI movments to the program
const x = new Array(7);
//x.fill(1, 3, 4);
//const y = Array.from({ length: 7 }, () => 1);

const z = Array.from({ length: 7 }, (cur, i) => i + 1);

const r = Array.from({ length: 100 }, (cur, i) => {
  return (cur = Math.floor(Math.random() * 100));
});

labelBalance.addEventListener('click', () => {
  const movmentsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => +(el.textContent.replace('€', ''))
  );

});

//