'use strict';

(function () {
  // Импорт функций из других модулей
  var getNoticeData = window.data.getNoticeData;
  var createPins = window.pin.createPins;
  var createCard = window.card.createCard;
  var setAddress = window.form.setAddress;

  // Длина ножки главной метки
  var MAIN_PIN_LEG_HEIGHT = 16;

  // Разброс значений координат метки
  // Максимальное значение по X определяется из ширины окна (viewport)
  var LOCATION_X_MIN = 0;
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;

  /**
   * Вычисление местоположения главной метки
   * Если метка круглая, то ее координаты есть ее центр
   * Если метка с ножкой, то координата метки - точка, куда указывает острие ножки
   * Предполагается, что по горизонтали ножка находится посредине метки
   * @param {String} pinType - тип метки: round - круглая; все остальное, включая отсутствие параметра - с ножкой
   * @return {Object} - координаты метки (x, y)
   */
  function getMainPinCoords(pinType) {
    var mainPin = document.querySelector('.map__pin--main');
    var hShift = Math.floor(mainPin.offsetWidth / 2);
    var vShift = 0;
    if (pinType === 'round') {
      vShift = Math.floor(mainPin.offsetHeight / 2);
    } else {
      vShift = mainPin.offsetHeight + MAIN_PIN_LEG_HEIGHT;
    }
    return {
      x: mainPin.offsetLeft + hShift,
      y: mainPin.offsetTop + vShift
    };
  }

  /**
   * Установка активного/неактивного состояния фильтра карты map__filters
   * @param {Boolean} isActive - true: устанавливается активное состояние; false: неактивное
   */
  function setFilterState(isActive) {
    // Форма с фильтрами на карте
    var filterForm = document.querySelector('.map__filters');
    // selects фильтра устанавливаются в необходимое состояние
    var filterFormSelects = filterForm.querySelectorAll('.map__filter');
    filterFormSelects.forEach(function (item) {
      item.disabled = !isActive;
    });
    // fieldset фильтра устанавливается в необходимое состояние
    filterForm.querySelector('.map__features').disabled = !isActive;
  }

  /**
   * Активируем карту
   */
  function activateMap() {
    // Элемент карты
    var map = document.querySelector('.map');

    map.classList.remove('map--faded');

    setFilterState(true);

    // Определяем область видимости карты
    var mapArea = {
      minX: LOCATION_X_MIN,
      maxX: map.offsetWidth,
      minY: LOCATION_Y_MIN,
      maxY: LOCATION_Y_MAX
    };

    // Получаем массив данных объявлений
    var data = getNoticeData(mapArea);

    // Создаем фрагмент с метками и добавляем его на карту в список меток
    var pins = createPins(data);
    map.querySelector('.map__pins').appendChild(pins);

    // Создаем DOM-элемент 1ой карточки объявления
    var card = createCard(data[0]);
    // Добавляем его перед элементом фильтра
    map.querySelector('.map__filters-container').insertAdjacentElement('beforebegin', card);

    // Установка адреса в форме по координатам главной метки
    setAddress(getMainPinCoords());
  }

  /**
   * Установка карты в неактивное состояние
   */
  function deactivateMap() {
    setFilterState(false);
    // Установка адреса в форме по координатам главной метки
    setAddress(getMainPinCoords('round'));
  }

  // Экспорт функций модуля
  window.map = {
    activateMap: activateMap,
    deactivateMap: deactivateMap
  };

})();
