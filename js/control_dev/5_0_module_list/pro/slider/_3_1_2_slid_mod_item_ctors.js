//extends api.CZRDynModule

var CZRSlideModuleMths = CZRSlideModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRSlideModuleMths, {
      CZRSliderItemCtor : {
              //overrides the parent ready
              ready : function() {
                    var item = this;
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
                    });

                    //fire the parent
                    api.CZRItem.prototype.ready.call( item );
              },


              //////////////////////////////FIXED CONTENT DEPENDENCIES //////////////////
              ///////////////////////////////////////////////////////////////////////////
              //@return void()
              //Fired when module is ready
              setModOptDependantsVisibilities : function() {
                    var item = this,
                        module = item.module,
                        _dependants = [ 'slide-title', 'slide-subtitle', 'slide-cta', 'slide-link', 'slide-custom-link' ],
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
                                                  api.czr_ModOptVisible( ! api.czr_ModOptVisible() ).done( function() {
                                                        setTimeout( function() {
                                                              if ( _.isNull(  module.czr_ModOpt.container ) || ! module.czr_ModOpt.container.find('[data-tab-id="section-topline-2"] a').length )
                                                                return;
                                                              module.czr_ModOpt.container.find('[data-tab-id="section-topline-2"] a').trigger('click');
                                                        }, 200 );
                                                  });
                                            }
                                      }
                                ],//actions to execute
                                { model : item(), dom_el : item.container },//model + dom scope
                                item //instance where to look for the cb methods
                          );

                          var _html_ = [
                              '<strong>',
                              'The caption content is currently set in',
                              '<a href="javascript:void(0)" class="open-mod-option">' + 'the general options' + '</a>',
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

                                case 'slide-cta' :
                                      //Fire on init
                                      item.czr_Input('slide-link').visible( ! _.isEmpty( input() ) );
                                      item.czr_Input('slide-custom-link').visible( ! _.isEmpty( input() ) && module._isCustomLink( item.czr_Input('slide-link')() ) );
                                      item.czr_Input('slide-link-target').visible( ! _.isEmpty( input() ) );

                                      //React on change
                                      input.bind( function( to ) {
                                            item.czr_Input('slide-link').visible( ! _.isEmpty( to ) );
                                            item.czr_Input('slide-custom-link').visible( ! _.isEmpty( to ) && module._isCustomLink( item.czr_Input('slide-link')() ) );
                                            item.czr_Input('slide-link-target').visible( ! _.isEmpty( to ) );
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
                          _title = [ serverControlParams.i18n.mods.slider['Slide'], _index ].join( ' ' );
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
      }//CZRSliderItemCtor
});//extend
})( wp.customize , jQuery, _ );