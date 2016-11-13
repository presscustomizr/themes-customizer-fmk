

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
          skope.hasDBValues    = new api.Value(false);
          skope.dirtyValues = new api.Value({});//stores the current customized value.


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
                      api.czr_activeSkope( skope_id );
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


          ////////////////////////////////////////////////////
          /// SETUP API LISTENERS
          ////////////////////////////////////////////////////
          //How does the view react to model changes ?
          //When active :
          //1) add a green point to the view box
          //2) disable the switch-to icon
          skope.active.callbacks.add(function() { return skope.activeStateReact.apply(skope, arguments ); } );
          skope.dirtyness.callbacks.add(function() { return skope.dirtynessReact.apply(skope, arguments ); } );
          skope.hasDBValues.callbacks.add(function() { return skope.hasDBValuesReact.apply(skope, arguments ); } );
          skope.winner.callbacks.add(function() { return skope.winnerReact.apply(skope, arguments ); } );

          //Reset actions
          skope.resetWarningVisible.callbacks.add(function() { return skope.resetReact.apply(skope, arguments ); } );

          //LISTEN TO DIRTYNESS
          //@to is {setId1 : val1, setId2, val2, ...}
          skope.dirtyValues.callbacks.add( function(to, from) {
              console.log('IN DIRTY VALUES CALLBACK', to, from );
              //set the model dirtyness boolean state value
              skope.dirtyness( ! _.isEmpty(to) );
          });


          //UPDATE global skope collection each time a skope model is populated or updated
          skope.callbacks.add(function() { return skope.skopeReact.apply( skope, arguments ); } );

          //SET SKOPE MODEL
          skope( constructor_options );

          skope.isReady.done( function() {
              //api.consoleLog('SKOPE : '  + skope_id + ' IS READY');
          });
    },


    //this skope model is instantiated at this point.
    ready : function() {
          var skope = this;

          //EMBED THE SKOPE VIEW : EMBED AND STORE THE CONTAINER
          $.when( skope.embedSkopeDialogBox() ).done( function( $_container ){
              console.log('  !!!!!!!!!!!!!!! EMBED DIALOG BOX !!!!!!!!!!!!!!!! ');
              if ( false !== $_container.length ) {
                  skope.container = $_container;
                  skope.embedded.resolve();
              } else {
                  throw new Error('The container of skope ' + skope().id + ' has not been embededd');
              }
          });

          skope.embedded.done( function() {
              //api.consoleLog('SKOPE : '  + skope().id + ' EMBEDDED');
              //Setup the user event listeners
              skope.setupDOMListeners( skope.userEventMap() , { dom_el : skope.container } );
              //hide when this skope is not in the current skopes list
              skope.visible.bind( function( is_visible ){
                  skope.container.toggle( is_visible );
              });
              skope.isReady.resolve();
          });
    },






    /*****************************************************************************
    * SKOPE MODEL CALLBACKS
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

          //INFORM SKOPE API VALUES
          //=> fired on each update of the skope model
          $.when( skope.embedded.promise() ).done( function() {
                skope.dirtyness( ! _.isEmpty( skope().changeset ) );
                skope.hasDBValues( to.has_db_val );
                skope.winner( to.is_winner );
          });
    },







    /*****************************************************************************
    * VALUES CALLBACKS
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
          $.when( this.container.toggleClass('dirty', to) ).done( function() {
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
          if ( ! api.czr_isChangedSetOn() || ! _.has( skope(), 'changeset' ) )
            return skope.getSkopeSettingAPIDirtyness( setId );
          return _.has( skope().changeset, api.CZR_Helpers.build_setId( setId ) );
    },

    //@return boolean
    hasSkopeSettingDBValues : function( setId ) {
          var skope = this,
              shortSetId = api.CZR_Helpers.getOptionName(setId);

          if ( 'global' == skope().skope ) {
            return _.contains( api.czr_globalDBoptions(), shortSetId );
          } else {
            return ! _.isUndefined( api.czr_skope( api.czr_activeSkope() )().db[shortSetId] );
          }
    }
  } );//$.extend(