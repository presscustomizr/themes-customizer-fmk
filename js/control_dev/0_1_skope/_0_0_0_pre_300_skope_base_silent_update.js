
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {
    //@param params :
    // {
    //   candidates : silentUpdateCands,
    //   section_id : section_id,
    //   refresh : true
    // }
    processSilentUpdates : function( params ) {
          console.log('PROCESS SILENT UPDATES', params );
          //a setting id can be passed as param instead of an object
          if ( _.isString( params ) )
            params = { candidates : [ params ] };
          else
            params = params || {};

          var self = this,
              defaultParams = {
                  candidates : [],
                  section_id : api.czr_activeSectionId(),
                  refresh : true
              },
              dfd = $.Deferred();

          params = $.extend( defaultParams, params );

          //Cast the candidates to an array, if only one setId is passed as a string
          if ( _.isString( params.candidates ) ) {
            params.candidates = [ params.candidates ];
          }

          //do we have well defined silent update candidates ?
          if ( _.isEmpty( params.candidates ) )
                params.candidates = self._getSilentUpdateCandidates( params.section_id );
          if ( ! _.isArray( params.candidates ) ) {
                throw new Error('processSilentUpdates : the update candidates must be an array.');
          }

          //api.consoleLog('silentUpdateCands ============>>> ', api.czr_activeSkopeId(), params, silentUpdateCands );

          //silently update the settings of a the currently active section() to the values of the current skope
          //silentlyUpdateSettings returns a promise.
          self.silentlyUpdateSettings( params.candidates, params.refresh )
                .fail( function() {
                      dfd.reject();
                })
                .done( function() {
                      self.setupCurrentControls( {
                          section_id : params.section_id
                      });
                      dfd.resolve();
                });

          return dfd.promise();
    },




    /*****************************************************************************
    * UPDATE SETTING VALUES
    *****************************************************************************/
    //silently update a set of settings or a given setId
    //1) Build an array of promises for each settings
    //2) When all asynchronous promises are done(). Refresh()
    //@return an array of promises. Typically if a setting update has to re-render an image related control, the promise is the ajax request object
    silentlyUpdateSettings : function( _silentUpdateCands, refresh ) {
          console.log('silentlyUpdateSettings', _silentUpdateCands, refresh );
          var self = this,
              _silentUpdatePromises = {},
              dfd = $.Deferred();

          refresh = _.isUndefined( refresh ) ? true : refresh;

          if ( _.isUndefined( _silentUpdateCands ) || _.isEmpty( _silentUpdateCands ) ) {
            _silentUpdateCands = self._getSilentUpdateCandidates();
          }

          if ( _.isString( _silentUpdateCands ) ) {
            _silentUpdateCands = [ _silentUpdateCands ];
          }

          //api.consoleLog('the silentUpdateCands', _silentUpdateCands );

          //Fire the silent updates promises
          _.each( _silentUpdateCands, function( setId ) {
                if ( api.control.has( setId ) &&  'czr_multi_module' == api.control(setId).params.type )
                  return;
                _silentUpdatePromises[setId] = self.getSettingUpdatePromise( setId );
          });


          var _deferred = [];
              // _silently_update = function( _silentUpdatePromises ) {
              //        _.each( _silentUpdatePromises, function( _promise_ , setId ) {
              //               //Silently set
              //               var wpSetId = api.CZR_Helpers.build_setId( setId ),
              //                   _skopeDirtyness = api.czr_skope( api.czr_activeSkopeId() ).getSkopeSettingDirtyness( setId );
              //               api( wpSetId ).silent_set( obj.val, _skopeDirtyness );
              //         });
              // };

         //Populates the promises
         //Silently set each setting when its promise is done.
          _.each( _silentUpdatePromises, function( _promise_ , setId ) {
                _promise_.done( function( _new_setting_val_ ) {
                      //Silently set
                      var wpSetId = api.CZR_Helpers.build_setId( setId ),
                          _skopeDirtyness = api.czr_skope( api.czr_activeSkopeId() ).getSkopeSettingDirtyness( setId );
                      api( wpSetId ).silent_set( _new_setting_val_ , _skopeDirtyness );
                });

                _deferred.push( _promise_ );
          });

          //Resolve this method deferred when all setting promises are done
          $.when.apply( null, _deferred )
          // .always( function() {
          //       var _has_rejected_promise = false;
          //       _.each( _deferred, function( _defd ) {
          //             if ( _.isObject( _defd ) && 'rejected' == _defd.state() ) {
          //                   _has_rejected_promise = true;
          //             }
          //             //@todo improve this!
          //             $.when( _silently_update() ).done( function() {
          //                 api.previewer.refresh();
          //             });
          //       });

          // })
          .fail( function() {
                dfd.reject();
                throw new Error( 'silentlyUpdateSettings FAILED. Candidates : ' + _silentUpdateCands );
          })
          .always( function() {})
          .then( function() {
                _.each( _deferred, function( prom ){
                      if ( _.isObject( prom ) && 'resolved' !== prom.state() ) {
                            throw new Error( 'a silent update promise is unresolved : ' + _silentUpdateCands );
                      }
                });
                //always refresh by default
                if ( refresh ) {
                      api.previewer.refresh().done( function() {
                            dfd.resolve();
                      });
                } else {
                      dfd.resolve();
                }
          });

          //return the collection of update promises
          return dfd.promise();
    },






    //This method is typically called to update the current active skope settings values
    //
    //, therefore @param shortSetId is the only mandatory param
    //@param setId : the api setting id, might be the short version
    //@param val : the new val
    //@return a promise() $ object when an ajax fetch is processed, typically when updating an image.
    getSettingUpdatePromise : function( setId ) {
          if ( _.isUndefined( setId ) ) {
              throw new Error('getSettingUpdatePromise : the provided setId is not defined');
          }
          if ( ! api.has( api.CZR_Helpers.build_setId( setId ) ) ) {
              throw new Error('getSettingUpdatePromise : the provided wpSetId is not registered : ' + api.CZR_Helpers.build_setId( setId ) );
          }

          var self = this,
              wpSetId = api.CZR_Helpers.build_setId( setId ),
              current_setting_val = api( wpSetId )(),//typically the previous skope val
              dfd = $.Deferred(),
              _promise = false,
              skope_id = api.czr_activeSkopeId(),
              val = api.czr_skopeBase.getSkopeSettingVal( setId, skope_id );


          //resolve here if the setting val was unchanged
          if ( _.isEqual( current_setting_val, val ) ) {
                return dfd.resolve( val ).promise();
          }

          //THE FOLLOWING TREATMENTS ARE ADAPTED TO SETTING WITH A CORRESPONDING CONTROL
          //header_image_data not concerned for example
          if ( api.control.has( wpSetId ) ) {
                //The normal way to synchronize the setting api val and the html val is to use
                //an overriden version of api.Element.synchronizer.val.update
                //For some specific controls, we need to implement a different way to synchronize
                var control_type = api.control( wpSetId ).params.type,
                    _control_data = api.settings.controls[wpSetId],
                    _constructor;

                //////////EXPERIMENT
                // if ( 'widget_form' == control_type ) {
                //   console.log('################# ALORS ? ############### ', control_type );
                //   api.control( wpSetId ).container.remove();
                //   api.control.remove( wpSetId );
                // }

                switch ( control_type ) {
                      //CROPPED IMAGE CONTROL
                      case 'czr_cropped_image' :
                            _promise = self._getCzrCroppedImagePromise( wpSetId, _control_data );
                      break;

                      case 'czr_module' :
                            self._processCzrModuleSilentActions( wpSetId, control_type, skope_id , _control_data);
                      break;

                      // case 'czr_multi_module' :
                      //       _constructor = api.controlConstructor[control_type];
                      //       if ( api.control.has( wpSetId ) ) {
                      //           //remove the container and its control
                      //           api.control( wpSetId ).container.remove();
                      //           api.control.remove( wpSetId );
                      //       }
                      //       //Silently set
                      //       api( wpSetId ).silent_set( val, current_skope_instance.getSkopeSettingDirtyness( setId ) );
                      //       //re-instantiate the control with the updated _control_data
                      //       api.control.add( wpSetId,  new _constructor( wpSetId, { params : _control_data, previewer : api.previewer }) );
                      // break;

                      // default :
                      //       //Silent set
                      //       api( wpSetId ).silent_set( val, current_skope_instance.getSkopeSettingDirtyness( setId ) );
                      // break;
                }//switch
          }//end if api.control.has( wpSetId )


          //Special case : the header_image control has 2 associated settings : header_image and header_image_data
          //when switching skope, we want to refresh the control with the right image
          //This is a setting
          if ( _.has(api.settings.controls, 'header_image') && 'header_image' == wpSetId  ) {
                _promise = self._getHeaderImagePromise( wpSetId, skope_id );
          }
          if ( ! _promise || ! _.isObject( _promise ) ) {
                dfd.resolve( val );
          } else {
                _promise.always( function() {
                      dfd.resolve( val );
                });
          }

          return dfd.promise();
    },//getSettingUpdatePromise()




    /*****************************************************************************
    * GET SILENT UPDATE CANDIDATE FROM A SECTION. FALLS BACK ON THE CURRENT ONE
    *****************************************************************************/
    _getSilentUpdateCandidates : function( section_id ) {
          var self = this,
              SilentUpdateCands = [];
          section_id = ( _.isUndefined( section_id ) || _.isNull( section_id ) ) ? api.czr_activeSectionId() : section_id;

          if ( _.isUndefined( section_id ) ) {
            api.consoleLog( '_getSilentUpdateCandidates : No active section provided');
            return;
          }
          if ( ! api.section.has( section_id ) ) {
              throw new Error( '_getSilentUpdateCandidates : The section ' + section_id + ' is not registered in the API.');
          }

          //GET THE CURRENT EXPANDED SECTION SET IDS
          var section_settings = api.CZR_Helpers.getSectionSettingIds( section_id );

          //keep only the skope eligible setIds
          section_settings = _.filter( section_settings, function(setId) {
              return self.isSettingSkopeEligible( setId );
          });

          //Populates the silent update candidates array
          _.each( section_settings, function( setId ) {
                SilentUpdateCands.push( setId );
          });

          return SilentUpdateCands;
    }

});//$.extend