//MULTI CONTROL CLASS
//extends api.CZRModule
//
//Setup the collection of items
//renders the module view
//Listen to items collection changes and update the control setting

var CZRDynModuleMths = CZRDynModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRDynModuleMths, {
      initialize: function( id, options ) {
              var module = this;
              api.CZRModule.prototype.initialize.call( module, id, options );

              //extend the module with new template Selectors
              $.extend( module, {
                  itemPreAddEl : ''//is specific for each crud module
              } );

              module.preItemsWrapper = '';//will store the pre items wrapper

              //PRE MODEL VIEW STATE
              // => will control the rendering / destruction of the DOM view
              // => the instantiation / destruction of the input Value collection
              module.preItemExpanded = new api.Value( false );

              //EXTENDS THE DEFAULT MONO MODEL CONSTRUCTOR WITH NEW METHODS
              //=> like remove item
              //module.itemConstructor = api.CZRItem.extend( module.CZRItemDynamicMths || {} );

              //default success message when item added
              module.itemAddedMessage = serverControlParams.i18n.successMessage;

              ////////////////////////////////////////////////////
              /// MODULE DOM EVENT MAP
              ////////////////////////////////////////////////////
              module.userEventMap = new api.Value( [
                    //pre add new item : open the dialog box
                    {
                          trigger   : 'click keydown',
                          selector  : [ '.' + module.control.css_attr.open_pre_add_btn, '.' + module.control.css_attr.cancel_pre_add_btn ].join(','),
                          name      : 'pre_add_item',
                          actions   : [
                                'closeAllItems',
                                'closeRemoveDialogs',
                                // toggles the visibility of the Remove View Block
                                // => will render or destroy the pre item view
                                // @param : obj = { event : {}, item : {}, view : ${} }
                                function(obj) {
                                      var module = this;
                                      module.preItemExpanded.set( ! module.preItemExpanded() );
                                },
                          ],
                    },
                    //add new item
                    {
                          trigger   : 'click keydown',
                          selector  : '.' + module.control.css_attr.add_new_btn, //'.czr-add-new',
                          name      : 'add_item',
                          actions   : [ 'closeRemoveDialogs', 'closeAllItems', 'addItem' ],
                    }
              ]);//module.userEventMap
      },



      //When the control is embedded on the page, this method is fired in api.CZRBaseModuleControl:ready()
      //=> right after the module is instantiated.
      ready : function() {
              var module = this;
              //Setup the module event listeners
              module.setupDOMListeners( module.userEventMap() , { dom_el : module.container } );

              // Pre Item Value => used to store the preItem model
              module.preItem = new api.Value( module.getDefaultItemModel() );

              // Action on pre Item expansion / collapsing
              module.preItemExpanded.callbacks.add( function( isExpanded ) {
                    if ( isExpanded ) {
                          module.renderPreItemView()
                                .done( function( $preWrapper ) {
                                      module.preItemsWrapper = $preWrapper;
                                      //Re-initialize the pre item model
                                      module.preItem( module.getDefaultItemModel() );

                                      module.trigger( 'before-pre-item-input-collection-setup' );
                                      // Setup the pre item input collection from dom
                                      module.setupPreItemInputCollection();

                                })
                                .fail( function( message ) {
                                      api.errorLog( 'Pre-Item : ' + message );
                                });
                    } else {
                          $.when( module.preItemsWrapper.remove() ).done( function() {
                                module.preItem.czr_Input = {};
                                module.preItemsWrapper = null;
                                module.trigger( 'pre-item-input-collection-destroyed' );
                          });
                    }

                    // Expand / Collapse
                    module._togglePreItemViewExpansion( isExpanded );
              });

              api.CZRModule.prototype.ready.call( module );//fires the parent
      },//ready()


      //PRE MODEL INPUTS
      //fired when preItem is embedded.done()
      setupPreItemInputCollection : function() {
              var module = this;

              //Pre item input collection
              module.preItem.czr_Input = new api.Values();

              //creates the inputs based on the rendered items
              $('.' + module.control.css_attr.pre_add_wrapper, module.container)
                    .find( '.' + module.control.css_attr.sub_set_wrapper)
                    .each( function( _index ) {
                          var _id = $(this).find('[data-type]').attr('data-type') || 'sub_set_' + _index;
                          //instantiate the input
                          module.preItem.czr_Input.add( _id, new module.inputConstructor( _id, {//api.CZRInput;
                                id : _id,
                                type : $(this).attr('data-input-type'),
                                container : $(this),
                                input_parent : module.preItem,
                                module : module,
                                is_preItemInput : true
                          } ) );

                          //fire ready once the input Value() instance is initialized
                          module.preItem.czr_Input( _id ).ready();
                    });//each

              module.trigger( 'pre-item-input-collection-ready' );
      },



      //Fired on user Dom action.
      //the item is manually added.
      //@return a promise() for future sequential actions
      addItem : function(obj) {
              var module = this,
                  item = module.preItem(),
                  collapsePreItem = function() {
                        module.preItemExpanded.set( false );
                        //module.toggleSuccessMessage('off');
                  },
                  dfd = $.Deferred();

              if ( _.isEmpty(item) || ! _.isObject(item) ) {
                    api.errorLog( 'addItem : an item should be an object and not empty. In : ' + module.id +'. Aborted.' );
                    return dfd.resolve().promise();
              }
              //display a sucess message if item is successfully instantiated
              collapsePreItem = _.debounce( collapsePreItem, 200 );

              //instantiates and fires ready
              module.instantiateItem( item, true ).ready(); //true == Added by user

              //this iife job is to close the pre item and to maybe refresh the preview
              //@return a promise(), then once done the item view is expanded to start editing it
              ( function() {
                    return $.Deferred( function() {
                          var _dfd_ = this;
                          module.czr_Item( item.id ).isReady.then( function() {
                                //module.toggleSuccessMessage('on');
                                collapsePreItem();

                                module.trigger('item-added', item );
                                //module.doActions( 'item_added_by_user' , module.container, { item : item , dom_event : obj.dom_event } );

                                //refresh the preview frame (only needed if transport is postMessage )
                                //must be a dom event not triggered
                                //otherwise we are in the init collection case where the item are fetched and added from the setting in initialize
                                if ( 'postMessage' == api(module.control.id).transport && _.has( obj, 'dom_event') && ! _.has( obj.dom_event, 'isTrigger' ) && ! api.CZR_Helpers.hasPartRefresh( module.control.id ) ) {
                                  api.previewer.refresh().done( function() {
                                        _dfd_.resolve();
                                  });
                                } else {
                                        _dfd_.resolve();
                                }
                          });
                    }).promise();
              })().done( function() {
                      module.czr_Item( item.id ).viewState( 'expanded' );
              }).always( function() {
                      dfd.resolve();
              });
              return dfd.promise();
      }
});//$.extend
})( wp.customize , jQuery, _ );