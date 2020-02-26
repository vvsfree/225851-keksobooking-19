'use strict';

(function () {
  // Импорт функций из других модулей
  var setPosition = window.util.setPosition;

  // Размеры метки на карте
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  /**
   * Создание DOM-элемента метки на основе переданного шаблона и данных объявления
   * @param {Object} noticeData - объект данных объявления
   * @param {HTMLElement} template - шаблон метки карты
   * @return {HTMLElement} DOM-элемент метки
   */
  function createPin(noticeData, template) {
    var pinElement = template.cloneNode(true);

    // Определяем местоположение метки на карте
    var position = {
      x: noticeData.location.x - PIN_WIDTH / 2,
      y: noticeData.location.y - PIN_HEIGHT
    };
    setPosition(pinElement, position);

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
   * @param {Function} placeCard - функция отображения карточки
   * @return {DocumentFragment} фрагмент документа
   */
  function create(data, placeCard) {
    var template = document.querySelector('#pin').content.querySelector('.map__pin');
    var fragment = document.createDocumentFragment();

    data.forEach(function (dataObject) {
      var pin = createPin(dataObject, template);

      // Добавляем обработчик на click
      pin.addEventListener('click', function () {
        // Вызываем функцию отображения карточки из map.js
        placeCard(dataObject);
        // ТЗ 5.3. Активная метка
        pin.classList.add('map__pin--active');
      });

      fragment.appendChild(pin);
    });

    return fragment;
  }

  // Экспорт функций модуля
  window.pins = {
    create: create
  };

})();
