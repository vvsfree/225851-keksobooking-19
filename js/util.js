'use strict';

(function () {
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
    if (evt.target.closest('main .' + popup.className) !== popup) {
      removePopup(evt);
    }
  }

  /**
   * Удаление диалога из DOM
   * Удаление обработчиков уровня документа
   * @param {Event} evt - событие
   */
  function removePopup(evt) {
    popup.remove();
    evt.stopPropagation();
    document.removeEventListener('keydown', keydownHandler);
    document.removeEventListener('click', clickHandler);
  }

  /**
   * Показать сообщение в случае успеха
   */
  function showSuccessMsg() {
    return;
  }

  /**
   * Показать сообщение в случае ошибки
   * @param {String} errorMsg - сообщение
   */
  function showErrorMsg(errorMsg) {
    var template = document.querySelector('#error').content.querySelector('.error');

    // Диалог объявлен на уровне модуля
    popup = template.cloneNode(true);

    // Устанавливаем сообщение об ошибке
    popup.querySelector('.error__message').textContent = errorMsg;
    var button = popup.querySelector('.error__button');

    button.addEventListener('click', function (evt) {
      removePopup(evt);
    });

    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('click', clickHandler);

    document.querySelector('main').appendChild(popup);
  }

  // Переменные необходимые для работы модуля
  var popup;

  // Экспорт функций модуля
  window.util = {
    showSuccessMsg: showSuccessMsg,
    showErrorMsg: showErrorMsg
  };
})();
