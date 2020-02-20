'use strict';

(function () {
  // Импорт фунций из других модулей
  var removeChildElements = window.util.removeChildElements;
  var isImage = window.util.isImage;

  var INVALID_IMAGE_ALT = 'Неверный формат файла';

  // Аватар пользователя
  var avatar = new Avatar(
      document.querySelector('#avatar'),
      document.querySelector('.ad-form-header__preview > img')
  );

  // Фотографии жилья
  var imagesChooser = document.querySelector('#images');
  var imagesPreviews = document.querySelector('.ad-form__photo');

  /**
   * Функция-конструктор ("класс") аватара
   * Создано исключительно для удобства - держать нужные свойства аватара вместе,
   * а также сохранить в самом начале первоначальный src и alt,
   * необходимые для сброса формы
   * @param {HTMLInputElement} chooser - элемент выбора файла
   * @param {HTMLImageElement} preview - элемент изображения
   */
  function Avatar(chooser, preview) {
    this.chooser = chooser;
    this.preview = preview;
    // Сохраняем src и alt исходного аватара
    this.src = preview.src;
    this.alt = preview.alt;
  }

  /**
   * Используется при сбросе формы в исходное состояние - удаляет все preview
   */
  function reset() {
    avatar.preview.src = avatar.src;
    avatar.preview.alt = avatar.alt;
    removeChildElements(imagesPreviews);
  }

  /**
   * Читает загруженный файл и отображает его в image - элемент (превью) изображения
   * @param {File} file загруженный файл-изображение
   * @param {HTMLImageElement} img - элемент изображения
   * @return {HTMLImageElement} измененный элемент изображения
   */
  function readFile(file, img) {
    if (isImage(file)) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        img.src = reader.result;
      });
      reader.readAsDataURL(file);
    } else {
      img.src = '';
      img.alt = INVALID_IMAGE_ALT;
    }
    return img;
  }

  /**
   * Обработчик события change
   * для всех кнопок выбора файла
   * @param {Event} evt - событие change
   */
  function imgChangeHandler(evt) {
    var files = evt.target.files;
    if (files.length === 0) {
      return;
    }

    if (evt.target === imagesChooser) {
      // Нажали на кнопку выбора фотографий жилища
      imagesChooserChangeHandler(files);
    } else {
      // Нажали на кнопку выбора аватара
      readFile(files[0], avatar.preview);
    }
  }

  /**
   * Обработчик события change для фотографий жилья
   * @param {FileList} files - загруженные файлы
   */
  function imagesChooserChangeHandler(files) {
    // Удаляем ранее добавленные изображения (если мы повторно нажимаем кнопку "Загрузить фото...")
    removeChildElements(imagesPreviews);

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < files.length; i++) {
      var img = readFile(files[i], document.createElement('img'));
      fragment.appendChild(img);
    }
    imagesPreviews.appendChild(fragment);
  }

  // Добавляем обработчики события change на file элементы
  avatar.chooser.addEventListener('change', imgChangeHandler);
  imagesChooser.addEventListener('change', imgChangeHandler);

  // Фотографии жилья можно загружать пачками, ведь их всегда несколько
  imagesChooser.multiple = true;

  // Экспорт функций модуля
  window.image = {
    reset: reset
  };
})();

