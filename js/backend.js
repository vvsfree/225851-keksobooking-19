'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var TIMEOUT_IN_MS = 10000;
  var StatusCode = {
    OK: 200
  };

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
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
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
    xhr.open('GET', URL + '/data');
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
    xhr.open('POST', URL);
    xhr.send(data);
  }

  // Экспорт функций модуля
  window.backend = {
    load: load,
    save: save
  };
})();
