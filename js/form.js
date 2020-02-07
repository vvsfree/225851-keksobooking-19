'use strict';

(function () {
  // Импорт функций из других модулей
  var initValidation = window.validity.init;

  /**
   * Поля формы устанавливается в активное/неактивное состояния
   * К элементу формы добавляется (удаляется) модификатор ad-form--disabled
   * @param {Boolean} isActive - true: устанавливается активное состояние; false: неактивное
   */
  function setFormState(isActive) {
    var adForm = document.querySelector('.ad-form');

    var disabledFormClassName = 'ad-form--disabled';
    if (isActive) {
      adForm.classList.remove(disabledFormClassName);
    } else {
      if (!adForm.classList.contains(disabledFormClassName)) {
        adForm.classList.add(disabledFormClassName);
      }
    }

    // fieldsets формы устанавливаются в необходимое состояние
    var addFormElements = adForm.querySelectorAll('.ad-form__element, .ad-form-header');
    addFormElements.forEach(function (item) {
      item.disabled = !isActive;
    });
  }

  /**
   * Активация формы
   */
  function activateForm() {
    setFormState(true);
    // Инициализация всего того, что связано с валидацией
    initValidation();
  }

  /**
   * Деактивация формы
   */
  function deactivateForm() {
    setFormState(false);
  }

  /**
   * Установка значения поля "Адрес"
   * Поле содержит координаты главной метки
   * Значения устанавливает модуль map.js в результате манипуляций с главной меткой карты
   * @param {Object} coords - координаты (x, y)
   */
  function setAddress(coords) {
    var address = document.querySelector('#address');
    address.value = coords.x + ', ' + coords.y;
  }

  // Экспорт функций модуля
  window.form = {
    activateForm: activateForm,
    deactivateForm: deactivateForm,
    setAddress: setAddress
  };

})();
