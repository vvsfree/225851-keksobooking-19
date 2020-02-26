'use strict';

(function () {
  // Импорт функций из других модулей
  var setAddress = window.form.setAddress;
  var setPosition = window.util.setPosition;

  // Длина ножки главной метки
  var MAIN_PIN_LEG_HEIGHT = 16;

  // Разброс значений координат главной метки
  // Максимальное значение по X определяется из ширины окна (viewport)
  var LOCATION_X_MIN = 0;
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;

  // Инициализация переменных необходимых для работы модуля

  // Главная метка карты
  var mainPin = document.querySelector('.map__pin--main');

  // Исходная позиция метки на карте
  var initialPosition = {
    x: mainPin.offsetLeft,
    y: mainPin.offsetTop
  };

  /**
   * Вычисление координат главной метки
   * Эта функция должна вызываться, когда метка имеет ножку - ее основное состояние
   * Предполагается, что по горизонтали ножка находится посредине метки
   * Если позиция метки не передана, то берется текущая из DOM
   * -
   * Примечание:
   *  позиция - это CSS position (left, top) элемента на странице
   *  координаты - точка, куда указывает ножка метки
   * @param {Object} position - позиция элемента метки (left, top)
   * @return {Object} - координаты метки (x, y)
   */
  function getPinCoords(position) {
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
    var coords = getPinCoords();
    coords.y = mainPin.offsetTop + Math.floor(mainPin.offsetHeight / 2);
    return coords;
  }

  /**
   * Корректируем возможную позицию метки так, чтобы острие ее ножки не вылезало за пределы карты
   * @param {Object} position - позиция элемента метки (left, top)
   * @param {Number} mapWidth - ширина карты
   * @return {Object} скорректированная позиция элемента метки (left, top)
   */
  function correctPinPosition(position, mapWidth) {
    // Новые возможные координаты метки (x, y)
    var coords = getPinCoords(position);

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
   * Сбрасываем главную метку в исходное состояние
   * @param {Function} clickHandler - обработчик
   */
  function reset(clickHandler) {
    // Сбрасываем позицию главной метки в исходное состояние
    setPosition(mainPin, initialPosition);

    // Главная метка с самого начала круглая или
    // становится круглой при деактивации и при этом возвращается в исходное место на карте
    // Соответственно, меняем адрес на форме
    // ТЗ 4.2. Поле адреса должно быть заполнено всегда, в том числе сразу после открытия страницы (в неактивном состоянии).
    setAddress(getRoundPinCoords());

    // Добавляем возможность активации приложения (карта и форма) по нажатию на главную метку
    mainPin.addEventListener('click', clickHandler);

    // Закрываем возможность перетаскивания главной метки в неактивном состоянии
    // По договоренности с наставником даем возможность двигать метку только после первичного click (или Enter) на нее
    mainPin.removeEventListener('mousedown', mouseDownHandler);
  }

  /**
   * Обработчик события mousedown
   * Реализация перемещения главной метки
   * @param {Event} evt - событие
   */
  function mouseDownHandler(evt) {
    evt.preventDefault();
    // Начальное положение мыши
    var startMousePosition = {
      x: evt.clientX,
      y: evt.clientY
    };

    // Ширина карты определяется каждый раз ввиду того, что пользователь может изменить viewport
    var mapWidth = document.querySelector('.map').offsetWidth;

    /**
     * Обработчик события mousemove: перемещение мыши
     * @param {Event} moveEvt - событие
     */
    function mouseMoveHandler(moveEvt) {
      moveEvt.preventDefault();

      // Положение мыши после перемещения
      var currentMousePosition = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      // Дельта нового положения мыши
      var shift = {
        x: startMousePosition.x - currentMousePosition.x,
        y: startMousePosition.y - currentMousePosition.y
      };

      // Новая возможная позиция метки на странице
      var pinPosition = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };

      // Корректируем возможную позицию метки
      pinPosition = correctPinPosition(pinPosition, mapWidth);

      // Перемещаем метку задавая ей новую позицию на карте
      setPosition(mainPin, pinPosition);

      // Задаем координаты метки в форме
      setAddress(getPinCoords(pinPosition));

      // Запоминаем новое положение мыши
      startMousePosition = currentMousePosition;
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
    mouseDownHandler: mouseDownHandler,
    getCoords: getPinCoords,
    reset: reset
  };
})();
