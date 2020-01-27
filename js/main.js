'use strict';

// Количество объявлений
var NOTICE_COUNT = 8;

// Размеры метки на карте
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

// Разброс значений координат метки
// Максимальное значение по X определяется из ширины окна (viewport)
var LOCATION_X_MIN = 0;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;

// Разброс цен
var MIN_PRICE = 100;
var MAX_PRICE = 1000;

// Количество комнат
var MIN_ROOMS = 1;
var MAX_ROOMS = 7;

// Количество гостей
var MIN_GUESTS = 1;
var MAX_GUESTS = 10;

// Время заселения/выселения
var CHECK_TIMES = ['12:00', '13:00', '14:00'];

// Типы сдаваемого помещения
var REALTY_TYPES = ['palace', 'flat', 'house', 'bungalo'];

// Особенности помещения
var REALY_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

// Фотографии помещения
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
 * Создание объявления с тестовыми (фиктивными) данными
 * @param {Number} id - идентификатор объявления
 * @param {Object} mapArea - границы карты
 * @return {Object} объект объявления
 */
function generateMockNoticeData(id, mapArea) {
  var obj = {};

  var author = {};
  author.avatar = 'img/avatars/user0' + id + '.png';
  obj.author = author;

  var location = {};
  location.x = getRandomInt(mapArea.minX, mapArea.maxX);
  location.y = getRandomInt(mapArea.minY, mapArea.maxY);
  obj.location = location;

  var offer = {};
  offer.title = 'some offer #' + id;
  offer.address = location.x + ', ' + location.y;
  offer.price = getRandomInt(MIN_PRICE, MAX_PRICE);
  offer.type = getRandomValue(REALTY_TYPES);
  offer.rooms = getRandomInt(MIN_ROOMS, MAX_ROOMS);
  offer.guests = getRandomInt(MIN_GUESTS, MAX_GUESTS);
  offer.checkin = getRandomValue(CHECK_TIMES);
  offer.checkout = getRandomValue(CHECK_TIMES);
  offer.features = getRandomLengthArray(REALY_FEATURES);
  offer.description = 'some description #' + id;
  offer.photos = getRandomLengthArray(REALTY_PHOTOS);
  obj.offer = offer;

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
 * Функция создает DOM-элементы меток на карте и формирует из них фрагмент документа
 * Метки создаются на основе шаблона pin
 * Свойства меток инициализируются из переданного массива данных
 * @param {Array} data - массив данных объявлений
 * @return {DocumentFragment} фрагмент документа
 */
function createDataFragment(data) {
  var template = document.querySelector('#pin').content.querySelector('.map__pin');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < data.length; i++) {
    fragment.appendChild(createPin(data[i], template));
  }
  return fragment;
}

// Находим элемент карты
var map = document.querySelector('.map');

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
map.querySelector('.map__pins').appendChild(createDataFragment(data));
// Переключаем карту в активное состояние
map.classList.remove('map--faded');
