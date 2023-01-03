'use strict';
//data

const containerMovements = document.querySelector('.movements');
const labelBalance = document.querySelector('.balance__value');
const inputLoginUsername = document.querySelector('.uname');
const inputPassword = document.querySelector('.pin');
const btnlogin = document.querySelector('.arrow');
const mainPart = document.querySelector('.main');
const labelMessage = document.querySelector('.info');
const labelSummIn = document.querySelector('.summary__value--in');
const labelSummout = document.querySelector('.summary__value--out');
const labelIntrest = document.querySelector('.summary__value--interest');

const btnTransfer = document.querySelector('.form__btn');
const transferTo = document.querySelector('.form__input--to');
const transferAmount = document.querySelector('.form__input--amount');
const btnSort = document.querySelector('.btn--sort');

const btnClose = document.querySelector('.form__btn--close');
const closeUser = document.querySelector('.form__input--user');
const closeAccount = document.querySelector('.form__input--pin');


const account1 = {
    owner: 'Ankesh Kumar',
    movements: [250, 150, -98, 300, -120, 4000],
    interestRate: 1.2,
    pin: 1111,
};

const account2 = {
    owner: 'Aniket mumar',
    movements: [1000, 230, -200, -119, 400, 2000],
    interestRate: 1.7,
    pin: 2222,
};

const account3 = {
    owner: 'Ankit numar',
    movements: [300, 289, -2000, 5000, 250, -134],
    interestRate: 1.3,
    pin: 3333,
};

const accounts = [account1, account2, account3];

const displayMovements = function (account, sort = false) {
    containerMovements.innerHTML = ' ';
    const movs = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;
    movs.forEach(function (mov, i) {

        const type = mov > 0 ? 'deposit' : 'withdrawal'

        const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1}${type}</div>
                <div class="movements__value">${mov}</div>
            </div>
        `;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
}
// displayMovements(account1.movements);

const displayBalance = function (acc) {
    acc.balance = acc.movements.reduce(function (acu, mov) {
        return acu + mov;
    }, 0);
    labelBalance.textContent = `${acc.balance}₹`;
};
//displayBalance(account2.movements);

const displaySummary = function (acc) {
    const income = acc.movements.filter(mov => mov > 0).reduce((acu, mov) => acu + mov, 0);
    labelSummIn.textContent = `${income}₹`;

    const out = acc.movements.filter(mov => mov < 0).reduce((acu, mov) => acu + mov, 0);
    labelSummout.textContent = `${Math.abs(out)}₹`;

    const intrest = acc.movements.filter(mov => mov > 0).map(deposits => (deposits * acc.interestRate) / 100)
        .reduce((acu, mov) => acu + mov, 0);
    labelIntrest.textContent = `${intrest}₹`;
};

const userNames = function (accs) {
    accs.forEach(function (acc) {
        acc.userid = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
    });
};
userNames(accounts);

// update UI..
const updateUi = function (acc) {
    displayMovements(acc);
    displayBalance(acc);
    displaySummary(acc);
}

let currentAccount;

btnlogin.addEventListener('click', function () {
    currentAccount = accounts.find(acc =>
        acc.userid === inputLoginUsername.value
    );
    // console.log("username value : " + inputLoginUsername.value);
    // console.log(currentAccount);
    if (currentAccount?.pin === Number(inputPassword.value)) {
        labelMessage.textContent = `Welcome Back , ${currentAccount.owner.split(' ')[0]}`;
        mainPart.style.opacity = 100;
        inputLoginUsername.value = inputPassword.value = '';
        // displayMovements(currentAccount);
        // displayBalance(currentAccount);
        updateUi(currentAccount);
    }
});

btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();

    const amount = Number(transferAmount.value);
    const reciverAcc = accounts.find(
        acc => acc.userid === transferTo.value
    );
    // console.log(amount, reciverAcc)
    if (amount > 0 && reciverAcc && currentAccount.balance >= amount && reciverAcc?.userid !== currentAccount.userid) {
        currentAccount.movements.push(-amount);
        reciverAcc.movements.push(amount);
        transferTo.value = transferAmount.value = '';

        updateUi(currentAccount);
    }
});

btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    if (closeUser.value === currentAccount.userid && Number(closeAccount.value) === currentAccount.pin)
    // console.log('index');
    {
        const index = accounts.findIndex(acc => acc.userid === currentAccount.userid);
        // console.log(index);
        accounts.splice(index, 1);
        mainPart.style.opacity = 0;
    }
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
});