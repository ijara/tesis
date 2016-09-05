(function ($) {
  Drupal.behaviors.osEvents = {
    attach: function (context, settings) {
      $('.calendar-event-title').click(function() {
        var header = $('.ui-accordion').find('#event-' + this.id);
        header.click();
      });
    }
  };
})(jQuery);
