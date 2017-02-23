/* Fix caching, select2 default one seems to not correctly work, or it doesn't what I think it should */
// the content_picker options are set in the module with :
// $.extend( module.inputOptions, {
//       'content_picker' : {
//             post : '',//<= all post types
//             taxonomy : ''//<= all taxonomy types
//       }
// });
// To narrow down the post or taxonomy types, the option can be set this way :
// $.extend( module.inputOptions, {
//       'content_picker' : {
//             post : [ 'page', 'cpt1', ...]
//             taxonomy : [ 'category', 'tag', 'Custom_Tax_1', ... ]
//       }
// });
// To disable all posts or taxonomy, use '_none_'
// $.extend( module.inputOptions, {
//       'content_picker' : {
//             post : [ 'page', 'cpt1', ...]
//             taxonomy : '_none_' //<= won't load or search in taxonomies when requesting wp in ajax
//       }
// });
var CZRInputMths = CZRInputMths || {};
( function ( api, $, _ ) {
$.extend( CZRInputMths , {
      setupContentPicker: function( wpObjectTypes ) {
              var input  = this,
              _event_map = [];

              /* Dummy for the prototype purpose */
              //input.object = ['post']; //this.control.params.object_types  - array('page', 'post')
              $.extend( {
                    post : '',
                    taxonomy : ''
              }, _.isObject( wpObjectTypes ) ? wpObjectTypes : {} );

              input.wpObjectTypes = wpObjectTypes;

              /* Methodize this or use a template */
              input.container.find('.czr-input').append('<select data-select-type="content-picker-select" class="js-example-basic-simple"></select>');

              //binding
              _event_map = [
                    //set input value
                    {
                          trigger   : 'change',
                          selector  : 'select[data-select-type]',
                          name      : 'set_input_value',
                          actions   : function( obj ){
                                var $_changed_input   = $(obj.dom_event.currentTarget, obj.dom_el ),
                                    _raw_val          = $( $_changed_input, obj.dom_el ).select2( 'data' ),
                                    _val_candidate    = {},
                                    _default          = {
                                          id          : '',
                                          type_label  : '',
                                          title       : '',
                                          object_type : '',
                                          url         : ''
                                    };

                                _raw_val = _.isArray( _raw_val ) ? _raw_val[0] : _raw_val;
                                if ( ! _.isObject( _raw_val ) || _.isEmpty( _raw_val ) ) {
                                    api.consoleLog( 'Content Picker Input : the picked value should be an object not empty.');
                                    return;
                                }

                                //normalize and purge useless select2 fields
                                //=> skip a possible _custom_ id, used for example in the slider module to set a custom url
                                _.each( _default, function( val, k ){
                                      if ( '_custom_' !== _raw_val.id ) {
                                            if ( ! _.has( _raw_val, k ) || _.isEmpty( _raw_val[ k ] ) ) {
                                                  api.consoleLog( 'content_picker : missing input param : ' + k );
                                                  return;
                                            }
                                      }
                                      _val_candidate[ k ] = _raw_val[ k ];
                                } );
                                //set the value now
                                input.set( _val_candidate );
                          }
                    }
              ];

              input.setupDOMListeners( _event_map , { dom_el : input.container }, input );
              input.setupContentSelecter();
      },

      setupContentSelecter : function() {
              var input = this;

              input.container.find('select').select2( {
                    placeholder: {
                          id: '-1', // the value of the option
                          title: 'Select'
                    },
                    data : input.setupSelectedContents(),
                    //  allowClear: true,
                    ajax: {
                          url: serverControlParams.AjaxUrl,
                          type: 'POST',
                          dataType: 'json',
                          delay: 250,
                          debug: true,
                          data: function ( params ) {
                                //for some reason I'm not getting at the moment the params.page returned when searching is different
                                var page = params.page ? params.page - 1 : 0;
                                page = params.term ? params.page : page;
                                return {
                                      action          : params.term ? "search-available-content-items-customizer" : "load-available-content-items-customizer",
                                      search          : params.term,
                                      wp_customize    : 'on',
                                      page            : page,
                                      wp_object_types : JSON.stringify( input.wpObjectTypes ),
                                      CZRCpNonce      : serverControlParams.CZRCpNonce
                                };
                          },
                          /* transport: function (params, success, failure) {
                            var $request = $.ajax(params);

                            $request.then(success);
                            $request.fail(failure);

                            return $request;
                          },*/
                          processResults: function ( data, params ) {
                                //let us remotely set a default option like custom link when initializing the content picker input.
                                input.defaultContentPickerOption = input.defaultContentPickerOption || [];

                                if ( ! data.success )
                                  return { results: input.defaultContentPickerOption };

                                var items   = data.data.items,
                                    _results = _.clone( input.defaultContentPickerOption );

                                _.each( items, function( item ) {
                                      _results.push({
                                            id          : item.id,
                                            title       : item.title,
                                            type_label  : item.type_label,
                                            object_type : item.object,
                                            url         : item.url
                                      });
                                });
                                return {
                                      results: _results,
                                      //The pagination param will trigger the infinite load
                                      pagination: { more: data.data.items.length == 10 }
                                };
                          },
                    },//ajax
                    templateSelection: input.czrFormatContentSelected,
                    templateResult: input.czrFormatContentSelected,
                    escapeMarkup: function (markup) { return markup; },
             });//select2 setup
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
               _model = input();

            return _model;
      }
});//$.extend
})( wp.customize , jQuery, _ );