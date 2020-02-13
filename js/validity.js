'use strict';

(function () {
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
   * Для поля "Заголовок объявления" устанавливается минимальная и максимальная длина,
   * поле становится обязательным
   */
  function setTitle() {
    title.minLength = 30;
    title.maxLength = 100;
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
    price.max = 1000000;
    price.required = true;
  }

  /**
   * Установка ограничения на выбираемые файлы
   * Для удобства пользователя
   */
  function setImages() {
    var acceptValue = 'image/*';
    avatar.accept = acceptValue;
    images.accept = acceptValue;
  }

  /**
   * Поле «Тип жилья» влияет на минимальное значение поля «Цена за ночь» и на его placeholder
   */
  function setTypePrice() {
    switch (type.value) {
      case 'bungalo':
        price.min = 0;
        break;
      case 'flat':
        price.min = 1000;
        break;
      case 'house':
        price.min = 5000;
        break;
      case 'palace':
        price.min = 10000;
        break;
      default:
        price.min = 5000;
    }
    price.placeholder = price.min;
  }

  /**
   * Проверка соответствия полей «Время заезда» и «Время выезда»
   */
  function validateTime() {
    timein.setCustomValidity('');
    if (timein.value !== timeout.value) {
      var customMessage = 'Время заезда и выезда должны быть синхронизированы';
      timein.setCustomValidity(customMessage);
    }
  }

  /**
   * Проверяется соответствие количества гостей (спальных мест) и количества комнат
   */
  function validateCapacity() {
    guests.setCustomValidity('');
    switch (rooms.value) {
      case '1':
        if (guests.value !== '1') {
          guests.setCustomValidity('Для одной комнаты может быть только 1 гость');
        }
        break;
      case '2':
        if (['1', '2'].indexOf(guests.value) === -1) {
          guests.setCustomValidity('Для двух комнат гостей может быть 1 или 2');
        }
        break;
      case '3':
        if (guests.value === '0') {
          guests.setCustomValidity('Для трех комнат гостей может быть от 1 до 3');
        }
        break;
      case '100':
        if (guests.value !== '0') {
          guests.setCustomValidity('100 комнат не для гостей');
        }
        break;
      default:
        guests.setCustomValidity('Невозможно определить количество гостей');
    }
  }

  /**
   * Проверка загруженных файлов
   * Файлы должны быть изображениями
   * @param {HTMLElement} element - элемент типа file
   * @param {FileList} files - загруженные файлы
   */
  function validateImages(element, files) {
    element.setCustomValidity('');
    for (var i = 0; i < files.length; i++) {
      var fileType = files[i].type;
      if (fileType.substr(0, 6) !== 'image/') {
        element.setCustomValidity('Загруженный файл не является изображением');
        break;
      }
    }
  }

  /**
   * Установка обработчиков на некоторые поля формы
   */
  function setHandlers() {
    // Тип жилища должен влиять на цену
    type.addEventListener('change', setTypePrice);

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
    rooms.addEventListener('change', validateCapacity);
    // Места (гости)
    guests.addEventListener('change', validateCapacity);

    // Аватар пользователя
    avatar.addEventListener('change', function (evt) {
      validateImages(avatar, evt.target.files);
    });

    // Фотографии жилья
    images.addEventListener('change', function (evt) {
      validateImages(images, evt.target.files);
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
    setTypePrice();
    setImages();

    // Первичная валидация в сложных случаях
    validateTime();
    validateCapacity();

    // Добавление обработчиков событий
    setHandlers();
  }

  // Экспорт функций модуля
  window.validity = {
    init: init
  };

})();

