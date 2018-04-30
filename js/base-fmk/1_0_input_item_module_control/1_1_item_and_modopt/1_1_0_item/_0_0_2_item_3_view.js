
//extends api.CZRBaseControl
var CZRItemMths = CZRItemMths || {};
( function ( api, $, _ ) {
$.extend( CZRItemMths , {
      //fired on initialize for items in module embedded in a regular control
      mayBeRenderItemWrapper : function() {
            var item = this;

            if ( 'pending' != item.embedded.state() )
              return;
            // Make sure we don't print twice
            if ( ! _.isEmpty( item.container ) && item.container.length > 0 )
              return;

            $.when( item.renderItemWrapper() ).done( function( $_container ) {
                  item.container = $_container;
                  if ( _.isUndefined(item.container) || ! item.container.length ) {
                      throw new Error( 'In mayBeRenderItemWrapper the Item view has not been rendered : ' + item.id );
                  } else {
                      //say it
                      item.embedded.resolve();
                  }
            });
      },

      //the view wrapper has been rendered by WP
      //the content ( the various inputs ) is rendered by the following methods
      //an event is triggered on the control.container when content is rendered
      renderItemWrapper : function( _item_model_ ) {
            //=> an array of objects
            var item = this,
                module = item.module,
                dfd = $.Deferred(),
                $_view_el;

            // Create a deep copy of the item, so we can inject custom properties before parsing the template, without affecting the original item
            var item_model_for_template_injection = $.extend( true, {}, _item_model_ || item() );

            var appendAndResolve = function( _tmpl_ ) {
                  //if module is multi item, then render the item crud header part
                  //Note : for the widget module, the getTemplateSelectorPart method is overridden
                  if ( module.isMultiItem() ) {
                        //do we have an html template ?
                        if ( _.isEmpty( _tmpl_ ) ) {
                              dfd.reject( 'renderItemWrapper => Missing html template for module : '+ module.id );
                        }
                        $_view_el.append( _tmpl_ );
                  }

                  //then, append the item content wrapper
                  $_view_el.append( $( '<div/>', { class: module.control.css_attr.item_content } ) );

                  dfd.resolve( $_view_el );
            };//appendAndResolve


            // allow plugin to alter the item_model before template injection
            item.trigger( 'item-model-before-item-wrapper-template-injection', item_model_for_template_injection );

            //render the item wrapper
            $_view_el = $('<li>', { class : module.control.css_attr.single_item, 'data-id' : item_model_for_template_injection.id,  id : item_model_for_template_injection.id } );

            //append the item view to the first module view wrapper
            //!!note : => there could be additional sub view wrapper inside !!
            //$( '.' + module.control.css_attr.items_wrapper , module.container).first().append( $_view_el );
            // module.itemsWrapper has been stored as a $ var in module initialize() when the tmpl has been embedded
            module.itemsWrapper.append( $_view_el );

            if ( module.isMultiItem() ) {
                  // Do we have view content template script?
                  // if yes, let's use it <= Old way
                  // Otherwise let's fetch the html template from the server
                  if ( ! _.isEmpty( module.rudItemPart ) ) {
                        var _template_selector = module.getTemplateSelectorPart( 'rudItemPart', item_model_for_template_injection );
                        //do we have view template script?
                        if ( 1 > $( '#tmpl-' + _template_selector ).length ) {
                            dfd.reject( 'Missing template for item ' + item.id + '. The provided template script has no been found : #tmpl-' + _template_selector );
                        }
                        appendAndResolve( wp.template( _template_selector )( item_model_for_template_injection ) );
                  } else {

                        // allow plugin to alter the ajax params before fetching
                        var requestParams = {
                              tmpl : 'rud-item-part',
                              module_type: 'all_modules',
                              module_id : module.id,
                              control_id : module.control.id
                        };
                        item.trigger( 'item-wrapper-tmpl-params-before-fetching', requestParams );

                        api.CZR_Helpers.getModuleTmpl( requestParams ).done( function( _serverTmpl_ ) {
                              //console.log( 'renderItemWrapper => success response =>', module.id, _serverTmpl_);
                              appendAndResolve( api.CZR_Helpers.parseTemplate( _serverTmpl_ )( {} ) );
                        }).fail( function( _r_ ) {
                              //console.log( 'renderItemWrapper => fail response =>', _r_);
                              dfd.reject( 'renderItemWrapper => Problem when fetching the rud-item-part tmpl from server for module : '+ module.id );
                        });
                  }
            } else {
                  appendAndResolve();
            }

            return dfd.promise();
      },

      // fired when item is ready and embedded
      // define the item view DOM event map
      // bind actions when the item is embedded
      itemWrapperViewSetup : function( _item_model_ ) {
            var item = this,
                module = this.module;

            //_item_model_ = item() || item.initial_item_model;//could not be set yet

            // Let's create a deep copy now
            item_model = item() || item.initial_item_model;//$.extend( true, {}, _item_model_ );

            //always write the title
            item.writeItemViewTitle();


            //When do we render the item content ?
            //If this is a multi-item module, let's render each item content when they are expanded.
            //In the case of a single item module, we can render the item content now.
            var _updateItemContentDeferred = function( $_item_content, to, from ) {
                  //update the $.Deferred state
                  if ( ! _.isUndefined( $_item_content ) && false !== $_item_content.length ) {
                        item.contentContainer = $_item_content;
                        item.trigger( 'contentRendered', { item_content : $_item_content } );
                        item.toggleItemExpansion( to, from );
                  }
                  else {
                        throw new Error( 'Module : ' + item.module.id + ', the item content has not been rendered for ' + item.id );
                  }
            };

            if ( item.module.isMultiItem() ) {
                  item.viewState.callbacks.add( function( to, from ) {
                        //viewState can take 3 states : expanded, expanded_noscroll, closed
                        var _isExpanded = -1 !== to.indexOf( 'expanded' );

                        //If this module has mod Opt, always close the opt pane on view state change
                        if ( module.hasModOpt() && _isExpanded ) {
                              api.czr_ModOptVisible( false );
                        }

                        if ( _isExpanded ) {
                              //item already rendered ?
                              if ( _.isObject( item.contentContainer ) && false !== item.contentContainer.length ) {
                                    //toggle on view state change
                                    item.toggleItemExpansion(to, from );
                              } else {
                                    item.renderItemContent( item() || item.initial_item_model )
                                          .done( function( $_item_content ) {
                                                //introduce a small delay to give some times to the modules to be printed.
                                                //@todo : needed ?
                                                //_updateItemContentDeferred = _.debounce(_updateItemContentDeferred, 50 );
                                                _updateItemContentDeferred( $_item_content, to, from );
                                          })
                                          .fail( function( _r_ ) {
                                                api.errorLog( "multi-item module => failed item.renderItemContent for module : " + module.id, _r_ );
                                          });
                              }
                        } else {
                              //toggle on view state change
                              item.toggleItemExpansion( to, from ).done( function() {
                                    if ( _.isObject( item.contentContainer ) && false !== item.contentContainer.length ) {
                                          item.trigger( 'beforeContenRemoved' );
                                          //Removes DOM input nodes
                                          $( '.' + module.control.css_attr.item_content, item.container ).children().each( function() {
                                                $(this).remove();
                                          });
                                          //clean any other content like a commented html markup
                                          $( '.' + module.control.css_attr.item_content, item.container ).html('');
                                          //reset the contentContainer property
                                          item.contentContainer = null;
                                          //will remove the input collection values
                                          item.trigger( 'contentRemoved' );
                                    }
                              });
                        }
                  });
            } else {
                  //react to the item state changes
                  item.viewState.callbacks.add( function( to, from ) {
                        //toggle on view state change
                        item.toggleItemExpansion.apply(item, arguments );
                  });

                  //renderview content now for a single item module
                  item.renderItemContent( item_model )
                        .done( function( $_item_content ) {
                              _updateItemContentDeferred( $_item_content, true );
                              //item.viewState.set('expanded');
                        })
                        .fail( function( _r_ ) {
                              api.errare( "mono-item module => failed item.renderItemContent for module : " + module.id, _r_ );
                        });
            }

            //DOM listeners for the user action in item view wrapper
            api.CZR_Helpers.setupDOMListeners(
                  item.userEventMap(),//actions to execute
                  { model:item_model, dom_el:item.container },//model + dom scope
                  item //instance where to look for the cb methods
            );

            //Listen to the remove dialog state
            item.removeDialogVisible.bind( function( visible ) {
                  var module = item.module,
                      $_alert_el = $( '.' + module.control.css_attr.remove_alert_wrapper, item.container ).first();

                  //first close all open items views and dialogs
                  if ( visible )
                    module.closeAllItems();

                  //Close Mod opts if any
                  if ( visible && module.hasModOpt() ) {
                        api.czr_ModOptVisible( false );
                  }

                  //Close Pre item dialog
                  if ( visible && _.has( module, 'preItem' ) ) {
                        module.preItemExpanded(false);
                  }

                  //then close any other open remove dialog in the item container
                  $('.' + module.control.css_attr.remove_alert_wrapper, item.container ).not( $_alert_el ).each( function() {
                        if ( $(this).hasClass( 'open' ) ) {
                              $(this).slideToggle( {
                                    duration : 200,
                                    done : function() {
                                          $(this).toggleClass('open' , false );
                                          //deactivate the icons
                                          $(this).siblings().find('.' + module.control.css_attr.display_alert_btn).toggleClass( 'active' , false );
                                    }
                              } );
                        }
                  });

                  //print the html if dialod is expanded
                  if ( visible ) {
                        // Do we have view content template script?
                        // if yes, let's use it <= Old way
                        // Otherwise let's fetch the html template from the server
                        if ( ! _.isEmpty( module.alertPart ) ) {
                              if ( 1 > $( '#tmpl-' + module.alertPart ).length || _.isEmpty( item.container ) ) {
                                    api.errare( 'No removal alert template available for items in module :' + module.id );
                                    return;
                              }
                              $_alert_el.html( wp.template( module.alertPart )( { title : ( item().title || item.id ) } ) );
                              item.trigger( 'remove-dialog-rendered');
                        } else {
                              api.CZR_Helpers.getModuleTmpl( {
                                    tmpl : 'rud-item-alert-part',
                                    module_type: 'all_modules',
                                    module_id : module.id,
                                    control_id : module.control.id
                              } ).done( function( _serverTmpl_ ) {
                                    //console.log( 'item.removeDialogVisible => success response =>', module.id, _serverTmpl_);
                                    $_alert_el.html( api.CZR_Helpers.parseTemplate( _serverTmpl_ )( { title : ( item().title || item.id ) } ) );
                                    item.trigger( 'remove-dialog-rendered');
                              }).fail( function( _r_ ) {
                                    //console.log( 'item.removeDialogVisible => fail response =>', _r_);
                                    api.errare( 'item.removeDialogVisible => Problem when fetching the tmpl from server for module : '+ module.id, _r_ );
                              });
                        }
                  }

                  //Slide it
                  var _slideComplete = function( visible ) {
                        $_alert_el.toggleClass( 'open' , visible );
                        //set the active class of the clicked icon
                        item.container.find('.' + module.control.css_attr.display_alert_btn ).toggleClass( 'active', visible );
                        //adjust scrolling to display the entire dialog block
                        if ( visible )
                          module._adjustScrollExpandedBlock( item.container );
                  };
                  if ( visible )
                    $_alert_el.stop( true, true ).slideDown( 200, function() { _slideComplete( visible ); } );
                  else
                    $_alert_el.stop( true, true ).slideUp( 200, function() { _slideComplete( visible ); } );
            });//item.removeDialogVisible.bind()
      },//itemWrapperViewSetup



      //renders saved items views and attach event handlers
      //the saved item look like :
      //array[ { id : 'sidebar-one', title : 'A Title One' }, {id : 'sidebar-two', title : 'A Title Two' }]
      renderItemContent : function( _item_model_ ) {
            //=> an array of objects
            var item = this,
                module = this.module,
                dfd = $.Deferred();

            // Create a deep copy of the item, so we can inject custom properties before parsing the template, without affecting the original item
            var item_model_for_template_injection = $.extend( true, {}, _item_model_ || item() );

            // allow plugin to alter the item_model before template injection
            item.trigger( 'item-model-before-item-content-template-injection', item_model_for_template_injection );

            var appendAndResolve = function( _tmpl_ ) {
                  //do we have an html template ?
                  if ( _.isEmpty( _tmpl_ ) ) {
                        dfd.reject( 'renderItemContent => Missing html template for module : '+ module.id );
                  }
                  var $itemContentWrapper = $( '.' + module.control.css_attr.item_content, item.container );
                  // append the view content
                  $( _tmpl_ ).appendTo( $itemContentWrapper );
                  dfd.resolve( $itemContentWrapper );
            };//appendAndResolve

            // Do we have view content template script?
            // if yes, let's use it <= Old way
            // Otherwise let's fetch the html template from the server
            if ( ! _.isEmpty( module.itemInputList ) || _.isFunction( module.itemInputList ) ) {
                  var tmplSelectorSuffix = module.getTemplateSelectorPart( 'itemInputList', item_model_for_template_injection );
                  if ( 1 > $( '#tmpl-' + tmplSelectorSuffix ).length ) {
                        dfd.reject( 'renderItemContent => No itemInputList content template defined for module ' + module.id + '. The template script id should be : #tmpl-' + tmplSelectorSuffix );
                  }
                  appendAndResolve( wp.template( tmplSelectorSuffix )( item_model_for_template_injection ) );
            } else {
                  var requestParams = {
                        tmpl : 'item-inputs',
                        module_type: module.module_type,
                        module_id : module.id,
                        control_id : module.control.id,
                        item_model : item_model_for_template_injection
                  };
                  // allow plugins to filter the query param before fetching the template for item content
                  module.trigger( 'filter-request-params-before-fetching-for-item-content-tmpl', requestParams );

                  api.CZR_Helpers.getModuleTmpl( requestParams ).done( function( _serverTmpl_ ) {
                        //console.log( 'renderItemContent => success response =>', _serverTmpl_);
                        appendAndResolve( api.CZR_Helpers.parseTemplate( _serverTmpl_ )( $.extend( item_model_for_template_injection, { control_id : module.control.id } ) ) );
                  }).fail( function( _r_ ) {
                        //console.log( 'renderItemContent => fail response =>', _r_);
                        dfd.reject( _r_ );
                  });
            }
            return dfd.promise();
      },





      //fired in setupItemListeners
      writeItemViewTitle : function( item_model ) {
            var item = this,
                module = item.module,
                _model = item_model || item(),
                //Let's fall back on the id if the title is not set or empty
                _title = ( _.has( _model, 'title') && ! _.isEmpty( _model.title ) ) ? api.CZR_Helpers.capitalize( _model.title ) : _model.id;

            _title = api.CZR_Helpers.truncate( _title, 20 );
            $( '.' + module.control.css_attr.item_title , item.container ).text( _title );
            //add a hook here
            api.CZR_Helpers.doActions('after_writeViewTitle', item.container , _model, item );
      },



      //@param : obj = { event : {}, model : {}, view : ${} }
      //Fired on view_rendered:new when a new model has been added
      //Fired on click on edit_view_btn
      setViewVisibility : function( obj, is_added_by_user ) {
            var item = this,
                module = this.module;
            if ( is_added_by_user ) {
                  item.viewState.set( 'expanded_noscroll' );
            } else {
                  module.closeAllItems( item.id );
                  if ( _.has(module, 'preItem') ) {
                    module.preItemExpanded.set(false);
                  }
                  item.viewState.set( 'expanded' == item._getViewState() ? 'closed' : 'expanded' );
            }
      },


      _getViewState : function() {
            return -1 == this.viewState().indexOf('expanded') ? 'closed' : 'expanded';
      },


      //callback of item.viewState.callbacks
      //viewState can take 3 states : expanded, expanded_noscroll, closed
      toggleItemExpansion : function( status, from, duration ) {
            var visible = 'closed' != status,
                item = this,
                module = this.module,
                $el = $( '.' + module.control.css_attr.item_content , item.container ).first(),
                dfd = $.Deferred(),
                _slideComplete = function( visible ) {
                      item.container.toggleClass( 'open' , visible );
                      //close all remove dialogs
                      if ( visible )
                        module.closeRemoveDialogs();

                      //toggle the icon activate class depending on the status
                      //switch icon
                      var $_edit_icon = $el.siblings().find('.' + module.control.css_attr.edit_view_btn );

                      $_edit_icon.toggleClass('active' , visible );
                      if ( visible )
                        $_edit_icon.removeClass('fa-pencil-alt').addClass('fa-minus-square').attr('title', serverControlParams.i18n.close );
                      else
                        $_edit_icon.removeClass('fa-minus-square').addClass('fa-pencil-alt').attr('title', serverControlParams.i18n.edit );

                      //scroll to the currently expanded view
                      if ( 'expanded' == status ) {
                            module._adjustScrollExpandedBlock( item.container );
                      }

                      dfd.resolve();
                };

            if ( visible ) {
                  $el.stop( true, true ).slideDown( duration || 200, function() { _slideComplete( visible ); } );
            } else {
                  $el.stop( true, true ).slideUp( 200, function() { _slideComplete( visible ); } );
            }

            return dfd.promise();
      },


      //removes the view dom module
      _destroyView : function ( duration ) {
            this.container.fadeOut( {
                duration : duration ||400,
                done : function() {
                  $(this).remove();
                }
            });
      }
});//$.extend
})( wp.customize , jQuery, _ );