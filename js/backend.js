'use strict';

(function () {
  // Импорт функций из других модулей
  var format = window.util.format;

  var POST_URL = 'https://js.dump.academy/keksobooking';
  var GET_URL = POST_URL + '/data';
  var TIMEOUT_IN_MS = 10000;
  var StatusCode = {
    OK: 200
  };

  // Сообщения пользователю
  var CONNECT_ERROR = 'Произошла ошибка соединения';
  var STATUS_TEMPLATE = 'Статус ответа: {1} {2}';
  var TIMEOUT_TEMPLATE = 'Запрос не успел выполниться за {1} мс';

  /**
   * Подготовка запроса
   * Общая часть функций загрузки данных и публикации объявления (отправка данных)
   * @param {Function} onLoad - обработчик успешной отправки/загрузки
   * @param {Function} onError - обработчик ошибок
   * @return {XMLHttpRequest} xhr - объект запроса
   */
  function prepareRequest(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError(format(STATUS_TEMPLATE, xhr.status, xhr.statusText));
      }
    });

    xhr.addEventListener('error', function () {
      onError(CONNECT_ERROR);
    });

    xhr.addEventListener('timeout', function () {
      onError(format(TIMEOUT_TEMPLATE, xhr.timeout));
    });

    xhr.timeout = TIMEOUT_IN_MS;
    return xhr;
  }

  /**
   * Загрузка данных с сервера
   * @param {Function} onLoad - обработчик успешной загрузки
   * @param {Function} onError - обработчик ошибок
   */
  function load(onLoad, onError) {
    var xhr = prepareRequest(onLoad, onError);
    xhr.open('GET', GET_URL);
    xhr.send();
  }

  /**
   * Отправка данных, публикация нового объявления
   * @param {FormData} data - данные формы
   * @param {Function} onLoad - обработчик успешной отправки данных
   * @param {Function} onError - обработчик ошибки
   */
  function save(data, onLoad, onError) {
    var xhr = prepareRequest(onLoad, onError);
    xhr.open('POST', POST_URL);
    xhr.send(data);
  }

  // Экспорт функций модуля
  window.backend = {
    load: load,
    save: save
  };
})();
