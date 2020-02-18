'use strict';

(function () {
  // Импорт функций из других модулей
  var getMainPinCoords = window.mainPin.getPinCoords;
  var mainPinMouseDownHandler = window.mainPin.mouseDownHandler;
  var resetMainPin = window.mainPin.resetPin;

  var addFilterChangeHandler = window.filters.addFilterChangeHandler;
  var activateFilter = window.filters.activateFilter;
  var deactivateFilter = window.filters.deactivateFilter;
  var load = window.filters.load;

  var setAddress = window.form.setAddress;
  var activateForm = window.form.activateForm;
  var deactivateForm = window.form.deactivateForm;
  var createCard = window.card.createCard;
  var createPins = window.pin.createPins;
  var showErrorMsg = window.util.showErrorMsg;
  var addRepeatHandler = window.util.addRepeatHandler;

  // Инициализация переменных необходимых для работы модуля

  // Элемент карты
  var map = document.querySelector('.map');
  // Главная метка карты
  var mainPin = document.querySelector('.map__pin--main');
  // Блок меток
  var mapPins = map.querySelector('.map__pins');

  /**
   * Удаляем метки с карты
   */
  function removePins() {
    mapPins.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
      pin.remove();
    });
  }

  /**
   * Делаем метку неактивной
   */
  function deactivatePin() {
    var activePinClassName = 'map__pin--active';
    var activePin = mapPins.querySelector('.' + activePinClassName);
    if (activePin) {
      activePin.classList.remove(activePinClassName);
    }
  }

  /**
   * Удалить карточку из DOM (удалить с карты)
   */
  function removeCard() {
    var cardElement = map.querySelector('.map__card');
    if (cardElement) {
      cardElement.remove();
      // ТЗ 5.3. Удаляем признак активности у соответствующей метки
      deactivatePin();
      // Удаляем обработчик Esc при закрытии - критерий Б26
      document.removeEventListener('keydown', cardEscHandler);
    }
  }

  /**
   * Создает элемент карточки объявления и размещает ее на карте
   * @param {Object} dataObject - объект данных объявления
   */
  function placeCard(dataObject) {
    // Удаляем карточку с карты, если она там есть
    removeCard();

    // Создаем элемент карточки объявления
    var cardElement = createCard(dataObject);

    // Закрытие карточки: добавляем обработчик события click по иконке (кнопке) закрытия
    // Также сработает и Enter
    var cardCloseBtn = cardElement.querySelector('.popup__close');
    cardCloseBtn.addEventListener('click', removeCard);

    // Закрытие карточки: добавляем обработчик события Escape на документ
    document.addEventListener('keydown', cardEscHandler);

    // Добавляем карточку перед элементом фильтра
    map.querySelector('.map__filters-container').insertAdjacentElement('beforebegin', cardElement);
  }

  /**
   * Если нажата клавиша Escape, удаляем карточку
   * @param {Event} evt - событие keydown
   */
  function cardEscHandler(evt) {
    if (evt.key === 'Escape') {
      removeCard();
    }
  }

  /**
   * Обработка успешного получения массива данных похожих объявлений
   * @param {Array} data - массив объектов данных
   */
  function successLoadHandler(data) {
    // Создаем фрагмент с метками и добавляем его на карту в блок меток
    mapPins.appendChild(createPins(data, placeCard));

    // Активируем фильтр карты, только если загрузка данных прошла успешно
    activateFilter();
  }

  /**
   * Обработка ошибки получения данных
   * @param {String} errorMsg - сообщение об ошибке
   */
  function errorLoadHandler(errorMsg) {
    showErrorMsg(errorMsg);
    deactivateMap();
    deactivateForm();
    addRepeatHandler(mainPinClickHandler);
  }

  /**
   * Активируем карту
   */
  function activateMap() {
    // Убираем темный экран
    map.classList.remove('map--faded');

    // Главный пин перерождается, у него появляется ножка, острие которой указывает немного в другую точку
    // Соответственно, меняем адрес на форме
    setAddress(getMainPinCoords());

    // Получаем массив данных объявлений
    load(successLoadHandler, errorLoadHandler);
  }

  /**
   * Установка карты в неактивное состояние
   */
  function deactivateMap() {
    // Добавляем темный экран, если его нет
    if (!map.classList.contains('map--faded')) {
      map.classList.add('map--faded');
    }

    // Удаляем карточку активного объявления с карты
    removeCard();

    // Удаляем метки похожих объявлений с карты
    removePins();

    // Деактивируем фильтр карты
    deactivateFilter();

    // Сбрасываем главную метку в исходное состояние
    resetMainPin(mainPinClickHandler);
  }

  /**
   * Обработчик события клика на круглую главную метку
   * Срабатывает один раз
   */
  function mainPinClickHandler() {
    // ТЗ 1.1. Первое взаимодействие с меткой (mousedown) переводит страницу в активное состояние
    activateMap();
    activateForm();

    // Удаляем обработчик, т.о. он сработает однократно
    mainPin.removeEventListener('click', mainPinClickHandler);

    // Обеспечиваем возможность перетаскивания главной метки
    mainPin.addEventListener('mousedown', mainPinMouseDownHandler);
  }

  /**
   * Обработчик события change для фильта карты
   * @param {Array} data - объекты данных объявлений
   */
  function filterChangeHandler(data) {
    // Удаляем карточку объявления с карты
    removeCard();

    // Удаляем метки, которые уже есть на карте
    removePins();

    // Создаем фрагмент с метками и добавляем его на карту в блок меток
    mapPins.appendChild(createPins(data, placeCard));
  }

  // Добавляем обработчик для фильтра
  addFilterChangeHandler(filterChangeHandler);

  // Экспорт функций модуля
  window.map = {
    activateMap: activateMap,
    deactivateMap: deactivateMap
  };

})();
