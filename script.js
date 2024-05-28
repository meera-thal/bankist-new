'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-08-07T17:01:17.194Z',
    '2023-08-08T23:36:17.929Z',
    '2023-08-09T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', 
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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

/////////////////////////////////////////////////
// let timer;


// const startLogoutTimer = function(){
//     const tick = function(){
//     const sec = String(Math.floor(time%60)).padStart(2,0);
//     const min = String(Math.floor(time/60)).padStart(2,0);
//     labelTimer.textContent=`${min}:${sec}`
//     if(time === 0)
//     {clearInterval(timer)
//       containerApp.style.opacity= 0;
//       labelWelcome.textContent= `Login to get started`
//     }
//     time--;
//   }
  
//   let time = 120;
//   tick();
//   timer = setInterval(tick, 1000)
//   return timer;

//}

const formatMovementDates = function (date, locale){

    const calcDays = (date1, date2) => Math.round(Math.abs((date1 - date2)/(1000*60*60*24)));
    const daysPassed =  calcDays(new Date(), date)
    if(daysPassed === 0) return 'Today'
    if(daysPassed === 1) return 'Yesterday'
    if(daysPassed <= 7) return `${daysPassed} days ago`
    else return Intl.DateTimeFormat(locale).format(date)
}
 

const currencyFormatter = function(value, locale, currency){
const format = new Intl.NumberFormat(locale,{
  style:'currency', 
  currency:currency,}).format(value);
return format;
}

const updateUI = function(){

  displayMovements(currentaccount)
  accountBalanceSummary(currentaccount);
  accountBalance(currentaccount);

}

const displayMovements = function(currentaccount, sort = false){
  containerMovements.innerHTML = ""
  const movementSort = sort?currentaccount.movements.slice().sort((a,b) => a-b): currentaccount.movements;
  
  movementSort.forEach(function(mov, i)
  {
    const date = new Date(currentaccount.movementsDates[i])
    const displayDate = formatMovementDates(date, mov.locale);
    const currency = currencyFormatter(mov,currentaccount.locale, currentaccount.currency)
    console.log(currency)

    const type = mov>0? 'deposit': 'withdrawal'
    const html =  `
    <div class="movements__row">
    <div class= "movements__type movements__type--${type}">${i+1, type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${currency}</div>`
    containerMovements.insertAdjacentHTML('afterbegin', html)
  }
  )

}

const username = function(acc){
  acc.forEach(function(value){
  value.username = value.owner
  .toLowerCase()
  .split(' ')
  .map(item=>item[0])
  .join('')
});

}
username(accounts);

const accountBalance = function(acc){
  let balance = acc.movements.reduce(function(acc,curr){
    return acc+curr;
  }, 0);
  acc.balance = balance;
  labelBalance.textContent = `${currencyFormatter(balance,acc.locale, acc.currency)}`;
}


const accountBalanceSummary = function(currentaccount){
  const accountBalance = currentaccount.movements
  .filter(mov => mov>0)
  .reduce((acc,mov) => acc+mov,0)
  console.log(currentaccount.currency)
 
  labelSumIn.textContent=`${currencyFormatter(accountBalance,currentaccount.locale, currentaccount.currency)}`

  const out = currentaccount.movements
  .filter(mov => mov<0)
  .reduce((acc,mov) => acc+mov,0)

  labelSumOut.textContent=`${currencyFormatter(out,currentaccount.locale, currentaccount.currency)}`

  const interest = currentaccount.movements
  .map(mov => mov *currentaccount.interestRate/100)
  .filter(mov => mov>1)
  .reduce((acc,mov) => acc+mov,0)
  labelSumInterest.textContent=`${currencyFormatter(interest,currentaccount.locale, currentaccount.currency)}`

}




let currentaccount;
btnLogin.addEventListener('click', e =>{
e.preventDefault();

currentaccount = accounts.find(acc => acc.username ===inputLoginUsername.value);

if(currentaccount?.pin === +inputLoginPin.value)
{
  //display UI and Welcome message
  containerApp.style.opacity = 100;
  labelWelcome.textContent= `Welcome back, ${currentaccount.owner.split(' ')[0]}`;
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();

  const now = new Date()
  const options= {
    hour: 'numeric',
    minute:'numeric',
    day:'numeric',
    month:'numeric',
    year:'numeric',
  }
// const year = now.getFullYear();
// const month = `${now.getMonth()+1}`.padStart(2,0);
// const date = `${now.getDay()}`.padStart(2,0);
// const hours = now.getHours();
// const minutes = now.getMinutes();

labelDate.textContent = new Intl.DateTimeFormat(currentaccount.locale,options).format(now)

updateUI(currentaccount);
if(timer) clearInterval(timer)
timer = startLogoutTimer();

}
}
)

btnTransfer.addEventListener('click', e =>{
  e.preventDefault()
  const amount = Math.floor(Number(inputTransferAmount.value));
  const receiverAcc = accounts.find(acc => acc.username===inputTransferTo.value)

  if(amount>0 && receiverAcc && currentaccount.balance>=amount && receiverAcc != currentaccount)
  {
    receiverAcc.movements.push(amount)
    currentaccount.movements.push(-amount)
    currentaccount.movementsDates.push(new Date().toISOString())
    receiverAcc.movementsDates.push(new Date().toISOString())

    updateUI(currentaccount);
  }
  inputTransferAmount.value = inputTransferTo.value = ''
  if(timer) clearInterval(timer)
 timer = startLogoutTimer();

}
)

btnClose.addEventListener('click', e => {
e.preventDefault()

if(inputCloseUsername.value === currentaccount.username && +inputClosePin.value === currentaccount.pin){
  const index = accounts.findIndex(acc => acc.username === currentaccount.username)
  accounts.splice(index, 1)
}
inputCloseUsername.value = inputClosePin.value = '';
containerApp.style.opacity = 0;
})

btnLoan.addEventListener('click', e => {
  e.preventDefault()
  const amount = +Math.floor(inputLoanAmount.value).toFixed(2)
  if( amount> 0 && currentaccount.movements.find(acc => acc>= amount *0.1)){
    currentaccount.movements.push(amount)
    currentaccount.movementsDates.push(new Date().toISOString())
    
  }
  inputLoanAmount.value=''
  updateUI(currentaccount)
  if(timer) clearInterval(timer)
  timer = startLogoutTimer();
})

let sorted = false;
btnSort.addEventListener('click', e =>{
displayMovements(currentaccount, !sorted)
sorted = !sorted;
})