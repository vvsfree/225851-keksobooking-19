'use strict';

(function () {
  // Импорт функций из других модулей
  var loadRawData = window.backend.load;
  var debounce = window.debounce;

  // Максимальное количество пинов на карте
  // ТЗ 5.8. Не более 5ти меток на карте
  var MAX_PIN_COUNT = 5;

  // Нефильтрованные данные объявлений
  var rawData = [];

  // Элемент "Тип жилья"
  var housingType = document.querySelector('#housing-type');

  /**
   * Добавляем обработчик события change для типа жилья
   * Обработчик определяется из map.js
   * @param {Function} changeHandler - обработчик
   */
  function addChangeHandler(changeHandler) {
    var debounceChangeHandler = debounce(function () {
      changeHandler(filter(rawData));
    });
    housingType.addEventListener('change', debounceChangeHandler);
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
    if (!isActive) {
      filterForm.reset();
    }
  }

  /**
   * Промежуточный загрузчик
   * Необходим для предварительной фильтрации данных, полученных от модуля backend.js,
   * @param {Function} successHandller - обработчик успешной загрузки
   * @param {Function} errorHandler - обработчик неуспешной загрузки
   */
  function load(successHandller, errorHandler) {
    loadRawData(function (data) {
      // Запоминаем полученные данные для последующей фильтрации
      rawData = data;
      successHandller(filter(rawData));
    }, errorHandler);
  }

  /**
   * Фильтрация данных
   * @return {Array} отфильтрованные данные
   */
  function filter() {
    var filteredData = [];
    for (var i = 0; i < rawData.length && filteredData.length < MAX_PIN_COUNT; i++) {
      var dataObj = rawData[i];
      // ТЗ 5.2. Если в объекте с описанием объявления отсутствует поле offer, то метка объявления не должна отображаться на карте.
      if (!dataObj.offer) {
        continue;
      }

      var offer = dataObj.offer;

      // Тип жилья
      if (housingType.value !== 'any' && housingType.value !== offer.type) {
        continue;
      }

      filteredData.push(dataObj);
    }

    return filteredData;
  }

  // Экспорт функций модуля
  window.filters = {
    activateFilter: function () {
      setFilterState(true);
    },
    deactivateFilter: function () {
      setFilterState(false);
    },
    load: load,
    addChangeHandler: addChangeHandler
  };
})();
