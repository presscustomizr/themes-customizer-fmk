
(function (api, $, _) {

  api.bind('ready', function() {
        if ( ! serverControlParams.isSkopOn )
          return;

        /*****************************************************************************
        * SAVE
        *****************************************************************************/
        //OVERRIDES WP
        var _old_previewer_save = api.previewer.save;
        api.previewer.save = function() {
            var self = this,
                processing = api.state( 'processing' ),
                submitWhenDoneProcessing,
                submit,
                //modifiedWhileSaving = {},
                invalidSettings = [],
                invalidControls;

            $( document.body ).addClass( 'saving' );


            //WE WON'T USE THIS BECAUSE WE DON'T KNOW IN WHICH SKOPE THE SETTING MIGHT HAVE BEEN MODIFIED DURING SAVING
            // function captureSettingModifiedDuringSave( setting ) {
            //   modifiedWhileSaving[ setting.id ] = true;
            // }
            // api.bind( 'change', captureSettingModifiedDuringSave );

            //skope dependant submit()
            submit = function( skope_id, the_dirties ) {
                console.log('SKOPE ID IN OVERRIDEN SUBMIT', skope_id );
                var request, query;
                skope_id = skope_id || api.czr_activeSkope();

              /*
               * Block saving if there are any settings that are marked as
               * invalid from the client (not from the server). Focus on
               * the control.
               */
                if ( _.has( api, 'Notification') ) {
                    api.each( function( setting ) {
                      setting.notifications.each( function( notification ) {
                        if ( 'error' === notification.type && ( ! notification.data || ! notification.data.from_server ) ) {
                          invalidSettings.push( setting.id );
                        }
                      } );
                    } );
                    invalidControls = api.findControlsForSettings( invalidSettings );
                    if ( ! _.isEmpty( invalidControls ) ) {
                      _.values( invalidControls )[0][0].focus();
                      body.removeClass( 'saving' );
                      //api.unbind( 'change', captureSettingModifiedDuringSave );
                      return;
                    }
                }

                //the query takes the skope_id has parameter
                query = $.extend( self.query( skope_id, 'save', dirtyCustomized ), {
                    nonce:  self.nonce.save
                } );

                api.consoleLog('in submit : ', skope_id, query, api.previewer.channel() );

                request = wp.ajax.post( 'customize_save', query );

                api.trigger( 'save', request );

                // request.always( function () {
                //     $( document.body ).removeClass( 'saving' );
                // } );

                request.fail( function ( response ) {
                    api.consoleLog('ALORS FAIL ?', skope_id, response );
                    if ( '0' === response ) {
                        response = 'not_logged_in';
                    } else if ( '-1' === response ) {
                      // Back-compat in case any other check_ajax_referer() call is dying
                        response = 'invalid_nonce';
                    }

                    if ( 'invalid_nonce' === response ) {
                        self.cheatin();
                    } else if ( 'not_logged_in' === response ) {
                        self.preview.iframe.hide();
                        self.login().done( function() {
                          self.save();
                          self.preview.iframe.show();
                      } );
                    }
                    api.trigger( 'error', response );
                } );

                request.done( function( response ) {
                    api.consoleLog('ALORS DONE ?', skope_id, response );
                } );

                //return the promise
                return request;
              };//submit()



              var //skopeRequestDoneCollection = new api.Value( [] ),
                  //skopeRequests = $.Deferred(),
                  dirtySkopesToSubmit = _.filter( api.czr_skopeCollection(), function( _skop ) {
                      return api.czr_skope( _skop.id ).dirtyness();
                  }),
                  _saved_dirties = {};//will be used as param to update the skope model db val after all ajx requests are done

              //loop on the registered skopes and submit each save ajax request
              var submitDirtySkopes = function() {
                    //ARE THERE SKOPE EXCLUDED DIRTIES ?
                    var _skopeExcludedDirties = api.czr_skopeBase.getSkopeExcludedDirties();

                    console.log('>>>>>>>>>>>>>>>>>>>_skopeExcludedDirties', _skopeExcludedDirties );

                    if ( ! _.isEmpty( _skopeExcludedDirties ) ) {
                      // throw new Error(
                      //   'There are currently no dirties to save in skope while there should be ' + _.size(_wpDirtyCustomized) + ' : ' + _.keys(_wpDirtyCustomized).join(' | ')
                      // );
                      //console.log(  'There are currently no dirties to save in skope while there should be ' + _.size(_wpDirtyCustomized) + ' : ' + _.keys(_wpDirtyCustomized).join(' | ') );
                      _old_previewer_save.call(self);
                    }
                    var promises = [];


                    //////////////////////////////////SUBMIT////////////////////////////
                    _.each( dirtySkopesToSubmit, function( _skop ) {
                          api.consoleLog('submit request for skope : ', _skop.id );
                          var the_dirties = api.czr_skopeBase.getSkopeDirties(_skop.id);
                          //each promise is a submit ajax query
                          promises.push( submit( _skop.id, the_dirties ) );
                    });


                    return promises;
              };




              var reactWhenPromisesDone = function( promises ) {
                    if ( _.isEmpty( promises ) ) {
                      console.log('THE SAVE PROMISES ARE EMPTY. PROBABLY BECAUSE THERE WAS ONLY EXCLUDED SKOPE SETTINGS TO SAVE', dirtySkopesToSubmit, api.czr_skopeBase.getSkopeExcludedDirties() );
                      return;
                    }

                    $.when.apply( null, promises).done( function( response ) {
                          console.log('>>>>>>>>>>>>>>>>', promises);
                          //store the saved dirties (will be used as param to update the db val property of each saved skope)
                          //and reset them
                          _.each( dirtySkopesToSubmit, function( _skp ) {
                                _saved_dirties[ _skp.id ] = api.czr_skopeBase.getSkopeDirties(_skp.id);
                                api.czr_skopeBase.getSkopeDirties({});
                          });
                          // Clear api setting dirty states
                          api.each( function ( value ) {
                                value._dirty = false;
                          } );

                          /////////////////WP default treatments
                          $( document.body ).removeClass( 'saving' );
                          $( '#save' ).prop( 'disabled', false );

                          //api.unbind( 'change', captureSettingModifiedDuringSave );
                          // Clear setting dirty states, if setting wasn't modified while saving.
                          // api.each( function( setting ) {
                          //   if ( ! modifiedWhileSaving[ setting.id ] ) {
                          //     setting._dirty = false;
                          //   }
                          // } );

                          api.previewer.send( 'saved', response );
                          if ( response.setting_validities ) {
                              api._handleSettingValidities( {
                                  settingValidities: response.setting_validities,
                                  focusInvalidControl: true
                              } );
                          }


                          api.trigger( 'saved', response );

                          // Restore the global dirty state if any settings were modified during save.
                          // if ( ! _.isEmpty( modifiedWhileSaving ) ) {
                          //   api.state( 'saved' ).set( false );
                          // }
                    }).then( function() {
                          api.czr_savedDirties( { channel : api.previewer.channel() , saved : _saved_dirties });
                          api.czr_skopeBase.trigger('skopes-saved', _saved_dirties );
                    });//when()
              };


              if ( 0 === processing() ) {
                $.when( submitDirtySkopes() ).done( function( promises) {
                    reactWhenPromisesDone(promises);
                });//submit();
              } else {
                  submitWhenDoneProcessing = function () {
                      if ( 0 === processing() ) {
                          api.state.unbind( 'change', submitWhenDoneProcessing );
                          $.when( submitDirtySkopes() ).done( function( promises) {
                              reactWhenPromisesDone(promises);
                          });//submit();
                      }
                    };
                  api.state.bind( 'change', submitWhenDoneProcessing );
              }
        };//save()

  });//api.bind('ready')

})( wp.customize , jQuery, _ );