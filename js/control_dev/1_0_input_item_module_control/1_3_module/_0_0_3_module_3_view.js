//MULTI CONTROL CLASS
//extends api.CZRBaseControl
//
//Setup the collection of items
//renders the module view
//Listen to items collection changes and update the control setting

var CZRModuleMths = CZRModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRModuleMths, {
      //fired on module.isReady.done()
      //the module.container is set. Either as the control.container or the single module wrapper in a sektion
      renderModuleParts : function() {
              var module = this,
                  $_moduleContentEl = module.isInSektion() ? $( module.container ).find('.czr-mod-content') : $( module.container );

              //Crud modules => then let's add the crud module part tmpl
              if ( module.isCrud() ) {
                    //do we have view template script?
                    if ( 0 === $( '#tmpl-' + module.crudModulePart ).length ) {
                      throw new Error('No crud Module Part template for module ' + module.id + '. The template script id should be : #tmpl-' + module.crudModulePart );
                    }

                    //append the module wrapper to the column
                    $_moduleContentEl.append( $( wp.template( module.crudModulePart )( {} ) ) );
              }
              var $_module_items_wrapper = $(
                '<ul/>',
                {
                  class : [
                    module.control.css_attr.items_wrapper,
                    module.module_type,
                    module.isMultiItem() ? 'multi-item-mod' : 'mono-item-mod',
                    module.isCrud() ? 'crud-mod' : 'not-crud-mod'
                  ].join(' ')
                }
              );

              $_moduleContentEl.append($_module_items_wrapper);

              return $( $_module_items_wrapper, $_moduleContentEl );
      },

      //called before rendering a view. Fired in module::renderItemWrapper()
      //can be overridden to set a specific view template depending on the model properties
      //@return string
      //@type can be
      //Read Update Delete (rud...)
      //Read Update (ru)
      //...
      //@item_model is an object describing the current item model
      getTemplateEl : function( type, item_model ) {
              var module = this, _el;
              switch(type) {
                    case 'rudItemPart' :
                      _el = module.rudItemPart;
                      break;
                    case 'ruItemPart' :
                      _el = module.ruItemPart;
                      break;
                    case 'modOptInputList' :
                      _el = module.modOptInputList;
                      break;
                    case 'itemInputList' :
                      _el = module.itemInputList;
                      break;
              }
              if ( _.isEmpty(_el) ) {
                   throw new Error('No valid template has been found in getTemplateEl() ' + module.id + '. Aborting');
              } else {
                  return _el;
              }
      },

      //helper
      //get the $ view DOM el from the item id
      getViewEl : function( id ) {
              var module = this;
              return $( '[data-id = "' + id + '"]', module.container );
      },


      //fired on add_item
      //fired on views_sorted
      closeAllItems : function( id ) {
              var module = this,
                  _current_collection = _.clone( module.itemCollection() ),
                  _filtered_collection = _.filter( _current_collection , function( mod) { return mod.id != id; } );

              _.each( _filtered_collection, function( _item ) {
                    if ( module.czr_Item.has(_item.id) && 'expanded' == module.czr_Item(_item.id)._getViewState(_item.id) )
                      module.czr_Item( _item.id ).viewState.set( 'closed' ); // => will fire the cb toggleItemExpansion
              } );
              return this;
      },


      //make sure a given jQuery block is fully visible
      //@param $(el)
      _adjustScrollExpandedBlock : function( $_block_el, adjust ) {
              if ( ! $_block_el.length || _.isUndefined( this.getModuleSection() ) )
                return;
              var module = this,
                   $_moduleSection = $( '.accordion-section-content', module.section.container ),//was api.section( control.section() )
                  _currentScrollTopVal = $_moduleSection.scrollTop(),
                  _scrollDownVal,
                  _adjust = adjust || 90;

              setTimeout( function() {
                    if ( ( $_block_el.offset().top + $_block_el.height() + _adjust ) > $(window.top).height() ) {
                        _scrollDownVal = $_block_el.offset().top + $_block_el.height() + _adjust - $(window.top).height();
                        if ( _scrollDownVal > 0 ) {
                            $_moduleSection.animate({
                                scrollTop:  _currentScrollTopVal + _scrollDownVal
                            }, 500);
                        }
                    }
              }, 50);
      },



      //close alert wrapper
      //+ deactivate the icon
      closeRemoveDialogs : function() {
              var module = this;
              if ( ! _.isArray( module.itemCollection() ) )
                return;

              module.czr_Item.each( function( _item_ ) {
                    _item_.removeDialogVisible( false );
              });

              // $('.' + module.control.css_attr.remove_alert_wrapper, module.container ).each( function() {
              //       if ( $(this).hasClass('open') ) {
              //             $(this).slideToggle( {
              //                   duration : 100,
              //                   done : function() {
              //                     $(this).toggleClass('open' , false );
              //                     //deactivate the icons
              //                     $(this).siblings().find('.' + module.control.css_attr.display_alert_btn).toggleClass('active' , false );
              //                   }
              //             } );
              //       }
              // });
              return this;
      },


      //fired when module.isReady.done
      _makeItemsSortable : function(obj) {
              if ( wp.media.isTouchDevice || ! $.fn.sortable )
                return;
              var module = this;
              $( '.' + module.control.css_attr.items_wrapper, module.container ).sortable( {
                    handle: '.' + module.control.css_attr.item_sort_handle,
                    start: function() {
                          //close the module panel if needed
                          if ( _.has(api, 'czrModulePanelState' ) )
                            api.czrModulePanelState.set(false);
                          //close the sektion settings panel if needed
                          if ( _.has(api, 'czrSekSettingsPanelState' ) )
                            api.czrSekSettingsPanelState.set(false);
                    },
                    update: function( event, ui ) {
                          var _sortedCollectionReact = function() {
                                if ( _.has(module, 'preItem') ) {
                                      module.preItemExpanded.set(false);
                                }

                                module.closeAllItems().closeRemoveDialogs();
                                var refreshPreview = function() {
                                      api.previewer.refresh();
                                };
                                //refreshes the preview frame  :
                                //1) only needed if transport is postMessage, because is triggered by wp otherwise
                                //2) only needed when : add, remove, sort item(s).
                                //var isItemUpdate = ( _.size(from) == _.size(to) ) && ! _.isEmpty( _.difference(from, to) );
                                if ( 'postMessage' == api(module.control.id).transport  && ! api.CZR_Helpers.hasPartRefresh( module.control.id ) ) {
                                      refreshPreview = _.debounce( refreshPreview, 500 );//500ms are enough
                                      refreshPreview();
                                }

                                module.trigger( 'item-collection-sorted' );
                          };
                          module._getSortedDOMItemCollection()
                                .done( function( _collection_ ) {
                                      module.itemCollection.set( _collection_ );
                                })
                                .then( function() {
                                      _sortedCollectionReact();
                                });
                          //refreshes the preview frame, only if the associated setting is a postMessage transport one, with no partial refresh
                          // if ( 'postMessage' == api( module.control.id ).transport && ! api.CZR_Helpers.hasPartRefresh( module.control.id ) ) {
                          //         _.delay( function() { api.previewer.refresh(); }, 100 );
                          // }
                    }//update
                  }
              );
        },



      /*-----------------------------------------------
      * TABS NAVIGATION IN ITEMS AND MODOPT
      ------------------------------------------------*/
      //This method is fired on tab click
      //the @args is the classical DOM listener obj {model : model, dom_el : $_view_el, event : _event, dom_event : e ,refreshed : _refreshed }
      // IMPORTANT : the this is the item or the modopt instance. NOT the module.
      // =>This method has been added to the module constructor to avoid repeating the code in two places because it is used both in items and modOpts
      // @return void()
      toggleTabVisibility : function( args ) {
            var inputParent = this,
                tabs = $( inputParent.container ).find('li'),
                content_items = $( inputParent.container ).find('section'),
                tabIdSwitchedTo = $( args.dom_event.currentTarget, args.dom_el ).attr('data-tab-id');

            $( '.tabs nav li', inputParent.container ).each( function() {
                  $(this).removeClass('tab-current').addClass('tab-inactive');
            });
            $( inputParent.container ).find('li[data-tab-id="' + tabIdSwitchedTo + '"]').addClass('tab-current').removeClass('tab-inactive');

            $( 'section', inputParent.container ).each( function() {
                    $(this).removeClass('content-current');
            });
            $( inputParent.container ).find('section[id="' + tabIdSwitchedTo + '"]').addClass('content-current');
      },

      // @return void()
      // the inputParent.container (item or modOpt) is now available ar this stage
      //  Setup the tabs navigation
      //=> Make sure the first tab is the current visible one
      setupTabNav : function() {
            var inputParent = this,
                preProcessTabs = function() {
                      var dfd = $.Deferred(),
                          $tabs = $( '.tabs nav li', inputParent.container );

                      $tabs.each( function() {
                            $(this).removeClass('tab-current').addClass('tab-inactive');
                      });
                      $tabs.first().addClass( 'tab-current' ).removeClass('tab-inactive');
                      $( 'section', inputParent.container ).first().addClass( 'content-current' );
                      //set the layout class based on the number of tabs
                      var _nb = $tabs.length;
                      $tabs.each( function() {
                            $(this).addClass( _nb > 0 ? 'cols-' + _nb : '' );
                      });
                      return dfd.resolve().promise();
                };
            setTimeout(
                  function() {
                        preProcessTabs().done( function() {
                              $('.tabs', inputParent.container ).fadeIn( 450 );
                        });
                  },
                  20//<= introducing a small delay to let jQuery do its preprocessing job
            );
      }
});//$.extend
})( wp.customize , jQuery, _ );