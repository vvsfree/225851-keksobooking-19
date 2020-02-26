'use strict';

(function () {
  // Импорт фунций из других модулей
  var isImage = window.util.isImage;

  // Константы
  var TITLE_MIN_LENGTH = 30;
  var TITLE_MAX_LENGTH = 100;
  var IMAGE_ACCEPT_VALUE = 'image/*';
  var PRICE_MAX_VALUE = 1000000;

  // Сообщения об ошибке
  var MSG_TIME = 'Время заезда и выезда должны быть синхронизированы';
  var MSG_IMAGE = 'Загруженный файл не является изображением';
  var MSG_GUESTS = 'Невозможно определить количество гостей';

  // Словарь (сопоставление): тип недвижимости - минимальная цена
  // Б8. Использование объекта в качестве словаря
  var realtyTypeToMinPrice = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  // Словарь: количество комнат - объект валидации количества гостей
  var roomsToGuestsValidity = {
    1: new GuestsValidity(1, 1, 'Для одной комнаты может быть только 1 гость'),
    2: new GuestsValidity(1, 2, 'Для двух комнат гостей может быть 1 или 2'),
    3: new GuestsValidity(1, 3, 'Для трех комнат гостей может быть от 1 до 3'),
    100: new GuestsValidity(0, 0, '100 комнат не для гостей')
  };

  // Инициализация переменных необходимых для работы модуля

  // Форма объявления
  var adForm = document.querySelector('.ad-form');

  // Заголовок объявления
  var title = adForm.querySelector('#title');
  // Адрес
  var address = adForm.querySelector('#address');
  // Цена за ночь
  var price = adForm.querySelector('#price');
  // Тип жилища
  var type = adForm.querySelector('#type');
  // Время заезда
  var timein = adForm.querySelector('#timein');
  // Время выезда
  var timeout = adForm.querySelector('#timeout');
  // Количество комнат
  var rooms = adForm.querySelector('#room_number');
  // Количество гостей
  var guests = adForm.querySelector('#capacity');
  // Аватар пользователя
  var avatar = adForm.querySelector('#avatar');
  // Фотографии жилья
  var images = adForm.querySelector('#images');

  /**
   * Объект валидации количества гостей
   * @param {Number} min - минимальное количество гостей
   * @param {Number} max - максимальное количество гостей
   * @param {String} message - сообщение об ошибке (валидация не прошла)
   */
  function GuestsValidity(min, max, message) {
    this.min = min;
    this.max = max;
    this.message = message;
  }

  /**
   * Для поля "Заголовок объявления" устанавливается минимальная и максимальная длина,
   * поле становится обязательным
   */
  function setTitle() {
    title.minLength = TITLE_MIN_LENGTH;
    title.maxLength = TITLE_MAX_LENGTH;
    title.required = true;
  }

  /**
   * Поле "Адрес" должно быть только для чтения
   */
  function setAddress() {
    address.readOnly = true;
  }

  /**
   * Для поля "Цена на ночь" устанавливается максимально возможное значение,
   * поле становится обязательным
   */
  function setPrice() {
    price.max = PRICE_MAX_VALUE;
    price.required = true;
  }

  /**
   * Установка ограничения на выбираемые файлы
   * Для удобства пользователя
   */
  function setImages() {
    var acceptValue = IMAGE_ACCEPT_VALUE;
    avatar.accept = acceptValue;
    images.accept = acceptValue;
  }

  /**
   * Поле «Тип жилья» влияет на минимальное значение поля «Цена за ночь» и на его placeholder
   */
  function typePriceChangeHandler() {
    price.min = realtyTypeToMinPrice[type.value];
    price.placeholder = price.min;
  }

  /**
   * Проверка соответствия полей «Время заезда» и «Время выезда»
   */
  function validateTime() {
    timein.setCustomValidity('');
    if (timein.value !== timeout.value) {
      var customMessage = MSG_TIME;
      timein.setCustomValidity(customMessage);
    }
  }

  /**
   * Проверяется соответствие количества гостей (спальных мест) и количества комнат
   */
  function capacityChangeHandler() {
    guests.setCustomValidity('');
    if (rooms.value in roomsToGuestsValidity) {
      var guestsValidity = roomsToGuestsValidity[rooms.value];
      if (guestsValidity.min > guests.value || guestsValidity.max < guests.value) {
        guests.setCustomValidity(guestsValidity.message);
      }
    } else {
      guests.setCustomValidity(MSG_GUESTS);
    }
  }

  /**
   * Проверка загруженных файлов
   * Файлы должны быть изображениями
   * @param {HTMLElement} element - элемент типа file
   */
  function validateImages(element) {
    element.setCustomValidity('');
    var files = element.files;
    for (var i = 0; i < files.length; i++) {
      if (!isImage(files[i])) {
        element.setCustomValidity(MSG_IMAGE);
        break;
      }
    }
  }

  /**
   * Установка обработчиков на некоторые поля формы
   */
  function setHandlers() {
    // Тип жилища должен влиять на цену
    type.addEventListener('change', typePriceChangeHandler);

    // Время заезда и выезда должны быть синхронизированы
    // Время заезда
    timein.addEventListener('change', function () {
      timeout.value = timein.value;
    });
    // Время выезда
    timeout.addEventListener('change', function () {
      timein.value = timeout.value;
    });

    // Количество комнат должно соответствовать количеству гостей
    // Комнаты
    rooms.addEventListener('change', capacityChangeHandler);
    // Места (гости)
    guests.addEventListener('change', capacityChangeHandler);

    // Аватар пользователя
    avatar.addEventListener('change', function () {
      validateImages(avatar);
    });

    // Фотографии жилья
    images.addEventListener('change', function () {
      validateImages(images);
    });
  }

  /**
   * Добавляются обработчики событий change
   * Осуществляется первичная валидация сложных случаев
   * -
   * Принцип валидации
   * Нет собственной валидации на событие submit
   * Для текстовых и числовых полей с помощью JS устанавливаются ограничения (max, minLength, required и др.)
   * Для сложных случаев (места/гости, въезд/выезд, тип загружаемого файла)
   *   устанавливается setCustomValidity в момент первичной валидации
   * Дальнейшая их валидация происходит по мере их изменения (событие change)
   * В результате такого подхода в момент отправки формы все поля уже (давно) провалидированы
   * И если есть невалидные поля, то submit формы не произойдет и отобразится первая из имеющихся ошибок
   */
  function init() {
    // Установка ограничений согласно ТЗ
    setTitle();
    setAddress();
    setPrice();
    typePriceChangeHandler();
    setImages();

    // Добавление обработчиков событий
    setHandlers();
  }

  /**
   * Валидация сложных случаев
   * Используется setCustomValidity
   */
  function validate() {
    validateTime();
    capacityChangeHandler();
    validateImages(avatar);
    validateImages(images);
  }

  init();

  // Экспорт функций модуля
  window.validity = {
    validate: validate
  };

})();

