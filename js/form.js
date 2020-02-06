'use strict';

(function () {
  /*
    Принцип валидации
    -----------------
    Нет собственной валидации на событие submit
    Для текстовых и числовых полей с помощью JS устанавливаются ограничения (max, minLength, required и др.)
    Для сложных случаев (места/гости, въезд/выезд, жилье/цена, тип загружаемого файла)
      устанавливается setCustomValidity в момент первичной валидации
    Дальнейшая их валидация происходит по мере их изменения (событие change)
    В результате такого подхода в момент отправки формы все поля уже (давно) провалидированы
    И если есть невалидные поля, то submit формы не произойдет и отобразится первая из имеющихся ошибок
  */

  /**
   * Обработчик события change
   * Проверяется соответствие количества гостей (спальных мест) и количества комнат
   */
  function capacityChangeHandler() {
    guests.setCustomValidity('');
    switch (rooms.value) {
      case '1':
        if (guests.value !== '1') {
          guests.setCustomValidity('Для одной комнаты может быть только 1 гость');
        }
        break;
      case '2':
        if (['1', '2'].indexOf(guests.value) === -1) {
          guests.setCustomValidity('Для двух комнат гостей может быть 1 или 2');
        }
        break;
      case '3':
        if (guests.value === '0') {
          guests.setCustomValidity('Для трех комнат гостей может быть от 1 до 3');
        }
        break;
      case '100':
        if (guests.value !== '0') {
          guests.setCustomValidity('100 комнат не для гостей');
        }
        break;
      default:
        guests.setCustomValidity('Невозможно определить количество гостей');
    }
  }

  /**
   * Добавляются обработчики событий change
   * Осуществляется первичная валидация сложных случаев
   */
  function initValidation() {
    // Первичная валидация полей

    // Поля места/гости по умолчанию не соответствуют друг другу
    // Сразу после активации формы можно навести мышкой на поле "Гости"
    // и поле подсветится как невалидное, всплывет описание ошибки.
    capacityChangeHandler();

    // Добавление обработчиков событий
    rooms.addEventListener('change', capacityChangeHandler);
    guests.addEventListener('change', capacityChangeHandler);
  }

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

  // Инициализация переменных необходимых для работы модуля

  // Блок объявления
  var notice = document.querySelector('.notice');
  // Поле количества комнат
  var rooms = notice.querySelector('#room_number');
  // Поле количества мест (гостей)
  var guests = notice.querySelector('#capacity');

  // Экспорт функций модуля
  window.form = {
    activateForm: activateForm,
    deactivateForm: deactivateForm,
    setAddress: setAddress
  };

})();
