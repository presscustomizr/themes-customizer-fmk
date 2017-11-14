//extends api.CZRDynModule

var CZRFeaturedPageModuleMths = CZRFeaturedPageModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRFeaturedPageModuleMths, {
      initialize: function( id, options ) {
            var module = this;
            //run the parent initialize
            api.CZRDynModule.prototype.initialize.call( module, id, options );

            //extend the module with new template Selectors
            $.extend( module, {
                  itemPreAddEl : 'czr-module-fp-pre-add-view-content',
                  itemInputList : 'czr-module-fp-view-content'
            } );

            //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
            module.inputConstructor = api.CZRInput.extend( module.CZRFeaturedPagesInputMths || {} );
            //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
            module.itemConstructor = api.CZRItem.extend( module.CZRFeaturedPagesItem || {} );

            //declares a default model
            this.defaultItemModel = {
                  id : '',
                  title : '' ,
                  'fp-post'  : '',
                  'fp-title' : '',
                  'fp-text'  : '',
                  'fp-image' : '',
            };

            //overrides the default success message
            this.itemAddedMessage = serverControlParams.i18n.featuredPageAdded;
            api.section( module.control.section() ).expanded.bind(function(to) {
                  if ( 'resolved' == module.isReady.state() )
                        return;
                  module.ready();
            });
      },//initialize





      //@override
      // wait for the ajax result!
      //the item is manually added.
      //We should have a pre Item
      addItem : function(obj) {
            var module     = this,
                item       = module.preItem,
                item_model = item();

            if ( _.isEmpty(item_model) || ! _.isObject(item_model) ) {
                throw new Error('addItem : an item should be an object and not empty. In : ' + module.id +'. Aborted.' );
            }

            var _fp_post        = item_model['fp-post'];
            if ( typeof _fp_post  == "undefined" )
              return;

            _fp_post = _fp_post[0];

            //AJAX ACTIONS ON ADD ITEM
            //when a new featured page is added, update the model (text, featured image ) base on the selected post
            //The parent method is called on ajaxrequest.done()
            var done_callback =  function( _to_update ) {
                  item.set( $.extend( item_model, _to_update) );
                  api.CZRDynModule.prototype.addItem.call( module, obj );
            };

            var request = module.CZRFeaturedPagesItem.setContentAjaxInfo( _fp_post.id, {}, done_callback );
      },







      CZRFeaturedPagesInputMths : {
            ready : function() {
                    var input = this;
                    //update the item model on fp-post change
                    input.bind( 'fp-post:changed', function(){
                      input.updateItemModel();
                    });
                    //update the item title on fp-title change
                    input.bind( 'fp-title:changed', function(){
                      input.updateItemTitle();
                    });

                    api.CZRInput.prototype.ready.call( input );
            },
            //override czr img uploader input constructor
            //we need this otherwise we cannot add the buttons to the input container
            //when the input model is not, as the template will be rendered before the ready
            //method is called
            setupImageUploader:  function(){
                    var input = this;
                    //temporary
                    input.container.bind( 'fp-image:content_rendered', function(){
                      input.addResetDefaultButton();
                    });

                    //see add a reset to default image button
                    input.container.on('click keydown', '.default-fpimage-button', function(){
                      input.setThumbnailAjax();
                    });

                    api.CZRInput.prototype.setupImageUploader.call( input );
            },
            //ACTIONS ON fp-title change
            //Fired on 'fp-title:changed'
            //Don't fire in pre item case
            updateItemModel : function( _new_val ) {

                    var input = this,
                        item = this.input_parent,
                        is_preItemInput = _.has( input, 'is_preItemInput' ) && input.is_preItemInput;

                    //check if we are in the pre Item case => if so, the fp-post might be empty
                    if ( ! _.has( item(), 'fp-post') || _.isEmpty( item()['fp-post'] ) )
                      return;

                    var _new_model      = _.clone( item() ),
                        _fp_post        = _new_model['fp-post'][0],
                        _new_title      = _fp_post.title,
                        inputCollection = is_preItemInput ? input.module.preItemInput : item.czr_Input;

                    if ( is_preItemInput ) {
                          $.extend( _new_model, { title : _new_title, 'fp-title' : _new_title } );
                          item.set( _new_model );
                    } else {

                          var done_callback =  function( _to_update ) {
                            _.each( _to_update, function( value, id ){
                                item.czr_Input( id ).set( value );
                            });
                          };
                          //pass the fp-title so it gets updated after the ajax callback
                          var request = item.setContentAjaxInfo( _fp_post.id, {'fp-title' : _new_title}, done_callback );
                    }
            },


            updateItemTitle : function( _new_val ) {
                    var input = this,
                        item = this.input_parent,
                        is_preItemInput = _.has( input, 'is_preItemInput' ) && input.is_preItemInput;

                    if ( is_preItemInput )
                      return;
                    var _new_model  = _.clone( item() ),
                        _new_title  = "undefined" !== typeof _new_model['fp-title'] ? _new_model['fp-title'] : '';

                    $.extend( _new_model, { title : _new_title} );
                    item.set( _new_model );
            },


            setThumbnailAjax : function() {
                    var item     = this.input_parent,
                        _fp_post = item.czr_Input('fp-post')(),
                        _post_id;

                    if ( typeof _fp_post  == "undefined" )
                      return;

                    _fp_post = _fp_post[0];
                    _post_id = _fp_post.id;

                    $('.fpimage-reset-messages p').hide();

                    //AJAX STUFF
                    //retrieve some ajax info
                    request = wp.ajax.post( 'get-fp-post-tb', {
                            'wp_customize': 'on',
                            'id'          : _post_id,
                            'CZRFPNonce'  : serverControlParams.CZRFPNonce
                            //nonce needed USE 1 for everything?
                    });


                    request.done( function( data ){
                            var thumbnail = data,
                                input = item.czr_Input('fp-image');

                            if ( 0 !== thumbnail.length ) {
                              $('.fpimage-reset-messages .success', input.container ).show('fast').fadeOut();
                              input.set( thumbnail );
                            }else {
                              $('.fpimage-reset-messages .warning', input.container ).show('fast').delay(2000).fadeOut();
                            }
                    });

                    request.fail(function( data ) {
                            if ( typeof console !== 'undefined' && console.error ) {
                              console.error( data );
                            }
                    });
            },

            addResetDefaultButton : function( $_template_params ) {
                    var input        = this,
                        item         = input.input_parent,
                        buttonLabel  = serverControlParams.i18n.featuredPageImgReset,
                        successMess  = serverControlParams.i18n.featuredPageResetSucc,
                        errMess      = serverControlParams.i18n.featuredPageResetErr,
                        messages     = '<div class="fpimage-reset-messages" style="clear:both"><p class="success" style="display:none">'+successMess+'</p><p class="warning" style="display:none">'+errMess+'</p></div>';

                    $('.actions', input.container)
                      .append('<button type="button" class="button default-fpimage-button">'+ buttonLabel +'</button>');
                    $('.fpimage-reset-messages', input.container ).detach();
                    $(input.container).append( messages );
            }
      },//CZRFeaturedPagesInputMths








      CZRFeaturedPagesItem : {
            setContentAjaxInfo : function( _post_id, _additional_inputs, done_callback ) {
                    //called be called from the input and from the item
                    var _to_update         = _additional_inputs || {};

                    //AJAX STUFF
                    //retrieve some ajax info
                    request = wp.ajax.post( 'get-fp-post', {
                          'wp_customize': 'on',
                          'id'          : _post_id,
                          'CZRFPNonce'  : serverControlParams.CZRFPNonce
                          //nonce needed USE 1 for everything?
                    });

                    request.done( function( data ){
                          var _post_info = data.post_info;

                          if ( 0 !== _post_info.length ) {
                            $.extend( _to_update, { 'fp-image' : _post_info.thumbnail, 'fp-text' : _post_info.excerpt } );
                            if ( "function" === typeof done_callback )
                              done_callback( _to_update );
                          }
                    });

                    request.fail(function( data ) {
                          if ( typeof console !== 'undefined' && console.error ) {
                            console.error( data );
                          }
                    });

                    return request;
            },

            //overrides the default parent method by a custom one
            //at this stage, the model passed in the obj is up to date
            writeItemViewTitle : function( model ) {
                  var item = this,
                            module  = item.module,
                            _model = model || item(),
                            _title = _model.title ? _model.title : serverControlParams.i18n.featuredPageTitle;

                  _title = api.CZR_Helpers.truncate(_title, 25);
                  $( '.' + module.control.css_attr.item_title , item.container ).html( _title );
            }
      }
});//extend
})( wp.customize , jQuery, _ );
//extends api.CZRModule
var CZRTextModuleMths = CZRTextModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRTextModuleMths, {
  initialize: function( id, options ) {
        var module = this;
        //run the parent initialize
        api.CZRModule.prototype.initialize.call( module, id, options );

        //extend the module with new template Selectors
        $.extend( module, {
              itemInputList : 'czr-module-text-view-content',
        } );

        //declares a default model
        module.defaultItemModel = {
              id : '',
              text : ''
        };
  }//initialize
});
})( wp.customize , jQuery, _ );//extends api.CZRDynModule

var CZRSlideModuleMths = CZRSlideModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRSlideModuleMths, {
      initialize: function( id, constructorOptions ) {
            var module = this;

            module.initialConstrucOptions = $.extend( true, {}, constructorOptions );//detach from the original obj

            //run the parent initialize
            api.CZRDynModule.prototype.initialize.call( module, id, constructorOptions );

            //extend the module with new template Selectors
            $.extend( module, {
                  itemPreAddEl : 'czr-module-slide-pre-item-input-list',
                  itemInputList : 'czr-module-slide-item-input-list',
                  modOptInputList : 'czr-module-slide-mod-opt-input-list'
            } );

            this.sliderSkins = serverControlParams.slideModuleParams.sliderSkins;//light, dark

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
                  var _refreshModuleModel = function( query_data ) {
                        var _setId = api.CZR_Helpers.getControlSettingId( module.control.id );
                        //module.refreshItemCollection();

                        //initialize
                        module.initializeModuleModel( module.initialConstrucOptions, query_data )
                              .done( function( newModuleValue ) {
                                    module.set( newModuleValue, { silent : true } );
                                    module.refreshItemCollection();
                              })
                              .always( function( newModuleValue ) {

                              });
                  };

                  //Fired on module ready and skope ready ( even when skope is deactivated )
                  //Fired on skope switch
                  var _toggleModuleItemVisibility = function() {
                        var $preItemBtn = $('.' + module.control.css_attr.open_pre_add_btn, module.container ),
                            $preItemWrapper = $('.' + module.control.css_attr.pre_add_wrapper, module.container),
                            _isLocal = true;

                        //skope might be deactivated by the user
                        if ( api.czr_isSkopOn() ) {
                            _isLocal = 'local' == api.czr_skope( api.czr_activeSkopeId() )().skope;
                        }

                        //HIDE THE ITEM CREATION WHEN NOT LOCAL
                        $preItemBtn.toggle( _isLocal );
                        $preItemWrapper.toggle( _isLocal );
                        module.itemsWrapper.toggle( _isLocal );

                        //DISPLAY A NOTICE WHEN NOT LOCAL
                        if ( ! _isLocal && api.czr_isSkopOn() ) {
                              var _localSkopeId = _.findWhere( api.czr_currentSkopesCollection(), { skope : 'local' } ).id;
                              if ( ! module.control.container.find( '.slide-mod-skope-notice').length ) {
                                    module.control.container.append( $( '<div/>', {
                                              class: 'slide-mod-skope-notice',
                                              html : [
                                                    serverControlParams.i18n.mods.slider['You can set the global options of the slider here by clicking on the gear icon : height, font size, effects...'],
                                                    serverControlParams.i18n.mods.slider['Those settings will be inherited by the more specific options levels.'],
                                                    '<br/><br/>',
                                                    serverControlParams.i18n.mods.slider['Switch to the most specific level of options to start building a slider'],
                                                    ':',
                                                    api.czr_skopeBase.buildSkopeLink( _localSkopeId )
                                              ].join( ' ' )
                                        })
                                    );
                              } else {
                                  module.control.container.find( '.slide-mod-skope-notice').show();
                              }
                        } else {
                              if ( 1 == module.control.container.find( '.slide-mod-skope-notice').length )
                                module.control.container.find( '.slide-mod-skope-notice').remove();
                        }

                  };

                  //Refresh the module default item based on the query infos if the associated setting has no value yet
                  api.czr_wpQueryInfos.bind( function( query_data ) {
                        _refreshModuleModel( query_data );
                  } );

                  //On skope switch
                  //1) refresh module model, set items to empty if not local
                  //2) hide the item and pre-item container if not local
                  // {
                  //       current_skope_id    : to,
                  //       previous_skope_id   : from,
                  //       updated_setting_ids : _updatedSetIds || []
                  // }
                  api.bind( 'skope-switched-done', function( params ) {
                        _refreshModuleModel( api.czr_wpQueryInfos() );
                        _.delay( function() {
                              _toggleModuleItemVisibility();
                        }, 200 );

                  });

                  //ACTIONS ON SKOPE READY
                  //1) Hide items and pre-items if skope is not local
                  //2) set the item and modopt refresh button state, and set their state according to the module changes
                  api.czr_skopeReady.then( function() {
                        //ITEMS AND PRE ITEMS
                        _.delay( function() {
                              _toggleModuleItemVisibility();
                        }, 200 );

                        //UPDATE REFRESH BUTTONS STATE ON MODULE CHANGES
                        module.callbacks.add( function( to, from ) {
                              module.czr_Item.each( function( _itm_ ){
                                    if ( 'expanded' != _itm_.viewState() )
                                      return;
                                    if ( 1 == _itm_.container.find('.refresh-button').length ) {
                                          _itm_.container.find('.refresh-button').prop( 'disabled', false );
                                    }
                              });
                              if ( module.czr_ModOpt && module.czr_ModOpt.isReady ) {
                                    module.czr_ModOpt.isReady.then( function() {
                                          if ( api.czr_ModOptVisible() ) {
                                                if ( 1 == module.czr_ModOpt.container.find('.refresh-button').length ) {
                                                      module.czr_ModOpt.container.find('.refresh-button').prop( 'disabled', false );
                                                }
                                          }
                                    });
                              }
                        });
                  });
            });//module.isReady

            //REFRESH ITEM TITLES
            var _refreshItemsTitles = function() {
                  module.czr_Item.each( function( _itm_ ){
                        _itm_.writeItemViewTitle();
                  });
            };
            //Always write the title on :
            //- module model initialized => typically when the query data has been set and is used to set a default item
            //- item collection sorted
            //- on item removed
            //module.bind( 'module-model-initialized', _refreshItemsTitles );
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
                dfd = $.Deferred();

            //Wait for the control to be registered when switching skope
            api.control.when( module.control.id, function() {
                  var _setId = api.CZR_Helpers.getControlSettingId( module.control.id );

                  //bail if the setting id is not registered
                  if ( ! api.has( _setId ) )
                    return dfd.resolve( constructorOptions ).promise();

                  // console.log('api.control.has( module.control.id ); ', api.control.has( module.control.id ) );
                  // console.log('module.initialConstrucOptions', module.initialConstrucOptions );
                  // console.log('api( _setId )()', _setId, api( _setId )());
                  //Bail if the skope is not local
                  //Make sure to reset the items to [] if the current item is_default
                  // if ( api.czr_skope.has( api.czr_activeSkopeId() ) ) {
                  //     console.log( 'SKOPE ?', api.czr_activeSkopeId(), api.czr_skope( api.czr_activeSkopeId() )().skope );
                  //     console.log( api.czr_isSkopOn() );
                  // }

                  //WHEN SKOPE IS READY
                  //=> If skope is disabled, this promise will be resolved anyway
                  // => that's why we need to re-check that skope is on below
                  api.czr_skopeReady.then( function() {
                        //IF NOT LOCAL SKOPE
                            //Empties the items
                            //+ return the current option

                            if ( api.czr_isSkopOn() ) {
                                  //IF LOCAL
                                  //If inheriting from a parent, then let's set the default item
                                  //if setting is dirty in local skope, let's return the ctor options.
                                  var _isLocal = api.czr_skope.has( api.czr_activeSkopeId() ) && 'local' ==  api.czr_skope( api.czr_activeSkopeId() )().skope;
                                      _isLocalAndDirty = _isLocal && module._isSettingDirty();

                                  if ( _isLocalAndDirty ) {
                                        return dfd.resolve( constructorOptions ).promise();
                                  } else if ( ! _isLocal ) {
                                        var _newCtorOptions = $.extend( true, {}, constructorOptions );
                                        _newCtorOptions.items = [];
                                        return dfd.resolve( _newCtorOptions ).promise();
                                  }
                            }


                            //If the setting is not set, then we can set the default item based on the query data
                            // if ( ! _.isEmpty( constructorOptions.items ) )
                            //   return dfd.resolve( constructorOptions ).promise();
                            //Always get the query data from the freshest source
                            api.czr_wpQueryDataReady.then( function( data ) {
                                  data = api.czr_wpQueryInfos() || data;//always get the latest query infos
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
                        });//api.control.when()
                  });//api.czr_skopeReady()

            //Make sure this is resolved, even when the control is not registered back for some reasons
            _.delay( function() {
                  if ( ! api.control.has( module.control.id ) ) {
                        api.errorLog( 'Slide Module : initializeModuleModel, the control has not been registered after too long.');
                        dfd.resolve( constructorOptions );
                  }
            }, 5000 );
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
      },

      _isSettingDirty : function() {
            if (  ! api.czr_isSkopOn() )
              return true;
            if ('pending' == api.czr_skopeReady.state() )
              return false;
            var module = this,
                _setId = api.CZR_Helpers.getControlSettingId( module.control.id );
            return ( api.czr_skope( api.czr_activeSkopeId() ).getSkopeSettingDirtyness( _setId ) || api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( _setId ) );
      },
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule

var CZRSlideModuleMths = CZRSlideModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRSlideModuleMths, {

      ///////////////////////////////////////////////////////////
      /// INPUT CONSTRUCTORS
      //////////////////////////////////////////
      CZRSliderItemInputCtor : {
            ready : function() {
                  var input = this;
                  //update the item title on slide-title change
                  if ( 'slide-title' === input.id ) {
                        input.bind( function( to ) {
                              input.updateItemTitle( to );
                        });
                  }

                  //add the custom link option to the content picker
                  if ( 'slide-link' == input.id ) {
                        input.defaultContentPickerOption = [{
                              id          : '_custom_',
                              title       : [ '<span style="font-weight:bold">' , serverControlParams.i18n.mods.slider['Set a custom url'], '</span>' ].join(''),
                              type_label  : '',
                              object_type : '',
                              url         : ''
                        }];
                  }

                  api.CZRInput.prototype.ready.call( input);
            },

            //overrides the default method
            setupSelect : function() {
                  return this.module.slideModSetupSelect.call( this );
            },

            //Save color as rgb
            setupColorPicker : function() {
                  return this.module.slideModSetupColorPicker.call( this );
            },

            //ACTIONS ON czr_input('slide-title') change
            //Don't fire in pre item case
            //@return void
            updateItemTitle : function( _new_title ) {
                  var input = this,
                      item = input.input_parent,
                      is_preItemInput = _.has( input, 'is_preItemInput' ) && input.is_preItemInput,
                      _new_model  = $.extend( true, {}, item() );
                  // if ( is_preItemInput )
                  //   return;
                  $.extend( _new_model, { title : _new_title } );

                  //This is listened to by module.czr_Item( item.id ).itemReact
                  //the object passed is needed to avoid a refresh
                  item.set(
                        _new_model,
                        {
                              input_changed     : 'title',
                              input_transport   : 'postMessage',
                              not_preview_sent  : true//<= this parameter set to true will prevent the setting to be sent to the preview ( @see api.Setting.prototype.preview override ). This is useful to decide if a specific input should refresh or not the preview.} );
                        }
                  );
            }
      },//CZRSlidersInputMths



      CZRSliderModOptInputCtor : {
            ready : function() {
                  var input = this;
                  //add the custom link option to the content picker
                  if ( 'fixed-link' == input.id ) {
                        input.defaultContentPickerOption = [{
                              id          : '_custom_',
                              title       : [ '<span style="font-weight:bold">' , serverControlParams.i18n.mods.slider['Set a custom url'], '</span>' ].join(''),
                              type_label  : '',
                              object_type : '',
                              url         : ''
                        }];
                  }

                  api.CZRInput.prototype.ready.call( input);
            },

            //overrides the default method
            setupSelect : function() {
                  return this.module.slideModSetupSelect.call( this );
            },

            //Save color as rgb
            setupColorPicker : function() {
                  return this.module.slideModSetupColorPicker.call( this );
            },
      }//CZRSliderItemInputCtor
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule

var CZRSlideModuleMths = CZRSlideModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRSlideModuleMths, {
      CZRSliderItemCtor : {
              //overrides the parent ready
              ready : function() {
                    var item = this,
                        module = item.module;
                    //wait for the input collection to be populated,
                    //and then set the input visibility dependencies
                    item.inputCollection.bind( function( col ) {
                          if( _.isEmpty( col ) )
                            return;
                          try { item.setInputVisibilityDeps(); } catch( er ) {
                                api.errorLog( 'item.setInputVisibilityDeps() : ' + er );
                          }

                          //typically, hides the caption content input if user has selected a fixed content in the mod opts
                          item.setModOptDependantsVisibilities();

                          //append a notice to the default slide about how to disable the metas in single post
                          if ( item().is_default && item._isSinglePost() ) {
                              item._printPostMetasNotice();
                          }

                          //ITEM REFRESH AND FOCUS BTN
                          //1) Set initial state
                          item.container.find('.refresh-button').prop( 'disabled', true );

                          //2) listen to user actions
                          //add DOM listeners
                          api.CZR_Helpers.setupDOMListeners(
                                [     //toggle mod options
                                      {
                                            trigger   : 'click keydown',
                                            selector  : '.refresh-button',
                                            name :      'slide-refresh-preview',
                                            actions   : function( ev ) {
                                                  //var _setId = api.CZR_Helpers.getControlSettingId( module.control.id );
                                                  // if ( api.has( _setId ) ) {
                                                  //       api( _setId ).previewer.send( 'setting', [ _setId, api( _setId )() ] );
                                                  //       _.delay( function() {
                                                  //             item.container.find('.refresh-button').prop( 'disabled', true );
                                                  //       }, 250 );
                                                  // }
                                                  api.previewer.refresh().done( function() {
                                                        _.delay( function() {
                                                              item.container.find('.refresh-button').prop( 'disabled', true );
                                                        }, 250 );
                                                  });
                                            }
                                      },
                                      {
                                            trigger   : 'click keydown',
                                            selector  : '.focus-button',
                                            name : 'slide-focus-action',
                                            actions   : function( ev ) {
                                                  api.previewer.send( 'slide_focus', {
                                                        module_id : item.module.id,
                                                        module : { items : $.extend( true, {}, module().items ) , modOpt : module.hasModOpt() ?  $.extend( true, {}, module().modOpt ): {} },
                                                        item_id : item.id
                                                  });
                                            }
                                      }
                                ],//actions to execute
                                { model : item(), dom_el : item.container },//model + dom scope
                                item //instance where to look for the cb methods
                          );//api.CZR_Helpers.setupDOMListeners()
                    });//item.inputCollection.bind()

                    item.viewState.bind( function( state ) {
                          if ( 'expanded' == state ) {
                                api.previewer.send( 'item_expanded', {
                                      module_id : item.module.id,
                                      module : { items : $.extend( true, {}, module().items ) , modOpt : module.hasModOpt() ?  $.extend( true, {}, module().modOpt ): {} },
                                      item_id : item.id
                                });
                          }
                    });

                    //fire the parent
                    api.CZRItem.prototype.ready.call( item );
              },


              ////////////////////////////// SMALL HELPERS //////////////////
              ///////////////////////////////////////////////////////////////////////////
              //HELPER
              //@return bool
              _isSinglePost : function() {
                    return api.czr_wpQueryInfos && api.czr_wpQueryInfos().conditional_tags && api.czr_wpQueryInfos().conditional_tags.is_single;
              },

              //@return void()
              _printPostMetasNotice : function() {
                    var item = this;
                    //add a DOM listeners
                    api.CZR_Helpers.setupDOMListeners(
                          [     //toggle mod options
                                {
                                      trigger   : 'click keydown',
                                      selector  : '.open-post-metas-option',
                                      name      : 'toggle_mod_option',
                                      //=> open the module option and focus on the caption content tab
                                      actions   : function() {
                                            //expand the modopt panel and focus on a specific tab right after
                                            api.czr_ModOptVisible( true, { module : item.module, focus : 'section-topline-2' } );
                                      }
                                }
                          ],//actions to execute
                          { model : item(), dom_el : item.container },//model + dom scope
                          item //instance where to look for the cb methods
                    );

                    var _html_ = [
                        '<strong>',
                        serverControlParams.i18n.mods.slider['You can display or hide the post metas ( categories, author, date ) in'],
                        '<a href="javascript:void(0)" class="open-post-metas-option">' + serverControlParams.i18n.mods.slider['the general options'] + '</a>',
                        '</strong>'
                    ].join(' ') + '.';

                    item.czr_Input('slide-title').container.prepend( $('<p/>', { html : _html_, class : 'czr-notice' } ) );
              },


              //////////////////////////////FIXED CONTENT DEPENDENCIES //////////////////
              ///////////////////////////////////////////////////////////////////////////
              //@return void()
              //Fired when module is ready
              setModOptDependantsVisibilities : function() {
                    var item = this,
                        module = item.module,
                        _dependants = [ 'slide-title', 'slide-subtitle', 'slide-cta', 'slide-link', 'slide-custom-link', 'slide-link-target' ],
                        modOptModel = module.czr_ModOpt();

                    _.each( _dependants, function( _inpt_id ) {
                          if ( ! item.czr_Input.has( _inpt_id ) )
                            return;
                          var _input_ = item.czr_Input( _inpt_id );

                          //Fire on init
                          _input_.enabled( ! module._isChecked( modOptModel['fixed-content'] ) );
                    });

                    if ( module._isChecked( modOptModel['fixed-content'] ) ) {
                          //add a DOM listeners
                          api.CZR_Helpers.setupDOMListeners(
                                [     //toggle mod options
                                      {
                                            trigger   : 'click keydown',
                                            selector  : '.open-mod-option',
                                            name      : 'toggle_mod_option',
                                            //=> open the module option and focus on the caption content tab
                                            actions   : function() {
                                                  //expand the modopt panel and focus on a specific tab right after
                                                  api.czr_ModOptVisible( true, { module : module, focus : 'section-topline-2' } );
                                            }
                                      }
                                ],//actions to execute
                                { model : item(), dom_el : item.container },//model + dom scope
                                item //instance where to look for the cb methods
                          );

                          var _html_ = [
                              '<strong>',
                              serverControlParams.i18n.mods.slider['The caption content is currently fixed and set in'],
                              '<a href="javascript:void(0)" class="open-mod-option">' + serverControlParams.i18n.mods.slider['the general options'] + '</a>',
                              '</strong>'
                          ].join(' ') + '.';

                          item.czr_Input('slide-title').container.prepend( $('<p/>', { html : _html_, class : 'czr-fixed-content-notice' } ) );
                    } else {
                          var $_notice = item.container.find('.czr-fixed-content-notice');
                          if ( false !== $_notice.length ) {
                                $_notice.remove();
                          }
                    }

              },

              //@params : { before : 'slide-title' }
              toggleDisabledNotice : function( params ) {
                    var item = this;
                    params = _.extend( { before : 'slide-title' }, params );

              },
              ////////////////////////////// END OF FIXED CONTENT DEPENDENCIES //////////////////
              ///////////////////////////////////////////////////////////////////////////



              //Fired when the input collection is populated
              //At this point, the inputs are all ready (input.isReady.state() === 'resolved') and we can use their visible Value ( set to true by default )
              setInputVisibilityDeps : function() {
                    var item = this,
                        module = item.module,
                        _isCustom = function( val ) {
                              return 'custom' == val;
                        };

                    //Internal item dependencies
                    item.czr_Input.each( function( input ) {
                          switch( input.id ) {
                                // case 'slide-title' :
                                //       //Fire on init
                                //       item.czr_Input('slide-subtitle').visible( ! _.isEmpty( input() ) );

                                //       //React on change
                                //       input.bind( function( to ) {
                                //             item.czr_Input('slide-subtitle').visible( ! _.isEmpty( to ) );
                                //       });
                                // break;

                                case 'slide-link-title' :
                                      //Fire on init
                                      item.czr_Input('slide-link').visible( module._isChecked( input() ) || ! _.isEmpty( item.czr_Input('slide-cta')() ) );
                                      item.czr_Input('slide-link-target').visible( module._isChecked( input() ) || ! _.isEmpty( item.czr_Input('slide-cta')() ) );

                                      //React on change
                                      input.bind( function( to ) {
                                            item.czr_Input('slide-link').visible( module._isChecked( to ) || ! _.isEmpty( item.czr_Input('slide-cta')() ) );
                                            item.czr_Input('slide-link-target').visible( module._isChecked( to ) || ! _.isEmpty( item.czr_Input('slide-cta')() ) );
                                      });
                                break;

                                case 'slide-cta' :
                                      //Fire on init
                                      item.czr_Input('slide-link').visible( ! _.isEmpty( input() ) || module._isChecked( item.czr_Input('slide-link-title')() ) );
                                      item.czr_Input('slide-custom-link').visible( ! _.isEmpty( input() ) && module._isCustomLink( item.czr_Input('slide-link')() ) );
                                      item.czr_Input('slide-link-target').visible( ! _.isEmpty( input() ) || module._isChecked( item.czr_Input('slide-link-title')() ) );

                                      //React on change
                                      input.bind( function( to ) {
                                            item.czr_Input('slide-link').visible( ! _.isEmpty( to ) || module._isChecked( item.czr_Input('slide-link-title')() ) );
                                            item.czr_Input('slide-custom-link').visible( ! _.isEmpty( to ) && module._isCustomLink( item.czr_Input('slide-link')() ) );
                                            item.czr_Input('slide-link-target').visible( ! _.isEmpty( to ) || module._isChecked( item.czr_Input('slide-link-title')() ) );
                                      });
                                break;

                                //the slide-link value is an object which has always an id (post id) + other properties like title
                                case 'slide-link' :
                                      //Fire on init
                                      item.czr_Input('slide-custom-link').visible( module._isCustomLink( input() ) );
                                      //React on change
                                      input.bind( function( to ) {
                                            item.czr_Input('slide-custom-link').visible( module._isCustomLink( to ) );
                                      });
                                break;

                                // case 'slide-use-custom-skin' :
                                //       //Fire on init
                                //       item.czr_Input('slide-skin').visible( module._isChecked( input() ) );
                                //       item.czr_Input('slide-skin-color').visible( module._isChecked( input() ) && _isCustom( item.czr_Input('slide-skin')() ) );
                                //       item.czr_Input('slide-opacity').visible( module._isChecked( input() ) );
                                //       item.czr_Input('slide-text-color').visible( module._isChecked( input() ) && _isCustom( item.czr_Input('slide-skin')() ) );

                                //       //React on change
                                //       input.bind( function( to ) {
                                //             item.czr_Input('slide-skin').visible( module._isChecked( to ) );
                                //             item.czr_Input('slide-skin-color').visible( module._isChecked( to ) && _isCustom( item.czr_Input('slide-skin')() ) );
                                //             item.czr_Input('slide-opacity').visible( module._isChecked( to ) );
                                //             item.czr_Input('slide-text-color').visible( module._isChecked( to ) && _isCustom( item.czr_Input('slide-skin')() ) );
                                //       });
                                // break;

                                // case 'slide-skin' :
                                //       //Fire on init
                                //       item.czr_Input('slide-skin-color').visible( module._isChecked( 'slide-use-custom-skin' ) && _isCustom( input() ) );
                                //       item.czr_Input('slide-text-color').visible( module._isChecked( 'slide-use-custom-skin' ) && _isCustom( input() ) );

                                //       //React on change
                                //       input.bind( function( to ) {
                                //             item.czr_Input('slide-skin-color').visible( module._isChecked( 'slide-use-custom-skin' ) && _isCustom( to ) );
                                //             item.czr_Input('slide-text-color').visible( module._isChecked( 'slide-use-custom-skin' ) && _isCustom( to ) );
                                //       });
                                // break;
                          }
                    });
              },

              //overrides the default parent method by a custom one
              //at this stage, the model passed in the obj is up to date
              writeItemViewTitle : function( model, data ) {

                    var item = this,
                        index = 1,
                        module  = item.module,
                        _model = model || item(),
                        _title,
                        _slideBg,
                        _src = 'not_set',
                        _areDataSet = ! _.isUndefined( data ) && _.isObject( data );

                    //When shall we update the item title ?
                    //=> when the slide title or the thumbnail have been updated
                    //=> on module model initialized
                    if ( _areDataSet && data.input_changed && ! _.contains( ['slide-title', 'slide-background' ], data.input_changed ) )
                      return;

                    //set title with index
                    if ( ! _.isEmpty( _model.title ) ) {
                          _title = _model.title;
                    } else {
                          //find the current item index in the collection
                          var _index = _.findIndex( module.itemCollection(), function( _itm ) {
                                return _itm.id === item.id;
                          });
                          _index = _.isUndefined( _index ) ? index : _index + 1;
                          _title = [ serverControlParams.i18n.mods.slider['Slide'], _index ].join( ' ' );
                    }

                    //if the slide title is set, use it
                    _title = _.isEmpty( _model['slide-title'] ) ? _title : _model['slide-title'];
                    _title = api.CZR_Helpers.truncate( _title, 15 );

                    //make sure the slide bg id is a number
                    _slideBg = ( _model['slide-background'] && _.isString( _model['slide-background'] ) ) ? parseInt( _model['slide-background'], 10 ) : _model['slide-background'];

                    // _title = [
                    //       '<div class="slide-thumb"></div>',
                    //       '<div class="slide-title">' + _title + '</div>',,
                    // ].join('');

                    var _getThumbSrc = function() {
                          return $.Deferred( function() {
                                var dfd = this;
                                //try to set the default src
                                if ( serverControlParams.slideModuleParams && serverControlParams.slideModuleParams.defaultThumb ) {
                                      _src = serverControlParams.slideModuleParams.defaultThumb;
                                }
                                if ( ! _.isNumber( _slideBg ) ) {
                                      dfd.resolve( _src );
                                } else {
                                      wp.media.attachment( _slideBg ).fetch()
                                            .always( function() {
                                                  var attachment = this;
                                                  if ( _.isObject( attachment ) && _.has( attachment, 'attributes' ) && _.has( attachment.attributes, 'sizes' ) ) {
                                                        _src = this.get('sizes').thumbnail.url;
                                                        dfd.resolve( _src );
                                                  }
                                            });
                                }
                          }).promise();
                    };


                    var $slideTitleEl = $( '.' + module.control.css_attr.item_title , item.container ).find('.slide-title'),
                        $slideThumbEl = $( '.' + module.control.css_attr.item_title , item.container ).find( '.slide-thumb');

                    //TITLE
                    //always write the title
                    if ( ! $slideTitleEl.length ) {
                          //remove the default item title
                          $( '.' + module.control.css_attr.item_title , item.container ).html( '' );
                          //write the new one
                          $( '.' + module.control.css_attr.item_title , item.container ).append( $( '<div/>',
                                {
                                    class : 'slide-title',
                                    html : _title
                                }
                          ) );
                    } else {
                          $slideTitleEl.html( _title );
                    }

                    //THUMB
                    //When shall we append the item thumb ?
                    //=>IF the slide-thumb element is not set
                    //=>OR in the case where data have been provided and the input_changed is 'slide-background'
                    //=>OR if no data is provided ( we are in the initialize phase )
                    var _isBgChange = _areDataSet && data.input_changed && 'slide-background' === data.input_changed;

                    if ( 0 === $slideThumbEl.length ) {
                          _getThumbSrc().done( function( src ) {
                                if ( 'not_set' != src ) {
                                      $( '.' + module.control.css_attr.item_title, item.container ).prepend( $('<div/>',
                                            {
                                                  class : 'slide-thumb',
                                                  html : '<img src="' + src + '" width="32" height="32" alt="' + _title + '" />'
                                            }
                                      ));
                                }
                          });
                    } else if ( _isBgChange || ! _areDataSet ) {
                          _getThumbSrc().done( function( src ) {
                                if ( 'not_set' != src ) {
                                      $slideThumbEl.html( '<img src="' + src + '" width="32" height="32" alt="' + _title + '" />' );
                                }
                          });
                    }
              }
      }//CZRSliderItemCtor
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule

var CZRSlideModuleMths = CZRSlideModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRSlideModuleMths, {
      CZRSliderModOptCtor : {
            ready: function() {
                  var modOpt = this,
                      module = modOpt.module;

                  //wait for the input collection to be populated, and then set the input visibility dependencies
                  modOpt.inputCollection.bind( function( col ) {
                        if( _.isEmpty( col ) )
                          return;
                        try { modOpt.setModOptInputVisibilityDeps(); } catch( er ) {
                              api.errorLog( 'setModOptInputVisibilityDeps : ' + er );
                        }

                        //MOD OPT REFRESH BTN
                        //1) Set initial state
                        modOpt.container.find('.refresh-button').prop( 'disabled', true );
                        //2) listen to user actions
                        //add DOM listeners
                        api.CZR_Helpers.setupDOMListeners(
                              [     //toggle mod options
                                    {
                                          trigger   : 'click keydown',
                                          selector  : '.refresh-button',
                                          actions   : function( ev ) {
                                                // var _setId = api.CZR_Helpers.getControlSettingId( module.control.id );
                                                // if ( api.has( _setId ) ) {
                                                //       api( _setId ).previewer.send( 'setting', [ _setId, api( _setId )() ] );
                                                //       _.delay( function() {
                                                //             modOpt.container.find('.refresh-button').prop( 'disabled', true );
                                                //       }, 250 );
                                                // }
                                                api.previewer.refresh().done( function() {
                                                      _.delay( function() {
                                                            modOpt.container.find('.refresh-button').prop( 'disabled', true );
                                                      }, 250 );
                                                });
                                          }
                                    }
                              ],//actions to execute
                              { model : modOpt(), dom_el : modOpt.container },//model + dom scope
                              modOpt //instance where to look for the cb methods
                        );//api.CZR_Helpers.setupDOMListeners()
                  });//modOpt.inputCollection()

                  //fire the parent
                  api.CZRModOpt.prototype.ready.call( modOpt );
            },


            //Fired when the input collection is populated
            //At this point, the inputs are all ready (input.isReady.state() === 'resolved') and we can use their visible Value ( set to true by default )
            setModOptInputVisibilityDeps : function() {
                  var modOpt = this,
                      module = modOpt.module,
                      _isFixedContentOn = function() {
                            return module._isChecked( modOpt.czr_Input('fixed-content')() );
                      };

                  modOpt.czr_Input.each( function( input ) {
                        switch( input.id ) {
                              //DESIGN
                              // case 'skin' :
                              //       var _isCustom = function( val ) {
                              //             return 'custom' == val;
                              //       };

                              //       //Fire on init
                              //       modOpt.czr_Input('skin-custom-color').visible( _isCustom( input() ) );
                              //       modOpt.czr_Input('text-custom-color').visible( _isCustom( input() ) );

                              //       //React on change
                              //       input.bind( function( to ) {
                              //             modOpt.czr_Input('skin-custom-color').visible( _isCustom( to ) );
                              //             modOpt.czr_Input('text-custom-color').visible( _isCustom( to ) );
                              //       });
                              // break;

                              //CONTENT
                              case 'fixed-content' :
                                    var _modOptsDependants = [ 'fixed-title', 'fixed-subtitle', 'fixed-cta', 'fixed-link', 'fixed-link-target', 'fixed-custom-link' ],
                                        _setVisibility = function( _depId, _inputVal ) {
                                              var _bool_;
                                              switch( _depId ) {
                                                    case 'fixed-title' :
                                                    case 'fixed-subtitle' :
                                                    case 'fixed-cta' :
                                                          _bool_ = module._isChecked( _inputVal );
                                                    break;

                                                    case 'fixed-link' :
                                                    case 'fixed-link-target' :
                                                          _bool_ = module._isChecked( _inputVal ) && ! _.isEmpty( modOpt.czr_Input('fixed-cta')() );
                                                    break;

                                                    case 'fixed-custom-link' :
                                                          _bool_ = module._isChecked( _inputVal ) && ! _.isEmpty( modOpt.czr_Input('fixed-cta')() ) && module._isCustomLink( modOpt.czr_Input('fixed-link')() );
                                                    break;
                                              }

                                              modOpt.czr_Input( _depId ).visible( _bool_ );
                                        };

                                    //MOD OPTS
                                    _.each( _modOptsDependants, function( _inpt_id ) {
                                          //Fire on init
                                          _setVisibility( _inpt_id, input() );
                                    });

                                    //React on change
                                    input.bind( function( to ) {
                                          _.each( _modOptsDependants, function( _inpt_id ) {
                                               _setVisibility( _inpt_id, to );
                                          });
                                    });
                              break;
                              case 'fixed-cta' :
                                      //Fire on init
                                      modOpt.czr_Input('fixed-link').visible(
                                            ! _.isEmpty( input() ) &&
                                            _isFixedContentOn()
                                      );
                                      modOpt.czr_Input('fixed-custom-link').visible(
                                            ! _.isEmpty( input() ) &&
                                            module._isCustomLink( modOpt.czr_Input('fixed-link')() ) &&
                                            _isFixedContentOn()
                                      );
                                      modOpt.czr_Input('fixed-link-target').visible(
                                            ! _.isEmpty( input() ) &&
                                            _isFixedContentOn()
                                      );

                                      //React on change
                                      input.bind( function( to ) {
                                            modOpt.czr_Input('fixed-link').visible(
                                                  ! _.isEmpty( to ) &&
                                                  _isFixedContentOn()
                                            );
                                            modOpt.czr_Input('fixed-custom-link').visible(
                                                  ! _.isEmpty( to ) &&
                                                  module._isCustomLink( modOpt.czr_Input('fixed-link')() ) &&
                                                  _isFixedContentOn()
                                            );
                                            modOpt.czr_Input('fixed-link-target').visible(
                                                  ! _.isEmpty( to ) &&
                                                  _isFixedContentOn()
                                            );
                                      });
                                break;

                                //the slide-link value is an object which has always an id (post id) + other properties like title
                                case 'fixed-link' :
                                      //Fire on init
                                      modOpt.czr_Input('fixed-custom-link').visible( module._isCustomLink( input() ) && _isFixedContentOn() );
                                      //React on change
                                      input.bind( function( to ) {
                                            modOpt.czr_Input('fixed-custom-link').visible( module._isCustomLink( to ) && _isFixedContentOn() );
                                      });
                                break;

                              //EFFECTS AND PERFORMANCES
                              case 'autoplay' :
                                    //Fire on init
                                    modOpt.czr_Input('slider-speed').visible( module._isChecked( input() ) );
                                    modOpt.czr_Input('pause-on-hover').visible( module._isChecked( input() ) );

                                    //React on change
                                    input.bind( function( to ) {
                                          modOpt.czr_Input('slider-speed').visible( module._isChecked( to ) );
                                          modOpt.czr_Input('pause-on-hover').visible( module._isChecked( to ) );
                                    });
                              break;
                              case 'parallax' :
                                    //Fire on init
                                    modOpt.czr_Input('parallax-speed').visible( module._isChecked( input() ) );

                                    //React on change
                                    input.bind( function( to ) {
                                          modOpt.czr_Input('parallax-speed').visible( module._isChecked( to ) );
                                    });
                              break;
                              case 'post-metas' :
                                    var _dts = [ 'display-cats', 'display-comments', 'display-auth-date' ],
                                        _setVis = function( _depId, _inputVal ) {
                                              modOpt.czr_Input( _depId ).visible( module._isChecked( _inputVal ) );
                                        };

                                    //MOD OPTS
                                    _.each( _dts, function( _inpt_id ) {
                                          //Fire on init
                                          _setVis( _inpt_id, input() );
                                    });

                                    //React on change
                                    input.bind( function( to ) {
                                          _.each( _dts, function( _inpt_id ) {
                                                _setVis( _inpt_id, to );
                                          });
                                    });
                              break;

                        }
                  });
            },
      }//CZRSliderModOptCtor
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule

var CZRRelatedPostsModMths = CZRRelatedPostsModMths || {};
( function ( api, $, _ ) {
$.extend( CZRRelatedPostsModMths, {
      initialize: function( id, constructorOptions ) {
            var module = this;

            module.initialConstrucOptions = $.extend( true, {}, constructorOptions );//detach from the original obj

            //run the parent initialize
            api.CZRDynModule.prototype.initialize.call( module, id, constructorOptions );

            //extend the module with new template Selectors
            $.extend( module, {
                  itemInputList : 'czr-module-related-posts-item-input-list',
            } );

            // //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUTS
            module.inputConstructor = api.CZRInput.extend( module.CZRRelPostsItemInputCtor || {} );

            // //EXTEND THE DEFAULT CONSTRUCTORS FOR ITEMS AND MODOPTS
            module.itemConstructor = api.CZRItem.extend( module.CZRRelPostsItemCtor || {} );

            //declares a default Item model
            // this.defaultItemModel = {
            //hidden properties
                // 'id'            => '',
                // 'title'         => '',

                // //design
                // 'enable'        => true,
                // 'col_number'    => 3,
                // 'cell_height'   => 'thin',
                // 'display_heading' => true,
                // 'heading_text'   => __('You may also like...', 'hueman'),
                // 'freescroll'    => true,

                // //post filters
                // 'post_number'   => 10,
                // 'order_by'      => 'rand',//can take rand, comment_count, date
                // 'related_by'    => 'categories'//can take : categories, tags, post_formats, all
            // };

            this.defaultItemModel = serverControlParams.relatedPostsModuleParams.defaultModel;

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

            module.isReady.then( function() {

            });//module.isReady
      },//initialize





      //////////////////////////////////////////////////////////
      /// INPUT CONSTRUCTORS
      //////////////////////////////////////////
      CZRRelPostsItemInputCtor : {
            // ready : function() {
            //       api.CZRInput.prototype.ready.call( input);
            // },
            //overrides the default method
            setupSelect : function() {
                  if ( 'order_by' != this.id && 'related_by' != this.id )
                    return;

                  var input      = this,
                      input_parent  = input.input_parent,
                      module     = input.module,
                      _selectOptions  = {},
                      _model = input_parent();

                  switch( input.id ) {
                        // case 'cell_height' :
                        //       _selectOptions = serverControlParams.relatedPostsModuleParams.relPostsCellHeight;
                        // break;
                        case 'order_by' :
                              _selectOptions = serverControlParams.relatedPostsModuleParams.relPostsOrderBy;
                        break;
                        case 'related_by' :
                              _selectOptions = serverControlParams.relatedPostsModuleParams.relPostsRelatedBy;
                        break;
                  }
                  //generates the options
                  _.each( _selectOptions , function( _optName , _k ) {
                        var _attributes = {
                                  value : _k,
                                  html: _optName
                            };
                        if ( _k == _model[ input.id ] ) {
                              $.extend( _attributes, { selected : "selected" } );
                        }
                        $( 'select[data-type="' + input.id + '"]', input.container ).append( $('<option>', _attributes) );
                  });
                  $( 'select[data-type="' + input.id + '"]', input.container ).selecter();
            },
      },//CZRRelPostsItemInputCtor



      //////////////////////////////////////////////////////////
      /// ITEM CONSTRUCTOR
      //////////////////////////////////////////
      CZRRelPostsItemCtor : {
            //overrides the parent ready
            ready : function() {
                  var item = this,
                      module = item.module;
                  //wait for the input collection to be populated,
                  //and then set the input visibility dependencies
                  item.inputCollection.bind( function( col ) {
                        if( _.isEmpty( col ) )
                          return;
                        try { item.setInputVisibilityDeps(); } catch( er ) {
                              api.errorLog( 'item.setInputVisibilityDeps() : ' + er );
                        }
                  });//item.inputCollection.bind()

                  //fire the parent
                  api.CZRItem.prototype.ready.call( item );
            },


            //Fired when the input collection is populated
            //At this point, the inputs are all ready (input.isReady.state() === 'resolved') and we can use their visible Value ( set to true by default )
            setInputVisibilityDeps : function() {
                  var item = this,
                      module = item.module;

                  //Internal item dependencies
                  item.czr_Input.each( function( input ) {
                        switch( input.id ) {
                              case 'enable' :
                                    //Fire on init
                                    item.czr_Input.each( function( _inpt_ ) {
                                          if ( _inpt_.id == input.id )
                                            return;
                                          _inpt_.visible( module._isChecked( input() ) );
                                    });
                                    //React on change
                                    input.bind( function( to ) {
                                          item.czr_Input.each( function( _inpt_ ) {
                                              if ( _inpt_.id == input.id )
                                                return;
                                              _inpt_.visible( module._isChecked( to ) );
                                          });
                                    });
                              break;

                              case 'display_heading' :
                                    //Fire on init
                                    item.czr_Input('heading_text').visible( module._isChecked( input() ) && module._isChecked( item.czr_Input('enable')() ) );

                                    //React on change
                                    input.bind( function( to ) {
                                          item.czr_Input('heading_text').visible( module._isChecked( to ) && module._isChecked( item.czr_Input('enable')() ) );
                                    });
                              break;
                        }
                  });
            },
      },//CZRRelPostsItemCtor



      //////////////////////////////////////////
      /// MODULE HELPERS

      _isChecked : function( v ) {
            return 0 !== v && '0' !== v && false !== v && 'off' !== v;
      },

      _isSettingDirty : function() {
            if ( 'pending' == api.czr_skopeReady.state() )
              return false;
            var module = this,
                _setId = api.CZR_Helpers.getControlSettingId( module.control.id );
            return ( api.czr_skope( api.czr_activeSkopeId() ).getSkopeSettingDirtyness( _setId ) || api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( _setId ) );
      }
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule

var CZRTextEditorModuleMths = CZRTextEditorModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRTextEditorModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          //run the parent initialize
          api.CZRModule.prototype.initialize.call( module, id, options );

          //extend the module with new template Selectors
          $.extend( module, {
                itemInputList : 'czr-module-text_editor-item-content'
          } );

          //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
          module.inputConstructor = api.CZRInput.extend( module.CZRTextEditorInputMths || {} );
          //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor = api.CZRItem.extend( module.CZRTextEditorItem || {} );

          //declares a default model
          this.defaultItemModel   = {
            id : '',
            text: ''
          };

          // api.section( module.control.section() ).expanded.bind(function(to) {

          //   // if ( false !== module.container.length ) {
          //   //   //say it*/
          //   //   module.container.append( $_module_el );
          //   //   module.embedded.resolve();
          //   // }

          //   if ( 'resolved' == module.isReady.state() )
          //     return;

          //   module.ready();
          // });
  },//initialize




  CZRTextEditorInputMths : {
  },//CZRTextEditorsInputMths



  CZRTextEditorItem : {

  },
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule
//This module populates the sektions setting.
//The each sektion is composed of columns (=> columns on front end)
//Each columns of modules ( => content module on front end like slider, text block, etc)

var CZRSektionMths = CZRSektionMths || {};
( function ( api, $, _ ) {
$.extend( CZRSektionMths, {
      initialize: function( id, options ) {
            var module = this;
            //run the parent initialize
            api.CZRDynModule.prototype.initialize.call( module, id, options );

            //extend the module with new template Selectors
            $.extend( module, {
                  itemPreAddEl : 'czr-module-sektion-pre-add-view-content',
                  rudItemPart : 'czr-module-sektion-rud-item-part',
                  itemInputList : 'czr-module-sektion-view-content',
            } );

            //SEKTIONS
            //declares a default model (overrides parent module)
            module.defaultItemModel = {
                  id : '',
                  'sektion-layout' : 1,
                  columns : []
            };

            //hook before a sektion is being remove from dom and api.
            //=> remove modules and columns from DOM
            //=> removes moduea and columns instances from API
            module.bind( 'pre_item_dom_remove', function( item ) {
                  module.removeSektion( item );
            });


            //COLUMNS
            module.defaultDBColumnModel = {
                  id : '',
                  sektion_id : '',
                  modules : [],
            };

            module.defaultAPIcolumnModel = {
                  id : '',
                  modules : [],
                  sektion : {},//sektion instance
                  module_id : '',
                  control_id : '',
                  is_added_by_user : false
            };

            //the column values
            module.czr_Column = new api.Values();
            //stores the column collection
            //set the initial value
            module.czr_columnCollection = new api.Value();
            module.czr_columnCollection.set([]);

            //react to column collection changes
            module.czr_columnCollection.callbacks.add( function() { return module.columnCollectionReact.apply(module, arguments ); } );

            //EXTEND THE DEFAULT CONSTRUCTORS FOR SEKTION ITEMS
            module.itemConstructor = api.CZRItem.extend( module.CZRSektionItem || {} );


            //DRAGULA
            // if ( ! _.has( module ,'dragInstance' ) )
            //   module.initDragula();
            if ( ! _.has( module ,'modsDragInstance' ) )
              module.initModulesDragula();


            //MODULE PANEL
            api.czrModulePanelState = api.czrModulePanelState || new api.Value( false );
            api.czrModulePanelEmbedded = api.czrModulePanelEmbedded || $.Deferred();

            //EXTEND THE USER EVENT MAP
            //=> adds the module list panel events
            //=> adds the sektion setting panel events
            module.userEventMap.set( _.union(
                  module.userEventMap(),
                  [
                        //module panel
                        {
                              trigger   : 'click keydown',
                              selector  : '.add-new-module',
                              name      : 'add_new_module',
                              actions   : 'toggleModuleListPanel'
                        },
                        {
                              trigger   : 'click keydown',
                              selector  : '.' + module.control.css_attr.open_pre_add_btn,
                              name      : 'close_module_panel',
                              actions   : function() {
                                    //close the module panel id needed
                                    api.czrModulePanelState(false);
                              },
                        }
                  ]
            ));



            api.consoleLog('SEKTION MODULE INIT', module.control.params.czr_skope );
            if ( _.has( api, 'czr_activeSkopeId' ) )
              api.consoleLog('SEKTION MODULE INIT', api.czr_activeSkopeId() );

            //api.czrModulePanelEmbedded.done( function() {

            api.czrModulePanelBinded = api.czrModulePanelBinded || $.Deferred();
            if ( 'pending' == api.czrModulePanelBinded.state() ) {

                  api.czrModulePanelState.bind( function( expanded ) {
                        var synced_control_id = api.CZR_Helpers.build_setId(  module.control.params.syncCollection ),
                                sek_module = api.control( synced_control_id ).syncSektionModule();

                        $('body').toggleClass('czr-adding-module', expanded );

                        if ( expanded ) {
                              sek_module.renderModulePanel();

                              api.consoleLog('REACT TO MODULE PANEL STATE', expanded,  module.control.params.syncCollection, sek_module() );
                              api.consoleLog('WHEN DOES THIS ACTION OCCUR?', api.czrModulePanelBinded.state() );

                              //api.consoleLog('IS EQUAL?', _.isEqual( module, api.control( synced_control_id ).syncSektionModule() ) );


                              // if ( _.isEqual( module, api.control( synced_control_id ).syncSektionModule() ) )
                              //   return;

                              //DRAGULIZE
                              sek_module.modsDragInstance.containers.push( $('#czr-available-modules-list')[0]);

                              // sek_module.modulePanelDragulized = sek_module.modulePanelDragulized || $.Deferred();
                              // if ( expanded && 'pending' == sek_module.modulePanelDragulized.state() ) {
                              //       sek_module.modsDragInstance.containers.push( $('#czr-available-modules-list')[0]);
                              //       sek_module.modulePanelDragulized.resolve();
                              // }
                        } else {
                              //remove from draginstance
                              var _containers = $.extend( true, [], sek_module.modsDragInstance.containers );
                                  _containers =  _.filter( _containers, function( con) {
                                        return 'czr-available-modules-list' != $(con).attr('id');
                                  });
                              sek_module.modsDragInstance.containers = _containers;
                              $('#czr-module-list-panel').remove();
                        }

                  });
                  api.czrModulePanelBinded.resolve();
            //});
            }//if pending





            //SEKTION SETTING PANEL
            api.czrSekSettingsPanelState = api.SekSettingsPanelState || new api.Value( false );
            api.czrSekSettingsPanelEmbedded = api.SekSettingsPanelEmbedded || $.Deferred();

            //EXTEND THE USER EVENT MAP
            //=> adds the module list panel events
            //=> adds the sektion setting panel events
            module.userEventMap.set( _.union(
                  module.userEventMap(),
                  [
                        //Sektion Settings
                        {
                              trigger   : 'click keydown',
                              selector  : '.czr-edit-sek-settings',
                              name      : 'edit_sek_settings',
                              actions   : 'toggleSekSettingsPanel'
                        },
                        {
                              trigger   : 'click keydown',
                              selector  : '.' + module.control.css_attr.open_pre_add_btn,
                              name      : 'close_sektion_panel',
                              actions   : function() {
                                  //close the sektion settings panel if needed
                                  api.czrSekSettingsPanelState.set(false);
                              },
                        }
                  ]
            ));
            api.czrSekSettingsPanelEmbedded.done( function() {
                  api.czrSekSettingsPanelState.callbacks.add( function() { return module.reactToSekSettingPanelState.apply(module, arguments ); } );
            });


            // if ( _.has( api, 'czr_activeSectionId' ) && module.control.section() == api.czr_activeSectionId()  ) {
            //     api.consoleLog('SECTION EXPANDED CASE. WHAT IS THE CURRENT MODULE-COLLECTION?', api('hu_theme_options[module-collection]')(), module.isReady.state() );
            //     _fire();
            // }
            api.section( module.control.section() ).expanded.bind(function(to) {
                  api.consoleLog('FIRE SEKTION MODULE!', module.id );
                  module.fireSektionModule();
            });
      },//initialize




      fireSektionModule : function() {
            var module = this;
            if ( 'resolved' == module.isReady.state() )
              return;
            //unleash hell
            module.ready();
            //provide the synchronized module-collection control with its synchronized sektions module instance
            module.control.getSyncCollectionControl().syncSektionModule.set( module );
      },



      /////////////////////////////////////////////////////////////////////////
      /// SEKTION
      ////////////////////////////////////////////////////////////////////////
      //the sekItem object looks like :
      //id : ''
      //columns : []
      //sektion-layout : int
      removeSektion : function( sekItem ) {
            var module = this;

            _.each( sekItem.columns, function( _col ) {
                  _.each( _col.modules, function( _mod ){
                        module.control.getSyncCollectionControl().removeModule( _mod );
                  });//_.each

                  //remove column from DOM if it's been embedded
                  if ( module.czr_Column.has(_col.id) && 'resolved' == module.czr_Column( _col.id ).embedded.state() )
                      module.czr_Column( _col.id ).container.remove();

                  //remove column from API
                  module.removeColumnFromCollection( _col );
            });//_.each
      },

      closeAllOtherSektions : function( $_clicked_el ) {
              var module = this;
                  _clicked_sektion_id = $_clicked_el.closest('.czr-single-item').attr('data-id');

              module.czr_Item.each( function( _sektion ){
                    if ( _clicked_sektion_id != _sektion.id ) {
                        _sektion.viewState.set( 'closed');
                    } else {
                        _sektion.viewState.set( 'expanded' != _sektion.viewState() ? 'expanded_noscroll' : 'expanded' );
                    }
              });
      }
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule
//This module populates the sektions setting.
//The each sektion is composed of columns (=> columns on front end)
//Each columns of modules ( => content module on front end like slider, text block, etc)

var CZRSektionMths = CZRSektionMths || {};
( function ( api, $, _ ) {
$.extend( CZRSektionMths, {
      //extends api.CZRItem
      CZRSektionItem : {
              initialize: function(id, options ) {
                    var sekItem = this;
                    api.CZRItem.prototype.initialize.call( sekItem, null, options );

                    //EXTEND THE USER EVENT MAP
                    //=> adds the module list panel events
                    sekItem.userEventMap.set( _.union(
                          sekItem.userEventMap(),
                          [
                                {
                                      trigger   : 'click keydown',
                                      selector  : [ '.' + sekItem.module.control.css_attr.edit_view_btn, '.' + sekItem.module.control.css_attr.display_alert_btn,'.' + sekItem.module.control.css_attr.item_title ].join(','),
                                      name      : 'close_module_panel',
                                      actions   : function() {
                                            api.czrModulePanelState.set(false);
                                      },
                                },
                                {
                                      trigger   : 'mouseenter',
                                      selector  : '.czr-item-header',
                                      name      : 'hovering_sek',
                                      actions   : function( obj ) {
                                            api.previewer.send( 'start_hovering_sek', {
                                                  id : sekItem.id
                                            });
                                      }
                                },
                                {
                                      trigger   : 'mouseleave',
                                      selector  : '.czr-item-header',
                                      name      : 'hovering_sek',
                                      actions   : function( obj ) {
                                            api.previewer.send( 'stop_hovering_sek', {
                                                  id : sekItem.id
                                            });
                                      }
                                },
                                {
                                      trigger   : 'click keydown',
                                      selector  : [ '.' + sekItem.module.control.css_attr.edit_view_btn, '.' + sekItem.module.control.css_attr.item_title ].join(','),
                                      name      : 'send_edit_view',
                                      actions   : function( obj ) {
                                            api.previewer.send( 'edit_sek', {
                                                  id : sekItem.id
                                            });
                                      },
                                }
                          ]
                    ));

                    var _sektion_model = sekItem(),
                        module = options.module;

                    if ( ! _.has(_sektion_model, 'sektion-layout') ) {
                          throw new Error('In Sektion Item initialize, no layout provided for ' + sekItem.id + '.');
                    }

                    sekItem.isReady.done( function() {

                          //When fetched from DB, the column model looks like :
                          //{
                          //  id : '',//string
                          //  sektion_id : '',//string
                          //  modules : [],//collection of module id strings
                          //}
                          //=> we need to extend it with the sektion instance
                          //=> make sure the columns are instantiated as well
                          if ( ! _.isEmpty( sekItem().columns ) ) {
                                _.each( sekItem().columns , function( _column ) {
                                      //instantiate the column and push it to the global column collection
                                      var column_candidate = $.extend( true, {}, _column );//create a deep clone
                                      module.instantiateColumn( $.extend( column_candidate, { sektion : sekItem } ) );
                                });
                          } else {
                                //the sektion has no columns yet. This is the case typically when a sektion has just been created
                                // => instantiate new columns based on the sektion layout property.
                                var _col_nb = parseInt( _sektion_model['sektion-layout'] || 1, 10 );
                                for( i = 1; i < _col_nb + 1 ; i++ ) {
                                      var _default_column = $.extend( true, {}, module.defaultDBColumnModel ),
                                          column_candidate = {
                                                id : '',//a unique id will be generated when preparing the column for API.
                                                sektion_id : sekItem.id
                                          };
                                          column_candidate = $.extend( _default_column, column_candidate );

                                      module.instantiateColumn( $.extend( column_candidate, { sektion : sekItem } ) );
                                }//for
                          }
                    });//sekItem.isReady

              },


              //OVERRIDES PARENT MODULE METHOD
              //React to a single item change
              //cb of module.czr_Item(item.id).callbacks
              // itemInternalReact : function( to, from ) {
              //   api.consoleLog('in item internal React overridden', to, from );
              //       var sekItem = this,
              //           sektion_candidate = $.extend(true, {}, to);
              //       //we want to make sure that the item model is compliant with default model
              //       sektion_candidate = sekItem.prepareSekItemForDB( sektion_candidate );
              //       //Call the parent method => updates the collection
              //       api.CZRItem.prototype.itemInternalReact.call( sekItem, sektion_candidate, from );
              // },

              //OVERRIDES PARENT MODULE METHOD
              //React to a single item change
              //cb of module.czr_Item(item.id).callbacks
              itemReact : function( to, from ) {
                    var sekItem = this,
                        sektion_candidate = $.extend(true, {}, to);
                    //we want to make sure that the item model is compliant with default model
                    sektion_candidate = sekItem.prepareSekItemForDB( sektion_candidate );
                    //Call the parent method => updates the collection
                    api.CZRItem.prototype.itemReact.call( sekItem, sektion_candidate );
              },


              //the sektion item model must have only the property set in
              //module.defaultItemModel = {
              //       id : '',
              //       'sektion-layout' : 1,
              //       columns : []
              // };
              prepareSekItemForDB : function( sektion_candidate ) {
                    var sekItem = this,
                        db_ready_sektItem = {};

                    _.each( sekItem.module.defaultItemModel, function( _value, _key ) {
                            var _candidate_val = sektion_candidate[_key];
                            switch( _key ) {
                                  case 'id' :
                                        if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                                            throw new Error('The sekItem id property must be a not empty string');
                                        }
                                        db_ready_sektItem[_key] = _candidate_val;
                                  break;
                                  case 'sektion-layout' :
                                        if ( ! _.isNumber( parseInt( _candidate_val, 10 ) ) || ( parseInt( _candidate_val, 10 ) < 1 ) ) {
                                            throw new Error('The sekItem layout property must be an int number > 0');
                                        }
                                        db_ready_sektItem[_key] = _candidate_val;
                                  break;
                                  case 'columns' :
                                        if ( ! _.isArray( _candidate_val ) ) {
                                            throw new Error('The sekItem columns property must be an array');
                                        }
                                        var _db_ready_columns = [];
                                        _.each( _candidate_val, function( _col ) {
                                              var _db_ready_col = sekItem.module.prepareColumnForDB(_col);
                                              _db_ready_columns.push( _db_ready_col );
                                        });

                                        db_ready_sektItem[_key] = _db_ready_columns;
                                  break;
                            }
                    });//each
                    return db_ready_sektItem;
              }

      }//Sektion
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule
//This module populates the sektions setting.
//The each sektion is composed of columns (=> columns on front end)
//Each columns of modules ( => content module on front end like slider, text block, etc)

var CZRSektionMths = CZRSektionMths || {};
( function ( api, $, _ ) {
$.extend( CZRSektionMths, {
      //Each column shall be described by an object like the following one :
      //module.defaultDBColumnModel = {
      //       id : '',
      //       sektion_id : '',
      //       modules : [],
      // };
      // Fired in prepareSekItemForDB
      prepareColumnForDB : function( column_candidate ) {
            var module = this,
                _db_ready_col = {};

            _.each( module.defaultDBColumnModel, function( _value, _key ){
                  var _candidate_val = column_candidate[_key];
                  switch( _key ) {
                        case 'id' :
                              if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                                  throw new Error('The column id property must be a not empty string');
                              }
                              _db_ready_col[_key] = _candidate_val;
                        break;
                        case 'sektion_id' :
                              if ( _.isString( _candidate_val ) && ! _.isEmpty( _candidate_val ) ) {
                                  _db_ready_col[_key] = _candidate_val;
                              } else if ( _.has(column_candidate, 'sektion') ) {
                                  _db_ready_col[_key] = column_candidate.sektion.id;
                              } else {
                                  throw new Error('The column sektion-id property must be a not empty string');
                              }
                        break;
                        case 'modules' :
                              if ( ! _.isArray( _candidate_val ) ) {
                                  throw new Error('The column modules property must be an array');
                              }
                              _db_ready_col[_key] = _candidate_val;
                        break;
                    }

            } );
            return _db_ready_col;
      },











      /////////////////////////////////////////////////////////////////////////
      /// COLUMN
      ////////////////////////////////////////////////////////////////////////
      //At this point, the column model has been fetched from DB, or manually added.
      //It must look like
      //{
      //  id : '',//string
      //  sektion : {},//sektion instance
      //  sektion_id : '',//string
      //  modules : [],//collection of module id strings
      //}
      //Fired in CZRSektionItem::initialize
      instantiateColumn : function( _column, is_added_by_user  ) {
            var module = this,
                column_model = _.clone( _column );

            if ( ! _.isEmpty( column_model.id ) && module.czr_Column.has( column_model.id ) ) {
                  throw new Error('The column id already exists in the collection in module : ' + module.id );
            }

            column_model = module.prepareColumnForAPI( column_model );

            //instanciate the column with the default constructor
            //=> makes sure that the column is ready for instanciation
            module.czr_Column.add( column_model.id , new api.CZRColumn( column_model.id, column_model ) );

            //the column is now ready and will listen to changes
            module.czr_Column(column_model.id).ready();
      },


      //Let's make sure the column holds all the necessary properties before API instanciation.
      // module.defaultAPIcolumnModel = {
      //       id : '',
      //       modules : [],
      //       sektion : {}, //sektion instance
      //       module_id : '',
      //       control_id : '',
      //       is_added_by_user : false
      // };
      prepareColumnForAPI : function( column_candidate ) {
          var module = this,
              api_ready_column = {};

          if ( ! _.isObject( column_candidate ) ) {
                throw new Error('Sektion Module::prepareColumnForAPI : a column must be an object to be instantiated.');
          }

          _.each( module.defaultAPIcolumnModel, function( _value, _key ) {
                var _candidate_val = column_candidate[_key];
                switch( _key ) {
                      case 'id' :
                            if ( _.isEmpty( _candidate_val ) ) {
                                api_ready_column[_key] = module.generateColId();
                            } else {
                                api_ready_column[_key] = _candidate_val;
                            }
                      break;
                      case 'modules' :
                            if ( ! _.isArray( _candidate_val )  ) {
                                throw new Error('Sektion Module::prepareColumnForAPI : a collection of modules must be an array. Error in column ' + column_candidate.id );
                            }
                            api_ready_column[_key] = _candidate_val;
                      break;
                      case  'sektion' :
                            if ( ! _.isObject( _candidate_val ) || _.isEmpty( _candidate_val )  ) {
                                throw new Error('Sektion Module::prepareColumnForAPI : a sektion instance is missing for column ' + column_candidate.id );
                            }
                            api_ready_column[_key] = _candidate_val;
                      break;
                      case  'module_id' :
                            api_ready_column[_key] = module.id;
                      break;
                      case  'control_id' :
                            api_ready_column[_key] = module.control.id;
                      break;
                      case 'is_added_by_user' :
                            api_ready_column[_key] =  _.isBoolean( _candidate_val ) ? _candidate_val : false;
                      break;
                }//switch
          });
          return api_ready_column;
      },




      //@param obj can be { collection : []}, or { module : {} }
      updateColumnCollection : function( obj ) {
            var module = this,
                _current_collection = module.czr_columnCollection();
                _new_collection = $.extend( true, [] , _current_collection );
            api.consoleLog('in update column collection', module.id, module.czr_columnCollection() );
            //if a collection is provided in the passed obj then simply refresh the collection
            //=> typically used when reordering the collection module with sortable or when a column is removed
            if ( _.has( obj, 'collection' ) ) {
                  //reset the collection
                  module.czr_columnCollection.set(obj.collection);
                  return;
            }

            if ( ! _.has(obj, 'column') ) {
                  throw new Error('updateColumnCollection, no column provided in module ' + module.id + '. Aborting');
            }
            var column = _.clone(obj.column);

            if ( ! _.has(column, 'id') ) {
                  throw new Error('updateColumnCollection, no id provided for a column in module' + module.id + '. Aborting');
            }
            //the module already exist in the collection
            if ( _.findWhere( _new_collection, { id : column.id } ) ) {
                  _.each( _current_collection , function( _elt, _ind ) {
                        if ( _elt.id != column.id )
                          return;

                        //set the new val to the changed property
                        _new_collection[_ind] = column;
                  });
            }
            //the module has to be added
            else {
                  _new_collection.push(column);
            }

            //Inform the global column collection
            module.czr_columnCollection.set(_new_collection);
      },


      removeColumnFromCollection : function( column ) {
            var module = this,
                _current_collection = module.czr_columnCollection(),
                _new_collection = $.extend( true, [], _current_collection);

            _new_collection = _.filter( _new_collection, function( _col ) {
                  return _col.id != column.id;
            } );

            module.czr_columnCollection.set(_new_collection);
      },




      //cb of control.czr_columnCollection.callbacks
      //The job of this function is to set the column collection in their respective sektItems
      columnCollectionReact : function( to, from ) {
            var module = this,
                is_column_added   = _.size(from) < _.size(to),
                is_column_removed = _.size(from) > _.size(to),
                isColumnUpdate  = _.size(from) == _.size(to),
                //is_column_collection_sorted = _.isEmpty(_to_add) && _.isEmpty(_to_remove)  && ! isColumnUpdate,
                _current_sek_model = {},
                _new_sek_model = {};

            //COLUMN UPDATE CASE
            //parse the columns and find the one that has changed.
            if ( isColumnUpdate ) {
                  _.each( to, function( _col, _key ) {
                        if ( _.isEqual( _col, from[_key] ) )
                          return;
                        _current_sek_model = _col.sektion();
                        _new_sek_model = $.extend(true, {}, _current_sek_model);

                        //find the column and update it
                        _.each( _current_sek_model.columns, function( _c, _k ){
                              if ( _c.id != _col.id )
                                return;
                              _new_sek_model.columns[_k] = _col;
                        } );

                        _col.sektion.set( _new_sek_model );

                  } );//_.each
            }//end if column update


            //NEW COLUMN CASE
            if ( is_column_added ) {
                  //find the new column
                  var _new_column = _.filter( to, function( _col ){
                      return _.isUndefined( _.findWhere( from, { id : _col.id } ) );
                  });

                  _new_column = _new_column[0];
                  _current_sek_model = _new_column.sektion();
                  //only add the column if the column does not exist in the sektion columns.
                  if ( _.isUndefined( _.findWhere( _current_sek_model.columns, {id : _new_column.id } ) ) ) {
                        _new_sek_model = $.extend(true, {}, _current_sek_model);
                        _new_sek_model.columns.push( _new_column );
                        _new_column.sektion.set( _new_sek_model );
                  }

            }//end if new column case

            //COLUMN REMOVED
            if ( is_column_removed ) {
                  //find the column to remove
                  var _to_remove = _.filter( from, function( _col ){
                      return _.isUndefined( _.findWhere( to, { id : _col.id } ) );
                  });
                  _to_remove = _to_remove[0];

                  _current_sek_model = _to_remove.sektion();
                  _new_sek_model = $.extend(true, {}, _current_sek_model);//_.clone() is not enough there, we need a deep cloning.

                  //remove the column from the sekItem model
                  _new_sek_model.columns = _.filter( _new_sek_model.columns, function( _col ) {
                        return _col.id != _to_remove.id;
                  } );

                  _to_remove.sektion.set( _new_sek_model );

                  //remove the column instance from module
                  module.czr_Column.remove( _to_remove.id );
            }


            //refreshes the preview frame  :
            //1) only needed if transport is postMessage, because is triggered by wp otherwise
            //2) only needed when : add, remove, sort item(s)
            //module update case
            // if ( 'postMessage' == api(control.id).transport && ! api.CZR_Helpers.hasPartRefresh( control.id ) ) {
            //     if ( is_collection_sorted )
            //         api.previewer.refresh();
            // }
      },



      //recursive
      generateColId : function( key, i ) {
            //prevent a potential infinite loop
            i = i || 1;
            if ( i > 100 ) {
                  throw new Error('Infinite loop when generating of a column id.');
            }

            var module = this;
            key = key || module._getNextColKeyInCollection();

            var id_candidate = 'col_' + key;

            //do we have a column collection value ?
            if ( ! _.has(module, 'czr_columnCollection') || ! _.isArray( module.czr_columnCollection() ) ) {
                  throw new Error('The column collection does not exist or is not properly set in module : ' + module.id );
            }
            //make sure the column is not already instantiated
            if ( module.czr_Column.has( id_candidate ) ) {
              return module.generateColId( key++, i++ );
            }

            return id_candidate;
      },


      //helper : return an int
      //=> the next available id of the column collection
      _getNextColKeyInCollection : function() {
            var module = this,
                _max_col_key = {},
                _next_key = 0;

            //get the initial key
            //=> if we already have a collection, extract all keys, select the max and increment it.
            //else, key is 0
            if ( ! _.isEmpty( module.czr_columnCollection() ) ) {
                _max_col_key = _.max( module.czr_columnCollection(), function( _col ) {
                    return parseInt( _col.id.replace(/[^\/\d]/g,''), 10 );
                });
                _next_key = parseInt( _max_col_key.id.replace(/[^\/\d]/g,''), 10 ) + 1;
            }
            return _next_key;
      },


      //@return bool
      moduleExistsInOneColumnMax : function( module_id ) {
            return 2 > this.getModuleColumn( module_id ).length;
      },


      //@return an array of columns
      //=> a module can't be embedded in several columns at a time
      //if the returned array has more than one item, it should trigger an Error.
      getModuleColumn : function( module_id ) {
            var module = this,
                _mod_columns = [];
            _.each( module.czr_columnCollection(), function( _col, _key ) {
                  if ( _.findWhere( _col.modules, { id : module_id } ) )
                    _mod_columns.push( _col.id );
            });
            return _mod_columns;
      }
});//extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule
//This module populates the sektions setting.
//The each sektion is composed of columns (=> columns on front end)
//Each columns of modules ( => content module on front end like slider, text block, etc)

var CZRSektionMths = CZRSektionMths || {};
( function ( api, $, _ ) {
$.extend( CZRSektionMths, {
      /////////////////////////////////////////////////////////////////////////
      /// DRAGULA
      ////////////////////////////////////////////////////////////////////////
     initModulesDragula : function() {
            var module = this;

            //instantiate dragula without container => they will be pushed on module instantiation
            module.modsDragInstance = dragula({
                  // copySortSource : function() {
                  //   api.consoleLog('copy sort source', arguments);
                  // },
                  copy: function (el, source) {
                    return $(el).hasClass( 'czr-module-candidate' );
                  },
                  moves: function (el, source, handle, sibling) {
                      return _.contains( handle.className.split(' '), 'czr-mod-drag-handler' );
                  },
                  // invalidTarget : function(el, handle) {
                  //     api.consoleLog('invalidTarget', el, handle );
                  //     return false;
                  // },
                  accepts: function ( el, target, source, sibling ) {
                      //disable drop in module panel
                      // if ( $(target).hasClass('czr-available-modules-list') )
                      //   return false;
                      // if ( $(target).closest('.czr-single-item').hasClass('open') )
                      //   return ! _.contains( target.className.split(' '), 'czr-dragula-fake-container' );
                      //api.consoleLog('in accepts', target, $(target).attr('id') );
                      return ! _.isUndefined(target) && 'czr-available-modules-list' != $(target).attr('id') ;
                  },
                  isContainer : function( el ) {
                    //api.consoleLog('isContainer?', el);
                    return false;
                  }
            });//dragula


            //react to drag events
            module.modsDragInstance.on('drag', function( el, source ){
                    module.czr_Item.each( function( _sektion ){
                          _sektion.viewState.set( 'expanded' != _sektion.viewState() ? 'expanded_noscroll' : 'expanded' );
                    });
            }).on('dragend', function( el, source ){
                    // module.czr_Item.each( function( _sektion ){
                    //       _sektion.container.removeClass('czr-show-fake-container');
                    // });
            }).on('drop', function(el, target, source, sibling ) {
                  var _dropped_module_id = $(el).attr('data-module-id'),
                      _dropped_module_type = $(el).attr('data-module-type'),
                      _target_col = $(target).closest('.czr-column').attr('data-id'),
                      _source_col = $(source).closest('.czr-column').attr('data-id'),
                      is_reorder = _target_col == _source_col,
                      is_module_candidate = $(el).hasClass('czr-module-candidate');

                  if ( is_module_candidate ) {
                      if ( _.isUndefined(_target_col) || _.isUndefined(_dropped_module_type ) )
                        return;

                      module.userAddedModule( _target_col, _dropped_module_type );
                      module.reorderModulesInColumn( _target_col );
                  }
                  else if ( is_reorder ) {
                      module.reorderModulesInColumn( _target_col );
                  } else {
                      module.control.getSyncCollectionControl().czr_Module( _dropped_module_id ).modColumn.set( _target_col );
                  }
            });

            //expand a closed sektion on over
            // module.modsDragInstance.on('over', function( el, container, source ) {
            //   api.consoleLog('OVERING', container );
            //       if ( $(container).hasClass('czr-dragula-fake-container') ) {
            //           //get the sekItem id
            //           _target_sekId = $(container).closest('[data-id]').attr('data-id');
            //           module.czr_Item(_target_sekId).viewState.set('expanded_noscroll');
            //       }
            // });

            //make sure the scroll down is working
            var scroll = autoScroller([
                         module.control.container.closest('.accordion-section-content')[0]
                      ],
                      {
                        direction: "vertical",
                        margin: 20,
                        pixels: 100,
                        scrollWhenOutside: true,
                        autoScroll: function(){
                            //Only scroll when the pointer is down, and there is a child being dragged.
                            return module.modsDragInstance.dragging;
                        }
                      }
            );
      },


     //fired on DOM user action
      //=> in the future, the module to instantiate will be stored in a pre module Value(), just like the pre Item idea
      //
      //Fired on column instanciation => to populate the saved module collection of this column
      //the defautAPIModuleModel looks like :
      //id : '',//module.id,
      // module_type : '',//module.module_type,
      // items   : [],//$.extend( true, {}, module.items ),
      // crud : false,
      // multi_item : false,
      // control : {},//control,
      // column_id : '',
      // sektion : {},// => the sektion instance
      // sektion_id : '',
      // is_added_by_user : false,
      userAddedModule : function( column_id, module_type  ) {
            var module = this,
                syncedCollectionControl = module.control.getSyncCollectionControl(),
                defautAPIModuleModel = _.clone( syncedCollectionControl.getDefaultModuleApiModel() );

            syncedCollectionControl.trigger(
                  'user-module-candidate',
                  $.extend( defautAPIModuleModel, {
                        module_type : module_type, //'czr_text_editor_module', //'czr_text_module',
                        column_id : column_id,//a string
                        sektion : module.czr_Column(column_id).sektion,//instance
                        sektion_id : module.czr_Column(column_id).sektion.id,
                        is_added_by_user : true
                  } )
            );

      },



      reorderModulesInColumn : function( col_id ) {
            var module = this,
            //get the updated collection from the DOM and update the column module collection
                _new_dom_module_collection = module.czr_Column( col_id  ).getColumnModuleCollectionFromDom( col_id  );

            //close the module panel id needed
            // if ( _.has( api, 'czrModulePanelState') )
            //   api.czrModulePanelState(false);

            module.czr_Column( col_id ).updateColumnModuleCollection( { collection : _new_dom_module_collection } );
      },

      //@param module obj
      //@param source col string
      //@param target column string
      moveModuleFromTo : function( moved_module, source_column, target_column ) {
            api.consoleLog( 'ALORS CE BUG?', this(), this.czr_columnCollection() );
            var module = this,
                _new_dom_module_collection = module.czr_Column( target_column ).getColumnModuleCollectionFromDom( source_column );

            //close the module panel id needed
            if ( _.has( api, 'czrModulePanelState') )
              api.czrModulePanelState(false);

            //update the target column collection with the new collection read from the DOM
            module.czr_Column( target_column ).updateColumnModuleCollection( { collection : _new_dom_module_collection } );
            //remove module from old column module collection
            module.czr_Column( source_column ).removeModuleFromColumnCollection( moved_module );
      }
});//extend
})( wp.customize , jQuery, _ );//extends api.Value

var CZRSektionMths = CZRSektionMths || {};
( function ( api, $, _ ) {
$.extend( CZRSektionMths, {
      toggleModuleListPanel : function( obj ) {
            var module = this;
            // if ( 'pending' == api.czrModulePanelEmbedded.state() ) {
            //     $.when( module.renderModulePanel() ).done( function(){
            //         api.consoleLog('MODULE PANEL EMBEDDED!');
            //         api.czrModulePanelEmbedded.resolve();
            //     });
            // }

            //close the sek setting panel if needed
            api.czrSekSettingsPanelState.set(false);

            api.czrModulePanelState.set( ! api.czrModulePanelState() );


            //close all sektions but the one from which the button has been clicked
            if ( ! api.czrModulePanelState() ) {
                module.closeAllOtherSektions( $(obj.dom_event.currentTarget, obj.dom_el ) );
            } else {
                module.czr_Item.each( function( _sektion ){
                    _sektion.viewState.set( 'expanded' != _sektion.viewState() ? 'expanded_noscroll' : 'expanded' );
                });
            }
      },

      //fired once, on first expansion
      renderModulePanel : function() {
            var module = this;
            //do we have template script?
            if ( 0 === $( '#tmpl-czr-available-modules' ).length ) {
              throw new Error('No template found to render the module panel list' );
            }

            $('#widgets-left').after( $( wp.template( 'czr-available-modules' )() ) );

            _.each( api.czrModuleMap, function( _data, _mod_type ) {
                    var $_mod_candidate = $('<li/>', {
                          class : 'czr-module-candidate',
                          'data-module-type' : _mod_type,
                          html : '<h3><span class="czr-mod-drag-handler fa fa-arrows-alt"></span>' + _data.name + '</h3>'
                    });
                    $('#czr-available-modules-list').append(  $_mod_candidate );
            });
      }
});//$.extend
})( wp.customize , jQuery, _ );
//extends api.Value
var CZRColumnMths = CZRColumnMths || {};
( function ( api, $, _ ) {
//extends api.Value
//a column is instanciated with the typical set of options :
// id : '',
// modules : [],
// sektion : {},//sektion instance
// module_id : '',
// control_id : '',
// is_added_by_user : false
$.extend( CZRColumnMths , {
      initialize: function( name, options ) {
            var column = this;
            api.Value.prototype.initialize.call( column, null, options );

            //write the options as properties, name is included
            $.extend( column, options || {} );

            column.isReady = $.Deferred();
            column.embedded = $.Deferred();

            //stores the column collection
            //set the initial value
            column.czr_columnModuleCollection = new api.Value();
            column.czr_columnModuleCollection.set( column.modules );

            //set the column instance value
            column.set( options );

            //the modules are stored only with their id in a column
            column.defautModuleModelInColumn = { id : '' };

            //api.consoleLog('column.sektion.contentRendered.state()', column.sektion.contentRendered.state() );

            //defer the column rendering when the parent sektion content is rendered
            column.sektion.bind( 'contentRendered', function() {
                  //render the column
                  column.container = column.render();
                  api.consoleLog('COLUMN CONTAINER?', column.container );
                  //say it
                  column.embedded.resolve();
            });







            //when column is embedded :
            //=> setup the DOM event handler
            column.embedded.done(function() {
                  //at this point, the question is : are the modules assigned to this column instantiated ?
                  //if not => let's instantiate them. => this should not change the module collection czr_moduleCollection of the module-collection control
                  //=> because they should already be registered in it
                  column.mayBeInstantiateColumnModules();

                  //react to column value changes
                  column.callbacks.add( function() { return column.columnReact.apply(column, arguments ); } );

                  //react to the column module collection changes
                  column.czr_columnModuleCollection.callbacks.add( function() { return column.columnModuleCollectionReact.apply( column, arguments ); } );

                  //Setup the column event listeners
                  api.CZR_Helpers.setupDOMListeners(
                          column.column_event_map,//actions to execute
                          { dom_el : column.container },//dom scope
                          column//instance where to look for the cb methods
                  );

                  //dragulize
                  var syncCollectionControl = api.control(column.control_id).getSyncCollectionControl();
                  api.consoleLog('////////////////////////////////////////////////////');
                  api.consoleLog('column.container?', column.container);
                  api.consoleLog('syncCollectionControl.syncSektionModule()', syncCollectionControl.syncSektionModule()() );
                  api.consoleLog('////////////////////////////////////////////////////');
                  syncCollectionControl.syncSektionModule().modsDragInstance.containers.push( $('.czr-module-collection-wrapper', column.container )[0] );

            });
      },



      //overridable method
      //Fired if column is instantiated.
      ready : function() {
            var column = this;
            //=>allows us to use the following event base method : column.isReady.done( function() {} ):
            column.isReady.resolve();

            //push it to the module collection
            column.sektion.module.updateColumnCollection( {column : column() });
      },

      //fired on column embedded
      mayBeInstantiateColumnModules : function() {
            var column = this,
                syncedCollectionControl = column.sektion.control.getSyncCollectionControl();

            //when the module collection is synchronized, instantiate the module of this column
            //=>fire ready when the module column is embedded
            $.when( syncedCollectionControl.moduleCollectionReady.promise() ).then(
                  function() {
                        _.each( column.czr_columnModuleCollection() , function( _mod ) {
                                  //is this module already instantiated ?
                                  if ( syncedCollectionControl.czr_Module.has(_mod.id) )
                                    return;

                                  //first let's try to get it from the collection
                                  //var _module_candidate = _.findWhere( syncedCollectionControl.czr_moduleCollection() , { id : _mod.id } );
                                  $.when( _.findWhere( syncedCollectionControl.czr_moduleCollection() , { id : _mod.id } ) ).done( function( module_candidate ) {
                                        if ( _.isUndefined( module_candidate) ||_.isEmpty( module_candidate ) ) {
                                          throw new Error( 'Module ' + _mod.id + ' was not found in the module collection.');
                                        }
                                        //we have a candidate. Let's instantiate it + fire ready()
                                        syncedCollectionControl.instantiateModule( module_candidate, {} ).ready();
                                  });


                                  //push it to the collection of the sektions control
                                  //@todo => shall we make sure that the module has actually been instatiated by the module-collection control?
                                  // if ( ! syncedCollectionControl.czr_Module.has( _module_candidate.id ) )
                                  //   return;

                                  //column.updateColumnModuleCollection( { module : _module_candidate });
                        } );
                  },//done callback
                  function() {},//fail callback
                  function() {
                        api.consoleLog( 'NOT SYNCHRONIZED YET');
                  }
            );//.then()
      },




      //fired on parent section 'contentRendered'
      render : function() {
            var column   = this;
            $view     = $( wp.template('czr-sektion-column')( {id: column.id}) );
            $view.appendTo( $('.czr-column-wrapper', column.sektion.container ) );
            return $view;
      },


      //cb of column.callbacks.add()
      //the job is this callback is to inform the parent sektion collection that something happened
      //typically, a module has been added
      columnReact : function( to ,from ) {
            var column = this;
            this.sektion.module.updateColumnCollection( {column : to });
      }
});//$.extend
})( wp.customize , jQuery, _ );
//extends api.Value
var CZRColumnMths = CZRColumnMths || {};
( function ( api, $, _ ) {
//extends api.Value
//a column is instanciated with the typical set of options :
// id : '',
// modules : [],
// sektion : {},//sektion instance
// module_id : '',
// control_id : '',
// is_added_by_user : false
$.extend( CZRColumnMths , {
      updateColumnModuleCollection : function( obj ) {
              var column = this,
                  _current_collection = column.czr_columnModuleCollection();
                  _new_collection = $.extend( true, [], _current_collection );

              api.consoleLog('column.czr_columnModuleCollection()', column.czr_columnModuleCollection() );

              //if a collection is provided in the passed obj then simply refresh the collection
              //=> typically used when reordering the collection module with sortable or when a column is removed
              if ( _.has( obj, 'collection' ) ) {
                    //reset the collection
                    column.czr_columnModuleCollection.set(obj.collection);
                    return;
              }

              if ( ! _.has(obj, 'module') ) {
                throw new Error('updateColumnModuleCollection, no module provided in column ' + column.id + '. Aborting');
              }

              //1) The module id must be a not empty string
              //2) The module shall not exist in another column
              var module_ready_for_column_api = column.prepareModuleForColumnAPI( _.clone(obj.module) );


              //the module already exist in the collection
              if ( _.findWhere( _new_collection, { id : module_ready_for_column_api.id } ) ) {
                    _.each( _current_collection , function( _elt, _ind ) {
                            if ( _elt.id != module_ready_for_column_api.id )
                              return;

                            //set the new val to the changed property
                            _new_collection[_ind] = module_ready_for_column_api;
                    });
              }
              //otherwise,the module has to be added
              else {
                    _new_collection.push(module_ready_for_column_api);
              }

              //set the collection
              column.czr_columnModuleCollection.set( _new_collection );
      },


      //cb of : column.czr_columnModuleCollection.callbacks.add()
      //the job of this method is to update the column instance value with a new collection of modules
      columnModuleCollectionReact : function( to, from ) {
              var column = this,
                  _current_column_model = column(),
                  _new_column_model = _.clone( _current_column_model ),
                  _new_module_collection = [];

              _.each( to , function( _mod, _key ) {
                  _new_module_collection[_key] = { id : _mod.id };
              });

              //say it to the column instance
              _new_column_model.modules = _new_module_collection;
              column.set( _new_column_model );
      },

      //remove a module base on the id
      //Note that the module param can include various properties (depending on where this method is called from) that won't be used in this function
      removeModuleFromColumnCollection : function( module ) {
              var column = this,
                  _current_collection = column.czr_columnModuleCollection();
                  _new_collection = $.extend( true, [], _current_collection );

              _new_collection = _.filter( _new_collection, function( _mod ){
                  return _mod.id != module.id;
              } );
              //set the collection
              column.czr_columnModuleCollection.set( _new_collection );
      },


      //column.defautModuleModelInColumn = { id : '' };
      prepareModuleForColumnAPI : function( module_candidate ) {
              if ( ! _.isObject( module_candidate ) ) {
                  throw new Error('prepareModuleForColumnAPI : a module must be an object.');
              }
              var column = this,
                  api_ready_module = {};

              _.each( column.defautModuleModelInColumn, function( _value, _key ) {
                      var _candidate_val = module_candidate[ _key ];
                      switch( _key ) {
                            case 'id' :
                              if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                                  throw new Error('prepareModuleForColumnAPI : a module id must a string not empty');
                              }
                              if ( ! column.sektion.module.moduleExistsInOneColumnMax( module_candidate.id ) ) {
                                  throw new Error('A module can not be embedded in more than one column at a time. Module ' + module_candidate.id + ' exists in several columns : ' +  column.sektion.module.getModuleColumn( module_candidate.id ).join(',') );
                              }
                              api_ready_module[ _key ] = _candidate_val;
                            break;
                      }//switch
              });//each
              return api_ready_module;
      },


      //@param old_col_id is the column in which the module was embedded before being move to the current one
      getColumnModuleCollectionFromDom : function( old_col_id ) {
              var column = this,
                  $_moduleWrapper = $('.czr-module-collection-wrapper', column.container ),
                  _previous_column_collection = column.sektion.module.czr_Column( old_col_id ).czr_columnModuleCollection(),
                  _new_collection = [];

              api.consoleLog('in GET COLUMN MODULE COLLECTION FROM DOM', old_col_id, $_moduleWrapper, column.container );

              $('.czr-single-module', $_moduleWrapper).each( function( _index ) {
                    //If the current module el was already there
                    //=> push it in the new collection and loop next
                    if ( ! _.isUndefined( _.findWhere( column.czr_columnModuleCollection(), { id: $(this).attr('data-module-id') } ) ) ) {
                          _new_collection[_index] = _.findWhere( column.czr_columnModuleCollection(), { id: $(this).attr('data-module-id') } );
                          return;
                    }

                    var _module_obj = _.findWhere( _previous_column_collection, { id: $(this).attr('data-module-id') } );

                    //do we have a match in the existing collection ?
                    if ( ! _module_obj ) {
                        throw new Error('The module  : ' + $(this).attr('data-module-id') + ' was not found in the collection of its previous column ' + old_col_id );
                    }
                    _new_collection[_index] = column.prepareModuleForColumnAPI( _module_obj );
              });

              if ( _.isEmpty( _new_collection ) ) {
                  throw new Error('There was a problem when re-building the column module collection from the DOM in column : ' + column.id );
              }
              return _new_collection;
      }
});//$.extend
})( wp.customize , jQuery, _ );//extends api.Value
var CZRSektionMths = CZRSektionMths || {};
( function ( api, $, _ ) {
$.extend( CZRSektionMths, {
      toggleSekSettingsPanel : function( obj ) {
            var module = this;
            if ( 'pending' == api.czrSekSettingsPanelEmbedded.state() ) {
                  try {
                        $.when( module.renderSekSettingsPanel() ).done( function() {
                              api.czrSekSettingsPanelEmbedded.resolve();
                        });
                  } catch( er ) {
                        api.errorLog( 'In toggleSekSettingsPanel : ' + er );
                  }
            }
            //close the module panel if needed
            api.czrModulePanelState.set( false );

            api.czrSekSettingsPanelState.set( ! api.czrSekSettingsPanelState() );

            //close all sektions but the one from which the button has been clicked
            module.closeAllOtherSektions( $(obj.dom_event.currentTarget, obj.dom_el ) );
      },

      //cb of api.czrSekSettingsPanelState.callbacks
      reactToSekSettingPanelState : function( expanded ) {
           $('body').toggleClass('czr-editing-sektion', expanded );
      },

      //fired once, on first expansion
      renderSekSettingsPanel : function() {
            var module = this,
                _tmpl = '';
            //do we have template script?
            if ( 0 === $( '#tmpl-czr-sektion-settings-panel' ).length ) {
                  throw new Error('No template found to render the sektion setting panel' );
            }
            try {
                  _tmpl = wp.template( 'czr-sektion-settings-panel' )();
            } catch( er ) {
                  api.errorLog( 'Error when parsing the template of the sektion setting panel' + er );
                  return;
            }
            $('#widgets-left').after( $( _tmpl ) );

            // _.each( api.czrModuleMap, function( _data, _mod_type ) {
            //         var $_mod_candidate = $('<li/>', {
            //               class : 'czr-module-candidate',
            //               'data-module-type' : _mod_type,
            //               html : '<h3><span class="czr-mod-drag-handler fa fa-arrows-alt"></span>' + _data.name + '</h3>'
            //         });
            //         $('#czr-available-modules-list').append(  $_mod_candidate );
            // });
      }
});//$.extend
})( wp.customize , jQuery, _ );
(function ( api, $, _ ) {
//provides a description of each module
      //=> will determine :
      //1) how to initialize the module model. If not crud, then the initial item(s) model shall be provided
      //2) which js template(s) to use : if crud, the module template shall include the add new and pre-item elements.
      //   , if crud, the item shall be removable
      //3) how to render : if multi item, the item content is rendered when user click on edit button.
      //    If not multi item, the single item content is rendered as soon as the item wrapper is rendered.
      //4) some DOM behaviour. For example, a multi item shall be sortable.
      api.czrModuleMap = api.czrModuleMap || {};
      $.extend( api.czrModuleMap, {
            czr_sektion_module : {
                  mthds : CZRSektionMths,
                  crud : true,
                  name : 'Sektions'
            },
            czr_fp_module : {
                  mthds : CZRFeaturedPageModuleMths,
                  crud : true,
                  name : 'Featured Pages'
            },
            czr_slide_module : {
                  mthds : CZRSlideModuleMths,
                  crud : true,
                  name : 'Slider',
                  has_mod_opt : true
            },
            czr_related_posts_module : {
                  mthds : CZRRelatedPostsModMths,
                  crud : false,
                  multi_item : false,
                  name : 'Related Posts',
                  has_mod_opt : false
            },
            czr_text_module : {
                  mthds : CZRTextModuleMths,
                  crud : false,
                  multi_item : false,
                  name : 'Simple Text'
            },
            czr_text_editor_module : {
                  mthds : CZRTextEditorModuleMths,
                  crud : false,
                  multi_item : false,
                  name : 'WP Text Editor'
            }
      });
})( wp.customize, jQuery, _ );