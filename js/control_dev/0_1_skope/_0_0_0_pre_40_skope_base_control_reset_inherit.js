

/*****************************************************************************
* THE SKOPE BASE OBJECT
*****************************************************************************/
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {
    /*****************************************************************************
    * SETUP CONTROL RESET ON SECTION EXPANSION + SKOPE SWITCH
    *****************************************************************************/
    //fired on section expansion + skope switch
    //@param obj :
    //{
    //  controls : [] of controls or controlId string
    //  section_id : string
    //}
    setupControlsReset : function( obj ) {
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

          //filter only eligible setIds
          controls = _.filter( controls, function( setId ) {
              return true;
              //return self.isSettingSkopeEligible( setId );
              //return self.isSettingResetEligible( setId );
          });

          if ( _.isEmpty(controls) )
            return;

          $.when( self.renderControlsSingleReset( controls ) ).done( function() {
                //add observable Value(s) to the section control
                self.setupControlsValues( controls );
          });

    },

    //fired on
    //1) active section expansion
    //2) and on skope switch
    //render each control reset icons with a delay
    //=> because some control like media upload are re-rendered on section expansion
    //@params controls = array of skope eligible control ids
    renderControlsSingleReset : function( controls ) {
          var self = this;
          //create the control ids list if not set
          if ( _.isUndefined( controls ) || _.isEmpty( controls ) ) {
                controls = api.CZR_Helpers.getSectionControlIds( api.czr_activeSectionId() );
                //filter only eligible setIds
                controls = _.filter( controls, function( setId ) {
                    return self.isSettingSkopeEligible( setId );
                });
          }

          var setIds = _.isArray(controls) ? controls : [controls],
              render_reset_icons = function( setIds ) {
                    //api.consoleLog('IN RENDER RESET ICONS', setIds );
                    _.each( setIds, function( _id ) {
                          //stop here if the control is not registered in the api.
                          //can happen in scenarios when a control gets removed and added back.
                          if ( ! api.control.has( _id ) )
                            return;
                          var ctrl = api.control( _id );

                          // if ( ! _.has( ctrl, 'czr_hasDBVal' ) || ! _.has( ctrl, 'czr_isDirty' ) || ! _.has( ctrl, 'czr_resetVisibility' ) ) {
                          //       api.consoleLog('IN RENDER, TOGGLE CLASSES ?', _id );

                          //       self.setupControlsValues( _id );
                          // } else {
                          //     // //toggle classes when needed
                          //     ctrl.container.toggleClass( 'has-db-val', ctrl.czr_hasDBVal() );
                          //     ctrl.container.toggleClass( 'is-dirty', ctrl.czr_isDirty() );
                          // }

                          if( $('.czr-setting-reset', ctrl.container ).length )
                            return;

                          ctrl.deferred.embedded.then( function() {
                                $.when( ctrl.container
                                    .find('.customize-control-title').first()//was.find('.customize-control-title')
                                    .prepend( $( '<span/>', {
                                      class : 'czr-setting-reset fa fa-refresh',
                                      title : 'Reset'
                                    }))).done( function(){
                                  $('.czr-setting-reset', ctrl.container).fadeIn(400);
                                });

                          });//then()
                    });//_each
              };

          //debounce because some control like media upload are re-rendered on section expansion
          render_reset_icons = _.debounce( render_reset_icons , 500 );
          render_reset_icons(setIds);
    },


    //@params controls = array of control candidate to setup
    //Only the Settings eligible to skope
    setupControlsValues : function( controls ) {
          var self = this;
          _.each( controls, function( setId ) {
                if ( ! api.has( setId ) || _.isUndefined( api.control( setId ) ) )
                  return;
                var ctrl = api.control( setId ),
                    shortSetId = api.CZR_Helpers.getOptionName( setId );

                if ( ! _.has( ctrl, 'czr_hasDBVal' ) && ! _.has( ctrl, 'czr_isDirty' ) ) {
                      ctrl.czr_hasDBVal = new api.Value(false);
                      ctrl.czr_isDirty = new api.Value(false);

                      //init observ. values + react to changes
                      ctrl.czr_hasDBVal.bind( function( has_db_val ) {
                            ctrl.container.toggleClass( 'has-db-val', has_db_val );
                      });
                      ctrl.czr_isDirty.bind( function( is_dirty ) {
                            ctrl.container.toggleClass( 'is-dirty', is_dirty );
                      });
                }

                //api.consoleLog( 'SETUP CONTROL VALUES ?', setId, ctrl.czr_hasDBVal(), api.czr_skope( api.czr_activeSkope() ).hasSkopeSettingDBValues( setId ) );

                //set
                ctrl.czr_hasDBVal(
                      api.czr_skope( api.czr_activeSkope() ).hasSkopeSettingDBValues( setId )
                );
                //set
                ctrl.czr_isDirty( api.czr_skope( api.czr_activeSkope() ).getSkopeSettingDirtyness( setId ) );

                if ( ! _.has( ctrl, 'czr_resetVisibility' ) ) {
                      ctrl.czr_resetVisibility = new api.Value(false);
                      //Reset actions
                      ctrl.czr_resetVisibility.bind( function( visible ) {
                          self.controlResetVisibilityReact( visible, setId );
                      });
                }

                if ( ! _.has( ctrl, 'userEventMap' ) ) {
                      ctrl.userEventMap = [
                            {
                                  trigger   : 'click keydown',
                                  selector  : '.czr-setting-reset, .czr-cancel-button',
                                  name      : 'control_reset_warning',
                                  actions   : function() {
                                        if ( ! ctrl.czr_isDirty() && ! ctrl.czr_hasDBVal() )
                                          return;
                                        //close all other warnings expanded in the section
                                        _.each( _.without( api.CZR_Helpers.getSectionControlIds( ctrl.section() ), setId ) , function( _id ) {
                                              if ( _.has( api.control(_id), 'czr_resetVisibility') )
                                                api.control(_id).czr_resetVisibility(false);
                                        });
                                        ctrl.czr_resetVisibility( ! ctrl.czr_resetVisibility() );
                                  }
                            },
                            //skope reset : do reset
                            {
                                  trigger   : 'click keydown',
                                  selector  : '.czr-control-do-reset',
                                  name      : 'control_do_reset',
                                  actions   : function() {
                                        self.doResetSetting( setId );
                                  }
                            }
                      ];
                      api.CZR_Helpers.setupDOMListeners( ctrl.userEventMap , { dom_el : ctrl.container }, self );
                }
          });
    },



    //@cb of : ctrl.czr_resetVisibility
    controlResetVisibilityReact : function( visible, setId ) {
          var self = this,
              ctrl = api.control( setId ),
              section_id = ctrl.section() || api.czr_activeSectionId();

          if ( visible ) {
                $.when( self.renderControlResetWarningTmpl(setId ) ).done( function( $_resetWarning ) {
                      ctrl.czr_resetWarning = $_resetWarning;
                      $_resetWarning.slideToggle('fast');
                });
          } else {
                if ( _.has( ctrl, 'czr_resetWarning' ) && ctrl.czr_resetWarning.length )
                      $.when( ctrl.czr_resetWarning.slideToggle('fast') ).done( function() {
                            ctrl.czr_resetWarning.remove();
                      });
          }

    },


    renderControlResetWarningTmpl : function( setId ) {
          var self = this,
              ctrl = api.control( setId ),
              _tmpl = '',
              warning_message,
              success_message;

          if ( ctrl.czr_isDirty() ) {
              warning_message = 'Are you sure you want to reset your current customizations for this control?';
              success_message = 'Your customizations have been reset.';
          } else {
              warning_message = 'Are you sure you want to reset this option to default?';
              success_message = 'The options have been reset to defaults.';
          }

          try {
            _tmpl =  wp.template('czr-reset-control')(
                {
                  warning_message : warning_message,
                  success_message : success_message
                }
            );
          }
          catch(e) {
            throw new Error('Error when parsing the the reset control template : ' + e );
          }

          $('.customize-control-title', ctrl.container).first().after( $( _tmpl ) );

          return $( '.czr-ctrl-reset-warning', ctrl.container );
    },

    //fired on user click
    doResetSetting : function( setId ) {
          var self = this,
              ctrl = api.control(setId),
              skope_id = api.czr_activeSkope(),
              reset_method = ctrl.czr_isDirty() ? '_resetControlDirtyness' : '_resetControlAPIVal',
              _do_reset = function( setId ) {
                    $.when(
                          self[reset_method](setId),
                          api.czr_skopeBase.silentlyUpdateSettings( setId )
                    ).done( function() {
                          $('.czr-reset-success', ctrl.container ).fadeIn('300');
                          api.previewer.refresh();
                          setTimeout( function() {
                              ctrl.container.removeClass('czr-resetting-control');//hides the spinner
                              ctrl.czr_resetVisibility(false);
                              self.setupControlsReset( { controls : [ setId ] } );
                          }, 2000 );
                    });

              };

          ctrl.container.addClass('czr-resetting-control');
          api.consoleLog('DO RESET SETTING', setId );

          if ( ctrl.czr_isDirty() ) {
                _do_reset( setId );
          } else {
                $.when( api.previewer.czr_reset( skope_id, setId ) ).done( function() {
                  _do_reset( setId );
                }).fail( function(response) {
                        $('.czr-reset-fail', ctrl.container ).fadeIn('300');
                        $('.czr-reset-fail', ctrl.container ).append('<p>' + response + '</p>');
                        setTimeout( function() {
                            ctrl.czr_resetVisibility(false);
                        }, 3000 );
                });
          }

    },

    _resetControlDirtyness : function( setId ) {
          var skope_instance = api.czr_skope( api.czr_activeSkope() ),
              current_dirties = skope_instance.dirtyValues(),
              new_dirties = $.extend( true, {}, current_dirties );

          new_dirties = _.omit( new_dirties, setId );
          skope_instance.dirtyValues( new_dirties );
          //inform the api about the new dirtyness state
          api.state('saved')( ! api.czr_skopeBase.isAPIDirty() );
    },

    _resetControlAPIVal : function( setId ) {
          var skope_model = api.czr_skope( api.czr_activeSkope() )(),
              new_skope_model = $.extend( true, {}, skope_model ),
              current_skope_db = new_skope_model.db,
              new_skope_db = $.extend( true, {}, current_skope_db ),
              shortSetId = api.CZR_Helpers.getOptionName(setId),
              reset_control_db_state = function( setId ) {
                    if ( _.has(api.control( setId ), 'czr_hasDBVal') )
                        api.control(setId).czr_hasDBVal(false);
              };

          if ( 'global' == skope_model.skope ) {
                _.each( api.czr_globalDBoptions(), function( _id ) {
                      if ( _id == shortSetId )
                        reset_control_db_state( setId );
                });
          } else {
                reset_control_db_state( setId );
          }

          api.consoleLog('SKOPE DB VAL AFTER RESET?', new_skope_db );

          //update the skope db property and say it
          new_skope_model.db = _.omit( new_skope_db, shortSetId );
          new_skope_model.has_db_val = ! _.isEmpty( new_skope_model.db );
          api.czr_skope( skope_model.id ).hasDBValues( new_skope_model.has_db_val );

          api.consoleLog('new_skope_model ?', new_skope_model );

          api.czr_skope( skope_model.id )( new_skope_model );
    },



    /*****************************************************************************
    * SETUP CONTROL INHERITANCE INFOS
    *****************************************************************************/
    setupControlsInheritance : function( controls ) {
          var self = this,
              section_id = api.czr_activeSectionId();

          api.consoleLog('SETUP CONTROLS RESET ?', controls );
          controls = _.isUndefined( controls ) ? api.CZR_Helpers.getSectionControlIds( section_id  ) : controls;
          controls = _.isString( controls ) ? [controls] : controls;

          //filter only eligible setIds
          controls = _.filter( controls, function( setId ) {
              return self.isSettingSkopeEligible( setId );
          });

          if ( _.isEmpty(controls) )
            return;

          $.when( self.renderControlsSingleReset( controls ) ).done( function() {
                //add observable Value(s) to the section control
                self.setupControlsValues( controls );
          });

    },


});//$.extend()