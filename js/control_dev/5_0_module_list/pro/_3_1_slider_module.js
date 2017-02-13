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

          this.sliderSkins = serverControlParams.slideModuleParams.sliderSkins;

          //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUTS
          module.inputConstructor = api.CZRInput.extend( module.CZRSliderInputCtor || {} );
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

          //Always write the title on item collection sorted
          module.bind('item-collection-sorted', function() {
                module.czr_Item.each( function( _itm_ ){
                      _itm_.writeItemViewTitle();
                });
          });

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




  CZRSliderInputCtor : {
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
                            title       : '<span style="font-weight:bold">Set a custom url</span>',//@to_translate
                            type_label  : '',
                            object_type : '',
                            url         : ''
                      }];
                }

                api.CZRInput.prototype.ready.call( input);
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
          //overrides the default method
          setupSelect : function() {
                var input      = this,
                    modOpt      = input.input_parent,
                    module     = input.module,
                    _sliderSkins   = module.sliderSkins,//{}
                    _model = modOpt();

                //generates the options
                _.each( _sliderSkins , function( _layout_name , _k ) {
                      var _attributes = {
                                value : _k,
                                html: _layout_name
                          };
                      if ( _k == _model['skin'] ) {
                            $.extend( _attributes, { selected : "selected" } );
                      }
                      $( 'select[data-type="skin"]', input.container ).append( $('<option>', _attributes) );
                });
                $( 'select[data-type="skin"]', input.container ).selecter();
        }
  },//CZRSlidersInputMths





  CZRSliderItemCtor : {
          //overrides the parent ready
          ready : function() {
                var item = this;
                //wait for the input collection to be populated, and then set the input visibility dependencies
                item.inputCollection.bind( function( col ) {
                      if( _.isEmpty( col ) )
                        return;
                      item.setInputVisibilityDeps();
                });
                //fire the parent
                api.CZRItem.prototype.ready.call( item );
          },


          //Fired when the input collection is populated
          //At this point, the inputs are all ready (input.isReady.state() === 'resolved') and we can use their visible Value ( set to true by default )
          setInputVisibilityDeps : function() {
                var item = this,
                    //the slide-link value is an object which has always an id (post id) + other properties like title
                    _isCustomLink = function( input_val ) {
                          return _.isObject( input_val ) && '_custom_' === input_val.id;
                    };

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

                            case 'slide-cta' :
                                  //Fire on init
                                  item.czr_Input('slide-link').visible( ! _.isEmpty( input() ) );
                                  item.czr_Input('slide-custom-link').visible( ! _.isEmpty( input() ) && _isCustomLink( item.czr_Input('slide-link')() ) );

                                  //React on change
                                  input.bind( function( to ) {
                                        item.czr_Input('slide-link').visible( ! _.isEmpty( to ) );
                                        item.czr_Input('slide-custom-link').visible( ! _.isEmpty( to ) && _isCustomLink( item.czr_Input('slide-link')() ) );
                                  });
                            break;

                            //the slide-link value is an object which has always an id (post id) + other properties like title
                            case 'slide-link' :
                                  //Fire on init
                                  item.czr_Input('slide-custom-link').visible( _isCustomLink( input() ) );
                                  //React on change
                                  input.bind( function( to ) {
                                        item.czr_Input('slide-custom-link').visible( _isCustomLink( to ) );
                                  });
                            break;
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
                    _src = 'not_set';

                //When shall we update the item title ?
                //=> when the slide title or the thumbnail have been updated
                if ( _.isObject( data ) && data.input_changed && ! _.contains( ['slide-title', 'slide-background' ], data.input_changed ) )
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
                      _title = [ serverControlParams.translatedStrings.slideTitle, _index ].join( ' ' );
                }

                //if the slide title is set, use it
                _title = _.isEmpty( _model['slide-title'] ) ? _title : _model['slide-title'];
                _title = api.CZR_Helpers.truncate( _title, 15 );
                // _title = [
                //       '<div class="slide-thumb"></div>',
                //       '<div class="slide-title">' + _title + '</div>',,
                // ].join('');

                var _getThumbSrc = function() {
                      var dfd = $.Deferred();
                      //try to set the default src
                      if ( serverControlParams.slideModuleParams && serverControlParams.slideModuleParams.defaultThumb ) {
                            _src = serverControlParams.slideModuleParams.defaultThumb;
                      }
                      if ( ! _.isNumber( _model['slide-background'] ) ) {
                            dfd.resolve( _src );
                      } else {
                            wp.media.attachment( _model['slide-background'] ).fetch()
                                  .always( function() {
                                        var attachment = this;
                                        if ( _.isObject( attachment ) && _.has( attachment, 'attributes' ) && _.has( attachment.attributes, 'sizes' ) ) {
                                              _src = this.get('sizes').thumbnail.url;
                                              dfd.resolve( _src );
                                        }
                                  });
                      }
                      return dfd.promise();
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
                var _isBgChange = _.isObject( data ) && data.input_changed && 'slide-background' === data.input_changed;

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
                } else if ( _isBgChange ) {
                      _getThumbSrc().done( function( src ) {
                            if ( 'not_set' != src ) {
                                  $slideThumbEl.html( '<img src="' + src + '" width="32" height="32" alt="' + _title + '" />' );
                            }
                      });
                }
          }
  },//CZRSliderItemCtor



  CZRSliderModOptCtor : {
        ready: function() {
              var modOpt = this;
              //wait for the input collection to be populated, and then set the input visibility dependencies
              modOpt.inputCollection.bind( function( col ) {
                    if( _.isEmpty( col ) )
                      return;
                    modOpt.setModOptInputVisibilityDeps();
              });
              //fire the parent
              api.CZRModOpt.prototype.ready.call( modOpt );
        },


        //Fired when the input collection is populated
        //At this point, the inputs are all ready (input.isReady.state() === 'resolved') and we can use their visible Value ( set to true by default )
        setModOptInputVisibilityDeps : function() {
              var modOpt = this,
                  _isChecked = function( v ) {
                        return 0 !== v && '0' !== v && false !== v && 'off' !== v;
                  };

              modOpt.czr_Input.each( function( input ) {
                    switch( input.id ) {
                          case 'autoplay' :
                                //Fire on init
                                modOpt.czr_Input('slider-speed').visible( _isChecked( input() ) );
                                modOpt.czr_Input('pause-on-hover').visible( _isChecked( input() ) );

                                //React on change
                                input.bind( function( to ) {
                                      modOpt.czr_Input('slider-speed').visible( _isChecked( to ) );
                                      modOpt.czr_Input('pause-on-hover').visible( _isChecked( to ) );
                                });
                          break;
                    }
              });
        }

  }
});