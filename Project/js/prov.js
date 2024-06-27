
var btnLogin = document.getElementById('btn-login');
var btnRegister = document.getElementById('btn-register');
var btnKab = document.getElementById('btn-kab');
var nlogin = document.getElementById('btn-notlogin');

var storedLoginEmail = localStorage.getItem('loginEmail');
var storedLoginPassword = localStorage.getItem('loginPassword');

if (storedLoginEmail === null || storedLoginPassword === null) {
    console.log('Данные не найдены в localStorage');
} else {
    console.log('Данные найдены в localStorage');

    if (storedLoginEmail === '#' && storedLoginPassword === '#') {
        btnLogin.style.display = 'block';
        btnRegister.style.display = 'block';
        btnKab.style.display = 'none';
        nlogin.style.display = 'none';
    } else {
        btnLogin.style.display = 'none';
        btnRegister.style.display = 'none';
        btnKab.style.display = 'block';
        nlogin.style.display = 'block';
    }
}

