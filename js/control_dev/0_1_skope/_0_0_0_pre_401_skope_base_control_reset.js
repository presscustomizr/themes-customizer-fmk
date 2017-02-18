

/*****************************************************************************
* THE SKOPE BASE OBJECT
*****************************************************************************/
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {
    //fired on
    //1) active section expansion
    //2) and on skope switch
    //render each control reset icons with a delay
    //=> because some control like media upload are re-rendered on section expansion
    //@params controls = array of skope eligible control ids
    renderControlsSingleReset : function( controls ) {
          var self = this, dfd = $.Deferred();
          //create the control ids list if not set
          if ( _.isUndefined( controls ) || _.isEmpty( controls ) ) {
                controls = api.CZR_Helpers.getSectionControlIds( api.czr_activeSectionId() );
                //filter only eligible controlIds
                controls = _.filter( controls, function( _id ) {
                      var setId = api.CZR_Helpers.getControlSettingId( _id );
                      return setId && self.isSettingSkopeEligible( setId );
                });
          }

          var controlIds = _.isArray(controls) ? controls : [controls],
              render_reset_icons = function( ctrlIds ) {
                    if ( _.isEmpty( ctrlIds ) ) {
                          dfd.resolve();
                          return;
                    }
                    //api.consoleLog('IN RENDER RESET ICONS', ctrlIds );
                    _.each( ctrlIds, function( _id ) {
                          api.control.when( _id, function() {
                                var ctrl  = api.control( _id ),
                                    setId = api.CZR_Helpers.getControlSettingId( _id );

                                if( $('.czr-setting-reset', ctrl.container ).length ) {
                                      dfd.resolve();
                                      return;
                                }

                                ctrl.deferred.embedded.then( function() {
                                      $.when(
                                            ctrl.container
                                                  .find('.customize-control-title').first()//was.find('.customize-control-title')
                                                  .prepend( $( '<span/>', {
                                                        class : 'czr-setting-reset fa fa-refresh',
                                                        title : ''
                                                  } ) ) )
                                      .done( function(){
                                            ctrl.container.addClass('czr-skoped');
                                            $('.czr-setting-reset', ctrl.container).fadeIn( 400 );
                                            dfd.resolve();
                                      });
                                });//then()
                          });//when()
                    });//_each
              };

          //debounce because some control like media upload are re-rendered on section expansion
          render_reset_icons = _.debounce( render_reset_icons , 200 );
          render_reset_icons( controlIds );
          return dfd.promise();
    },



    //Fired in self.bindControlStates()
    //@uses The ctrl.czr_states('isDirty') value
    renderControlResetWarningTmpl : function( ctrlId ) {
          if ( ! api.control.has( ctrlId ) )
            return {};

          var self = this,
              ctrl = api.control( ctrlId ),
              setId = api.CZR_Helpers.getControlSettingId( ctrlId ),

              _tmpl = '',
              warning_message,
              success_message,
              isWPSetting = ( function() {
                    //exclude the WP built-in settings like blogdescription, show_on_front, etc
                    if ( _.contains( serverControlParams.wpBuiltinSettings, api.CZR_Helpers.getOptionName( setId ) ) )
                      return true;
                    if ( ! _.contains( serverControlParams.themeSettingList, api.CZR_Helpers.getOptionName( setId ) ) )
                      return true;
                    return false;
              })();

          if ( ctrl.czr_states( 'isDirty' )() ) {
                warning_message = [
                    'Please confirm that you want to reset your current customizations for this option in ',//@to_translate
                    api.czr_skope( api.czr_activeSkopeId() )().title,
                    '.',
                ].join('');
                success_message = 'Your customizations have been reset.';//@to_translate
          } else {
                if ( isWPSetting && 'global' == api.czr_skope( api.czr_activeSkopeId() )().skope ) {
                      warning_message = 'This WordPress setting can not be reset site wide.';//@to_translate
                } else {
                      warning_message = [
                          'Please confirm that you want to reset this option in ',//@to_translate
                          api.czr_skope( api.czr_activeSkopeId() )().title,
                          '.'
                      ].join('');//@to_translate
                      success_message = 'The options have been reset.';//@to_translate
                }
          }

          //The setting can not be reset if :
          //1) WP setting
          //2) global skope
          //3) setting not dirty => db reset
          var is_authorized = ! ( isWPSetting && 'global' == api.czr_skope( api.czr_activeSkopeId() )().skope && ! ctrl.czr_states( 'isDirty' )() ),
              _tmpl_data = {
                    warning_message : warning_message,
                    success_message : success_message,
                    is_authorized : is_authorized
              };
          try {
                _tmpl =  wp.template('czr-reset-control')( _tmpl_data );
          } catch( er ) {
                api.errorLog( 'Error when parsing the the reset control template : ' + er );//@to_translate
                return { container : false, is_authorized : false };
          }

          $('.customize-control-title', ctrl.container).first().after( $( _tmpl ) );

          return { container : $( '.czr-ctrl-reset-warning', ctrl.container ), is_authorized : is_authorized };
    },


    //Fired on user click
    //Defined in the ctrl user event map
    //@uses The ctrl.czr_states values
    //Will fire a different callback, whether the setting is dirty or has db val
    doResetSetting : function( ctrlId ) {
          var self = this,
              setId = api.CZR_Helpers.getControlSettingId( ctrlId ),
              ctrl = api.control( ctrlId ),
              skope_id = api.czr_activeSkopeId(),
              reset_method = ctrl.czr_states( 'isDirty' )() ? '_resetControlDirtyness' : '_resetControlAPIVal',
              _setResetDialogVisibility = function( ctrl, val ) {
                    val = _.isUndefined( val ) ? false : val;//@todo why this ?
                    ctrl.czr_states( 'resetVisible' )( false );
                    ctrl.czr_states( 'isResetting' )( false);
                    ctrl.container.removeClass('czr-resetting-control');
              },
              _updateAPI = function( ctrlId ) {
                    var _silentUpdate = function() {
                              api.czr_skopeBase.processSilentUpdates( { candidates : ctrlId, refresh : false } )
                                    .fail( function() { api.consoleLog( 'Silent update failed after resetting control : ' + ctrlId ); } )
                                    .done( function() {
                                          $.when( $('.czr-crtl-reset-dialog', ctrl.container ).fadeOut('300') ).done( function() {
                                                $.when( $('.czr-reset-success', ctrl.container ).fadeIn('300') ).done( function( $_el ) {
                                                      _.delay( function() {
                                                            $.when( $_el.fadeOut('300') ).done( function() {
                                                                  _setResetDialogVisibility( ctrl );
                                                                  self.setupActiveSkopedControls( { controls : [ ctrlId ] } );
                                                                  //Display informations after reset
                                                                 _.delay( function() {
                                                                        ctrl.czr_states( 'noticeVisible' )(true);
                                                                  }, 300 );
                                                                  _.delay( function() {
                                                                        ctrl.czr_states( 'noticeVisible' )(false);
                                                                  }, 4000 );
                                                            });
                                                      }, 1000 );
                                                });
                                          });
                                    });
                    };
                    //Specific case for global :
                    //After a published value reset (not a dirty reset),
                    //we need to re-synchronize the api.settings.settings with the default theme options values
                    self[reset_method](ctrlId)
                          .done( function() {
                                api.consoleLog('REFRESH AFTER A SETTING RESET');
                                //api.previewer.refresh() method is resolved with an object looking like :
                                //{
                                //    previewer : api.previewer,
                                //    skopesServerData : {
                                //        czr_skopes : _wpCustomizeSettings.czr_skopes || [],
                                //        isChangesetDirty : boolean
                                //    },
                                // }
                                api.previewer.refresh()
                                      .fail( function( refresh_data ) {
                                            api.consoleLog('SETTING RESET REFRESH FAILED', refresh_data );
                                      })
                                      .done( function( refresh_data ) {
                                            if ( 'global' == api.czr_skope( skope_id )().skope && '_resetControlAPIVal' == reset_method ) {
                                                  var _sentSkopeCollection,
                                                      _serverGlobalDbValues = {},
                                                      _skope_opt_name = api.czr_skope( skope_id )().opt_name;

                                                  if ( ! _.isUndefined( refresh_data.skopesServerData ) && _.has( refresh_data.skopesServerData, 'czr_skopes' ) ) {
                                                        _sentSkopeCollection = refresh_data.skopesServerData.czr_skopes;
                                                        if ( _.isUndefined( _.findWhere( _sentSkopeCollection, { opt_name : _skope_opt_name } ) ) ) {
                                                              _serverGlobalDbValues = _.findWhere( _sentSkopeCollection, { opt_name : _skope_opt_name } ).db || {};
                                                        }
                                                  }
                                                  api.czr_skopeBase.maybeSynchronizeGlobalSkope( { isGlobalReset : true, isSetting : true, settingIdToReset : setId } )
                                                        .done( function() {
                                                              _silentUpdate();
                                                        });
                                            } else {
                                                  _silentUpdate();
                                            }
                                      });
                          });
              };//_updateAPI


          ctrl.czr_states( 'isResetting' )( true );
          ctrl.container.addClass('czr-resetting-control');

          //api.consoleLog('DO RESET SETTING', ctrlId, ctrl.czr_states( 'isDirty' )() );

          api.czr_skopeReset[ ctrl.czr_states( 'isDirty' )() ? 'resetChangeset' : 'resetPublished' ](
                      { skope_id : skope_id, setId : setId, is_setting : true } )
                      .done( function( r ) {
                            _updateAPI( ctrlId );
                      })
                      .fail( function( r ) {
                              $.when( $('.czr-crtl-reset-dialog', ctrl.container ).fadeOut('300') ).done( function() {
                                    $.when( $('.czr-reset-fail', ctrl.container ).fadeIn('300') ).done( function() {
                                          $('.czr-reset-fail', ctrl.container ).append('<p>' + r + '</p>');
                                          _.delay( function() {
                                                _setResetDialogVisibility( ctrl );
                                                self.setupActiveSkopedControls( { controls : [ ctrlId ] } );
                                          }, 2000 );
                                    });
                              });
                      });

    },

    //updates the current skope dirties and the changeset dirties
    _resetControlDirtyness : function( ctrlId ) {
          var setId           = api.CZR_Helpers.getControlSettingId( ctrlId ),
              skope_instance  = api.czr_skope( api.czr_activeSkopeId() ),
              current_dirties = $.extend( true, {}, skope_instance.dirtyValues() ),
              new_dirties     = {},
              current_changeset = $.extend( true, {}, skope_instance.changesetValues() ),
              new_changeset     = {},
              dfd             = $.Deferred();

          new_dirties   = _.omit( current_dirties, setId );
          new_changeset = _.omit( current_changeset, setId );
          skope_instance.dirtyValues( new_dirties );
          skope_instance.changesetValues( new_dirties );

          return dfd.resolve().promise();
    },


    //@uses The ctrl.czr_states values
    //updates the current skope dbValues
    //update the ctrl state
    _resetControlAPIVal : function( ctrlId ) {
          var setId = api.CZR_Helpers.getControlSettingId( ctrlId ),
              current_skope_db  = api.czr_skope( api.czr_activeSkopeId() ).dbValues(),
              new_skope_db      = $.extend( true, {}, current_skope_db ),
              dfd = $.Deferred();

          if ( _.has( api.control( ctrlId ), 'czr_states') ) {
                api.control(ctrlId).czr_states( 'hasDBVal' )( false );
                //update the skope db property and say it
                api.czr_skope( api.czr_activeSkopeId() ).dbValues( _.omit( new_skope_db, setId ) );
          }
          return dfd.resolve().promise();
    }

});//$.extend()