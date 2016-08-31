//extends api.CZRModule
var CZRBodyBgModuleMths = CZRBodyBgModuleMths || {};

$.extend( CZRBodyBgModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          //run the parent initialize
          api.CZRModule.prototype.initialize.call( module, id, options );

          //extend the module with new template Selectors
          $.extend( module, {
                itemInputList : 'czr-module-bodybg-item-content'
          } );

          //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
          module.inputConstructor = api.CZRInput.extend( module.CZRBodyBgInputMths || {} );

          //declares a default model
          module.defaultItemModel = {
                'background-color' : '#eaeaea',
                'background-image' : '',
                'background-repeat' : 'no-repeat',
                'background-attachment' : 'fixed',
                'background-position' : 'center center',
                'background-size' : 'cover'
          };
          console.log('serverControlParams', serverControlParams.body_bg_module_params );
          //fired ready :
          //1) on section expansion
          //2) or in the case of a module embedded in a regular control, if the module section is alreay opened => typically when skope is enabled
          if ( _.has( api, 'czr_activeSectionId' ) && module.control.section() == api.czr_activeSectionId() && 'resolved' != module.isReady.state() ) {
             module.ready();
          }
          api.section( module.control.section() ).expanded.bind(function(to) {
                if ( 'resolved' == module.isReady.state() )
                  return;
                module.ready();
          });
  },//initialize



  CZRBodyBgInputMths : {
          //////////////////////////////////////////////////
          ///SETUP SELECTS
          //////////////////////////////////////////////////
          //setup select on view_rendered|item_content_event_map
          setupSelect : function() {
                  var input         = this,
                      _id_param_map = {
                        'background-repeat' : 'bg_repeat_options',
                        'background-attachment' : 'bg_attachment_options',
                        'background-position' : 'bg_position_options'
                      },
                      item          = input.item,
                      serverParams  = serverControlParams.body_bg_module_params,
                      options       = {},
                      module        = input.module;

                  if ( ! _.has( _id_param_map, input.id ) )
                    return;

                  if ( _.isUndefined( serverParams ) || _.isUndefined( serverParams[ _id_param_map[input.id] ] ) )
                    return;
                  options = serverParams[ _id_param_map[input.id] ];
                  if ( _.isEmpty(options) )
                    return;
                  //generates the options
                  _.each( options, function( title, key ) {
                        var _attributes = {
                              value : key,
                              html: title
                            };
                        if ( key == input() || _.contains( input(), key ) )
                          $.extend( _attributes, { selected : "selected" } );

                        $( 'select[data-type]', input.container ).append( $('<option>', _attributes) );
                  });
                  //fire select2
                  $( 'select[data-type]', input.container ).select2();

          }
  }
});