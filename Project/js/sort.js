function filterEventsByDate(selectedDate) {
    // Фильтрация карточек мероприятий
    $('.event-card').each(function () {
      var eventDate = $(this).data('date');
      if (eventDate === selectedDate) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }
  
