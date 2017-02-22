
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {
    /*****************************************************************************
    * WORDPRESS API ACTIONS ON INIT
    *****************************************************************************/
    //fired in initialize
    //Listen to each api settings changes
    //1) update the current skope dirties with the user val
    //2) Refresh the controls reset state
    //can be fired when a setting is dynamically added. For example a widget.
    //In this case, the param SetId is not null
    bindAPISettings : function( requestedSetId ) {
          var self = this,
              _settingChangeReact = function( new_val, old_val, o ) {
                    //"this" is the setting instance
                    var setId = this.id,
                        skope_id;

                    //if skope instantiation went wrong, serverControlParams.isSkopOn has been reset to false
                    //=> that's why we check it here again before doing anything else
                    if ( ! serverControlParams.isSkopOn )
                      return;

                    if ( ! _.has( api, 'czr_activeSkopeId') || _.isUndefined( api.czr_activeSkopeId() ) ) {
                      api.errorLog( 'The api.czr_activeSkopeId() is undefined in the api.czr_skopeBase.bindAPISettings method.');
                      //return;
                    }

                    //For skope eligible settings : Update the skope dirties with the new val of this setId
                    //=> not eligibile skope will update the global skope dirties
                    //=> this has to be kept like this because the global dirties aare being populated with :
                    // api.dirtyValues = function dirtyValues( options ) {
                    //       return api.czr_skopeBase.getSkopeDirties( api.czr_skopeBase.getGlobalSkopeId(), options );
                    // };
                    if ( api( setId )._dirty ) {
                          //api.consoleLog('ELIGIBLE SETTING HAS CHANGED', setId, old_val + ' => ' +  new_val, o );
                          skope_id = self.isSettingSkopeEligible( setId ) ? api.czr_activeSkopeId() : self.getGlobalSkopeId();
                          api.czr_skope( skope_id ).updateSkopeDirties( setId, new_val );
                    }

                    //collapse any expanded reset modifications if the control is not currently being reset.
                    if ( _.has( api.control(setId), 'czr_states' ) && ! api.control(setId).czr_states( 'isResetting' )() ) {
                          api.control(setId).czr_states( 'resetVisible' )( false );
                    }

                    //Update the skope inheritance notice for the setting control
                    if ( self.isSettingSkopeEligible( setId ) ) {
                          self.updateCtrlSkpNot( setId );
                    }
              };//bindListener()

          //if a setting Id is requested
          if ( ! _.isUndefined( requestedSetId ) ) {
                api( requestedSetId ).bind( _settingChangeReact );
          }
          else {
                //parse the current eligible skope settings and write a setting val object
                api.each( function ( _setting ) {
                    _setting.bind( _settingChangeReact );
                });
          }

          //BIND SETTINGS ADDED LATER : Typical example : menus
          var _dynamicallyAddedSettingsReact = function( setting_instance ) {
                if ( setting_instance.callbacks.has( _settingChangeReact ) )
                  return;
                setting_instance.bind( _settingChangeReact );
          };

          if ( ! api.topics.change.has( _dynamicallyAddedSettingsReact ) ) {
                api.bind( 'change', _dynamicallyAddedSettingsReact );
          }
    }
});//$.extend()