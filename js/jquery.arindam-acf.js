/**
 * Arindam Roy
 * arindam.roy.developer@gmail.com
 * https://github.com/dev-arindam-roy
 */
(function($) {

    $.fn.arindamACF = function(options) {
        
        var settings = $.extend({}, $.fn.arindamACF.default, options);

        const ACF_CONTROLS = $.fn.arindamACF.acfApplicationJson();

        var acfControlList = [];
        if (ACF_CONTROLS.length) {
            acfControlList = orderShort(ACF_CONTROLS);
        }
        
        $applicationDiv = $('<div/>');
        $applicationDiv.prop('id', 'arixACFApplicationDiv');
        $applicationDiv.prop('class', 'arix-acf-app-div row mt-2');

        $applicationInnerDiv = $('<div/>');
        $applicationInnerDiv.prop('id', 'arixACFApplicationInnerDiv');
        $applicationInnerDiv.prop('class', 'arix-acf-app-inner-div col-sm-12');
        $applicationInnerDiv.appendTo($applicationDiv);

        $addBtn = $('<button/>');
        $addBtn.prop('id', 'arixACFCreateBtn');
        $addBtn.prop('class', 'arix-acf-add-btn btn btn-primary');
        $addBtn.text(settings.buttonText);
        $addBtn.appendTo($applicationInnerDiv);
        $addBtn.on('click', function() {
            openApplicationLayout();
        });

        /**Modal */
        $modalContainer = $('<div/>');
        $modalContainer.prop('id', settings.acfModalId);
        $modalContainer.attr('data-bs-backdrop', 'static');
        $modalContainer.attr('data-bs-keyboard', false);
        $modalContainer.prop('class', 'modal fade');
        $modalContainer.appendTo('body');

        $modalDialog = $('<div/>');
        $modalDialog.prop('class', 'modal-dialog modal-xl modal-dialog-scrollable');
        $modalDialog.appendTo($modalContainer);

        $modalContent = $('<div/>');
        $modalContent.prop('class', 'modal-content');
        $modalContent.appendTo($modalDialog);

        $modalHeader = $('<div/>');
        $modalHeader.prop('class', 'modal-header');
        $modalHeader.appendTo($modalContent);

        $modalBody = $('<div/>');
        $modalBody.prop('id', 'arixACFModalBody');
        $modalBody.prop('class', 'modal-body');
        $modalBody.appendTo($modalContent);

        $modalFooter = $('<div/>');
        $modalFooter.prop('class', 'modal-footer');
        $modalFooter.css({'justify-content': 'space-between'});
        $modalFooter.appendTo($modalContent);

        $modalHeaderTitle = $('<h5/>');
        $modalHeaderTitle.prop('class', 'modal-title').html(settings.headerTitle).appendTo($modalHeader);

        $modalHeaderCloseBtn = $('<button/>');
        $modalHeaderCloseBtn.prop('class', 'btn-close').attr('data-bs-dismiss', 'modal').appendTo($modalHeader);

        $acfForm = $('<form/>');
        $acfForm.prop('name', 'arixacfform').prop('id', $.fn.arindamACF.default.acfFormId).appendTo($modalBody);

        $closeModalBtn = $('<button/>');
        $closeModalBtn.attr('type', 'button').prop('id', 'arixACFCloseBtn').prop('class', 'btn btn-danger').text('Close').appendTo($modalFooter);
        $closeModalBtn.on('click', function() {
            closeApplicationLayout();
        });

        $saveChangesBtn = $('<button/>');
        $saveChangesBtn.attr('type', 'button').prop('id', 'arixACFSaveChangesBtn').prop('class', 'btn btn-primary').text('Save Changes').appendTo($modalFooter);
        $saveChangesBtn.on('click', function() {
            acfSettingsSaveChanges();
        });

        /**Modal Body Elements */
        $bodyRow = $('<div/>').prop('class', 'row').appendTo($acfForm);
        $bodyCol3 = $('<div/>').prop('class', 'col-sm-3').appendTo($bodyRow);
        $bodyCol9 = $('<div/>').prop('class', 'col-sm-9').appendTo($bodyRow);
        $col3Card = $('<div/>').prop('class', 'card').appendTo($bodyCol3);
        $col3CardHeader = $('<div/>').prop('class', 'card-header').html('ACF Controls').appendTo($col3Card);
        $col3CardBody = $('<div/>').prop('class', 'card-body arix-acf-control-list').appendTo($col3Card);
        $ulControlList = $('<ul/>').prop('class', 'list-group').prop('id', 'arixACFControls').appendTo($col3CardBody);
        if (acfControlList.length) {
            acfControlList.map((item, index) => {
                $controlLi = $('<li/>');
                $controlLi.prop('class', 'list-group-item d-flex justify-content-between align-items-center arix-acf-item');
                $controlLi.prop('id', 'arixACFControl_' + item.name);
                $controlLi.attr('data-control-name', item.name);
                $controlLi.attr('data-control-key', item.key);
                $controlLi.attr('data-is-repeater', item.is_repeater);
                $controlLi.attr('data-is-option', item.is_option);
                $controlLi.attr('data-min-option', item.min_option);
                $controlLi.attr('data-is-param', item.is_param);
                $controlLi.attr('data-control-id', 'arixACFControl' + item.id);
                $controlLi.attr('data-control-listid', 'arixACFControl' + index);
                $controlLi.html(item.name.toUpperCase() + '<span><i class="fa fa-plus"></i></span>');
                $controlLi.appendTo($ulControlList);
                $controlLi.on('click', function() {
                    acfControlItemClick(this);
                });
            });
        }

        $col9Card = $('<div/>').prop('class', 'card').appendTo($bodyCol9);
        $col9CardHeader = $('<div/>').prop('class', 'card-header arix-acf-name-card-header').appendTo($col9Card);
        $col9CardBody = $('<div/>').prop('class', 'card-body arix-acf-card-body').prop('id', 'arixAcfFieldSettings').appendTo($col9Card);
        
        /**ACF Name */
        $acfNameInput = $('<input/>').attr('type', 'text').prop('class', 'form-control mt-1 arix-acf-name-input-box').prop('id', 'arixACFName');
        $acfNameInput.attr('name', 'acf_name').attr('placeholder', 'Enter ACF Name').attr('required', 'required').attr('autocomplete', 'off');
        $acfNameInput.appendTo($col9CardHeader);

        function orderShort(controlJson) {
            return controlJson.sort((obj1, obj2) => {
                if (obj1.order < obj2.order) {
                    return -1;
                }
            });
        }

        var controlClickTime = 0;
        var eachAddMoreClickTime = 0;
        function acfControlItemClick(thisLi) {
            var _controlKey = $(thisLi).data('control-key');
            var _controlName = $(thisLi).data('control-name').toUpperCase();
            var _isRepeater = $(thisLi).data('is-repeater');
            var _isOption = $(thisLi).data('is-option');
            var _minOption = $(thisLi).data('min-option');
            var _isParam = $(thisLi).data('is-param');
            var _controlRowId = 'arixACFControlSettings_' + controlClickTime + '_' + _controlKey;

            if ($col9CardBody.find('.arix-acf-init-text').length) {
                $('.arix-acf-init-text').remove();
            }
            /**Default Control */
            $defaultControlRow = $('<div/>').prop('class', 'row arix-acf-control-settings-rowbox').prop('id', _controlRowId).appendTo($col9CardBody);
            $defaultControlCol12a = $('<div/>').prop('class', 'col-sm-12').html('<span class="badge bg-primary">' + _controlName + '</span>').appendTo($defaultControlRow);
            $defaultControlCol12b = $('<div/>').prop('class', 'col-sm-12 arix-acf-common-area').appendTo($defaultControlRow);
            $defaultControlRowInnerA = $('<div/>').prop('class', 'row').appendTo($defaultControlCol12b);
            
            /**Label Name */
            $defaultControlColLabel = $('<div/>').prop('class', 'col-sm-4').appendTo($defaultControlRowInnerA);
            $labelFormGroup = $('<div/>').prop('class', 'form-group').appendTo($defaultControlColLabel);
            $labelLabel = $('<label/>').prop('class', 'arix-acf-label').attr('for', 'label-' + _controlRowId).html('Field Lable Name: <em>*</em>').appendTo($labelFormGroup);
            $labelTxtbox = $('<input/>').attr('type', 'text').attr('name', 'field_label_name[' + controlClickTime + ']').attr('placeholder', 'Control Label Name').attr('required', 'required');
            $labelTxtbox.prop('class', 'form-control field-label-name').prop('id', 'label-' + _controlRowId).appendTo($labelFormGroup);
            
            /**Key Name */
            $defaultControlColKey = $('<div/>').prop('class', 'col-sm-4').appendTo($defaultControlRowInnerA);
            $keyFormGroup = $('<div/>').prop('class', 'form-group').appendTo($defaultControlColKey);
            $keyLabel = $('<label/>').prop('class', 'arix-acf-key').attr('for', 'key-' + _controlRowId).html('Field Key Name: <em>*</em>').appendTo($keyFormGroup);
            $keyTxtbox = $('<input/>').attr('type', 'text').attr('name', 'field_key_name[' + controlClickTime + ']').attr('placeholder', 'Control Key Name').attr('required', 'required');
            $keyTxtbox.prop('class', 'form-control field-key-name').prop('id', 'key-' + _controlRowId).appendTo($keyFormGroup);
            
            /**Settings Checkbox */
            $defaultControlColSett = $('<div/>').prop('class', 'col-sm-2').appendTo($defaultControlRowInnerA);
            $settFormGroup = $('<div/>').prop('class', 'form-group arix-acf-settings-checkbox').appendTo($defaultControlColSett);
            
            /**Is Require CKB */
            $requireCkbDiv = $('<div/>').prop('class', 'sett-ckb-div').appendTo($settFormGroup);
            $requireCkb = $('<input/>').attr('type', 'checkbox').attr('name', 'field_is_required[' + controlClickTime + ']');
            $requireCkb.prop('id', 'isRequired-' + _controlRowId).prop('class', 'field-is-required').appendTo($requireCkbDiv);
            $requireCkbLb = $('<label/>').attr('for', 'isRequired-' + _controlRowId).html('Is Required').appendTo($requireCkbDiv);

            /**Is Repeater CKB */
            if (_isRepeater) {
                $repeaterCkbDiv = $('<div/>').prop('class', 'sett-ckb-div').appendTo($settFormGroup);
                $repeaterCkb = $('<input/>').attr('type', 'checkbox').attr('name', 'field_is_repeater[' + controlClickTime + ']');
                $repeaterCkb.prop('id', 'isRepeater-' + _controlRowId).prop('class', 'field-is-repeater').appendTo($repeaterCkbDiv);
                $repeaterCkbLb = $('<label/>').attr('for', 'isRepeater-' + _controlRowId).html('Is Repeater').appendTo($repeaterCkbDiv);
            }

            /**Remove Control */
            $defaultRemoveControl = $('<div/>').prop('class', 'col-sm-2').appendTo($defaultControlRowInnerA);
            $removeControlFormGroup = $('<div/>').prop('class', 'form-group text-right').appendTo($defaultRemoveControl);
            $removeControlBtn = $('<a/>').attr('href', 'javascript:void(0);').prop('class', 'arix-remove-acf-control-btn').prop('id', 'removeControlBtn-' + _controlRowId);
            $removeControlBtn.html('<i class="fa fa-trash"></i>').appendTo($removeControlFormGroup);
            $removeControlBtn.on('click', function() {
                removeAcfControl($(this));
            });

            $defaultExtraCol12 = $('<div/>').prop('class', 'col-sm-12 mt-1 arix-acf-extra-settings').appendTo($defaultControlRow);
            $defaultExtraCol12Row = $('<div/>').prop('class', 'row').appendTo($defaultExtraCol12);

            $defaultExtraCol41 = $('<div/>').prop('class', 'col-sm-4').appendTo($defaultExtraCol12Row);
            $ex1formGroupDiv1 = $('<div/>').prop('class', 'form-group').appendTo($defaultExtraCol41);
            $ex1Lb1 = $('<label/>').prop('class', 'arix-acf-text-sm arix-acf-exlb').attr('for', 'fcls-' + _controlRowId).html('Class Name:').appendTo($ex1formGroupDiv1);
            $ex1ClsTxtb = $('<input/>').attr('type', 'text').attr('name', 'field_class_name[' + controlClickTime + ']').attr('placeholder', 'CSS Classes');
            $ex1ClsTxtb.prop('class', 'form-control form-control-sm field-class-name').prop('id', 'fcls-' + _controlRowId).appendTo($ex1formGroupDiv1);
            
            $defaultExtraCol42 = $('<div/>').prop('class', 'col-sm-4').appendTo($defaultExtraCol12Row);
            $ex1formGroupDiv2 = $('<div/>').prop('class', 'form-group').appendTo($defaultExtraCol42);
            $ex1Lb2 = $('<label/>').prop('class', 'arix-acf-text-sm arix-acf-exlb').attr('for', 'fid-' + _controlRowId).html('ID Name:').appendTo($ex1formGroupDiv2);
            $ex1IdTxtb = $('<input/>').attr('type', 'text').attr('name', 'field_id_name[' + controlClickTime + ']').attr('placeholder', 'Field ID');
            $ex1IdTxtb.prop('class', 'form-control form-control-sm field-id-name').prop('id', 'fid-' + _controlRowId).appendTo($ex1formGroupDiv2);
            
            $defaultExtraCol43 = $('<div/>').prop('class', 'col-sm-4').appendTo($defaultExtraCol12Row);
            $ex1formGroupDiv3 = $('<div/>').prop('class', 'form-group').appendTo($defaultExtraCol43);
            $ex1Lb3 = $('<label/>').prop('class', 'arix-acf-text-sm arix-acf-exlb').attr('for', 'helptext-' + _controlRowId).html('Help Text:').appendTo($ex1formGroupDiv3);
            $ex1HelpTxtb = $('<input/>').attr('type', 'text').attr('name', 'field_help_text[' + controlClickTime + ']').attr('placeholder', 'Any Help Text');
            $ex1HelpTxtb.prop('class', 'form-control form-control-sm field-help-text').prop('id', 'helptext-' + _controlRowId).appendTo($ex1formGroupDiv3);

            /**Hidden Fields */
            $.fn.arindamACF.acfHiddens(_controlRowId, controlClickTime, _controlKey, _isOption, _isParam).appendTo($defaultControlRow);

            /**Is Param */
            if (_isParam) {
                $.fn.arindamACF.acfParam('default', _controlKey, _controlRowId, controlClickTime).appendTo($defaultControlRow);
            }

            /**Is Option */
            if (_isOption && _minOption > 0) {
                eachAddMoreClickTime = _minOption;
                $defaultOptionArea = $('<div/>').prop('class', 'col-sm-12 arix-acf-option-container').appendTo($defaultControlRow);
                for (var i = 0; i < _minOption; i++) {
                    $defaultOptionRow = $('<div/>').prop('class', 'row arix-acf-option-row mt-1').appendTo($defaultOptionArea);
                    $defaultOptionCol1 = $('<label/>').prop('class', 'arix-acf-text-sm col-sm-1').html('Value:').appendTo($defaultOptionRow);
                    $defaultOptionCol2 = $('<div/>').prop('class', 'col-sm-3').appendTo($defaultOptionRow);
                    $defaultOptionVal = $('<input/>').attr('type', 'text').attr('name', 'option_value[' + controlClickTime + '][' + i + ']').attr('placeholder', 'Option Value').attr('required', 'required');
                    $defaultOptionVal.prop('class', 'form-control form-control-sm field-option-value').prop('id', 'optionValue_' + i + '-' + _controlRowId).appendTo($defaultOptionCol2);
                    $defaultOptionCol3 = $('<label/>').prop('class', 'arix-acf-text-sm col-sm-1').html('Text:').appendTo($defaultOptionRow);
                    $defaultOptionCol4 = $('<div/>').prop('class', 'col-sm-3').appendTo($defaultOptionRow);
                    $defaultOptionTxt = $('<input/>').attr('type', 'text').attr('name', 'option_text[' + controlClickTime + '][' + i + ']').attr('placeholder', 'Option Text').attr('required', 'required');
                    $defaultOptionTxt.prop('class', 'form-control form-control-sm field-option-text').prop('id', 'optionText_' + i + '-' + _controlRowId).appendTo($defaultOptionCol4);
                    $defaultOptionCol5 = $('<div/>').prop('class', 'col-sm-2').appendTo($defaultOptionRow);
                    if (i == 0) {
                        $addMoreBtn = $('<a/>').attr('href', 'javascript:void(0);').prop('class', 'arix-option-add-more-btn').prop('id', 'opAddMoreBtn-' + _controlRowId);
                        $addMoreBtn.html('<i class="fa fa-plus-square-o"></i>').appendTo($defaultOptionCol5);
                        $addMoreBtn.on('click', function() {
                            addMoreAcfOptionValue($(this));
                        });
                    }
                    $defaultOptionCol6 = $('<div/>').prop('class', 'col-sm-2').appendTo($defaultOptionRow);
                }
            }
            controlClickTime++;
            $.fn.arindamACF.setAcfSettingsRules();
        }

        /**Add More Option */
        function addMoreAcfOptionValue(addMoreBtnInfo) {
            if (addMoreBtnInfo) {
                var _rowContainer = addMoreBtnInfo.attr('id').split('-')[1];
                $addMoreOptionRow = $('<div/>').prop('class', 'row arix-acf-option-row mt-1').appendTo($('#' + _rowContainer).find('.arix-acf-option-container'));
                $addMoreOptionCol1 = $('<label/>').prop('class', 'arix-acf-text-sm col-sm-1').html('Value:').appendTo($addMoreOptionRow);
                $addMoreOptionCol2 = $('<div/>').prop('class', 'col-sm-3').appendTo($addMoreOptionRow);
                $addMoreOptionVal = $('<input/>').attr('type', 'text').attr('name', 'option_value[' + controlClickTime + '][' + eachAddMoreClickTime + ']').attr('placeholder', 'Option Value').attr('required', 'required');
                $addMoreOptionVal.prop('class', 'form-control form-control-sm field-option-value').prop('id', 'optionValue_' + eachAddMoreClickTime + '-' + _rowContainer).appendTo($addMoreOptionCol2);
                $addMoreOptionCol3 = $('<label/>').prop('class', 'arix-acf-text-sm col-sm-1').html('Text:').appendTo($addMoreOptionRow);
                $addMoreOptionCol4 = $('<div/>').prop('class', 'col-sm-3').appendTo($addMoreOptionRow);
                $addMoreOptionTxt = $('<input/>').attr('type', 'text').attr('name', 'option_text[' + controlClickTime + '][' + eachAddMoreClickTime + ']').attr('placeholder', 'Option Text').attr('required', 'required');
                $addMoreOptionTxt.prop('class', 'form-control form-control-sm field-option-text').prop('id', 'optionText_' + eachAddMoreClickTime + '-' + _rowContainer).appendTo($addMoreOptionCol4);
                $addMoreOptionCol5 = $('<div/>').prop('class', 'col-sm-2').appendTo($addMoreOptionRow);
                $removeMoreBtn = $('<a/>').attr('href', 'javascript:void(0);').prop('class', 'arix-option-remove-more-btn').prop('id', 'opRemoveMoreBtn_' + eachAddMoreClickTime + '-' + _rowContainer);
                $removeMoreBtn.html('<i class="fa fa-minus-square-o"></i>').appendTo($addMoreOptionCol5);
                $removeMoreBtn.on('click', function() {
                    removeAcfOptionValue($(this));
                });
                $addMoreOptionCol6 = $('<div/>').prop('class', 'col-sm-2').appendTo($addMoreOptionRow);
                eachAddMoreClickTime++;
                $.fn.arindamACF.setAcfSettingsRules();
            }
        }

        /**Remove Add More Option */
        function removeAcfOptionValue(removeMoreBtnInfo) {
            if (removeMoreBtnInfo) {
                removeMoreBtnInfo.parents('.arix-acf-option-row').remove();
            }
        }

        /**Remove ACF Control */
        function removeAcfControl(removeMoreBtnInfo) {
            if (removeMoreBtnInfo) {
                removeMoreBtnInfo.parents('.arix-acf-control-settings-rowbox').remove();
            }
        }

        /**BS Modal Show */
        document.getElementById($modalContainer.attr('id')).addEventListener('shown.bs.modal', function () {
            $col9CardBody.html('<div class="arix-acf-init-text"><span>Hey!<br/>CREATE YOUR ACF</span></div');
            $col9CardBody.css({'min-height': parseInt($ulControlList.innerHeight() - 10) + 'px'});
            $acfNameInput.val('').focus();
        });

        /**BS Modal Hide */
        document.getElementById($modalContainer.attr('id')).addEventListener('hidden.bs.modal', function () {
            $col9CardBody.html('');
        });

        function openApplicationLayout() {
            $('#' + $modalContainer.attr('id')).modal('show');
        }
        function closeApplicationLayout() {
            $('#' + $modalContainer.attr('id')).modal('hide');
        }
        function acfSettingsSaveChanges() {
            var resultACFjson = generateAcfControlSettingsJson();

            if (typeof settings.saveChangesAction == 'function') {
                settings.saveChangesAction.call(this, resultACFjson);
            }
        }
        function generateAcfControlSettingsJson() {
            var acfSettingsJson = [];
            var acfFields = [];

            var _getAcfName = $('#' + $acfNameInput.attr('id')).val();
            acfSettingsJson.push({"acf_name": _getAcfName});
            
            var _getAcfFields = $('.arix-acf-control-settings-rowbox');
            if (_getAcfFields.length) {
                _getAcfFields.each(function () {
                    var item = {};
                    var _thisAcfId = $(this).attr('id');
                    item['field_label_name'] = $('#' + _thisAcfId).find('.field-label-name').val();
                    item['field_key_name'] = $('#' + _thisAcfId).find('.field-key-name').val();
                    item['field_help_text'] = $('#' + _thisAcfId).find('.field-help-text').val();
                    item['field_id_name'] = $('#' + _thisAcfId).find('.field-id-name').val();
                    item['field_class_name'] = $('#' + _thisAcfId).find('.field-class-name').val();
                    item['field_type'] = $('#' + _thisAcfId).find('.acf-field-type').val();
                    item['field_is_required'] = $('#' + _thisAcfId).find('.field-is-required').is(':checked');
                    item['field_is_repeater'] = $('#' + _thisAcfId).find('.field-is-repeater').is(':checked');
                    item['field_option_exist'] = ($('#' + _thisAcfId).find('.acf-field-option').val() == 'true') ? true : false;

                    var _getOptionValues = $('#' + _thisAcfId).find('.field-option-value');
                    var _getOptionTexts = $('#' + _thisAcfId).find('.field-option-text');

                    if (item['field_option_exist'] && _getOptionValues.length && _getOptionTexts.length && (_getOptionValues.length == _getOptionTexts.length)) {
                        var optionValues = [];
                        _getOptionValues.each(function (i) {
                            var eachOptions = {};
                            eachOptions['value'] = $(this).val();
                            _getOptionTexts.each(function (j) {
                                if (i == j) {
                                    eachOptions['text'] = $(this).val();
                                }
                            });
                            optionValues.push(eachOptions);
                        });
                        item['option_values'] = optionValues;
                    }

                    item['field_param_exist'] = ($('#' + _thisAcfId).find('.acf-field-param').val() == 'true') ? true : false;
                    if (item['field_param_exist']) {
                        var paramValues = {};
                        paramValues['min_value'] = $('#' + _thisAcfId).find('.param-min-value').val();
                        paramValues['max_value'] = $('#' + _thisAcfId).find('.param-max-value').val();
                        item['param_values'] = paramValues;
                    }
                    acfFields.push(item);
                });
            }
            acfSettingsJson.push({"acf_fields": acfFields});
            return JSON.stringify(acfSettingsJson);
        }

        return $applicationDiv.appendTo(this);
    }

    $.fn.arindamACF.default = {
        'acfModalId': 'arixACFModal',
        'acfFormId': 'arixACFForm',
        'buttonText': 'Add ACF',
        'headerTitle': 'Create New ACF',
        saveChangesAction: function () {}
    };

    $.fn.arindamACF.acfApplicationJson = () => {
        return [
            {"id": 1, "order": 1, "name": "textbox", "key": "textbox", "is_repeater": true, "is_option": false, "min_option": 0, "is_param": true},
            {"id": 2, "order": 2, "name": "paragraph", "key": "textarea", "is_repeater": true, "is_option": false, "min_option": 0, "is_param": false},
            {"id": 3, "order": 3, "name": "editor", "key": "editor", "is_repeater": true, "is_option": false, "min_option": 0, "is_param": false},
            {"id": 4, "order": 5, "name": "number box", "key": "numberBox", "is_repeater": true, "is_option": false, "min_option": 0, "is_param": true},
            {"id": 5, "order": 4, "name": "radio option", "key": "radio", "is_repeater": false, "is_option": true, "min_option": 2, "is_param": false},
            {"id": 6, "order": 8, "name": "image upload", "key": "imageUpload", "is_repeater": true, "is_option": false, "min_option": 0, "is_param": false},
            {"id": 7, "order": 9, "name": "file upload", "key": "fileUpload", "is_repeater": true, "is_option": false, "min_option": 0, "is_param": false},
            {"id": 8, "order": 6, "name": "checkbox", "key": "checkbox", "is_repeater": false, "is_option": true, "min_option": 1, "is_param": false},
            {"id": 9, "order": 7, "name": "dropdown", "key": "selectDropdown", "is_repeater": true, "is_option": true, "min_option": 2, "is_param": false},
            {"id": 10, "order": 13, "name": "range slider", "key": "rangeSlider", "is_repeater": true, "is_option": false, "min_option": 0, "is_param": true},
            {"id": 11, "order": 14, "name": "color box", "key": "colorBox", "is_repeater": true, "is_option": false, "min_option": 0, "is_param": false},
            {"id": 12, "order": 12, "name": "url box", "key": "urlBox", "is_repeater": true, "is_option": false, "min_option": 0, "is_param": false},
            {"id": 13, "order": 10, "name": "date box", "key": "dateBox", "is_repeater": true, "is_option": false, "min_option": 0, "is_param": true},
            {"id": 14, "order": 11, "name": "time box", "key": "timeBox", "is_repeater": true, "is_option": false, "min_option": 0, "is_param": false}
        ];
    };

    $.fn.arindamACF.acfClose = () => {
        $('#' + $.fn.arindamACF.default.acfModalId).modal('hide');
    };

    $.fn.arindamACF.createElement = (elem, elemAttrObj) => {
        return $(elem).attr(elemAttrObj);
    };

    $.fn.arindamACF.acfParam = (paramType = 'default', controlKey = null, controlRowId = null, clickTime = null) => {
        var inputType = 'number';
        if (controlKey == 'dateBox') {
            inputType = 'date';
        }
        if (paramType == 'default') {
            $col12 = $.fn.arindamACF.createElement('<div/>', {class: "col-sm-12 mt-1 arix-acf-param-area"});
            $row = $.fn.arindamACF.createElement('<div/>', {class: "row"}).appendTo($col12);

            $lb1 = $.fn.arindamACF.createElement('<label/>', {class: "arix-acf-text-sm col-sm-1"}).html('Min:').appendTo($row);
            $div1 = $.fn.arindamACF.createElement('<div/>', {class: "col-sm-3"}).appendTo($row);
            $txtb1 = $.fn.arindamACF.createElement('<input/>', {
                type: inputType,
                name: "param_min_value[" + clickTime + "]",
                class: "form-control form-control-sm param-min-value",
                id: "fprmMin-" + controlRowId,
                placeholder: "Min Value",
                required: "required"  
            }).appendTo($div1);

            $lb2 = $.fn.arindamACF.createElement('<label/>', {class: "arix-acf-text-sm col-sm-1"}).html('Max:').appendTo($row);
            $div2 = $.fn.arindamACF.createElement('<div/>', {class: "col-sm-3"}).appendTo($row);
            $txtb2 = $.fn.arindamACF.createElement('<input/>', {
                type: inputType,
                name: "param_max_value[" + clickTime + "]",
                class: "form-control form-control-sm param-max-value",
                id: "fprmMax-" + controlRowId,
                placeholder: "Max Value",
                required: "required"
            }).appendTo($div2);
            return $col12;
        }
    };

    $.fn.arindamACF.acfHiddens = (controlRowId = null, controlClickTime = null, controlKey = null, isOption = null, isParam = null) => {
        $col12 = $.fn.arindamACF.createElement('<div/>', {class: "col-sm-12 mt-1 arix-acf-hidden-fields"});
        $.fn.arindamACF.createElement('<input/>', {
            type: "hidden",
            name: "field_type[" + controlClickTime + "]",
            class: "acf-field-type",
            id: "fieldType-" + controlRowId
        }).val(controlKey).appendTo($col12);
        $.fn.arindamACF.createElement('<input/>', {
            type: "hidden",
            name: "field_option[" + controlClickTime + "]",
            class: "acf-field-option",
            id: "fieldOption-" + controlRowId
        }).val(isOption).appendTo($col12);
        $.fn.arindamACF.createElement('<input/>', {
            type: "hidden",
            name: "field_param[" + controlClickTime + "]",
            class: "acf-field-param",
            id: "fieldParam-" + controlRowId
        }).val(isParam).appendTo($col12);
        return $col12;
    };

    $.fn.arindamACF.setAcfSettingsRules = () => {
        if ($('#' + $.fn.arindamACF.default.acfFormId).attr('novalidate')) {
            $('.field-label-name').each(function (i, e) {
                $(e).rules("add", {required: true})
            });
            $('.field-key-name').each(function (i, e) {
                $(e).rules("add", {required: true})
            });
            $('.field-option-value').each(function (i, e) {
                $(e).rules("add", {required: true})
            });
            $('.field-option-text').each(function (i, e) {
                $(e).rules("add", {required: true})
            });
        }
        return '';
    };
}(jQuery));