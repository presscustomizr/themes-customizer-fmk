
( function ( api, $, _ ) {
      if ( ! serverControlParams.isSkopOn )
        return;

      /**
       * Get the dirty setting values.
       * Overrides the default method introduced in 4.7
       * !! This method only returns the dirties of the global skope !!
       *
       * @param {object} [options] Options.
       * @param {boolean} [options.unsaved=false] Whether only values not saved yet into a changeset will be returned (differential changes).
       * @returns {object} Dirty setting values.
       */
      api.dirtyValues = function dirtyValues( options ) {
            return api.czr_skopeBase.getSkopeDirties( api.czr_skopeBase.getGlobalSkopeId(), options );
      };

})( wp.customize , jQuery, _ );