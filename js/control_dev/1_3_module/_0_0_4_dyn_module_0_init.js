//MULTI CONTROL CLASS
//extends api.CZRModule
//
//Setup the collection of items
//renders the module view
//Listen to items collection changes and update the control setting

var CZRDynModuleMths = CZRDynModuleMths || {};

$.extend( CZRDynModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          api.CZRModule.prototype.initialize.call( module, id, options );

          //extend the module with new template Selectors
          $.extend( module, {
              itemPreAddEl : ''//is specific for each crud module
          } );

          //EXTENDS THE DEFAULT MONO MODEL CONSTRUCTOR WITH NEW METHODS
          //=> like remove item
          //=> like remove item
          //module.itemConstructor = api.CZRItem.extend( module.CZRItemDynamicMths || {} );

          //default success message when item added
          module.itemAddedMessage = serverControlParams.translatedStrings.successMessage;

          ////////////////////////////////////////////////////
          /// MODULE DOM EVENT MAP
          ////////////////////////////////////////////////////
          module.userEventMap = new api.Value( [
                //pre add new item : open the dialog box
                {
                    trigger   : 'click keydown',
                    selector  : [ '.' + module.control.css_attr.open_pre_add_btn, '.' + module.control.css_attr.cancel_pre_add_btn ].join(','),
                    name      : 'pre_add_item',
                    actions   : [ 'closeAllItems', 'closeRemoveDialogs', 'renderPreItemView','setPreItemViewVisibility' ],
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

          //PRE MODEL VALUE
          module.preItem = new api.Value( module.getDefaultItemModel() );

          //PRE MODEL EMBED PROMISE
          module.preItemEmbedded = $.Deferred();//was module.czr_preItem.create('item_content');
          //Add view rendered listeners
          module.preItemEmbedded.done( function() {
                module.setupPreItemInputCollection();
          });

          //PRE MODEL VIEW STATE
          module.preItemExpanded = new api.Value(false);
          //add state listeners
          module.preItemExpanded.callbacks.add( function( to, from ) {
                module._togglePreItemViewExpansion( to );
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
                      module.preItem.czr_Input(_id).ready();
                });//each
  },



  //Fired on user Dom action.
  //the item is manually added.
  addItem : function(obj) {
          var module = this,
              item = module.preItem(),
              collapsePreItem = function() {
                    module.preItemExpanded.set(false);
                    module._resetPreItemInputs();
                    module.toggleSuccessMessage('off');
              };

          if ( _.isEmpty(item) || ! _.isObject(item) ) {
            throw new Error('addItem : an item should be an object and not empty. In : ' + module.id +'. Aborted.' );
          }
          //display a sucess message if item is successfully instantiated
          collapsePreItem = _.debounce( collapsePreItem, 2000 );

          //instantiates and fires ready
          module.instantiateItem( item, true ).ready(); //true == Added by user

          module.czr_Item( item.id ).isReady.then( function() {
                module.toggleSuccessMessage('on');
                collapsePreItem();

                module.trigger('item_added', item );
                //module.doActions( 'item_added_by_user' , module.container, { item : item , dom_event : obj.dom_event } );

                //refresh the preview frame (only needed if transport is postMessage )
                //must be a dom event not triggered
                //otherwise we are in the init collection case where the item are fetched and added from the setting in initialize
                if ( 'postMessage' == api(module.control.id).transport && _.has( obj, 'dom_event') && ! _.has( obj.dom_event, 'isTrigger' ) && ! api.CZR_Helpers.hasPartRefresh( module.control.id ) ) {
                  module.control.previewer.refresh();
                }
          });



  },

  _resetPreItemInputs : function() {
          var module = this;
          module.preItem.set( module.getDefaultItemModel() );
          module.preItem.czr_Input.each( function( input_instance ) {
                var _input_id = input_instance.id;
                //do we have a default value ?
                if ( ! _.has( module.getDefaultItemModel(), _input_id ) )
                  return;
                input_instance.set( module.getDefaultItemModel()._input_id );
          });
  }

});//$.extend