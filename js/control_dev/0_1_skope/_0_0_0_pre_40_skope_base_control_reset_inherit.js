

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
    setupControlsViews : function( obj ) {
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

          self.renderControlSkopeNotice( controls );

    },

    //fired when a section is expanded
    //fired when a setting value is changed
    renderControlSkopeNotice : function( controls ) {
          var self = this,
              controlIds = _.isArray(controls) ? controls : [controls],
              _buildSkopeLink = function( skope_id ) {
                    return [ '<span class="czr-skope-switch" data-skope-id="' + skope_id + '">', api.czr_skope( skope_id )().title, '</span>' ].join( '' );
              },
              _generateControlNotice = function( setId, _localSkopeId ) {
                    var _currentSkopeId         = api.czr_activeSkopeId(),
                        _inheritedFromSkopeId   = self.getInheritedSkopeId( setId, _currentSkopeId ),
                        _overridedBySkopeId     = self.getAppliedPrioritySkopeId( setId, _currentSkopeId ),
                        _html = [],
                        _isCustomized,
                        _hasDBVal;

                    //////////////////////
                    /// CASE 1
                    if ( _inheritedFromSkopeId == _overridedBySkopeId && api.czr_skope.has( _inheritedFromSkopeId ) && _currentSkopeId == _inheritedFromSkopeId ) {
                          //is the setId customized in the current skope ?
                          _isCustomized = ! _.isUndefined( api.czr_skope( _currentSkopeId ).dirtyValues()[setId] );
                          _hasDBVal     = ! _.isUndefined( api.czr_skope( _currentSkopeId ).dbValues()[setId] );

                          if ( _isCustomized ) {
                                _html.push( [
                                      'Customized and not published in the current scope (',
                                      api.czr_skope( _inheritedFromSkopeId )().title,
                                      ')'
                                ].join(' ') );
                          } else {
                                if ( _hasDBVal ) {
                                      _html.push( [
                                            'Customized and published in the current scope (',
                                            api.czr_skope( _inheritedFromSkopeId )().title,
                                            ')'
                                      ].join(' ') );
                                } else {
                                      _html.push( 'Default website value' );
                                }
                          }
                    }


                    /////////////////////
                    /// CASE 2
                    if ( _inheritedFromSkopeId !== _currentSkopeId && api.czr_skope.has( _inheritedFromSkopeId ) ) {
                          //is the setId customized in the current skope ?
                          _isCustomized = ! _.isUndefined( api.czr_skope( _inheritedFromSkopeId ).dirtyValues()[setId] );
                          _hasDBVal     = ! _.isUndefined( api.czr_skope( _inheritedFromSkopeId ).dbValues()[setId] );
                          if ( ! _isCustomized && ! _hasDBVal ) {
                                _html.push( 'Default website value' );
                          } else {
                                _html.push( 'Inherited from : ' + _buildSkopeLink( _inheritedFromSkopeId ) );
                          }
                    }



                    /////////////////////
                    /// CASE 3
                    if ( _overridedBySkopeId !== _currentSkopeId && api.czr_skope.has( _overridedBySkopeId ) ) {
                          //is the setId customized or saved in the winner skope ?
                          //_hasDBVal = ! _.isUndefined( api.czr_skope( _overridedBySkopeId ).dbValues()[setId] );
                          _isCustomized = ! _.isUndefined( api.czr_skope( _overridedBySkopeId ).dirtyValues()[setId] );

                          _html.push( [
                                ! _isCustomized ? 'The value currently published on front end for ' : 'The value that will be published on front end for',
                                api.czr_skope( _localSkopeId )().title,
                                ! _isCustomized ? 'is set in scope :' : 'is customized in scope :',
                                _buildSkopeLink( _overridedBySkopeId )
                          ].join(' ') );
                    }

                    return _html.join(' | ');
              };

          _.each( controlIds, function( _id ) {
                api.control.when( _id, function() {
                      var ctrl = api.control( _id ),
                          setId = api.CZR_Helpers.getControlSettingId( _id );//get the relevant setting_id for this control

                      ctrl.deferred.embedded.then( function() {
                            var _localSkopeId = _.findWhere( api.czr_currentSkopesCollection(), { skope : 'local' } ).id,
                                $noticeContainer = ctrl.getNotificationsContainerElement();

                            if ( ! $noticeContainer || ! $noticeContainer.length || _.isUndefined( _localSkopeId ) )
                              return;

                            _html = _generateControlNotice( setId, _localSkopeId );

                            if ( _.isEmpty( _html ) ) {
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

                            if ( $( '.czr-skope-notice', $noticeContainer ).length ) {
                                  $( '.czr-skope-notice', $noticeContainer ).html( _html );
                            } else {
                                  $noticeContainer.append(
                                        [ '<span class="czr-notice czr-skope-notice">', _html ,'</span>' ].join('')
                                  );
                            }
                      });

                });

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
                //filter only eligible controlIds
                controls = _.filter( controls, function( _id ) {
                    var setId = api.CZR_Helpers.getControlSettingId( _id );
                    return self.isSettingSkopeEligible( setId );
                });
          }

          var controlIds = _.isArray(controls) ? controls : [controls],
              render_reset_icons = function( setIds ) {
                    //api.consoleLog('IN RENDER RESET ICONS', setIds );
                    _.each( controlIds, function( _id ) {
                          api.control.when( _id, function() {
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
                                            } ) ) )
                                      .done( function(){
                                            $('.czr-setting-reset', ctrl.container).fadeIn( 400 );
                                      });
                                });//then()
                          });//when()
                    });//_each
              };

          //debounce because some control like media upload are re-rendered on section expansion
          render_reset_icons = _.debounce( render_reset_icons , 500 );
          render_reset_icons( controlIds );
    },


    //@params controls = array of control ids candidate to setup
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
                      ctrl.czr_hasDBVal.bind( function( has_dbval ) {
                            ctrl.container.toggleClass( 'has-db-val', has_dbval );
                      });
                      ctrl.czr_isDirty.bind( function( is_dirty ) {
                            ctrl.container.toggleClass( 'is-dirty', is_dirty );
                      });
                }

                //api.consoleLog( 'SETUP CONTROL VALUES ?', setId, ctrl.czr_hasDBVal(), api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( setId ) );

                //set
                ctrl.czr_hasDBVal( api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( setId ) );
                //set
                ctrl.czr_isDirty( api.czr_skope( api.czr_activeSkopeId() ).getSkopeSettingDirtyness( setId ) );

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
              skope_id = api.czr_activeSkopeId(),
              reset_method = ctrl.czr_isDirty() ? '_resetControlDirtyness' : '_resetControlAPIVal',
              _do_reset = function( setId ) {

                    self[reset_method](setId);

                    $api.czr_skopeBase.silentlyUpdateSettings( setId ).done( function() {
                          $('.czr-reset-success', ctrl.container ).fadeIn('300');
                          ctrl.container.removeClass('czr-resetting-control');//hides the spinner
                          ctrl.czr_resetVisibility(false);
                          self.setupControlsViews( { controls : [ setId ] } );
                    });

              };

          ctrl.container.addClass('czr-resetting-control');
          api.consoleLog('DO RESET SETTING', setId );

          if ( ctrl.czr_isDirty() ) {
                _do_reset( setId );
          } else {
                api.previewer.czr_reset( skope_id, setId )
                      .done( function( r ) {
                            _do_reset( setId );
                      })
                      .fail( function( r ) {
                              $('.czr-reset-fail', ctrl.container ).fadeIn('300');
                              $('.czr-reset-fail', ctrl.container ).append('<p>' + response + '</p>');
                              ctrl.czr_resetVisibility(false);
                      });
          }

    },

    _resetControlDirtyness : function( setId ) {
          var skope_instance = api.czr_skope( api.czr_activeSkopeId() ),
              current_dirties = skope_instance.dirtyValues(),
              new_dirties = $.extend( true, {}, current_dirties );

          new_dirties = _.omit( new_dirties, setId );
          skope_instance.dirtyValues( new_dirties );
          //inform the api about the new dirtyness state
          api.state('saved')( ! api.czr_skopeBase.isAPIDirty() );
    },

    _resetControlAPIVal : function( setId ) {
          var skope_model       = api.czr_skope( api.czr_activeSkopeId() )(),
              new_skope_model   = $.extend( true, {}, skope_model ),
              current_skope_db  = api.czr_skope( api.czr_activeSkopeId() ).dbValues(),
              new_skope_db      = $.extend( true, {}, current_skope_db ),
              reset_control_db_state = function( setId ) {
                    if ( _.has(api.control( setId ), 'czr_hasDBVal') )
                        api.control(setId).czr_hasDBVal(false);
              };

          reset_control_db_state( setId );

          api.consoleLog('SKOPE DB VAL AFTER RESET?', new_skope_db );

          //update the skope db property and say it
          api.czr_skope( skope_model.id ).dbValues( _.omit( new_skope_db, setId ) );

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