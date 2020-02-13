'use strict';

(function () {
  // Импорт функций из других модулей
  var mainPinClickHandler = window.mainPin.clickHandler;
  var getRoundPinCoords = window.mainPin.getRoundPinCoords;
  var deactivateMap = window.map.deactivateMap;
  var deactivateForm = window.form.deactivateForm;

  // Главная метка карты
  var mainPin = document.querySelector('.map__pin--main');

  // Активация приложения (карта и форма) по нажатию на главную метку
  mainPin.addEventListener('click', mainPinClickHandler);

  deactivateMap();
  deactivateForm(getRoundPinCoords());

})();
