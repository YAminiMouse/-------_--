$(document).ready(function () {
    $('#calendar').datepicker({
      format: "dd.mm.yyyy",
      todayBtn: "linked",
      language: "ru",
      autoclose: true,
      todayHighlight: true,
      orientation: "bottom auto"
    }).on('changeDate', function (e) {
      var selectedDate = e.format('dd.mm.yyyy');
      console.log("Выбранная дата: " + selectedDate);

      // Фильтрация карточек мероприятий
      $('.event-card').each(function () {
        var eventDate = $(this).data('date');
        if (eventDate === selectedDate) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });
  });