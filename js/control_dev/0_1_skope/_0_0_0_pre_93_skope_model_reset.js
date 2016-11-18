

var CZRSkopeMths = CZRSkopeMths || {};


//The Active state is delegated to the scope base class

$.extend( CZRSkopeMths, {
    /*****************************************************************************
    * RESET
    *****************************************************************************/
    //cb of skope.resetWarningVisible.callbacks
    resetReact : function( visible ) {
          var skope = this;
          //are we currently resetting a skope different than the current one ?
          if ( false !== api.czr_isResettingSkope() && skope().id != api.czr_isResettingSkope() )
            return;


          //Event Map for the Reset Panel
          skope.userResetEventMap = skope.userResetEventMap || new api.Value( [
                //skope reset : display warning
                {
                    trigger   : 'click keydown',
                    selector  : '.czr-scope-reset-cancel',
                    name      : 'skope_reset_cancel',
                    actions   : function() {
                        skope.resetWarningVisible( ! skope.resetWarningVisible() );
                    }
                },
                //skope reset : do reset
                {
                    trigger   : 'click keydown',
                    selector  : '.czr-scope-do-reset',
                    name      : 'skope_do_reset',
                    actions   : 'doResetSkopeValues'
                }
            ]
          );

          if ( visible ) {
                //inform the api that we are resetting
                //=> some actions have to be frozen in this state
                //like for example, resetting another skope
                api.czr_isResettingSkope( skope().id );

                //render reset warning template
                $.when( skope.renderResetWarningTmpl() ).done( function( $_container ) {
                    skope.resetPanel = $_container;
                    skope.setupDOMListeners( skope.userResetEventMap() , { dom_el : skope.resetPanel } );
                    //$('body').addClass('czr-reset-skope-pane-open');
                }).then( function() {
                    setTimeout( function() {
                        //set height
                        var _height = $('#customize-preview').height();
                        skope.resetPanel.css( 'line-height', _height +'px' ).css( 'height', _height + 'px' );
                        //display
                        $('body').addClass('czr-reset-skope-pane-open');

                    }, 50 );
                });
          } else {
                $.when( $('body').removeClass('czr-reset-skope-pane-open') ).done( function() {
                    if ( _.has( skope, 'resetPanel') && false !== skope.resetPanel.length ) {
                        setTimeout( function() {
                            skope.resetPanel.remove();
                            api.czr_isResettingSkope( false );
                        }, 300 );
                    }
                });
          }
    },



    //fired on user click
    //Is used for both resetting customized and db values, depending on the skope customization state
    doResetSkopeValues : function() {
          var skope = this,
              reset_method = skope.dirtyness() ? '_resetSkopeDirties' : '_resetSkopeAPIValues',
              _do_reset = function() {
                    skope[reset_method]();
                    api.czr_skopeBase.silentlyUpdateSettings().done( function() {
                          $('.czr-reset-success', skope.resetPanel ).fadeIn('300');
                          $('body').removeClass('czr-resetting-skope');//hide the spinner
                          api.czr_isResettingSkope( false );
                          skope.resetWarningVisible(false);
                    });

              };

          $('body').addClass('czr-resetting-skope');
          $('.czr-reset-warning', skope.resetPanel ).hide();

          //When reseting the db value, wait for the ajax promise to be done before reseting the api values.
          if ( skope.dirtyness() ) {
                _do_reset();
          } else {
                api.previewer.czr_reset( skope().id )
                      .done( function( r ) {
                            _do_reset();
                      } )
                      .fail( function( r ) {
                            $('.czr-reset-fail', skope.resetPanel ).fadeIn('300');
                            api.czr_isResettingSkope( false );
                            skope.resetWarningVisible(false);
                      });
          }
    },


    //fired in doResetSkopeValues
    _resetSkopeDirties : function() {
          var skope = this;
          //Clean the dirtyness state of dirty controls
          //skope.dirtyValues() is an object :
          //{
          //  skope_id2 : { setId1 : val 1, setId2, val2, ... }
          //  ...
          //}
          if ( api.czr_activeSkopeId() == skope().id ) {
              _.each( skope.dirtyValues(), function( _v, setId ) {
                    if ( _.has(api.control(setId), 'czr_isDirty') )
                      api.control(setId).czr_isDirty(false);
              });
          }
          skope.dirtyValues({});
          //inform the api about the new dirtyness state
          api.state('saved')( ! api.czr_skopeBase.isAPIDirty() );
    },

    //fired in doResetSkopeValues
    _resetSkopeAPIValues : function() {
          var skope = this,
              current_model = $.extend( true, {}, skope() ),
              reset_control_db_state = function( shortSetId ) {
                    var wpSetId = api.CZR_Helpers.build_setId( shortSetId );
                    if ( _.has(api.control(wpSetId), 'czr_hasDBVal') ) {
                          api.control(wpSetId).czr_hasDBVal(false);
                    }
              };

          //set the db state of each control
          //Avoid cross skope actions
          if ( api.czr_activeSkopeId() == skope().id ) {
                _.each( skope.dbValues(), function( _v, _setId ) {
                      reset_control_db_state( _setId );
                });
          }

          //update the skope model db property
          api.czr_skope( skope().id ).dbValues( {} );
    }
  } );//$.extend(