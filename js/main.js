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
var MAX_ROOMS = 100;

// Количество гостей
var MIN_GUESTS = 1;
var MAX_GUESTS = 100;

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
 * На основе переданного числа функция выбирает одно из 3х переданных слов
 * Предполагается именительный падеж слов, единственное и множественное число
 * Необходимо для формирования строк вида: 5 комнат, 3 комнаты, 101 комната
 * @param {Number} num - целое положительное число
 * @param {Array} arr - массив из 3х слов
 * @return {String} элемент массива
 */
function getNominativeCase(num, arr) {
  if (num % 10 === 1 && num % 100 !== 11) {
    return arr[1];
  } else if ([2, 3, 4].indexOf(num % 10) !== -1 && (num % 100 / 10 ^ 0) !== 1) {
    return arr[2];
  }
  return arr[0];
}

/**
 * На основе переданного числа функция выбирает одно из 2х переданных слов
 * Предполагается родительный падеж (предлог "для") слов, единственное и множественное число
 * Необходимо для формирования строк вида: (для) 1 гостя, 101 гостя, 11 гостей
 * @param {Number} num - целое положительное число
 * @param {Array} arr - массив из 2х слов
 * @return {String} элемент массива
 */
function getGenitiveCase(num, arr) {
  if (num % 10 === 1 && num % 100 !== 11) {
    return arr[1];
  }
  return arr[0];
}

/**
 * Формирование строки вида "5 комнат для 3 гостей".
 * Учитывается падеж, единственное и множественное число существительного.
 * @param {Array} values - массив из 2х целых чисел: [количество комнат, количество гостей]
 * @return {String} отформатированная строка
 */
function formatCapacity(values) {
  var roomWord = getNominativeCase(values[0], ['комнат', 'комната', 'комнаты']);
  var guestWord = getGenitiveCase(values[1], ['гостей', 'гостя']);
  return format('{1} {2} для {3} {4}', values[0], roomWord, values[1], guestWord);
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
 * Проверка объекта на наличие значения:
 * он не должен быть пустой строкой, нулем, null, undefined, NaN
 * Если это массив, то он должен быть непустым, и каждый его элемент также проверяется.
 * @param {Object} value - может быть объектом или массивом
 * @return {Boolean} значение есть / нет
 */
function isEmpty(value) {
  if (Array.isArray(value)) {
    return value.length === 0 || value.some(isEmpty);
  }
  return !value;
}

/**
 * Изменяет textContent DOM-элемента и проверяет присваемое значение на существование
 * Также может менять src у HTMLImageElement
 * В задании сказано, что если данных не хватает, то соответствующий блок должен скрываться.
 * Это и повлекло все эти сложности - нужно единообразно проверять наличие данных и сокрытие блока.
 * @param {HTMLElement} element - изменяемый DOM-элемент
 * @param {String} value - присваемое значение
 * @param {Object} formatFunction - функция форматирования значения
 */
function processElement(element, value, formatFunction) {
  // Проверяем наличие данных
  if (isEmpty(value)) {
    element.remove();
    return;
  }
  // Форматируем значение по необходимости
  if (formatFunction) {
    value = formatFunction(value);
  }
  // Вносим изменения в элемент
  if (element instanceof HTMLImageElement) {
    element.src = value;
  } else {
    /*
    Здесь интересный момент. Есть элемент .popup__text--price.
    У него нужно изменять только текст (цену) перед вложенным span.
    К цене можно обратиться через firstChild элемента --price.
    Если же цены в данных нет, то спрятать нужно весь --price, а не только firstChild (цену)
    Для других элементов (которым необходимо менять textContent) это не нужно.
    Но сам изменяемый текст этих элементов также размещается в .firstChild и может быть изменен
    через textContent.
    Таким образом для других элементов работают 2 варианта:
    1) element.textContent = value;
    2) element.firstChild.textContent = value;
    Я выбирают второй вариант, чтобы еще захватить случай с .popup__text--price и т.о.
    сделать обработку единообразной.
    */
    element.firstChild.textContent = value;
  }
}

/**
 * Обработка удобств (особенностей) в объявлении
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
 * Обработка коллекции DOM-элементов.
 * Например, добавить все фотографии или удалить несколько удобств жилья.
 * Функция необходима для единообразной проверки на полноту входных данных.
 * Если входящий массив данных пустой, родитель удаляется из DOM.
 * @param {HTMLElement} element - родитель изменяемых DOM-элементов
 * @param {Array} values - массив данных
 * @param {Object} procFunction - функция обработки DOM-элементов
 */
function processElements(element, values, procFunction) {
  if (isEmpty(values)) {
    element.remove();
    return;
  }
  procFunction(element, values);
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
  processElement(cardElement.querySelector('.popup__title'), offer.title);

  // Адрес
  processElement(cardElement.querySelector('.popup__text--address'), offer.address);

  // Цена аренды
  processElement(cardElement.querySelector('.popup__text--price'), offer.price,
      function (value) {
        return value + CURRENCY;
      });

  // Тип жилья
  processElement(cardElement.querySelector('.popup__type'), offer.type,
      function (value) {
        return REALTY_TYPES_MAP[value];
      });

  // Количество гостей и комнат
  processElement(cardElement.querySelector('.popup__text--capacity'), [offer.rooms, offer.guests], formatCapacity);

  // Время заезда и выезда
  processElement(cardElement.querySelector('.popup__text--time'), [offer.checkin, offer.checkout],
      function (values) {
        return format('Заезд после {1}, выезд до {2}', values[0], values[1]);
      });

  // Удобства (особенности) жилья
  processElements(cardElement.querySelector('.popup__features'), offer.features, processCardFeatures);

  // Описание объекта недвижимости
  processElement(cardElement.querySelector('.popup__description'), offer.description);

  // Фотографии жилья
  processElements(cardElement.querySelector('.popup__photos'), offer.photos, processCardPhotos);

  // Аватар пользователя
  processElement(cardElement.querySelector('.popup__avatar'), noticeData.author.avatar);

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
