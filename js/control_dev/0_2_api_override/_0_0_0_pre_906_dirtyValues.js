
(function (api, $, _) {
      if ( ! serverControlParams.isSkopOn )
        return;

      /**
       * Get the dirty setting values.
       * Overrides the default method introduced in 4.7
       * This method only returns the dirties of the global skope
       *
       * @param {object} [options] Options.
       * @param {boolean} [options.unsaved=false] Whether only values not saved yet into a changeset will be returned (differential changes).
       * @returns {object} Dirty setting values.
       */
      api.dirtyValues = function dirtyValues( options ) {
            var values = {},
                _globalSkopeDirties = api.czr_skopeBase.getSkopeDirties( api.czr_skopeBase.getGlobalSkopeId() );

            _.each( _globalSkopeDirties, function( _val, _setId ) {
                  var settingRevision;
                  //since 4.7 and the changeset, only the settings not yet saved in the db changeset are returned
                  if ( api.czr_isChangedSetOn() ) {
                        settingRevision = api._latestSettingRevisions[ _setId ];
                        console.log('IN NEW DIRTY VALUES : options, settingRevision and api._lastSavedRevision', options, _setId, settingRevision , api._lastSavedRevision);
                        // Skip including settings that have already been included in the changeset, if only requesting unsaved.
                        if ( ( options && options.unsaved ) && ( _.isUndefined( settingRevision ) || settingRevision <= api._lastSavedRevision ) ) {
                          return;
                        }
                  }

                  values[ _setId ] = _val;
            } );

            // api.each( function( setting ) {
            //       var settingRevision;

            //       if ( ! setting._dirty ) {
            //         return;
            //       }

            //       //since 4.7 and the changeset, only the settings not yet saved in the db changeset are returned
            //       if ( api.czr_isChangedSetOn() ) {
            //             settingRevision = api._latestSettingRevisions[ setting.id ];

            //             // Skip including settings that have already been included in the changeset, if only requesting unsaved.
            //             if ( ( options && options.unsaved ) && ( _.isUndefined( settingRevision ) || settingRevision <= api._lastSavedRevision ) ) {
            //               return;
            //             }
            //       }

            //       values[ setting.id ] = setting.get();
            // } );
            console.log('DIRTY VALUES, BEFORE RETURNING VALUES : ', options, api._lastSavedRevision );
            return values;
      };

})( wp.customize , jQuery, _ );