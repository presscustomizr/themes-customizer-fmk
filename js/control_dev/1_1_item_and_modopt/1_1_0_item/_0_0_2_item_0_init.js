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
        item.container = null;//will store the item $ dom element
        item.contentContainer = null;//will store the item content $ dom element
        item.inputCollection = new api.Value({});

        //input.options = options;
        //write the options as properties, name is included
        $.extend( item, options || {} );

        //declares a default model
        item.defaultItemModel = _.clone( options.defaultItemModel ) || { id : '', title : '' };

        //set initial values
        var _initial_model = $.extend( item.defaultItemModel, options.initial_item_model );

        //this won't be listened to at this stage
        item.set( _initial_model );

        //USER EVENT MAP
        item.userEventMap = new api.Value( [
              //toggles remove view alert
              {
                trigger   : 'click keydown',
                selector  : [ '.' + item.module.control.css_attr.display_alert_btn, '.' + item.module.control.css_attr.cancel_alert_btn ].join(','),
                name      : 'toggle_remove_alert',
                actions   : ['toggleRemoveAlertVisibility']
              },
              //removes item and destroys its view
              {
                trigger   : 'click keydown',
                selector  : '.' + item.module.control.css_attr.remove_view_btn,
                name      : 'remove_item',
                actions   : ['removeItem']
              },
              //edit view
              {
                trigger   : 'click keydown',
                selector  : [ '.' + item.module.control.css_attr.edit_view_btn, '.' + item.module.control.css_attr.item_title ].join(','),
                name      : 'edit_view',
                actions   : [ 'setViewVisibility' ]
              }
        ]);




        //ITEM IS READY
        //1) push it to the module item collection
        //2) observe its changes
        item.isReady.done( function() {
              //push it to the collection
              item.module.updateItemsCollection( { item : item() } );
              //listen to each single item change
              item.callbacks.add( function() { return item.itemReact.apply(item, arguments ); } );

              //When shall we render the item ?
              //If the module is part of a simple control, the item can be render now,
              //If the module is part of a sektion, then the item will be rendered on module edit.
              // if ( ! item.module.isInSektion() ) {
              //       item.mayBeRenderItemWrapper();
              // }
              item.mayBeRenderItemWrapper();

              //ITEM WRAPPER VIEW SETUP
              //defer actions on item view embedded
              item.embedded.done( function() {
                    //define the item view DOM event map
                    //bind actions when the item is embedded : item title, etc.
                    item.itemWrapperViewSetup( _initial_model );
              });


              //INPUTS SETUP
              //=> when the item content has been rendered. Typically on item expansion for a multi-items module.
              item.bind( 'contentRendered', function() {
                    //create the collection of inputs if needed
                    //first time or after a removal
                    if ( ! _.has( item, 'czr_Input' ) || _.isEmpty( item.inputCollection() ) ) {
                          try { api.CZR_Helpers.setupInputCollectionFromDOM.call( item ); } catch(e) {
                                api.consoleLog( e );
                          }
                    }
              });

              //INPUTS DESTROY
              item.bind( 'contentRemoved', function() {
                    if ( _.has(item, 'czr_Input') )
                      api.CZR_Helpers.removeInputCollection.call( item );
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



  //React to a single item change
  //cb of module.czr_Item( item.id ).callbacks
  //the data can typically hold informations passed by the input that has been changed and its specific preview transport (can be PostMessage )
  //data looks like :
  //{
  //  module : {}
  //  input_changed     : string input.id
  //  input_transport   : 'postMessage' or '',
  //  not_preview_sent  : bool
  //}
  itemReact : function( to, from, data ) {
        var item = this,
            module = item.module;

        data = data || {};

        //update the collection
        module.updateItemsCollection( { item : to, data : data } ).done( function() {
              //Always update the view title when the item collection has been updated
              item.writeItemViewTitle( to, data );
        });

        //send item to the preview. On update only, not on creation.
        // if ( ! _.isEmpty(from) || ! _.isUndefined(from) ) {
        //       api.consoleLog('DO WE REALLY NEED TO SEND THIS TO THE PREVIEW WITH _sendItem(to, from) ?');
        //       item._sendItem(to, from);
        // }
  },


});//$.extend