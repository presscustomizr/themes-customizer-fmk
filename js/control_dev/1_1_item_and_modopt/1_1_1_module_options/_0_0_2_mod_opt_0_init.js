//extends api.Value
//options:
// module : module,
// initial_modOpt_model : modOpt, can contains the already db saved values
// defaultModOptModel : module.defaultModOptModel
// control : control instance

var CZRModOptMths = CZRModOptMths || {};
( function ( api, $, _ ) {
$.extend( CZRModOptMths , {
      initialize: function( options ) {
            if ( _.isUndefined(options.module) || _.isEmpty(options.module) ) {
              throw new Error('No module assigned to modOpt.');
            }

            var modOpt = this;
            api.Value.prototype.initialize.call( modOpt, null, options );

            //DEFERRED STATES
            //store the state of ready.
            //=> we don't want the ready method to be fired several times
            modOpt.isReady = $.Deferred();

            //VARIOUS DEFINITIONS
            modOpt.container = null;//will store the modOpt $ dom element
            modOpt.inputCollection = new api.Value({});

            //input.options = options;
            //write the options as properties, name is included
            $.extend( modOpt, options || {} );

            //declares a default modOpt model
            modOpt.defaultModOptModel = _.clone( options.defaultModOptModel ) || { is_mod_opt : true };

            //set initial values
            var _initial_model = $.extend( modOpt.defaultModOptModel, options.initial_modOpt_model );
            var ctrl = modOpt.module.control;
            //this won't be listened to at this stage
            modOpt.set( _initial_model );

            //MOD OPT PANEL SETTINGS
            api.czr_ModOptVisible = new api.Value( false );

            //MOD OPT VISIBLE REACT
            api.czr_ModOptVisible.bind( function( visible ) {
                  if ( visible ) {
                        //first close all opened remove dialogs
                        modOpt.module.closeRemoveDialogs();

                        modOpt.modOptWrapperViewSetup( _initial_model ).done( function( $_container ) {
                              modOpt.container = $_container;
                              try {
                                    api.CZR_Helpers.setupInputCollectionFromDOM.call( modOpt ).toggleModPanelView( visible );
                              } catch(e) {
                                    api.consoleLog(e);
                              }
                        });

                  } else {
                        modOpt.toggleModPanelView( visible ).done( function() {
                              if ( false !== modOpt.container.length ) {
                                    $.when( modOpt.container.remove() ).done( function() {
                                          api.CZR_Helpers.removeInputCollection.call( modOpt );
                                    });
                              } else {
                                    api.CZR_Helpers.removeInputCollection.call( modOpt );
                              }
                              modOpt.container = null;
                        });
                  }
            } );

            //OPTIONS IS READY
            //observe its changes when ready
            modOpt.isReady.done( function() {
                  //listen to any modOpt change
                  //=> done in the module
                  //modOpt.callbacks.add( function() { return modOpt.modOptReact.apply(modOpt, arguments ); } );

                  //When shall we render the modOpt ?
                  //If the module is part of a simple control, the modOpt can be render now,
                  //modOpt.mayBeRenderModOptWrapper();

                  //RENDER THE CONTROL TITLE GEAR ICON
                  if( ! $( '.' + ctrl.css_attr.edit_modopt_icon, ctrl.container ).length ) {
                        $.when( ctrl.container
                              .find('.customize-control-title').first()//was.find('.customize-control-title')
                              .append( $( '<span/>', {
                                    class : [ ctrl.css_attr.edit_modopt_icon, 'fa fa-cog' ].join(' '),
                                    title : 'Settings'//@to_translate
                              } ) ) )
                        .done( function(){
                              $( '.' + ctrl.css_attr.edit_modopt_icon, ctrl.container ).fadeIn( 400 );
                        });
                  }

                  //LISTEN TO USER ACTIONS ON CONTROL EL
                  api.CZR_Helpers.setupDOMListeners(
                        [
                              //toggle mod options
                              {
                                    trigger   : 'click keydown',
                                    selector  : '.' + ctrl.css_attr.edit_modopt_icon,
                                    name      : 'toggle_mod_option',
                                    actions   : function() {
                                          api.czr_ModOptVisible( ! api.czr_ModOptVisible() );
                                    }
                              }
                        ],//actions to execute
                        { dom_el: ctrl.container },//dom scope
                        modOpt //instance where to look for the cb methods
                  );
                  //modOpt.userEventMap = new api.Value( [] );
            });//modOpt.isReady.done()

      },//initialize

      //overridable method
      //Fired if the modOpt has been instantiated
      //The modOpt.callbacks are declared.
      ready : function() {
            this.isReady.resolve();
      }
});//$.extend
})( wp.customize , jQuery, _ );