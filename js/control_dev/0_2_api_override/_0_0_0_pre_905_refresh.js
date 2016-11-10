
(function (api, $, _) {

    //'czr-skope-ready' is fired after the skopeBase has been initialized.
    //the api is 'ready' at this point
    api.bind( 'czr-skope-ready' , function() {
          czr_override_refresh_for_skope();
    });

    //since 4.7 (when changeset has been introduced ), the core query takes parameter
    //Typically an object looking like { excludeCustomizedSaved: true }
    api.czr_getSkopeQueryParams = function( params ) {
          if ( ! api.czr_isChangedSetOn() )
                return params;
          params = ! _.isObject(params) ? {} : params;
          var _action = params.action || 'refresh';
          switch( _action ) {
                case 'refresh' :
                    params = $.extend( params, { excludeCustomizedSaved: true } );
                break;
          }
          return params;
    };


    //fired on 'czr-skope-ready', after the skopeBase has been initialized
    czr_override_refresh_for_skope = function() {
          if ( ! serverControlParams.isSkopOn )
            return;

          /**
          * Refresh the preview.
          */
          //The purpose of this refresh method is to pass additional params to the query()
          //=> we want to know the skope, and the action
          //=> here the action is always refresh.
          //=> this way we are able to better identify what to do in the api.previewer.query method
          api.previewer._new_refresh = function( the_dirties ) {
                console.log('NEW REFRESH PARAMS', the_dirties );
                var dfd = $.Deferred();

                if ( ! _.has( api, 'czr_activeSkope') || _.isUndefined( api.czr_activeSkope() ) ) {
                      console.log( 'The api.czr_activeSkope() is undefined in the api.previewer._new_refresh() method.');
                }
                var previewer = this;

                // Display loading indicator
                previewer.send( 'loading-initiated' );

                previewer.abort();

                var query_params = api.czr_getSkopeQueryParams( {
                      skope_id : api.czr_activeSkope(),
                      action : 'refresh',
                      the_dirties : the_dirties
                });

                if ( ! _.has(api, '_previewer_loading' ) ) {
                      api._previewer_loading = $.Deferred();
                }


                previewer.loading = new api.PreviewFrame({
                      url:        previewer.url(),
                      previewUrl: previewer.previewUrl(),
                      query:      previewer.query( query_params ) || {},
                      container:  previewer.container,
                      signature:  'WP_CUSTOMIZER_SIGNATURE'//will be deprecated in 4.7
                });



                previewer.settingsModifiedWhileLoading = {};
                onSettingChange = function( setting ) {
                      previewer.settingsModifiedWhileLoading[ setting.id ] = true;
                };
                api.bind( 'change', onSettingChange );

                previewer.loading.always( function() {
                      api.unbind( 'change', onSettingChange );
                } );

                previewer.loading.done( function( readyData ) {
                      var loadingFrame = this, onceSynced;

                      previewer.preview = loadingFrame;
                      previewer.targetWindow( loadingFrame.targetWindow() );
                      previewer.channel( loadingFrame.channel() );

                      onceSynced = function() {
                            loadingFrame.unbind( 'synced', onceSynced );
                            if ( api._previousPreview ) {
                                api._previousPreview.destroy();
                            }
                            api._previousPreview = previewer.preview;
                            previewer.deferred.active.resolve();
                            delete previewer.loading;
                            dfd.resolve( previewer );
                      };
                      loadingFrame.bind( 'synced', onceSynced );

                      // This event will be received directly by the previewer in normal navigation; this is only needed for seamless refresh.
                      previewer.trigger( 'ready', readyData );
                });

                previewer.loading.fail( function( reason ) {
                      console.log('LOADING FAILED : ' , reason );
                      previewer.send( 'loading-failed' );

                      if ( 'logged out' === reason ) {
                            if ( previewer.preview ) {
                                  previewer.preview.destroy();
                                  delete previewer.preview;
                            }

                            previewer.login().done( previewer.refresh );
                      }

                      if ( 'cheatin' === reason ) {
                            previewer.cheatin();
                      }
                });

                // previewer.loading.then( function() {
                //       console.log('PREVIEWER LOADING THEN');
                // } );

                return dfd.promise();
          };


          // Debounce to prevent hammering server and then wait for any pending update requests.
          // Overrides the WP api.previewer.refresh method
          // We may need to pass force dirties here
          api.previewer.refresh = _.debounce(
                ( function( _new_refresh ) {
                      return function() {
                            var dfd = $.Deferred(), refreshOnceProcessingComplete,
                                isProcessingComplete = function() {
                                  return 0 === api.state( 'processing' ).get();
                                },
                                resolveRefresh = function() {
                                      _new_refresh.call( api.previewer ).done( function( previewer ) {
                                            dfd.resolve( previewer );
                                      });
                                };
                            if ( isProcessingComplete() ) {
                                  resolveRefresh();
                            } else {
                                  refreshOnceProcessingComplete = function() {
                                        if ( isProcessingComplete() ) {
                                              resolveRefresh();
                                              api.state( 'processing' ).unbind( refreshOnceProcessingComplete );
                                        }
                                  };
                                  api.state( 'processing' ).bind( refreshOnceProcessingComplete );
                            }
                            return dfd.promise();
                      };
                }( api.previewer._new_refresh ) ),
                api.previewer.refreshBuffer
          );

  };//czr_override_refresh_for_skope

})( wp.customize , jQuery, _ );