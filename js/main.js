'use strict';

(function () {
  // Импорт функций из других модулей
  var deactivateMap = window.map.deactivateMap;
  var deactivateForm = window.form.deactivateForm;
  var initValidation = window.validity.init;

  deactivateMap();
  deactivateForm();

  // Инициализация всего того, что связано с валидацией
  initValidation();
})();
