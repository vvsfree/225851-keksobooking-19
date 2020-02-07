'use strict';

(function () {
  // Размеры метки на карте
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  /**
   * Создание DOM-элемента метки на основе переданного шаблона и данных объявления
   * @param {Number} id - идентификатор объявления
   * @param {Object} noticeData - объект данных объявления
   * @param {HTMLElement} template - шаблон метки карты
   * @return {HTMLElement} DOM-элемент метки
   */
  function createPin(id, noticeData, template) {
    var pinElement = template.cloneNode(true);

    // Установка идентификатора объявления через атрибут data-id
    // Используется для связи метки и данных объявления
    pinElement.dataset.id = id;

    // Определяем местоположение метки на карте
    var x = noticeData.location.x - PIN_WIDTH / 2;
    var y = noticeData.location.y - PIN_HEIGHT;
    pinElement.style = 'left: ' + x + 'px; top: ' + y + 'px;';

    // Инициализируем свойства аватара автора
    var imgElement = pinElement.querySelector('img');
    imgElement.src = noticeData.author.avatar;
    imgElement.alt = noticeData.offer.title;

    return pinElement;
  }

  /**
   * Функция создает DOM-элементы меток и формирует из них фрагмент документа
   * Метки создаются на основе шаблона #pin
   * Свойства меток инициализируются из переданного массива данных
   * @param {Array} data - массив данных объявлений
   * @return {DocumentFragment} фрагмент документа
   */
  function createPins(data) {
    var template = document.querySelector('#pin').content.querySelector('.map__pin');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      fragment.appendChild(createPin(i, data[i], template));
    }
    return fragment;
  }

  // Экспорт функций модуля
  window.pin = {
    createPins: createPins
  };

})();
