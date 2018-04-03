
//BASE CONTROL CLASS
//extends api.CZRBaseControl
//define a set of methods, mostly helpers, to extend the base WP control class
//this will become our base constructor for main complex controls
//EARLY SETUP
var CZRBaseModuleControlMths = CZRBaseModuleControlMths || {};
( function ( api, $, _ ) {
$.extend( CZRBaseModuleControlMths, {
      initialize: function( id, options ) {
              if ( ! api.has( id ) ) {
                    throw new Error( 'Missing a registered setting for control : ' + id );
              }
              var control = this;

              control.czr_Module = new api.Values();

              //czr_collection stores the module collection
              control.czr_moduleCollection = new api.Value();
              control.czr_moduleCollection.set([]);

              //let's store the state of the initial module collection
              control.moduleCollectionReady = $.Deferred();
              //and listen to changes when it's ready
              control.moduleCollectionReady.done( function( obj ) {
                    if ( ! control.isMultiModuleControl( options ) ) {
                      //api.consoleLog('MODULE COLLECTION READY IN CONTROL : ', control.id , obj.id, control.isModuleRegistered( obj.id ) );
                    }
                    //if the module is not registered yet for a single module control
                    //=> push it to the collection now, before listening to the module collection changes
                    // if (  ! control.isModuleRegistered( module.id ) ) {
                    //     control.updateModulesCollection( { module : constructorOptions } );
                    // }

                    //LISTEN TO MODULE COLLECTION
                    control.czr_moduleCollection.callbacks.add( function() { return control.moduleCollectionReact.apply( control, arguments ); } );

                    //control.removeModule( _mod );
              } );

              //FOR MULTI MODULE CONTROL : Stores the module instance of the synchronized sektion
              if ( control.isMultiModuleControl( options ) ) {
                    control.syncSektionModule = new api.Value();
              }

              api.CZRBaseControl.prototype.initialize.call( control, id, options );

              //FOR TEST PURPOSES
              // api(this.id).bind( function( to, from) {
              //     api.consoleLog( 'SETTING ', control.id, ' HAS CHANGED : ', to, from );
              // });

              //close any open item and dialog boxes on section expansion
              api.section( control.section() ).expanded.bind(function(to) {
                    control.czr_Module.each( function( _mod ){
                          _mod.closeAllItems().closeRemoveDialogs();
                          if ( _.has( _mod, 'preItem' ) ) {
                                _mod.preItemExpanded(false);
                          }
                    });
              });

      },




      //////////////////////////////////
      ///READY = CONTROL INSTANTIATED AND DOM ELEMENT EMBEDDED ON THE PAGE
      ///FIRED BEFORE API READY ? still true ?
      //
      // WP CORE => After the control is embedded on the page, invoke the "ready" method.
      // control.deferred.embedded.done( function () {
      //   control.linkElements(); // Link any additional elements after template is rendered by renderContent().
      //   control.setupNotifications();
      //   control.ready();
      // });
      //////////////////////////////////
      ready : function() {
              var control = this;
              if ( control.isMultiModuleControl() ) {
                    //POPULATE THE SAVED MODULE COLLECTION WHEN THE SYNCHRONIZED SEKTIONS SETTING HAS PROVIDED ITS INSTANCE
                    control.syncSektionModule.bind( function( sektion_module_instance, from) {
                          if ( 'resolved' == control.moduleCollectionReady.state() )
                            return;
                          control.registerModulesOnInit( sektion_module_instance );
                          //the module collection is ready
                          control.moduleCollectionReady.resolve();
                    });
              } else {
                    var single_module = {};
                    //inits the collection with the saved module => there's only one module to instantiate in this case.
                    //populates the collection with the saved module
                    _.each( control.getSavedModules() , function( _mod, _key ) {
                        //stores it
                        single_module = _mod;

                        //adds it to the collection
                        //=> it will be fired ready usually when the control section is expanded
                        if ( serverControlParams.isDevMode ) {
                              control.instantiateModule( _mod, {} );
                        } else {
                              try { control.instantiateModule( _mod, {} ); } catch( er ) {
                                    api.errorLog( 'Failed to instantiate module ' + _mod.id + ' ' + er );
                                    return;
                              }
                        }

                        //adds the module name to the control container element
                        control.container.attr('data-module', _mod.id );
                    });
                    //the module collection is ready
                    control.moduleCollectionReady.resolve( single_module );
              }


              //LISTEN TO MODULE CANDIDATES ADDED BY USERS
              control.bind( 'user-module-candidate', function( _module ) {
                    var module;
                    //instanciate + fire ready()
                    //=> the module will be added in the collection on isReady.done()
                    try {
                          module = control.instantiateModule( _module, {} ); //module, constructor
                    } catch( er ) {
                          api.errorLog( 'Failed to instantiate module ' + _module.id + ' ' + er );
                          return;
                    }
                    //If everything went fine, fires ready
                    module.ready( _module.is_added_by_user );
              });
      },









      //////////////////////////////////
      /// VARIOUS HELPERS
      //////////////////////////////////
      ///
      //@return the default API model {} needed to instantiate a module
      //Depending on the module context, control or sektion, the default model has to hold different properties
      getDefaultModuleApiModel : function() {
              //Modules share the common model either they are in a sektion or in a control
              var commonAPIModel = {
                    id : '',//module.id,
                    module_type : '',//module.module_type,
                    modOpt : {},//the module modOpt property, typically high level properties that area applied to all items of the module
                    items   : [],//$.extend( true, {}, module.items ),
                    crud : false,
                    multi_item : false,
                    sortable : false,//<= a module can be multi-item but not necessarily sortable
                    control : {},//control,
              };

              //if embedded in a control, amend the common model with the section id
              if ( ! this.isMultiModuleControl() ) {
                  return $.extend( commonAPIModel, {
                      section : ''//id of the control section
                  } );
              } else {
                  return $.extend( commonAPIModel, {
                      column_id : '',//a string like col_7
                      sektion : {},// => the sektion instance
                      sektion_id : '',
                      is_added_by_user : false,
                      dirty : false
                  } );
              }
      },

      //@return the default DB model {} that will be used when the setting will send the ajax save request
      //Depending on the module context, control or sektion, the default DB model has to hold different properties
      getDefaultModuleDBModel : function() {
              var commonDBModel = {
                    items   : [],//$.extend( true, {}, module.items ),
              };

              //if embedded in a sektion, we need more the item(s) collection
              if ( this.isMultiModuleControl() ) {
                  return $.extend( commonDBModel, {
                      id : '',
                      module_type : '',
                      column_id : '',
                      sektion_id : '',
                      dirty : false
                  } );
              } else {
                  return commonDBModel;
              }
      },


      //@return bool
      //@param options is optional.
      //Passed when first invoked in the constructor.
      //Once the control is instantiated, we can access the options from the instance
      isMultiModuleControl : function( options ) {
              var _type, control = this;
              //since WP v4.9, the control options are not wrapper in the params property but passed directly instead.
              if ( _.isUndefined( options ) ){
                  _type = _.has( control, 'params') ? control.params.type : control.type;
              } else {
                  _type = _.has( options, 'params') ? options.params.type : options.type;
              }
              return 'czr_multi_module' == _type;
      },


      //@return the control instance of the synchronized collection of modules
      getSyncCollectionControl : function() {
            var control = this;
            if ( _.isUndefined( control.params.syncCollection ) ) {
                throw new Error( 'Control ' + control.id + ' has no synchronized sektion control defined.');
            }
            return api.control( api.CZR_Helpers.build_setId( control.params.syncCollection ) );
      },


      //@return the collection [] of saved module(s) to instantiate
      //This method does not make sure that the module model is ready for API.
      //=> it just returns an array of saved module candidates to instantiate.
      //
      //Before instantiation, we will make sure that all required property are defined for the modules with the method control.prepareModuleForAPI()
      // control     : control,
      // crud        : bool
      // id          : '',
      // items       : [], module.items,
      // modOpt       : {}
      // module_type : module.module_type,
      // multi_item  : bool
      // section     : module.section,
      // is_added_by_user : is_added_by_user || false
      getSavedModules : function() {
              var control = this,
                  _savedModulesCandidates = [],
                  _module_type = control.params.module_type,
                  _raw_saved_module_val = [],
                  _saved_items = [],
                  _saved_modOpt = {};

              //In the case of multi module control synchronized with a sektion
              // => the saved modules is a collection saved in the setting
              //For a module embedded in a regular control, we need to hard code the single module collection
              // => in this case, the corresponding setting will store the collection of item(s)
              if ( control.isMultiModuleControl() ) {
                  _savedModulesCandidates = $.extend( true, [], api( control.id )() );//deep clone
              } else {
                  //What is the current server saved value for this setting?
                  //in a normal case, it should be an array of saved properties
                  //But it might not be if coming from a previous option system.
                  //=> let's normalize it.
                  //First let's perform a quick check on the current saved db val.
                  //If the module is not multi-item, the saved value should be an object or empty if not set yet
                  if ( api.CZR_Helpers.isMultiItemModule( _module_type ) && ! _.isEmpty( api( control.id )() ) && ! _.isObject( api( control.id )() ) ) {
                      api.consoleLog('Module Control Init for ' + control.id + '  : a mono item module control value should be an object if not empty.');
                  }

                  //SPLIT ITEMS [] and MODOPT {}
                  //In database, items and modOpt are saved in the same option array.
                  //If the module has modOpt ( the slider module for example ), the modOpt are described by an object which is always unshifted at the beginning of the setting value.

                  //the raw DB setting value is an array :  modOpt {} + the saved items :
                  ////META IS THE FIRST ARRAY ELEMENT: A modOpt has no unique id and has the property is_modOpt set to true
                  //[
                  //  is_mod_opt : true //<= inform us that this is not an item but a modOpt
                  //],
                  ////THEN COME THE ITEMS
                  //[
                  //  id : "czr_slide_module_0"
                  //     slide-background : 21,
                  //     ....
                  //   ],
                  //   [
                  // id : "czr_slide_module_1"
                  //     slide-background : 21,
                  //     ....
                  //   ]
                  //  [...]

                  //POPULATE THE ITEMS [] and the MODOPT {} FROM THE RAW DB SAVED SETTING VAL
                  var settingId = api.CZR_Helpers.getControlSettingId( control.id );
                  _raw_saved_module_val = _.isArray( api( settingId )() ) ? api( settingId )() : [ api( settingId )() ];

                  _.each( _raw_saved_module_val, function( item_or_mod_opt_candidate , key ) {
                        if ( api.CZR_Helpers.hasModuleModOpt( _module_type ) && 0*0 === key ) {
                              // a saved module mod_opt object should not have an id
                              if ( _.has( item_or_mod_opt_candidate, 'id') ) {
                                    api.consoleLog( 'getSavedModules : the module ' + _module_type + ' in control ' + control.id + ' has no mod_opt defined while it should.' );
                              } else {
                                    _saved_modOpt = item_or_mod_opt_candidate;
                              }
                        }
                        if ( _.has( item_or_mod_opt_candidate, 'id') && ! _.has( item_or_mod_opt_candidate, 'is_mod_opt' ) ) {
                              _saved_items.push( item_or_mod_opt_candidate );
                        }
                  });


                  //for now this is a collection with one module
                  _savedModulesCandidates.push(
                        {
                              id : api.CZR_Helpers.getOptionName( control.id ) + '_' + control.params.type,
                              module_type : control.params.module_type,
                              section : control.section(),
                              modOpt : $.extend( true, {} , _saved_modOpt ),//disconnect with a deep cloning
                              items : $.extend( true, [] , _saved_items )//disconnect with a deep cloning
                        }
                  );
              }
              return _savedModulesCandidates;
      },


      //this helper allows to check if a module has been registered in the collection
      //no matter if it's not instantiated yet
      isModuleRegistered : function( id_candidate ) {
            var control = this;
            return ! _.isUndefined( _.findWhere( control.czr_moduleCollection(), { id : id_candidate}) );
      }
});//$.extend//CZRBaseControlMths
})( wp.customize , jQuery, _ );