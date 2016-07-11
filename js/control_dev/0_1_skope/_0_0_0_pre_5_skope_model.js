

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
  // 'is_primary'  => true,
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
          skope.winner      = new api.Value( constructor_options.is_winner ); //is this skope the one that will be applied on front end in the current context?
          skope.priority    = new api.Value(); //shall this skope always win or respect the default skopes priority
          skope.active      = new api.Value( false ); //active, inactive. Are we currently customizing this skope ?
          skope.dirtyness   = new api.Value( false ); //true or false : has this skope been customized ?

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
                      api.previewer.refresh();
                  }
                },
                //skope reset
                {
                  trigger   : 'click keydown',
                  selector  : '.czr-scope-reset',
                  name      : 'skope_reset',
                  actions   : function() {
                      api.previewer.czr_reset( api.czr_activeSkope() );
                      //api.previewer.refresh();
                  }
                }
          ]);//module.userEventMap

          //SETUP API LISTENERS
          skope.setupSkopeAPIListeners();


          //UPDATE global skope collection each time a skope model is populated or updated
          skope.callbacks.add(function() { return skope.skopeReact.apply( skope, arguments ); } );

          //SET SKOPE MODEL
          skope( constructor_options );

          skope.isReady.done( function() {
              //console.log('SKOPE : '  + skope_id + ' IS READY');
          });
    },


    //this skope model is instantiated at this point.
    ready : function() {
          var skope = this;

          //EMBED THE SKOPE VIEW : EMBED AND STORE THE CONTAINER
          $.when( skope.embedSkopeDialogBox() ).done( function( $_container ){
              if ( false !== $_container.length ) {
                  skope.container = $_container;
                  skope.embedded.resolve();
              } else {
                  throw new Error('The container of skope ' + skope().id + ' has not been embededd');
              }
          });

          skope.embedded.done( function() {
              //console.log('SKOPE : '  + skope().id + ' EMBEDDED');
              //Setup the user event listeners
              skope.setupDOMListeners( skope.userEventMap() , { dom_el : skope.container } );
              //hide when this skope is not in the current skopes list
              skope.visible.bind( function( is_visible ){
                  skope.container.toggle( is_visible );
              });
          });

          skope.isReady.resolve();
    },









    //LISTEN TO SKOPE API EVENTS
    //=> fired on initialize
    setupSkopeAPIListeners : function() {
          var skope = this;

          //How does the view react to model changes ?
          //When active :
          //1) add a green point to the view box
          //2) disable the switch-to icon
          skope.active.callbacks.add(function() { return skope.activeStateReact.apply(skope, arguments ); } );
          skope.dirtyness.callbacks.add(function() { return skope.dirtynessReact.apply(skope, arguments ); } );
          skope.hasDBValues.callbacks.add(function() { return skope.hasDBValuesReact.apply(skope, arguments ); } );
          skope.winner.callbacks.add(function() { return skope.winnerReact.apply(skope, arguments ); } );

          //LISTEN TO DIRTYNESS
          skope.dirtyValues.callbacks.add( function(to) {
              //set the model dirtyness boolean state value
              skope.dirtyness( ! _.isEmpty(to) );
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

          console.log('in skopeReact', to, from );

          //INFORM COLLECTION
          //populate case
          if ( ! api.czr_skopeBase.isSkopeRegisteredInCollection( to ) ) {
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
          $.when( skope.embedded.promise() ).done( function() {
              skope.hasDBValues( to.has_db_val );
          });
    },



    /*****************************************************************************
    * VALUES CALLBACKS
    *****************************************************************************/
    activeStateReact : function(to, from){
          var skope = this;
          skope.container.toggleClass('active', to);
          //console.log('in the view : listen for scope state change', this.name, to, from );
          $('.czr-scope-switch', skope.container).toggleClass('fa-toggle-on', to).toggleClass('fa-toggle-off', !to);
    },

    dirtynessReact : function(to, from) {
        var view = this;
        this.container.toggleClass('dirty', to);
    },

    hasDBValuesReact : function(to, from) {
        this.container.toggleClass('has_db_val', to );
    },

    winnerReact : function(to, from) {
        this.container.toggleClass('is_winner', ! _.isEmpty(to) );
    },


    //populate skope dirtyness
    storeDirtyness : function() {
        console.log('in store dirtyness');
          var skope = this;
          skope.dirtyValues( skope.getDirties() );
    },

    //get the current skope dirty values
    getDirties : function() {
          var skope = this,
              _dirtyCustomized = {};
          //populate with the current skope settings dirtyValues
          api.each( function ( value, setId ) {
              if ( value._dirty ) {
                //var _k = key.replace(serverControlParams.themeOptions, '').replace(/[|]/gi, '' );
                _dirtyCustomized[ setId ] = value();
              }
          } );
          return _dirtyCustomized;
    },

    //@return the boolean dirtyness state of a given setId for a given skope
    getSkopeSettingDirtyness : function( setId ) {
        var skope = this;

        //make sure the setId is ready for API
        setId = api.CZR_Helpers.build_setId( setId );

        console.log('skope.dirtyValues()', skope.dirtyValues(), setId );

        return _.has( skope.dirtyValues(), setId );
    },


    //if is dirty, get the dirty val
    //if not, get the db val
    getSkopeSettingVal : function( setId ) {
        var skope = this,
            _val;
        //make sure the setId is ready for API
        setId = api.CZR_Helpers.build_setId( setId );
        if ( skope.getSkopeSettingDirtyness( setId ) ) {
            return skope.dirtyValues()[ setId ];
        } else {
            return skope._getDBSettingVal( setId );
        }
    },


    //return the server send db value for a pair setId / skope
    _getDBSettingVal : function( setId ) {
          var skope = this,
              shortSetId = api.CZR_Helpers.getOptionName(setId),
              wpSetId = api.CZR_Helpers.build_setId(setId),
              _val;

          console.log( 'api.settings.settings[wpSetId]', skope().id, shortSetId, setId , api.settings.settings, api.settings.settings[wpSetId] );

          console.log('IN GET DB SETTING VAL', skope(), shortSetId );
          // switch ( skope().id ) {
          //     case 'global' :
          //       _val = api.settings.settings[wpSetId].value;
          //     break;
          //     default :
          //       if ( _.has( skope().db, shortSetId ) )
          //         _val = skope().db[shortSetId];
          //       else
          //         _val = api.settings.settings[wpSetId].value;
          //     break;
          // }
          if ( _.has( skope().db, shortSetId ) )
            _val = skope().db[shortSetId];
          else
            _val = api.settings.settings[wpSetId].value;

          return _val;
    }






    // activeStateModelReact : function(to){
    //       var skope = this;

    //       //when becoming inactive
    //       //store the dirtyValues
    //       // if ( ! to ) {
    //       //   skope.storeDirtyness();
    //       //   return;
    //       // }

    //       //When becoming active :
    //         //1) fetch the option if needed
    //         //2) update the setting values

    //       //What are the setting values ?
    //       //when switching to a new skope, we need to re-build a complete set of values from :
    //         //1) values saved in the database (only some)
    //         //2) values already made dirty in the customizer(only some)
    //         //3) default values(all)

    //       //=> fetch the values from the db. on done(), build the full set and update all eligible settings values
    //       //How to build the full set ?
    //         //If not global, local for ex. :
    //         //1) check if skope.hasDBValues() is _dirty (has not been set yet), and if so, attempt to fetch the values from the db and populate it
    //         //2) then check the dirtyness state of this skope. If it's dirty (has been customized), then incomplete_set = $.extend( hasDBValues, dirtyValues );
    //         //3) then $.extend( initialglobalvalues, incomplete_set ) to get the full set of option.
    //         //IMPORTANT : if hasDBValues have to be fetched, always wait for the done() ajax, because asynchronous.

    //         //if the current skope is 'global'
    //         //=> build the full set with $.extend( initialglobalvalues, dirtyValues )


    // },


    /////////////////////////
    //AJAX STUFFS
    ////////////////////////
    //if the current skope is global, then get it from the settings
          // if ( serverControlParams.themeOptions == skope.opt_name ) {
          //   return api.czr_skopeBase.getGlobalSettingVal();
          // }

          // //@uses wp.ajax. See wp.ajax.send() in `wp-includes/js/wp-util.js`.
          // var _options = '',
          //     _query = {
          //       data : {
          //         action : serverControlParams.optionAjaxAction,//theme dependant
          //         opt_name: skope.opt_name,
          //         dyn_type: skope.dyn_type,
          //         stylesheet : api.settings.theme.stylesheet
          //       }
          //     };

          // console.log('before ajax send request : ', skope.skope_id, skope, to , serverControlParams.themeOptions, skope.opt_name );

          // wp.ajax.send( _query ).done( function( resp ){
          //   _options = resp;
          //   console.log('AJAX RESPONSE IN DONE() : ', resp);
          // });
    // getDBOptions : function( opt_name, dyn_type ) {
    //       //if the requested opt set is global, then get it from the settings
    //       if ( serverControlParams.themeOptions == opt_name ) {
    //         return api.czr_skopeBase.getGlobalSettingVal();
    //       }

    //       //@uses wp.ajax. See wp.ajax.send() in `wp-includes/js/wp-util.js`.
    //       var _options = '',
    //           _query = {
    //             data : {
    //               action : serverControlParams.optionAjaxAction,//theme dependant
    //               opt_name: opt_name,
    //               dyn_type: dyn_type,
    //               stylesheet : api.settings.theme.stylesheet
    //             }
    //           };

    //       wp.ajax.send( _query ).done( function( resp ){
    //         _options = resp;
    //       });
    //       return _options;
    // },

  } );//$.extend(