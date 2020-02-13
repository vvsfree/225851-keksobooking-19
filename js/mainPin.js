'use strict';

(function () {
  // Длина ножки главной метки
  var MAIN_PIN_LEG_HEIGHT = 16;

  // Разброс значений координат главной метки
  // Максимальное значение по X определяется из ширины окна (viewport)
  var LOCATION_X_MIN = 0;
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;

  // Импорт функций из других модулей
  var activateMap = window.map.activateMap;
  var activateForm = window.form.activateForm;
  var setAddress = window.form.setAddress;

  // Инициализация переменных необходимых для работы модуля

  // Главная метка карты
  var mainPin = document.querySelector('.map__pin--main');

  /**
   * Вычисление координат главной метки
   * Эта функция должна вызываться, когда метка имеет ножку - ее основное состояние
   * Координаты метки - точка, куда указывает острие ножки
   * Предполагается, что по горизонтали ножка находится посредине метки
   * Если позиция метки не передана, то берется текущая из DOM
   * @param {Object} position - позиция элемента метки (left, top)
   * @return {Object} - координаты метки (x, y)
   */
  function getCoords(position) {
    var coords = {};
    if (position) {
      coords.x = position.x;
      coords.y = position.y;
    } else {
      coords.x = mainPin.offsetLeft;
      coords.y = mainPin.offsetTop;
    }
    // Смещение по горизонтали
    coords.x += Math.floor(mainPin.offsetWidth / 2);
    // Смещение по вертикали
    coords.y += MAIN_PIN_LEG_HEIGHT;
    return coords;
  }

  /**
   * Вычисление координат главной метки
   * Эта функция должна вызываться, когда метка круглая - состояние в самом начале
   * Координаты метки - ее центр
   * @return {Object} - координаты метки (x, y)
   */
  function getRoundPinCoords() {
    var coords = getCoords();
    coords.y = mainPin.offsetTop + Math.floor(mainPin.offsetHeight / 2);
    return coords;
  }

  /**
   * Обработчик события клика на круглую главную метку
   * Срабатывает один раз
   */
  function clickHandler() {
    activateMap();
    activateForm(getCoords());

    // Удаляем обработчик, т.о. он сработает однократно
    mainPin.removeEventListener('click', clickHandler);

    // Обеспечиваем возможность перетаскивания главной метки
    mainPin.addEventListener('mousedown', downHandler);
  }

  /**
   * Корректируем возможную позицию метки так, чтобы острие ее ножки не вылезало за пределы карты
   * @param {Object} position - позиция элемента метки (left, top)
   * @param {Number} mapWidth - ширина карты
   * @return {Object} скорректированная позиция элемента метки (left, top)
   */
  function correctPinPosition(position, mapWidth) {
    // Новые возможные координаты метки (x, y)
    var coords = getCoords(position);

    // Горизонтальные границы
    if (coords.x < LOCATION_X_MIN) {
      position.x += (LOCATION_X_MIN - coords.x);
    } else if (coords.x > mapWidth) {
      position.x += (mapWidth - coords.x);
    }

    // Вертикальные границы
    if (coords.y < LOCATION_Y_MIN) {
      position.y += (LOCATION_Y_MIN - coords.y);
    } else if (coords.y > LOCATION_Y_MAX) {
      position.y += (LOCATION_Y_MAX - coords.y);
    }
    return position;
  }

  /**
   * Обработчик события mousedown
   * Реализация перемещения главной метки
   * @param {Event} evt - событие
   */
  function downHandler(evt) {
    evt.preventDefault();
    // Начальные координаты мыши
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    // Ширина карты определяется каждый раз ввиду того, что пользователь может изменить viewport
    var mapWidth = document.querySelector('.map').offsetWidth;

    /**
     * Обработчик события mousemove: перемещение мыши
     * Примечание:
     *  позиция - это CSS position (left, top) элемента на странице
     *  координаты - точка, куда указывает ножка метки
     * @param {Event} moveEvt - событие
     */
    function mouseMoveHandler(moveEvt) {
      moveEvt.preventDefault();

      // Координаты мыши после перемещения
      var mouseCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      // Дельта координат мыши
      var shift = {
        x: startCoords.x - mouseCoords.x,
        y: startCoords.y - mouseCoords.y
      };

      // Новая возможная позиция метки на странице
      var pinPosition = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };

      // Корректируем возможную позицию метки
      pinPosition = correctPinPosition(pinPosition, mapWidth);

      // Перемещаем метку задавая ей новую позицию на карте
      mainPin.style.left = pinPosition.x + 'px';
      mainPin.style.top = pinPosition.y + 'px';

      // Задаем координаты метки в форме
      setAddress(getCoords(pinPosition));

      // Запоминаем новые координаты мыши
      startCoords = mouseCoords;
    }

    /**
     * Обработчик события mouseup: отпустили кнопку мыши
     * @param {Event} upEvt - событие
     */
    function mouseUpHandler(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    }

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }

  // Экспорт функций модуля
  window.mainPin = {
    clickHandler: clickHandler,
    getRoundPinCoords: getRoundPinCoords
  };
})();
