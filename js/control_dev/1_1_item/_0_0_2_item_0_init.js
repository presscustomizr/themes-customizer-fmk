//extends api.Value
//options:
  // id : item.id,
  // initial_item_model : item,
  // defaultItemModel : module.defaultItemModel,
  // module : module,
  // is_added_by_user : is_added_by_user || false
var CZRItemMths = CZRItemMths || {};
$.extend( CZRItemMths , {
  initialize: function( id, options ) {
        if ( _.isUndefined(options.module) || _.isEmpty(options.module) ) {
          throw new Error('No module assigned to item ' + id + '. Aborting');
        }

        var item = this;
        api.Value.prototype.initialize.call( item, null, options );

        //DEFERRED STATES
        //store the state of ready.
        //=> we don't want the ready method to be fired several times
        item.isReady = $.Deferred();
        //will store the embedded and content rendered state
        item.embedded = $.Deferred();
        item.contentRendered = $.Deferred();

        //input.options = options;
        //write the options as properties, name is included
        $.extend( item, options || {} );

        //declares a default model
        item.defaultItemModel = _.clone( options.defaultItemModel ) || { id : '', title : '' };

        //set initial values
        var _initial_model = $.extend( item.defaultItemModel, options.initial_item_model );
        //this won't be listened to at this stage
        item.set( _initial_model );



        //ITEM IS READY
        //1) push it to the module item collection
        //2) observe its changes
        item.isReady.done( function() {
              //push it to the collection
              item.module.updateItemsCollection( { item : item.module.getInitialItemModel( item.get() ) } );
              //listen to each single item change
              item.callbacks.add( function() { return item.itemReact.apply(item, arguments ); } );

              //When shall we render the item ?
              //If the module is part of a simple control, the item can be render now,
              //If the module is part of a sektion, then the item will be rendered on module edit.
              if ( ! item.module.isInSektion() ) {
                    item.mayBeRenderItemWrapper();
              }

              //ITEM WRAPPER VIEW SETUP
              //defer actions on item view embedded
              item.embedded.done( function() {
                    //define the item view DOM event map
                    //bind actions when the item is embedded : item title, etc.
                    item.itemWrapperViewSetup( _initial_model );
              });


              //INPUTS SETUP
              //=> when the item content has been rendered. Typically on item expansion for a multi-items module.
              item.contentRendered.done( function() {
                    //create the collection of inputs if needed
                    if ( ! _.has(item, 'czr_Input') )
                      item.setupInputCollectionFromDOM();
              });

        });//item.isReady.done()

        //if an item is manually added : open it
        // if ( item.is_added_by_user ) {
        //   item.setViewVisibility( {}, true );//empty obj because this method can be fired by the dom chain actions, always passing an object. true for added_by_user
        // }
        //item.setViewVisibility( {}, item.is_added_by_user );

  },//initialize

  //overridable method
  //Fired if the item has been instantiated
  //The item.callbacks are declared.
  ready : function() {
        this.isReady.resolve();
  },


  //fired on initialize for items in module embedded in a regular control
  //fired when user edit module for items in modules embedded in a sektion
  mayBeRenderItemWrapper : function() {
        var item = this;

        if ( 'pending' == item.embedded.state() )
            item.container = item.renderItemWrapper();
        if ( _.isUndefined(item.container) || ! item.container.length ) {
            throw new Error( 'In itemWrapperViewSetup the Item view has not been rendered : ' + item.id );
        } else {
            //say it
            item.embedded.resolve();
        }
  },


  //define the item view DOM event map
  //bind actions when the item is embedded
  itemWrapperViewSetup : function( item_model ) {
          var item = this,
              module = this.module;

          item_model = item.get() || item.initial_item_model;//could not be set yet

          //czr_ItemState stores the current expansion status of a given view => one value by created by item.id
          //czr_ItemState can take 3 values : expanded, expanded_noscroll (=> used on view creation), closed
          item.czr_ItemState = new api.Value();
          //set initial state
          item.czr_ItemState.set('closed');


          item.view_event_map = [
                  //toggles remove view alert
                  {
                    trigger   : 'click keydown',
                    selector  : [ '.' + module.control.css_attr.display_alert_btn, '.' + module.control.css_attr.cancel_alert_btn ].join(','),
                    name      : 'toggle_remove_alert',
                    actions   : ['toggleRemoveAlertVisibility']
                  },
                  //removes item and destroys its view
                  {
                    trigger   : 'click keydown',
                    selector  : '.' + module.control.css_attr.remove_view_btn,
                    name      : 'remove_item',
                    actions   : ['removeItem']
                  },
                  //edit view
                  {
                    trigger   : 'click keydown',
                    selector  : [ '.' + module.control.css_attr.edit_view_btn, '.' + module.control.css_attr.item_title ].join(','),
                    name      : 'edit_view',
                    actions   : ['setViewVisibility']
                  }
          ];


          //always write the title
          item.writeItemViewTitle();

          //react to the item state changes
          item.czr_ItemState.callbacks.add( function( to, from ) {
              //toggle on view state change
              item.toggleItemExpansion.apply(item, arguments );
          });


          //When do we render the item content ?
          //If this is a multi-item module, let's render each item content when they are expanded.
          //In the case of a single item module, we can render the item content now.
          var _updateItemContentDeferred = function( $_content) {
                //update the $.Deferred state
                if ( ! _.isUndefined( $_content ) && false !== $_content.length )
                    item.contentRendered.resolve();
                else {
                    throw new Error( 'Module : ' + item.module.id + ', the item content has not been rendered for ' + item.id );
                }
          };

          if ( item.module.isMultiItem() ) {
                item.czr_ItemState.callbacks.add( function( to, from ) {
                      //renderview content if needed on first expansion
                      if ( 'resolved' == item.contentRendered.state() )
                        return;

                      $.when( item.renderItemContent( item_model ) ).done( function( $_item_content ) {
                            _updateItemContentDeferred( $_item_content );
                      });
                });
          } else {
                //renderview content now for a single item module
                $.when( item.renderItemContent( item_model ) ).done( function( $_item_content ) {
                      _updateItemContentDeferred( $_item_content );
                      item.czr_ItemState.set('expanded');
                });
          }

          //DOM listeners for the user action in item view wrapper
          api.CZR_Helpers.setupDOMListeners(
                item.view_event_map,//actions to execute
                { model:item_model, dom_el:item.container },//model + dom scope
                item //instance where to look for the cb methods
          );
  },



  //React to a single item change
  //cb of module.czr_Item(item.id).callbacks
  itemReact : function( to, from ) {
        var item = this,
            module = item.module;

        //update the collection
        module.updateItemsCollection( {item : to });

        //Always update the view title
        item.writeItemViewTitle(to);

        //send item to the preview. On update only, not on creation.
        if ( ! _.isEmpty(from) || ! _.isUndefined(from) ) {
          console.log('DO WE REALLY NEED TO SEND THIS TO THE PREVIEW WITH _sendItem(to, from) ?');
          item._sendItem(to, from);
        }
  },


});//$.extend