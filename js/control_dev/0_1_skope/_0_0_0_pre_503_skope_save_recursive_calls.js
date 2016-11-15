
var CZRSkopeSaveMths = CZRSkopeSaveMths || {};
$.extend( CZRSkopeSaveMths, {
      //PROCESS SUBMISSIONS
      //ALWAYS FIRE THE GLOBAL SKOPE WHEN ALL OTHER SKOPES HAVE BEEN DONE.
      //=> BECAUSE WHEN SAVING THE GLOBAL SKOPE, THE CHANGESET POST STATUS WILL BE CHANGED TO 'publish' AND THEREFORE NOT ACCESSIBLE ANYMORE
      //1) first all skopes but global, recursively
      //2) then global => will publish the changeset. Server side, the changeset post will be trashed and the next uuid will be returned to the API
      fireAllSubmission : function() {
            var self = this,
                dfd = $.Deferred(),
                skopesToSave = [],
                _recursiveCallDeferred = $.Deferred(),
                _responses_ = {},
                failedPromises = [];

            // build the skope ids array to submit recursively
            _.each( api.czr_skopeCollection(), function( _skp_ ) {
                  if ( 'global' !== _skp_.skope ) {
                        skopesToSave.push( _skp_.id );
                  }
            });


            // recursive pushes for not global skopes
            var recursiveCall = function( _index ) {
                  _index = _index || 0;
                  if ( _.isUndefined( skopesToSave[_index] ) ) {
                        if ( _.isEmpty( failedPromises ) ) {
                              _recursiveCallDeferred.resolve( _responses_ );
                        } else {
                              _recursiveCallDeferred.reject( _responses_ );
                        }
                  } else {
                        console.log( 'in recursiveCall', _index, skopesToSave[ _index ] );
                        $.when( self.getSubmitPromise( skopesToSave[ _index ] ) )
                              .done( function( response ) {
                                    console.log('RECURSIVE PUSH DONE FOR SKOPE : ', skopesToSave[_index] );
                              } )
                              .fail( function( response ) {
                                    failedPromises.push( response );
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
                  .fail( function( r ) {
                        console.log('RECURSIVE PUSH FAIL', r );
                        dfd.reject( r );
                  })
                  .done( function( r ) {
                        console.log('RECURSIVE PUSH DONE', r );
                        self.getSubmitPromise( self.globalSkopeId )
                              .fail( function( r ) {
                                    console.log('GLOBAL SUBMIT FAIL', r );
                                    dfd.reject( r );
                              })
                              .done( function( r ) {
                                    console.log('GLOBAL SUBMIT DONE', r );
                                    //WE NEED TO BUILD A PROPER RESPONSE HERE
                                    if ( _.isEmpty( _responses_ ) ) {
                                          _responses_ = r || {};
                                    } else {
                                          _responses_ = $.extend( _responses_ , r );
                                    }
                                    console.log('CONCATENATED RESPONSES : ', _responses_ );

                                    dfd.resolve( _responses_ );
                              });
                  });

            return dfd.promise();
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