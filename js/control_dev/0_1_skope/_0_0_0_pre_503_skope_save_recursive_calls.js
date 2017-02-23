
var CZRSkopeSaveMths = CZRSkopeSaveMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeSaveMths, {
      //PROCESS SUBMISSIONS
      //ALWAYS FIRE THE GLOBAL SKOPE WHEN ALL OTHER SKOPES HAVE BEEN DONE.
      //=> BECAUSE WHEN SAVING THE GLOBAL SKOPE, THE CHANGESET POST STATUS WILL BE CHANGED TO 'publish' AND THEREFORE NOT ACCESSIBLE ANYMORE
      //1) first all skopes but global, recursively
      //2) then global => will publish the changeset. Server side, the changeset post will be trashed and the next uuid will be returned to the API
      //@param params : { saveGlobal : true, saveSkopes : true }
      fireAllSubmission : function( params ) {
            var self = this,
                dfd = $.Deferred(),
                skopesToSave = [],
                _recursiveCallDeferred = $.Deferred(),
                _responses_ = {},
                _promises  = [],
                failedPromises = [],
                _defaultParams = {
                    saveGlobal : true,
                    saveSkopes : true
                };
            params = $.extend( _defaultParams, params );

            // build the skope ids array to submit recursively
            _.each( api.czr_skopeCollection(), function( _skp_ ) {
                  if ( 'global' !== _skp_.skope ) {
                        skopesToSave.push( _skp_.id );
                  }
            });

            var _mayBeresolve = function( _index ) {
                  if ( ! _.isUndefined( skopesToSave[ _index + 1 ] ) || _promises.length != skopesToSave.length )
                    return;

                  if ( _.isEmpty( failedPromises ) ) {
                        _recursiveCallDeferred.resolve( _responses_ );
                  } else {
                        var _buildResponse = function() {
                                  var _failedResponse = [];
                                  _.each( failedPromises, function( _r ) {
                                        _failedResponse.push( api.czr_skopeBase.buildServerResponse( _r ) );
                                  } );
                                  return $.trim( _failedResponse.join( ' | ') );
                        };
                        _recursiveCallDeferred.reject( _buildResponse() );
                  }
                  return true;
            };


            // recursive pushes for not global skopes
            var recursiveCall = function( _index ) {
                  _index = _index || 0;
                  if ( _.isUndefined( skopesToSave[_index] ) ) {
                        api.consoleLog( 'Undefined Skope in Save recursive call ', _index, _skopesToUpdate, _skopesToUpdate[_index] );
                        _recursiveCallDeferred.resolve( _responses_ );
                  }

                  //_promises.push( self.getSubmitPromise( skopesToSave[ _index ] ) );
                  self.getSubmitPromise( skopesToSave[ _index ] )
                        .always( function() { _promises.push( _index ); } )
                        .fail( function( response ) {
                              failedPromises.push( response );
                              api.consoleLog('RECURSIVE PUSH FAIL FOR SKOPE : ', skopesToSave[_index] );
                              if (  ! _mayBeresolve( _index ) )
                                recursiveCall( _index + 1 );
                        } )
                        .done( function( response ) {
                              //api.consoleLog('RECURSIVE PUSH DONE FOR SKOPE : ', skopesToSave[_index] );
                              response = response || {};

                              //WE NEED TO BUILD A PROPER RESPONSE HERE
                              if ( _.isEmpty( _responses_ ) ) {
                                    _responses_ = response || {};
                              } else {
                                    _responses_ = $.extend( _responses_ , response );
                              }
                              if (  ! _mayBeresolve( _index ) )
                                recursiveCall( _index + 1 );
                        } );

                  return _recursiveCallDeferred.promise();
            };


            //What do we have in the global dirties ?
            var _globalHasNewMenu = false;
            _.each( api.czr_skope('global__all_').dirtyValues(), function( _setDirtVal , _setId ) {
                  if ( 'nav_menu[' != _setId.substring( 0, 'nav_menu['.length ) )
                    return;
                  _globalHasNewMenu = true;
            } );

            var _submitGlobal = function() {
                  self.getSubmitPromise( self.globalSkopeId )
                        .fail( function( r ) {
                              api.consoleLog('GLOBAL SAVE SUBMIT FAIL', r );
                              r = api.czr_skopeBase.buildServerResponse( r );
                              dfd.reject( r );
                        })
                        .done( function( r ) {
                              //WE NEED TO BUILD A PROPER RESPONSE HERE
                              if ( _.isEmpty( _responses_ ) ) {
                                    _responses_ = r || {};
                              } else {
                                    _responses_ = $.extend( _responses_ , r );
                              }
                              dfd.resolve( { response : _responses_, hasNewMenu : _globalHasNewMenu } );
                        });
            };


            if ( _globalHasNewMenu && params.saveGlobal ) {
                  _submitGlobal();
            } else {
                  if ( params.saveGlobal && params.saveSkopes ) {
                        // Unleash hell
                        recursiveCall()
                              .fail( function( r ) {
                                    api.consoleLog('RECURSIVE SAVE CALL FAIL', r );
                                    dfd.reject( r );
                              })
                              .done( function( r ) {
                                    self.cleanSkopeChangesetMetas().always( function() { _submitGlobal(); } );
                              });
                  } else if ( params.saveGlobal && ! params.saveSkopes ) {
                          _submitGlobal();
                  } else if ( ! params.saveGlobal && params.saveSkopes ) {
                          recursiveCall()
                              .fail( function( r ) {
                                    api.consoleLog('RECURSIVE SAVE CALL FAIL', r );
                                    dfd.reject( r );
                              })
                              .done( function( r ) {
                                   //WE NEED TO BUILD A PROPER RESPONSE HERE
                                    if ( _.isEmpty( _responses_ ) ) {
                                          _responses_ = r || {};
                                    } else {
                                          _responses_ = $.extend( _responses_ , r );
                                    }
                                    self.cleanSkopeChangesetMetas().always( function() {
                                          dfd.resolve( { response : _responses_, hasNewMenu : _globalHasNewMenu } );
                                    });
                              });
                  }
            }//else

            return dfd.promise();
      },//fireAllSubmissions


      //Fired when the skopes metas have been published
      cleanSkopeChangesetMetas : function() {
            var self = this,
                dfd = $.Deferred();
                _query = $.extend(
                      api.previewer.query(),
                      { nonce:  api.previewer.nonce.save }
                );
            wp.ajax.post( 'czr_clean_skope_changeset_metas_after_publish' , _query )
                  .always( function () { dfd.resolve(); })
                  .fail( function ( response ) { api.consoleLog( 'cleanSkopeChangesetMetas failed', _query, response ); })
                  .done( function( response ) { api.consoleLog( 'cleanSkopeChangesetMetas done', _query, response ); });

            return dfd.promise();
      }
});//$.extend
})( wp.customize , jQuery, _ );








///////////////////////////////////ALWAYS SUBMIT NOT YET REGISTERED WIDGETS TO GLOBAL OPTIONS
// if ( ! api.czr_skopeBase.isExcludedSidebarsWidgets() ) {
//       _.each( skopeObjectToSubmit, function( _skop ) {
//             if ( _skop.id == globalSkopeId )
//               return;
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