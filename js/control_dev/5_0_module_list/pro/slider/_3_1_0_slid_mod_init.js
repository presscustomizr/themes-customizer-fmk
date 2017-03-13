//extends api.CZRDynModule

var CZRSlideModuleMths = CZRSlideModuleMths || {};
( function ( api, $, _ ) {
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

            this.sliderSkins = serverControlParams.slideModuleParams.sliderSkins;

            //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUTS
            module.inputConstructor = api.CZRInput.extend( module.CZRSliderItemInputCtor || {} );
            module.inputModOptConstructor = api.CZRInput.extend( module.CZRSliderModOptInputCtor || {} );

            //SET THE CONTENT PICKER OPTIONS
            $.extend( module.inputOptions, {
                  'content_picker' : {
                        post : '',//['page'],<= all post types
                        taxonomy : ''//'_none_'//<= all taxonomy types
                  }
            });

            //EXTEND THE DEFAULT CONSTRUCTORS FOR ITEMS AND MODOPTS
            module.itemConstructor = api.CZRItem.extend( module.CZRSliderItemCtor || {} );
            module.modOptConstructor = api.CZRModOpt.extend( module.CZRSliderModOptCtor || {} );

            //declares a default ModOpt model
            //this.defaultModOptModel = {
            //     is_mod_opt : true,
            //     module_id : module.id,
            //     'slider-speed' : 6,
            //     'lazyload' : 1,
            //     'slider-height' : 100
            // };
            this.defaultModOptModel = _.extend(
                  serverControlParams.slideModuleParams.defaultModOpt,
                  {
                        module_id : module.id
                  }
            );


            //declares a default Item model
            // this.defaultItemModel = {
            //     id : '',
            //     title : '',
            //     'slide-background' : '',
            //     'slide-title'      : '',
            //     'slide-subtitle'   : '',
            //     'slide-cta'         : '',
            //     'slide-link'       : '',
            //     'slide-custom-link'  : ''
            // };
            //The server model includes the slide-src property that is created when rendering the slide in the front tmpl
            this.defaultItemModel = _.omit( serverControlParams.slideModuleParams.defaultSlideMod, 'slide-src');

            //overrides the default success message
            this.itemAddedMessage = serverControlParams.i18n.mods.slider['New Slide created ! Scroll down to edit it.'];
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

                        //Refresh the module default item based on the query infos if the associated setting has no value yet
                        api.czr_wpQueryInfos.bind( function( query_data ) {
                              var _setId = api.CZR_Helpers.getControlSettingId( module.control.id );
                              if ( ! api.has( _setId ) || ! _.isEmpty( api( _setId )() ) )
                                return;

                              var initialConstrucOptions = $.extend( true, {}, constructorOptions );//detach from the original obj

                              //module.refreshItemCollection();

                              //initialize
                              module.initializeModuleModel( initialConstrucOptions, query_data )
                                    .done( function( newModuleValue ) {
                                          module.set( newModuleValue, { silent : true } );
                                          module.refreshItemCollection();
                                    })
                                    .always( function( newModuleValue ) {

                                    });
                        } );

            });

            //REFRESH ITEM TITLES
            var _refreshItemsTitles = function() {
                  module.czr_Item.each( function( _itm_ ){
                        _itm_.writeItemViewTitle();
                  });
            };
            //Always write the title on :
            //- item collection sorted
            //- on item removed
            module.bind( 'item-collection-sorted', _refreshItemsTitles );
            module.bind( 'item-removed', _refreshItemsTitles );
      },//initialize





      //Overrides the default method.
      // Fired on module.isReady.done()
      // Fired on api.czr_wpQueryInfos changes
      // => this method is always fired by the parent constructor

      //The job of this pre-processing method is to create a contextual item based on what the server send with 'czr-query-data-ready'
      //This method is fired in the initialize module method
      //and then on each query_data update, if the associated setting has not been set yet, it is fired to get the default contextual item
      //1) image : if post / page, the featured image
      //2) title : several cases @see : hu_set_hph_title()
      //3) subtitle : no subtitle except for home page : the site tagline
      initializeModuleModel : function( constructorOptions, new_data ) {
            var module = this,
                dfd = $.Deferred(),
                _setId = api.CZR_Helpers.getControlSettingId( module.control.id );

            //Bail if the the associated setting is already set
            if ( ! api.has( _setId ) || ! _.isEmpty( api( _setId )() ) )
              return dfd.resolve( constructorOptions ).promise();

            //If the setting is not set, then we can set the default item based on the query data
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
                              'is_default' : true,
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


      ///////////////////////////////////////////////////////////////////
      /// MODULE SPECIFIC INPUTS METHOD USED FOR BOTH ITEMS AND MOD OPTS
      //////////////////////////////////////////
      //this is an item or a modOpt
      slideModSetupSelect : function() {
            if ( 'skin' != this.id && 'slide-skin' != this.id )
              return;

            var input      = this,
                input_parent  = input.input_parent,
                module     = input.module,
                _sliderSkins  = module.sliderSkins,//{}
                _model = input_parent();

            //generates the options
            _.each( _sliderSkins , function( _layout_name , _k ) {
                  var _attributes = {
                            value : _k,
                            html: _layout_name
                      };
                  if ( _k == _model[ input.id ] ) {
                        $.extend( _attributes, { selected : "selected" } );
                  }
                  $( 'select[data-type="' + input.id + '"]', input.container ).append( $('<option>', _attributes) );
            });
            $( 'select[data-type="' + input.id + '"]', input.container ).selecter();
      },


      //Save color as rgb
      //this can be an item or a mod opt
      slideModSetupColorPicker : function() {
          var input  = this,
              input_parent = input.input_parent,
              _model = input_parent();

          input.container.find('input').iris( {
                palettes: true,
                hide:false,
                change : function( e, o ) {
                      //if the input val is not updated here, it's not detected right away.
                      //weird
                      //is there a "change complete" kind of event for iris ?
                      //$(this).val($(this).wpColorPicker('color'));
                      //input.container.find('[data-type]').trigger('colorpickerchange');

                      var _rgb = api.CZR_Helpers.hexToRgb( o.color.toString() ),
                          _isCorrectRgb = _.isString( _rgb ) && -1 !== _rgb.indexOf('rgb(');

                      if ( ! _isCorrectRgb )
                        _rgb = "rgb(34,34,34)";//force to dark skin if incorrect

                      //synchronizes with the original input
                      $(this).val( _rgb ).trigger('colorpickerchange').trigger('change');
                }
          });
      },


      //////////////////////////////////////////
      /// MODULE HELPERS
      //the slide-link value is an object which has always an id (post id) + other properties like title
      _isCustomLink : function( input_val ) {
            return _.isObject( input_val ) && '_custom_' === input_val.id;
      },

      _isChecked : function( v ) {
            return 0 !== v && '0' !== v && false !== v && 'off' !== v;
      }
});//extend
})( wp.customize , jQuery, _ );