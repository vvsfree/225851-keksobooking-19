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

  // Форма фильтра
  var mapFilter = document.querySelector('.map__filters');
  // Фильтр по типу жилья
  var housingType = mapFilter.querySelector('#housing-type');
  // Фильтр по цене жилья
  var housingPrice = mapFilter.querySelector('#housing-price');
  // Фильтр по количеству комнат
  var housingRooms = mapFilter.querySelector('#housing-rooms');
  // Фильтр по количеству гостей
  var housingGuests = mapFilter.querySelector('#housing-guests');
  // Фильтр по особенностям помещения в виде массива
  var filterFeatures = Array.from(mapFilter.querySelectorAll('.map__checkbox').values());

  /**
   * Добавляем обработчик события change для типа жилья
   * Обработчик определяется из map.js
   * Применяем антидребезговое средство debounce
   * @param {Function} changeHandler - обработчик
   */
  function addFilterChangeHandler(changeHandler) {
    var debounceChangeHandler = debounce(function () {
      changeHandler(filter(rawData));
    });
    mapFilter.addEventListener('change', debounceChangeHandler);
  }

  /**
   * Установка активного/неактивного состояния фильтра карты map__filters
   * @param {Boolean} isActive - true: устанавливается активное состояние; false: неактивное
   */
  function setFilterState(isActive) {
    // selects фильтра устанавливаются в необходимое состояние
    var filterFormSelects = mapFilter.querySelectorAll('.map__filter');
    filterFormSelects.forEach(function (item) {
      item.disabled = !isActive;
    });
    // fieldset фильтра устанавливается в необходимое состояние
    mapFilter.querySelector('.map__features').disabled = !isActive;
    if (!isActive) {
      mapFilter.reset();
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
   * Если значением фильтра является any, то возвращает true,
   * если нет, то запускает переданную функцию проверки или,
   * если она отстуствует, текстовую проверку переданных значений
   * @param {Object} offerValue - значение поля данных, может быть String или Number
   * @param {String} filterValue - значение фильтра
   * @param {Function} check - дополнительная функция проверки
   * @return {Boolean} результат проверки
   */
  function checkValue(offerValue, filterValue, check) {
    if (filterValue === 'any') {
      return true;
    }
    if (check) {
      return check(offerValue, filterValue);
    }
    return checkStringValue(offerValue, filterValue);
  }

  /**
   * Проверяет, соответствует ли значение поля данных фильтру
   * Строгое сравнение исключит null, '', NaN, undefined, 0
   * @param {String} offerValue - значение поля данных
   * @param {String} filterValue - значение фильтра
   * @return {Boolean} результат проверки
   */
  function checkStringValue(offerValue, filterValue) {
    return offerValue === filterValue;
  }

  /**
   * Проверяет, соответствует ли значение поля данных фильтру
   * Числовые поля могут иметь значение равное 0,
   * что предполагает немного другую проверку на существование значения
   * @param {Number} offerValue - значение поля данных
   * @param {String} filterValue - значение фильтра
   * @return {Boolean} результат проверки
   */
  function checkNumValue(offerValue, filterValue) {
    // Данные могут прийти неполными, значение может быть undefined, null
    if (offerValue || offerValue === 0) {
      // Убедившись, что значение есть, приводим его к String и используем текстовое сравнение
      return checkStringValue(offerValue.toString(), filterValue);
    }

    return false;
  }

  /**
   * Проверяет, соответствует ли значение поля данных фильтру
   * Для цены применяется сложная, нестандартная проверка
   * @param {Number} offerValue - значение поля данных
   * @param {String} filterValue - значение фильтра
   * @return {Boolean} результат проверки
   */
  function checkPriceValue(offerValue, filterValue) {
    // Данные могут прийти неполными, значение может быть undefined, null
    if (offerValue || offerValue === 0) {
      if (offerValue < 10000) {
        if (filterValue === 'low') {
          return true;
        }
      } else if (offerValue > 50000) {
        if (filterValue === 'high') {
          return true;
        }
      } else {
        if (filterValue === 'middle') {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Проверяет, есть ли в массиве удобств все отмеченные удобства из фильтра
   * @param {Array} offerFeatures - массив удобств помещения из объекта данных
   * @require {Array} filterFeatures - массив чекбоксов, определен в глобальной переменной
   * @return {Boolean} результат проверки
   */
  function checkFeatures(offerFeatures) {
    // Отбираем только отмеченные чекбоксы
    var filterSelectedFeatures = filterFeatures.filter(function (item) {
      return item.checked;
    });

    // Данные по особенностям помещения
    // Так как данные могут быть представлены не полностью, особенностей помещения может вообще не быть
    // В этом случае предварительно инициализируем их пустым массивом
    var features = offerFeatures || [];
    // Проверяем, что для каждого отмеченного чекбокса есть соответствующее удобство (feature) в данных
    // Если нет отмеченных чекбоксов, то every вернет true, что нам и нужно
    return filterSelectedFeatures.every(function (item) {
      return features.indexOf(item.value) !== -1;
    });
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
      if (!checkValue(offer.type, housingType.value)) {
        continue;
      }

      // Цена жилья
      if (!checkValue(offer.price, housingPrice.value, checkPriceValue)) {
        continue;
      }

      // Количество комнат
      if (!checkValue(offer.rooms, housingRooms.value, checkNumValue)) {
        continue;
      }

      // Количество гостей
      if (!checkValue(offer.guests, housingGuests.value, checkNumValue)) {
        continue;
      }

      // Особенности помещения
      if (!checkFeatures(offer.features)) {
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
    addFilterChangeHandler: addFilterChangeHandler
  };
})();
