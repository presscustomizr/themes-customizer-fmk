
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

          //stop here if the active section is not set yet
          //=> the silent update will be fired on section expansion anyway
          if ( _.isUndefined( api.czr_activeSectionId() ) )
            return;

          //populates with the current section setting ids
          var silent_update_candidates = self._getSilentUpdateCandidates();

          //add the previous skope dirty settings ids
          if ( ! _.isUndefined( from ) ) {
            console.log( 'PREVIOUS SKOPE DIRTIES', api.czr_skope( from ).dirtyValues() );
            _.each( api.czr_skope( from ).dirtyValues(), function( val, _setId ) {
                  if ( ! _.contains( silent_update_candidates, _setId ) )
                      silent_update_candidates.push(_setId);
            } );
          }
          if ( ! _.isUndefined( to ) ) {
            console.log( 'CURRENT SKOPE DIRTIES', api.czr_skope( to ).dirtyValues() );
            _.each( api.czr_skope( to ).dirtyValues(), function( val, _setId ) {
                  if ( ! _.contains( silent_update_candidates, _setId ) )
                      silent_update_candidates.push(_setId);
            } );
          }

          console.log('SILENT UPDATE CANDIDATES', silent_update_candidates );

          //silently update the settings of a the currently active section() to the values of the current skope
          self.silentlyUpdateSettings( silent_update_candidates );

          //re-render control single reset when needed (Media control are re-rendered, that's why we need this method fired on each skope switch)
          self.renderControlSingleReset();
    },





    /*****************************************************************************
    * UPDATE SETTING VALUES
    *****************************************************************************/
    _getSilentUpdateCandidates : function( section_id ) {
          var self = this,
              silent_update_candidates = [];
          section_id = section_id || api.czr_activeSectionId();

          if ( _.isUndefined( section_id ) ) {
            console.log( '_getSilentUpdateCandidates : No active section provided');
            return;
          }
          if ( ! api.section.has( section_id ) ) {
              throw new Error( '_getSilentUpdateCandidates : The section ' + section_id + ' is not registered in the API.');
          }

          //GET THE CURRENT EXPANDED SECTION SET IDS
          var section_controls = self._getSectionControlIds( section_id );
          //keep only the skope eligible setIds
          section_controls = _.filter( section_controls, function(setId) {
                return self.isSettingEligible(setId);
          });
          console.log('_getSilentUpdateCandidates :  eligible section settings to update ? ', section_controls );

          //Populates the silent update candidates array
          _.each( section_controls, function( setId ) {
                silent_update_candidates.push( setId );
          });

          return silent_update_candidates;
    },


    //silently update a set of settings or a given setId
    silentlyUpdateSettings : function( _silent_update_candidates, refresh ) {
          var self = this,
              silent_update_promises = {};

          refresh = refresh || true;

          if ( _.isUndefined( _silent_update_candidates ) || _.isEmpty( _silent_update_candidates ) ) {
            _silent_update_candidates = self._getSilentUpdateCandidates();
          }

          if ( _.isString( _silent_update_candidates ) ) {
            _silent_update_candidates = [ _silent_update_candidates ];
          }

          console.log('silent_update_candidates', _silent_update_candidates );
          //Fire the silent updates promises
          _.each( _silent_update_candidates, function( setId ) {
                silent_update_promises[setId] = self.getSettingUpdatePromise( setId );
          });


          var _deferred = [],
              _silently_update = function() {
                   _.each( silent_update_promises, function( obj, setId ) {
                          //Silently set
                          var wpSetId = api.CZR_Helpers.build_setId( setId ),
                              _skopeDirtyness = api.czr_skope( api.czr_activeSkope() ).getSkopeSettingDirtyness( setId );
                          console.log('in silently update', obj, setId );
                          api( wpSetId ).silent_set( obj.val, _skopeDirtyness );
                    });
              };

         //Populates the promises
          _.each( silent_update_promises, function( obj, setId ) {
              _deferred.push(obj.promise);
          });

          $.when.apply( null, _deferred ).always( function() {
                var _has_rejected_promise = false;
                _.each( _deferred, function( _defd ) {
                      if ( _.isObject( _defd ) && 'rejected' == _defd.state() ) {
                            _has_rejected_promise = true;
                            console.log('IN ALWAYS, HAS REJECTED PROMISE', _has_rejected_promise );
                      }
                      //@todo improve this!
                      $.when( _silently_update() ).done( function() {
                          api.previewer.refresh();
                      });
                });

          }).then( function() {
                console.log('THE THEN CASE');
                _.each( _deferred, function(prom){
                      if ( _.isObject( prom ) )
                        console.log( prom.state() );
                });
                $.when( _silently_update() ).done( function() {
                    if ( refresh )
                          api.previewer.refresh();
                });
          });
          //return the collection of update promises
          //return silent_update_promises;
    },






    //This method is typically called to update the current active skope settings values
    //
    //, therefore @param shortSetId is the only mandatory param
    //@param setId : the api setting id, might be the short version
    //@param val : the new val
    //@return a promise() $ object when an ajax fetch is processed, typically when updating an image.
    getSettingUpdatePromise : function( setId, skope_id, val ) {
          var self = this,
              current_skope_instance = api.czr_skope( api.czr_activeSkope() ),
              wpSetId = api.CZR_Helpers.build_setId( setId ),
              current_setting_val = api( wpSetId )();//typically the previous skope val

          skope_id = skope_id || api.czr_activeSkope();
          val = val || api.czr_skopeBase.getSkopeSettingVal( setId, skope_id );

          console.log('getSettingUpdatePromise? skope and setId', skope_id, setId, val );

          //if a setId is provided, then let's update it
          if ( _.isUndefined( setId ) || ! api.has( wpSetId ) ) {
              throw new Error('getSettingUpdatePromise : the provided setId is not defined or not registered in the api.');
          }

          //stop here if the setting val was unchanged
          if ( _.isEqual( current_setting_val, val ) )
            return { promise : true, val : val };

          //The normal way to synchronize the setting api val and the html val is to use
          //an overriden version of api.Element.synchronizer.val.update
          //For some specific controls, we need to implement a different way to synchronize
          var control_type = api.control( wpSetId ).params.type,
              _control_data = api.settings.controls[wpSetId],
              _constructor,
              _promise;

          switch ( control_type ) {
              //CROPPED IMAGE CONTROL
              case 'czr_cropped_image' :
                    _constructor = api.controlConstructor.czr_cropped_image;
                    //@make sure that the val is not null => won't be accepted in silent set
                    val = null === val ? "" : val;

                    //re-add the control when the new image has been fetched asynchronously.
                    //if no image can be fetched, for example when in the active skope, the image is not set, then
                    //refresh the control without attachment data
                    wp.media.attachment( val ).fetch().done( function() {
                          //remove the container and its control
                          api.control( wpSetId ).container.remove();
                          api.control.remove( wpSetId );
                          //update the data with the new img attributes
                          _control_data.attachment = this.attributes;
                          //instantiate the control with the updated _control_data
                          api.control.add( wpSetId,  new _constructor( wpSetId, { params : _control_data, previewer : api.previewer }) );
                    } ).fail( function() {
                          //remove the container and its control
                          api.control( wpSetId ).container.remove();
                          api.control.remove( wpSetId );
                          //update the data : remove the attachment property
                          _control_data = _.omit( _control_data, 'attachment' );
                          //instantiate the control with the updated _control_data
                          api.control.add( wpSetId,  new _constructor( wpSetId, { params : _control_data, previewer : api.previewer }) );
                    });

                    //set the media fetch as promise to return;
                    _promise = wp.media.attachment( val ).fetch();
              break;

              case 'czr_module' :
                    _constructor = api.controlConstructor.czr_module;
                    //remove the container and its control
                    api.control( wpSetId ).container.remove();
                    api.control.remove( wpSetId );
                    //Silently set
                    api( wpSetId ).silent_set( val, current_skope_instance.getSkopeSettingDirtyness( setId ) );
                    //re-instantiate the control with the updated _control_data
                    api.control.add( wpSetId,  new _constructor( wpSetId, { params : _control_data, previewer : api.previewer }) );
              break;
              // default :
              //       //Silent set
              //       api( wpSetId ).silent_set( val, current_skope_instance.getSkopeSettingDirtyness( setId ) );
              // break;
          }//switch

          return  { promise : _promise || true, val : val };
    }
});//$.extend