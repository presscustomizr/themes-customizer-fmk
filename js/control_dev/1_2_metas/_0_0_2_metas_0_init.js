//extends api.Value
//options:
// module : module,
// initial_metas_model : metas, can contains the already db saved values
// defaultMetasModel : module.defaultMetasModel
// control : control instance
var CZRModMetasMths = CZRModMetasMths || {};
$.extend( CZRModMetasMths , {
  initialize: function( options ) {
        if ( _.isUndefined(options.module) || _.isEmpty(options.module) ) {
          throw new Error('No module assigned to metas.');
        }

        var metas = this;
        api.Value.prototype.initialize.call( metas, null, options );

        //DEFERRED STATES
        //store the state of ready.
        //=> we don't want the ready method to be fired several times
        metas.isReady = $.Deferred();
        //will store the embedded and content rendered state
        metas.contentRendered = $.Deferred();

        //input.options = options;
        //write the options as properties, name is included
        $.extend( metas, options || {} );

        //declares a default metas model
        metas.defaultMetasModel = _.clone( options.defaultMetasModel ) || { is_meta : true };

        //set initial values
        var _initial_model = $.extend( metas.defaultMetasModel, options.initial_metas_model );

        //this won't be listened to at this stage
        metas.set( _initial_model );

        //USER EVENT MAP
        metas.userEventMap = new api.Value( [
              //edit view
              {
                trigger   : 'click keydown',
                selector  : [ '.' + metas.module.control.css_attr.edit_view_btn, '.' + metas.module.control.css_attr.metas_title ].join(','),
                name      : 'edit_view',
                actions   : ['setViewVisibility']
              }
        ]);


        //METAS IS READY
        //observe its changes when ready
        metas.isReady.done( function() {

              metas.container = $(  '.' + metas.module.control.css_attr.metas_wrapper, metas.module.container );
              //listen to any metas change
              //=> done in the module
              //metas.callbacks.add( function() { return metas.metasReact.apply(metas, arguments ); } );

              //When shall we render the metas ?
              //If the module is part of a simple control, the metas can be render now,
              //metas.mayBeRenderMetasWrapper();

              //METAS WRAPPER VIEW SETUP
              //defer actions on metas view embedded
              //define the metas view DOM event map
              //bind actions when the metas is embedded : metas title, etc.
              metas.metasWrapperViewSetup( _initial_model );


              //INPUTS SETUP
              //=> when the metas content has been rendered. Typically on metas expansion for a multi-metass module.
              metas.contentRendered.done( function() {
                    //create the collection of inputs if needed
                    if ( ! _.has(metas, 'czr_Input') )
                      metas.setupInputCollectionFromDOM();
              });

        });//metas.isReady.done()

  },//initialize

  //overridable method
  //Fired if the metas has been instantiated
  //The metas.callbacks are declared.
  ready : function() {
        this.isReady.resolve();
  },



  //React to a single metas change
  //cb of module.czr_Metas(metas.id).callbacks
  // metasReact : function( to, from ) {
  //       var metas = this,
  //           module = metas.module;

  //       //Always update the view title
  //       //metas.writeMetasViewTitle(to);

  //       //send metas to the preview. On update only, not on creation.
  //       // if ( ! _.isEmpty(from) || ! _.isUndefined(from) ) {
  //       //   api.consoleLog('DO WE REALLY NEED TO SEND THIS TO THE PREVIEW WITH _sendMetas(to, from) ?');
  //       //   metas._sendMetas(to, from);
  //       // }
  // },


});//$.extend