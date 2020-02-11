'use strict';

(function () {
  // Наименование собственного класса диалога
  var DIALOG_CLASS_NAME = 'dialog';

  /**
   * Обработчик нажатия Escape на всем документе
   * @param {Event} evt - событие
   */
  function keydownHandler(evt) {
    if (evt.key === 'Escape') {
      removePopup(evt);
    }
  }

  /**
   * Обработчик click на всем документе
   * @param {Event} evt - событие
   */
  function clickHandler(evt) {
    // Диалог закрывается по клику по темной области
    if (evt.target.classList.contains(DIALOG_CLASS_NAME)) {
      removePopup(evt);
    }
  }

  /**
   * Удаление диалога из DOM
   * Удаление обработчиков уровня документа
   * @param {Event} evt - событие
   */
  function removePopup(evt) {
    evt.stopPropagation();
    document.querySelector('.' + DIALOG_CLASS_NAME).remove();
    document.removeEventListener('keydown', keydownHandler);
    document.removeEventListener('click', clickHandler);
  }

  /**
   * Создание модального окна
   * @param {String} className - имя класса диалога (и шаблона)
   * @return {HTMLElement} DOM-элемент диалога
   */
  function createDialog(className) {
    var template = document.querySelector('#' + className).content.querySelector('.' + className);

    // Создаем диалог
    var dialog = template.cloneNode(true);

    // Добавляем собственный класс, которого нет в разметке,
    // чтобы единообразно управлять сообщениями об успехе или ошибке
    dialog.classList.add(DIALOG_CLASS_NAME);

    // События закрытия диалога уровня документа
    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('click', clickHandler);

    // Добавляем в DOM
    document.querySelector('main').appendChild(dialog);

    return dialog;
  }

  /**
   * Показать сообщение в случае успеха
   */
  function showSuccessMsg() {
    createDialog('success');
  }

  /**
   * Показать сообщение в случае ошибки
   * @param {String} errorMsg - сообщение
   */
  function showErrorMsg(errorMsg) {
    var dialog = createDialog('error');

    // Устанавливаем сообщение об ошибке
    dialog.querySelector('.error__message').textContent = errorMsg;

    // Добавляем обработчик по клику на кнопку
    var button = dialog.querySelector('.error__button');
    button.addEventListener('click', function (evt) {
      removePopup(evt);
    });
  }

  // Экспорт функций модуля
  window.util = {
    showSuccessMsg: showSuccessMsg,
    showErrorMsg: showErrorMsg
  };
})();
