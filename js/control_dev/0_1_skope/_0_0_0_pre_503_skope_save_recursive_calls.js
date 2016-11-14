
var CZRSkopeSaveMths = CZRSkopeSaveMths || {};
$.extend( CZRSkopeSaveMths, {
      //PROCESS SUBMISSIONS
      //ALWAYS FIRE THE GLOBAL SKOPE WHEN ALL OTHER SKOPES HAVE BEEN DONE.
      //=> BECAUSE WHEN SAVING THE GLOBAL SKOPE, THE CHANGESET POST STATUS WILL BE CHANGED TO 'publish' AND THEREFORE NOT ACCESSIBLE ANYMORE
      //1) first all skopes but global, recursively
      //2) then global => will publish the changeset. Server side, the changeset post will be trashed and the next uuid will be returned to the API
      fireAllSubmission : function() {
            var self = this,
                skopesToSave = [],
                _recursiveCallDeferred = $.Deferred(),
                _responses_ = {};

            // build the skope ids array to submit recursively
            _.each( api.czr_skopeCollection(), function( _skp_ ) {
                  if ( 'global' !== _skp_.skope ) {
                        skopesToSave.push( _skp_.id );
                  }
            });


            // recursive pushes for not global skopes
            var recursiveCall = function( _index ) {
                  //on first push run, set the api state to processing.
                  // Make sure that publishing a changeset waits for all changeset update requests to complete.
                  if ( _.isUndefined( _index ) || ( ( 0 * 0 ) == _index ) ) {
                      api.state( 'processing' ).set( api.state( 'processing' ).get() + 1 );
                  }

                  _index = _index || 0;
                  if ( _.isUndefined( skopesToSave[_index] ) ) {
                        _recursiveCallDeferred.resolve( _responses_ );
                  } else {
                        console.log( 'in recursiveCall', _index, skopesToSave[ _index ] );
                        $.when( self.getSubmitPromise( skopesToSave[ _index ] ) )
                              .done( function( response ) {
                                    console.log('RECURSIVE PUSH DONE FOR SKOPE : ', skopesToSave[_index] );
                              } )
                              .fail( function( response ) {
                                    console.log('RECURSIVE PUSH FAIL FOR SKOPE : ', skopesToSave[_index] );
                              } )
                              .then( function( response ) {
                                    response = response || {};

                                    //WE NEED TO BUILD A PROPER RESPONSE HERE
                                    if ( _.isEmpty( _responses_ ) ) {
                                          _responses_ = response || {};
                                    } else {
                                          _responses_ = $.extend( _responses_ , response );
                                    }
                                    //call me again
                                    recursiveCall( _index + 1 );
                              } );
                  }
                  return _recursiveCallDeferred.promise();
            };


            // Unleash hell
            recursiveCall()
                  .done( function( r ) { console.log('RECURSIVE PUSH DONE', r );  })
                  .fail( function( r ) { console.log('RECURSIVE PUSH FAIL', r );  })
                  .then( function( r ) {
                        console.log('RECURSIVE PUSH THEN', r );
                        self.getSubmitPromise( self.globalSkopeId )
                              .done( function( r ) { console.log('GLOBAL SUBMIT DONE', r );  })
                              .fail( function( r ) { console.log('GLOBAL SUBMIT FAIL', r );  })
                              .then( function( r ) {
                                    console.log('GLOBAL SUBMIT THEN', r );
                                    //WE NEED TO BUILD A PROPER RESPONSE HERE
                                    if ( _.isEmpty( _responses_ ) ) {
                                          _responses_ = r || {};
                                    } else {
                                          _responses_ = $.extend( _responses_ , r );
                                    }
                                    console.log('CONCATENATED RESONSE : ', _responses_ );

                                    //ALL SUBMISSIONS ARE DONE, let's inform the processing state of the api
                                    api.state( 'processing' ).set( api.state( 'processing' ).get() - 1 );

                                    //EXECUTE POST SAVE ACTIONS => Resolved when refresh.done().
                                    //- Clean dirtyness
                                    //- send 'saved' event to previewer
                                    //- reset 'changesetStatus' to ''
                                    //this method is resolved with an object looking like :
                                    //{
                                    //    previewer : api.previewer,
                                    //    saved_dirties : _saved_dirties,
                                    //    skopesServerData : {
                                    //        czr_skopes : _wpCustomizeSettings.czr_skopes || [],
                                    //        skopeGlobalDBOpt : _wpCustomizeSettings.skopeGlobalDBOpt || []
                                    //    }
                                    // }
                                    self.reactWhenSubmissionsDone( _responses_ )
                                          .done( function( _obj_ ) { console.log('reactWhenSubmissionsDone DONE', _obj_ );  })
                                          .fail( function( _obj_ ) { console.log('reactWhenSubmissionsDone FAIL', _obj_ );  })
                                          .then( function( _obj_ ) {
                                                _obj_ = _.extend( {
                                                            previewer : _obj_.previewer || api.previewer,
                                                            saved_dirties : _obj_.saved_dirties || {},
                                                            skopesServerData : _obj_.skopesServerData || {}
                                                      },
                                                      _obj_
                                                );
                                                console.log('reactWhenSubmissionsDone THEN', _obj_);

                                                //Reset api values
                                                //=> api.control(setId).czr_isDirty
                                                //=> api.control(setId).czr_hasDBVal
                                                self.reactWhenSaveDone( _obj_.saved_dirties, _obj_.skopesServerData );

                                                //DEPRECATED
                                                api.czr_skopeBase.trigger('skopes-saved', _obj_._saved_dirties );

                                                //Resolve the general globalSaveDeferred.
                                                self.globalSaveDeferred.resolveWith( _obj_._previewer_, [ _responses_ ] );
                                          });

                              });
                  });
      }//fireAllSubmissions
});//$.extend








///////////////////////////////////ALWAYS SUBMIT NOT YET REGISTERED WIDGETS TO GLOBAL OPTIONS
// if ( ! api.czr_skopeBase.isExcludedSidebarsWidgets() ) {
//       _.each( skopeObjectToSubmit, function( _skop ) {
//             if ( _skop.id == globalSkopeId )
//               return;
//             console.log('>>>>>>>>>>>>>>>>>>> submit request for missing widgets globally', widget_dirties );
//             var widget_dirties = {};
//             var the_dirties = api.czr_skopeBase.getSkopeDirties( _skop.id );

//             //loop on each skop dirties and check if there's a new widget not yet registered globally
//             //if a match is found, add it to the widget_dirties, if not already added, and add it to the promises submission
//             _.each( the_dirties, function( _val, _setId ) {
//                   //must be a widget setting and not yet registered globally
//                   if ( 'widget_' == _setId.substring(0, 7) && ! api.czr_skopeBase.isWidgetRegisteredGlobally( _setId ) ) {
//                         if ( ! _.has( widget_dirties, _setId ) ) {
//                               widget_dirties[ _setId ] = _val;
//                         }
//                   }
//             });


//             if ( ! _.isEmpty(widget_dirties) ) {
//                   //each promise is a submit ajax query
//                   promises.push( submit( {
//                         skope_id : globalSkopeId,
//                         the_dirties : widget_dirties,
//                         dyn_type : 'wp_default_type'
//                     } )
//                   );
//             }
//       });
// }







//ARE THERE SKOPE EXCLUDED DIRTIES ?
  //var _skopeExcludedDirties = api.czr_skopeBase.getSkopeExcludedDirties();

  //////////////////////////////////SUBMIT EXCLUDED SETTINGS ////////////////////////////
  ///@to do : do we need to check if we are not already in the global skope ?
  // if ( ! _.isEmpty( _skopeExcludedDirties ) ) {
  //       console.log('>>>>>>>>>>>>>>>>>>> submit request for _skopeExcludedDirties', _skopeExcludedDirties );
  //       //each promise is a submit ajax query
  //       promises.push( submit( {
  //             skope_id : globalSkopeId,
  //             the_dirties : _skopeExcludedDirties,
  //             dyn_type : 'wp_default_type'
  //           })
  //       );
  // }





  ///////////////////////////////////ALWAYS SUBMIT GLOBAL SKOPE ELIGIBLE SETTINGS TO SPECIFIC GLOBAL OPTION
  // _.each( skopeObjectToSubmit, function( _skop ) {
  //       if ( _skop.skope != 'global' )
  //             return;

  //       if ( _.isUndefined( serverControlParams.globalSkopeOptName) ) {
  //             throw new Error('serverControlParams.globalSkopeOptName MUST BE DEFINED TO SAVE THE GLOBAL SKOPE.');
  //       }
  //       //each promise is a submit ajax query
  //       promises.push( submit( {
  //             skope_id : globalSkopeId,
  //             the_dirties : api.czr_skopeBase.getSkopeDirties( _skop.id ),
  //             dyn_type : 'global_option',
  //             opt_name : serverControlParams.globalSkopeOptName
  //         } )
  //       );
  // });