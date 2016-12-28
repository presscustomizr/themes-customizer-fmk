
(function (api, $, _) {
    var coreRefresh = api.Previewer.prototype.refresh;
    var _new_refresh = function( params ) {
          params = _.extend({
                      waitSkopeSynced : true,
                      the_dirties : {}
                },
                params
          );

          if ( ! _.has( api, 'czr_activeSkopeId') || _.isUndefined( api.czr_activeSkopeId() ) ) {
                api.consoleLog( 'The api.czr_activeSkopeId() is undefined in the api.previewer._new_refresh() method.');
          }
          var previewer = this, dfd = $.Deferred();

          //if too early, then let's fall back on core
          if ( ! _.has( api, 'czr_activeSkopeId') ) {
                if ( 'pending' == api.czr_skopeReady.state() ) {
                      api.czr_skopeReady.done( function() {
                            _new_refresh.apply( api.previewer, params );
                      });
                      //Fire the core one
                      coreRefresh.apply( previewer );
                      return dfd.resolve().promise();
                }
          }

          // Display loading indicator
          previewer.send( 'loading-initiated' );

          previewer.abort();

          var query_params = api.czr_getSkopeQueryParams({
                    skope_id : api.czr_activeSkopeId(),
                    action : 'refresh',
                    the_dirties : params.the_dirties || {}
              });

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

          //Needed before WP 4.7
          if ( ! api.czr_isChangeSetOn() ) {
                previewer._previousPreview = previewer._previousPreview || previewer.preview;
          }

          previewer.loading.done( function( readyData ) {
                var loadingFrame = this, onceSynced;

                previewer.preview = loadingFrame;
                previewer.targetWindow( loadingFrame.targetWindow() );
                previewer.channel( loadingFrame.channel() );
                onceSynced = function( skopesServerData ) {
                      loadingFrame.unbind( 'synced', onceSynced );
                      loadingFrame.unbind( 'czr-skopes-synced', onceSynced );

                      if ( previewer._previousPreview ) {
                            previewer._previousPreview.destroy();
                      } //before WP 4.7
                      else {
                          if ( previewer.preview )
                            previewer.preview.destroy();
                      }

                      previewer._previousPreview = previewer.preview;
                      previewer.deferred.active.resolve();
                      delete previewer.loading;

                      //Before WP 4.7
                      // if ( ! api.czr_isChangeSetOn() ) {
                      //     previewer.targetWindow( this.targetWindow() );
                      //     previewer.channel( this.channel() );
                      // }

                      api.trigger( 'pre_refresh_done', { previewer : previewer, skopesServerData : skopesServerData || {} } );
                      dfd.resolve( { previewer : previewer, skopesServerData : skopesServerData || {} } );
                };

                //Before WP 4.7 !!
                if ( ! api.czr_isChangeSetOn() ) {
                    previewer.send( 'sync', {
                          scroll:   previewer.scroll,
                          settings: api.get()
                    });
                }

                if ( params.waitSkopeSynced ) {
                      loadingFrame.bind( 'czr-skopes-synced', onceSynced );
                } else {
                      //default WP behaviour before and after 4.7
                      loadingFrame.bind( 'synced', onceSynced );
                }


                // This event will be received directly by the previewer in normal navigation; this is only needed for seamless refresh.
                previewer.trigger( 'ready', readyData );
          });

          // Note : the location param has been removed in WP 4.7
          previewer.loading.fail( function( reason, location ) {
                api.consoleLog('LOADING FAILED : ' , arguments );
                previewer.send( 'loading-failed' );
                //Before WP 4.7 !!
                if ( ! api.czr_isChangeSetOn() ) {
                    if ( 'redirect' === reason && location ) {
                          previewer.previewUrl( location );
                    }
                }

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
                dfd.reject( reason );
          });

          return dfd.promise();
    };//_new_refresh()

    //'czr-skope-started' is fired after the skopeBase has been initialized.
    //the api is 'ready' at this point
    api.bind( 'czr-skope-started' , function() {
          //post process after refresh
          //@param param = { previewer : previewer, skopesServerData : skopesServerData || {} }
          // api.bind( 'pre_refresh_done', function( params ) {
          // });
          czr_override_refresh_for_skope();
          //OVERRIDES CORE
          api.Previewer.prototype.refresh = _new_refresh;
    });

    //since 4.7 (when changeset has been introduced ), the core query takes parameter
    //Typically an object looking like { excludeCustomizedSaved: true }
    api.czr_getSkopeQueryParams = function( params ) {
          if ( ! api.czr_isChangeSetOn() )
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


    //fired on 'czr-skope-started', after the skopeBase has been initialized
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
          //
          //@params can hold an obj looking like :
          //{
          //  waitSkopeSynced : true,
          //  the_dirties : {}
          //}
          //
          //When waitSkopeSynced is set to true, the refresh will wait for the 'czr_skopes_synced' event to be synced
          //if not, it waits for the default 'synced' wp event to be resolved
          //api.previewer._new_refresh = _new_refresh;

          // Debounce to prevent hammering server and then wait for any pending update requests.
          // Overrides the WP api.previewer.refresh method
          // We may need to pass force dirties here
          api.previewer.refresh = function( _params_ ) {
                var dfd = $.Deferred();
                var _refresh_ = function( params ) {
                      var refreshOnceProcessingComplete,
                          isProcessingComplete = function() {
                            return 0 === api.state( 'processing' ).get();
                          },
                          resolveRefresh = function() {
                                _new_refresh.call( api.previewer, params ).done( function( refresh_data ) {
                                      dfd.resolve( refresh_data );
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
                };
                _refresh_ = _.debounce( _refresh_, api.previewer.refreshBuffer );
                _refresh_( _params_ );
                return dfd.promise();
          };

  };//czr_override_refresh_for_skope

})( wp.customize , jQuery, _ );