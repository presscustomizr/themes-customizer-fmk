
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
          //test with copyright
          console.log( 'ACTIVE SKOPE MODEL', api.czr_skope( api.czr_activeSkope() )() );

          if ( ! _.isUndefined( api.czr_activeSectionId() ) ) {
              self.silentlyUpdateSectionSettings( api.czr_activeSectionId() );
          }
          //always refresh after a skope switch
          api.previewer.refresh();
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
              _save_state = api.state('saved')(),
              _skope_instance = api.czr_skope( _.isUndefined( skope_id ) ? api.czr_activeSkope() : skope_id );//the provided skope or the active skope

          skope_id = skope_id || api.czr_activeSkope();
          val = val || api.czr_skopeBase.getSkopeSettingVal( shortSetId, skope_id );

          console.log('in silent update? skope and setId', skope_id, shortSetId );
          //if a setId is provided, then let's update it
          if ( ! _.isUndefined( shortSetId ) && api.has( api.CZR_Helpers.build_setId( shortSetId ) ) ) {
                $.when( self.updateSettingValue( shortSetId, val ) ).done( function() {
                    api.state('saved')( _save_state );
                });
          } else {
                console.log('UPDATE ALL API SETTINGS');
                //if no setId provided, let's update the entire setting collection
                api.each(function( setting ) {
                    console.log('setting id', setting.id );
                });
                api.state('saved')( _save_state );
          }

    },


    updateSettingValue : function( setId, val ) {
          var self = this,
              current_skope_instance = api.czr_skope( api.czr_activeSkope() );

          api( api.CZR_Helpers.build_setId(setId) ).silent_set( val, current_skope_instance.getSkopeSettingDirtyness( setId ) );

          //TEST UPDATE DYNAMIC STYLE CHECKBOX ON SWITCH
          // if ( 'trans' == to.dyn_type ) {
          //   api('hu_theme_options[dynamic-styles]').set(true);
          //   //api('hu_theme_options[dynamic-styles]').set(23);
          //   $('input[type=checkbox]', api.control('hu_theme_options[dynamic-styles]').container ).iCheck('update');
          // }

          //TEST UPDATE FONT SELECT ON SWITCH
          // if ( 'trans' == to.dyn_type ) {
          //   api('hu_theme_options[font]').set('raleway');
          //   //api('hu_theme_options[dynamic-styles]').set(23);
          //   $('select[data-customize-setting-link]', api.control('hu_theme_options[font]').container ).selecter('destroy').selecter();
          // }

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