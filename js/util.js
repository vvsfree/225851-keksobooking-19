'use strict';

(function () {
  var UNIT = 'px';
  var IMAGE_TYPE = 'image/';

  /**
   * Форматирование строковых шаблонов
   * В переданном шаблоне вхождения вида {n} заменяются на соответствующие по номеру (n) аргументы функции
   * Аргументы обрабатываются с 1, т.к. нулевой аргумент - это сам шаблон
   * Вызов функции: format('{1} + {2} = {3}', '10', '20', '30');
   * @param {String} s - шаблон строки
   * @return {String} отформатированная строка
   */
  function format(s) {
    for (var i = 1; i < arguments.length; i++) {
      s = s.replace('{' + i + '}', arguments[i]);
    }
    return s;
  }

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

  /**
   * Установка позиции элемента
   * @param {HTMLElement} element
   * @param {Object} position - позиция элемента (left, top)
   */
  function setPosition(element, position) {
    element.style.left = position.x + UNIT;
    element.style.top = position.y + UNIT;
  }

  // Экспорт функций модуля
  window.util = {
    format: format,
    removeElements: removeElements,
    isImage: isImage,
    setPosition: setPosition
  };
})();

