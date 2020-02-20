'use strict';

(function () {
  /**
   * Удаление элементов
   * @param {Array} array - коллекция узлов типа NodeList
   */
  function removeElements(array) {
    array.forEach(function (item) {
      item.remove();
    });
  }

  /**
   * Удаление дочерних элементов
   * @param {HTMLElement} parent - родительский элемент
   */
  function removeChildElements(parent) {
    removeElements(Array.from(parent.children));
  }

  /**
   * Проверка, является ли файл изображением
   * @param {File} file - файл
   * @return {Boolean} true/false - является/не является
   */
  function isImage(file) {
    return file.type.substr(0, 6) === 'image/';
  }

  // Экспорт функций модуля
  window.util = {
    removeElements: removeElements,
    removeChildElements: removeChildElements,
    isImage: isImage
  };
})();

