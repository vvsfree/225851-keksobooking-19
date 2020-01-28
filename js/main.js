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

// Валюта
var CURRENCY = '₽';

// Количество комнат
var MIN_ROOMS = 1;
var MAX_ROOMS = 7;

// Количество гостей
var MIN_GUESTS = 1;
var MAX_GUESTS = 10;

// Время заселения/выселения
var CHECK_TIMES = ['12:00', '13:00', '14:00'];

// Типы сдаваемого жилья
var REALTY_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var REALTY_TYPES_MAP = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

// Удобства (особенности) жилья
var REALY_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

// Фотографии жилья
var REALTY_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

/**
 * Форматирование строковых шаблонов
 * В переданном шаблоне вхождения вида {n} заменяются на соответствующие по номеру (n) аргументы функции
 * Аргументы обрабатываются с 1, т.к. нулевой аргумент - это сам шаблон
 * Вызов функции: format('{1} + {2} = {3}', '10', '20', '30');
 * @param {String} s - шаблон строки
 * @return {String} отформатированная строка
 */
function format(s) {
  for (var i = 1; i < arguments.length; i++) {
    s = s.replace('{' + i + '}', arguments[i]);
  }
  return s;
}

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
function createDocumentFragment(data) {
  var template = document.querySelector('#pin').content.querySelector('.map__pin');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < data.length; i++) {
    fragment.appendChild(createPin(data[i], template));
  }
  return fragment;
}

/**
 * Обработка удобств объявления
 * Функция удаляет из DOM элементы popup__feature,
 * БЭМ модификаторы которых не представлены в массиве данных удобств жилья.
 * @param {HTMLElement} featuresElement - родительский блок popup__features
 * @param {Array} featureArray - массив удобств жилья
 */
function processCardFeatures(featuresElement, featureArray) {
  var className = '.popup__feature';
  var selector = className;
  // Формирование коллекции элементов, у которых нет соответствия с данными удобств
  for (var i = 0; i < featureArray.length; i++) {
    selector += format(':not({1}--{2})', className, featureArray[i]);
  }
  var features = featuresElement.querySelectorAll(selector);
  // Найденная коллекция удаляется из DOM
  features.forEach(function (item) {
    item.remove();
  });
}

/**
 * Обработка фотографий объявления
 * Функция создает DOM-элементы фото жилья, группирует их в DocumentFragment,
 * и добавляет к родительскому блоку
 * Для создания элемента фото используется шаблонный элемент, который уже находится в
 * родительском блоке.
 * @param {HTMLElement} photosElement - родительский блок popup__photos
 * @param {Array} photoArray - массив фотографий жилья
 */
function processCardPhotos(photosElement, photoArray) {
  // Первый дочерний элемент может служить шаблоном
  var photoTemplate = photosElement.firstElementChild;
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photoArray.length; i++) {
    // Создаем элемент фото
    var photoElement = photoTemplate.cloneNode(true);
    // Прописываем ему url изображения
    photoElement.src = photoArray[i];
    fragment.appendChild(photoElement);
  }
  photosElement.appendChild(fragment);
  // Шаблонный элемент фото удаляется из DOM
  photoTemplate.remove();
}

/**
 * Создание DOM-элемента карточки объявления на основе переданного шаблона и данных объявления
 * @param {Object} noticeData - объект данных объявления
 * @return {HTMLElement} DOM-элемент карточки
 */
function createCard(noticeData) {
  // Получаем шаблон карточки объявления
  var template = document.querySelector('#card').content.querySelector('.popup');
  // Создаем DOM-элемент карточки
  var cardElement = template.cloneNode(true);

  // Заполняем поля карточки

  var offer = noticeData.offer;

  // Заголовок объявления
  // TODO: Если данных для заполнения не хватает, соответствующий блок в карточке скрывается.
  // ... скрывается. Как? Можно просто весь элемент удалить. remove.
  // Передавать функцию обработчик...
  // Создать функцию, которая будет проверять наличие информации или ее полноту
  cardElement.querySelector('.popup__title').textContent = offer.title;

  // Адрес
  // TODO: Если данных для заполнения не хватает, соответствующий блок в карточке скрывается.
  cardElement.querySelector('.popup__text--address').textContent = offer.address;

  // Цена аренды
  // TODO: Если данных для заполнения не хватает, соответствующий блок в карточке скрывается.
  cardElement.querySelector('.popup__text--price').firstChild.textContent = offer.price + CURRENCY;

  // Тип жилья
  // TODO: Если данных для заполнения не хватает, соответствующий блок в карточке скрывается.
  cardElement.querySelector('.popup__type').textContent = REALTY_TYPES_MAP[offer.type];

  // Количество гостей и комнат
  // TODO: Как быть с падежами?
  // TODO: Если данных для заполнения не хватает, соответствующий блок в карточке скрывается.
  var capacity = format('{1} комнаты для {2} гостей', offer.rooms, offer.guests);
  cardElement.querySelector('.popup__text--capacity').textContent = capacity;

  // Время заезда и выезда
  // TODO: Если данных для заполнения не хватает, соответствующий блок в карточке скрывается.
  var time = format('Заезд после {1}, выезд до {2}', offer.checkin, offer.checkout);
  cardElement.querySelector('.popup__text--time').textContent = time;

  // Удобства (особенности) жилья
  // TODO: Если данных для заполнения не хватает, соответствующий блок в карточке скрывается.
  processCardFeatures(cardElement.querySelector('.popup__features'), offer.features);

  // Описание объекта недвижимости
  // TODO: Если данных для заполнения не хватает, соответствующий блок в карточке скрывается.
  cardElement.querySelector('.popup__description').textContent = offer.description;

  // Фотографии жилья
  // TODO: Если данных для заполнения не хватает, соответствующий блок в карточке скрывается.
  processCardPhotos(cardElement.querySelector('.popup__photos'), offer.photos);

  // Аватар пользователя
  // TODO: Если данных для заполнения не хватает, соответствующий блок в карточке скрывается.
  cardElement.querySelector('.popup__avatar').src = noticeData.author.avatar;

  return cardElement;
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
map.querySelector('.map__pins').appendChild(createDocumentFragment(data));
// Переключаем карту в активное состояние
map.classList.remove('map--faded');

// Создаем DOM-элемент карточки объявления
var card = createCard(getRandomValue(data));
// Добавляем его перед элементом фильтра
map.querySelector('.map__filters-container').insertAdjacentElement('beforebegin', card);
