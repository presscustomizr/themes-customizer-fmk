
( function ( api, $, _ ) {
      /*****************************************************************************
      * FIRE SKOPE ON READY
      *****************************************************************************/
      //this promise will be resolved when
      //1) the initial skopes collection has been populated
      //2) the initial skope has been switched to
      api.czr_skopeReady = $.Deferred();
      api.bind( 'ready' , function() {
            if ( serverControlParams.isSkopOn ) {
                  api.czr_isLoadingSkope  = new api.Value( false );
                  api.czr_isLoadingSkope.bind( function( loading ) {
                        toggleSkopeLoadPane( loading );
                  });
                  api.czr_skopeBase   = new api.CZR_skopeBase();
                  api.czr_skopeSave   = new api.CZR_skopeSave();
                  api.czr_skopeReset  = new api.CZR_skopeReset();

                  api.trigger('czr-skope-started');

                  //@return void()
                  //This top note will be rendered 40s and self closed if not closed before by the user
                  var _toggleTopFailureNote = function() {
                        api.czr_skopeBase.toggleTopNote( true, {
                              title : serverControlParams.i18n.skope['There was a problem when trying to load the customizer.'],
                              message : [
                                    serverControlParams.i18n.skope['Please refer to'],
                                    '<a href="http://docs.presscustomizr.com/article/285-there-was-a-problem-when-trying-to-load-the-customizer" target="_blank">',
                                    serverControlParams.i18n.skope['this documentation page'],
                                    '</a>',
                                    serverControlParams.i18n.skope['to understand how to fix the problem.']
                              ].join(' '),
                              selfCloseAfter : 40000
                        });
                  };


                  api.czr_skopeReady
                        .done( function() {
                              api.trigger('czr-skope-ready');
                        })
                        .fail( function( error ) {
                              api.errorLog( 'Skope could not be instantiated : ' + error );
                              //This top note will be rendered 40s and self closed if not closed before by the user
                              _toggleTopFailureNote();
                              serverControlParams.isSkopOn = false;
                        })
                        .always( function() {
                              api.czr_isLoadingSkope( false );
                        });

                  //If skope was properly instantiated but there's another problem occuring after, display a self closing top notification after 30 s
                  if ( 'rejected' != api.czr_skopeReady.state() ) {
                        //Make sure the loading icon panel is destroyed after a moment
                        //Typically if there was a problem in the WP js API and the skope could not be initialized
                        //if the skopeReady state is still pending after 40 seconds, there's obviously a problem
                        setTimeout( function() {
                            if ( 'pending' == api.czr_skopeReady.state() )  {
                                  //This top note will be rendered 40s and self closed if not closed before by the user
                                  _toggleTopFailureNote();

                                  api.czr_isLoadingSkope( false );
                            }
                        }, 40000);
                  }
            }

            //let's set a lower autosave interval ( default is 60000 ms )
            if ( serverControlParams.isChangeSetOn ) {
                  api.settings.timeouts.changesetAutoSave = 10000;
            }
      } );

      //INCLUDE THE REVISION COUNT IF WP < 4.7
      if ( ! _.has( api, '_latestRevision') ) {
            /**
             * Current change count.
             */
            api._latestRevision = 0;

            /**
             * Latest revisions associated with the updated setting.
             */
            api._latestSettingRevisions = {};

            /*
             * Keep track of the revision associated with each updated setting so that
             * requestChangesetUpdate knows which dirty settings to include. Also, once
             * ready is triggered and all initial settings have been added, increment
             * revision for each newly-created initially-dirty setting so that it will
             * also be included in changeset update requests.
             */
            api.bind( 'change', function incrementChangedSettingRevision( setting ) {
                  api._latestRevision += 1;
                  api._latestSettingRevisions[ setting.id ] = api._latestRevision;
            } );
            api.bind( 'ready', function() {
                  api.bind( 'add', function incrementCreatedSettingRevision( setting ) {
                        if ( setting._dirty ) {
                              api._latestRevision += 1;
                              api._latestSettingRevisions[ setting.id ] = api._latestRevision;
                        }
                  } );
            } );
      }

      //@fired before skopeReady
      var toggleSkopeLoadPane = function( loading ) {
            loading = _.isUndefined( loading ) ? true : loading;
            var self = this, $skopeLoadingPanel,
                _render = function() {
                      var dfd = $.Deferred();
                      try {
                            _tmpl =  wp.template( 'czr-skope-pane' )({ is_skope_loading : true });
                      } catch( er ) {
                            api.errorLog( 'In toggleSkopeLoadPane : error when parsing the the reset skope template : ' + er );
                            dfd.resolve( false );
                      }
                      $.when( $('#customize-preview').after( $( _tmpl ) ) )
                            .always( function() {
                                  dfd.resolve( $( '#czr-skope-pane' ) );
                            });

                      return dfd.promise();
                },
                _destroy = function() {
                      _.delay( function() {
                            $.when( $('body').removeClass('czr-skope-pane-open') ).done( function() {
                                  _.delay( function() {
                                        $.when( $('body').removeClass('czr-skop-loading') ).done( function() {
                                              if ( false !== $( '#czr-skope-pane' ).length ) {
                                                    setTimeout( function() {
                                                          $( '#czr-skope-pane' ).remove();
                                                    }, 400 );
                                              }
                                        });
                                  }, 200);
                            });
                      }, 50);
                };

            //display load pane if skope is not yet ready and loading is true
            if ( 'pending' == api.czr_skopeReady.state() && loading ) {
                  $('body').addClass('czr-skop-loading');
                  _render()
                        .done( function( $_el ) {
                              $skopeLoadingPanel = $_el;
                        })
                        .then( function() {
                              if ( ! $skopeLoadingPanel.length )
                                return;

                              _.delay( function() {
                                    //set height
                                    var _height = $('#customize-preview').height();
                                    $skopeLoadingPanel.css( 'line-height', _height +'px' ).css( 'height', _height + 'px' );
                                    //display
                                    $('body').addClass('czr-skope-pane-open');
                              }, 50 );
                        });
            }

            api.czr_skopeReady.done( function() {
                  _destroy();
            });
            //if a destroy is requested, typically when the loading delay exceeds 15 seconds
            if ( ! loading ) {
                  _destroy();
            }
      };//toggleSkopeLoadPane

})( wp.customize , jQuery, _);