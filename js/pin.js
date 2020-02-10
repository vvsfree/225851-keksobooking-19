'use strict';

(function () {
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
   * Добавляем обработчик на клик
   * Объект данных сохраняется в замыкании
   * @param {HTMLElement} pin - метка карты
   * @param {Object} dataObject - объект данных объявления
   * @param {Object} clickHandler - обработчик клика
   */
  function addPinClickHandler(pin, dataObject, clickHandler) {
    pin.addEventListener('click', function () {
      clickHandler(dataObject);
    });
  }

  /**
   * Функция создает DOM-элементы меток и формирует из них фрагмент документа
   * Метки создаются на основе шаблона #pin
   * Свойства меток инициализируются из переданного массива данных
   * @param {Array} data - массив данных объявлений
   * @param {Object} pinClickHandler - обработчик клика на метку
   * @return {DocumentFragment} фрагмент документа
   */
  function createPins(data, pinClickHandler) {
    var template = document.querySelector('#pin').content.querySelector('.map__pin');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
      var pin = createPin(data[i], template);
      // Добавляем обработчик на click
      addPinClickHandler(pin, data[i], pinClickHandler);

      fragment.appendChild(pin);
    }
    return fragment;
  }

  // Экспорт функций модуля
  window.pin = {
    createPins: createPins
  };

})();
