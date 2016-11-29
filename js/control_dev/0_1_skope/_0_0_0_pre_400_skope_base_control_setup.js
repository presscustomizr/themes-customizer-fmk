

/*****************************************************************************
* THE SKOPE BASE OBJECT
*****************************************************************************/
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {
    /*****************************************************************************
    * SETUP CONTROL RESET ON SECTION EXPANSION + SKOPE SWITCH
    *****************************************************************************/
    //fired on section expansion + skope switch, when silentlyUpdateSettings.done()
    //@param obj :
    //{
    //  controls : [] of controls or controlId string
    //  section_id : string
    //}
    setupActiveSkopedControls : function( obj ) {
          var self = this, section_id, controls, setupParams,
              defaultSetupParams = {
                    controls : [],
                    section_id : api.czr_activeSectionId()
              };
          setupParams = $.extend( defaultSetupParams, obj );

          //api.consoleLog('SETUP CONTROLS RESET ?', obj.controls );

          if ( ! _.isObject( setupParams ) || ! _.has( setupParams, 'controls' ) || ! _.has( setupParams, 'section_id' ) ) {
                throw new Error( 'SetupControlsReset : the setupParams param must be an object with properties controls and section_id.');
          }

          section_id = setupParams.section_id;
          controls = setupParams.controls;

          if ( _.isEmpty( section_id ) || ! _.isString( section_id ) ) {
                section_id = api.czr_activeSectionId();
          }
          if ( _.isEmpty( controls ) ) {
                controls = api.CZR_Helpers.getSectionControlIds( section_id  );
          }

          controls = _.isString( controls ) ? [controls] : controls;

          //filter only eligible ctrlIds
          controls = _.filter( controls, function( ctrlId ) {
              return true;
              //return self.isSettingSkopeEligible( ctrlId );
              //return self.isSettingResetEligible( ctrlId );
          });

          if ( _.isEmpty(controls) )
            return;

          $.when( self.renderControlsSingleReset( controls ) ).done( function() {
                console.log('RENDER CONTROL SINGLE RESET DONE', controls );
                //add observable Value(s) to the section control
                self.listenSkopedControls( controls );
          });

          self.renderControlSkopeNotice( controls );
    },



    //@params controls = array of control ids candidate to setup
    //Only the Settings eligible to skope
    listenSkopedControls : function( controls ) {
          var self = this;
          _.each( controls, function( ctrlId ) {
                if ( ! api.has( ctrlId ) || _.isUndefined( api.control( ctrlId ) ) )
                  return;
                var ctrl = api.control( ctrlId ),
                    shortSetId = api.CZR_Helpers.getOptionName( ctrlId ),
                    defaults = {
                          hasDBVal : false,
                          isDirty : false,
                          noticeVisible : false,
                          resetVisible : false
                    },
                    initial_states = {};

                //Declare an observable Value
                //Bind it
                //Set it
                if ( ! _.has( ctrl, 'czr_state' ) ) {
                      ctrl.czr_state = new api.Value( defaults );
                      console.log('CTRL BOUND : ', ctrl.id );
                      ctrl.czr_state.bind( function( to, from ) {
                            self.controlStateReact( ctrl, to, from );
                      });
                }

                //Set it
                initial_states = _.extend(
                      defaults,
                      {
                            hasDBVal : api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( ctrlId ),
                            isDirty : api.czr_skope( api.czr_activeSkopeId() ).getSkopeSettingDirtyness( ctrlId )
                      }
                );
                ctrl.czr_state( initial_states );


                //api.consoleLog( 'SETUP CONTROL VALUES ?', ctrlId, api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( ctrlId ) );


                if ( ! _.has( ctrl, 'userEventMap' ) ) {
                      ctrl.userEventMap = [
                            {
                                  trigger   : 'click keydown',
                                  selector  : '.czr-setting-reset, .czr-cancel-button',
                                  name      : 'control_reset_warning',
                                  actions   : function() {
                                        if ( ! ctrl.czr_state().isDirty && ! ctrl.czr_state().hasDBVal )
                                          return;
                                        //close all other warnings expanded in the section
                                        _.each( _.without( api.CZR_Helpers.getSectionControlIds( ctrl.section() ), ctrlId ) , function( _id ) {
                                              if ( _.has( api.control(_id), 'czr_state') ) {
                                                    var _current_state = $.extend( true, {}, api.control(_id).czr_state() ),
                                                        _new_state = _.extend( _current_state, { resetVisible : false } );
                                                    api.control(_id).czr_state( _new_state );
                                              }
                                        });
                                        var _current_ctrl_state = $.extend( true, {}, ctrl.czr_state() ),
                                            _new_ctrl_state = _.extend( _current_ctrl_state, { resetVisible : ! ctrl.czr_state().resetVisible } );

                                        ctrl.czr_state( _new_ctrl_state );
                                  }
                            },
                            //skope reset : do reset
                            {
                                  trigger   : 'click keydown',
                                  selector  : '.czr-control-do-reset',
                                  name      : 'control_do_reset',
                                  actions   : function() {
                                        self.doResetSetting( ctrlId );
                                  }
                            },
                            {
                                  trigger   : 'click keydown',
                                  selector  : '.czr-skope-switch',
                                  name      : 'control_skope_switch',
                                  actions   : function( params ) {
                                        var _skopeIdToSwithTo = $( params.dom_event.currentTarget, params.dom_el ).attr('data-skope-id');
                                        if ( ! _.isEmpty( _skopeIdToSwithTo ) && api.czr_skope.has( _skopeIdToSwithTo ) )
                                          api.czr_activeSkopeId( _skopeIdToSwithTo );
                                  }
                            },
                            //Toggle Notice
                            {
                                  trigger   : 'click keydown',
                                  selector  : '.czr-toggle-notice',
                                  name      : 'control_toggle_notice',
                                  actions   : function( params ) {
                                        var _current_state = $.extend( true, {}, ctrl.czr_state() ),
                                            _new_state = _.extend( _current_state, { noticeVisible : ! ctrl.czr_state().noticeVisible } );

                                        ctrl.czr_state( _new_state );
                                  }
                            }
                      ];
                      api.CZR_Helpers.setupDOMListeners( ctrl.userEventMap , { dom_el : ctrl.container }, self );
                }
          });
    },


    //@param ctrl = control instance
    //@param to = new state
    //@param from = previous state
    //callback of ctrl.czr_state
    //The ctrl.czr_state value looks like :
    //{
    // hasDBVal : false,
    // isDirty : false,
    // noticeVisible : false,
    // resetVisible : false
    //}
    controlStateReact : function( ctrl, to, from ) {
          console.log(' IN CONTROL STATE REACT ', ctrl.id, to, from);
          var self = this,
              defaults = {
                    hasDBVal : false,
                    isDirty : false,
                    noticeVisible : false,
                    resetVisible : false
              };
          if ( ! api.control.has( ctrl.id ) ) {
                throw new Error( 'in controlStateReact, the provided ctrl id is not registered in the api : ' + ctrl.id );
          }
          //normalize
          to    = _.extend( defaults, to );
          from  = _.extend( defaults, from );

          //init observ. values + react to changes
          //DB VALS
          ctrl.container.toggleClass( 'has-db-val', to.hasDBval );

          //API DIRTYNESS
          ctrl.container.toggleClass( 'is-dirty', to.isDirty );

          //NOTICE VISIBILITY
          ctrl.container.toggleClass( 'czr-notice-visible', to.noticeVisible );
          var $noticeContainer = ctrl.getNotificationsContainerElement();
          if ( false !== $noticeContainer && false !== $noticeContainer.length ) {
                if ( ! to.noticeVisible ) {
                      $noticeContainer
                            .stop()
                            .slideUp( 'fast', null, function() {
                                  $( this ).css( 'height', 'auto' );
                            } );
                } else {
                      $noticeContainer
                            .stop()
                            .slideDown( 'fast', null, function() {
                                  $( this ).css( 'height', 'auto' );
                            } );
                }
          }

          //RESET VISIBILITY
          var section_id = ctrl.section() || api.czr_activeSectionId();
          if ( to.resetVisible ) {
                $.when( self.renderControlResetWarningTmpl( ctrl.id ) ).done( function( $_resetWarning ) {
                      ctrl.czr_resetWarning = $_resetWarning;
                      $_resetWarning.slideToggle('fast');
                });
          } else {
                if ( _.has( ctrl, 'czr_resetWarning' ) && ctrl.czr_resetWarning.length )
                      $.when( ctrl.czr_resetWarning.slideToggle('fast') ).done( function() {
                            ctrl.czr_resetWarning.remove();
                      });
          }
    }
});//$.extend()