//MULTI CONTROL CLASS
//extends api.Value
//
//Setup the collection of items
//renders the control view
//Listen to items collection changes and update the control setting
//MODULE OPTIONS :
  // control     : control,
  // crud        : bool
  // id          : '',
  // items       : [], module.items,
  // modOpt       : {}
  // module_type : module.module_type,
  // multi_item  : bool
  // section     : module.section,
  // is_added_by_user : is_added_by_user || false
var CZRModuleMths = CZRModuleMths || {};

$.extend( CZRModuleMths, {

  initialize: function( id, constructorOptions ) {
        if ( _.isUndefined(constructorOptions.control) || _.isEmpty(constructorOptions.control) ) {
            throw new Error('No control assigned to module ' + id );
        }
        var module = this;
        api.Value.prototype.initialize.call( this, null, constructorOptions );

        //store the state of ready.
        //=> we don't want the ready method to be fired several times
        module.isReady = $.Deferred();

        //write the options as properties
        $.extend( module, constructorOptions || {} );

        //extend the module with new template Selectors
        $.extend( module, {
              crudModulePart : 'czr-crud-module-part',//create, read, update, delete
              rudItemPart : 'czr-rud-item-part',//read, update, delete
              ruItemPart : 'czr-ru-item-part',//read, update
              itemInputList : '',//is specific for each crud module
              modOptInputList : '',//is specific for each module
              AlertPart : 'czr-rud-item-alert-part',//used both for items and modules removal

        } );

        //embed : define a container, store the embed state, fire the render method
        module.embedded = $.Deferred();
        //if a module is embedded in a control, its container == the control container.
        //if the module is part of a sektion, its container will be set and resolve() later ( @see multi_module part )
        if ( ! module.isInSektion() ) {
              module.container = $( module.control.selector );
              module.embedded.resolve();
        }

        //render the item(s) wrapper
        module.embedded.done( function() {
              $.when( module.renderModuleParts() ).done(function( $_module_items_wrapper ){
                    if ( false === $_module_items_wrapper.length ) {
                        throw new Error( 'The items wrapper has not been rendered for module : ' + module.id );
                    }
                    //stores the items wrapper ( </ul> el ) as a jQuery var
                    module.itemsWrapper = $_module_items_wrapper;
              });
        });

        /*-----------------------------------------------
        //MODULE OPTIONS
        ------------------------------------------------*/
        //declares a default Mod options API model
        module.defaultAPImodOptModel = {
              initial_modOpt_model : {},
              defaultModOptModel : {},
              control : {},//control instance
              module : {}//module instance
        };

        //declares a default modOpt model
        module.defaultModOptModel = {};

        //define a default Constructors
        module.modOptConstructor = api.CZRModOpt;

        /*-----------------------------------------------
        //ITEMS
        ------------------------------------------------*/
        module.itemCollection = new api.Value( [] );

        //declares a default Item API model
        module.defaultAPIitemModel = {
              id : '',
              initial_item_model : {},
              defaultItemModel : {},
              control : {},//control instance
              module : {},//module instance
              is_added_by_user : false
        };

        //declares a default item model
        module.defaultItemModel = { id : '', title : '' };

        //define a default Constructors
        module.itemConstructor = api.CZRItem;
        //czr_model stores the each model value => one value by created by model.id
        module.czr_Item = new api.Values();


        /*-----------------------------------------------
        //SET THE DEFAULT INPUT CONSTRUCTOR AND INPUT OPTIONS
        ------------------------------------------------*/
        module.inputConstructor = api.CZRInput;//constructor for the items input
        if ( module.hasModOpt() ) {
              module.inputModOptConstructor = api.CZRInput;//constructor for the modOpt input
        }
        module.inputOptions = {};//<= can be set by each module specifically
        //For example, if I need specific options for the content_picker, this is where I will set them in the module extended object


        /*-----------------------------------------------
        //FIRE ON isReady
        ------------------------------------------------*/
        //module.ready(); => fired by children
        module.isReady.done( function() {
              //store the module dirtyness, => no items set
              module.isDirty = new api.Value( constructorOptions.dirty || false );

              //initialize the module api.Value()
              //constructorOptions has the same structure as the one described in prepareModuleforAPI
              //setting the module Value won't be listen to at this stage
              module.initializeModuleModel( constructorOptions )
                    .done( function( initialModuleValue ) {
                          module.set( initialModuleValue );
                    })
                    .fail( function( response ){ api.consoleLog( 'Module : ' + module.id + ' initialize module model failed : ', response ); })
                    .always( function( initialModuleValue ) {
                          //listen to each single module change
                          module.callbacks.add( function() { return module.moduleReact.apply( module, arguments ); } );

                          //if the module is not registered yet (for example when the module is added by user),
                          //=> push it to the collection of the module-collection control
                          //=> updates the wp api setting
                          if (  ! module.control.isModuleRegistered( module.id ) ) {
                              module.control.updateModulesCollection( { module : constructorOptions, is_registered : false } );
                          }

                          module.bind('items-collection-populated', function( collection ) {
                                //listen to item Collection changes
                                module.itemCollection.callbacks.add( function() { return module.itemCollectionReact.apply(module, arguments ); } );

                                //it can be overridden by a module in its initialize method
                                if ( module.isMultiItem() ) {
                                      module._makeItemsSortable();
                                }
                                //api.consoleLog('SAVED ITEM COLLECTION OF MODULE ' + module.id + ' IS READY');
                          });

                          //populate and instantiate the items now when a module is embedded in a regular control
                          //if in a sektion, the populateSavedItemCollection() will be fired on module edit
                          if ( ! module.isInSektion() )
                            module.populateSavedItemCollection();

                          //When the module has modOpt :
                          //=> Instantiate the modOpt and setup listener
                          if ( module.hasModOpt() ) {
                              module.instantiateModOpt();
                          }
                    });
        });//module.isReady.done()
  },




  //////////////////////////////////
  ///READY
  //////////////////////////////////
  //When the control is embedded on the page, this method is fired in api.CZRBaseModuleControl:ready()
  //=> right after the module is instantiated.
  //If the module is a dynamic one (CRUD like), then this method is invoked by the child class
  ready : function() {
        var module = this;
        module.isReady.resolve();
        api.consoleLog('MODULE READY IN BASE MODULE CLASS : ', module.id );
  },



  //fired when module is initialized, on module.isReady.done()
  //designed to be extended or overridden to add specific items or properties
  initializeModuleModel : function( constructorOptions ) {
        var module = this, dfd = $.Deferred();
        if ( ! module.isMultiItem() && ! module.isCrud() ) {
              //this is a static module. We only have one item
              //init module item if needed.
              if ( _.isEmpty( constructorOptions.items ) ) {
                    var def = _.clone( module.defaultItemModel );
                    constructorOptions.items = [ $.extend( def, { id : module.id } ) ];
              }
        }
        return dfd.resolve( constructorOptions ).promise();
  },



  //cb of : module.itemCollection.callbacks
  itemCollectionReact : function( to, from, o ) {
        var module = this,
            _current_model = module(),
            _new_model = $.extend( true, {}, _current_model );
        _new_model.items = to;
        //update the dirtyness state
        module.isDirty.set(true);
        //set the the new items model
        module.set( _new_model, o || {} );
  },


  //cb of module.callbacks
  moduleReact : function( to, from, o ) {
        //cb of : module.callbacks
        var module            = this,
            control           = module.control,
            isItemUpdate    = ( _.size(from.items) == _.size(to.items) ) && ! _.isEmpty( _.difference(to.items, from.items) ),
            isColumnUpdate  = to.column_id != from.column_id,
            refreshPreview    = function() {
                  module.control.previewer.refresh();
            };

        //update the collection + pass data
        control.updateModulesCollection( {
              module : $.extend( true, {}, to ),
              data : o//useful to pass contextual info when a change happens
        } );

        // //Always update the view title
        // module.writeViewTitle(to);

        // //@todo : do we need that ?
        // //send module to the preview. On update only, not on creation.
        // if ( ! _.isEmpty(from) || ! _.isUndefined(from) ) {
        //   module._sendModule(to, from);
        // }
  },

  //@todo : create a smart helper to get either the wp api section or the czr api sektion, depending on the module context
  getModuleSection : function() {
        return this.section;
  },

  //@return bool
  isInSektion : function() {
        var module = this;
        return _.has( module, 'sektion_id' );
  },

  //is this module multi item ?
  //@return bool
  isMultiItem : function() {
        return api.CZR_Helpers.isMultiItemModule( null, this );
  },

  //is this module crud ?
  //@return bool
  isCrud : function() {
        return api.CZR_Helpers.isCrudModule( null, this );
  },

  hasModOpt : function() {
        return api.CZR_Helpers.hasModuleModOpt( null, this );
  },


  //////////////////////////////////
  ///PREPARE AND INSTANTIATE MODULE OPTION
  //////////////////////////////////
  //fired when module isReady
  instantiateModOpt : function() {
        var module = this;
        //Prepare the modOpt and instantiate it
        var modOpt_candidate = module.prepareModOptForAPI( module().modOpt || {} );
        module.czr_ModOpt = new module.modOptConstructor( modOpt_candidate );
        module.czr_ModOpt.ready();
        //update the module model on modOpt change
        module.czr_ModOpt.callbacks.add( function( to, from, data ) {
              var _current_model = module(),
                  _new_model = $.extend( true, {}, _current_model );
              _new_model.modOpt = to;
              //update the dirtyness state
              module.isDirty(true);
              //set the the new items model
              module( _new_model, data );
        });
  },

  //@return an API ready modOpt object with the following properties
  // initial_modOpt_model : {},
  // defaultModOptModel : {},
  // control : {},//control instance
  // module : {},//module instance
  //@param modOpt_candidate is an object. Can contain the saved modOpt properties on init.
  prepareModOptForAPI : function( modOpt_candidate ) {
        var module = this,
            api_ready_modOpt = {};
        // if ( ! _.isObject( modOpt_candidate ) ) {
        //       throw new Error('preparemodOptForAPI : a modOpt must be an object to be instantiated.');
        // }
        modOpt_candidate = _.isObject( modOpt_candidate ) ? modOpt_candidate : {};

        _.each( module.defaultAPImodOptModel, function( _value, _key ) {
              var _candidate_val = modOpt_candidate[_key];
              switch( _key ) {
                    case 'initial_modOpt_model' :
                        //make sure that the provided modOpt has all the default properties set
                        _.each( module.getDefaultModOptModel() , function( _value, _property ) {
                              if ( ! _.has( modOpt_candidate, _property) )
                                 modOpt_candidate[_property] = _value;
                        });
                        api_ready_modOpt[_key] = modOpt_candidate;

                    break;
                    case  'defaultModOptModel' :
                        api_ready_modOpt[_key] = _.clone( module.defaultModOptModel );
                    break;
                    case  'control' :
                        api_ready_modOpt[_key] = module.control;
                    break;
                    case  'module' :
                        api_ready_modOpt[_key] = module;
                    break;
              }//switch
        });
        return api_ready_modOpt;
  },

  //Returns the default modOpt defined in initialize
  //Each chid class can override the default item and the following method
  getDefaultModOptModel : function( id ) {
          var module = this;
          return $.extend( _.clone( module.defaultModOptModel ), { is_mod_opt : true } );
  }
});//$.extend//CZRBaseControlMths