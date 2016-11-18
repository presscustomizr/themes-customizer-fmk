

var CZRSkopeMths = CZRSkopeMths || {};


//The Active state is delegated to the scope base class

$.extend( CZRSkopeMths, {
  /*****************************************************************************
  * THE SKOPE MODEL
  *****************************************************************************/
  // 'id'          => 'global',
  // 'level'       => '_all_',
  // 'dyn_type'    => 'option',
  // 'opt_name'    => HU_THEME_OPTIONS,
  // 'is_default'  => true,
  // 'is_winner'   => false,
  // 'db'    => array(),
  // 'has_db_val'  => false
  // 'is_forced'  => false,
    initialize: function( skope_id, constructor_options ) {
          var skope = this;
          api.Value.prototype.initialize.call( skope, null, constructor_options );

          skope.isReady = $.Deferred();
          skope.embedded = $.Deferred();
          skope.el = 'czr-scope-' + skope_id;//@todo replace with a css selector based on the scope name

          //write the options as properties, skope_id is included
          $.extend( skope, constructor_options || {} );

          //Make it alive with various Values
          skope.visible     = new api.Value(true);
          skope.winner      = new api.Value(false); //is this skope the one that will be applied on front end in the current context?
          skope.priority    = new api.Value(); //shall this skope always win or respect the default skopes priority
          skope.active      = new api.Value( false ); //active, inactive. Are we currently customizing this skope ?
          skope.dirtyness   = new api.Value( false ); //true or false : has this skope been customized ?
          skope.resetWarningVisible = new api.Value(false);

          //setting values are stored in :
          skope.hasDBValues = new api.Value( false );
          skope.dirtyValues = new api.Value({});//stores the current customized value.
          skope.dbValues    = new api.Value({});//stores the latest db values => will be updated on each skope synced event
          skope.changesetValues = new api.Value({});//stores the latest changeset values => will be updated on each skope synced eventsynced event

          ////////////////////////////////////////////////////
          /// MODULE DOM EVENT MAP
          ////////////////////////////////////////////////////
          skope.userEventMap = new api.Value( [
                //skope switch
                {
                  trigger   : 'click keydown',
                  selector  : '.czr-scope-switch',
                  name      : 'skope_switch',
                  actions   : function() {
                      api.czr_activeSkopeId( skope_id );
                  }
                },
                //skope reset : display warning
                {
                  trigger   : 'click keydown',
                  selector  : '.czr-scope-reset',
                  name      : 'skope_reset_warning',
                  actions   : function() {
                      skope.resetWarningVisible( ! skope.resetWarningVisible() );
                  }
                }
          ]);//module.userEventMap

          //Reset actions
          skope.resetWarningVisible.callbacks.add(function() { return skope.resetReact.apply(skope, arguments ); } );

          //LISTEN TO API DIRTYNESS
          //@to is {setId1 : val1, setId2 : val2, ...}
          skope.dirtyValues.callbacks.add(function() { return skope.dirtyValuesReact.apply(skope, arguments ); } );

          //LISTEN TO CHANGESET VALUES
          skope.changesetValues.callbacks.add(function() { return skope.changesetValuesReact.apply(skope, arguments ); } );

          //LISTEN TO DB VALUES
          skope.dbValues.callbacks.add(function() { return skope.dbValuesReact.apply(skope, arguments ); } );

          //UPDATE global skope collection each time a skope model is populated or updated
          skope.callbacks.add(function() { return skope.skopeReact.apply( skope, arguments ); } );

          //PREPARE THE CONSTRUCTOR OPTIONS AND SET SKOPE MODEL WITH IT
          //=> we don't need to store the db , has_db_val, and changeset properties in the model statically
          //because it will be stored as observable values
          skope.set( _.omit( constructor_options, function( _v, _key ) {
                return _.contains( [ 'db', 'changeset', 'has_db_val' ], _key );
          } ) );

          ////////////////////////////////////////////////////
          /// EMBED AND SETUP OBSERVABLE VALUES LISTENERS
          ////////////////////////////////////////////////////
          skope.embedded
                .fail( function() {
                      throw new Error('The container of skope ' + skope().id + ' has not been embededd');
                })
                .done( function() {
                      //api.consoleLog('SKOPE : '  + skope().id + ' EMBEDDED');
                      //Setup the user event listeners
                      skope.setupDOMListeners( skope.userEventMap() , { dom_el : skope.container } );
                      //hide when this skope is not in the current skopes list
                      skope.visible.bind( function( is_visible ){
                          skope.container.toggle( is_visible );
                      });

                      //How does the view react to model changes ?
                      //When active :
                      //1) add a green point to the view box
                      //2) disable the switch-to icon
                      skope.active.callbacks.add(function() { return skope.activeStateReact.apply(skope, arguments ); } );
                      skope.dirtyness.callbacks.add(function() { return skope.dirtynessReact.apply(skope, arguments ); } );
                      skope.hasDBValues.callbacks.add(function() { return skope.hasDBValuesReact.apply(skope, arguments ); } );
                      skope.winner.callbacks.add(function() { return skope.winnerReact.apply(skope, arguments ); } );


                      skope.dirtyness( ! _.isEmpty( constructor_options.changeset ) );
                      skope.hasDBValues( ! _.isEmpty( constructor_options.db ) );
                      skope.winner( constructor_options.is_winner );

                      skope.isReady.resolve();
                });
    },

    //this skope model is instantiated at this point.
    ready : function() {
          var skope = this;

          //EMBED THE SKOPE VIEW : EMBED AND STORE THE CONTAINER
          $.when( skope.embedSkopeDialogBox() ).done( function( $_container ){
              if ( false !== $_container.length ) {
                  skope.container = $_container;
                  skope.embedded.resolve( $_container );
              } else {
                  skope.embedded.reject();
              }
          });
    },




    /*****************************************************************************
    * SKOPE API DIRTIES REACTIONS
    *****************************************************************************/
    dirtyValuesReact : function( to, from ) {
          var skope = this;
          //set the model dirtyness boolean state value
          skope.dirtyness( ! _.isEmpty(to) );

          //build the collection of control ids for which the dirtyness has to be reset
          var ctrlIdDirtynessToClean = [];
          _.each( from, function( _val, _id ) {
              if ( _.has( to, _id ) )
                return;
              ctrlIdDirtynessToClean.push( _id );
          });

          //SET THE ACTIVE SKOPE CONTROLS DIRTYNESSES
          if ( skope().id == api.czr_activeSkopeId() ) {
                //RESET DIRTYNESS FOR THE CLEAN SETTINGS CONTROLS IN THE ACTIVE SKOPE
                _.each( ctrlIdDirtynessToClean , function( setId ) {
                      if ( _.has( api.control( setId ), 'czr_isDirty') ) {
                            api.control( setId ).czr_isDirty( false );
                      }
                });
                //Set control dirtyness for dirty settings
                _.each( to, function( _val, _setId ) {
                      if ( _.has( api.control( _setId ), 'czr_isDirty') ) {
                            api.control( _setId ).czr_isDirty( true );
                      }
                });
          }
    },


    /*****************************************************************************
    * SKOPE API CHANGESET REACTIONS
    *****************************************************************************/
    changesetValuesReact : function( to, from ) {
          var skope = this,
              _currentDbDirties = $.extend( true, {}, skope.dirtyValues() );
          skope.dirtyValues( $.extend( _currentDbDirties, to ) );
    },


    /*****************************************************************************
    * SKOPE DB VALUES REACTIONS
    *****************************************************************************/
    dbValuesReact : function( to, from ) {
          var skope = this;

          //set the model dirtyness boolean state value
          skope.hasDBValues( ! _.isEmpty(to) );

          //RESET DIRTYNESS FOR THE CONTROLS IN THE ACTIVE SKOPE
          //=> make sure this is set for the active skopes only
          var ctrlIdDbToReset = [];
          _.each( from, function( _val, _id ) {
              if ( _.has( to, _id ) )
                return;
              ctrlIdDbToReset.push( _id );
          });

          if ( skope().id == api.czr_activeSkopeId() ) {
                _.each( ctrlIdDbToReset , function( setId ) {
                      if ( _.has( api.control( setId ), 'czr_hasDBVal') ) {
                            api.control(setId).czr_hasDBVal ( false );
                      }
                });
                //Set control db dirtyness for settings with a db value
                _.each( to, function( _val, _setId ) {
                      if ( _.has( api.control( _setId ), 'czr_hasDBVal') ) {
                            api.control( _setId ).czr_hasDBVal( true );
                      }
                });
          }
    },


    /*****************************************************************************
    * SKOPE MODEL CHANGES CALLBACKS
    *****************************************************************************/
    //cb of skope.callbacks
    skopeReact : function( to, from ) {
          var skope = this,
              _current_collection = [],
              _new_collection = [];

          //INFORM COLLECTION
          //populate case
          if ( ! api.czr_skopeBase.isSkopeRegisteredInCollection( to.id ) ) {
                //Add this new skope to the global skope collection
                _current_collection = $.extend( true, [], api.czr_skopeCollection() );
                _current_collection.push( to );
                api.czr_skopeCollection( _current_collection );
          }
          //update case
          else {
                //Add this new skope to the global skope collection
                _current_collection = $.extend( true, [], api.czr_skopeCollection() );
                _new_collection = _current_collection;
                //update the collection with the current new skope model
                _.each( _current_collection, function( _skope, _key ) {
                    if ( _skope.id != skope().id )
                      return;
                    _new_collection[_key] = to;
                });
                api.czr_skopeCollection( _new_collection );
          }
    },







    /*****************************************************************************
    * VALUES CALLBACKS WHEN SKOPE EMBEDDED AND READY
    *****************************************************************************/
    //cb of skope.active.callbacks
    activeStateReact : function(to, from){
          var skope = this;
          skope.container.toggleClass('active', to);
          //api.consoleLog('in the view : listen for scope state change', this.name, to, from );
          $('.czr-scope-switch', skope.container).toggleClass('fa-toggle-on', to).toggleClass('fa-toggle-off', !to);
    },

    //cb of skope.dirtyness.callbacks
    dirtynessReact : function(to, from) {
          var skope = this;
          $.when( this.container.toggleClass( 'dirty', to) ).done( function() {
              if ( to )
                $( '.czr-scope-reset', skope.container).fadeIn('slow').attr('title', 'Reset the currently customized values');
              else if ( ! skope.hasDBValues() )
                $( '.czr-scope-reset', skope.container).fadeOut('fast');
          });
    },

    //cb of skope.hasDBValues.callbacks
    hasDBValuesReact : function(to, from) {
          var skope = this;
          $.when( skope.container.toggleClass('has-db-val', to ) ).done( function() {
              if ( to )
                $( '.czr-scope-reset', skope.container).fadeIn('slow').attr('title', 'Reset the saved values');
              else if ( ! skope.dirtyness() )
                $( '.czr-scope-reset', skope.container).fadeOut('fast');
          });
    },

    //cb of skope.winner.callbacks
    winnerReact : function( is_winner ) {
          var skope = this;
          this.container.toggleClass('is_winner', is_winner );

          if ( is_winner ) {
                //make sure there's only one winner in the current skope collection
                _.each( api.czr_currentSkopesCollection(), function( _skope ) {
                      if ( _skope.id == skope().id )
                        return;
                      var _current_model = $.extend( true, {}, _skope );
                      $.extend( _current_model, { is_winner : false } );
                      api.czr_skope( _skope.id )( _current_model );
                });
          }
    },




    /*****************************************************************************
    * HELPERS
    *****************************************************************************/
    //get the current skope dirty values
    //DEPRECATED
    // getDirties : function() {
    //       var skope = this,
    //           _dirtyCustomized = {};
    //       //populate with the current skope settings dirtyValues
    //       api.each( function ( value, setId ) {
    //           if ( value._dirty ) {
    //             //var _k = key.replace(serverControlParams.themeOptions, '').replace(/[|]/gi, '' );
    //             _dirtyCustomized[ setId ] = value();
    //           }
    //       } );
    //       return _dirtyCustomized;
    // },

    //@return the boolean dirtyness state of a given setId for a given skope
    getSkopeSettingDirtyness : function( setId ) {
          var skope = this;
          return skope.getSkopeSettingAPIDirtyness( setId ) || skope.getSkopeSettingChangesetDirtyness( setId );
    },

    //Has this skope already be customized in the API ?
    getSkopeSettingAPIDirtyness : function( setId ) {
          var skope = this;
          return _.has( skope.dirtyValues(), api.CZR_Helpers.build_setId( setId ) );
    },

    //Has this skope already be customized in the API ?
    getSkopeSettingChangesetDirtyness : function( setId ) {
          var skope = this;
          if ( ! api.czr_isChangedSetOn() )
            return skope.getSkopeSettingAPIDirtyness( setId );
          return _.has( skope.changesetValues(), api.CZR_Helpers.build_setId( setId ) );
    },

    //@return boolean
    hasSkopeSettingDBValues : function( setId ) {
          var skope = this,
              _setId = api.CZR_Helpers.build_setId(setId);

          return ! _.isUndefined( api.czr_skope( api.czr_activeSkopeId() ).dbValues()[_setId] );
    }
  } );//$.extend(