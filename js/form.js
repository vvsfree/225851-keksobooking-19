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
   * @param {Object} coords - координаты главной метки (x, y)
   */
  function activateForm(coords) {
    setFormState(true);
    // Инициализация всего того, что связано с валидацией
    initValidation();

    // Главная метка меняет свою форму, у нее появляется ножка и ее острый конец указывает
    // уже на другую точку (чем та, на которую указывал ее центр, когда она была круглой)
    // Соответственно, меняем адрес в форме
    setAddress(coords);
  }

  /**
   * Деактивация формы
   * @param {Object} coords - координаты главной метки (x, y)
   */
  function deactivateForm(coords) {
    setFormState(false);
    // ТЗ 4.2. Поле адреса должно быть заполнено всегда, в том числе сразу после открытия страницы (в неактивном состоянии).
    setAddress(coords);
  }

  /**
   * Установка значения поля "Адрес"
   * Поле содержит координаты главной метки
   * Значения также может устанавливать модуль mainPin.js в результате перемещения главной метки
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
