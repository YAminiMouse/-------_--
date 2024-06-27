$(document).ready(function () {
  $('#btn-login').click(function () {
    $('#loginModal').modal('show');
  });

  $('#btn-register').click(function () {
    $('#registerModal').modal('show');
  });

  $('#registerForm').submit(function (event) {
    event.preventDefault();

    $('#errorMessages').empty();

    var fullname = $('#fullname').val().trim();
    var email = $('#email').val().trim();
    var password = $('#password').val().trim();

    if (fullname === '' || email === '' || password === '') {
      $('#errorMessages').text('Пожалуйста, заполните все поля.');
      return;
    }

    $('#fullname').val('');
    $('#email').val('');
    $('#password').val('');
    $('#registerModal').modal('hide');
  });
});
