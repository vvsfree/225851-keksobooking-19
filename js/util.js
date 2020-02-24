'use strict';

(function () {
  var IMAGE_TYPE = 'image/';

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
   * Проверка, является ли файл изображением
   * @param {File} file - файл
   * @return {Boolean} true/false - является/не является
   */
  function isImage(file) {
    return file.type.substr(0, 6) === IMAGE_TYPE;
  }

  // Экспорт функций модуля
  window.util = {
    removeElements: removeElements,
    isImage: isImage
  };
})();

