'use strict';

(function () {
  // Импорт функций из других модулей
  var resetImages = window.image.reset;
  var validate = window.validity.validate;
  var save = window.backend.save;
  var showSuccessMsg = window.dialog.showSuccessMsg;
  var showErrorMsg = window.dialog.showErrorMsg;
  var addRepeatHandler = window.dialog.addRepeatHandler;


  // Инициализация переменных необходимых для работы модуля

  // Форма публикации нового объявления
  var form = document.querySelector('.ad-form');
  // Кнопка сброса формы
  var reset = form.querySelector('.ad-form__reset');

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
    validate();
  }

  /**
   * Деактивация формы
   */
  function deactivateForm() {
    setFormState(false);
    resetImages();
  }

  /**
   * Установка значения поля "Адрес"
   * Поле содержит координаты главной метки
   * Значения могут устанавливать другие модули
   * @param {Object} coords - координаты (x, y)
   */
  function setAddress(coords) {
    var address = document.querySelector('#address');
    address.value = coords.x + ', ' + coords.y;
  }

  /**
   * Сброс страницы с предварительным сбросом формы
   * Вызывается в двух местах, удобно объединить в одну функцию
   * @requires window.map.deactivateMap
   */
  function resetPage() {
    form.reset();
    // Здесь сложная ситуация
    // В момент создания модуля формы form.js, модуль карты map.js еще не существует
    // Но вот в момент вызова этой функции существует точно
    // Сомнения в том, что это неявный импорт, во первых
    // Во-вторых, взаимозависимость модулей:
    // карта импортирует несколько функций у формы, а форма при этом импортирует функцию у карты
    window.map.deactivateMap();
    deactivateForm();
  }

  /**
   * Обработчик успешной отправки формы
   */
  function successSaveHandler() {
    resetPage();
    showSuccessMsg();
  }

  /**
   * Обработчик неуспешной отправки формы
   * @param {String} errorMsg - сообщение об ошибке
   */
  function errorSaveHandler(errorMsg) {
    showErrorMsg(errorMsg);
    addRepeatHandler(function () {
      save(new FormData(form), successSaveHandler, errorSaveHandler);
    });
  }

  // Отправка формы, публикация заявления
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    save(new FormData(form), successSaveHandler, errorSaveHandler);
  });

  // Обработчик для reset, кнопка "Очистить"
  reset.addEventListener('click', function (evt) {
    evt.preventDefault();
    resetPage();
  });

  // Экспорт функций модуля
  window.form = {
    activateForm: activateForm,
    deactivateForm: deactivateForm,
    setAddress: setAddress
  };

})();
