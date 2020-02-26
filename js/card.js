'use strict';

(function () {
  // Импорт функций из других модулей
  var format = window.util.format;
  var removeElements = window.util.removeElements;

  // Валюта
  var CURRENCY = '₽';

  var ROOM_WORDS = ['комнат', 'комната', 'комнаты'];
  var GUEST_WORDS = ['гостей', 'гостя'];

  // Шаблоны строк
  var CAPACITY_TEMPLATE = '{1} {2} для {3} {4}';
  var TIME_TEMPLATE = 'Заезд после {1}, выезд до {2}';

  // Словарь: тип недвижимости - название на русском
  // Б8. Использование объекта в качестве словаря
  var realtyTypeToName = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

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
    var roomWord = getNominativeCase(values[0], ROOM_WORDS);
    var guestWord = getGenitiveCase(values[1], GUEST_WORDS);
    return format(CAPACITY_TEMPLATE, values[0], roomWord, values[1], guestWord);
  }

  /**
   * Проверка объекта на наличие значения:
   * он не должен быть пустой строкой, null, undefined, NaN
   * Если это массив, то он должен быть непустым, и каждый его элемент также проверяется.
   * @param {Object} value - может быть объектом или массивом
   * @return {Boolean} значение есть / нет
   */
  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0 || value.some(isEmpty);
    }
    return !(value || value === 0);
  }

  /**
   * Изменяет textContent DOM-элемента и проверяет присваемое значение на существование
   * Также может менять src у HTMLImageElement
   * В задании сказано, что если данных не хватает, то соответствующий блок должен скрываться.
   * Это и повлекло все эти сложности - нужно единообразно проверять наличие данных и сокрытие блока.
   * @param {HTMLElement} element - изменяемый DOM-элемент
   * @param {String} value - присваемое значение
   * @param {Function} formatFunction - функция форматирования значения
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
    featureArray.forEach(function (item) {
      selector += format(':not({1}--{2})', className, item);
    });
    var features = featuresElement.querySelectorAll(selector);
    // Найденная коллекция удаляется из DOM
    removeElements(features);
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
    photoArray.forEach(function (item) {
      // Создаем элемент фото
      var photoElement = photoTemplate.cloneNode(true);
      // Прописываем ему url изображения
      photoElement.src = item;
      fragment.appendChild(photoElement);
    });

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
   * @param {Function} procFunction - функция обработки DOM-элементов
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
  function create(noticeData) {
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
    processElement(cardElement.querySelector('.popup__text--price'), offer.price, function (value) {
      return value + CURRENCY;
    });

    // Тип жилья
    processElement(cardElement.querySelector('.popup__type'), offer.type, function (value) {
      return realtyTypeToName[value];
    });

    // Количество гостей и комнат
    processElement(cardElement.querySelector('.popup__text--capacity'), [offer.rooms, offer.guests], formatCapacity);

    // Время заезда и выезда
    processElement(cardElement.querySelector('.popup__text--time'), [offer.checkin, offer.checkout], function (values) {
      return format(TIME_TEMPLATE, values[0], values[1]);
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

  // Экспорт функций модуля
  window.card = {
    create: create
  };

})();
