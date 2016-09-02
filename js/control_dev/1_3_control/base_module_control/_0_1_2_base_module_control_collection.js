
//BASE CONTROL CLASS
//extends api.CZRBaseControl
//define a set of methods, mostly helpers, to extend the base WP control class
//this will become our base constructor for main complex controls
//EARLY SETUP
var CZRBaseModuleControlMths = CZRBaseModuleControlMths || {};

$.extend( CZRBaseModuleControlMths, {


  //Multi Module method
  //fired when the main sektion module has synchronised its if with the module-collection control
  registerModulesOnInit : function( sektion_module_instance ) {
          var control = this,
              _orphan_mods = [];

          _.each( control.getSavedModules() , function( _mod, _key ) {
                  //a module previously embedded in a deleted sektion must not be registered
                  if ( ! sektion_module_instance.czr_Item.has( _mod.sektion_id ) ) {
                      api.consoleLog('Warning Module ' + _mod.id + ' is orphan : it has no sektion to be embedded to. It Must be removed.');
                      _orphan_mods.push(_mod);
                      return;
                  }
                  //@todo handle the case of a module embedded in a previously deleted column
                  //=> register it in the first column of the sektion ?

                  var _sektion = sektion_module_instance.czr_Item( _mod.sektion_id );

                  if ( _.isUndefined( _sektion ) ) {
                    throw new Error('sektion instance missing. Impossible to instantiate module : ' + _mod.id );
                  }

                  //add the sektion instance before update the api collection
                  $.extend( _mod, {sektion : _sektion} );

                  //push it to the collection of the module-collection control
                  //=> the instantiation will take place later, on column instantiation
                  control.updateModulesCollection( {module : _mod } );
          });

          //REMOVE ORPHAN MODULES ON INIT
          //But only when the module collectionn has been resolved
          control.moduleCollectionReady.then( function() {
                //if there are some orphans mods, the module-collection setting must be updated now.
                if ( ! _.isEmpty( _orphan_mods ) ) {
                    control.moduleCollectionReact( control.czr_moduleCollection(), [], { orphans_module_removal : _orphan_mods } );
                }
          });
  },



  //@param obj can be { collection : []}, or { module : {} }
  //Can be called :
  //1) for multimodule control, in register modules on init, when the main sektion module has synchronised with the module-collection control
  //2) for all modules, in module.isReady.done() if the module is not registered in the collection yet.
  //3) for all modules on moduleReact ( module.callbacks )
  //
  //=> sets the setting value via the module collection !
  updateModulesCollection : function( obj ) {
          var control = this,
              _current_collection = control.czr_moduleCollection(),
              _new_collection = $.extend( true, [], _current_collection);

          //if a collection is provided in the passed obj then simply refresh the collection
          //=> typically used when reordering the collection module with sortable or when a module is removed
          if ( _.has( obj, 'collection' ) ) {
                //reset the collection
                control.czr_moduleCollection.set( obj.collection, obj.data || {} );
                return;
          }

          if ( ! _.has(obj, 'module') ) {
            throw new Error('updateModulesCollection, no module provided ' + control.id + '. Aborting');
          }

          //normalizes the module for the API
          var module_api_ready = control.prepareModuleForAPI( _.clone(obj.module) );

          //the module already exist in the collection
          if ( _.findWhere( _new_collection, { id : module_api_ready.id } ) ) {
                _.each( _current_collection , function( _elt, _ind ) {
                      if ( _elt.id != module_api_ready.id )
                        return;

                      //set the new val to the changed property
                      _new_collection[_ind] = module_api_ready;
                });
          }
          //the module has to be added
          else {
                _new_collection.push(module_api_ready);
          }

          //WHAT ARE THE PARAMS WE WANT TO PASS TO THE NEXT ACTIONS
          var _params = {};
          //if a data property has been passed,
          //amend the data property with the changed module
          if ( _.has( obj, 'data') ) {
              _params = $.extend( true, {}, obj.data );
              $.extend( _params, { module : module_api_ready } );
          }

          //Inform the collection
          control.czr_moduleCollection.set( _new_collection, _params );
  },



  //cb of control.czr_moduleCollection.callbacks
  moduleCollectionReact : function( to, from, data ) {
        var control = this,
            is_module_added = _.size(to) > _.size(from),
            is_module_removed = _.size(from) > _.size(to),
            is_module_update = _.size(from) == _.size(to);
            is_collection_sorted = false;

        //MODULE REMOVED
        //Remove the module instance if needed
        if ( is_module_removed ) {
            //find the module to remove
            var _to_remove = _.filter( from, function( _mod ){
                return _.isUndefined( _.findWhere( to, { id : _mod.id } ) );
            });
            _to_remove = _to_remove[0];
            control.czr_Module.remove( _to_remove.id );
        }

        //is there a passed module param ?
        //if so prepare it for DB
        if ( _.isObject( data  ) && _.has(data, 'module') ) {
            data.module = control.prepareModuleForDB( $.extend( true, {}, data.module  ) );
        }

        //Inform the the setting
        //If we are in a single module control (not a sektion, multimodule)
        //AND that the module is being added to the collection for the first time,
        //We don't want to say it to the setting, because it might alter the setting dirtyness for nothing on init.
        if ( ! control.isMultiModuleControl() && is_module_added )
          return;
        else
          api(this.id).set( control.filterModuleCollectionBeforeAjax(to), data );

        //refreshes the preview frame  :
        //1) only needed if transport is postMessage, because is triggered by wp otherwise
        //2) only needed when : add, remove, sort item(s)
        //module update case
        // if ( 'postMessage' == api(control.id).transport && ! api.CZR_Helpers.has_part_refresh( control.id ) ) {
        //     api.consoleLog('WE DONT KNOW IF THE COLLECTION IS SORTED HERE ! FIX!', to, from, data );
        //     if ( is_collection_sorted )
        //         control.previewer.refresh();
        // }
  },




  //an overridable method to act on the collection just before it is ajaxed
  //@return the collection array
  filterModuleCollectionBeforeAjax : function( collection ) {
          var control = this,
              _filtered_collection = $.extend( true, [], collection );

          _.each( collection , function( _mod, _key ) {
                var db_ready_mod = $.extend( true, {}, _mod );
                _filtered_collection[_key] = control.prepareModuleForDB( db_ready_mod );
          });

          //we don't want to save the same things if we the modules are embedded in a control or in a sektion
          //=> in a sektion : we save the collection of modules
          //=> in a control : we save the collection of item(s)
          if ( control.isMultiModuleControl() ) {
                return _filtered_collection;
          } else {
                //at this point we should be in the case of a single module collection, typically use to populate a regular setting
                if ( _.size(collection) > 1 ) {
                  throw new Error('There should not be several modules in the collection of control : ' + control.id );
                }
                if ( ! _.isArray(collection) || _.isEmpty(collection) || ! _.has( collection[0], 'items' ) ) {
                  throw new Error('The setting value could not be populated in control : ' + control.id );
                }
                var module_id = collection[0].id;

                if ( ! control.czr_Module.has( module_id ) ) {
                   throw new Error('The single module control (' + control.id + ') has no module registered with the id ' + module_id  );
                }
                var module_instance = control.czr_Module( module_id );
                if ( ! _.isArray( module_instance().items ) ) {
                  throw new Error('The module ' + module_id + ' should be an array in control : ' + control.id );
                }
                if ( module_instance.isMultiItem() )
                  return module_instance().items;
                else {
                  return module_instance().items[0] || [];
                }
          }
  },




  //fired before adding a module to the collection of DB candidates
  //the module must have the control.getDefaultModuleDBModel structure :
  prepareModuleForDB : function ( module_db_candidate ) {
        if ( ! _.isObject( module_db_candidate ) ) {
            throw new Error('MultiModule Control::prepareModuleForDB : a module must be an object. Aborting.');
        }
        var control = this,
            db_ready_module = {};

        _.each( control.getDefaultModuleDBModel() , function( _value, _key ) {
              if ( ! _.has( module_db_candidate, _key ) ) {
                  throw new Error('MultiModule Control::prepareModuleForDB : a module is missing the property : ' + _key + ' . Aborting.');
              }

              var _candidate_val = module_db_candidate[ _key ];
              switch( _key ) {
                    //PROPERTIES COMMON TO ALL MODULES IN ALL CONTEXTS
                    case 'items' :
                      if ( ! _.isArray( _candidate_val )  ) {
                          throw new Error('prepareModuleForDB : a module item list must be an array');
                      }
                      db_ready_module[ _key ] = _candidate_val;
                    break;



                    //PROPERTIES FOR MODULE EMBEDDED IN A SEKTION
                    case 'id' :
                      if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                          throw new Error('prepareModuleForDB : a module id must a string not empty');
                      }
                      db_ready_module[ _key ] = _candidate_val;
                    break;
                    case 'module_type' :
                      if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                          throw new Error('prepareModuleForDB : a module type must a string not empty');
                      }
                      db_ready_module[ _key ] = _candidate_val;
                    break;
                    case  'column_id' :
                      if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                          throw new Error('prepareModuleForDB : a module column id must a string not empty');
                      }
                      db_ready_module[ _key ] = _candidate_val;
                    break;
                    case  'sektion_id' :
                      if ( ! _.isObject( module_db_candidate.sektion ) || ! _.has( module_db_candidate.sektion, 'id' ) ) {
                          throw new Error('prepareModuleForDB : a module sektion must be an object with an id.');
                      }
                      //in the API, the sektion property hold by the module is an instance
                      //let's use only the id for the DB
                      db_ready_module[ _key ] = module_db_candidate.sektion.id;
                    break;
                    case 'dirty' :
                      if ( control.czr_Module.has( module_db_candidate.id ) )
                          db_ready_module[ _key ] = control.czr_Module( module_db_candidate.id ).isDirty();
                      else
                          db_ready_module[ _key ] = _candidate_val;
                      if ( ! _.isBoolean( db_ready_module[ _key ] ) ) {
                          throw new Error('prepareModuleForDB : a module dirty state must be a boolean.');
                      }
                    break;
              }//switch
        });
        return db_ready_module;
  }

});//$.extend//CZRBaseControlMths