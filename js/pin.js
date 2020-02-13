'use strict';

(function () {
  // Максимальное количество пинов на карте
  var MAX_PIN_COUNT = 5;

  // Размеры метки на карте
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var ACTIVE_PIN_CLASS_NAME = 'map__pin--active';

  /**
   * Создание DOM-элемента метки на основе переданного шаблона и данных объявления
   * @param {Object} noticeData - объект данных объявления
   * @param {HTMLElement} template - шаблон метки карты
   * @return {HTMLElement} DOM-элемент метки
   */
  function createPin(noticeData, template) {
    var pinElement = template.cloneNode(true);

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
   * @param {Function} placeCard - функция отображения карточки
   * @return {DocumentFragment} фрагмент документа
   */
  function createPins(data, placeCard) {
    var template = document.querySelector('#pin').content.querySelector('.map__pin');
    var fragment = document.createDocumentFragment();

    // ТЗ 5.8. Не более 5ти меток на карте
    data.slice(0, MAX_PIN_COUNT).forEach(function (dataObject) {
      // ТЗ 5.2. Если в объекте с описанием объявления отсутствует поле offer, то метка объявления не должна отображаться на карте.
      if (dataObject.offer) {
        var pin = createPin(dataObject, template);

        // Добавляем обработчик на click
        pin.addEventListener('click', function () {
          // Вызываем функцию отображения карточки из map.js
          placeCard(dataObject);
          // ТЗ 5.3. Активная метка
          var activePin = document.querySelector('.' + ACTIVE_PIN_CLASS_NAME);
          if (activePin) {
            activePin.classList.remove(ACTIVE_PIN_CLASS_NAME);
          }
          pin.classList.add(ACTIVE_PIN_CLASS_NAME);
        });

        fragment.appendChild(pin);
      }
    });

    return fragment;
  }

  // Экспорт функций модуля
  window.pin = {
    createPins: createPins
  };

})();
