
//extends api.CZRBaseControl
var CZRItemMths = CZRItemMths || {};
( function ( api, $, _ ) {
$.extend( CZRItemMths , {
      //fired on initialize for items in module embedded in a regular control
      //fired when user edit module for items in modules embedded in a sektion
      mayBeRenderItemWrapper : function() {
            var item = this;

            if ( 'pending' != item.embedded.state() )
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


      //fired when item is ready and embedded
      //define the item view DOM event map
      //bind actions when the item is embedded
      itemWrapperViewSetup : function( item_model ) {
            var item = this,
                module = this.module;

            item_model = item() || item.initial_item_model;//could not be set yet

            //always write the title
            item.writeItemViewTitle();


            //When do we render the item content ?
            //If this is a multi-item module, let's render each item content when they are expanded.
            //In the case of a single item module, we can render the item content now.
            var _updateItemContentDeferred = function( $_content, to, from ) {
                  //update the $.Deferred state
                  if ( ! _.isUndefined( $_content ) && false !== $_content.length ) {
                      item.trigger( 'contentRendered' );
                      item.contentContainer = $_content;
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
                                    $.when( item.renderItemContent( item() || item.initial_item_model ) ).done( function( $_item_content ) {
                                          //introduce a small delay to give some times to the modules to be printed.
                                          //@todo : needed ?
                                          _updateItemContentDeferred = _.debounce(_updateItemContentDeferred, 50 );
                                          _updateItemContentDeferred( $_item_content, to, from );
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
                  $.when( item.renderItemContent( item_model ) ).done( function( $_item_content ) {
                        _updateItemContentDeferred( $_item_content, true );
                        //item.viewState.set('expanded');
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
                        //do we have an html template and a control container?
                        if ( ! wp.template( module.AlertPart )  || ! item.container ) {
                              api.consoleLog( 'No removal alert template available for items in module :' + module.id );
                              return;
                        }

                        $_alert_el.html( wp.template( module.AlertPart )( { title : ( item().title || item.id ) } ) );
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


      //the view wrapper has been rendered by WP
      //the content ( the various inputs ) is rendered by the following methods
      //an event is triggered on the control.container when content is rendered
      renderItemWrapper : function( item_model ) {
            //=> an array of objects
            var item = this,
                module = item.module;

            item_model = item_model || item();

            //render the item wrapper
            $_view_el = $('<li>', { class : module.control.css_attr.single_item, 'data-id' : item_model.id,  id : item_model.id } );

            //append the item view to the first module view wrapper
            //!!note : => there could be additional sub view wrapper inside !!
            //$( '.' + module.control.css_attr.items_wrapper , module.container).first().append( $_view_el );
            // module.itemsWrapper has been stored as a $ var in module initialize() when the tmpl has been embedded
            module.itemsWrapper.append( $_view_el );

            //if module is multi item, then render the item crud header part
            //Note : for the widget module, the getTemplateEl method is overridden
            if ( module.isMultiItem() ) {
                  var _template_selector = module.getTemplateEl( 'rudItemPart', item_model );
                  //do we have view template script?
                  if ( 0 === $( '#tmpl-' + _template_selector ).length ) {
                      throw new Error('Missing template for item ' + item.id + '. The provided template script has no been found : #tmpl-' + module.getTemplateEl( 'rudItemPart', item_model ) );
                  }
                  $_view_el.append( $( wp.template( _template_selector )( item_model ) ) );
            }


            //then, append the item content wrapper
            $_view_el.append( $( '<div/>', { class: module.control.css_attr.item_content } ) );

            return $_view_el;
      },


      //renders saved items views and attach event handlers
      //the saved item look like :
      //array[ { id : 'sidebar-one', title : 'A Title One' }, {id : 'sidebar-two', title : 'A Title Two' }]
      renderItemContent : function( item_model ) {
              //=> an array of objects
              var item = this,
                  module = this.module;

              item_model = item_model || item();

              //do we have view content template script?
              if ( 0 === $( '#tmpl-' + module.getTemplateEl( 'itemInputList', item_model ) ).length ) {
                  throw new Error('No item content template defined for module ' + module.id + '. The template script id should be : #tmpl-' + module.getTemplateEl( 'itemInputList', item_model ) );
              }

              var  item_content_template = wp.template( module.getTemplateEl( 'itemInputList', item_model ) );

              //do we have an html template ?
              if ( ! item_content_template )
                return this;

              //the view content
              $( item_content_template( item_model )).appendTo( $('.' + module.control.css_attr.item_content, item.container ) );

              return $( $( item_content_template( item_model )), item.container );
      },





      //fired in setupItemListeners
      writeItemViewTitle : function( item_model ) {
            var item = this,
                module = item.module,
                _model = item_model || item(),
                _title = _.has( _model, 'title')? api.CZR_Helpers.capitalize( _model.title ) : _model.id;

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
                        $_edit_icon.removeClass('fa-pencil').addClass('fa-minus-square').attr('title', serverControlParams.i18n.close );
                      else
                        $_edit_icon.removeClass('fa-minus-square').addClass('fa-pencil').attr('title', serverControlParams.i18n.edit );

                      //scroll to the currently expanded view
                      if ( 'expanded' == status )
                        module._adjustScrollExpandedBlock( item.container );

                      dfd.resolve();
                };

            if ( visible )
              $el.stop( true, true ).slideDown( duration || 200, function() { _slideComplete( visible ); } );
            else
              $el.stop( true, true ).slideUp( 200, function() { _slideComplete( visible ); } );

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