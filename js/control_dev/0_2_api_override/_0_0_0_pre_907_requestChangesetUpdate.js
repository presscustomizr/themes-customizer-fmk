
(function (api, $, _) {
      if ( ! serverControlParams.isSkopOn || ! api.czr_isChangedSetOn() )
        return;

      //WP Changeset is requested for an update with an ajax query in the following situation :
      //1) before unloading the winddow
      //2) when focus removed from window.
      //3) on schedule : every 60 000 ms. ( api.settings.timeouts.changesetAutoSave )
      //
      //
      //But the update will only takes place if the current api.dirtyValues() are not empty. That's the problem we address with this override.
      //The function api.dirtyValues() only returns :
      //1) the dirty settings of the global skope
      //2) AND that have not been saved during the latest saved revision ( api._lastSavedRevision )
      //
      //
      //So we need to find a way to fire a changeset update for all the other skopes
      //The proposed solution here is to base the changeset update decision not on the emptyness of the dirtyValues but on the api._latestRevision index.
      //
      //
      //How does the saved and revision index works.
      //api._lastSavedRevision is set when the changeset update request is done() with the following code :
      //api._lastSavedRevision = Math.max( api._latestRevision, api._lastSavedRevision );
      //
      //api._latestRevision is incremented +1 each time a setting change occurs in the api. Not matter in which skope this change has been done.
      //
      //Therefore, as soon as we detect that api._latestRevision > api._lastSavedRevision, then we can authorize a changeset update.
      //The changeset update request will pass the usual skope query parameters, including the current skope dirtyness.
      //=> this will allow an ajax update of the changeset post metas for the modified skopes.


      api._requestSkopeChangetsetUpdate = function() {

      };



      var _getMediasFilenamePromises = function() {
            var deferred = $.Deferred(),
                promises = [],
                medias = [];

            _.each( [ 64,65,66,67,68,69,70,71,72,73,74,75 ], function( _id ) {
                  promises.push( wp.media.attachment( _id ).fetch() );
            } );
            _.each( promises, function( prom ) {
                  prom.done( function( med ) {
                      medias.push( med.filename );
                  } );
            });

            $.when.apply( null, promises ).done( function() {
                setTimeout( function() {
                    deferred.resolve( medias );
                }, 3000 );

            });
            return deferred.promise();
      };

      var _printMedias = function() {
            _getMediasFilenamePromises().done( function( medias ) {
                  console.log( 'MEDIA LIST' , medias );
            });
      };
      _printMedias();













      //Backup the original method
      var _original_requestChangesetUpdate = api.requestChangesetUpdate;

      /**
       * Request updates to the changeset.
       *
       * @param {object} [changes] Mapping of setting IDs to setting params each normally including a value property, or mapping to null.
       *                           If not provided, then the changes will still be obtained from unsaved dirty settings.
       * @returns {jQuery.Promise}
       */
      api.requestChangesetUpdate = function( changes ) {
            var _promise;
            $.when( api._requestSkopeChangetsetUpdate() ).done( function( promise ) {
                  _promise = _original_requestChangesetUpdate(changes);
            });
            return _promise;
      };

})( wp.customize , jQuery, _ );