'use strict';

(function () {
  // Импорт функций из других модулей
  var activateMap = window.map.activateMap;
  var activateForm = window.form.activateForm;
  var deactivateMap = window.map.deactivateMap;
  var deactivateForm = window.form.deactivateForm;

  // Главная метка карты
  var mainPin = document.querySelector('.map__pin--main');

  // Активация приложения: карта и форма
  // Это как бы главная кнопка "Вкл."
  mainPin.addEventListener('click', function pinClickHandler() {
    activateMap();
    activateForm();
    // Удаляем обработчик, т.о. он сработает однократно
    mainPin.removeEventListener('click', pinClickHandler);
    // Задел на будущее, повесим сюда перехват mousedown
    // pin.addEventListener('mousedown', window.map.movePin);
  });

  deactivateMap();
  deactivateForm();
})();
