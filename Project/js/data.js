$(document).ready(function () {
    $('#btn-login').click(function () {
        $('#loginModal').modal('show');
    });

    $('#btn-register').click(function () {
        $('#registerModal').modal('show');
    });

    $('#btn-notlogin').click(function () {
        localStorage.setItem('loginEmail', '#');
                    localStorage.setItem('loginPassword', '#');
    });

    $('#registerForm').submit(function (event) {
        event.preventDefault();

        var fullname = $('#fullname').val();
        var email = $('#email').val();
        var password = $('#password').val();

        var request = window.indexedDB.open('SYNERGY_DB', 1);

        request.onerror = function (event) {
            console.log('Ошибка при открытии базы данных:', event.target.errorCode);
        };

        request.onupgradeneeded = function (event) {
            var db = event.target.result;

            var objectStore = db.createObjectStore('Users', { keyPath: 'email' });

            objectStore.createIndex('fullname', 'fullname', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
        };

        request.onsuccess = function (event) {
            var db = event.target.result;
            var transaction = db.transaction(['Users'], 'readwrite');
            var objectStore = transaction.objectStore('Users');

            var userData = {
                fullname: fullname,
                email: email,
                password: password
            };

            var addRequest = objectStore.add(userData);

            addRequest.onsuccess = function (event) {
                console.log('Данные успешно сохранены в IndexedDB.');
            };

            addRequest.onerror = function (event) {
                console.log('Ошибка при сохранении данных в IndexedDB:', event.target.errorCode);
            };

            transaction.oncomplete = function () {
                db.close();
            };
        };
    });

$('#loginForm').submit(function (event) {
    event.preventDefault();

    var loginEmail = $('#loginEmail').val();
    var loginPassword = $('#loginPassword').val();
    localStorage.setItem('loginEmail', loginEmail);
    localStorage.setItem('loginPassword', loginPassword);

    var request = window.indexedDB.open('SYNERGY_DB', 1);

    request.onerror = function (event) {
        console.log('Ошибка при открытии базы данных для входа:', event.target.errorCode);
    };

    request.onsuccess = function (event) {
        var db = event.target.result;

        var transaction = db.transaction(['Users'], 'readonly');
        var objectStore = transaction.objectStore('Users');

        var getRequest = objectStore.get(loginEmail);

        getRequest.onsuccess = function (event) {
            var userData = event.target.result;

            if (userData) {
                if (userData.password === loginPassword) {
                    console.log('Вход выполнен успешно.');

                    localStorage.setItem('userFullName', userData.fullname);
                    localStorage.setItem('userEmail', userData.email);

                    window.location.href = './personal.html'; 

                    $('#loginEmail').val('');
                    $('#loginPassword').val('');
                    $('#loginModal').modal('hide'); 
                } else {
                    localStorage.setItem('loginEmail', '#');
                    localStorage.setItem('loginPassword', '#');
                    alert('Неверный пароль. Попробуйте снова.');
                }
            } else {
                localStorage.setItem('loginEmail', '#');
                localStorage.setItem('loginPassword', '#');
                alert('Пользователь с таким email не зарегистрирован.');
            }
        };

        transaction.onerror = function (event) {
            console.log('Ошибка при поиске пользователя в IndexedDB:', event.target.errorCode);
        };

        transaction.oncomplete = function () {
            db.close();
        };
    };
});

});