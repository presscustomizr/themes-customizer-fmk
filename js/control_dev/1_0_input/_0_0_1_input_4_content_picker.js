/* Fix caching, select2 default one seems to not correctly work, or it doesn't what I think it should */
var CZRInputMths = CZRInputMths || {};
$.extend( CZRInputMths , {
  setupContentPicker: function() {
          var input  = this,
            _default_params = {
              'object'                  : ['page'],   //this.control.params.object_types  - array('page', 'post')
              'type'                    : 'post_type', //this.control.params.type  - post_type
              'minimumResultsForSearch' : false //always show
            },
            _custom_params  = input.custom_params.get();

          //Parse custom params
          var _parsed_params = {
            'object'                  : _custom_params.object || _default_params.object,
            'type'                    : _custom_params.type  || _default_params.type,
            'minimumResultsForSearch' : _custom_params.minimumResultsForSearch || _default_params.minimumResultsForSearch
          };
          console.log(_parsed_params);
          input.custom_params.set( _parsed_params );

          /* Methodize this or use a template */
          input.container.find('.czr-input').append('<select data-select-type="content-picker-select" class="js-example-basic-simple"></select>');

          //binding
          _event_map = [
              //set input value
              {
                trigger   : 'change',
                selector  : 'select[data-select-type]',
                name      : 'set_input_value',
                actions   : 'updateContentPickerModel'
              }
          ];
          input.setupDOMListeners( _event_map , { dom_el : input.container }, input );

          input.setupContentSelecter();
  },

  setupContentSelecter : function() {
          var input        = this,
              input_params = input.custom_params.get();

          input.container.find('select').select2({
            placeholder: {
              id: '-1', // the value of the option
              title: 'Select'
            },
            data : input.setupSelectedContents(),
            allowClear: true,
            ajax: {
                  url: serverControlParams.AjaxUrl,
                  type: 'POST',
                  dataType: 'json',
                  delay: 250,
                  debug: true,
                  data: function ( params ) {
                        //for some reason I'm not getting at the moment why the params.page returned when searching is different
                        var page = params.page ? params.page - 1 : 0,
                            input_params = input.custom_params.get();
                        page = params.term ? params.page : page;
                        return {
                              action: params.term ? "search-available-content-items-customizer" : "load-available-content-items-customizer",
                              search: params.term,
                              wp_customize: 'on',
                              page: page,
                              type: input_params.type,
                              object: input_params.object,
                              CZRCpNonce: serverControlParams.CZRCpNonce
                        };
              },
             /* transport: function (params, success, failure) {
                var $request = $.ajax(params);

                $request.then(success);
                $request.fail(failure);

                return $request;
              },*/
              processResults: function (data, params) {
                    if ( ! data.success )
                      return { results: [] };

                    var items   = data.data.items,
                        _results = [];

                    _.each( items, function( item ) {
                      _results.push({
                        id          : item.id,
                        title       : item.title,
                        type_label  : item.type_label,
                        object_type : item.object
                      });
                    });
                    return {
                      results: _results,
                      pagination: { more: data.data.items.length == 10 }
                    };
              },
            },
            templateSelection: input.czrFormatContentSelected,
            templateResult: input.czrFormatContentSelected,
            escapeMarkup: function (markup) { return markup; },
            minimumResultsForSearch : input_params.minimumResultsForSearch
         });
  },


  czrFormatContentSelected: function (item) {
          if ( item.loading ) return item.text;
          var markup = "<div class='content-picker-item clearfix'>" +
            "<div class='content-item-bar'>" +
              "<span class='item-title'>" + item.title + "</span>";

          if ( item.type_label ) {
            markup += "<span class='item-type'>" + item.type_label + "</span>";
          }

          markup += "</div></div>";

          return markup;
  },

  setupSelectedContents : function() {
        var input = this,
           _model = input.get();

        return _model;
  },

  updateContentPickerModel: function( obj ){
        var input = this,
            $_changed_input   = $(obj.dom_event.currentTarget, obj.dom_el ),
            _new_val          = $( $_changed_input, obj.dom_el ).select2('data');

        //purge useless select2 fields
        if ( _new_val.length ) {
          _new_val = _.map( _new_val, function( _item ){
            return {
              'id'          :  _item.id,
              'type_label'  :  _item.type_label,
              'title'       :  _item.title,
              'object_type' :  _item.object_type
            };
          });
        }

        input.set(_new_val);
  }
});//$.extend
