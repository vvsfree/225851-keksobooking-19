'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms

  /**
   * Задержка вызова функции, устранение "дребезга"
   * @param {Function} targetFunction - функция, которую нужно вызвать с задержкой
   * @return {Function} - функция, посредством которой вызывается задерживаемая функция
   */
  function debounce(targetFunction) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        targetFunction.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  }

  // Экспорт функций модуля
  window.debounce = debounce;
})();
