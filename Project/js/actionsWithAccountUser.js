function loadUserDataFromIndexedDB() {
    var request = window.indexedDB.open('SYNERGY_DB', 1);

    request.onerror = function (event) {
        console.log('Ошибка при открытии базы данных:', event.target.errorCode);
    };

    request.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction(['Users'], 'readonly');
        var objectStore = transaction.objectStore('Users');
        var email = localStorage.getItem('userEmail');
        var getRequest = objectStore.get(email);

        getRequest.onsuccess = function (event) {
            var userData = event.target.result;
            if (userData) {
                document.getElementById("fullNameValue").textContent = userData.fullname;
                document.getElementById("fullNameInput").value = userData.fullname;
                document.getElementById("emailValue").textContent = userData.email;
                document.getElementById("emailInput").value = userData.email;
                document.getElementById("genderValue").textContent = userData.gender || 'Не указан';
                document.getElementById("genderInput").value = userData.gender || '';
                document.getElementById("birthDateValue").textContent = userData.birthDate || 'Не указана';
                document.getElementById("birthDateInput").value = userData.birthDate || '';
                if (userData.photo) {
                    document.getElementById('userPhoto').src = userData.photo;
                }
            }
        };

        getRequest.onerror = function (event) {
            console.log('Ошибка при загрузке данных пользователя из IndexedDB:', event.target.errorCode);
        };
    };
}

loadUserDataFromIndexedDB();

document.getElementById('uploadPhotoButton').addEventListener('click', function () {
    document.getElementById('photoInput').click();
});

document.getElementById('photoInput').addEventListener('change', function () {
    var file = this.files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            var imageData = event.target.result;
            document.getElementById('userPhoto').src = imageData;
            saveUserPhotoToIndexedDB(imageData); 
        };
    }
});

function saveUserPhotoToIndexedDB(photoData) {
    var email = localStorage.getItem('userEmail');

    var request = window.indexedDB.open('SYNERGY_DB', 1);

    request.onerror = function (event) {
        console.log('Ошибка при открытии базы данных:', event.target.errorCode);
    };

    request.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction(['Users'], 'readwrite');
        var objectStore = transaction.objectStore('Users');
        var getRequest = objectStore.get(email);

        getRequest.onsuccess = function (event) {
            var userData = event.target.result;
            if (userData) {
                userData.photo = photoData;
                var updateRequest = objectStore.put(userData);

                updateRequest.onsuccess = function () {
                    sendUserDataToServer(userData);
                };

                updateRequest.onerror = function (event) {
                    console.log('Ошибка при сохранении фото в IndexedDB:', event.target.errorCode);
                };
            } else {
                console.log('Пользователь не найден.');
            }
        };

        getRequest.onerror = function (event) {
            console.log('Ошибка при получении данных пользователя из IndexedDB:', event.target.errorCode);
        };
    };
}

function toggleInputField(checkbox, inputField) {
    checkbox.addEventListener('change', function () {
        inputField.classList.toggle('d-none');
        if (!inputField.classList.contains('d-none')) {
            inputField.focus();
        }
    });
}

toggleInputField(document.getElementById('changeFullName'), document.getElementById('fullNameInput'));
toggleInputField(document.getElementById('changeEmail'), document.getElementById('emailInput'));
toggleInputField(document.getElementById('changeGender'), document.getElementById('genderInput'));
toggleInputField(document.getElementById('changeBirthDate'), document.getElementById('birthDateInput'));

document.getElementById('saveChangesButton').addEventListener('click', function () {
    var newData = {};
    var email = localStorage.getItem('userEmail'); 
    var changed = false;

    if (document.getElementById('changeFullName').checked) {
        var newFullName = document.getElementById('fullNameInput').value.trim();
        if (newFullName !== '') {
            newData.fullname = newFullName;
            changed = true;
        }
    }

    if (document.getElementById('changeEmail').checked) {
        var newEmail = document.getElementById('emailInput').value.trim();
        if (newEmail !== '' && validateEmail(newEmail)) {
            newData.email = newEmail;
            changed = true;
        } else {
            alert('Введите корректный Email.');
            return;
        }
    }


    if (document.getElementById('changeGender').checked) {
        var newGender = document.getElementById('genderInput').value;
        if (newGender !== '') {
            newData.gender = newGender;
            changed = true;
        }
    }

    if (document.getElementById('changeBirthDate').checked) {
        var newBirthDate = document.getElementById('birthDateInput').value;
        if (newBirthDate !== '') {
            newData.birthDate = newBirthDate;
            changed = true;
        }
    }

    if (changed) {
        var request = window.indexedDB.open('SYNERGY_DB', 1);

        request.onerror = function (event) {
            console.log('Ошибка при открытии базы данных:', event.target.errorCode);
        };

        request.onsuccess = function (event) {
            var db = event.target.result;
            var transaction = db.transaction(['Users'], 'readwrite');
            var objectStore = transaction.objectStore('Users');
            var getRequest = objectStore.get(email);

            getRequest.onsuccess = function (event) {
                var userData = event.target.result;
                if (userData) {
                    if (newData.fullname) {
                        userData.fullname = newData.fullname;
                    }
                    if (newData.email) {
                        userData.email = newData.email;
                    }
                    if (newData.gender) {
                        userData.gender = newData.gender;
                    }
                    if (newData.birthDate) {
                        userData.birthDate = newData.birthDate;
                    }
                    var updateRequest = objectStore.put(userData);

                    updateRequest.onsuccess = function () {
                        document.getElementById('fullNameValue').textContent = userData.fullname;
                        document.getElementById('emailValue').textContent = userData.email;
                        document.getElementById('genderValue').textContent = userData.gender || 'Не указан';
                        document.getElementById('birthDateValue').textContent = userData.birthDate || 'Не указана';

                        sendUserDataToServer(userData);

                        alert('Данные успешно обновлены!');
                    };

                    updateRequest.onerror = function (event) {
                        console.log('Ошибка при обновлении данных в IndexedDB:', event.target.errorCode);
                    };
                } else {
                    console.log('Пользователь не найден.');
                }
            };

            getRequest.onerror = function (event) {
                console.log('Ошибка при получении данных пользователя из IndexedDB:', event.target.errorCode);
            };
        };
    } else {
        alert('Вы не внесли изменений.');
    }
});

function sendUserDataToServer(userData) {
    fetch('https://example.com/api/updateUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Успех:', data);
        })
        .catch((error) => {
            console.error('Ошибка:', error);
        });
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}