
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {

    //declared in initialize, cb of api.czr_activeSkope.callbacks
    //react when the active skope has been set to a new value
    // => change the to and from skope active() state
    // => silently update each setting values with the skope set of vals
    activeSkopeReact : function( to, from ) {
          var self = this;
          //set the to and from scope state on init and switch
          if ( ! _.isUndefined(from) && api.czr_skope.has(from) )
            api.czr_skope(from).active(false);
          else if ( ! _.isUndefined(from) )
            throw new Error('listenToActiveSkope : previous scope does not exist in the collection');

          if ( ! _.isUndefined(to) && api.czr_skope.has(to) )
            api.czr_skope(to).active(true);
          else
            throw new Error('listenToActiveSkope : requested scope ' + to + ' does not exist in the collection');

          //update the settings values based on the one of the active skope
          console.log( 'ACTIVE SKOPE MODEL', api.czr_skope( api.czr_activeSkope() )() );

          api.czr_isSilentUpdate(true);

          if ( ! _.isUndefined( api.czr_activeSectionId() ) ) {
              $.when( self.silentlyUpdateSectionSettings( api.czr_activeSectionId() ) ).done( function() {
                  //always refresh on skope switch
                  api.previewer.refresh();
                  api.czr_isSilentUpdate(false);
              });
          }

    },



    /*****************************************************************************
    * UPDATE SETTING VALUES
    *****************************************************************************/
    //silently update the settings of a given section to the values of the current skope
    silentlyUpdateSectionSettings : function( section_id ) {
          if ( ! api.section.has( section_id ) ) {
              throw new Error( 'Error when trying to silently update the settings. The section ' + section_id + ' is not registered in the API.');
          }

          var self = this,
              section_controls = self._getSectionControlIds( section_id );

          console.log('section_controls ? ', section_controls );
          //keep only the skope eligible setIds
          section_controls = _.filter( section_controls, function(setId) {
                return self.isSettingEligible(setId);
          });
          //silently update them
          _.each( section_controls, function( setId ) {
                self.silentlyUpdateSettings( setId );
          });
    },


    //This method is typically called to update the current active skope settings values
    //
    //, therefore @param shortSetId is the only mandatory param
    silentlyUpdateSettings : function( shortSetId, skope_id, val ) {
          var self = this,
              //_save_state = api.state('saved')(),
              _skope_instance = api.czr_skope( _.isUndefined( skope_id ) ? api.czr_activeSkope() : skope_id );//the provided skope or the active skope

          skope_id = skope_id || api.czr_activeSkope();
          val = val || api.czr_skopeBase.getSkopeSettingVal( shortSetId, skope_id );

          console.log('silentlyUpdateSettings? skope and setId', skope_id, shortSetId );
          //if a setId is provided, then let's update it
          if ( ! _.isUndefined( shortSetId ) && api.has( api.CZR_Helpers.build_setId( shortSetId ) ) ) {
                //return the result or promise
                return self.updateSettingValue( shortSetId, val );
          } else {
                console.log('UPDATE ALL API SETTINGS');
                //if no setId provided, let's update the entire setting collection
                api.each(function( setting ) {
                    console.log('setting id', setting.id );
                });
                //api.state('saved')( _save_state );
          }

    },


    updateSettingValue : function( setId, val ) {
          var self = this,
              current_skope_instance = api.czr_skope( api.czr_activeSkope() ),
              wpSetId = api.CZR_Helpers.build_setId( setId ),
              current_setting_val = api( wpSetId )();//typically the previous skope val

          console.log('_.isEqual( current_setting_val, val )', setId, val, _.isEqual( current_setting_val, val ) );
          //stop here if the setting val is unchanged
          if ( _.isEqual( current_setting_val, val ) )
            return true;


          //The normal way to synchronize the setting api val and the html val is to use
          //an overriden version of api.Element.synchronizer.val.update
          //For some specific controls, we need to implement a different way to synchronize
          var control_type = api.control( wpSetId ).params.type,
              _control_data = api.settings.controls[wpSetId],
              _constructor;

          switch ( control_type ) {
              //CROPPED IMAGE CONTROL
              case 'czr_cropped_image' :
                  console.log('UPDATE IMG', val );
                  _constructor = api.controlConstructor.czr_cropped_image;

                  //re-add the control when the new image has been fetched asynchronously.
                  //if no image can be fetched, for example when in the active skope, the image is not set, then
                  //refresh the control without attachment data
                  wp.media.attachment( val ).fetch().done( function() {
                        //remove the container and its control
                        api.control( wpSetId ).container.remove();
                        api.control.remove( wpSetId );
                        //update the data with the new img attributes
                        _control_data.attachment = this.attributes;
                        console.log('ALORS DONE ? ', setId, val, _control_data.attachment );
                        //instantiate the control with the updated _control_data
                        api.control.add( wpSetId,  new _constructor(wpSetId, { params : _control_data, previewer : api.previewer }) );
                  } ).fail( function() {

                        //remove the container and its control
                        api.control( wpSetId ).container.remove();
                        api.control.remove( wpSetId );
                        //update the data : remove the attachment property
                        _control_data = _.omit( _control_data, 'attachment' );
                        console.log('FAIL FETCHED', _control_data );
                        //instantiate the control with the updated _control_data
                        api.control.add( wpSetId,  new _constructor(wpSetId, { params : _control_data, previewer : api.previewer }) );
                  }).always( function() {
                      //Silently set
                      api( wpSetId ).silent_set( val, current_skope_instance.getSkopeSettingDirtyness( setId ) );
                  });
              break;

              case 'czr_module' :
                  _constructor = api.controlConstructor.czr_module;
                  console.log('constuct', _constructor);
                  //remove the container and its control
                  api.control( wpSetId ).container.remove();
                  api.control.remove( wpSetId );
                  //Silently set
                  api( wpSetId ).silent_set( val, current_skope_instance.getSkopeSettingDirtyness( setId ) );
                  //re-instantiate the control with the updated _control_data
                  api.control.add( wpSetId,  new _constructor(wpSetId, { params : _control_data, previewer : api.previewer }) );
              break;
              default :
                  //Silent set
                  api( wpSetId ).silent_set( val, current_skope_instance.getSkopeSettingDirtyness( setId ) );
              break;
          }


          //api( wpSetId ).silent_set( val, current_skope_instance.getSkopeSettingDirtyness( setId ) );

          //MEDIA UPLOAD CONTROL

          // var _img_id = 'trans' == to.dyn_type ? 23 : 25;
          // //TEST UPDATE LOGO ON SWITCH
          // api.control('hu_theme_options[custom-logo]').container.remove();

          // api.control.remove('hu_theme_options[custom-logo]');

          // var _constructor = api.controlConstructor.czr_cropped_image;
          // var _data = api.settings.controls['hu_theme_options[custom-logo]'];
          // api('hu_theme_options[custom-logo]').set(_img_id);

          // //add the control when the new image has been fetched asynchronously.
          // wp.media.attachment( _img_id ).fetch().done( function() {
          //   _data.attachment = this.attributes;
          //   api.control.add(
          //   'hu_theme_options[custom-logo]',
          //     new _constructor('hu_theme_options[custom-logo]', { params : _data, previewer :api.previewer })
          //   );
          // } );

    }
});//$.extend