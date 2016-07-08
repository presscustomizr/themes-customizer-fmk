
var CZRSkopeMths = CZRSkopeMths || {};
$.extend( CZRSkopeMths, {
  /*****************************************************************************
  * THE SCOPE MODEL
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

          //@todo remove ?
          skope.options = constructor_options;

          skope.isReady = $.Deferred();
          skope.embedded = $.Deferred();
          skope.el = 'czr-scope-' + skope_id;//@todo replace with a css selector based on the scope name

          skope.set(constructor_options);

          //write the options as properties, skope_id is included
          $.extend( skope, constructor_options || {} );

          //Make it alive with various Values
          skope.winner      = new api.Value( skope().is_winner ); //is this skope the one that will be applied on front end in the current context?
          skope.priority    = new api.Value(); //shall this skope always win or respect the default skopes priority
          skope.active      = new api.Value( false ); //active, inactive. Are we currently customizing this skope ?
          skope.dirtyness   = new api.Value( false ); //true or false : has this skope been customized ?

          //setting values are stored in :
          skope.dbValues    = new api.Value( _.isEmpty( skope().db ) ? {} : skope().db );
          skope.dirtyValues = new api.Value({});//stores the current customized value.


          ////////////////////////////////////////////////////
          /// MODULE DOM EVENT MAP
          ////////////////////////////////////////////////////
          skope.userEventMap = new api.Value( [
                //pre add new item : open the dialog box
                {
                  trigger   : 'click keydown',
                  selector  : '.czr-scope-switch',
                  name      : 'skope_switch',
                  actions   : function() {
                      api.czr_activeSkope.set( skope().id );
                      api.previewer.refresh();
                  }
                }
          ]);//module.userEventMap


          console.log('SKOPE : '  + skope().id + ' INSTANTIATED' );

          //SETUP API LISTENERS
          skope.setupSkopeAPIListeners();

          skope.isReady.done( function() {
              console.log('SKOPE : '  + skope().id + ' IS READY');
          });
    },


    //this skope model is instantiated at this point.
    ready : function() {
          var skope = this;

          //EMBED THE SCOPE VIEW : EMBED AND STORE THE CONTAINER
          $.when( skope.embedSkopeDialogBox() ).done( function( $_container ){
              if ( false !== $_container.length ) {
                  skope.container = $_container;
                  skope.embedded.resolve();
              } else {
                  throw new Error('The container of skope ' + skope().id + ' has not been embededd');
              }
          });

          skope.embedded.done( function() {
              console.log('SKOPE : '  + skope().id + ' EMBEDDED');
              //set active state
              skope.active( skope().is_default );
              //Setup the user event listeners
              skope.setupDOMListeners( skope.userEventMap() , { dom_el : skope.container } );
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
          skope.dbValues.callbacks.add(function() { return skope.dbValuesReact.apply(skope, arguments ); } );
          skope.winner.callbacks.add(function() { return skope.winnerReact.apply(skope, arguments ); } );

          //LISTEN TO DIRTYNESS
          skope.dirtyValues.callbacks.add( function(to){
              //set the model dirtyness boolean state value
              skope.dirtyness.set( ! _.isEmpty(to) );
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

    dbValuesReact : function(to, from) {
        this.container.toggleClass('has_db_val', ! _.isEmpty(to) );
    },

    winnerReact : function(to, from) {
        this.container.toggleClass('is_winner', ! _.isEmpty(to) );
    },



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
    //         //1) check if skope.dbValues() is _dirty (has not been set yet), and if so, attempt to fetch the values from the db and populate it
    //         //2) then check the dirtyness state of this skope. If it's dirty (has been customized), then incomplete_set = $.extend( dbValues, dirtyValues );
    //         //3) then $.extend( initialglobalvalues, incomplete_set ) to get the full set of option.
    //         //IMPORTANT : if dbValues have to be fetched, always wait for the done() ajax, because asynchronous.

    //         //if the current skope is 'global'
    //         //=> build the full set with $.extend( initialglobalvalues, dirtyValues )


    // },


    storeDirtyness : function() {
          var skope = this;
          skope.dirtyValues.set( skope.getDirties() );
    },


    getDirties : function() {
          var skope = this,
              _dirtyCustomized = {};
          //populate with the current skope settings dirtyValues
          api.each( function ( value, key ) {
            if ( value._dirty ) {
              var _k = key.replace(serverControlParams.themeOptions, '').replace(/[|]/gi, '' );
              _dirtyCustomized[ _k ] = { value : value(), dirty : value._dirty };
            }
          } );
          return _dirtyCustomized;
    },



    // setSettingsValue : function() {
    //       //TEST UPDATE DYNAMIC STYLE CHECKBOX ON SWITCH
    //       if ( 'trans' == to.dyn_type ) {
    //         api('hu_theme_options[dynamic-styles]').set(true);
    //         //api('hu_theme_options[dynamic-styles]').set(23);
    //         $('input[type=checkbox]', api.control('hu_theme_options[dynamic-styles]').container ).iCheck('update');
    //       }

    //       //TEST UPDATE FONT SELECT ON SWITCH
    //       if ( 'trans' == to.dyn_type ) {
    //         api('hu_theme_options[font]').set('raleway');
    //         //api('hu_theme_options[dynamic-styles]').set(23);
    //         $('select[data-customize-setting-link]', api.control('hu_theme_options[font]').container ).selecter('destroy').selecter();
    //       }

    //       var _img_id = 'trans' == to.dyn_type ? 23 : 25;
    //       //TEST UPDATE LOGO ON SWITCH
    //       api.control('hu_theme_options[custom-logo]').container.remove();

    //       api.control.remove('hu_theme_options[custom-logo]');

    //       var _constructor = api.controlConstructor.czr_cropped_image;
    //       var _data = api.settings.controls['hu_theme_options[custom-logo]'];
    //       api('hu_theme_options[custom-logo]').set(_img_id);

    //       //add the control when the new image has been fetched asynchronously.
    //       wp.media.attachment( _img_id ).fetch().done( function() {
    //         _data.attachment = this.attributes;
    //         api.control.add(
    //         'hu_theme_options[custom-logo]',
    //           new _constructor('hu_theme_options[custom-logo]', { params : _data, previewer :api.previewer })
    //         );
    //       } );

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