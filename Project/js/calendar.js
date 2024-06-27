$(document).ready(function () {
    // Инициализация календаря
    $('#calendar').datepicker({
      format: "dd.mm.yyyy", // Формат даты
      todayBtn: "linked",
      language: "ru", // Язык календаря
      autoclose: true,
      todayHighlight: true,
      orientation: "bottom auto"
    }).on('changeDate', function (e) {
      var selectedDate = e.format('dd.mm.yyyy');
      console.log("Выбранная дата: " + selectedDate);
  
      // Вызов функции фильтрации мероприятий
      filterEventsByDate(selectedDate);
    });
  });
  