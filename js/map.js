'use strict';

(function () {
  // Импорт функций из других модулей
  var showErrorMsg = window.util.showErrorMsg;
  var load = window.backend.load;
  var createPins = window.pin.createPins;
  var createCard = window.card.createCard;

  // Инициализация переменных необходимых для работы модуля

  // Элемент карты
  var map = document.querySelector('.map');

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
  function successHandler(data) {
    // Блок меток
    var mapPins = map.querySelector('.map__pins');

    // Создаем фрагмент с метками и добавляем его на карту в блок меток
    mapPins.appendChild(createPins(data, placeCard));
  }

  /**
   * Активируем карту
   */
  function activateMap() {
    // Убираем темный экран
    map.classList.remove('map--faded');

    // Активируем фильтр карты
    setFilterState(true);

    // Получаем массив данных объявлений
    load(successHandler, showErrorMsg);
  }

  /**
   * Установка карты в неактивное состояние
   */
  function deactivateMap() {
    // Добавляем темный экран, если его нет
    if (!map.classList.contains('map--faded')) {
      map.classList.remove('map--faded');
    }

    // Деактивируем фильтр карты
    setFilterState(false);
  }

  // Экспорт функций модуля
  window.map = {
    activateMap: activateMap,
    deactivateMap: deactivateMap
  };

})();
