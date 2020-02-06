'use strict';

(function () {
  // Количество объявлений
  var NOTICE_COUNT = 8;

  // Разброс цен
  var MIN_PRICE = 100;
  var MAX_PRICE = 1000;

  // Количество комнат
  var MIN_ROOMS = 1;
  var MAX_ROOMS = 100;

  // Количество гостей
  var MIN_GUESTS = 1;
  var MAX_GUESTS = 100;

  // Время заселения/выселения
  var CHECK_TIMES = ['12:00', '13:00', '14:00'];

  // Типы сдаваемого жилья
  var REALTY_TYPES = ['palace', 'flat', 'house', 'bungalo'];

  // Удобства (особенности) жилья
  var REALY_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  // Фотографии жилья
  var REALTY_PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  /**
   * Возвращает случайное целое число между нижней и верхней границами включительно,
   * т.е промежуток [lowerLimit, upperLimit]
   * @param {Number} lowerLimit - нижняя граница
   * @param {Number} upperLimit - верхняя граница
   * @return {Number} случайное целое число
   */
  function getRandomInt(lowerLimit, upperLimit) {
    return Math.floor(Math.random() * (upperLimit - lowerLimit + 1) + lowerLimit);
  }

  /**
   * Возвращает случайный элемент массива
   * @param {Array} arr - массив
   * @return {Object} элемент массива
   */
  function getRandomValue(arr) {
    // Отнимаем единицу, т.к. getRandomInt использует границы включительно
    return arr[getRandomInt(0, arr.length - 1)];
  }

  /**
 * Возвращает массив случайной длины
 * Длина определяется в интервале от 1 до длины исходного массива включительно
 * @param {Array} arr - массив
 * @return {Array} массив случайной длины
 */
  function getRandomLengthArray(arr) {
    return arr.slice(0, getRandomInt(1, arr.length));
  }

  /**
   * Перемешивание массива
   * @param {Array} arr - массив объектов
   * @return {Array} перемешанный массив
   */
  function shuffle(arr) {
    var shuffledArray = arr.slice();
    shuffledArray.sort(function () {
      return Math.random() - 0.5;
    });
    return shuffledArray;
  }

  /**
 * Создание объявления с тестовыми (фиктивными) данными
 * @param {Number} id - идентификатор объявления
 * @param {Object} mapArea - границы карты
 * @return {Object} объект объявления
 */
  function generateMockNoticeData(id, mapArea) {
    var author = {
      avatar: 'img/avatars/user0' + id + '.png'
    };

    var location = {
      x: getRandomInt(mapArea.minX, mapArea.maxX),
      y: getRandomInt(mapArea.minY, mapArea.maxY)
    };

    var offer = {
      title: 'some offer #' + id,
      address: location.x + ', ' + location.y,
      price: getRandomInt(MIN_PRICE, MAX_PRICE),
      type: getRandomValue(REALTY_TYPES),
      rooms: getRandomInt(MIN_ROOMS, MAX_ROOMS),
      guests: getRandomInt(MIN_GUESTS, MAX_GUESTS),
      checkin: getRandomValue(CHECK_TIMES),
      checkout: getRandomValue(CHECK_TIMES),
      features: getRandomLengthArray(shuffle(REALY_FEATURES)),
      description: 'some description #' + id,
      photos: getRandomLengthArray(shuffle(REALTY_PHOTOS))
    };

    var obj = {
      author: author,
      offer: offer,
      location: location
    };

    return obj;
  }

  /**
   * Получение массива данных объявлений
   * Предполагается, что можно сменить реализацию и функция будет возвращать
   * объявления из другого источника.
   * @param {Object} mapArea - границы карты
   * @return {Array} массив данных
   */
  function getNoticeData(mapArea) {
    var data = [];
    for (var i = 0; i < NOTICE_COUNT; i++) {
      data.push(generateMockNoticeData(i + 1, mapArea));
    }
    return data;
  }

  // Экспорт функций модуля
  window.data = {
    getNoticeData: getNoticeData
  };

})();

