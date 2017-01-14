//extends api.Value
//options:
// module : module,
// initial_modOpt_model : modOpt, can contains the already db saved values
// defaultModOptModel : module.defaultModOptModel
// control : control instance
var CZRModOptMths = CZRModOptMths || {};
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
        //will store the embedded and content rendered state
        modOpt.contentRendered = $.Deferred();

        //input.options = options;
        //write the options as properties, name is included
        $.extend( modOpt, options || {} );

        //declares a default modOpt model
        modOpt.defaultModOptModel = _.clone( options.defaultModOptModel ) || { is_mod_opt : true };

        //set initial values
        var _initial_model = $.extend( modOpt.defaultModOptModel, options.initial_modOpt_model );

        //this won't be listened to at this stage
        modOpt.set( _initial_model );

        //USER EVENT MAP
        modOpt.userEventMap = new api.Value( [
              //edit view
              {
                trigger   : 'click keydown',
                selector  : [ '.' + modOpt.module.control.css_attr.edit_view_btn ].join(','),
                name      : 'edit_view',
                actions   : ['setViewVisibility']
              }
        ]);


        //OPTIONS IS READY
        //observe its changes when ready
        modOpt.isReady.done( function() {
              modOpt.container = $(  '.' + modOpt.module.control.css_attr.mod_opt_wrapper, modOpt.module.container );
              //listen to any modOpt change
              //=> done in the module
              //modOpt.callbacks.add( function() { return modOpt.modOptReact.apply(modOpt, arguments ); } );

              //When shall we render the modOpt ?
              //If the module is part of a simple control, the modOpt can be render now,
              //modOpt.mayBeRenderModOptWrapper();

              //OPTIONS WRAPPER VIEW SETUP
              //defer actions on modOpt view embedded
              //define the modOpt view DOM event map
              //bind actions when the modOpt is embedded : modOpt title, etc.
              modOpt.modOptWrapperViewSetup( _initial_model );


              //INPUTS SETUP
              //=> when the modOpt content has been rendered. Typically on modOpt expansion for a multi-modOpts module.
              modOpt.contentRendered.done( function() {
                    //create the collection of inputs if needed
                    if ( ! _.has(modOpt, 'czr_Input') )
                      modOpt.setupInputCollectionFromDOM();
              });

        });//modOpt.isReady.done()

  },//initialize

  //overridable method
  //Fired if the modOpt has been instantiated
  //The modOpt.callbacks are declared.
  ready : function() {
        this.isReady.resolve();
  },



  //React to a single modOpt change
  //cb of module.czr_ModOpt(modOpt.id).callbacks
  // modOptReact : function( to, from ) {
  //       var modOpt = this,
  //           module = modOpt.module;

  //       //Always update the view title
  //       //modOpt.writeModOptViewTitle(to);

  //       //send modOpt to the preview. On update only, not on creation.
  //       // if ( ! _.isEmpty(from) || ! _.isUndefined(from) ) {
  //       //   api.consoleLog('DO WE REALLY NEED TO SEND THIS TO THE PREVIEW WITH _sendModOpt(to, from) ?');
  //       //   modOpt._sendModOpt(to, from);
  //       // }
  // },


});//$.extend