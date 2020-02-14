'use strict';

(function () {
  // Импорт функций из других модулей
  var getMainPinCoords = window.mainPin.getPinCoords;
  var getRoundMainPinCoords = window.mainPin.getRoundPinCoords;
  var mainPinMouseDownHandler = window.mainPin.mouseDownHandler;
  var resetMainPinPosition = window.mainPin.resetPinPosition;
  var setAddress = window.form.setAddress;
  var activateForm = window.form.activateForm;
  var deactivateForm = window.form.deactivateForm;
  var createCard = window.card.createCard;
  var createPins = window.pin.createPins;
  var load = window.backend.load;
  var showErrorMsg = window.util.showErrorMsg;
  var addRepeatHandler = window.util.addRepeatHandler;

  // Инициализация переменных необходимых для работы модуля

  // Элемент карты
  var map = document.querySelector('.map');
  // Главная метка карты
  var mainPin = document.querySelector('.map__pin--main');

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
   * Удалить карточку из DOM (удалить с карты)
   */
  function removeCard() {
    var cardElement = map.querySelector('.map__card');
    if (cardElement) {
      cardElement.remove();
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
    // Блок меток
    var mapPins = map.querySelector('.map__pins');

    // Создаем фрагмент с метками и добавляем его на карту в блок меток
    mapPins.appendChild(createPins(data, placeCard));
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

    // Главный пин перерождается, у него появляется ножка, острие которого указывает немного в другую точку
    // Соответственно, меняем адрес на форме
    setAddress(getMainPinCoords());

    // Активируем фильтр карты
    setFilterState(true);

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
    map.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
      pin.remove();
    });

    // Деактивируем фильтр карты
    setFilterState(false);

    // Перемещаем метку на исходную позицию
    resetMainPinPosition();

    // Главная метка с самого начала круглая или
    // становится круглой при деактивации и при этом возвращается в исходное место на карте
    // Соответственно, меняем адрес на форме
    // ТЗ 4.2. Поле адреса должно быть заполнено всегда, в том числе сразу после открытия страницы (в неактивном состоянии).
    setAddress(getRoundMainPinCoords());

    // Добавляем возможность активации приложения (карта и форма) по нажатию на главную метку
    mainPin.addEventListener('click', mainPinClickHandler);

    // Закрываем возможность перетаскивания главной метки в неактивном состоянии
    // По договоренности с наставником даем возможность двигать метку только после первичного click (или Enter) на нее
    mainPin.removeEventListener('mousedown', mainPinMouseDownHandler);
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

  // Экспорт функций модуля
  window.map = {
    activateMap: activateMap,
    deactivateMap: deactivateMap
  };

})();
