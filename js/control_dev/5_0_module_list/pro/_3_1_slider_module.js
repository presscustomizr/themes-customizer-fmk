//extends api.CZRDynModule

var CZRSlideModuleMths = CZRSlideModuleMths || {};

$.extend( CZRSlideModuleMths, {
  initialize: function( id, constructorOptions ) {
          var module = this;
          //run the parent initialize
          api.CZRDynModule.prototype.initialize.call( module, id, constructorOptions );

          //extend the module with new template Selectors
          $.extend( module, {
                itemPreAddEl : 'czr-module-slide-pre-item-input-list',
                itemInputList : 'czr-module-slide-item-input-list',
                modOptInputList : 'czr-module-slide-mod-opt-input-list'
          } );

          this.slider_layouts = { 'full-width' : 'Full Width', boxed : 'Boxed' };

          //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUTS
          module.inputConstructor = api.CZRInput.extend( module.CZRSliderInputMths || {} );
          module.inputModOptConstructor = api.CZRInput.extend( module.CZRSliderModOptInputMths || {} );

          //SET THE CONTENT PICKER OPTIONS
          $.extend( module.inputOptions, {
                'content_picker' : {
                      post : '',//['page'],<= all post types
                      taxonomy : ''//'_none_'//<= all taxonomy types
                }
          });

          //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor = api.CZRItem.extend( module.CZRSliderItem || {} );

          //declares a default ModOpt model
          this.defaultModOptModel = {
              is_mod_opt : true,
              module_id : module.id,
              'slider-speed' : 6,
              'slider-layout' : 'full-width',
              'lazyload' : 1,
              'slider-height' : 100
          };

          //declares a default Item model
          this.defaultItemModel = {
              id : '',
              title : '',
              'slide-background' : '',
              'slide-title'      : '',
              'slide-subtitle'   : '',
              'slide-link'       : ''
          };

          //overrides the default success message
          this.itemAddedMessage = serverControlParams.translatedStrings.slideAdded;
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

          // module.czr_wpQueryInfos = api.czr_wpQueryInfos();
          // if ( 'resolved' == api.czr_wpQueryDataReady.state() ) {
          //     module.czr_wpQueryInfos( api.czr_wpQueryInfos() );
          // } else {
          //     api.czr_wpQueryDataReady.done( function() {
          //           module.czr_wpQueryInfos( api.czr_wpQueryInfos() );
          //     });
          // }
          module.isReady.then( function() {

                      //Refresh the items if the associated setting has no value yet
                      api.czr_wpQueryInfos.bind( function( query_data ) {

                            var _setId = api.CZR_Helpers.getControlSettingId( module.control.id );
                            if ( ! api.has( _setId ) || ! _.isEmpty( api( _setId )() ) )
                              return;
                            //module.refreshItemCollection();
                            module.initializeModuleModel( constructorOptions, query_data )
                                  .done( function( newModuleValue ) {
                                        module.set( newModuleValue );
                                        module.refreshItemCollection();
                                  })
                                  .always( function( newModuleValue ) {

                                  });
                      } );

          });

  },//initialize

  //overrides the default method.
  //Create a contextual item based on what the server send with 'czr-query-data-ready'
  //This method is fired when the module is initialized
  //and then on each query_data update, if the associated setting has not been set yet, it is fired to get the default contextual item
  //1) image : if post / page, the featured image
  //2) title : several cases @see : hu_set_hph_title()
  //3) subtitle : no subtitle except for home page : the site tagline
  initializeModuleModel : function( constructorOptions, new_data ) {
        var module = this, dfd = $.Deferred();
        // if ( ! _.isEmpty( constructorOptions.items ) )
        //   return dfd.resolve( constructorOptions ).promise();
        //Always get the query data from the freshest source
        api.czr_wpQueryDataReady.then( function( data ) {
              var _query_data, _default;
              if ( _.isUndefined( new_data ) ) {
                    _query_data = _.isObject( data ) ? data.query_data : {};
              } else {
                    _query_data = _.isObject( new_data ) ? new_data.query_data : {};
              }

              _default = $.extend( true, {}, module.defaultItemModel );
              constructorOptions.items = [
                    $.extend( _default, {
                          'id' : 'default_item_' + module.id,
                          'slide-background' : ( ! _.isEmpty( _query_data.post_thumbnail_id ) ) ? _query_data.post_thumbnail_id : '',
                          'slide-title' : ! _.isEmpty( _query_data.post_title )? _query_data.post_title : '',
                          'slide-subtitle' : ! _.isEmpty( _query_data.subtitle ) ? _query_data.subtitle : ''
                    })
              ];
              dfd.resolve( constructorOptions );
        });
        return dfd.promise();
  },

  _getServerDefaultSlideItem : function() {

  },


  CZRSliderInputMths : {
          ready : function() {
                var input = this;
                //update the item title on slide-title change
                if ( ! input.is_mod_opt ) {
                      input.bind('slide-title:changed', function() {
                            input.updateItemTitle();
                      });
                }
                api.CZRInput.prototype.ready.call( input);
          },

          //ACTIONS ON slide-title change
          //Fired on 'slide-title:changed'
          //Don't fire in pre item case
          updateItemTitle : function( _new_val ) {
                var input = this,
                    item = input.input_parent,
                    is_preItemInput = _.has( input, 'is_preItemInput' ) && input.is_preItemInput;

                var _new_model  = $.extend( true, {}, item() ),
                    _new_title  = _new_model['slide-title'];

                $.extend( _new_model, { title : _new_title} );
                item.set( _new_model );
          }
  },//CZRSlidersInputMths


  CZRSliderModOptInputMths : {
          //overrides the default method
          setupSelect : function() {
                var input      = this,
                    modOpt      = input.input_parent,
                    module     = input.module,
                    _slider_layouts   = module.slider_layouts,//{}
                    _model = modOpt();

                //generates the options
                _.each( _slider_layouts , function( _layout_name , _k ) {
                      var _attributes = {
                                value : _k,
                                html: _layout_name
                          };
                      if ( _k == _model['slider-layout'] ) {
                            $.extend( _attributes, { selected : "selected" } );
                      }
                      $( 'select[data-type="slider-layout"]', input.container ).append( $('<option>', _attributes) );
                });
                $( 'select[data-type="slider-layout"]', input.container ).selecter();
        }
  },//CZRSlidersInputMths


  CZRSliderItem : {
          //overrides the default parent method by a custom one
          //at this stage, the model passed in the obj is up to date
          writeItemViewTitle : function( model ) {
                var item = this,
                          module  = item.module,
                          _model = model || item(),
                          _title = _model.title ? _model.title : serverControlParams.translatedStrings.slideTitle;

                _title = api.CZR_Helpers.truncate(_title, 25);
                _title = [
                      '<span class="slide-thumb"></span>',
                      _title,
                ].join('');
                wp.media.attachment( _model['slide-background'] ).fetch()
                      .always( function() {
                            var attachment = this;
                            $( '.' + module.control.css_attr.item_title , item.container ).html( _title );
                            if ( _.isObject( attachment ) && _.has( attachment, 'attributes' ) && _.has( attachment.attributes, 'sizes' ) ) {
                                 $( '.slide-thumb', item.container ).append( $('<img/>', { src : this.get('sizes').thumbnail.url, width : 32, height : 32, alt : attachment.attributes.title } ) );
                            }
                      });
          }
  }
});