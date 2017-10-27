;(function ($) {

  var defaultOptions = {
    checkInterval: 30,
    sendInterval: 3000,
    url: ''
  };

  $.fn.trackCoords = function (option) {

    return this.each(function () {

      var options = $.extend({}, defaultOptions, option),
        element = $(this),
        data = [],
        checkTimerId,
        sendTimerId;


      element.mouseover(function (event) {

        var pos = $(event.target).offset(),
          timeTrackStart = $.now(),
          posX = 0,
          posY = 0;

        /**
         * При перемещении курсора в переменных сохраняются его координаты и время, начиная
         * с которого он в них находится.
         */
        element.mousemove(function (e) {
          posX = e.pageX - pos.left;
          posY = e.pageY - pos.top;
          timeTrackStart = $.now();
        });


        /**
         *  Таймер с определенным интервалом записывает в массив с данными координаты курсора
         *  и высчитаное время нахождения курсора в них
         */
        checkTimerId = setInterval(function () {
          data.push({
            x: posX,
            y: posY,
            time: $.now() - timeTrackStart
          });
        }, options.checkInterval);

        /**
         * Таймер с определенным интервалом отправляет данные по икузанному 'url'
         */
        sendTimerId = setInterval(function () {
          $.ajax({
            type: 'POST',
            url: options.url,
            data: {
              // _csrf: yii.getCsrfToken(),
              data: data
            },
            dataType: "json",
          })
            .done(function (res) {
              console.log(JSON.stringify(res));
            })
            .fail(function (jqXHR) {
                console.log('Error: (' + jqXHR.status + ') ' + jqXHR.statusText);
              }
            );
          data = [];
        }, options.sendInterval);

      });

      element.mouseout(function () {
        clearInterval(checkTimerId);
        clearInterval(sendTimerId);
        data = [];
      });

    });

  };

}(jQuery));
