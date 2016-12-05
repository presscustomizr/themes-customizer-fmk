

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
              var setId = api.CZR_Helpers.getControlSettingId( ctrlId );
              return setId && self.isSettingSkopeEligible( setId );
              //return true;
              //return self.isSettingSkopeEligible( ctrlId );
              //return self.isSettingResetEligible( ctrlId );
          });

          if ( _.isEmpty(controls) )
            return;

          $.when( self.renderControlsSingleReset( controls ) ).done( function() {
                //api.consoleLog('RENDER CONTROL SINGLE RESET DONE', controls );
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

                //Declare observable Values
                // + Bind them
                if ( ! _.has( ctrl, 'czr_states' ) ) {
                      ctrl.czr_states = new api.Values();
                      _.each( defaults, function( _state_val, _state_name ) {
                            ctrl.czr_states.create( _state_name );
                      });

                      self.bindControlStates( ctrl );

                }

                //Set them
                // initial_states = _.extend(
                //       defaults,
                //       {
                //             hasDBVal : api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( ctrlId ),
                //             isDirty : api.czr_skope( api.czr_activeSkopeId() ).getSkopeSettingDirtyness( ctrlId )
                //       }
                // );
                ctrl.czr_states( 'hasDBVal' )( api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( ctrlId ) );
                ctrl.czr_states( 'isDirty' )( api.czr_skope( api.czr_activeSkopeId() ).getSkopeSettingDirtyness( ctrlId ) );

                //api.consoleLog( 'SETUP CONTROL VALUES ?', ctrlId, api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( ctrlId ) );


                if ( ! _.has( ctrl, 'userEventMap' ) ) {
                      ctrl.userEventMap = [
                            //toggle reset dialog
                            {
                                  trigger   : 'click keydown',
                                  selector  : '.czr-setting-reset, .czr-cancel-button',
                                  name      : 'control_reset_warning',
                                  actions   : function() {
                                        if ( ! ctrl.czr_states('isDirty')() && ! ctrl.czr_states( 'hasDBVal' )() )
                                          return;
                                        //close all other warnings expanded in the section
                                        _.each( _.without( api.CZR_Helpers.getSectionControlIds( ctrl.section() ), ctrlId ) , function( _id ) {
                                              if ( _.has( api.control(_id), 'czr_states') ) {
                                                    api.control(_id).czr_states( 'resetVisible' )( false );
                                              }
                                        });
                                        ctrl.czr_states( 'resetVisible' )( ! ctrl.czr_states( 'resetVisible' )() );
                                        //collapse the control notice expanded if resetting requested
                                        if ( ctrl.czr_states( 'resetVisible' )() ) {
                                              ctrl.czr_states( 'noticeVisible' )( false );
                                        }
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
                            //skope switch
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
                                        ctrl.czr_states( 'noticeVisible' )( ! ctrl.czr_states( 'noticeVisible' )() );
                                        //collapse the control reset dialog expanded
                                        if ( ctrl.czr_states( 'noticeVisible' )() ) {
                                              ctrl.czr_states( 'resetVisible' )( false );
                                        }
                                  }
                            }
                      ];
                      api.CZR_Helpers.setupDOMListeners( ctrl.userEventMap , { dom_el : ctrl.container }, self );
                }
          });
    },

    //The ctrl.czr_states registered api.Values are :
    //hasDBVal : false,
    //isDirty : false,
    //noticeVisible : false,
    //resetVisible : false
    bindControlStates : function( ctrl ) {
          if ( ! api.control.has( ctrl.id ) ) {
                throw new Error( 'in bindControlStates, the provided ctrl id is not registered in the api : ' + ctrl.id );
          }
          var self = this;
          //DB VALS
          ctrl.czr_states('hasDBVal').bind( function( bool ) {
                ctrl.container.toggleClass( 'has-db-val', bool );
          });

          //API DIRTYNESS
          ctrl.czr_states('isDirty').bind( function( bool ) {
                ctrl.container.toggleClass( 'is-dirty', bool );
          });

          //NOTICE VISIBILITY
          ctrl.czr_states('noticeVisible').bind( function( visible ) {
                ctrl.container.toggleClass( 'czr-notice-visible', visible );
                var $noticeContainer = ctrl.getNotificationsContainerElement();
                if ( false !== $noticeContainer && false !== $noticeContainer.length ) {
                      if ( ! visible ) {
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
          });

          //RESET VISIBILITY
          ctrl.czr_states('resetVisible').bind( function( visible ) {
                var section_id = ctrl.section() || api.czr_activeSectionId();
                if ( visible ) {
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
          });
    }
});//$.extend()