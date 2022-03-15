'use strict';

import $ from 'jquery';

import Events from '../_events';
import SpinnerUI from './_ui.spinner';

import 'croppie/croppie.js';
import 'exif-js/exif.js';

const CroppieUI = (($) => {
  const NAME = 'jsCroppieUI';
  const DATA_KEY = NAME;

  const G = window;
  const D = document;

  const jqteOptions = {
    color: false,
    fsize: false,
    funit: 'em',
    format: false,
    rule: false,
    source: false,
    sub: false,
    sup: false,
  };

  class CroppieUI {
    constructor(element) {
      const ui = this;
      const $el = $(element);

      console.log(`${NAME}: init ...`);

      ui.$el = $el;
      $el.data(DATA_KEY, this);

      ui.input = $el.find('input[type="file"]');
      //ui.inputData = $('<input type="hidden" class="base64enc" name="' + ui.input.attr('name') + 'base64" />');

      ui.width = ui.input.data('width');
      ui.height = ui.input.data('height');

      $el.append(
        '<div class="cropper-wrap"><div class="cropper-container"></div>' +
          '<a href="#" class="btn-remove" style="display:none"><i class="fas fa-times"></i> Remove</a></div>'
      );
      //$el.append(ui.inputData);

      ui.uploadCropWrap = $el.find('.cropper-wrap');
      ui.uploadCrop = ui.uploadCropWrap.find('.cropper-container');

      const ratio = ui.width / (ui.uploadCrop.width() - 32);
      ui.uploadCrop.croppie({
        enableExif: true,
        enforceBoundary: false,
        viewport: {
          width: ui.width / ratio,
          height: ui.height / ratio,
        },
      });

      ui.uploadCrop.hide();

      ui.input.on('change', (e) => {
        this.readFile(e.currentTarget);
      });

      ui.$btnRemove = $el.find('.btn-remove');
      ui.$btnRemove.on('click', (e) => {
        e.preventDefault();

        ui.uploadCrop.removeClass('ready');
        $el.find('.croppie-image').remove();

        ui.$el.find('input[type="file"]').val('');
        ui.$el.find('input[type="file"]').change();

        ui.uploadCropWrap.hide();
      });

      if (ui.$el.find('img.croppie-image').length) {
        ui.$btnRemove.show();
      }
    }

    readFile(input) {
      const ui = this;
      const $el = ui.$el;
      const $form = $el.closest('form');

      if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = (e) => {
          ui.uploadCrop.addClass('ready');
          ui.uploadCrop.croppie('bind', {
            url: e.target.result,
          });

          ui.uploadCrop.show();
          ui.uploadCropWrap.show();
          ui.$btnRemove.show();
        };

        reader.readAsDataURL(input.files[0]);

        $form.off('submit');
        $form.on('submit', (e) => {
          console.log(`${NAME}: Processing submission ...`);

          e.preventDefault();

          if ($form.data('locked')) {
            console.warn(`${NAME}: Form#${$form.attr('id')} is locked.`);
            return false;
          }

          $form.data('locked', true);

          SpinnerUI.show();

          if (!ui.uploadCrop.hasClass('ready')) {
            return true;
          }

          ui.uploadCrop
            .croppie('result', {
              type: 'blob',
              size: {
                width: ui.width,
                height: ui.height,
              },
              format: 'png',
            })
            .then((blob) => {
              const form = e.currentTarget;
              const data = new FormData(form);
              const name = $(input).attr('name');

              data.delete('BackURL');
              data.delete(name);
              data.append(name, blob, `${name}-image.png`);
              data.append('ajax', '1');

              if ($(form).data('jsFormValidate') && !$(form).data('jsFormValidate').validate()) {
                return false;
              }

              $.ajax({
                url: $(form).attr('action'),
                data,
                processData: false,
                contentType: false,
                type: $(form).attr('method'),
                success: function (data) {
                  $form.data('locked', false);

                  let IS_JSON = false;
                  let json = {};
                  try {
                    IS_JSON = true;
                    json = $.parseJSON(data);
                  } catch (e) {
                    IS_JSON = false;
                  }

                  if (IS_JSON) {
                    if (typeof json['status'] !== 'undefined') {
                      if (json['status'] === 'success') {
                        if (MainUI) {
                          MainUI.alert(json['message'], json['status']);
                        }else {
                          window.location.reload();
                        }

                        if (typeof json['link'] !== 'undefined') {
                          console.log(
                            `${NAME}: Finished submission > JSON ... Redirecting to ${json['link']}.`
                          );

                          setTimeout(() => {
                            G.location = json['link'];
                          }, 2000);
                        } else {
                          console.warn(
                            `${NAME}: Finished submission > JSON no redirect link.`
                          );
                        }
                      } else if (json['status'] === 'error') {
                        if (MainUI) {
                          MainUI.alert(json['message'], json['status']);
                        }else {
                          window.location.reload();
                        }
                      }
                    }

                    if (typeof json['form'] !== 'undefined') {
                      console.log(
                        `${NAME}: Finished submission > JSON. Got new form response.`
                      );

                      $(form).replaceWith(json['form']);
                      $(G).trigger(Events.AJAX);
                    }
                  } else {
                    console.log(
                      `${NAME}: Finished submission > DATA response.`
                    );

                    $(form).replaceWith(data);
                    $(G).trigger(Events.AJAX);
                    //G.location.reload(false);
                  }

                  SpinnerUI.hide();
                },
              });

              //ui.inputData.val(data);
            });
        });
      } else {
        console.log(
          `${NAME}: Sorry - your browser doesn't support the FileReader API.`
        );
      }
    }

    static dispose() {
      console.log(`${NAME}: destroying.`);
    }

    static _jQueryInterface() {
      return this.each((i, el) => {
        // attach functionality to element
        const $el = $(el);
        let data = $el.data(DATA_KEY);

        if (!data) {
          data = new CroppieUI(el);
          $el.data(DATA_KEY, data);
        }
      });
    }
  }

  // jQuery interface
  $.fn[NAME] = CroppieUI._jQueryInterface;
  $.fn[NAME].Constructor = CroppieUI;
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return CroppieUI._jQueryInterface;
  };

  // auto-apply
  $(window).on(`${NAME}.init ${Events.AJAX} ${Events.LOADED}`, () => {
    $('.field.croppie').jsCroppieUI();
  });

  return CroppieUI;
})($);

export default CroppieUI;
