
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {
    //@param obj :
    // {
    //   silent_update_candidates : silentUpdateCands,
    //   section_id : section_id
    // }
    processSilentUpdates : function( obj ) {
          var self = this, silentUpdateCands, _params,
              defaultParams = {
                  silent_update_candidates : [],
                  section_id : api.czr_activeSectionId()
              };
          _params = $.extend( defaultParams, obj );

          //do we have well defined silent update candidates ?
          if ( _.isUndefined( _params.silent_update_candidates ) || _.isEmpty( _params.silent_update_candidates ) )
                silentUpdateCands = self._getSilentUpdateCandidates( _params.section_id );
          else if ( ! _.isArray( _params.silent_update_candidates ) ) {
                throw new Error('processSilentUpdates : the update candidates must be an array.');
          } else {
                silentUpdateCands = _params.silent_update_candidates;
          }

          console.log('silentUpdateCands ============>>> ', _params, silentUpdateCands);

          //silently update the settings of a the currently active section() to the values of the current skope
          //silentlyUpdateSettings returns an array of promises.
          //Let's wait fot all promises to be done before firing the next actions
          var _promises = self.silentlyUpdateSettings( silentUpdateCands );
          $.when.apply( null, _promises )
                .then( function() {
                      //re-render control single reset when needed (Media control are re-rendered, that's why we need this method fired on each skope switch)
                      var _debouncedSetupControlReset = function() {
                          self.setupControlsReset( {
                              section_id : _params.section_id
                          });
                      };
                      _debouncedSetupControlReset = _.debounce( _debouncedSetupControlReset, 1200 );
                      _debouncedSetupControlReset();
                });

          return _promises;
    },




    /*****************************************************************************
    * UPDATE SETTING VALUES
    *****************************************************************************/
    //silently update a set of settings or a given setId
    //1) Build an array of promises for each settings
    //2) When all asynchronous promises are done(). Refresh()
    //@return an array of promises. Typically if a setting update has to re-render an image related control, the promise is the ajax request object
    silentlyUpdateSettings : function( _silentUpdateCands, refresh ) {
          var self = this,
              SilentUpdatePromises = {};

          refresh = refresh || true;

          if ( _.isUndefined( _silentUpdateCands ) || _.isEmpty( _silentUpdateCands ) ) {
            _silentUpdateCands = self._getSilentUpdateCandidates();
          }

          if ( _.isString( _silentUpdateCands ) ) {
            _silentUpdateCands = [ _silentUpdateCands ];
          }

          api.consoleLog('the silentUpdateCands', _silentUpdateCands );

          //Fire the silent updates promises
          _.each( _silentUpdateCands, function( setId ) {
                if ( api.control.has( setId ) &&  'czr_multi_module' == api.control(setId).params.type )
                  return;
                SilentUpdatePromises[setId] = self.getSettingUpdatePromise( setId );
          });


          var _deferred = [],
              _silently_update = function( SilentUpdatePromises ) {
                     _.each( SilentUpdatePromises, function( obj, setId ) {
                            //Silently set
                            var wpSetId = api.CZR_Helpers.build_setId( setId ),
                                _skopeDirtyness = api.czr_skope( api.czr_activeSkope() ).getSkopeSettingDirtyness( setId );
                            api( wpSetId ).silent_set( obj.val, _skopeDirtyness );
                      });
              };

         //Populates the promises
          _.each( SilentUpdatePromises, function( obj, setId ) {
                _deferred.push(obj.promise);
          });
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
          .then( function() {
                _.each( _deferred, function(prom){
                      if ( _.isObject( prom ) )
                        api.consoleLog( 'promise state() after silent update', prom.state() );
                });
                $.when( _silently_update( SilentUpdatePromises ) ).done( function() {
                    console.log( '!!!! SilentUpdatePromises', SilentUpdatePromises );
                    //always refresh by default
                    if ( refresh )
                        api.previewer.refresh();
                });
          });

          //return the collection of update promises
          return _deferred;
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
          var self = this,
              wpSetId = api.CZR_Helpers.build_setId( setId ),
              current_setting_val = api( wpSetId )(),//typically the previous skope val
              _promise,
              skope_id = api.czr_activeSkope(),
              val = api.czr_skopeBase.getSkopeSettingVal( setId, skope_id );

          //if a setId is provided, then let's update it
          if ( ! api.has( wpSetId ) ) {
              throw new Error('getSettingUpdatePromise : the provided setId is not registered in the api.');
          }

          //stop here if the setting val was unchanged
          if ( _.isEqual( current_setting_val, val ) )
            return { promise : true, val : val };

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

          return  { promise : _promise || true, val : val };
    },//getSettingUpdatePromise()









    /*****************************************************************************
    * SILENT ACTIONS for czr_module_type on skope switch
    * ?? @todo : can't we fire this earlier than in getPromises ?
    *****************************************************************************/
    //@return void()
    _processCzrModuleSilentActions : function( wpSetId, control_type, skope_id, _control_data) {
          var _synced_control_id, _synced_control_val, _synced_control_data, _synced_control_constructor, _syncSektionModuleId,
              _synced_short_id = _.has( api.control( wpSetId ).params, 'syncCollection' ) ? api.control( wpSetId ).params.syncCollection : '',
              _shortSetId =  api.CZR_Helpers.build_setId(wpSetId),
              _val = api.czr_skopeBase.getSkopeSettingVal( _shortSetId, skope_id ),
              current_skope_instance = api.czr_skope( api.czr_activeSkope() );

          //if in a multimodule context
          if ( ! _.isEmpty( _synced_short_id ) && ! _.isUndefined( _synced_short_id ) ) {
                _synced_control_id = api.CZR_Helpers.build_setId( _synced_short_id );
                _synced_control_val = api.czr_skopeBase.getSkopeSettingVal( _synced_control_id, skope_id );
                _synced_control_data = api.settings.controls[_synced_control_id];
                _synced_control_constructor = api.controlConstructor.czr_multi_module;
                _syncSektionModuleId =  api.control( _synced_control_id ).syncSektionModule()().id;

                //remove the container and its control
                api.control( _synced_control_id ).container.remove();
                api.control.remove(_synced_control_id );
                //Silently set
                api( _synced_control_id ).silent_set( _synced_control_val, current_skope_instance.getSkopeSettingDirtyness( _synced_control_id ) );

                //add the current skope to the control
                $.extend( _synced_control_data, { czr_skope : skope_id });

                //re-instantiate the control with the updated _control_data
                api.control.add( _synced_control_id,  new _synced_control_constructor( _synced_control_id, { params : _synced_control_data, previewer : api.previewer }) );
          }

          _constructor = api.controlConstructor[control_type];

          //remove the container and its control
          api.control( wpSetId ).container.remove();
          api.control.remove( wpSetId );
          //Silently set
          api( wpSetId ).silent_set( _val, current_skope_instance.getSkopeSettingDirtyness( _shortSetId ) );

          //add the current skope to the control
          $.extend( _control_data, { czr_skope : skope_id });

          //re-instantiate the control with the updated _control_data
          api.control.add( wpSetId,  new _constructor( wpSetId, { params : _control_data, previewer : api.previewer }) );

          //Fire the sektion module if there's a synced sektion
          if ( ! _.isEmpty( _synced_short_id ) && ! _.isUndefined( _synced_short_id ) ) {
                api.consoleLog('FIRE SEKTION MODULE?', _syncSektionModuleId, api.control( wpSetId ).czr_Module( _syncSektionModuleId ).isReady.state() );
                api.control( wpSetId ).czr_Module( _syncSektionModuleId ).fireSektionModule();
          }
    },





    /*****************************************************************************
    * GET PROMISE FOR TYPE : czr_cropped_image
    *****************************************************************************/
    //@return promise
    _getCzrCroppedImagePromise : function( wpSetId, _control_data ) {
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

          //set the media fetched as promise to return;
          return wp.media.attachment( val ).fetch();
    },



    /*****************************************************************************
    * HEADER IMAGE PROMISE
    *****************************************************************************/
    //@return promise
    _getHeaderImagePromise : function( wpSetId, skope_id ) {
          if ( ! _.has(api.settings.controls, 'header_image') || 'header_image' != wpSetId  )
            return;

          var _header_constructor = api.controlConstructor.header,
              _header_control_data = $.extend( true, {}, api.settings.controls.header_image );

          //@make sure that the header_image_data is not null => won't be accepted in silent set
          header_image_data = null === api.czr_skopeBase.getSkopeSettingVal( 'header_image_data', skope_id ) ? "" : api.czr_skopeBase.getSkopeSettingVal( 'header_image_data', skope_id );

          var attachment_id;
          var _reset_header_image_crtl = function( _updated_header_control_data ) {
              _updated_header_control_data = _updated_header_control_data || _header_control_data;
              //remove the container and its control
              api.control( 'header_image' ).container.remove();
              api.control.remove( 'header_image' );

              //reset the HeaderTool objects, captured early
              api.HeaderTool.UploadsList = api.czr_HeaderTool.UploadsList;
              api.HeaderTool.DefaultsList = api.czr_HeaderTool.DefaultsList;
              api.HeaderTool.CombinedList = api.czr_HeaderTool.CombinedList;
              var _render_control = function() {
                //instantiate the control with the updated _header_control_data
                api.control.add( 'header_image',  new _header_constructor( 'header_image', { params : _updated_header_control_data, previewer : api.previewer }) );
              };
              _render_control = _.debounce( _render_control, 800 );
              _render_control();
          };


          if ( ! _.has( header_image_data, 'attachment_id' ) ) {
              _reset_header_image_crtl();
          } else {
              attachment_id = header_image_data.attachment_id;

              //re-add the control when the new image has been fetched asynchronously.
              //if no image can be fetched, for example when in the active skope, the image is not set, then
              //refresh the control without attachment data
              wp.media.attachment( attachment_id ).fetch().done( function() {
                    //update the data with the new img attributes
                    _header_control_data.attachment = this.attributes;
                    _reset_header_image_crtl( _header_control_data );
              } ).fail( function() {
                    //update the data : remove the attachment property
                    _header_control_data = _.omit( _header_control_data, 'attachment' );

                    //remove the container and its control
                    api.control( 'header_image' ).container.remove();
                    api.control.remove( 'header_image' );

                    //reset the HeaderTool objects, captured early
                    api.HeaderTool.UploadsList = api.czr_HeaderTool.UploadsList;
                    api.HeaderTool.DefaultsList = api.czr_HeaderTool.DefaultsList;
                    api.HeaderTool.CombinedList = api.czr_HeaderTool.CombinedList;
                    //instantiate the control with the updated _header_control_data
                    api.control.add( 'header_image',  new _header_constructor( 'header_image', { params : _header_control_data, previewer : api.previewer }) );
              });

              //set the media fetched as promise to return;
              return wp.media.attachment( attachment_id ).fetch();
          }//else

          //return a boolean true promise by default
          return true;
    }
});//$.extend