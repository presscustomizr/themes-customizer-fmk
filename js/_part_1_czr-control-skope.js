
( function ( api, $, _ ) {
      /*****************************************************************************
      * A SKOPE AWARE PREVIEWER QUERY
      *****************************************************************************/
      api.bind('ready', function() {
            if ( ! serverControlParams.isSkopOn )
              return;

            /**
            * Build the query to send along with the Preview request.
            *
            * @return {object}
            */
            var _coreQuery = api.previewer.query;


            //@todo : turn those arguments into an object ?
            //the dyn_type can also be set to 'wp_default_type' when saving a skope excluded setting
            //@queryVars = {
            //    skope_id : string,
            //    action : string,
            //    the_dirties : {},
            //    dyn_type : string,
            //    opt_name : string
            // }
            api.previewer.query =  function( queryVars ) {
                  //if skope instantiation went wrong, serverControlParams.isSkopOn has been reset to false
                  //=> that's why we check it here again before doing anything else
                  if ( ! serverControlParams.isSkopOn ) {
                        return _coreQuery.apply( this );
                  }

                  //IS SKOP ON
                  //falls back to WP core treatment if skope is not on or if the requested skope is not registered
                  if ( ! _.has( api, 'czr_skope') ) {
                        api.consoleLog('QUERY : SKOPE IS NOT FULLY READY YEY. FALLING BACK ON CORE QUERY');
                        return _coreQuery.apply( this );
                  }

                  //HAS THE FIRST SKOPE COLLECTION BEEN POPULATED ?
                  if ( 'pending' == api.czr_initialSkopeCollectionPopulated.state() ) {
                        api.consoleLog('QUERY : INITIAL SKOPE COLLECTION NOT POPULATED YET. FALLING BACK ON CORE QUERY');
                        return _coreQuery.apply( this );
                  }

                  //the previewer is now skope aware
                  if ( 'pending' == api.czr_isPreviewerSkopeAware.state() ) {
                        api.czr_isPreviewerSkopeAware.resolve();
                        //return _coreQuery.apply( this );
                  }

                  //Skope is fully ready but the query is accessed from core (widgets) or a plugin
                  //=> fallback on the core method
                  if ( ! _.isObject( queryVars ) && 'resolved' == api.czr_initialSkopeCollectionPopulated.state() && 'resolved' == api.czr_initialSkopeCollectionPopulated.state() ) {
                        return _coreQuery.apply( this );
                  }

                  //IS THE SKOPE ID PROVIDED ?
                  //When navigating in the preview, the skope_id might not be provided.
                  //In this case, falls back on the activeSkope() or the global skope
                  //skope_id = skope_id || api.czr_activeSkopeId() || api.czr_skopeBase.getGlobalSkopeId();
                  if ( _.isUndefined( queryVars.skope_id ) || ! _.isString( queryVars.skope_id ) ) {
                        queryVars.skope_id = api.czr_activeSkopeId() || api.czr_skopeBase.getGlobalSkopeId();
                  }

                  var globalCustomized = {},
                      skopeCustomized = {},
                      _defaults = {
                            skope_id : null,
                            action : null,
                            the_dirties : {},
                            dyn_type : null,
                            opt_name : null
                      },
                      _to_return;

                  queryVars = $.extend( _defaults, queryVars );

                  //ARE THE DIRTIES WELL FORMED OR NOT EMPTY ?
                  if ( ! _.isObject( queryVars.the_dirties ) ) {
                        api.consoleLog('QUERY PARAMS : ', queryVars );
                        throw new Error( 'QUERY DIRTIES MUST BE AN OBJECT. Requested action : ' + queryVars.action );
                  }

                  ///TO CHANGE ?
                  if ( 'pending' != api.czr_isPreviewerSkopeAware.state() && _.isNull( queryVars.skope_id ) ) {
                        api.consoleLog('QUERY PARAMS : ', queryVars );
                        //api.consoleLog( 'OVERRIDEN QUERY : NO SKOPE ID. FALLING BACK ON CORE QUERY.' );
                        throw new Error( 'OVERRIDEN QUERY : NO SKOPE ID. FALLING BACK ON CORE QUERY. Requested action : ' + queryVars.action );
                        //return _coreQuery.apply( this );
                  }

                  //IS THE REQUESTED ACTION AUTHORIZED ?
                  if ( ! _.contains( [ null, 'refresh', 'save', 'reset', 'changeset_update' ], queryVars.action ) ) {
                        api.consoleLog('QUERY PARAMS : ', queryVars );
                        throw new Error( 'A REQUESTED QUERY HAS NO AUTHORIZED ACTION. Requested action : ' + queryVars.action );
                  }

                  //@return an object of customized values for each of the current skopes :
                  //{
                  //  'skope_id_1' = { ... },
                  //  'skope_id_2' = { ... }
                  //}
                  var _getSkopesCustomized = function() {
                        //if the initial skope collection has been populated, let's populate the skopeCustomized
                        if ( 'pending' == api.czr_initialSkopeCollectionPopulated.state() )
                          return {};
                        var _skpCust = {};
                        //Loop current skopes collection
                        //Exclude the global skope
                        _.each( api.czr_currentSkopesCollection(), function( _skp ) {
                              if ( 'global' == _skp.skope )
                                return;
                              _skpCust[_skp.id] = api.czr_skopeBase.getSkopeDirties( _skp.id );
                        } );
                        return _skpCust;
                  };



                  ///BUILD THE DIRTIES
                  //There are cases ( _forceSidebarDirtyRefresh ) when the dirties can be passed as param
                  //In this cases, we use them and assign them to the relevant customized object
                  //Since 4.7 and the changeset introduction, the boolean param 'excludeCustomizedSaved' can be passed to the query
                  if ( _.isNull( queryVars.the_dirties ) || _.isEmpty( queryVars.the_dirties ) ) {
                        globalCustomized = api.dirtyValues( { unsaved:  queryVars.excludeCustomizedSaved || false } );
                        skopeCustomized = _getSkopesCustomized();
                  } else {
                        if ( 'global' == api.czr_skopeBase.getActiveSkopeName() )
                          globalCustomized = queryVars.the_dirties;
                        else
                          skopeCustomized[ api.czr_activeSkopeId() ] = queryVars.the_dirties;
                  }


                  ///HANDLE THE VARIOUS CASES : REFRESH, SAVE, RESET
                  //on first load OR if the current skope is the customized one, build the globalCustomized the regular way : typically a refresh after setting change
                  //otherwise, get the dirties from the requested skope instance : typically a save action on several skopes
                  switch( queryVars.action ) {
                        case null :
                        case 'refresh' :
                              //INHERITANCE : FILTER THE DIRTIES
                              //when refreshing the preview, we need to apply the skope inheritance to the customized values
                              //apply the inheritance
                              // var _inheritanceReadyCustomized = {};
                              // _.each( skopeCustomized, function( _custValues, _skopId ) {
                              //       _inheritanceReadyCustomized[_skopId] =  api.czr_skopeBase.applyDirtyCustomizedInheritance( _custValues, _skopId );
                              // } );
                              // skopeCustomized = _inheritanceReadyCustomized;

                              //globalCustomized = api.czr_skopeBase.applyDirtyCustomizedInheritance( globalCustomized, api.czr_skopeBase.getGlobalSkopeId() );
                        break;

                        case 'changeset_update' :
                              if ( _.isUndefined( queryVars.opt_name ) ) {
                                    throw new Error('Missing opt_name param in the changeset_update query for skope : ' + queryVars.skope_id );
                              }
                        break;


                        case 'save' :
                              // if ( _.isEmpty( queryVars.the_dirties ) ) {
                              //       throw new Error( 'QUERY : A SAVE QUERY MUST HAVE A NOT EMPTY DIRTY OBJECT TO SUBMIT' );
                              // }
                              //Set the Dyn type
                              //the dyn type might be passed as a param to the query in some cases
                              //typically to save skope excluded settings. In this case the dyn_type is set to false, to fall back on the default wp one : theme_mod or option
                              if ( _.isNull( queryVars.dyn_type ) )
                                    queryVars.dyn_type = api.czr_skope( queryVars.skope_id )().dyn_type;//post_meta, term_meta, user_meta, trans, option
                              if ( _.isNull( queryVars.dyn_type ) || _.isUndefined( queryVars.dyn_type ) ) {
                                    throw new Error( 'QUERY : A SAVE QUERY MUST HAVE A VALID DYN TYPE.' + queryVars.skope_id );
                              }
                              //Set the dirties  || api.czr_skopeBase.getSkopeDirties(skope_id) ?
                              //globalCustomized = queryVars.the_dirties; //was : api.czr_skope( skope_id ).dirtyValues();
                        break;

                        case 'reset' :
                              //no specific treatment for reset
                              if ( _.isNull( queryVars.dyn_type ) )
                                    queryVars.dyn_type = api.czr_skope( queryVars.skope_id )().dyn_type;//post_meta, term_meta, user_meta, trans, option
                              if ( _.isNull( queryVars.dyn_type ) || _.isUndefined( queryVars.dyn_type ) ) {
                                    throw new Error( 'QUERY : A RESET QUERY MUST HAVE A VALID DYN TYPE.' + queryVars.skope_id );
                              }
                        break;
                  }


                  //BUILD THE CURRENT SKOPES ARRAY
                  var _current_skopes = {};
                  _.each( api.czr_currentSkopesCollection(), function( _skp ) {
                        _current_skopes[_skp.skope] = { id : _skp.id, opt_name : _skp.opt_name };
                  });


                  //Before 4.7 and the changeset introduction, the queryVars were :
                  //{
                  //  wp_customize: 'on',
                  //  theme:      api.settings.theme.stylesheet,
                  //  customized: JSON.stringify( globalCustomized ),
                  //  nonce:      this.nonce.preview
                  //}

                  //Since 4.7 the queryVars are :
                  //{
                  //  wp_customize: 'on',
                  //  customize_theme: api.settings.theme.stylesheet,
                  //  customized : JSON.stringify( api.dirtyValues( { unsaved: options && options.excludeCustomizedSaved } ) );
                  //  nonce: this.nonce.preview,
                  //  customize_changeset_uuid: api.settings.changeset.uuid
                  //}

                  //common properties
                  _to_return = {
                        wp_customize: 'on',
                        //theme is added after, because the property name has been changed to customize_theme in 4.7
                        //always make sure that the customized values is not empty, otherwise nothing will be posted since 4.7.
                        //@see api.PreviewFrame::run()
                        customized:      '{}' == JSON.stringify( globalCustomized ) ? '{\"__not_customized__\"}' : JSON.stringify( globalCustomized ),
                        skopeCustomized:  JSON.stringify( skopeCustomized ),
                        nonce:            this.nonce.preview,
                        skope:            api.czr_skope( queryVars.skope_id )().skope,
                        level_id:          api.czr_skope( queryVars.skope_id )().level,
                        skope_id:         queryVars.skope_id,
                        dyn_type:         queryVars.dyn_type,
                        opt_name:         ! _.isNull( queryVars.opt_name ) ? queryVars.opt_name : api.czr_skope( queryVars.skope_id )().opt_name,
                        obj_id:           api.czr_skope( queryVars.skope_id )().obj_id,
                        current_skopes:   JSON.stringify( _current_skopes ) || {},
                        channel:          this.channel(),
                        revisionIndex:    api._latestRevision
                  };

                  //since 4.7
                  if ( api.czr_isChangeSetOn() ) {
                        _to_return = $.extend( _to_return , {
                              customize_theme: api.settings.theme.stylesheet,
                              customize_changeset_uuid: api.settings.changeset.uuid
                        });
                  }
                  //before 4.7
                  else {
                        _to_return = $.extend( _to_return , {
                              theme: api.settings.theme.stylesheet
                        });
                  }
                  // api.consoleLog('DIRTY VALUES TO SUBMIT ? ', globalCustomized, api.czr_skopeBase.getSkopeDirties(skope_id) );
                  return _to_return;

            };//api.previewer.query
      });//api.bind('ready')
})( wp.customize , jQuery, _ );
( function ( api, $, _ ) {
      api.bind( 'czr-skope-started', function() {
            //OVERRIDES WP
            api.previewer.save = function( args ) {
                  return api.czr_skopeSave.save( args );
            };
      });//api.bind('ready')
})( wp.customize , jQuery, _ );
(function (api, $, _) {
      if ( ! serverControlParams.isSkopOn )
        return;

      /*****************************************************************************
      * SYNCHRONIZER AUGMENTED
      *****************************************************************************/
      // var _original_element_initialize = api.Element.prototype.initialize;
      // api.Element.prototype.initialize = function( element, options  ) {
      //         //call the original constructor
      //         _original_element_initialize .apply( this, [element, options ] );
      //         api.consoleLog('IN OVERRIDEN INITIALIZE ELEMENT ?');
      //         // if ( this.element.is('select') ) {
      //         //     api.consoleLog('element, options', element, options);
      //         // }
      // };

      // //CHECKBOX WITH ICHECK
      api.Element.synchronizer.checkbox.update = function( to ) {
            this.element.prop( 'checked', to );
            this.element.iCheck('update');
      };

      var _original = api.Element.synchronizer.val.update;
      api.Element.synchronizer.val.update = function(to) {
            var self = this,
                _modifySynchronizer = function() {
                      //SELECT CASE
                      if ( self.element.is('select') ) {
                            //SELECT2 OR SELECTER
                            //select2.val() documented https://select2.github.io/announcements-4.0.html
                            self.element.val(to).trigger('change');
                      } else if ( self.element.hasClass('wp-color-picker') ) {
                            //COLOR PICKER CASE
                            self.element.val(to).trigger('change');
                      }
                      else {
                            //falls back to the parent behaviour
                            self.element.val( to );
                      }
                };
            //if skope on,
            //wait for skope to be fully loaded to alter this
            if ( serverControlParams.isSkopOn ) {
                  if ( 'resolved' != api.czr_skopeReady.state() ) {
                        return _original.call( self, to );
                  } else {
                        api.czr_skopeReady.then( function () {
                              _modifySynchronizer();
                        });
                  }
            } else {
                  _modifySynchronizer();
            }
      };

      api.Element.synchronizer.val.refresh = function() {
            var syncApiInstance = this;
            //SELECT CASE
            //Avoid null values because not taken into account by the api.value.set() method
            //=> keep the same var type empty if the setting val is reset by user
            if ( this.element.is('select') && _.isNull( this.element.val() ) ) {
                  if ( _.isArray( syncApiInstance() ) )
                    return [];
                  else if ( _.isObject( syncApiInstance() ) )
                    return {};
                  else
                    return '';
            } else {
                  //falls back to the parent behaviour
                  return  this.element.val();
            }
      };
})( wp.customize , jQuery, _ );
( function ( api, $, _ ) {
      var coreRefresh = api.Previewer.prototype.refresh;
      var _new_refresh = function( params ) {
            params = _.extend({
                        waitSkopeSynced : true,
                        the_dirties : {}
                  },
                  params
            );

            var previewer = this, dfd = $.Deferred();

            //if skope instantiation went wrong, serverControlParams.isSkopOn has been reset to false
            //=> that's why we check it here again before doing anything else
            if ( ! serverControlParams.isSkopOn ) {
                  return dfd.resolve().promise();
            }

            //if too early, then let's fall back on core
            if ( ! _.has( api, 'czr_activeSkopeId') || _.isUndefined( api.czr_activeSkopeId() ) ) {
                  api.consoleLog( 'The api.czr_activeSkopeId() is undefined in the api.previewer._new_refresh() method.');
                  //Fire the core one
                  coreRefresh.apply( previewer );
                  return dfd.resolve().promise();

                  //PREVIOUS CODE
                  // if ( 'resolved' != api.czr_skopeReady.state() ) {
                  //       api.czr_skopeReady.done( function() {
                  //             _new_refresh.apply( api.previewer, params );
                  //       });
                  //       //Fire the core one
                  //       coreRefresh.apply( previewer );
                  //       return dfd.resolve().promise();
                  // }
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
                  api.consoleLog('LOADING FAILED : ' ,  reason, location, arguments );
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
( function ( api, $, _ ) {
      if ( ! serverControlParams.isSkopOn )
        return;

      /**
       * Get the dirty setting values.
       * Overrides the default method introduced in 4.7
       * !! This method only returns the dirties of the global skope !!
       *
       * @param {object} [options] Options.
       * @param {boolean} [options.unsaved=false] Whether only values not saved yet into a changeset will be returned (differential changes).
       * @returns {object} Dirty setting values.
       */
      api.dirtyValues = function dirtyValues( options ) {
            return api.czr_skopeBase.getSkopeDirties( api.czr_skopeBase.getGlobalSkopeId(), options );
      };

})( wp.customize , jQuery, _ );
( function ( api, $, _ ) {
      if ( ! serverControlParams.isSkopOn || ! api.czr_isChangeSetOn() )
        return;

      //WP Changeset is requested for an update with an ajax query in the following situation :
      //1) before unloading the window
      //2) when focus removed from window.
      //3) on schedule : every 60 000 ms. ( api.settings.timeouts.changesetAutoSave ) <= set to 10 000 ms on api 'ready' for skope
      //
      //
      //But the update will only takes place if the current api.dirtyValues() are not empty. That's the problem we address with this override.
      //The function api.dirtyValues() only returns :
      //1) the dirty settings of the global skope
      //2) AND that have not been saved during the latest saved revision ( api._lastSavedRevision )
      //
      //
      //So we need to find a way to fire a changeset update for all the other skopes
      //The proposed solution here is to base the changeset update decision not on the emptyness of the dirtyValues but on the api._latestRevision index.
      //
      //
      //How does the saved and revision index works.
      //api._lastSavedRevision is set when the changeset update request is done() with the following code :
      //api._lastSavedRevision = Math.max( api._latestRevision, api._lastSavedRevision );
      //
      //api._latestRevision is incremented +1 each time a setting change occurs in the api. Not matter in which skope this change has been done.
      //
      //Therefore, as soon as we detect that api._latestRevision > api._lastSavedRevision, then we can authorize a changeset update.
      //The changeset update request will pass the usual skope query parameters, including the current skope dirtyness.
      //=> this will allow an ajax update of the changeset post metas for the modified skopes.
      //
      //
      //IMPORTANT :
      //If the 0 === api._lastSavedRevision is empty and that we are not customizing the global skope,
      //it means that the changeset post ID will not be set yet
      //=> But the skope meta changeset need a post ID ! when doing the ajax request server side
      //so the original method has to be fired with a dummy change,
      //this will pass the write the _.isEmpty( submittedChanges ) test in api.requestChangesetUpdate() and create a post ID


      //Backup the original method
      var _original_requestChangesetUpdate = api.requestChangesetUpdate;

      /**
       * Request updates to the changeset.
       * @since 4.7.0
       * @access public
       *
       * @param {object}  [changes] - Mapping of setting IDs to setting params each normally including a value property, or mapping to null.
       *                             If not provided, then the changes will still be obtained from unsaved dirty settings.
       * @param {object}  [args] - Additional options for the save request.
       * @param {boolean} [args.autosave=false] - Whether changes will be stored in autosave revision if the changeset has been promoted from an auto-draft.
       * @param {boolean} [args.force=false] - Send request to update even when there are no changes to submit. This can be used to request the latest status of the changeset on the server.
       * @param {string}  [args.title] - Title to update in the changeset. Optional.
       * @param {string}  [args.date] - Date to update in the changeset. Optional.
       * @returns {jQuery.Promise} Promise resolving with the response data.
       */
      //@4.9compat : added _args_
      api.requestChangesetUpdate = function( changes, _args_ ) {
            var self = this,
                dfd = $.Deferred(),
                data,
                _skopesToUpdate = [],
                _promises = [],
                _global_skope_changes = changes || {},
                failedPromises = [],
                _all_skopes_data_ = [],
                _recursiveCallDeferred = $.Deferred();
                // _original = function( changes ) {
                //     _original_requestChangesetUpdate(changes).then( function( data ) {
                //         dfd.resolve( data );
                //     });
                // };

            //if skope instantiation went wrong, serverControlParams.isSkopOn has been reset to false
            //=> that's why we check it here again before doing anything else
            if ( ! serverControlParams.isSkopOn ) {
                  return _original_requestChangesetUpdate();
            }


            //MAKES SURE THAT A CHANGESET POST ID EXISTS
            //=> add a dummy_change to global if if ( 0 === api._lastSavedRevision || _.isEmpty( api.state( 'changesetStatus' )() ) )
            //
            //and that we are not customizing the global skope,
            //it means that the changeset post ID will not be set yet, so let's fire the original
            //The core WP method will only create a new changeset post if there is something to save
            //=> that's the purpose of this dummy_change
            if ( 0 === api._lastSavedRevision || _.isEmpty( api.state( 'changesetStatus' )() ) ) {
                  _global_skope_changes = _.extend( _global_skope_changes, {
                        blogname : { dummy_change : 'dummy_change' }
                  } );
            }

            //POPULATE THE SKOPE CHANGESET UPDATES PROMISES
            //Loop current skopes collection
            //Exclude the global skope
            _.each( api.czr_currentSkopesCollection(), function( _skp ) {
                  if ( 'global' == _skp.skope )
                    return;
                  _skopesToUpdate.push( _skp.id );
            } );

            var _mayBeresolve = function( _index ) {
                  if ( ! _.isUndefined( _skopesToUpdate[ _index + 1 ] ) || _promises.length != _skopesToUpdate.length )
                    return;

                  if ( _.isEmpty( failedPromises ) ) {
                        _recursiveCallDeferred.resolve( _all_skopes_data_ );
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
                  //on first push run, set the api state to processing.
                  // Make sure that publishing a changeset waits for all changeset update requests to complete.
                  if ( _.isUndefined( _index ) || ( ( 0 * 0 ) == _index ) ) {
                      api.state( 'processing' ).set( 1 );
                  }

                  _index = _index || 0;
                  if ( _.isUndefined( _skopesToUpdate[_index] ) ) {
                        api.consoleLog( 'Undefined Skope in changeset recursive call ', _index, _skopesToUpdate, _skopesToUpdate[_index] );
                        return _recursiveCallDeferred.resolve( _all_skopes_data_ ).promise();
                  }

                  //_promises.push( self.getSubmitPromise( _skopesToUpdate[ _index ] ) );
                  ////@4.9compat : added _args_ param
                  api._requestSkopeChangetsetUpdate( changes, _skopesToUpdate[_index], _args_ )
                        .always( function() { _promises.push( _index ); } )
                        .fail( function( response ) {
                              failedPromises.push( response );
                              api.consoleLog('CHANGESET UPDATE RECURSIVE FAIL FOR SKOPE : ', _skopesToUpdate[_index] );
                              if (  ! _mayBeresolve( _index ) )
                                recursiveCall( _index + 1 );
                        } )
                        .done( function( _skope_data_ ) {
                              _all_skopes_data_.push( _skope_data_ );
                              if (  ! _mayBeresolve( _index ) )
                                recursiveCall( _index + 1 );
                        } );

                  return _recursiveCallDeferred.promise();
            };




            //RESOLVE WITH THE WP GLOBAL CHANGESET PROMISE WHEN ALL SKOPE PROMISES ARE DONE
            //PROBLEM TO SOLVE : in the core original changeset method, the api._lastSavedRevision property is incremented when global dirties are saved
            //=> between the core changeset update and before the skope changeset update, we need to reset the api._lastSavedRevision to its previous value
            //=> otherwise some dirties might not be taken into account in the skope.
            //=> This can happen typically for a setting dirty both in global and other skope(s)
            var _lastSavedRevisionBefore = api._lastSavedRevision;
            //@4.9 compat : added _args_ param
            _original_requestChangesetUpdate( _global_skope_changes, _args_ )
                  .fail( function( r ) {
                        api.consoleLog( 'WP requestChangesetUpdateFail', r, api.czr_skopeBase.buildServerResponse(r) );

                        // Ensure that all settings updated subsequently will be included in the next changeset update request.
                        api._lastSavedRevision = Math.max( api._latestRevision, api._lastSavedRevision );
                        //api.state( 'changesetStatus' ).set( _data_.changeset_status );
                        // Make sure that publishing a changeset waits for all changeset update requests to complete.
                        api.state( 'processing' ).set( 0 );

                        dfd.reject( r );
                        r = api.czr_skopeBase.buildServerResponse(r);
                        api.czr_serverNotification( { message: r, status : 'error' } );
                  })
                  .done( function( wp_original_response ) {
                        // $.when.apply( null, _promises ).then( function() {
                        //       dfd.resolve( wp_original_response );
                        // });
                        //Restore the _lastSavedRevision index to its previous state to not miss any setting that could have been updated by WP for global.

                        //Bail if attempting to update the skope changesets before the initial collection has been populated
                        if ( 'pending' == api.czr_initialSkopeCollectionPopulated.state() )
                          dfd.resolve( wp_original_response );

                        api._lastSavedRevision = _lastSavedRevisionBefore;
                        recursiveCall()
                              .always( function() {
                                    // Ensure that all settings updated subsequently will be included in the next changeset update request.
                                    api._lastSavedRevision = Math.max( api._latestRevision, api._lastSavedRevision );

                                    //api.state( 'changesetStatus' ).set( _data_.changeset_status );
                                    // Make sure that publishing a changeset waits for all changeset update requests to complete.
                                    api.state( 'processing' ).set( 0 );
                              })
                              .fail( function( r ) {
                                    dfd.reject( r );
                                    api.consoleLog( 'CHANGESET UPDATE RECURSIVE PUSH FAIL', r , _all_skopes_data_ );
                                    api.trigger( 'changeset-error', r );
                                    api.czr_serverNotification( { message: r, status : 'error' } );
                              } )
                              .done( function() {
                                    dfd.resolve( wp_original_response );
                              });
                  });

            return dfd.promise();
      };



      //@update the changeset meta for a given skope
      //Adapted copy from the original api.requestChangesetUpdate()
      //@4.9compat : added _args_ param
      api._requestSkopeChangetsetUpdate = function( changes, skope_id, _args_ ) {
            if ( _.isUndefined( skope_id ) || ! api.czr_skope.has( skope_id ) ) {
                  throw new Error( 'In api._requestSkopeChangetsetUpdate() : a valid and registered skope_id must be provided' );
            }

            var deferred = new $.Deferred(),
                request,
                submittedChanges = {},
                data,
                submittedArgs;

            //if no skope has been provided, then let's use the active one
            skope_id = skope_id || api.czr_activeSkopeId();

            //<@4.9compat>
            // Prevent attempting changeset update while request is being made.
            // Disabled
            // if ( 0 !== api.state( 'processing' ).get() ) {
            //   deferred.reject( 'already_processing' );
            //   return deferred.promise();
            // }

            //<@4.9compat>
            submittedArgs = _.extend( {
              title: null,
              date: null,
              autosave: false,
              force: false
            }, args );
            //</@4.9compat>

            if ( changes ) {
                  _.extend( submittedChanges, changes );
            }


            //Ensure all revised settings (changes pending save) are also included, but not if marked for deletion in changes.
            _.each( api.czr_skopeBase.getSkopeDirties( skope_id ) , function( dirtyValue, settingId ) {
                  if ( ! changes || null !== changes[ settingId ] ) {
                        submittedChanges[ settingId ] = _.extend(
                              {},
                              submittedChanges[ settingId ] || {},
                              { value: dirtyValue }
                        );
                  }
            } );


            //<@4.9compat>
            // Short-circuit when there are no pending changes.
            if ( ! submittedArgs.force && _.isEmpty( submittedChanges ) && null === submittedArgs.title && null === submittedArgs.date ) {
                  deferred.resolve( {} );
                  return deferred.promise();
            }

            // A status would cause a revision to be made, and for this wp.customize.previewer.save() should be used. Status is also disallowed for revisions regardless.
            if ( submittedArgs.status ) {
              return deferred.reject( { code: 'illegal_status_in_changeset_update' } ).promise();
            }

            // Dates not being allowed for revisions are is a technical limitation of post revisions.
            if ( submittedArgs.date && submittedArgs.autosave ) {
              return deferred.reject( { code: 'illegal_autosave_with_date_gmt' } ).promise();
            }
            //</@4.9compat>

            if ( api._latestRevision <= api._lastSavedRevision ) {
                  deferred.resolve( {} );
                  return deferred.promise();
            }

            // Allow plugins to attach additional params to the settings.
            api.trigger( 'skope-changeset-save', submittedChanges );

            var queryVars = {
                  skope_id : skope_id,
                  action : 'changeset_update',
                  opt_name : api.czr_skope( skope_id ).opt_name
            };

            //BUILD THE QUERY
            data = api.previewer.query( _.extend( queryVars, { excludeCustomizedSaved: true } ) );
            delete data.customized; // Being sent in customize_changeset_data instead.
            _.extend( data, {
                  nonce: api.settings.nonce.save,
                  customize_changeset_data: JSON.stringify( submittedChanges )
            } );

            // var _dumby_request = function( _data ) {
            //     var dfd = $.Deferred();
            //     setTimeout( function() {
            //         dfd.resolve( _data );
            //     }, 5000 );
            //     return dfd.promise();
            // };

            ////////////////////// FIRE THE REQUEST //////////////////////
            //request = _dumby_request( data );
            wp.ajax.post( 'customize_skope_changeset_save', data )
                  .done( function requestChangesetUpdateDone( _data_ ) {
                        //api.consoleLog('SKOPE CHANGETSET DONE FOR SKOPE ' + _data_.skope_id , _data_ );
                        deferred.resolve( _data_ );
                        //api.trigger( 'changeset-saved', _data_ );
                  } )
                  .fail( function requestChangesetUpdateFail( _data_ ) {
                        api.consoleLog('SKOPE CHANGESET FAIL FOR SKOPE ' + _data_.skope_id, _data_ );
                        deferred.reject( _data_ );
                        //api.trigger( 'changeset-error', _data_ );
                  } )
                  .always( function( _data_ ) {
                        if ( _data_.setting_validities ) {
                              api._handleSettingValidities( {
                                    settingValidities: _data_.setting_validities
                              } );
                        }
                  } );

            return deferred.promise();
      };
})( wp.customize , jQuery, _ );
( function ( api, $, _ ) {
      /*****************************************************************************
      * FIRE SKOPE ON READY
      *****************************************************************************/
      //this promise will be resolved when
      //1) the initial skopes collection has been populated
      //2) the initial skope has been switched to
      //
      //OR if skope is disabled
      //note : api.czr_skopeReady has been declared earlier, in the early helpers
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

  //WHAT IS A SKOPE ?
  //A skope is an object describing a set of options for a given customization context
  //It is constructed by the czr_skopeModel constructor
  //it has a model with the following properties
  // - a name : 'global', 'all_posts'
  // - a corresponding database option name
  // - a database option type (dyn_type)
  // - a customization status : active, inactive. Are we currently customizing this skope ?
  // - a priority status that can be forced
  // - an applied status => is this skope the one that will be applied on front end in the current context?
  //  => this status depends on :
  //      1) a default priority local (post id ) > global specific (all posts) > global (default options)
  //      2) a user decision : a priority can be forced. For example who is the winner when two categories have been customized ?
  // - a dirtyness status : has this skope been customized ?
  // - a set of values, each one having a dirtyness state => the  : { optname#2 : { value : ..., _dirty : bool }, optname#2 : {...}, ...  }
  //
  // It is rendered with a view which includes DOM listeners.
  // Users can :
  //  - customize each skope separately,
  //  - force a priority
  //  - reset a skope set of option
  //  - copy the values of one skope to another
  //
  //  What is the default skope ?
  //  - 'global' when accessing the customizer from appearance > customize
  //  - 'local' when customizing from the front end, or an edit screen : post (post, cpt, page, attachment), tax term, user
  //
  //  What are the options eligibile for the skope customization ?
  //  - the skope customization can be applied to all theme settings 'hu_theme_options'. The option not eligible have been flagged 'no-skope' when registered server side.
  //  - the WP built-in settings like blogname, site-icon,... are also eligible
  //  - all other settings like menu, widgets, sidebars are excluded for the moment.
  //
  //  On init, the default skope is set as active.
  //  if the default skope is not 'global', then the switch to the relevant skope is triggered and the eligible settings values are updated "silently"
  //  the dirties are stored in each skope models when the user customize
  //
  //
  //  On skope switch,
  //  1) the values of the dirty values of the current skope are stored in the model
  //  2) the values of the new skope are fetched from the db if they have not been yet.
  //  3) all eligible settings are updated with the new values.
  //  4) if the new skope has no dirty value yet, the saved state is reset.
  //
  //
  //
  //
  //
  // WHAT IS THE SKOPE PRIORITY CONCEPT ?
  // Since a given option can have its value set differently for each skope level, a priority must be defined, in order to know what is the value to use.
  //
  //  => The skope priority defines which option value will be used if this option has been customized in several skopes.
  //
  // There are 3 main levels of skopes :
  // 1) GLOBAL : the options applied to the entire website. Those are saved in the regular (the old) theme options
  // 2) SPECIAL GROUP : those groups are dynamically set, depending on how a user creates a post or a page
  //      all posts from a specific author,
  //      all posts tagged with a specific tag,
  //      all posts tagged with a specific category,
  //      all pages using a specific template
  // 3) GROUP : the options applied to a group of contexts. Those are saved as long life transients
  //      all pages,
  //      all posts,
  //      all tags,
  //      all categories,
  //      all authors,
  // 4) LOCAL : the options applied to a specific context :
  //      a page,
  //      a post (or a CPT),
  //      an attachment,
  //      a tag archive page,
  //      a category archive page,
  //      an author archive page,
  //      the home page,
  //      the 404 page,
  //      the search results page,
  // Note: except for home, 404 and search which are saved as transients, the other local skopes are saved as metas : post metas, term metas, user metas
  //
  // Priorities without the special group (tag, cat, author):
  //    - For a post, page or term : LOCAL (this post id) > GROUP (all posts)  > GLOBAL (entire website options)
  //    - For home, 404, search : LOCAL > GLOBAL. There's no GROUP in this case.
  //    - for a term archive (tag, cat, custom tax) : LOCAL (the term id) > GROUP ( all terms of this type ) > GLOBAL
  //
  // Priorities with the special groups : this is relevant for post and pages only.
  // Let's take a post example.
  // A user can decide to define a set of option (a skope) for all posts tagged with a specific tag.
  // In this case the priority is : LOCAL > SPECIAL GROUP (the "post tagged with {tag}") > GROUP > GLOBAL
  // CONFLICT CASE : If a given post has several terms, and if more than one term have a customized skope.
  //  => since no priority can be defined between two terms, the priority is back to the default : LOCAL > GROUP > GLOBAL
  // How to fix a conflict case ?
  // It is possible to force a "winner" within the special groups. When editing a skope, the user can check an option (! => force this skope when relevant )
  // => if there's a forced winner the priority becomes : LOCAL > FORCED SPECIAL GROUP > GROUP > GLOBAL
  // In the customizer, only one special group winner can be set at a time.
  // If different winners have been set in separate customization sessions, and that the user add several winners term in the post edit screen, it might happen that
  // a the customizer ends up to have several special group winners. In this case, a conflict notice is displayed in the skope dialog box, explaining how to resolve this
  // winner conflict. As long as the winner conflict is unresolved, the priority falls back to : LOCAL > GROUP > GLOBAL.
  //
  //
  //
  //
  //
  //
  // WHAT IS THE SKOPE INHERITANCE CONCEPT ?
  // In the customizer, all skopes are partially customized => For example, a page can only have specific layout options set
  // The question to adress is then : What about all the un-customized options of this skope? Which value should be applied ?
  //
  // The skope inheritance is the complement of the skope priority.
  // It addresses the problem of which values should be used for un-customized options in a given skope.
  //
  // Taking the same page example, if the "skin" option has not been set locally, then it checks the lower skope priority level.
  // In this case, the previous level is "All Pages".
  // If nothing has been set in the "All Pages", we'll go to the previous one : "Global."
  //
  // In the customizer, this skope inheritance has to be reflected so that user can immediately understand which option is applied to which skope.
  // For a given skope, all un-customized settings will inherit their value from the lower priority levels, down to GLOBAL.
  //
  //
  //
  // HOW DOES THIS WORK ?
  // CZR_skopeBase listens to skope collection changes
  // 1) instantiate new models (CZR_skope), remove old ones and their view
  // 2) sets each skope models active skope state changes


  // CZR_skope
  // 1) instantiate, the skope view (CZR_skopeView)
  // 2) listens to the active state
  //   => store dirtyness on switch
  //   => fetch the db values, build the full set of values ( db + dirties + default) and update the settings

  // CZR_skopeView
  // 1) renders the view
  // 2) listens to model active state
  //   => change the view display elements
  // 3) listen to DOM interactions and set skope values : state, priority

  // @todo in the view, return the $() element to store the view.container




/*****************************************************************************
* THE SKOPE BASE OBJECT
*****************************************************************************/
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
(function ( api, $, _ ) {
      $.extend( CZRSkopeBaseMths, {

          globalSettingVal : {},//will store the global setting val. Populated on init.

          initialize: function() {
                var self = this;
                ///////////////////// DEFINITIONS /////////////////////
                self.skope_colors = {
                      global : 'rgb(255, 255, 255)',
                      special_group : 'rgba(173, 213, 247, 0.55)',
                      group  : 'rgba(39, 59, 88, 0.12)',// 'rgba(173, 213, 247, 0.55)',
                      local  : 'rgba(39, 59, 88, 0.28)'// 'rgba(78, 122, 199, 0.35)'
                };
                //Deferred used to make sure the overridden api.previewer.query method has been taken into account
                api.czr_isPreviewerSkopeAware   = $.Deferred();
                //Store the state of the first skope collection state
                api.czr_initialSkopeCollectionPopulated = $.Deferred();
                //store the embed state
                self.skopeWrapperEmbedded       = $.Deferred();

                //the skope instance constructor
                api.czr_skope                   = new api.Values();

                //the czr_skopeCollection stores all skopes instantiated by the user
                //this collection is not updated directly
                //=> it's updated on skope() instance change
                api.czr_skopeCollection         = new api.Value([]);//all available skope, including the current skopes
                //the current skopes collection get updated each time the 'czr-skopes-synced' event is triggered on the api by the preview
                api.czr_currentSkopesCollection = new api.Value([]);


                //the currently active skope
                api.czr_activeSkopeId           = new api.Value();
                //Store the global dirtyness state of the API
                api.czr_dirtyness               = new api.Value( false );
                //store the resetting state
                api.czr_isResettingSkope        = new api.Value( false );

                //Add new state to the api
                api.state.create('switching-skope')( false );

                ///////////////////// SKOPIFY THE API AND THE PANEL /////////////////////
                //REACT TO API DIRTYNESS
                api.czr_dirtyness.callbacks.add( function() { return self.apiDirtynessReact.apply(self, arguments ); } );

                //LOADING ICON DURING INITIAL SKOPE SETUP
                //this api.Value() and its callback are declared in pre_base
                api.czr_isLoadingSkope( true );

                //LISTEN TO EACH API SETTING CHANGES
                // => POPULATE THE DIRTYNESS OF THE CURRENTLY ACTIVE SKOPE
                self.bindAPISettings();

                //LISTEN TO THE API STATES => SET SAVE BUTTON STATE
                //=> this value is set on control and skope reset
                //+ set by wp
                //
                //<@4.9compat>
                // => deactivated for v4.9
                // api.state.bind( 'change', function() {
                //       self.setSaveButtonStates();
                // });
                //</@4.9compat>

                //EMBED THE SKOPE WRAPPER
                //=> WAIT FOR SKOPE TO BE READY api.czr_skopeReady.state == 'resolved'
                api.czr_skopeReady.then( function() {
                      if ( 'pending' == self.skopeWrapperEmbedded.state() ) {
                            $.when( self.embedSkopeWrapper() ).done( function() {
                                  self.skopeWrapperEmbedded.resolve();
                            });
                      }
                });


                ///////////////////// SKOPE COLLECTIONS SYNCHRONISATION AND LISTENERS /////////////////////
                //LISTEN TO SKOPE SYNC => UPDATE SKOPE COLLECTION ON START AND ON EACH REFRESH
                //Will make sure server DB values are always synchronized with the instantiated skopes
                //the sent data look like :
                //{
                //  czr_skopes : _wpCustomizeSettings.czr_skopes || [],
                //  isChangesetDirty : boolean
                // }
                //
                //Bail if skope has not been properly instantiated 'rejected' == api.czr_skopeReady.state()
                api.previewer.bind( 'czr-skopes-synced', function( data ) {
                      if ( ! serverControlParams.isSkopOn || 'rejected' == api.czr_skopeReady.state() ) {
                            return;
                      }
                      //api.consoleLog('czr-skopes-ready DATA', data );
                      var preview = this,
                          previousSkopeCollection = api.czr_currentSkopesCollection();
                      //initialize skopes with the server sent data
                      //if skope has not been initialized yet and the server sent wrong data, then reject the skope ready promise()
                      if ( ! _.has( data, 'czr_skopes') ) {
                            if ( 'resolved' != api.czr_skopeReady.state() ) {
                                  api.czr_skopeReady.reject();
                            }
                            api.errorLog( "On 'czr-skopes-synced' : missing skopes in the server data" );
                            return;
                      }

                      //1) Updated the collection with normalized skopes  => prepareSkopeForAPI + api.czr_currentSkopesCollection( collection )
                      //2) When the api.czr_currentSkopesCollection() Value is set => instantiates the missing skope
                      //3) Set the skope layout view when the skope embedded promise is resolved
                      try {
                            api.czr_skopeBase.updateSkopeCollection( data.czr_skopes , preview.channel() );
                      } catch ( er ) {
                            api.czr_skopeReady.reject( er );
                            return;
                      }

                      //@return void()
                      // => refresh skope notice below the skope switcher title
                      // => refresh bottom skope infos in the preview
                      var _refreshSkopeInfosNotices = function() {
                            //WRITE THE CURRENT SKOPE TITLE
                            self._writeCurrentSkopeTitle();

                            //REFRESH PREVIEW BOTTOM INFOS
                            //the default behaviour is to display the bottom infos block in the preview
                            //and to refresh its content
                            if ( api.czr_bottomInfosVisible() ) {
                                  self.renderBottomInfosTmpl();//<= will build a new bottom skope message infos in the preview based on the new active skopes
                            } else {
                                  //Display + build and render the skope infos
                                  api.czr_bottomInfosVisible( true );
                            }
                      };


                      //Always wait for the initial collection to be populated
                      api.czr_initialSkopeCollectionPopulated.then( function() {
                            var refreshActiveSkope = _.isUndefined( _.findWhere( api.czr_currentSkopesCollection(), {id : api.czr_activeSkopeId() } ) );
                            api.czr_skopeBase.reactWhenSkopeSyncedDone( data ).done( function() {
                                  //if the current active skope has been removed from the current skopes collection
                                  //=> set relevant scope as active. Falls back on 'global'
                                  if ( refreshActiveSkope ) {
                                        try {
                                              api.czr_activeSkopeId( self.getActiveSkopeId() )
                                                    .done( function() {
                                                          if ( 'resolved' != api.czr_skopeReady.state() ) {
                                                                api.czr_skopeReady.resolve( self.getActiveSkopeId() );
                                                          }
                                                          //REFRESH SKOPE INFOS IN TITLE AND PREVIEW FRAME
                                                          _refreshSkopeInfosNotices();
                                                    })
                                                    .fail( function() {
                                                          throw new Error( 'Error when trying to set the active skope after skope synced.' );
                                                    });
                                        } catch ( er ) {
                                              api.errorLog( 'In reactWhenSkopeSyncedDone => api.czr_activeSkopeId() : ' + er );
                                        }
                                  } else if ( ! _.isEmpty( previousSkopeCollection ) ) { //Rewrite the title when the local skope has changed
                                        var _prevLoc = _.findWhere( previousSkopeCollection , { skope : 'local' } ).opt_name,
                                            _newLoc  =_.findWhere( data.czr_skopes, { skope : 'local' } ).opt_name;

                                        if ( _newLoc !== _prevLoc && 'resolved' == api.czr_skopeReady.state() ) {
                                              //REFRESH SKOPE INFOS IN TITLE AND PREVIEW FRAME
                                              _refreshSkopeInfosNotices();
                                        }
                                  }
                            });
                      });
                });


                //CURRENT SKOPE COLLECTION LISTENER
                //The skope collection is set on 'czr-skopes-synced' triggered by the preview
                //setup the callbacks of the skope collection update
                //on init and on preview change : the collection of skopes is populated with new skopes
                //=> instanciate the relevant skope object + render them
                api.czr_currentSkopesCollection.bind( function( to, from ) {
                      return self.currentSkopesCollectionReact( to, from );
                }, { deferred : true });


                //WHEN THE INITIAL SKOPE COLLECTION HAS BEEN POPULATED ( in currentSkopesCollectionReact )
                //LET'S BIND CALLBACKS TO ACTIVE SKOPE AND ACTIVE SECTION
                api.czr_initialSkopeCollectionPopulated.done( function() {
                      //LISTEN AND REACT TO ACTIVE SKOPE UPDATE
                      //api.czr_activeSkopeId.callbacks.add( function() { return self.activeSkopeReact.apply(self, arguments ); } );
                      api.czr_activeSkopeId.bind( function( to, from ) {
                              //Always close the mod option panel if exists
                              if ( _.has( api, 'czr_ModOptVisible') ) {
                                    api.czr_ModOptVisible( false );
                              }
                              return self.activeSkopeReact( to, from ).then( function( _updatedSetIds ) {
                                    api.trigger( 'skope-switched-done',
                                          {
                                                current_skope_id    : to,
                                                previous_skope_id   : from,
                                                updated_setting_ids : _updatedSetIds || []
                                          }
                                    );
                              });
                      }, { deferred : true } );

                      //REACT TO EXPANDED ACTIVE SECTION
                      //=> silently update all eligible controls of this sektion with the current skope values
                      api.czr_activeSectionId.callbacks.add( function() { return self.activeSectionReact.apply(self, arguments ); } );

                      //REACT TO EXPANDED ACTIVE PANEL
                      //=> silently update all eligible controls of this sektion with the current skope values
                      api.czr_activePanelId.callbacks.add( function() { return self.activePanelReact.apply(self, arguments ); } );

                      //GLOBAL SKOPE COLLECTION LISTENER
                      //api.czr_skopeCollection.callbacks.add( function() { return self.globalSkopeCollectionReact.apply(self, arguments ); } );
                });


                //////////////// LISTEN TO SKOPE SWITCH EVENT //////////////////
                //1) reset visibilities
                //2) update control skope notices
                //@args =
                //{
                //  current_skope_id : string
                //  previous_skope_id : string
                //  updated_setting_ids : [] //<= can be empty if no section was expanded
                //}
                api.bind( 'skope-switched-done', function( args ) {
                      args = _.extend(
                            {
                                  current_skope_id : '',
                                  previous_skope_id : '',
                                  updated_setting_ids : []
                            },
                            args
                      );
                      return self.skopeSwitchedDoneReact( args );
                });


                ///////////////////// LISTEN TO THE SERVER /////////////////////
                //SERVER NOTIFICATION SETUP
                api.czr_serverNotification   = new api.Value( {status : 'success', message : '', expanded : true} );
                api.czr_serverNotification.bind( function( to, from ) {
                        self.toggleServerNotice( to );
                });



                ///////////////////// SETUP PREVIEW NOTE AND INFOS BLOCKS /////////////////////
                /// 1) defines observable value to control the block view visibilities
                /// 2) listen to those values state to render / destroy the views
                /// 3) setup DOM listeners inside the views to react on user actions : close block + write an ajax option for example
                self._setupPreviewNotificationsBlocks();//top note and bottom skope infos



                ///////////////////// SKOPE SWITCHER EVENT MAP /////////////////
                self.scopeSwitcherEventMap = [
                      //skope reset : do reset
                      {
                            trigger   : 'click keydown',
                            selector  : '.czr-dismiss-notification',
                            name      : 'dismiss-notification',
                            actions   : function() {
                                  api.czr_serverNotification( { expanded : false } );
                            }
                      },
                      //toggle title notice
                      {
                            trigger   : 'click keydown',
                            selector  : '.czr-toggle-title-notice',
                            name      : 'toggle-title-notice',
                            actions   : function( params ) {
                                  if ( _.isUndefined( self.skopeTitleNoticeVisible ) ) {
                                        self.skopeTitleNoticeVisible = new api.Value( false );
                                        self.skopeTitleNoticeVisible.bind( function( to ) {
                                              params.dom_el.find( '.czr-skope-title')
                                                    .toggleClass( 'notice-visible', to );
                                        });
                                  }

                                  self.skopeTitleNoticeVisible( ! self.skopeTitleNoticeVisible() );
                            }
                      }
                ];

                //Setup DOM user actions when api.czr_skopeReady => self.skopeWrapperEmbedded are resolved
                self.skopeWrapperEmbedded.then( function() {
                      api.CZR_Helpers.setupDOMListeners( self.scopeSwitcherEventMap , { dom_el : $('.czr-scope-switcher') }, self );
                });


                ///////////////////// VARIOUS /////////////////////
                //DECLARE THE LIST OF CONTROL TYPES FOR WHICH THE VIEW IS REFRESHED ON CHANGE
                self.refreshedControls = [ 'czr_cropped_image'];// [ 'czr_cropped_image', 'czr_multi_module', 'czr_module' ];

                //WIDGETS AND SIDEBAR SPECIFIC TREATMENTS
                self.initWidgetSidebarSpecifics();

                //LISTEN TO GLOBAL DB OPTION CHANGES
                //When an option is reset on the global skope,
                //we need to update it in the initially sent _wpCustomizeSettings.settings
                //api.czr_globalDBoptions.callbacks.add( function() { return self.globalDBoptionsReact.apply(self, arguments ); } );


                ///////////////////// LISTEN TO PAINT EVENT /////////////////////
                //The paint event occurs :
                //1) on skope switch
                //2) on sektion expansion
                //3) on panel expansion
                api.bind( 'czr-paint', function( params ) {
                      api.czr_skopeReady.then( function() {
                            self.wash( params ).paint( params );
                      });
                });
          },//initialize

















          /*****************************************************************************
          * EMBED WRAPPER
          *****************************************************************************/
          //fired in initialize
          //=> embed the wrapper for all skope boxes
          //=> add a specific class to the body czr-skop-on
          //=> Listen to skope switch in main title
          embedSkopeWrapper : function() {
                var self = this;
                $('#customize-header-actions').append( $('<div/>', {class:'czr-scope-switcher', html:'<div class="czr-skopes-wrapper"></div>'}) );
                $('body').addClass('czr-skop-on');
                var _eventMap = [
                    //skope switch
                    {
                          trigger   : 'click keydown',
                          selector  : '.czr-skope-switch',
                          name      : 'control_skope_switch',
                          actions   : function( params ) {
                                var _skopeIdToSwithTo = $( params.dom_event.currentTarget, params.dom_el ).attr('data-skope-id');
                                if ( ! _.isEmpty( _skopeIdToSwithTo ) && api.czr_skope.has( _skopeIdToSwithTo ) )
                                  api.czr_activeSkopeId( _skopeIdToSwithTo );
                          }
                    }
                ];
                api.CZR_Helpers.setupDOMListeners( _eventMap , { dom_el : $('.czr-scope-switcher') }, self );
          },









          /*****************************************************************************
          * API DIRTYNESS REACTIONS
          *****************************************************************************/
          //cb of api.czr_dirtyness()
          apiDirtynessReact : function( is_dirty ) {
                $('body').toggleClass('czr-api-dirty', is_dirty );
                api.state( 'saved')( ! is_dirty );
          },









          /*****************************************************************************
          * OVERRIDE SAVE BUTTON STATES : api.state.bind( 'change') callback
          *****************************************************************************/
          //@return void()
          setSaveButtonStates : function() {
                //the 'saving' state was introduced in 4.7
                //For prior versions, let's declare it and add its callback that we need in the api.previewer.save() method
                if ( ! api.state.has('saving') ) {
                      api.state.create('saving');
                      api.state('saving').bind( function( isSaving ) {
                            $( document.body ).toggleClass( 'saving', isSaving );
                      } );
                }
                var saveBtn   = $( '#save' ),
                    closeBtn  = $( '.customize-controls-close' ),
                    saved     = api.state( 'saved'),
                    saving    = api.state( 'saving'),
                    activated = api.state( 'activated' ),
                    changesetStatus = api.state.has('changesetStatus' ) ? api.state( 'changesetStatus' )() : 'auto-draft';

                if ( api.czr_dirtyness() || ! saved() ) {
                      saveBtn.val( api.l10n.save );
                      closeBtn.find( '.screen-reader-text' ).text( api.l10n.cancel );
                } else {
                      saveBtn.val( api.l10n.saved );
                      closeBtn.find( '.screen-reader-text' ).text( api.l10n.close );
                }
                var canSave = ! saving() && ( ! activated() || ! saved() ) && 'publish' !== changesetStatus;
                saveBtn.prop( 'disabled', ! canSave );
          },











          //cb of 'skope-switched-done' event => fired when the api.czr_activeSkopeId().done() <=> refresh is done()
          //1) set the ctrl dependencies in the currently active section
          //2) update ctrl skope notices in the currently active section + expand the ctrl notice if skope is not 'global'
          //3) adds a skope level class to the #customize-controls wrapper
          //@args =
          //{
          //  current_skope_id : string
          //  previous_skope_id : string
          //  updated_setting_ids : [] //<= can be empty if no section was expanded
          //}
          skopeSwitchedDoneReact : function( args ) {
                var self = this,
                    _doWhenSkopeReady = function() {
                          //CURRENTLY EXPANDED SECTION : SET CTRL DEPENDENCIES WHEN POSSIBLE
                          api.czr_CrtlDependenciesReady.then( function() {
                            if ( ! _.isUndefined( api.czr_activeSectionId() ) && ! _.isEmpty( api.czr_activeSectionId() ) ) {
                                  try {
                                        api.czr_ctrlDependencies.setServiDependencies( api.czr_activeSectionId(), null, true );//target sec id, source sec id, refresh
                                  } catch( er ) {
                                        api.errorLog( 'On skope-switched-done : ' + er );
                                  }
                                }
                          });

                          //CURRENTLY EXPANDED SECTION : UPDATE CURRENT SKOPE CONTROL NOTICES AND MAYBE EXPAND THE NOTICE
                          self.updateCtrlSkpNot( api.CZR_Helpers.getSectionControlIds() );

                          //ADD A SKOPE LEVEL CSS CLASS TO THE #customize-controls wrapper
                          if ( api.czr_skope.has( args.previous_skope_id ) ) {
                                $( '#customize-controls' ).removeClass( [ 'czr-', api.czr_skope( args.previous_skope_id )().skope, '-skope-level'].join('') );
                          }
                          if ( api.czr_skope.has( args.current_skope_id ) ) {
                                $( '#customize-controls' ).addClass( [ 'czr-', api.czr_skope( args.current_skope_id )().skope, '-skope-level'].join('') );
                          }

                          //CURRENTLY EXPANDED SECTION
                          //=> Display ctrl notice if skope is not global
                          //=> Hide the reset dialog
                          var _setupSectionControlDialogs = function() {
                                if ( _.isUndefined( api.czr_activeSectionId() ) || _.isEmpty( api.czr_activeSectionId() ) )
                                  return;
                                var ctrls = api.CZR_Helpers.getSectionControlIds( api.czr_activeSectionId()  );
                                _.each( ctrls, function( ctrlId ) {
                                      api.control.when( ctrlId, function() {
                                            var ctrl = api.control( ctrlId );
                                            if ( ! _.has( ctrl, 'czr_states' ) )
                                              return;

                                            ctrl.deferred.embedded.then( function() {
                                                  //Always display the notice when skope is not global
                                                  //=> let user understand where the setting value is coming from
                                                  ctrl.czr_states( 'noticeVisible' )( self.isCtrlNoticeVisible( ctrlId ) );
                                                  ctrl.czr_states( 'resetVisible' )( false );
                                            });
                                      });
                                });
                          };

                          //REFRESH PREVIEW BOTTOM INFOS
                          //on skope switched done, the default behaviour is to display the bottom infos block in the preview
                          //and to refresh its content
                          if ( api.czr_bottomInfosVisible() ) {
                                self.renderBottomInfosTmpl();//<= will build a new bottom skope message infos in the preview based on the new active skopes
                          } else {
                                //Display + build and render the skope infos
                                api.czr_bottomInfosVisible( true );
                          }

                          //Setup control dialogs after a delay on skope switched.
                          //=> the delay is needed for controls that have been re-rendered.
                          _.delay( function() {
                                _setupSectionControlDialogs();
                          }, 500 );
                    };


                //api.consoleLog('SKOPE SWITCHED TO', args.current_skope_id, api.czr_activeSectionId() );
                //Skope is ready when :
                //1) the initial skopes collection has been populated
                //2) the initial skope has been switched to
                api.czr_skopeReady.then( function() {
                      _doWhenSkopeReady();
                });
          },















          //@return void()
          _setupPreviewNotificationsBlocks : function() {
                var self = this;
                ///////////////////// TOP NOTE BLOCK /////////////////////
                api.czr_topNoteVisible = new api.Value( false );
                api.czr_skopeReady.then( function() {
                      api.czr_topNoteVisible.bind( function( visible ) {
                              var noteParams = {},
                                  _defaultParams = {
                                        title : '',
                                        message : '',
                                        actions : '',
                                        selfCloseAfter : 20000
                                  };
                              //noteParams is an object :
                              //{
                              // title : '',
                              // message : '',
                              // actions : fn(),
                              // selfCloseAfter : 20000 in ms
                              //}
                              noteParams = $.extend( _defaultParams , serverControlParams.topNoteParams );

                              //SPECIFIC AJAX ACTION FOR THE WELCOME NOTE
                              noteParams.actions = function() {
                                    var _query = $.extend(
                                          api.previewer.query(),
                                          { nonce:  api.previewer.nonce.save }
                                    );
                                    wp.ajax.post( 'czr_dismiss_top_note' , _query )
                                          .always( function () {})
                                          .fail( function ( response ) { api.consoleLog( 'czr_dismiss_top_note failed', _query, response ); })
                                          .done( function( response ) {});
                              };

                              self.toggleTopNote( visible, noteParams );
                      });

                      //Toggle the top note on initialization
                      _.delay( function() {
                            api.czr_topNoteVisible( ! _.isEmpty( serverControlParams.isTopNoteOn ) || 1 == serverControlParams.isTopNoteOn );
                      }, 2000 );
                });



                ///////////////////// BOTTOM INFOS BLOCK /////////////////////
                api.czr_bottomInfosVisible = new api.Value( false );
                api.czr_skopeReady.then( function() {
                      //Listen to changes
                      api.czr_bottomInfosVisible.bind( function( visible ) {
                              var noteParams = {},
                                  _defaultParams = {
                                        title : '',
                                        message : '',
                                        actions : '',
                                        selfCloseAfter : 20000
                                  };
                              //noteParams is an object :
                              //{
                              // title : '',
                              // message : '',
                              // actions : fn(),
                              // selfCloseAfter : 20000 in ms
                              //}
                              noteParams = $.extend( _defaultParams , {} );

                              return self.toggleBottomInfos( visible, noteParams );//returns a promise()
                      }, { deferred : true } );

                      //never set to true if 'show-skope-infos' is unchecked
                      var _skopeInfosSetId = api.CZR_Helpers.build_setId( 'show-skope-infos' );
                      api.when( _skopeInfosSetId, function( _set_ ){
                            api.czr_bottomInfosVisible.validate = function( value ) {
                                  var _v = _set_(),
                                      _isChecked = 0 !== _v && '0' !== _v && false !== _v && 'off' !== _v;

                                  return _isChecked ? value : false;
                            };

                            //Listen to skope infos setting in admin section
                            _set_.bind( function( visible ) {
                                  api.czr_bottomInfosVisible( 0 !== visible && '0' !== visible && false !== visible && 'off' !== visible );
                            });
                      });



                      //Toggle the top note on initialization
                      _.delay( function() {
                            api.czr_bottomInfosVisible( true );
                      }, 2000 );
                });//api.czr_skopeReady.then()
          }





          //cb of api.czr_globalDBoptions.callbacks
          //update the _wpCustomizeSettings.settings if they have been updated by a reset of global skope, or a control reset of global skope
          //When an option is reset on the global skope, we need to set the new value to default in _wpCustomizeSettings.settings
          // globalDBoptionsReact : function( to, from ) {
          //       var self = this,
          //           resetted_opts = _.difference( from, to );

          //       //reset option case
          //       if ( ! _.isEmpty(resetted_opts) ) {
          //             api.consoleLog( 'HAS RESET OPTIONS', resetted_opts );
          //             //reset each reset setting to its default val
          //             _.each( resetted_opts, function( shortSetId ) {
          //                   var wpSetId = api.CZR_Helpers.build_setId( shortSetId );
          //                   if ( _.has( api.settings.settings, wpSetId) )
          //                     api.settings.settings[wpSetId].value = serverControlParams.defaultOptionsValues[shortSetId];
          //                   self.processSilentUpdates( { refresh : false } );//silently update with no refresh
          //             });
          //       }

          //       //make sure the hasDBValues is synchronized with the server
          //       api.czr_skope( self.getGlobalSkopeId() ).hasDBValues( ! _.isEmpty( to ) );//might trigger cb hasDBValuesReact()
          // }
      });//$.extend()
})( wp.customize , jQuery, _);

var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
(function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

      //callback of api.czr_serverNotification
      //notice is an object :
      //  {
      //    status : 'success',
      //    expanded : true,
      //    message : '',
      //    auto_collapse : false
      //  }
      toggleServerNotice : function( notice ) {
            notice = _.isObject( notice ) ? notice : {};
            notice = _.extend( {
                  status : 'success',
                  expanded : true,
                  message : '',
                  auto_collapse : false
            }, notice );

            //bail for changeset_already_published
            if ( 'changeset_already_published' == notice.message )
              return;

            //bail if not dev mode
            if ( ! serverControlParams.isDevMode )
              return;

            this.serverNoticeEmbedded = this.serverNoticeEmbedded || $.Deferred();

            var self = this,
                _embed = function() {
                      $('.czr-scope-switcher').prepend(
                            $( '<div/>', {
                                  class:'czr-server-notice',
                                  html:'<span class="czr-server-message"></span><span class="fa fa-times-circle czr-dismiss-notification"></span>'
                            } )
                      );
                },
                _toggleNotice = function() {
                      var $notif_wrap         = $( '.czr-server-notice', '.czr-scope-switcher' ),
                          $header             = $('.wp-full-overlay-header'),
                          $sidebar            = $('.wp-full-overlay-sidebar .wp-full-overlay-sidebar-content'),
                          _header_height,
                          _notif_wrap_height,
                          _set_height = function( _h ) {
                                // $header.css( 'height', '');
                                // $sidebar.css( 'top', '' );
                                // if ( _.isUndefined( _h ) )
                                //   return;
                                // $header.css( 'height', _h + 'px' );
                                // $sidebar.css( 'top', _h + 'px' );
                                return true;
                          };

                      //Close the main skope switcher title inheritance infos if exists and opened
                      if ( self.skopeTitleNoticeVisible )
                          self.skopeTitleNoticeVisible( false );

                      if ( ! notice.expanded ) {
                            $notif_wrap
                                  .fadeOut( {
                                        duration : 200,
                                        complete : function() {
                                              //$( this ).css( 'height', 'auto' );
                                  } } );
                            setTimeout( function() {
                                  _set_height();
                            } , 200 );

                      } else {
                            $notif_wrap.toggleClass( 'czr-server-error', 'error' == notice.status );
                            if ( 'error' == notice.status ) {
                                  $('.czr-server-message', $notif_wrap )
                                        .html( _.isEmpty( notice.message ) ? 'Server Problem.' : notice.message );
                            } else {
                                  $('.czr-server-message', $notif_wrap )
                                        .html( _.isEmpty( notice.message ) ? 'Success.' : notice.message );
                            }
                            _notif_wrap_height  = $( '.czr-server-notice', '.czr-scope-switcher' ).outerHeight();
                            _header_height  = $header.outerHeight() + _notif_wrap_height;

                            setTimeout( function() {
                                  $.when( _set_height( _header_height ) ).done( function() {
                                        $notif_wrap
                                        .fadeIn( {
                                              duration : 200,
                                              complete : function() {
                                                    $( this ).css( 'height', 'auto' );
                                        } } );
                                  } );
                            }, 400 );
                      }
                };

            //prepend the wrapper if needed
            if ( 'pending' == self.serverNoticeEmbedded.state() ) {
                  $.when( _embed() ).done( function() {
                        setTimeout( function() {
                              self.serverNoticeEmbedded.resolve();
                              _toggleNotice();
                        }, 200 );
                  });
            } else {
                  _toggleNotice();
            }

            //Always auto-collapse the notification after a custom delay
            _.delay( function() {
                        api.czr_serverNotification( { expanded : false } );
                  },
                  ( 'success' == notice.status || false !== notice.auto_collapse ) ? 4000 : 5000
            );
      },

      //utility : build a server response as a string
      //ready to be displayed in the notifications
      buildServerResponse : function( _r ) {
            var resp = false;
            //server error
            if ( _.isObject( _r ) ) {
                  if ( _.has( _r, 'responseJSON') && ! _.isUndefined( _r.responseJSON.data ) && ! _.isEmpty( _r.responseJSON.data ) ) {
                        resp = _r.responseJSON.data;
                  }
                  // else if ( _.has( _r, 'responseText') && ! _.isEmpty( _r.responseText ) ) {
                  //       try {
                  //             resp = JSON.parse( _r.responseText );
                  //       } catch( e ) {
                  //             resp = 'Server Error';
                  //       }
                  // }
                  else if ( _.has( _r , 'statusText' ) && ! _.isEmpty( _r.statusText ) ) {
                        resp = _r.statusText;
                  }
            }
            if ( _.isObject( _r ) && ! resp ) {
                  try {
                        JSON.stringify( _r );
                  } catch( e ) {
                        resp = 'Server Error';
                  }
            } else if ( ! resp ) {
                  resp = '0' === _r ? 'Not logged in.' : _r;
            } else if ( '-1' === _r ) {
              // Back-compat in case any other check_ajax_referer() call is dying
                  resp = 'Identification issue detected, please refresh your page.';
            }
            return resp;
      }
});//$.extend()
})( wp.customize , jQuery, _);
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
(function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

      //can be call directly, but is also a callback of api.czr_topNoteVisible, fired on skope base initialize
      //noteParams is an object :
      //{
      // title : '',
      // message : '',
      // actions : fn()
      //}
      toggleTopNote : function( visible, noteParams ) {
            noteParams = _.isObject( noteParams ) ? noteParams : {};
            var self = this,
                _defaultParams = {
                      title : '',
                      message : '',
                      actions : '',
                      selfCloseAfter : 20000
                },
                _renderAndSetup = function() {
                      $.when( self.renderTopNoteTmpl( noteParams ) ).done( function( $_el ) {
                            self.welcomeNote = $_el;
                            //display
                            _.delay( function() {
                                $('body').addClass('czr-top-note-open');
                            }, 200 );
                            api.CZR_Helpers.setupDOMListeners(
                                  [ {
                                        trigger   : 'click keydown',
                                        selector  : '.czr-preview-note-close',
                                        actions   : function() {
                                              _hideAndDestroy().done( function() {
                                                    api.czr_topNoteVisible( false );
                                                    if ( _.isFunction( noteParams.actions ) ) {
                                                          noteParams.actions();
                                                    }
                                              });
                                        }
                                  } ] ,
                                  { dom_el : self.welcomeNote },
                                  self
                            );
                      });
                },
                _hideAndDestroy = function() {
                      var dfd = $.Deferred();
                      $('body').removeClass('czr-top-note-open');
                      if ( self.welcomeNote.length ) {
                            //remove Dom element after slide up
                            _.delay( function() {
                                  self.welcomeNote.remove();
                                  dfd.resolve();
                            }, 300 );
                      } else {
                          dfd.resolve();
                      }
                      return dfd.promise();
                };

            noteParams = $.extend( _defaultParams , noteParams);

            if ( visible ) {
                  _renderAndSetup();
            } else {
                  _hideAndDestroy().done( function() {
                        api.czr_topNoteVisible( false );//should be already false
                  });
            }

            //Always auto-collapse the notification
            _.delay( function() {
                        api.czr_topNoteVisible( false );
                  },
                  noteParams.selfCloseAfter || 20000
            );
      },


      //@param = { note_title  : '', note_message : '' }
      renderTopNoteTmpl : function( params ) {
            if ( $( '#czr-top-note' ).length )
              return $( '#czr-top-note' );

            var self = this,
                _tmpl = '',
                _title = params.title || '',
                _message = params.message || '';

            try {
                  _tmpl =  wp.template( 'czr-top-note' )( { title : _title } );
            } catch( er ) {
                  api.errorLog( 'Error when parsing the the top note template : ' + er );
                  return false;
            }
            $('#customize-preview').after( $( _tmpl ) );
            $('.czr-note-message', '#czr-top-note').html( _message );
            return $( '#czr-top-note' );
      }
});//$.extend()
})( wp.customize , jQuery, _);
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
(function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {
    /*****************************************************************************
    * WORDPRESS API ACTIONS ON INIT
    *****************************************************************************/
    //fired in initialize
    //Listen to each api settings changes
    //1) update the current skope dirties with the user val
    //2) Refresh the controls reset state
    //can be fired when a setting is dynamically added. For example a widget.
    //In this case, the param SetId is not null
    bindAPISettings : function( requestedSetId ) {
          var self = this,
              //This is fired after the WP Core callback : setting.bind( setting.preview );
              _settingChangeReact = function( new_val, old_val, o ) {
                    //"this" is the setting instance
                    var setId = this.id,
                        skope_id;

                    //if skope instantiation went wrong, serverControlParams.isSkopOn has been reset to false
                    //=> that's why we check it here again before doing anything else
                    if ( ! serverControlParams.isSkopOn )
                      return;

                    if ( ! _.has( api, 'czr_activeSkopeId') || _.isUndefined( api.czr_activeSkopeId() ) ) {
                          api.errorLog( 'The api.czr_activeSkopeId() is undefined in the api.czr_skopeBase.bindAPISettings method.');
                          //return;
                    }

                    //For skope eligible settings : Update the skope dirties with the new val of this setId
                    //=> not eligibile skope will update the global skope dirties
                    //=> this has to be kept like this because the global dirties aare being populated with :
                    // api.dirtyValues = function dirtyValues( options ) {
                    //       return api.czr_skopeBase.getSkopeDirties( api.czr_skopeBase.getGlobalSkopeId(), options );
                    // };
                    if ( api( setId )._dirty ) {
                          skope_id = self.isSettingSkopeEligible( setId ) ? api.czr_activeSkopeId() : self.getGlobalSkopeId();
                          api.czr_skope( skope_id ).updateSkopeDirties( setId, new_val );
                    }

                    //collapse any expanded reset modifications if the control is not currently being reset.
                    if ( _.has( api.control(setId), 'czr_states' ) && ! api.control(setId).czr_states( 'isResetting' )() ) {
                          api.control( setId ).czr_states( 'resetVisible' )( false );
                    }

                    //Update the skope inheritance notice for the setting control
                    if ( self.isSettingSkopeEligible( setId ) ) {
                          self.updateCtrlSkpNot( setId );
                    }
              };//_settingChangeReact()

          //if a setting Id is requested
          if ( ! _.isUndefined( requestedSetId ) ) {
                api( requestedSetId ).bind( _settingChangeReact );
          }
          else {
                //parse the current eligible skope settings and write a setting val object
                api.each( function ( _setting ) {
                    _setting.bind( _settingChangeReact );
                });
          }

          //BIND SETTINGS ADDED LATER : Typical example : menus
          var _dynamicallyAddedSettingsReact = function( setting_instance ) {
                if ( setting_instance.callbacks.has( _settingChangeReact ) )
                  return;
                setting_instance.bind( _settingChangeReact );
          };

          if ( ! api.topics.change.has( _dynamicallyAddedSettingsReact ) ) {
                api.bind( 'change', _dynamicallyAddedSettingsReact );
          }
    }
});//$.extend()
})( wp.customize , jQuery, _ );
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

    /*****************************************************************************
    * REACT ON SKOPE SYNCED
    *****************************************************************************/
    //Fired on 'czr-skopes-synced'
    //with param :
    //{
    //  czr_skopes : _wpCustomizeSettings.czr_skopes || [],
    //  isChangesetDirty : boolean,
    // }
    reactWhenSkopeSyncedDone : function( server_params ) {
          var self = this, dfd = $.Deferred();
          if ( ! _.has( server_params, 'czr_skopes' ) || _.isEmpty( server_params.czr_skopes ) ) {
                api.errorLog( 'Missing skope data after refresh', server_params );
                return dfd.resolve().promise();
          }
          //API DIRTYNESS UPDATE
          if ( ! api.czr_dirtyness() ) {
                api.czr_dirtyness( _.isBoolean( server_params.isChangesetDirty ) ? server_params.isChangesetDirty : false );
          }

          var _sentSkopeCollection = server_params.czr_skopes;
          //CHANGESET UPDATE
          //always update the changesets of the sent skope collection after a refresh
          //match them with the opt_name, because they don't have an id when emitted from server
          _.each( api.czr_skopeCollection(), function( _skp ) {
                var _sent_skope = _.findWhere( _sentSkopeCollection, { opt_name : _skp.opt_name } );
                //do we have a match based on opt_name with the _sentSkopeCollection ?
                if ( _.isUndefined( _sent_skope ) )
                  return;
                //if so then let's update the skope model with the new db values
                var _changeset_candidate = _.isEmpty( _sent_skope.changeset || {} ) ? {} : _sent_skope.changeset,
                    _api_ready_chgset = {};

                //We only update the changeset with registered setting id
                _.each( _changeset_candidate, function( _val, _setId ) {
                      if ( ! api.has( _setId ) ) {
                            api.consoleLog( 'In reactWhenSkopeSyncedDone : attempting to update the changeset with a non registered setting : ' + _setId );
                      }
                      _api_ready_chgset[_setId] = _val;
                });

                //_new_changeset = $.extend( api.czr_skope( _skp.id ).changesetValues(), _sent_changeset );
                //=> updating the changeset will also trigger a skope dirtyValues() update
                api.czr_skope( _skp.id ).changesetValues( _api_ready_chgset );
          });

          //DB VALUES UPDATE
          //UPDATE EACH SKOPE MODEL WITH THE NEW DB VAL SENT BY THE SERVER
          //The sent skope have no id (because assigned in the api)
          //=> however we can match them with their unique opt_name property
          //then update the skope db values, including the global skope
          _.each( api.czr_skopeCollection(), function( _skp ) {
                var _sent_skope = _.findWhere( _sentSkopeCollection, { opt_name : _skp.opt_name } );
                //do we have a match based on opt_name with the _sentSkopeCollection ?
                if ( _.isUndefined( _sent_skope ) )
                  return;

                //if so then let's update the skope model with the new db values
                var _current_db_vals  = $.extend( true, {}, api.czr_skope( _skp.id ).dbValues() ),
                    _dbVals_candidate = $.extend( _current_db_vals , _sent_skope.db || {} ),
                    _api_ready_dbvals = {};

                //We only update the dbValues with registered setting id
                _.each( _dbVals_candidate, function( _val, _setId ) {
                      if ( ! api.has( _setId ) ) {
                            api.consoleLog( 'In reactWhenSkopeSyncedDone : attempting to update the db values with a non registered setting : ' + _setId );
                      }
                      _api_ready_dbvals[_setId] = _val;
                });


                api.czr_skope( _skp.id ).dbValues( _api_ready_dbvals );
          });
          //introduce a small delay to let the api values be fully updated
          //useful when attempting to refresh the control notices after a save action
          _.delay( function() {
              dfd.resolve();
          }, 500 );
          return dfd.promise();
    }
});//$.extend()
})( wp.customize , jQuery, _ );

var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

    /*****************************************************************************
    * REACT ON ACTIVE SECTION SETUP DONE
    *****************************************************************************/
    // fired on 'active-section-setup'
    // params looks like : { controls : controls, section_id : section_id }
    _maybeSetupAssignedMenuLocations : function( active_section ) {
          if ( _.isUndefined( active_section ) || _.isEmpty( active_section ) || ! api.section.has( active_section.id ) ) {
                api.consoleLog( 'In _maybeSetupAssignedMenuLocations : no valid section_id provided.');
          }
          var self = this;
          //is this a menu section ? and does it have assigned locations ?
          if ( ! active_section.assignedLocations )
            return;

          //locations is an array of locations for a menu
          //=> we want to synchronize the reset button of this menu location in this section, with the one of the nav_menu_location setting
          var _assignedLocReact = function( locations ) {};

          if ( ! active_section.assignedLocations.callbacks.has( _assignedLocReact ) ) {
                active_section.assignedLocations.bind( _assignedLocReact );
          }
    },



    /*****************************************************************************
    * REACT TO ACTIVE SECTION EXPANSION
    *****************************************************************************/
    //cb of api.czr_activeSectionId()
    activeSectionReact : function( active_sec_id , previous_sec_id ) {
          //PAINT
          if ( 'add_menu' != active_sec_id ) {
                api.trigger('czr-paint', { active_section_id : active_sec_id } );
          }

          var self = this,
              _doReactPrevious = function( previous_sec_id ) {
                    //COLLAPSE ANY RESET DIALOG
                    var controls = api.CZR_Helpers.getSectionControlIds( previous_sec_id  );
                    _.each( controls, function( ctrlId ) {
                          if ( ! api.has( ctrlId ) || _.isUndefined( api.control( ctrlId ) ) )
                            return;
                          var ctrl = api.control( ctrlId );
                          if ( ! _.has( ctrl, 'czr_states' ) )
                            return;

                          ctrl.czr_states( 'resetVisible' )( false );
                    });
              },
              _doReactActive = function( active_section, active_sec_id ) {
                    //PRE RENDER THE CONTROL RESET ICONS + NOTICE
                    self.setupActiveSkopedControls( {
                          section_id : active_sec_id
                    });

                    //PROCESS SILENT UPDATES
                    self.processSilentUpdates( { section_id : active_sec_id  } )
                          .fail( function() {
                                throw new Error( 'Fail to process silent updates after initial skope collection has been populated' );
                          })
                          .done( function() {
                                // var _update_candidates = self._getSilentUpdateCandidates( active_sec_id  );
                                // self.processSilentUpdates( { candidates : _update_candidates } );
                                // //add control single reset + observable values
                                // self.setupActiveSkopedControls();

                                //Always display the notice when skope is not global
                                //=> let user understand where the setting value is coming from
                                var _setupSectionCtrlNotices = function() {
                                      var controls = api.CZR_Helpers.getSectionControlIds( active_sec_id );
                                      _.each( controls, function( ctrlId ) {
                                            if ( ! api.has( ctrlId ) || _.isUndefined( api.control( ctrlId ) ) )
                                              return;
                                            var ctrl = api.control( ctrlId );
                                            if ( ! _.has( ctrl, 'czr_states' ) )
                                              return;
                                            ctrl.czr_states( 'noticeVisible' )( self.isCtrlNoticeVisible( ctrlId ) );
                                      });
                                };

                                //Setup ctrol notices after a delay
                                //=>the delay is needed for controls that have been re-rendered.
                                _.delay( function() {
                                      _setupSectionCtrlNotices();
                                }, 700 );

                                //Sidebar Widget specific
                                if ( ! self.isExcludedSidebarsWidgets() ) {
                                      self.forceSidebarDirtyRefresh( active_sec_id , api.czr_activeSkopeId() );
                                }
                          });

                    //TRIGGER AN OBJECT RICH EVENT
                    //LISTEN TO ACTIVE SECTION SETUP : RESET ICONS + CONTROL NOTICES ARE WRITEEN
                    //=> handles the synchronized assigned locations for menus
                    // 'skoped-controls-setup' is triggered when self.setupActiveSkopedControls()
                    // params looks like : { controls : controls, section_id : section_id }
                    if ( ! _.has( api.topics, 'active-section-setup' ) ) {
                          api.bind( 'active-section-setup', function( params ) {
                                var defaults = {
                                      controls : [],
                                      section_id : ''
                                };
                                params = _.extend( defaults, params );
                                self._maybeSetupAssignedMenuLocations( params );
                          });
                    }

                    //Switch to global skope for not skoped sections
                    api.czr_skopeReady.then( function() {
                          var _switchBack = function( _title ) {
                                api.czr_serverNotification({
                                      status:'success',
                                      message : [ _title, serverControlParams.i18n.skope['can only be customized sitewide.'] ].join(' ')
                                });
                                api.czr_activeSkopeId( self.getGlobalSkopeId() );
                          };
                          //Switch to global skope for not skoped sections
                          if ( 'global' != api.czr_skope( api.czr_activeSkopeId() )().skope ) {
                                if (
                                  self.isExcludedWPCustomCss() &&
                                  ( 'custom_css' == active_sec_id || 'admin_sec' == active_sec_id )
                                ) {
                                      _switchBack( api.section( active_sec_id ).params.title );
                                }

                                if ( 'nav_menu[' == active_sec_id.substring( 0, 'nav_menu['.length ) || 'add_menu' == active_sec_id ) {
                                      api.czr_serverNotification({
                                            status:'success',
                                            message : [
                                                  serverControlParams.i18n.skope['Menus are created sitewide.']
                                            ].join(' ')
                                      });
                                      //_switchBack( api.section( active_sec_id ).params.title );
                                }
                          }
                    });

                    //SAY IT
                    api.trigger('active-section-setup', active_section );
              };



          //defer the callback execution when the first skope collection has been populated
          //=> otherwise it might be to early. For example in autofocus request cases.
          api.czr_initialSkopeCollectionPopulated.then( function() {
                api.section.when( active_sec_id , function( active_section ) {
                      //<@4.9compat>
                      // Bail if is opening the publish_setting section
                      if ( 'publish_settings' == active_sec_id )
                        return;
                      //</@4.9compat>
                      active_section.deferred.embedded.then( function() {
                            try { _doReactActive( active_section, active_sec_id ); } catch( er ) {
                                  api.errorLog( 'activeSectionReact => _doReactActive : ' + er );
                            }

                      });
                });
                if ( ! _.isEmpty( previous_sec_id ) && api.section.has( previous_sec_id ) ) {
                      _doReactPrevious( previous_sec_id );
                }
          });
    },


    /*****************************************************************************
    * REACT TO ACTIVE PANEL EXPANSION
    *****************************************************************************/
    //cb of api.czr_activePanelId()
    activePanelReact : function( active_panel_id , previous_panel_id ) {
          var self = this;
          api.czr_initialSkopeCollectionPopulated.then( function() {
                api.trigger('czr-paint', { active_panel_id : active_panel_id } );
                var _switchBack = function( _title ) {
                      api.czr_serverNotification({
                            status:'success',
                            message : [ _title, serverControlParams.i18n.skope['can only be customized sitewide.'] ].join(' ')
                      });
                      api.czr_activeSkopeId( self.getGlobalSkopeId() );
                };

                //Display a notifictation skoped panels
                api.czr_skopeReady.then( function() {
                      if ( 'global' != api.czr_skope( api.czr_activeSkopeId() )().skope ) {
                            if ( self.isExcludedSidebarsWidgets() && 'widgets' == active_panel_id ) {
                                  api.czr_serverNotification({
                                        status:'success',
                                        message : [
                                              serverControlParams.i18n.skope['Widgets are created sitewide.']
                                        ].join(' ')
                                  });
                                  //_switchBack( api.panel( active_panel_id ).params.title );
                            }
                      }
                });

                //Silently update all sections of the nav_menus panel each time it's switch to
                //=> fixes the problem of locations not being refreshd below the menu titles
                api.czr_skopeReady.then( function() {
                      if ( 'nav_menus' == active_panel_id ) {
                            _.each( api.panel( active_panel_id ).sections(), function( _sec ) {
                                  //PROCESS SILENT UPDATES
                                  self.processSilentUpdates( { section_id : _sec.id, awake_if_not_active : true } );
                            });
                      }
                });
          });
    }
});//$.extend()
})( wp.customize , jQuery, _ );
/*****************************************************************************
* THE SKOPE BASE OBJECT
*****************************************************************************/
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

    /*****************************************************************************
    * PAINT AND WASH
    *****************************************************************************/
    //fired on 'czr-paint'
    //params = {
    //  active_panel_id : '',
    //  active_section_id : '',
    //  is_skope_switch : false
    //}
    wash : function( params ) {
          var self = this,
              //@param element = { el : ${}, color : string }
              _do_wash = function( element ) {
                    if ( ! _.has( element, 'el') || ! element.el.length )
                      return;
                    $.when( element.el.removeClass('czr-painted') ).done( function() {
                          $(this).css( 'background', '' ).css('color', '');
                    });
              };
          if ( api.czr_skopeBase.paintedElements ) {
                _.each( api.czr_skopeBase.paintedElements(), function( _el ) { _do_wash( _el ); } );
                api.czr_skopeBase.paintedElements( [] );
          }
          return this;
    },

    //fired on 'czr-paint'
    //params = {
    //  active_panel_id : '',
    //  active_section_id : '',
    //  is_skope_switch : false
    //}
    paint : function( params ) {
          var _bgColor = 'inherit',
              defaults = {
                    active_panel_id : api.czr_activePanelId(),
                    active_section_id : api.czr_activeSectionId(),
                    is_skope_switch : false
              },
              _paint_candidates = [];
          params = $.extend( defaults, params );

          if ( ! _.isUndefined( api.czr_activeSkopeId() ) && api.czr_skope.has( api.czr_activeSkopeId() ) ) {
                  _bgColor = api.czr_skope( api.czr_activeSkopeId() ).color;
          }

          //@param element = { el : ${}, color : string }
          var _do_paint = function( element ) {
                if ( ! _.has( element, 'el') || ! element.el.length )
                  return;
                //If is skope switch, add a css class to handle a smoother background color transition
                if ( params.is_skope_switch ) {
                      $.when( element.el.addClass('czr-painted') ).done( function() {
                            $(this).css( 'background', element.bgColor || _bgColor );
                      });
                } else {
                      element.el.css( 'background', element.bgColor || _bgColor );
                }
                //paint text in dark for accessibility when skope background is not white ( == not global skope )
                if ( 'global' != api.czr_skope( api.czr_activeSkopeId() )().skope ) {
                       element.el.css( 'color', '#000');
                }

          };

          api.czr_skopeBase.paintedElements = api.czr_skopeBase.paintedElements || new api.Value( [] );

          //CASE 1 : NO ACTIVE PANEL, NO ACTIVE SECTION => WE ARE ON ROOT
          if ( _.isEmpty( params.active_panel_id ) && _.isEmpty( params.active_section_id ) ) {
                _paint_candidates.push( {
                      el : $( '#customize-info' ).find('.accordion-section-title').first()
                });
                api.panel.each( function( _panel ) {
                      // _panel.container.css('background', _bgColor );
                      _paint_candidates.push( {
                            el : _panel.container.find( '.accordion-section-title').first()
                      });
                });
                //Also include orphaned sections that have no panel assigned
                //=> example front page content
                api.section.each( function( _section ) {
                      if ( ! _.isEmpty( _section.panel() ) )
                        return;
                      _paint_candidates.push( {
                            el : _section.container.find( '.accordion-section-title').first()
                      });
                });
          }

          //CASE 2 : ACTIVE PANEL, NO ACTIVE SECTION => WE ARE IN A PANEL ROOT
          if ( ! _.isEmpty( params.active_panel_id ) && _.isEmpty( params.active_section_id ) ) {
                api.panel.when( params.active_panel_id , function( active_panel ) {
                      active_panel.deferred.embedded.then( function() {
                            //active_panel.container.css('background', _bgColor );
                            _paint_candidates.push( {
                                  el : active_panel.container.find( '.accordion-section-title, .customize-panel-back' )
                            });
                      });
                });
          }

          //CASE 3 : ACTIVE SECTION
          if ( ! _.isEmpty( params.active_section_id ) ) {
                api.section.when( params.active_section_id , function( active_section ) {
                      active_section.deferred.embedded.then( function() {
                            _paint_candidates.push(
                                  {
                                        el : active_section.container.find( '.customize-section-title, .customize-section-back' ),
                                        bgColor : 'inherit'
                                  },
                                  {
                                        el : active_section.container
                                  }
                            );
                            //for WP < 4.7
                            if ( ! api.czr_isChangeSetOn() ) {
                                  _paint_candidates.push(
                                        {
                                              el : active_section.container.find('.accordion-section-content')
                                        }
                                  );
                            }
                      });
                });
          }

          //PROCESS PAINT AND POPULATE THE VALUE
          _.each( _paint_candidates, function( _el ) { _do_paint( _el ); } );
          api.czr_skopeBase.paintedElements( _paint_candidates );
          return this;
    }
});//$.extend()
})( wp.customize , jQuery, _ );
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
(function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

      //can be call directly, but the recommend way is to use api.czr_bottomInfosVisible, fired on skope base initialize, for which the following method is a callback
      //noteParams is an object :
      //{
      // title : '',
      // message : '',
      // actions : fn()
      //}
      toggleBottomInfos : function( visible, noteParams ) {
            noteParams = _.isObject( noteParams ) ? noteParams : {};
            var self = this,
                dfd = $.Deferred(),
                _defaultParams = {
                      title : '',
                      message : '',
                      actions : '',
                      selfCloseAfter : 20000
                },
                _skopeInfosSetId = api.CZR_Helpers.build_setId('show-skope-infos'),
                _renderAndSetup = function() {
                      var _dfd = $.Deferred();
                      //Render and setup DOM listeners
                      $.when( self.renderBottomInfosTmpl( noteParams ) )
                            .done( function( $_el ) {
                                  self.bottomInfosContainer = $_el;
                                  //Reveal and resolve
                                  _.delay( function() {
                                        $('body').addClass('czr-bottom-infos-open');
                                        _dfd.resolve();
                                  }, 200 );

                                  //setup DOM listeners
                                  api.CZR_Helpers.setupDOMListeners(
                                        [
                                              {
                                                    trigger   : 'click keydown',
                                                    selector  : '.czr-preview-note-close',
                                                    actions   : function() {
                                                          _hideAndDestroy().done( function() {
                                                                api.czr_bottomInfosVisible( false );
                                                                if ( _.isFunction( noteParams.actions ) ) {
                                                                      noteParams.actions();
                                                                }
                                                          });
                                                    }
                                              },
                                              //skope switch
                                              {
                                                    trigger   : 'click keydown',
                                                    selector  : '.czr-skope-switch',
                                                    actions   : function( params ) {
                                                          var _skopeIdToSwithTo = $( params.dom_event.currentTarget, params.dom_el ).attr('data-skope-id');
                                                          if ( ! _.isEmpty( _skopeIdToSwithTo ) && api.czr_skope.has( _skopeIdToSwithTo ) )
                                                            api.czr_activeSkopeId( _skopeIdToSwithTo );
                                                    }
                                              },
                                              {
                                                    trigger   : 'click keydown',
                                                    selector  : '.czr-disable-bottom-infos',
                                                    actions   : function( params ) {
                                                          if ( api.control.has( _skopeInfosSetId ) ) {
                                                                api.control( _skopeInfosSetId ).focus();
                                                          }
                                                    }
                                              }
                                        ] ,
                                        { dom_el : self.bottomInfosContainer },
                                        self
                                  );
                            })
                            .fail( function() {
                                  _dfd.resolve();
                            });
                      return _dfd.promise();
                },
                _hideAndDestroy = function() {
                      return $.Deferred( function() {
                            var _dfd_ = this;
                            $('body').removeClass('czr-bottom-infos-open');
                            if ( self.bottomInfosContainer.length ) {
                                  //remove and reset
                                  _.delay( function() {
                                        self.bottomInfosContainer.remove();
                                        self.bottomInfosContainer = false;
                                        _dfd_.resolve();
                                  }, 300 );
                            } else {
                                _dfd_.resolve();
                            }
                      });
                };


            noteParams = $.extend( _defaultParams , noteParams);

            if ( visible ) {
                  _renderAndSetup().always( function() {
                        dfd.resolve();
                  });
            } else {
                  _hideAndDestroy().done( function() {
                        api.czr_bottomInfosVisible( false );//should be already false
                        dfd.resolve();
                  });
            }

            //Always auto-collapse the infos block
            // _.delay( function() {
            //             api.czr_bottomInfosVisible( false );
            //       },
            //       noteParams.selfCloseAfter || 20000
            // );
            return dfd.promise();
      },


      //@param = { note_title  : '', note_message : '' }
      renderBottomInfosTmpl : function( params ) {
            params = params || {};
            var self = this,
                _tmpl = '',
                _skope_id = api.czr_activeSkopeId();

            //Don't go further if the current skope is not registered yet
            if ( ! api.czr_skope.has( _skope_id ) || ! _.isObject( api.czr_skope( _skope_id )() ) )
              return false;

            var _skope_title = api.czr_skope( _skope_id )().long_title,
                _ctxTitle = api.czr_skope( _skope_id )().ctx_title;

            _skope_title = _.isString( _skope_title ) ? _skope_title : '';
            _ctxTitle = _.isString( _ctxTitle ) ? _ctxTitle : '';

            var _title = params.title || ['Customizing', _ctxTitle.toLowerCase() ].join(' '),
                _message = params.message || self._getSkopeInfosMessage( _skope_id ),
                _renderTmpl = function() {
                      return $.Deferred( function() {
                            var dfd = this;
                            try {
                                  _tmpl =  wp.template( 'czr-bottom-infos' )( { title : _title } );
                                  $('#customize-preview').after( $( _tmpl ) );
                                  dfd.resolve();
                            } catch( er ) {
                                  api.errorLog( 'Error when parsing the the bottom infos template : ' + er );
                                  dfd.reject( er );
                            }
                      });
                };

            //on initial rendering, print the template
            if ( _.isUndefined( this.bottomInfosContainer ) || 1 != this.bottomInfosContainer.length ) {
                  _renderTmpl().done( function() {
                        $('.czr-note-message', '#czr-bottom-infos').html( _message );
                  });
            } else {
                  $('.czr-note-content', self.bottomInfosContainer ).fadeOut({
                        duration : 'fast',
                        complete : function() {
                              $( 'h2', self.bottomInfosContainer ).html( [ '&middot;', _title, '&middot;' ].join(' ') );
                              $('.czr-note-message', self.bottomInfosContainer ).html( _message );
                              $(this).fadeIn('fast');
                        }
                  });

            }
            return ( this.bottomInfosContainer && 1 == this.bottomInfosContainer.length ) ? this.bottomInfosContainer : $( '#czr-bottom-infos' );
      },


      //@return html string
      //a skope is described by the following properties :
      // color:"rgba(39, 59, 88, 0.28)"
      // ctx_title:"Home"
      // dyn_type:"skope_meta"
      // id:"local_home"
      // is_forced:false
      // is_winner:true
      // level:"home"
      // long_title:"Options for home"
      // obj_id:"home"
      // opt_name:"hueman_czr_home"
      // skope:"local"
      // title:"Options for home"
      _getSkopeInfosMessage : function( skope_id ) {
            skope_id = skope_id || api.czr_activeSkopeId();
            var _localSkopeId = _.findWhere( api.czr_currentSkopesCollection(), { skope : 'local' } ).id;

            //Paranoid but, always bail if :
            //1) the current skope id is not registered,
            //2) the skope is not an object
            //3) the local skope is undefined
            if ( ! api.czr_skope.has( skope_id ) || ! _.isObject( api.czr_skope( skope_id )() ) || _.isUndefined( _localSkopeId ) )
              return '';

            var self = this,
                _skpLevel = api.czr_skope( skope_id )().skope,
                _inheritedFrom = self.getInheritedSkopeTitles(),
                _overrides = self.getOverridenSkopeTitles(),
                _localCtxTitle = api.czr_skope( _localSkopeId )().ctx_title,//<= the context title is always the one of the local skope
                current_title = api.czr_skope( skope_id )().long_title,//ex : Options for home
                _html;

            switch( _skpLevel ) {
                    case 'global' :
                          _html = [
                                serverControlParams.i18n.skope['The customizations made site wide are inherited by all other levels of customization.'],
                                '<br/>',
                                serverControlParams.i18n.skope['The current context'],
                                ['(', _localCtxTitle, ')'].join(' '),
                                serverControlParams.i18n.skope['can be customized more specifically at the following level'] + '(s)',
                                ':',
                                _overrides + '.'
                          ].join(' ');
                    break;
                    case 'group' :
                          _html = [
                                serverControlParams.i18n.skope['The current customizations will be applied to'],
                                api.czr_skope( skope_id )().ctx_title.toLowerCase() + '.',
                                '<br/>',
                                serverControlParams.i18n.skope['The options not customized at this level will inherit their value from'],
                                _inheritedFrom,
                                '.<br/>',
                                serverControlParams.i18n.skope['The current context'],
                                ['(', _localCtxTitle, ')'].join(' '),
                                serverControlParams.i18n.skope['can be customized more specifically at the following level'],
                                ':',
                                _overrides + '.'
                          ].join(' ');
                    break;
                    case 'local' :
                          _html = [
                                serverControlParams.i18n.skope['The current context'],
                                ['(', _localCtxTitle, ')'].join(' '),
                                serverControlParams.i18n.skope['can be customized with a specific set of options.'],
                                '<br/>',
                                serverControlParams.i18n.skope['The options not customized at this level will inherit their value from'],
                                _inheritedFrom + '.'
                          ].join(' ');
                    break;
            }

            return $.trim( [
                  '<span class="czr-skope-bottom-infos">',
                    _html,
                    '</span>'
            ].join(' ') );

            // return $.trim( [
            //       '<span class="czr-skope-bottom-infos">',
            //         serverControlParams.i18n.skope['In this context :'],
            //         _.isEmpty( _inheritedFrom ) ? ' ' : serverControlParams.i18n.skope['inherits from'],
            //         _inheritedFrom,
            //         _.isEmpty( _inheritedFrom ) ? '' : _.isEmpty( _overrides ) ? '.' : [',' , serverControlParams.i18n.skope['and'] ].join(' '),
            //         _.isEmpty( _overrides ) ? ' ' : serverControlParams.i18n.skope['overridden by'],
            //         _overrides,
            //         _.isEmpty( _overrides ) ? '</span>' : '.</span>'
            // ].join(' ') );
      }
});//$.extend()
})( wp.customize , jQuery, _);
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

    /*****************************************************************************
    * HELPERS
    *****************************************************************************/
    //@return bool
    isSkopeRegisteredInCollection : function( skope_id, collection ) {
          var self = this;
          collection = collection || api.czr_skopeCollection();
          return ! _.isUndefined( _.findWhere( collection, { id : skope_id } ) );
    },

    //@return bool
    isSkopeRegisteredInCurrentCollection : function( skope_id, collection ) {
          var self = this;
          collection = collection || api.czr_currentSkopesCollection();
          return ! _.isUndefined( _.findWhere( collection, { id : skope_id } ) );
    },

    //@return bool
    isGlobalSkopeRegistered : function() {
          var _model = _.findWhere( api.czr_currentSkopesCollection(), { skope : 'global'} );
          return _.isObject( _model ) && _.has( _model, 'id' );
    },

    //@return string
    getGlobalSkopeId : function() {
          if ( ! _.has(api, 'czr_skope') )
            return '';
          var id = '';
          api.czr_skope.each( function(skp){
              if ( 'global' == skp().skope )
                id = skp().id;
          });
          return id;
    },

    //after a saved action, the 'global' option might have changed
    //=> this method, return only the changed db values
    getChangedGlobalDBSettingValues : function( serverGlobalDBValues ) {
          var _changedDbVal = {};

          _.each( serverGlobalDBValues, function( _val, _setId ){
              _wpSetId = api.CZR_Helpers.build_setId( _setId);

              if ( ! _.has( api.settings.settings, _wpSetId ) )
                return;
              if ( _.isEqual( _val , api.settings.settings[ _wpSetId ].value ) )
                return;
              _changedDbVal[_setId] = _val;
          });
          return _changedDbVal;
    },


    //@return the current active skope id
    //If server send isLocalSkope = true, then try to activate the local skope
    //Fallbacks on global
    getActiveSkopeId : function( _current_skope_collection ) {
          _current_skope_collection = _current_skope_collection || api.czr_currentSkopesCollection();

          var _currentSkopeLevel, _newSkopeCandidate, _skpId;
          if ( ! _.isEmpty( api.czr_activeSkopeId() ) && api.czr_skope.has( api.czr_activeSkopeId() ) ) {
                _currentSkopeLevel = api.czr_skope( api.czr_activeSkopeId() )().skope;
          } else if ( serverControlParams.isLocalSkope ) {
                _currentSkopeLevel = 'local';
          } else {
                _currentSkopeLevel = 'global';
          }

          _newSkopeCandidate = _.findWhere( _current_skope_collection, { skope : _currentSkopeLevel } );

          _skpId = ! _.isUndefined( _newSkopeCandidate ) ? _newSkopeCandidate.id : _.findWhere( _current_skope_collection, { skope : 'global' } ).id;

          if ( _.isUndefined( _skpId ) ) {
                throw new Error( 'No default skope was found in getActiveSkopeId ', _current_skope_collection );
          }

          // _.each( _current_skope_collection, function( _skop ) {
          //       _active_candidates[ _skop.skope ] = _skop.id;
          // });

          // //Apply a basic skope priority. => @todo refine this treatment
          // if ( _.has( _active_candidates, 'local' ) )
          //   return _active_candidates.local;
          // if ( _.has( _active_candidates, 'group' ) )
          //   return _active_candidates.group;
          // if ( _.has( _active_candidates, 'special_group' ) )
          //   return active_candidates.special_group;
          return _skpId;
          //return _.findWhere( _current_skope_collection, { skope : 'global' } ).id;
    },

    //@return a skope name string : local, group, special_group, global
    getActiveSkopeName : function() {
          if ( ! api.czr_skope.has( api.czr_activeSkopeId() ) )
            return 'global';
          return api.czr_skope( api.czr_activeSkopeId() )().skope;
    },


    //@return boolean
    //! important : the setId param must be the full name. For example : hu_theme_option[color-1]
    isSettingSkopeEligible : function( setId ) {
          var self = this,
              shortSetId = api.CZR_Helpers.getOptionName( setId );

          if( _.isUndefined( setId ) || ! api.has( setId ) ) {
            api.consoleLog( 'THE SETTING ' + setId + ' IS NOT ELIGIBLE TO SKOPE BECAUSE UNDEFINED OR NOT REGISTERED IN THE API.' );
            return false;
          }
          //exclude :
          //widget controls
          //sidebars
          //menu settings
          //active_theme
          if ( self.isExcludedWPBuiltinSetting( setId ) )
            return false;
          //skopeExcludedSettings look like ( short IDs ) :
          //{
          //   //short ids of theme settings
          //   'post-comments',
          //   'page-comments',
          //   'layout-home',
          //
          //   //protected theme settings
          //   'ver'
          //
          //   //wp builtins
          //   'show_on_front',
          //   'page_on_front',
          // }
          if ( _.contains( serverControlParams.skopeExcludedSettings, shortSetId ) ) {
            //api.consoleLog( 'THE SETTING ' + setId + ' IS NOT ELIGIBLE TO SKOPE BECAUSE PART OF THE EXCLUDED LIST.' );
            return false;
          } else if ( self.isThemeSetting( setId ) ) {
            return true;
            //api.consoleLog( 'THE SETTING ' + setId + ' IS NOT ELIGIBLE TO SKOPE BECAUSE NOT PART OF THE THEME OPTIONS AND NOT WP AUTHORIZED BUILT IN OPTIONS' );
          } else
           return true;
    },


    //@return boolean
    //! important : the setId param must be the full name. For example : hu_theme_option[color-1]
    isSettingResetEligible : function( setId ) {
          var self = this,
              shortSetId = api.CZR_Helpers.getOptionName( setId );

          if( _.isUndefined( setId ) || ! api.has( setId ) ) {
            api.consoleLog( 'THE SETTING ' + setId + ' IS NOT ELIGIBLE TO RESET BECAUSE UNDEFINED OR NOT REGISTERED IN THE API.' );
            return;
          }
          //exclude widget controls and menu settings and sidebars
          if ( self.isExcludedWPBuiltinSetting( setId ) )
            return;
          if ( ! self.isThemeSetting( setId ) && ! self.isWPAuthorizedSetting( setId ) ) {
            api.consoleLog( 'THE SETTING ' + setId + ' IS NOT ELIGIBLE TO RESET BECAUSE NOT PART OF THE THEME OPTIONS AND NOT WP AUTHORIZED BUILT IN OPTIONS' );
          } else
           return true;
    },

    //@return bool
    isThemeSetting : function( setId ) {
          return _.isString( setId ) && -1 !== setId.indexOf( serverControlParams.themeOptions );
    },

    //@return bool
    isWPAuthorizedSetting : function( setId ) {
          return _.isString( setId ) && _.contains( serverControlParams.wpBuiltinSettings, setId );
    },

    //@return boolean
    isExcludedWPBuiltinSetting : function( setId ) {
          var self = this;
          if ( _.isUndefined(setId) )
            return true;
          if ( 'active_theme' == setId )
            return true;
          //allow the list of server defined settings
          if ( _.contains( serverControlParams.wpBuiltinSettings, setId ) )
            return false;

          //exclude the WP built-in settings like sidebars_widgets*, widget_*, custom_css
          //specifics for nav_menus:
          //1) exclude always :
          //nav_menu[* => each menu created
          //nav_menu_item => the items of the menus
          //nav_menus_created_posts
          //2) exclude maybe :
          //nav_menu_locations
          var _patterns = [ 'widget_', 'nav_menu', 'sidebars_', 'custom_css', 'nav_menu[', 'nav_menu_item', 'nav_menus_created_posts', 'nav_menu_locations' ],
              _isExcld = false;
          _.each( _patterns, function( _ptrn ) {
                switch( _ptrn ) {
                      case 'widget_' :
                      case 'sidebars_' :
                            if ( _ptrn == setId.substring( 0, _ptrn.length ) ) {
                                  _isExcld = self.isExcludedSidebarsWidgets();
                            }
                      break;

                      case 'nav_menu[' :
                      case 'nav_menu_item' :
                      case 'nav_menus_created_posts' :
                            if ( _ptrn == setId.substring( 0, _ptrn.length ) ) {
                                  _isExcld = true;
                            }
                      break;

                      case 'nav_menu_locations' :
                            if ( _ptrn == setId.substring( 0, _ptrn.length ) ) {
                                  _isExcld = self.isExcludedNavMenuLocations();
                            }
                      break;

                      case 'custom_css' :
                            if ( _ptrn == setId.substring( 0, _ptrn.length ) ) {
                                  _isExcld = self.isExcludedWPCustomCss();
                            }
                      break;


                }
          });
          return _isExcld;
    },

    //@return bool
    isExcludedSidebarsWidgets : function() {
          var _servParam = serverControlParams.isSidebarsWigetsSkoped;//can be a boolean or a string "" for false, "1" for true
          return ! ( ! _.isUndefined( _servParam ) && ! _.isEmpty( _servParam ) && false !== _servParam );
    },

    //@return bool
    isExcludedNavMenuLocations : function() {
          //Nav menu location are not well supported before 4.7 => potential infinite refresh
          if ( ! api.czr_isChangeSetOn() )
            return true;
          var _servParam = serverControlParams.isNavMenuLocationsSkoped;//can be a boolean or a string "" for false, "1" for true
          return ! ( ! _.isUndefined( _servParam ) && ! _.isEmpty( _servParam ) && false !== _servParam );
    },

    //@return bool
    isExcludedWPCustomCss : function() {
          var _servParam = serverControlParams.isWPCustomCssSkoped;//can be a boolean or a string "" for false, "1" for true
          return ! ( ! _.isUndefined( _servParam ) && ! _.isEmpty( _servParam ) && false !== _servParam );
    },


    //return the current db value for a pair setId / skope_id
    _getDBSettingVal : function( setId, skope_id  ) {
          var shortSetId = api.CZR_Helpers.getOptionName(setId),
              wpSetId = api.CZR_Helpers.build_setId(setId);
          if ( ! api.czr_skope.has( skope_id ) ) {
                api.consoleLog( '_getDBSettingVal : the requested skope id is not registered : ' + skope_id );
                return '_no_db_val';
          }
          if ( _.has( api.czr_skope( skope_id ).dbValues(), wpSetId ) ) {
                return api.czr_skope( skope_id ).dbValues()[wpSetId];
          } else if ( _.has( api.czr_skope( skope_id ).dbValues(), shortSetId ) ) {
                return api.czr_skope( skope_id ).dbValues()[shortSetId];
          } else {
                return '_no_db_val';
          }
    },


    //@return {} of dirties
    //@options object { unsaved: boolean } was introduced with the changeset in WP 4.7.
    //=> the goal is to only get the api dirties that have not yet been saved in the changeset.
    getSkopeDirties : function( skope_id, options ) {
          if ( ! api.czr_skope.has( skope_id ) )
            return {};

          //the already saved settings are excluded from the skope dirties by default
          //=> the "real" customized values will be re-built server side anyway, by merging $_POST and changeset data, either on refresh or save.
          options = options || {};
          options = _.extend( { unsaved : true }, options );

          var values = {};
          //each skope stores its API dirties in an observable value : dirtyValues()
          _.each( api.czr_skope( skope_id ).dirtyValues(), function( _val, _setId ) {
                var settingRevision;
                //since 4.7 and the changeset, only the settings not yet saved in the db changeset are returned
                if ( api.czr_isChangeSetOn() ) {
                      settingRevision = api._latestSettingRevisions[ _setId ];
                      // Skip including settings that have already been included in the changeset, if only requesting unsaved.
                      if ( api.state( 'changesetStatus' ).get() && ( options && options.unsaved ) && ( _.isUndefined( settingRevision ) || settingRevision <= api._lastSavedRevision ) ) {
                            //api.consoleLog( 'DIRTIES : ' + _setId + ' will be excluded from dirties because last revision was : ' + settingRevision + ' == to last saved revision : ' + api._lastSavedRevision );
                            return;
                      }
                }
                values[ _setId ] = _val;
          } );
          return values;
    },

    getSkopeExcludedDirties : function() {
          //ARE THERE DIRTIES IN THE WP API ?
          var self = this,
              _wpDirties = {};
          api.each( function ( value, setId ) {
                if ( value._dirty ) {
                  _wpDirties[ setId ] = value();
                }
          } );

          //ARE THERE DIRTIES IN THE GLOBAL SKOPE
          var _globalSkopeId = self.getGlobalSkopeId(),
              _globalSkpDirties = self.getSkopeDirties( _globalSkopeId );

          //RETURN THE _wpDirties not present in the global skope dirties
          return _.omit( _wpDirties, function( _value, setId ) {
              //var shortOptName = api.CZR_Helpers.getOptionName( setId );
              return self.isSettingSkopeEligible( setId );
          } );
    },

    /**
   * @param {String} widgetId
   * @returns {Object}
   */
    parseWidgetId : function( widgetId, prefixToRemove ) {
        var matches, parsed = {
          number: null,
          id_base: null
        };

        matches = widgetId.match( /^(.+)-(\d+)$/ );
        if ( matches ) {
          parsed.id_base = matches[1];
          parsed.number = parseInt( matches[2], 10 );
        } else {
          // likely an old single widget
          parsed.id_base = widgetId;
        }

        if ( ! _.isUndefined( prefixToRemove ) )
          parsed.id_base = parsed.id_base.replace( prefixToRemove , '');
        return parsed;
    },

    /**
     * @param {String} widgetId
     * @returns {String} settingId
     */
    widgetIdToSettingId: function( widgetId , prefixToRemove ) {
        var parsed = this.parseWidgetId( widgetId, prefixToRemove ), settingId;

        settingId = parsed.id_base;
        if ( parsed.number ) {
          settingId += '[' + parsed.number + ']';
        }
        return settingId;
    },




    isWidgetRegisteredGlobally : function( widgetId ) {
        var self = this;
            registered = false;
        _.each( _wpCustomizeWidgetsSettings.registeredWidgets, function( _val, _short_id ) {
            if ( ! registered && 'widget_' + self.widgetIdToSettingId(_short_id) == widgetId )
              registered = true;
        } );
        return registered;
    }
});//$.extend
})( wp.customize , jQuery, _ );
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

    getAppliedPrioritySkopeId : function( setId, skope_id ) {
          if ( ! api.has( api.CZR_Helpers.build_setId(setId) ) ) {
                api.errorLog( 'getAppliedPrioritySkopeId : the requested setting id does not exist in the api : ' + api.CZR_Helpers.build_setId(setId) );
                return skope_id;
          }
          if ( ! api.czr_skope.has( skope_id ) ) {
                api.errorLog( 'getAppliedPrioritySkopeId : the requested skope id is not registered : ' + skope_id );
                return skope_id;
          }

          //Are we already in the 'local' skope ?
          var self = this,
              _local_skope_id = _.findWhere( api.czr_currentSkopesCollection(), { skope : 'local' } ).id;

          if ( _.isUndefined( _local_skope_id ) || skope_id == _local_skope_id )
            return skope_id;

          //start from local and do the salmon until either :
          //1) a value is found
          //2) the requested skope id is reached in the hierarchy
          var _salmonToMatch = function( _skp_id ) {
                var wpSetId = api.CZR_Helpers.build_setId( setId ),
                    val_candidate = '___',
                    skope_model = api.czr_skope( _skp_id )(),
                    initial_val;

                if ( _skp_id == skope_id )
                  return skope_id;

                //is the setting API dirty ?
                if ( api.czr_skope( _skp_id ).getSkopeSettingAPIDirtyness( wpSetId ) )
                  return skope_model.id;

                //is the setting CHANGESET dirty ?
                if ( api.czr_isChangeSetOn() ) {
                      if ( api.czr_skope( _skp_id ).getSkopeSettingChangesetDirtyness( wpSetId ) )
                        return skope_model.id;
                }

                //do we have a db val stored ?
                var _skope_db_val = self._getDBSettingVal( setId, _skp_id);
                if ( _skope_db_val != '_no_db_val' ) {
                      return skope_model.id;
                }
                //if we are already in the final 'local' skope, then let's return its value
                else if( 'global' == skope_model.skope ) {
                      // if ( _.isNull(initial_val) ) {
                      //   throw new Error('INITIAL VAL IS NULL FOR SETTING ' + setId + ' CHECK IF IT HAS BEEN DYNAMICALLY ADDED. IF SO, THERE SHOULD BE A DIRTY TO GRAB');
                      // }
                      return skope_model.id;
                }
                else {
                      //if not dirty and no db val, then let's recursively apply the inheritance
                      return '___' != val_candidate ? skope_model.title : _salmonToMatch( self._getParentSkopeId( skope_model ) );
                }
          };
          return _salmonToMatch( _local_skope_id );
    },

    //@return string : the skope title from which a setting id inherits its current value
    getOverridenSkopeTitles : function() {
          var skope_id = skope_id || api.czr_activeSkopeId();
          if ( ! api.czr_skope.has( skope_id ) ) {
                api.errorLog( 'getInheritedSkopeTitles : the requested skope id is not registered : ' + skope_id );
                return '';
          }
           //Are we already in the 'local' skope ?
          var self = this,
              _local_skope_id = _.findWhere( api.czr_currentSkopesCollection(), { skope : 'local' } ).id;

          if ( _.isUndefined( _local_skope_id ) || skope_id == _local_skope_id )
            return '';

          //start from local and do the salmon
          var _salmonToMatch = function( _skp_id, _skp_ids ) {
                _skp_ids = _skp_ids || [];
                var skope_model = api.czr_skope( _skp_id )();

                if ( _skp_id == skope_id )
                  return _skp_ids;
                _skp_ids.unshift( _skp_id );
                return _salmonToMatch( self._getParentSkopeId( skope_model ), _skp_ids );
          };

          return _.map( _salmonToMatch( _local_skope_id ), function( id ) {
                return self.buildSkopeLink( id );
          }).join( ' ' + serverControlParams.i18n.skope['and'] + ' ' );
    },


    //@return the skope title from which a setting id inherits its current value
    getInheritedSkopeId : function( setId, skope_id ) {
          if ( ! api.has( api.CZR_Helpers.build_setId(setId) ) ) {
                api.errorLog( 'getInheritedSkopeId : the requested setting id does not exist in the api : ' + api.CZR_Helpers.build_setId(setId) );
                return skope_id;
          }
          if ( ! api.czr_skope.has( skope_id ) ) {
                api.errorLog( 'getInheritedSkopeId : the requested skope id is not registered : ' + skope_id );
                return skope_id;
          }

          var self = this,
              wpSetId = api.CZR_Helpers.build_setId( setId ),
              val_candidate = '___',
              skope_model = api.czr_skope( skope_id )(),
              initial_val;
          //initial val
          //some settings like widgets may be dynamically added. Therefore their initial val won't be stored in the api.settings.settings
          if ( _.has( api.settings.settings, wpSetId ) )
            initial_val = api.settings.settings[wpSetId].value;
          else
            initial_val = null;

          //is the setting API dirty ?
          if ( api.czr_skope( skope_id ).getSkopeSettingAPIDirtyness( wpSetId ) )
            return skope_id;

          //is the setting CHANGESET dirty ?
          if ( api.czr_isChangeSetOn() ) {
                if ( api.czr_skope( skope_id ).getSkopeSettingChangesetDirtyness( wpSetId ) )
                  return skope_id;
          }

          //do we have a db val stored ?
          var _skope_db_val = self._getDBSettingVal( setId, skope_id );
          if ( _skope_db_val != '_no_db_val' )
            return skope_id;
          //if we are already in the final 'global' skope, then let's return its value
          else if( 'global' == skope_model.skope ) {
            // if ( _.isNull(initial_val) ) {
            //   throw new Error('INITIAL VAL IS NULL FOR SETTING ' + setId + ' CHECK IF IT HAS BEEN DYNAMICALLY ADDED. IF SO, THERE SHOULD BE A DIRTY TO GRAB');
            // }
            return skope_id;
          }
          else
            //if not dirty and no db val, then let's recursively apply the inheritance
            return '___' != val_candidate ?skope_id : self.getInheritedSkopeId( setId, self._getParentSkopeId( skope_model ) );
    },


    //@return the skope title from which a setting id inherits its current value
    //@return string
    getInheritedSkopeTitles : function( skope_id, skope_ids ) {
          skope_id = skope_id || api.czr_activeSkopeId();
          if ( ! api.czr_skope.has( skope_id ) ) {
                api.errorLog( 'getInheritedSkopeTitles : the requested skope id is not registered : ' + skope_id );
                return '';
          }
          skope_ids = skope_ids || [];
          var self = this,
              skope_model = api.czr_skope( skope_id )();

          if ( skope_id !== api.czr_activeSkopeId() )
              skope_ids.unshift( skope_id );

          if ( 'global' !== skope_model.skope )
              return self.getInheritedSkopeTitles( self._getParentSkopeId( skope_model ), skope_ids );

          return _.map( skope_ids, function( id ) {
                return self.buildSkopeLink( id );
          }).join(' ' + serverControlParams.i18n.skope['and'] + ' ');
    },

    //@return string
    buildSkopeLink : function( skope_id ) {
          if ( ! api.czr_skope.has( skope_id ) ) {
                api.errorLog( 'buildSkopeLink : the requested skope id is not registered : ' + skope_id );
                return '';
          }
          var _link_title = [ serverControlParams.i18n.skope['Switch to scope'], api.czr_skope( skope_id )().title ].join(' : ');
          return [
                '<span class="czr-skope-switch" title=" ' + _link_title + '" data-skope-id="' + skope_id + '">',
                api.czr_skope( skope_id )().title,
                '</span>'
          ].join( '' );
    },


    //@return boolean
    //isAllowedWPBuiltinSetting :

    //performs a recursive inheritance to get a setId Val for a given skope
    //@return an api setting value
    getSkopeSettingVal : function( setId, skope_id ) {
          if ( ! api.has( api.CZR_Helpers.build_setId(setId) ) ) {
                api.errorLog( 'getSkopeSettingVal : the requested setting id does not exist in the api : ' + api.CZR_Helpers.build_setId(setId) );
                return null;
          }
          if ( ! api.czr_skope.has( skope_id ) ) {
                api.errorLog( 'getSkopeSettingVal : the requested skope id is not registered : ' + skope_id );
                return null;
          }

          var self = this,
              wpSetId = api.CZR_Helpers.build_setId( setId ),
              val_candidate = '___',
              skope_model = api.czr_skope( skope_id )(),
              initial_val;

          //initial val
          //some settings like widgets may be dynamically added. Therefore their initial val won't be stored in the api.settings.settings
          if ( _.has( api.settings.settings, wpSetId ) )
            initial_val = api.settings.settings[wpSetId].value;
          else
            initial_val = null;

          //is the setting API dirty ?
          if ( api.czr_skope( skope_id ).getSkopeSettingAPIDirtyness( wpSetId ) )
            return api.czr_skope( skope_id ).dirtyValues()[ wpSetId ];

          //is the setting CHANGESET dirty ?
          if ( api.czr_isChangeSetOn() ) {
                if ( api.czr_skope( skope_id ).getSkopeSettingChangesetDirtyness( wpSetId ) )
                  return api.czr_skope( skope_id ).changesetValues()[ wpSetId ];
          }

          //do we have a db val stored ?
          var _skope_db_val = self._getDBSettingVal( setId, skope_id );
          if ( _skope_db_val != '_no_db_val' )
            return _skope_db_val;
          //if we are already in the final 'global' skope, then let's return its value
          else if( 'global' == skope_model.skope ) {
            // if ( _.isNull(initial_val) ) {
            //   throw new Error('INITIAL VAL IS NULL FOR SETTING ' + setId + ' CHECK IF IT HAS BEEN DYNAMICALLY ADDED. IF SO, THERE SHOULD BE A DIRTY TO GRAB');
            // }
            return '___' == val_candidate ? initial_val : val_candidate;
          }
          else
            //if not dirty and no db val, then let's recursively apply the inheritance
            return '___' != val_candidate ? val_candidate : self.getSkopeSettingVal( setId, self._getParentSkopeId( skope_model ) );
    },


    //implement the skope inheritance to build the dirtyCustomized
    //@recursive
    applyDirtyCustomizedInheritance : function( dirtyCustomized, skope_id ) {
          skope_id = skope_id || api.czr_activeSkopeId() || api.czr_skopeBase.getGlobalSkopeId();
          dirtyCustomized = dirtyCustomized || {};

          var self = this,
              skope_model = api.czr_skope( skope_id )();

          if ( 'global' == skope_model.skope )
            return dirtyCustomized;

          var parent_skope_id = self._getParentSkopeId( skope_model ),
              parent_dirties = api.czr_skope( parent_skope_id ).dirtyValues();

          //use the parent dirty value if the current skope setId is not dirty and has no db val
          _.each( parent_dirties, function( _val, wpSetId ){
                var shortSetId = api.CZR_Helpers.getOptionName( wpSetId );
                if ( _.isUndefined( dirtyCustomized[wpSetId] ) && _.isUndefined( api.czr_skope( skope_model.id ).dbValues()[shortSetId] ) )
                    dirtyCustomized[wpSetId] = _val;
          });
          return 'global' == api.czr_skope( parent_skope_id )().skope ? dirtyCustomized : self.applyDirtyCustomizedInheritance( dirtyCustomized, parent_skope_id );
    },



    //@return the parent skope id of a given skope within the collections of currentSkopes
    //recursive
    _getParentSkopeId : function( skope_model, _index ) {
          var self = this,
              hierark = ['local', 'group', 'special_group', 'global'],
              parent_skope_ind = _index || ( _.findIndex( hierark, function( _skp ) { return skope_model.skope == _skp; } ) + 1 ) * 1,
              parent_skope_skope = hierark[ parent_skope_ind ];

          if ( _.isUndefined( parent_skope_skope ) ) {
              return _.findWhere( api.czr_currentSkopesCollection(), { skope : 'global' } ).id;
          }

          //=> the inheritance is limited to current set of skopes
          if ( _.isUndefined( _.findWhere( api.czr_currentSkopesCollection(), { skope : parent_skope_skope } ) ) ) {
              return self._getParentSkopeId( skope_model, parent_skope_ind + 1 );
          }
          return _.findWhere( api.czr_currentSkopesCollection(), { skope : parent_skope_skope } ).id;
    },


    //@return the parent skope id of a given skope within the collections of currentSkopes
    //recursive
    _getChildSkopeId : function( skope_model, _index ) {
          var self = this,
              hierark = ['local', 'group', 'special_group', 'global'],
              child_skope_ind = _index || ( _.findIndex( hierark, function( _skp ) { return skope_model.skope == _skp; } ) - 1 ) * 1,
              child_skope_skope = hierark[ child_skope_ind ];

          if ( _.isUndefined( child_skope_skope ) ) {
              return _.findWhere( api.czr_currentSkopesCollection(), { skope : 'local' } ).id;
          }

          //=> the inheritance is limited to current set of skopes
          if ( _.isUndefined( _.findWhere( api.czr_currentSkopesCollection(), { skope : child_skope_skope } ) ) ) {
              return self._getParentSkopeId( skope_model, child_skope_ind - 1 );
          }
          return _.findWhere( api.czr_currentSkopesCollection(), { skope : child_skope_skope } ).id;
    }

});//$.extend
})( wp.customize , jQuery, _ );
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

    //Fired on 'czr-skopes-synced' triggered by the preview, each time the preview is refreshed.
    //On a Save Action, api.czr_savedDirties has been populated =>
    // 1) check if the server sends the same saved values
    // 2) update the skope db properties with the latests saved ones
    //
    //A skope candidate is structured this way :
    //{
    // changeset : Object
    // color:"rgb(255, 255, 255)"
    // db:Object
    // dyn_type:"option"
    // has_db_val:true
    // id:""
    // is_forced:false
    // is_primary:true
    // is_winner:false
    // level:"_all_"
    // long_title:"Site wide options"
    // obj_id:""
    // opt_name:"hu_theme_options"
    // skope:"global"
    // title:"Site wide options"
    //}
    //@see api_overrides
    updateSkopeCollection : function( sent_collection, sent_channel ) {
          //api.consoleLog('UPDATE SKOPE COLLECTION', sent_collection, sent_channel );
          var self = this;
              _api_ready_collection = [];

          //normalize each sent skopes
          _.each( sent_collection, function( _skope, _key ) {
                var skope_candidate = $.extend( true, {}, _skope );//deep clone to avoid any shared references
                _api_ready_collection.push( self.prepareSkopeForAPI( skope_candidate ) );
          });

          //keep the global skope unchanged
          //=> this is required because the server always sends an empty set of db options for the global skope, unlike the other skopes
          if ( self.isGlobalSkopeRegistered() ) {
                var _updated_api_ready_collection = [],
                    _global_skp_model = $.extend( true, {}, api.czr_skope( self.getGlobalSkopeId() )() );

                _.each( _api_ready_collection, function( _skp, _k ) {
                      if ( 'global' == _skp.skope )
                        _updated_api_ready_collection.push( _global_skp_model );
                      else
                        _updated_api_ready_collection.push( _skp );
                });
                _api_ready_collection = _updated_api_ready_collection;
          }

          //set the new collection of current skopes
          //=> this will instantiate the not instantiated skopes
          api.czr_currentSkopesCollection( _api_ready_collection );
    },


    //@param skope_candidate
    ////A skope candidate is structured this way :
    //{
    // changeset : Object
    // color:"rgb(255, 255, 255)"
    // db:Object
    // dyn_type:"option"
    // has_db_val:true
    // id:""
    // is_forced:false
    // is_primary:true
    // is_winner:false
    // level:"_all_"
    // long_title:"Site wide options"
    // obj_id:""
    // opt_name:"hu_theme_options"
    // skope:"global"
    // title:"Site wide options"
    //}
    prepareSkopeForAPI : function( skope_candidate ) {
          if ( ! _.isObject( skope_candidate ) ) {
              throw new Error('prepareSkopeForAPI : a skope must be an object to be API ready');
          }
          var self = this,
              api_ready_skope = {};

          _.each( serverControlParams.defaultSkopeModel , function( _value, _key ) {
                var _candidate_val = skope_candidate[_key];
                switch( _key ) {
                      case 'title' :
                            if ( ! _.isString( _candidate_val ) ) {
                                throw new Error('prepareSkopeForAPI : a skope title property must a string');
                            }
                            api_ready_skope[_key] = _candidate_val;
                      break;
                      case 'long_title' :
                            if ( ! _.isString( _candidate_val ) ) {
                                throw new Error('prepareSkopeForAPI : a skope title property must a string');
                            }
                            api_ready_skope[_key] = _candidate_val;
                      break;
                      case 'ctx_title' :
                            if ( ! _.isString( _candidate_val ) ) {
                                throw new Error('prepareSkopeForAPI : a skope context title property must a string');
                            }
                            api_ready_skope[_key] = _candidate_val;
                      break;
                      case 'skope' :
                            if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                                throw new Error('prepareSkopeForAPI : a skope "skope" property must a string not empty');
                            }
                            api_ready_skope[_key] = _candidate_val;
                      break;
                      case 'level' :
                            if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                                throw new Error('prepareSkopeForAPI : a skope level must a string not empty for skope ' + _candidate_val.skope );
                            }
                            api_ready_skope[_key] = _candidate_val;
                      break;
                      case 'dyn_type' :
                            if ( ! _.isString( _candidate_val ) || ! _.contains( serverControlParams.skopeDynTypes, _candidate_val ) ) {
                                throw new Error('prepareSkopeForAPI : missing or invalid dyn type for skope ' + skope_candidate );
                            }
                            api_ready_skope[_key] = _candidate_val;
                      break;
                      case 'opt_name' :
                            if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                                throw new Error('prepareSkopeForAPI : invalid "opt_name" property for skope ' + _candidate_val.skope );
                            }
                            api_ready_skope[_key] = _candidate_val;
                      break;
                      case 'obj_id' :
                            if ( ! _.isString( _candidate_val ) ) {
                                throw new Error('prepareSkopeForAPI : invalid "obj_id" for skope ' + _candidate_val.skope );
                            }
                            api_ready_skope[_key] = _candidate_val;
                      break;
                      case  'is_winner' :
                            if ( ! _.isUndefined( _candidate_val) && ! _.isBoolean( _candidate_val )  ) {
                                throw new Error('prepareSkopeForAPI : skope property "is_winner" must be a boolean');
                            }
                            api_ready_skope[_key] = _candidate_val;
                      break;
                      case  'is_forced' :
                            if ( ! _.isUndefined( _candidate_val) && ! _.isBoolean( _candidate_val )  ) {
                                throw new Error('prepareSkopeForAPI : skope property "is_primary" must be a boolean');
                            }
                            api_ready_skope[_key] = _candidate_val;
                      break;
                      //when the global db values have been changed, typically on save,
                      //the 'db' property will store the difference between api.settings.settings and the db options server generated
                      case  'db' :
                            if ( _.isArray( _candidate_val ) || _.isEmpty( _candidate_val ) )
                              _candidate_val = {};
                            if ( _.isUndefined( _candidate_val) || ! _.isObject( _candidate_val ) ) {
                                throw new Error('prepareSkopeForAPI : skope property "db" must be an object');
                            }
                            api_ready_skope[_key] = _candidate_val;
                      break;
                      case  'changeset' :
                            if ( _.isArray( _candidate_val ) || _.isEmpty( _candidate_val ) )
                              _candidate_val = {};
                            if ( _.isUndefined( _candidate_val) || ! _.isObject( _candidate_val ) ) {
                                throw new Error('prepareSkopeForAPI : skope property "changeset" must be an object');
                            }
                            api_ready_skope[_key] = _candidate_val;
                      break;
                      case  'has_db_val' :
                            if ( ! _.isUndefined( _candidate_val) && ! _.isBoolean( _candidate_val )  ) {
                                throw new Error('prepareSkopeForAPI : skope property "has_db_val" must be a boolean');
                            }
                            api_ready_skope[_key] = _candidate_val;
                      break;
                }//switch
          });

          //Assign a color based on the hiearchy level
          api_ready_skope.color = self.skope_colors[ api_ready_skope.skope ] || 'rgb(255, 255, 255)';

          //Finally, generate the id and the title
          api_ready_skope.id = api_ready_skope.skope + '_' + api_ready_skope.level;
          if ( ! _.isString( api_ready_skope.id ) || _.isEmpty( api_ready_skope.id ) ) {
                throw new Error('prepareSkopeForAPI : a skope id must a string not empty');
          }
          if ( ! _.isString( api_ready_skope.title ) || _.isEmpty( api_ready_skope.title ) ) {
                api_ready_skope.title = id;
                api_ready_skope.long_title = id;
          }
          return api_ready_skope;
    },


    //cb of api.czr_currentSkopesCollection.callbacks
    //fired in initialize
    currentSkopesCollectionReact : function( to, from ) {
          var self = this,
              _new_collection = $.extend( true, [], to ) || [],
              _old_collection = $.extend( true, [], from ) || [],
              dfd = $.Deferred();

          //what are the skope to instantiate ?
          //=>on init, instantiate them all
          //=>on refresh, instantiate the new ones and remove the non relevant
          var _to_instantiate = [];
              _to_remove = [];
              _to_update = [];
              _instantiateAndEmbed = function( _candidates_ ) {
                    //Instantiate the new skopes
                    //api.consoleLog('SKOPES TO INSTANTIATE?', _to_instantiate );
                    _.each( _candidates_, function( _skope ) {
                          _skope = $.extend( true, {}, _skope );//use a cloned skop to instantiate : @todo : do we still need that ?
                          api.czr_skope.add( _skope.id , new api.CZR_skope( _skope.id , _skope ) );
                    });

                    //Then embed the not ready ones
                    //=> we need to do that after the instantiaion of the entire new collection, because a skope instance my need to get other skope instances when embedded
                    _.each( _candidates_, function( _skope ) {
                          //fire this right after instantiation for the views (we need the model instances in the views)
                          if ( ! api.czr_skope.has( _skope.id ) ) {
                              throw new Error( 'Skope id : ' + _skope.id + ' has not been instantiated.');
                          }
                          if ( 'pending' == api.czr_skope( _skope.id ).isReady.state() ) {
                                api.czr_skope( _skope.id ).ready();
                          }
                    });
              };

          //BUILD THE CANDIDATES TO INSTANTIATE
          _.each( _new_collection, function( _sent_skope ) {
                if ( ! api.czr_skope.has( _sent_skope.id  ) )
                  _to_instantiate.push( _sent_skope );
          });

          //TRY TO INSTANTIATE
          try {
                _instantiateAndEmbed( _to_instantiate );
          } catch( er ) {
                api.errorLog( "currentSkopesCollectionReact : " + er );
                return dfd.resolve().promise();
          }


          //SET THE CONTEXTUALLY ACTIVE SKOPES VISIBILITY AND LAYOUT WHEN skopeReady and skopeWrapperEmbedded
          //Which skopes are visible ?
          //=> the ones sent by the preview
          var _setActiveAndLayout = function() {
                var _activeSkopeNum = _.size( _new_collection ),
                    _setLayoutClass = function( _skp_instance ) {
                          //remove previous layout class
                          var _newClasses = _skp_instance.container.attr('class').split(' ');
                          _.each( _skp_instance.container.attr('class').split(' '), function( _c ) {
                                if ( 'width-' == _c.substring( 0, 6) ) {
                                      _newClasses = _.without( _newClasses, _c );
                                }
                          });
                          $.when( _skp_instance.container.attr('class', _newClasses.join(' ') ) )
                                .done( function() {
                                      //set new layout class
                                      _skp_instance.container.addClass( 'width-' + ( Math.round( 100 / _activeSkopeNum ) ) );
                                });
                    };
                api.czr_skope.each( function( _skp_instance ) {
                      if ( _.isUndefined( _.findWhere( _new_collection, { id : _skp_instance().id } ) ) ) {
                            _skp_instance.visible( false );
                            _skp_instance.isReady.then( function() {
                                  _skp_instance.container.toggleClass( 'active-collection', false );
                            });
                      }
                      else {
                            _skp_instance.visible( true );
                            var _activeSkpDomPostProcess = function() {
                                  _setLayoutClass( _skp_instance );
                                  _skp_instance.container.toggleClass( 'active-collection', true );
                            };
                            if ( 'pending' == _skp_instance.isReady.state() ) {
                                  _skp_instance.isReady.then( function() {
                                        _activeSkpDomPostProcess();
                                  });
                            } else {
                                  _activeSkpDomPostProcess();
                            }
                      }
                } );
          };

          //SET THE CONTEXTUALLY ACTIVE SKOPES VISIBILITY AND LAYOUT WHEN skopeReady and skopeWrapperEmbedded
          self.skopeWrapperEmbedded.then( function() {
                _setActiveAndLayout();
          });

          //ON INITIAL COLLECTION POPULATE, RESOLVE THE DEFERRED STATE
          //=> this way we can defer earlier actions.
          //For example when autofocus is requested, the section might be expanded before the initial skope collection is sent from the preview.
          if ( _.isEmpty( from ) && ! _.isEmpty( to ) )
            api.czr_initialSkopeCollectionPopulated.resolve();

          //MAKE SURE TO SYNCHRONIZE api.settings.settings with the current global skope updated db values
          self.maybeSynchronizeGlobalSkope();

          return dfd.resolve( 'changed' ).promise();
    },//listenToSkopeCollection()


    //fired in updateSkopeCollection
    //args can be
    //{
    //  isGlobalReset : false
    //  isSetting : false,
    //  isSkope : false,
    //  settingIdToReset : '',
    //  skopeIdToReset : ''
    //}
    maybeSynchronizeGlobalSkope : function( args ) {
          args = args || {};
          if ( ! _.isObject( args ) ) {
              throw new Error('maybeSynchronizeGlobalSkope : args must be an object');
          }
          var self = this,
              dfd = $.Deferred(),
              defaults = _.extend({
                        isGlobalReset : false,
                        isSetting : false,
                        settingIdToReset : '',
                        isSkope : false,
                        skopeIdToReset : ''
                    },
                    args
              ),
              _setIdToReset,
              shortSetId,
              defaultVal;

          if ( self.isGlobalSkopeRegistered() ) {
                var _global_skp_db_values = api.czr_skope( self.getGlobalSkopeId() ).dbValues();
                _.each( _global_skp_db_values, function( _val, setId ){
                      if ( api.has( setId ) && ! _.isEqual( api.settings.settings[setId].value, _val ) ) {
                            api.settings.settings[setId].value = _val;
                      }
                });

                //check if there's theme option removed from the global skope db values that needs to be set to default
                if ( args.isGlobalReset && args.isSetting ) {
                      _setIdToReset = args.settingIdToReset;
                      shortSetId    = api.CZR_Helpers.getOptionName( _setIdToReset );
                      defaultVal    = serverControlParams.defaultOptionsValues[ shortSetId ];

                      if ( _.isUndefined( api.settings.settings[ _setIdToReset ] ) || _.isUndefined( defaultVal ) )
                        return;
                      if ( defaultVal != api.settings.settings[ _setIdToReset ].value ) {
                            api.settings.settings[ _setIdToReset ].value = defaultVal;
                      }
                }

                //check if there's theme option removed from the global skope db values that needs to be set to default
                if ( args.isGlobalReset && args.isSkope ) {
                      _.each( api.settings.settings, function( _params, _setId ) {
                            if ( ! self.isThemeSetting( _setId ) )
                              return;

                            shortSetId = api.CZR_Helpers.getOptionName( _setId );
                            if ( ! _.has( serverControlParams.defaultOptionsValues, shortSetId ) )
                              return;
                            api.settings.settings[_setId].value = serverControlParams.defaultOptionsValues[ shortSetId ];
                      });
                }
          }
          return dfd.resolve().promise();
    }
});//$.extend
})( wp.customize , jQuery, _ );
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

    //declared in initialize
    //cb of api.czr_activeSkopeId.callbacks
    //react when the active skope has been set to a new value
    // => change the to and from skope active() state
    // => silently update each setting values with the skope set of vals
    activeSkopeReact : function( to, from ) {
          var self = this, dfd = $.Deferred();
          //set the to and from scope state on init and switch
          if ( ! _.isUndefined(from) && api.czr_skope.has(from) )
            api.czr_skope(from).active(false);
          else if ( ! _.isUndefined( from ) )
            throw new Error('listenToActiveSkope : previous scope does not exist in the collection', from );

          if ( ! _.isUndefined(to) && api.czr_skope.has(to) )
            api.czr_skope(to).active(true);
          else
            throw new Error('listenToActiveSkope : requested scope ' + to + ' does not exist in the collection');


          //BAIL AND RETURN PROMISE HERE IF SWITCHING TO A PANEL OR SECTION WITH ONLY UNSKOPED SETTINGS
          // => widgets and custom_css
          //Switch to global skope for not skoped panels
          var _switchBack = function( _title ) {
                api.czr_activeSkopeId( self.getGlobalSkopeId() );
                api.czr_serverNotification({
                      status:'success',
                      message : [ _title , 'can only be customized sitewide.' ].join(' ')
                });
                return dfd.resolve().promise();
          };
          if ( self.isExcludedSidebarsWidgets() && 'widgets' == api.czr_activePanelId() && to != self.getGlobalSkopeId() ) {
                api.czr_serverNotification({
                      status:'success',
                      message : [
                            serverControlParams.i18n.skope['Widgets are created sitewide.']
                      ].join(' ')
                });
                //return dfd.resolve().promise();// _switchBack( api.panel( api.czr_activePanelId() ).params.title );
          }
          if ( self.isExcludedWPCustomCss() && 'custom_css' == api.czr_activeSectionId() && to != self.getGlobalSkopeId() ) {
                return _switchBack( api.section( api.czr_activeSectionId() ).params.title );
          }
          if ( 'admin_sec' == api.czr_activeSectionId() && to != self.getGlobalSkopeId() ) {
                return _switchBack( api.section( api.czr_activeSectionId() ).params.title );
          }
          if ( ( 'nav_menu' == api.czr_activeSectionId().substring( 0, 'nav_menu'.length ) || 'add_menu' == api.czr_activeSectionId() ) && to != self.getGlobalSkopeId() )  {
                api.czr_serverNotification({
                      status:'success',
                      message : [
                            serverControlParams.i18n.skope['Menus are created sitewide.']
                      ].join(' ')
                });
                //_switchBack( api.section( api.czr_activeSectionId() ).params.title );
          }


          //AWAKE NOT CURRENTLY ACTIVE NAV MENUS SECTION
          //=> this solves the problem of nav menu location not being refreshed on skope switch
          if ( 'nav_menus' == api.czr_activePanelId() ) {
                _.each( api.panel( api.czr_activePanelId() ).sections(), function( _sec ) {
                      //PROCESS SILENT UPDATES
                      self.processSilentUpdates( { section_id : _sec.id, awake_if_not_active : true } );
                });
          }


          //Set state
          api.state('switching-skope')( true );
          //write the current skope title
          self._writeCurrentSkopeTitle( to );
          //paint skope color
          api.trigger( 'czr-paint', { is_skope_switch : true } );

          //CURRENT EXPANDED SECTION DEPENDANT ACTIONS
          //stop here if the active section is not set yet
          //=> the silent update will be fired on section expansion anyway
          //=> refresh now if the previewer is not skope aware, this will post the dyn_type used in the preview to get the proper option if the skope is not 'global'
          //=> otherwise simply refresh to set the new skope in the query params => needed for the preview frame
          if ( _.isUndefined( api.czr_activeSectionId() ) ) {
                // if ( 'pending' == api.czr_isPreviewerSkopeAware.state() ) {
                //     api.previewer.refresh();
                // } else {
                //     api.previewer.refresh();
                // }
                api.state('switching-skope')( false );
                api.previewer.refresh();
                return dfd.resolve().promise();
          }

          //close the module panel id needed
          if ( _.has( api, 'czrModulePanelState') )
            api.czrModulePanelState(false);

          //PROCESS SILENT UPDATES
          //Build the silent update candidates array
          //populates with the current section setting ids or the one provided
          var _silentUpdateCands = self._getSilentUpdateCandidates();

          //add the previous skope dirty settings ids
          if ( ! _.isUndefined( from ) ) {
            _.each( api.czr_skope( from ).dirtyValues(), function( val, _setId ) {
                  if ( ! _.contains( _silentUpdateCands, _setId ) )
                      _silentUpdateCands.push( _setId );
            } );
          }
          if ( ! _.isUndefined( to ) ) {
            _.each( api.czr_skope( to ).dirtyValues(), function( val, _setId ) {
                  if ( ! _.contains( _silentUpdateCands, _setId ) )
                      _silentUpdateCands.push( _setId );
            } );
          }

          //api.consoleLog('ACTIVE SKOPE REACT', to, from, _silentUpdateCands );

          //Process Silent Updates and
          //make sure that the visibility is processed after the silent updates
          var _debouncedProcessSilentUpdates = function() {
                self.processSilentUpdates( {
                            candidates : _silentUpdateCands,
                            section_id : null,
                            refresh : false//will be done on done()
                      })
                      .fail( function() {
                            dfd.reject();
                            api.state('switching-skope')( false );
                            throw new Error( 'Fail to process silent updates in _debouncedProcessSilentUpdates');
                      })
                      .done( function( _updatedSetIds ) {
                            api.previewer.refresh()
                                  .always( function() {
                                        dfd.resolve( _updatedSetIds );
                                        api.state( 'switching-skope' )( false );
                                  });

                            //on first skope reaction ( initialization phase ) , when from is still undefined : no need to refresh if the target skope is global
                            //=> improve speed performance on init
                            // if ( _.isUndefined( from ) && api.czr_skope.has( to ) && 'global' == api.czr_skope( to )().skope ) {
                            //       dfd.resolve( _updatedSetIds );
                            //       api.state( 'switching-skope' )( false );
                            // } else {
                            //       api.previewer.refresh()
                            //             .always( function() {
                            //                   dfd.resolve( _updatedSetIds );
                            //                   api.state( 'switching-skope' )( false );
                            //             });
                            // }
                      });
          };

          //Process silent updates
          //Collapse the current expanded module if any
          if ( _.has(api, 'czr_isModuleExpanded') && false !== api.czr_isModuleExpanded() ) {
                api.czr_isModuleExpanded().setupModuleViewStateListeners(false);
                _debouncedProcessSilentUpdates = _.debounce( _debouncedProcessSilentUpdates, 400 );
                _debouncedProcessSilentUpdates();
          } else {
                _debouncedProcessSilentUpdates();
          }
          return dfd.promise();
    },//activeSkopeReact



    //@return void()
    //Fired in activeSkopeReact()
    _writeCurrentSkopeTitle : function( skope_id ) {
          var self = this,
              current_title = api.czr_skope( skope_id || api.czr_activeSkopeId() )().long_title,
              _buildTitleHtml = function() {
                    var _inheritedFrom = self.getInheritedSkopeTitles(),
                        _overrides = self.getOverridenSkopeTitles();

                    return $.trim( [
                          '<span class="czr-main-title"><span class="czr-toggle-title-notice fa fa-info-circle"></span>',
                          'global' == api.czr_skope( skope_id || api.czr_activeSkopeId() )().skope ? current_title : ['Customizing', current_title ].join(' '),
                          '</span>',
                          '<span class="czr-skope-inherits-from">',
                          serverControlParams.i18n.skope['In this context :'],
                          _.isEmpty( _inheritedFrom ) ? ' ' : serverControlParams.i18n.skope['inherits from'],
                          _inheritedFrom,
                          _.isEmpty( _inheritedFrom ) ? '' : _.isEmpty( _overrides ) ? '.' : [',' , serverControlParams.i18n.skope['and'] ].join(' '),
                          _.isEmpty( _overrides ) ? ' ' : serverControlParams.i18n.skope['overridden by'],
                          _overrides,
                          _.isEmpty( _overrides ) ? '' : '.',
                          '</span>'
                    ].join(' ') );
              },
              _toggle_spinner = function( visible ) {
                    if ( visible ) {
                          $('.czr-scope-switcher').find('.spinner').fadeIn();
                    } else {
                          $('.czr-scope-switcher').find('.spinner').fadeOut();
                    }
              };

          //render / update the title
          self.skopeWrapperEmbedded
                .then( function() {
                      if ( ! $('.czr-scope-switcher').find('.czr-current-skope-title').length ) {
                            $('.czr-scope-switcher').prepend(
                                  $( '<h2/>', {
                                        class : 'czr-current-skope-title',
                                        html : [
                                              '<span class="czr-skope-title">',
                                              '<span class="spinner">',
                                              _buildTitleHtml(),
                                              '</span>',
                                              '</span>'
                                        ].join('')
                                  })
                            );
                      } else {
                            $.when( $('.czr-scope-switcher').find('.czr-skope-title').fadeOut(200) ).done( function() {
                                  $(this)
                                        .html( _buildTitleHtml() )
                                        .fadeIn(200);
                            });
                      }

                      if ( _.isUndefined( api.state( 'switching-skope' ).isBound ) ) {
                            api.state('switching-skope').bind( _toggle_spinner );
                            api.state( 'switching-skope' ).isBound = true;
                      }
          });
    }//_writeCurrentSkopeTitle
});//$.extend
})( wp.customize , jQuery, _ );
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {
    //@param params :
    // {
    //   candidates : silentUpdateCands,
    //   section_id : section_id,
    //   refresh : true,
    //   awake_if_not_active : false
    // }
    processSilentUpdates : function( params ) {
          //api.consoleLog('PROCESS SILENT UPDATES', params );
          //a setting id can be passed as param instead of an object
          if ( _.isString( params ) )
            params = { candidates : [ params ] };
          else
            params = params || {};

          var self = this,
              defaultParams = {
                  candidates : [],
                  section_id : api.czr_activeSectionId(),
                  refresh : true,
                  awake_if_not_active : false
              },
              dfd = $.Deferred();

          params = $.extend( defaultParams, params );

          //Cast the candidates to an array, if only one setId is passed as a string
          if ( _.isString( params.candidates ) ) {
            params.candidates = [ params.candidates ];
          }

          //do we have well defined silent update candidates ?
          if ( _.isEmpty( params.candidates ) )
                params.candidates = self._getSilentUpdateCandidates( params.section_id, params.awake_if_not_active );
          if ( ! _.isArray( params.candidates ) ) {
                throw new Error('processSilentUpdates : the update candidates must be an array.');
          }

          //bail now if we still don't have candidates to update
          if ( _.isEmpty( params.candidates ) )
            return dfd.resolve( [] ).promise();


          var _enjoyTheSilence = function() {
                self.silentlyUpdateSettings( params.candidates, params.refresh )
                      .fail( function() {
                            dfd.reject();
                      })
                      .done( function( updated_settings ) {
                            _.delay( function() {
                                  self.setupActiveSkopedControls( {
                                        section_id : params.section_id
                                  });
                            }, 1000 );
                            dfd.resolve( updated_settings );
                      });
          };

          //silently update the settings of a the currently active section() to the values of the current skope
          //silentlyUpdateSettings returns a promise.
          if ( 'resolved' != api.czr_skopeReady.state() ) {
                dfd.resolve( [] );
                api.czr_skopeReady.done( function() {
                      _enjoyTheSilence();
                });
          } else {
                _enjoyTheSilence();
          }

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
          //Declare a new api state
          if ( ! api.state.has( 'silent-update-processing') )
            api.state.create( 'silent-update-processing' )( false );

          api.state( 'silent-update-processing' )(true);

          //api.consoleLog('silentlyUpdateSettings', _silentUpdateCands, refresh );
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


          var _deferred = [],
              _updatedSetIds = [];
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
                      if ( ! _.isEqual( api( wpSetId )(), _new_setting_val_ ) ) {
                            _updatedSetIds.push( setId );
                      }
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
          .always( function() {
                api.state( 'silent-update-processing' )( false );
          })
          .then( function() {
                _.each( _deferred, function( prom ){
                      if ( _.isObject( prom ) && 'resolved' !== prom.state() ) {
                            throw new Error( 'a silent update promise is unresolved : ' + _silentUpdateCands );
                      }
                });
                //always refresh by default
                if ( refresh && ! _.isEmpty( _updatedSetIds ) ) {
                      api.previewer.refresh()
                            .always( function() {
                                  dfd.resolve( _updatedSetIds );
                            });
                } else {
                      dfd.resolve( _updatedSetIds );
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
                //an overridden version of api.Element.synchronizer.val.update
                //For some specific controls, we need to implement a different way to synchronize
                var control_type = api.control( wpSetId ).params.type,
                    _control_data = api.settings.controls[wpSetId],
                    _constructor;

                //////////EXPERIMENT
                // if ( 'widget_form' == control_type ) {
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
    _getSilentUpdateCandidates : function( section_id, awake_if_not_active ) {
          var self = this,
              SilentUpdateCands = [];
          section_id = ( _.isUndefined( section_id ) || _.isNull( section_id ) ) ? api.czr_activeSectionId() : section_id;

          //skope switch when no section expanded
          //=> Make it possible to "awake" a not active section
          //=> typically used to awake nav_menu_locations section when in nav_menus panel
          if ( _.isEmpty( api.czr_activeSectionId() ) && ! awake_if_not_active ) {
                return [];
          }
          //error cases
          if ( _.isUndefined( section_id ) ) {
                api.consoleLog( '_getSilentUpdateCandidates : No active section provided');
                return [];
          }
          if ( ! api.section.has( section_id ) ) {
                throw new Error( '_getSilentUpdateCandidates : The section ' + section_id + ' is not registered in the API.');
          }

          //GET THE CURRENT EXPANDED SECTION SET IDS
          var section_settings = api.CZR_Helpers.getSectionSettingIds( section_id );

          //keep only the skope eligible setIds
          section_settings = _.filter( section_settings, function( setId ) {
              return self.isSettingSkopeEligible( setId );
          });

          //Populates the silent update candidates array
          _.each( section_settings, function( setId ) {
                SilentUpdateCands.push( setId );
          });

          return SilentUpdateCands;
    }

});//$.extend
})( wp.customize , jQuery, _ );
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {
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
              current_skope_instance = api.czr_skope( api.czr_activeSkopeId() );

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
          var _constructor = api.controlConstructor.czr_cropped_image, dfd = $.Deferred(),
              val = api.has(wpSetId) ? api(wpSetId)() : null;
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
                dfd.resolve();
          } ).fail( function() {
                //remove the container and its control
                api.control( wpSetId ).container.remove();
                api.control.remove( wpSetId );
                //update the data : remove the attachment property
                _control_data = _.omit( _control_data, 'attachment' );
                //instantiate the control with the updated _control_data
                api.control.add( wpSetId,  new _constructor( wpSetId, { params : _control_data, previewer : api.previewer }) );
                dfd.reject();
          });

          //set the media fetched as promise to return;
          return dfd.promise();
    },



    /*****************************************************************************
    * HEADER IMAGE PROMISE
    *****************************************************************************/
    //@return promise
    _getHeaderImagePromise : function( wpSetId, skope_id ) {
          var dfd = $.Deferred();
          if ( ! _.has(api.settings.controls, 'header_image') || 'header_image' != wpSetId  ) {
            return dfd.resolve().promise();
          }

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
                dfd.resolve();
          } else {
                attachment_id = header_image_data.attachment_id;

                //re-add the control when the new image has been fetched asynchronously.
                //if no image can be fetched, for example when in the active skope, the image is not set, then
                //refresh the control without attachment data
                wp.media.attachment( attachment_id ).fetch().done( function() {
                      //update the data with the new img attributes
                      _header_control_data.attachment = this.attributes;
                      _reset_header_image_crtl( _header_control_data );
                      dfd.resolve();
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
                      dfd.reject();
                });
          }//else

          //return the promise
          return dfd.promise();
    }
});//$.extend
})( wp.customize , jQuery, _ );

/*****************************************************************************
* THE SKOPE BASE OBJECT
*****************************************************************************/
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {
    /*****************************************************************************
    * SETUP CONTROL RESET ON SECTION EXPANSION + SKOPE SWITCH
    *****************************************************************************/
    //fired on section expansion + skope switch, when silentlyUpdateSettings.done()
    //@param obj :
    //{
    //  controls : [] of controls or controlId string
    //  section_id : string
    //}
    //@return void()
    setupActiveSkopedControls : function( obj ) {
          var self = this, section_id, controls, setupParams, eligibleCtrls, dfd = $.Deferred();
              defaultSetupParams = {
                    controls : [],
                    section_id : api.czr_activeSectionId()
              };
          setupParams = $.extend( defaultSetupParams, obj );

          if ( ! _.isObject( setupParams ) || ! _.has( setupParams, 'controls' ) || ! _.has( setupParams, 'section_id' ) ) {
                throw new Error( 'setupActiveSkopedControls : the setupParams param must be an object with properties controls and section_id.');
          }

          section_id  = setupParams.section_id;
          controls    = setupParams.controls;
          eligibleCtrls = [];

          if ( _.isEmpty( section_id ) || ! _.isString( section_id ) ) {
                section_id = api.czr_activeSectionId();
          }
          if ( _.isEmpty( controls ) ) {
                controls = api.CZR_Helpers.getSectionControlIds( section_id  );
          }

          controls = _.isString( controls ) ? [controls] : controls;


          //1) Add CSS classes
          //2) filter only eligible ctrlIds
          eligibleCtrls = _.filter( controls, function( ctrlId ) {
                var setId = api.CZR_Helpers.getControlSettingId( ctrlId );
                if ( setId && ! self.isSettingSkopeEligible( setId ) ) {
                      api.control( ctrlId ).container.addClass('czr-not-skoped');
                }
                if ( setId && self.isWPAuthorizedSetting( setId ) ) {
                      api.control( ctrlId ).container.addClass('is-wp-authorized-setting');
                }
                return setId && self.isSettingSkopeEligible( setId );
                //return true;
                //return self.isSettingSkopeEligible( ctrlId );
                //return self.isSettingResetEligible( ctrlId );
          });

          //Bail before printing anything if 'nav_menu[' section
          if ( 'nav_menu[' == section_id.substring( 0, 'nav_menu['.length ) )
            return dfd.resolve().promise();

          //Render the reset icon ONLY for eligible controls
          //Setup the state for all controls, even not eligible ones
          if ( ! _.isEmpty( controls ) ) {
                api.czr_skopeReady.then( function() {
                      $.when( self.renderControlsSingleReset( eligibleCtrls ) ).done( function() {
                            //api.consoleLog('RENDER CONTROL SINGLE RESET DONE', controls );
                            //add observable Value(s) to the section control
                            _.each( controls, function( ctrlId ) {
                                  self.listenSkopedControl( ctrlId );
                            } );
                            dfd.resolve();
                      });
                });
                //paranoid line of code...
                if ( 'rejected' == api.czr_skopeReady.state() )
                  dfd.resolve();
          }

          //Prepare skope control notice for all controls, even the non eligible ones
          self.renderCtrlSkpNotIcon( controls );
          return dfd.promise();
    },//setupActiveSkopedControls



    //@params ctrlId = string control id candidate to setup
    listenSkopedControl : function( ctrlId ) {
          var self = this;

          if ( ! api.has( ctrlId ) || _.isUndefined( api.control( ctrlId ) ) )
            return;

          var ctrl        = api.control( ctrlId ),
              setId       = api.CZR_Helpers.getControlSettingId( ctrlId ),
              shortSetId  = api.CZR_Helpers.getOptionName( setId ),
              defaults    = {
                    hasDBVal : false,
                    isDirty : false,
                    noticeVisible : false,
                    resetVisible : false,
                    isResetting : false
              },
              initial_states = {};

          //Declare observable Values
          // + Bind them
          if ( ! _.has( ctrl, 'czr_states' ) ) {
                ctrl.czr_states = new api.Values();
                _.each( defaults, function( _state_val, _state_name ) {
                      ctrl.czr_states.create( _state_name );
                      ctrl.czr_states( _state_name )( _state_val );
                });
                //Then listen to their changes
                try { self.bindControlStates( ctrl ); } catch( er ) {
                      api.errorLog( 'bindControlStates : ' + er );
                }
          }

          //Set them
          // initial_states = _.extend(
          //       defaults,
          //       {
          //             hasDBVal : api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( ctrlId ),
          //             isDirty : api.czr_skope( api.czr_activeSkopeId() ).getSkopeSettingDirtyness( ctrlId )
          //       }
          // );
          ctrl.czr_states( 'hasDBVal' )( api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( setId ) );
          ctrl.czr_states( 'isDirty' )( api.czr_skope( api.czr_activeSkopeId() ).getSkopeSettingDirtyness( setId ) );

          //api.consoleLog( 'SETUP CONTROL VALUES ?', ctrlId, api.czr_skope( api.czr_activeSkopeId() ).hasSkopeSettingDBValues( ctrlId ) );


          if ( ! _.has( ctrl, 'userEventMap' ) ) {
                ctrl.userEventMap = [
                      //toggle reset dialog
                      {
                            trigger   : 'click keydown',
                            selector  : '.czr-setting-reset, .czr-cancel-button',
                            name      : 'control_reset_warning',
                            actions   : function() {
                                  if ( ! ctrl.czr_states('isDirty')() && ! ctrl.czr_states( 'hasDBVal' )() )
                                    return;
                                  //close all other warnings expanded in the section
                                  _.each( _.without( api.CZR_Helpers.getSectionControlIds( ctrl.section() ), ctrlId ) , function( _id ) {
                                        if ( _.has( api.control(_id), 'czr_states') ) {
                                              api.control(_id).czr_states( 'resetVisible' )( false );
                                        }
                                  });
                                  ctrl.czr_states( 'resetVisible' )( ! ctrl.czr_states( 'resetVisible' )() );
                                  //collapse the control notice expanded if resetting requested
                                  ctrl.czr_states( 'noticeVisible' )( ! ctrl.czr_states( 'resetVisible' )() );
                            }
                      },
                      //skope reset : do reset
                      {
                            trigger   : 'click keydown',
                            selector  : '.czr-control-do-reset',
                            name      : 'control_do_reset',
                            actions   : function() {
                                  self.doResetSetting( ctrlId );
                            }
                      },
                      //skope switch
                      {
                            trigger   : 'click keydown',
                            selector  : '.czr-skope-switch',
                            name      : 'control_skope_switch',
                            actions   : function( params ) {
                                  var _skopeIdToSwithTo = $( params.dom_event.currentTarget, params.dom_el ).attr('data-skope-id');
                                  if ( ! _.isEmpty( _skopeIdToSwithTo ) && api.czr_skope.has( _skopeIdToSwithTo ) )
                                    api.czr_activeSkopeId( _skopeIdToSwithTo );
                            }
                      },
                      //Toggle Notice
                      {
                            trigger   : 'click keydown',
                            selector  : '.czr-toggle-notice',
                            name      : 'control_toggle_notice',
                            actions   : function( params ) {
                                  ctrl.czr_states( 'noticeVisible' )( ! ctrl.czr_states( 'noticeVisible' )() );
                                  //collapse the control reset dialog expanded
                                  if ( ctrl.czr_states( 'noticeVisible' )() ) {
                                        ctrl.czr_states( 'resetVisible' )( false );
                                  }
                            }
                      }
                ];
                api.CZR_Helpers.setupDOMListeners( ctrl.userEventMap , { dom_el : ctrl.container }, self );
          }
    },

    //The ctrl.czr_states registered api.Values are :
    //hasDBVal : false,
    //isDirty : false,
    //noticeVisible : false,
    //resetVisible : false
    bindControlStates : function( ctrl ) {
          if ( ! api.control.has( ctrl.id ) ) {
                throw new Error( 'in bindControlStates, the provided ctrl id is not registered in the api : ' + ctrl.id );
          }
          var self = this,
              setId = api.CZR_Helpers.getControlSettingId( ctrl.id );

          //DB VALS
          ctrl.czr_states( 'hasDBVal' ).bind( function( bool ) {
                ctrl.container.toggleClass( 'has-db-val', bool );
                if ( bool ) {
                      _title = serverControlParams.i18n.skope['Reset your customized ( and published ) value'];
                } else if ( ctrl.czr_states('isDirty')() ) {
                      _title = serverControlParams.i18n.skope['Reset your customized ( but not yet published ) value'];
                } else {
                      _title = serverControlParams.i18n.skope['Not customized yet, nothing to reset'];
                }
                ctrl.container.find('.czr-setting-reset').attr( 'title', _title );
          });

          //API DIRTYNESS
          ctrl.czr_states( 'isDirty' ).bind( function( bool ) {
                ctrl.container.toggleClass( 'is-dirty', bool );
                var _title;
                if ( bool ) {
                      _title = serverControlParams.i18n.skope['Reset your customized ( but not yet published ) value'];
                } else if ( ctrl.czr_states('hasDBVal')() ) {
                      _title = serverControlParams.i18n.skope['Reset your customized ( and published ) value'];
                } else {
                      _title = serverControlParams.i18n.skope['Not customized yet, nothing to reset'];
                }
                ctrl.container.find('.czr-setting-reset').attr( 'title', _title );
          });

          //NOTICE VISIBILITY
          ctrl.czr_states( 'noticeVisible' ).bind( function( visible ) {
                ctrl.container.toggleClass( 'czr-notice-visible', visible );
                var $noticeContainer = ctrl.getNotificationsContainerElement();
                if ( false !== $noticeContainer && false !== $noticeContainer.length ) {
                      if ( ! visible ) {
                            $.when( $noticeContainer
                                  .stop()
                                  .slideUp( 'fast', null, function() {
                                        $( this ).css( 'height', 'auto' );
                                  } ) ).done( function() {
                                        self.removeCtrlSkpNot( ctrl.id );
                                  });
                      } else {
                            self.updateCtrlSkpNot( ctrl.id, true );//<= True for visible
                            $noticeContainer
                                  .stop()
                                  .slideDown( 'fast', null, function() {
                                        $( this ).css( 'height', 'auto' );
                                  } );
                      }
                }
          });

          //RESET VISIBILITY
          ctrl.czr_states( 'resetVisible' ).bind( function( visible ) {
                var section_id = ctrl.section() || api.czr_activeSectionId();
                if ( visible ) {
                      //self.renderControlResetWarningTmpl
                      //returns an object : { container : $(el), is_authorized : is_authorized }
                      $.when( self.renderControlResetWarningTmpl( ctrl.id ) ).done( function( _params ) {
                            if ( _.isEmpty( _params ) )
                              return;
                            ctrl.czr_resetDialogContainer = _params.container;
                            _params.container.slideToggle('fast');
                            //Close and remove automatically if the user attempted to reset a non authorized setting
                            //The setting can not be reset if :
                            //1) WP setting
                            //2) global skope
                            //3) setting not dirty => db reset
                            if ( ! _params.is_authorized ) {
                                  _.delay( function() {
                                        $.when( ctrl.czr_resetDialogContainer.slideToggle('fast') ).done( function() {
                                              ctrl.czr_resetDialogContainer.remove();
                                        });
                                  }, 3000 );
                            }
                      });
                } else {
                      if ( _.has( ctrl, 'czr_resetDialogContainer' ) && ctrl.czr_resetDialogContainer.length )
                            $.when( ctrl.czr_resetDialogContainer.slideToggle('fast') ).done( function() {
                                  ctrl.czr_resetDialogContainer.remove();
                            });
                }
          });
    }
});//$.extend()
})( wp.customize , jQuery, _ );

/*****************************************************************************
* THE SKOPE BASE OBJECT
*****************************************************************************/
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {
    //fired on
    //1) active section expansion
    //2) and on skope switch
    //render each control reset icons with a delay
    //=> because some control like media upload are re-rendered on section expansion
    //@params controls = array of skope eligible control ids
    renderControlsSingleReset : function( controls ) {
          var self = this, dfd = $.Deferred();
          //create the control ids list if not set
          if ( _.isUndefined( controls ) || _.isEmpty( controls ) ) {
                controls = api.CZR_Helpers.getSectionControlIds( api.czr_activeSectionId() );
                //filter only eligible controlIds
                controls = _.filter( controls, function( _id ) {
                      var setId = api.CZR_Helpers.getControlSettingId( _id );
                      return setId && self.isSettingSkopeEligible( setId );
                });
          }

          var controlIds = _.isArray(controls) ? controls : [controls],
              render_reset_icons = function( ctrlIds ) {
                    if ( _.isEmpty( ctrlIds ) ) {
                          dfd.resolve();
                          return;
                    }
                    //api.consoleLog('IN RENDER RESET ICONS', ctrlIds );
                    _.each( ctrlIds, function( _id ) {
                          api.control.when( _id, function() {
                                var ctrl  = api.control( _id ),
                                    setId = api.CZR_Helpers.getControlSettingId( _id );

                                if( $('.czr-setting-reset', ctrl.container ).length ) {
                                      dfd.resolve();
                                      return;
                                }

                                ctrl.deferred.embedded.then( function() {
                                      $.when(
                                            ctrl.container
                                                  .find('.customize-control-title').first()//was.find('.customize-control-title')
                                                  .prepend( $( '<span/>', {
                                                        class : 'czr-setting-reset fa fa-refresh',
                                                        title : ''
                                                  } ) ) )
                                      .done( function(){
                                            ctrl.container.addClass('czr-skoped');
                                            $('.czr-setting-reset', ctrl.container).fadeIn( 400 );
                                            dfd.resolve();
                                      });
                                });//then()
                          });//when()
                    });//_each
              };

          //debounce because some control like media upload are re-rendered on section expansion
          render_reset_icons = _.debounce( render_reset_icons , 200 );
          render_reset_icons( controlIds );
          return dfd.promise();
    },



    //Fired in self.bindControlStates()
    //@uses The ctrl.czr_states('isDirty') value
    renderControlResetWarningTmpl : function( ctrlId ) {
          if ( ! api.control.has( ctrlId ) )
            return {};

          var self = this,
              ctrl = api.control( ctrlId ),
              setId = api.CZR_Helpers.getControlSettingId( ctrlId ),
              _tmpl = '',
              warning_message,
              success_message,
              isWPSetting = ( function() {
                    //exclude the WP built-in settings like blogdescription, show_on_front, etc
                    if ( _.contains( serverControlParams.wpBuiltinSettings, api.CZR_Helpers.getOptionName( setId ) ) )
                      return true;
                    if ( ! _.contains( serverControlParams.themeSettingList, api.CZR_Helpers.getOptionName( setId ) ) )
                      return true;
                    return false;
              })(),
              _currentSkopeModel = api.czr_skope( api.czr_activeSkopeId() )();

          if ( ctrl.czr_states( 'isDirty' )() ) {
                warning_message = [
                      'global' == _currentSkopeModel.skope ? serverControlParams.i18n.skope['Please confirm that you want to reset your current customizations for this option'] : serverControlParams.i18n.skope['Please confirm that you want to reset your current customizations for this option in'],
                      'global' == _currentSkopeModel.skope ? serverControlParams.i18n.skope['sitewide'] : _currentSkopeModel.ctx_title
                ].join(' ');
                success_message = serverControlParams.i18n.skope['Your customizations have been reset'];
          } else {
                if ( isWPSetting && 'global' == _currentSkopeModel.skope ) {
                      warning_message = serverControlParams.i18n.skope['This WordPress setting can not be reset sitewide'];
                } else {
                      warning_message = [
                          'global' == _currentSkopeModel.skope ? serverControlParams.i18n.skope['Please confirm that you want to reset this option'] : serverControlParams.i18n.skope['Please confirm that you want to reset this option in'],
                          'global' == _currentSkopeModel.skope ? serverControlParams.i18n.skope['sitewide'] : _currentSkopeModel.ctx_title
                      ].join(' ');
                      success_message = serverControlParams.i18n.skope['The option has been reset'];
                }
          }

          //The setting can not be reset if :
          //1) WP setting
          //2) global skope
          //3) setting not dirty => db reset
          var is_authorized = ! ( isWPSetting && 'global' == api.czr_skope( api.czr_activeSkopeId() )().skope && ! ctrl.czr_states( 'isDirty' )() ),
              _tmpl_data = {
                    warning_message : warning_message + '.',
                    success_message : success_message + '.',
                    is_authorized : is_authorized
              };
          try {
                _tmpl =  wp.template('czr-reset-control')( _tmpl_data );
          } catch( er ) {
                api.errorLog( 'Error when parsing the the reset control template : ' + er );
                return { container : false, is_authorized : false };
          }

          $('.customize-control-title', ctrl.container).first().after( $( _tmpl ) );

          return { container : $( '.czr-ctrl-reset-warning', ctrl.container ), is_authorized : is_authorized };
    },


    //Fired on user click
    //Defined in the ctrl user event map
    //@uses The ctrl.czr_states values
    //Will fire a different callback, whether the setting is dirty or has db val
    doResetSetting : function( ctrlId ) {
          var self = this,
              setId = api.CZR_Helpers.getControlSettingId( ctrlId ),
              ctrl = api.control( ctrlId ),
              skope_id = api.czr_activeSkopeId(),
              reset_method = ctrl.czr_states( 'isDirty' )() ? '_resetControlDirtyness' : '_resetControlAPIVal',
              _setResetDialogVisibility = function() {
                    var ctrl = this;//<= fired with .call( ctrlInstance )
                    ctrl.czr_states( 'resetVisible' )( false );
                    ctrl.czr_states( 'isResetting' )( false);
                    ctrl.container.removeClass('czr-resetting-control');
              },
              _updateAPI = function( ctrlId ) {
                    var _silentUpdate = function() {
                              api.czr_skopeBase.processSilentUpdates( { candidates : ctrlId, refresh : false } )
                                    .fail( function() { api.consoleLog( 'Silent update failed after resetting control : ' + ctrlId ); } )
                                    .done( function() {
                                          api.control.when( ctrlId, function() {
                                                //the control instance might have changed if it has been re-rendered.
                                                //=> make sure we grab the new one
                                                var ctrl = api.control( ctrlId );
                                                $.when( $('.czr-crtl-reset-dialog', ctrl.container ).fadeOut('300') ).done( function() {
                                                      $.when( $('.czr-reset-success', ctrl.container ).fadeIn('300') ).done( function( $_el ) {
                                                            _.delay( function() {
                                                                  $.when( $_el.fadeOut('300') ).done( function() {
                                                                        self.setupActiveSkopedControls( { controls : [ ctrlId ] } ).done( function() {
                                                                              if ( ctrl.czr_states ) {
                                                                                    _setResetDialogVisibility.call( ctrl );
                                                                                    ctrl.czr_states( 'noticeVisible' )( self.isCtrlNoticeVisible( ctrlId ) );
                                                                              }
                                                                        });
                                                                  });
                                                            }, 500 );
                                                      });
                                                });
                                          });
                                    });//done()
                    };//_silentUpdate

                    //Specific case for global :
                    //After a published value reset (not a dirty reset),
                    //we need to re-synchronize the api.settings.settings with the default theme options values
                    self[reset_method](ctrlId)
                          .done( function() {
                                api.consoleLog('REFRESH AFTER A SETTING RESET');
                                //api.previewer.refresh() method is resolved with an object looking like :
                                //{
                                //    previewer : api.previewer,
                                //    skopesServerData : {
                                //        czr_skopes : _wpCustomizeSettings.czr_skopes || [],
                                //        isChangesetDirty : boolean
                                //    },
                                // }
                                api.previewer.refresh()
                                      .fail( function( refresh_data ) {
                                            api.errorLog('Setting reset refresh failed.', refresh_data );
                                      })
                                      .done( function( refresh_data ) {
                                            if ( 'global' == api.czr_skope( skope_id )().skope && '_resetControlAPIVal' == reset_method ) {
                                                  var _sentSkopeCollection,
                                                      _serverGlobalDbValues = {},
                                                      _skope_opt_name = api.czr_skope( skope_id )().opt_name;

                                                  if ( ! _.isUndefined( refresh_data.skopesServerData ) && _.has( refresh_data.skopesServerData, 'czr_skopes' ) ) {
                                                        _sentSkopeCollection = refresh_data.skopesServerData.czr_skopes;
                                                        if ( _.isUndefined( _.findWhere( _sentSkopeCollection, { opt_name : _skope_opt_name } ) ) ) {
                                                              _serverGlobalDbValues = _.findWhere( _sentSkopeCollection, { opt_name : _skope_opt_name } ).db || {};
                                                        }
                                                  }
                                                  api.czr_skopeBase.maybeSynchronizeGlobalSkope( { isGlobalReset : true, isSetting : true, settingIdToReset : setId } )
                                                        .done( function() {
                                                              _silentUpdate();
                                                        });
                                            } else {
                                                  _silentUpdate();
                                            }
                                      });
                          });
              };//_updateAPI


          ctrl.czr_states( 'isResetting' )( true );
          ctrl.container.addClass('czr-resetting-control');

          //api.consoleLog('DO RESET SETTING', ctrlId, ctrl.czr_states( 'isDirty' )() );

          api.czr_skopeReset[ ctrl.czr_states( 'isDirty' )() ? 'resetChangeset' : 'resetPublished' ](
                      { skope_id : skope_id, setId : setId, is_setting : true } )
                      .done( function( r ) {
                            _updateAPI( ctrlId );
                      })
                      .fail( function( r ) {
                              api.errorLog( 'Reset failed', r );
                              $.when( $('.czr-crtl-reset-dialog', ctrl.container ).fadeOut('300') ).done( function() {
                                    $.when( $('.czr-reset-fail', ctrl.container ).fadeIn('300') ).done( function() {
                                          $('.czr-reset-fail', ctrl.container ).append('<p>' + r + '</p>');
                                          _.delay( function() {
                                                _setResetDialogVisibility.call( ctrl );
                                                self.setupActiveSkopedControls( { controls : [ ctrlId ] } );
                                          }, 2000 );
                                    });
                              });
                      });

    },

    //updates the current skope dirties and the changeset dirties
    _resetControlDirtyness : function( ctrlId ) {
          var setId           = api.CZR_Helpers.getControlSettingId( ctrlId ),
              skope_instance  = api.czr_skope( api.czr_activeSkopeId() ),
              current_dirties = $.extend( true, {}, skope_instance.dirtyValues() ),
              new_dirties     = {},
              current_changeset = $.extend( true, {}, skope_instance.changesetValues() ),
              new_changeset     = {},
              dfd             = $.Deferred();

          new_dirties   = _.omit( current_dirties, setId );
          new_changeset = _.omit( current_changeset, setId );
          skope_instance.dirtyValues( new_dirties );
          skope_instance.changesetValues( new_dirties );

          return dfd.resolve().promise();
    },


    //@uses The ctrl.czr_states values
    //updates the current skope dbValues
    //update the ctrl state
    _resetControlAPIVal : function( ctrlId ) {
          var setId = api.CZR_Helpers.getControlSettingId( ctrlId ),
              current_skope_db  = api.czr_skope( api.czr_activeSkopeId() ).dbValues(),
              new_skope_db      = $.extend( true, {}, current_skope_db ),
              dfd = $.Deferred();

          if ( _.has( api.control( ctrlId ), 'czr_states') ) {
                api.control(ctrlId).czr_states( 'hasDBVal' )( false );
                //update the skope db property and say it
                api.czr_skope( api.czr_activeSkopeId() ).dbValues( _.omit( new_skope_db, setId ) );
          }
          return dfd.resolve().promise();
    }
});//$.extend()
})( wp.customize , jQuery, _ );

/*****************************************************************************
* THE SKOPE BASE OBJECT
*****************************************************************************/
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {

    //fired when a section is expanded
    //fired when a setting value is changed
    renderCtrlSkpNotIcon : function( controlIdCandidates ) {
          var self = this,
              controlIds = _.isArray(controlIdCandidates) ? controlIdCandidates : [controlIdCandidates];

          _.each( controlIds, function( _id ) {
                api.control.when( _id, function() {
                      var ctrl = api.control( _id );
                      ctrl.deferred.embedded.then( function() {
                            //RENDER TOGGLE ICON
                            if( $('.czr-toggle-notice', ctrl.container ).length )
                              return;

                            $.when( ctrl.container
                                  .find('.customize-control-title').first()//was.find('.customize-control-title')
                                  .append( $( '<span/>', {
                                        class : 'czr-toggle-notice fa fa-info-circle',
                                        title : serverControlParams.i18n.skope['Display informations about the scope of this option.']
                                  } ) ) )
                            .done( function(){
                                  $('.czr-toggle-notice', ctrl.container).fadeIn( 400 );
                            });
                      });

                });

          });
    },


    //fired when a control notice is expanded
    updateCtrlSkpNot : function( controlIdCandidates, visible ) {
           var self = this,
              controlIds = _.isArray(controlIdCandidates) ? controlIdCandidates : [controlIdCandidates],
              _isSkoped = function( setId ) {
                    return setId && self.isSettingSkopeEligible( setId );
              },//filter only eligible ctrlIds

              _generateControlNotice = function( setId, _localSkopeId ) {
                    var _currentSkopeId         = api.czr_activeSkopeId(),
                        _inheritedFromSkopeId   = self.getInheritedSkopeId( setId, _currentSkopeId ),
                        _overridedBySkopeId     = self.getAppliedPrioritySkopeId( setId, _currentSkopeId ),
                        _html = [],
                        _isCustomized,
                        _hasDBVal,
                        _ctxTitle;

                    //////////////////////
                    /// CASE 0 : not skoped
                    if ( ! _isSkoped( setId ) ) {
                          _html.push( [
                                serverControlParams.i18n.skope['This option is always customized sitewide and cannot be reset.']
                          ].join(' ') );
                          return _html.join(' | ');
                    }

                    //////////////////////
                    /// CASE 1
                    if ( _inheritedFromSkopeId == _overridedBySkopeId && api.czr_skope.has( _inheritedFromSkopeId ) && _currentSkopeId == _inheritedFromSkopeId ) {
                          //is the setId customized in the current skope ?
                          _isCustomized = ! _.isUndefined( api.czr_skope( _currentSkopeId ).dirtyValues()[setId] );
                          _hasDBVal     = ! _.isUndefined( api.czr_skope( _currentSkopeId ).dbValues()[setId] );

                          _ctxTitle = api.czr_skope( _inheritedFromSkopeId )().ctx_title;

                          _ctxTitle = ( _.isString( _ctxTitle ) ? _ctxTitle : '' ).toLowerCase();

                          if ( _isCustomized ) {
                                if ( 'global' == api.czr_skope( _inheritedFromSkopeId )().skope ) {
                                      _html.push( [
                                            serverControlParams.i18n.skope['Customized. Will be applied sitewide once published.'],
                                      ].join(' ') );
                                } else {
                                    _html.push( [
                                          serverControlParams.i18n.skope['Customized. Will be applied to'],
                                          '<strong>' + _ctxTitle + '</strong>',
                                          serverControlParams.i18n.skope['once published.']
                                    ].join(' ') );
                                }
                          } else {
                                if ( _hasDBVal ) {
                                      if ( 'global' == api.czr_skope( _inheritedFromSkopeId )().skope ) {
                                            _html.push( [
                                                  serverControlParams.i18n.skope['Customized and applied sitewide.'],
                                            ].join(' ') );
                                      } else {
                                            _html.push( [
                                                  serverControlParams.i18n.skope['Customized and applied to'],
                                                  '<strong>' + _ctxTitle + '.' + '</strong>'
                                            ].join(' ') );
                                      }
                                } else {
                                      _html.push( serverControlParams.i18n.skope['Default website value applied sitewide.'] );
                                }
                          }
                    }


                    /////////////////////
                    /// CASE 2 : Skope is different than global, there is an inheritance
                    if ( _inheritedFromSkopeId !== _currentSkopeId && api.czr_skope.has( _inheritedFromSkopeId ) ) {
                          //is the setId customized in the current skope ?
                          _isCustomized = ! _.isUndefined( api.czr_skope( _inheritedFromSkopeId ).dirtyValues()[setId] );
                          _hasDBVal     = ! _.isUndefined( api.czr_skope( _inheritedFromSkopeId ).dbValues()[setId] );

                          _ctxTitle = api.czr_skope( _currentSkopeId )().ctx_title;

                          _ctxTitle = ( _.isString( _ctxTitle ) ? _ctxTitle : '' ).toLowerCase();

                          if ( ! _isCustomized && ! _hasDBVal ) {
                                _html.push(
                                      [
                                            serverControlParams.i18n.skope['Default website value.'],
                                            serverControlParams.i18n.skope['You can customize this specifically for'],
                                            '<strong>' + _ctxTitle + '.' + '</strong>'
                                      ].join(' ')
                                );
                          } else {
                                _html.push(
                                      [
                                            serverControlParams.i18n.skope['Currently inherited from'],
                                            self.buildSkopeLink( _inheritedFromSkopeId ) + '.',
                                            serverControlParams.i18n.skope['You can customize this specifically for'],
                                            '<strong>' + _ctxTitle + '.' + '</strong>'
                                      ].join(' ')
                                );
                          }
                    }


                    /////////////////////
                    /// CASE 3
                    if ( _overridedBySkopeId !== _currentSkopeId && api.czr_skope.has( _overridedBySkopeId ) ) {
                          //is the setId customized or saved in the winner skope ?
                          //_hasDBVal = ! _.isUndefined( api.czr_skope( _overridedBySkopeId ).dbValues()[setId] );
                          _isCustomized = ! _.isUndefined( api.czr_skope( _overridedBySkopeId ).dirtyValues()[setId] );

                          _ctxTitle = api.czr_skope( _localSkopeId )().ctx_title;

                          _ctxTitle = ( _.isString( _ctxTitle ) ? _ctxTitle : '' ).toLowerCase();

                          _html.push( [
                                ! _isCustomized ? serverControlParams.i18n.skope['The value currently applied to'] : serverControlParams.i18n.skope['The value that will be applied to'],
                                '<strong>' + _ctxTitle + '</strong>',
                                ! _isCustomized ? serverControlParams.i18n.skope['is set in'] : serverControlParams.i18n.skope['is customized in'],
                                self.buildSkopeLink( _overridedBySkopeId ),
                                serverControlParams.i18n.skope['which has a higher priority than the current option scope'],
                                '<strong>( ' + api.czr_skope( _currentSkopeId )().title + ' ).</strong>'
                          ].join(' ') );
                    }

                    return _html.join(' | ');
              };//_generateControlNotice


          _.each( controlIds, function( _id ) {
                api.control.when( _id, function() {
                      var ctrl = api.control( _id ),
                          setId = api.CZR_Helpers.getControlSettingId( _id ),//get the relevant setting_id for this control
                          _visible = _.isUndefined( visible ) ? ( ctrl.czr_states && ctrl.czr_states( 'noticeVisible' )() ) : visible;

                      //Bail here if the ctrl notice is not set to visible
                      if ( ! _visible  )
                        return;

                      ctrl.deferred.embedded.then( function() {
                            var _localSkopeId = _.findWhere( api.czr_currentSkopesCollection(), { skope : 'local' } ).id,
                                $noticeContainer = ctrl.getNotificationsContainerElement();

                            if ( ! $noticeContainer || ! $noticeContainer.length || _.isUndefined( _localSkopeId ) )
                              return;

                            try {
                                  _html = _generateControlNotice( setId, _localSkopeId );
                            } catch ( er ) {
                                  api.errorLog( '_generateControlNotice : ' + er );
                            }


                            var $skopeNoticeEl = $( '.czr-skope-notice', $noticeContainer );
                            if ( $skopeNoticeEl.length ) {
                                  $skopeNoticeEl.html( _html );
                            } else {
                                  $noticeContainer.append(
                                        [ '<span class="czr-notice czr-skope-notice">', _html ,'</span>' ].join('')
                                  );
                            }
                      });
                });
          });
    },//updateCtrlSkpNot

    // Utility
    // @return bool
    // @param ctrlId = string
    // When do we display the ctrl notice ?
    // 1) When the current skope is not global
    // 2) when the current skope is global AND is overriden by a local or group skope
    isCtrlNoticeVisible : function( ctrlId ) {
          if ( ! api.control.has( ctrlId ) )
            return false;

          var self = this,
              setId = api.CZR_Helpers.getControlSettingId( ctrlId ),//get the relevant setting_id for this control
              _currentSkopeId  = api.czr_activeSkopeId(),
              _overridedBySkopeId  = self.getAppliedPrioritySkopeId( setId, _currentSkopeId ),
              _isSkoped = function( setId ) {
                    return setId && self.isSettingSkopeEligible( setId );
              };//filter only eligible ctrlIds

          if ( 'global' != api.czr_skope( _currentSkopeId )().skope ) {
                return true;
          } else if ( _overridedBySkopeId !== _currentSkopeId && api.czr_skope.has( _overridedBySkopeId ) ) {
                return true;
          }
          return false;
    },


    //@return void()
    removeCtrlSkpNot : function( controlIdCandidates ) {
          var self = this,
              controlIds = _.isArray(controlIdCandidates) ? controlIdCandidates : [controlIdCandidates];

          _.each( controlIds, function( _id ) {
                api.control.when( _id, function() {
                      var ctrl = api.control( _id );

                      ctrl.deferred.embedded.then( function() {
                            var $noticeContainer = ctrl.getNotificationsContainerElement();

                            if ( ! $noticeContainer || ! $noticeContainer.length )
                              return;

                            var $skopeNoticeEl = $( '.czr-skope-notice', $noticeContainer );
                            if ( $skopeNoticeEl.length )
                                  $skopeNoticeEl.remove();
                      });
                });
          });
    }
});//$.extend()
})( wp.customize , jQuery, _ );
var CZRSkopeSaveMths = CZRSkopeSaveMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeSaveMths, {
      initialize: function() {
            var self = this;
            //<@4.9compat>
            //can take values : draft, future, publish, trash, ''
            this.changesetStatus    = function() {
                  return api.state.has( 'selectedChangesetStatus' ) ? api.state( 'selectedChangesetStatus' )() : 'publish';
            };
            this.selectedChangesetDate = function() {
                  return api.state.has( 'selectedChangesetDate' ) ? api.state( 'selectedChangesetDate' )() : null;
            };
            //</@4.9compat>
            this.saveBtn            = $( '#save' );
      },

      // No args are passed as of WP4.9
      // @4.9compat
      save: function( args ) {
            var self        = this,
                processing  = api.state( 'processing' ),
                submitWhenDoneProcessing,
                parent      = new api.Messenger({
                      url: api.settings.url.parent,
                      channel: 'loader',
                });//this has to be reinstantiated because not accessible from core

            //reset some properties on each save call
            self.globalSaveDeferred = $.Deferred();
            self.previewer          = api.previewer;
            self.globalSkopeId      = api.czr_skopeBase.getGlobalSkopeId();
            self.saveArgs           = args;

            if ( args && args.status ) {
                  self.changesetStatus = function() { return args.status; };
            }

            if ( api.state( 'saving' )() ) {
                  self.globalSaveDeferred.reject( 'already_saving' );
            }

            //api.state( 'processing' ).set( api.state( 'processing' ).get() + 1 );
            var alwaysAfterSubmission = function( response, state ) {
                      //WP default treatments
                      api.state( 'saving' )( false );
                      api.state( 'processing' ).set( 0 );
                      self.saveBtn.prop( 'disabled', false );
                      if ( ! _.isUndefined( response ) && response.setting_validities ) {
                            api._handleSettingValidities( {
                                  settingValidities: response.setting_validities,
                                  focusInvalidControl: true
                            } );
                      }

                      //<@4.9compat>
                      // Start a new changeset if the underlying changeset was published.
                      if ( response && 'changeset_already_published' === response.code && response.next_changeset_uuid ) {
                        api.settings.changeset.uuid = response.next_changeset_uuid;
                        api.state( 'changesetStatus' ).set( '' );
                        if ( api.settings.changeset.branching ) {
                          parent.send( 'changeset-uuid', api.settings.changeset.uuid );
                        }
                        api.previewer.send( 'changeset-uuid', api.settings.changeset.uuid );
                      }
                      //</@4.9compat>

                      if ( 'pending' == state ) {
                            api.czr_serverNotification( { message: response, status : 'error' } );
                      } else {
                            //api.czr_serverNotification( { message: 'Successfully published !' } );
                      }
                },
                //params : { saveGlobal : true, saveSkopes : true }
                resolveSave = function( params ) {
                      var response, resolveSaveDfd = $.Deferred();
                      // set saving state.
                      // => will be set to false when all saved promises resolved
                      api.state( 'saving' )( true );
                      self.fireAllSubmission( params )
                            .always( function( _response_ ) {
                                  response = _response_.response;
                                  alwaysAfterSubmission( response , this.state() );
                            })
                            .fail( function( _response_ ) {
                                  response = _response_.response;
                                  api.consoleLog('ALL SUBMISSIONS FAILED', response );
                                  self.globalSaveDeferred.reject( response );
                                  api.trigger( 'error', response );
                                  resolveSaveDfd.resolve( _response_.hasNewMenu );
                            })
                            //_response_ = { response : response,  hasNewMenu : boolean }
                            .done( function( _response_ ) {
                                  response = _response_.response;
                                  //api.previewer.refresh() method is resolved with an object looking like :
                                  //{
                                  //    previewer : api.previewer,
                                  //    skopesServerData : {
                                  //        czr_skopes : _wpCustomizeSettings.czr_skopes || [],
                                  //        isChangesetDirty : boolean
                                  //    },
                                  // }
                                  api.previewer.refresh( { waitSkopeSynced : true } )
                                        .fail( function( refresh_data ) {
                                              self.globalSaveDeferred.reject( self.previewer, [ response ] );
                                              api.consoleLog('SAVE REFRESH FAIL', refresh_data );
                                        })
                                        .done( function( refresh_data ) {
                                              api.previewer.send( 'saved', response );

                                              //response can be undefined, always set them as an object with 'publish' changet_setstatus by default
                                              //because this will be used in various api events ( 'saved', ... ) that does not accept an undefined val.
                                              response = _.extend( { changeset_status : 'publish' },  response || {} );

                                              //since 4.7 : if changeset is on, let's add stuff to the query object
                                              if ( api.czr_isChangeSetOn() ) {
                                                    var latestRevision = api._latestRevision;
                                                    api.state( 'changesetStatus' ).set( response.changeset_status );

                                                    //<@4.9compat>
                                                    if ( response.changeset_date ) {
                                                      api.state( 'changesetDate' ).set( response.changeset_date );
                                                    }
                                                    //</@4.9compat>

                                                    if ( 'publish' === response.changeset_status ) {
                                                          // Mark all published as clean if they haven't been modified during the request.
                                                          api.each( function( setting ) {
                                                                /*
                                                                 * Note that the setting revision will be undefined in the case of setting
                                                                 * values that are marked as dirty when the customizer is loaded, such as
                                                                 * when applying starter content. All other dirty settings will have an
                                                                 * associated revision due to their modification triggering a change event.
                                                                 */
                                                                if ( setting._dirty && ( _.isUndefined( api._latestSettingRevisions[ setting.id ] ) || api._latestSettingRevisions[ setting.id ] <= latestRevision ) ) {
                                                                      setting._dirty = false;
                                                                }
                                                          } );

                                                          api.state( 'changesetStatus' ).set( '' );
                                                          api.settings.changeset.uuid = response.next_changeset_uuid;
                                                          //<@4.9compat>
                                                          if ( api.settings.changeset.branching ) {
                                                            parent.send( 'changeset-uuid', api.settings.changeset.uuid );
                                                          }
                                                          //</@4.9compat>
                                                          else {
                                                            parent.send( 'changeset-uuid', api.settings.changeset.uuid );
                                                          }
                                                    }
                                                    //<@4.9compat>
                                                    // Prevent subsequent requestChangesetUpdate() calls from including the settings that have been saved.
                                                    api._lastSavedRevision = Math.max( latestRevision, api._lastSavedRevision );
                                                    //</@4.9compat>
                                              } else {
                                                    // Clear api setting dirty states
                                                    api.each( function ( value ) {
                                                          value._dirty = false;
                                                    } );
                                              }

                                              //let's use the data sent back by the server on refresh
                                              refresh_data = _.extend( {
                                                          previewer : refresh_data.previewer || self.previewer,
                                                          skopesServerData : refresh_data.skopesServerData || {},
                                                    },
                                                    refresh_data
                                              );

                                              //POST PROCESS AFTER SAVE
                                              //Reset dirtyness
                                              //check if synchronized with server
                                              self.reactWhenSaveDone( refresh_data.skopesServerData );

                                              //Resolve the general globalSaveDeferred
                                              self.globalSaveDeferred.resolveWith( self.previewer, [ response ] );

                                              api.trigger( 'saved', response || {} );
                                              resolveSaveDfd.resolve( _response_.hasNewMenu );
                                        });
                            });
                return resolveSaveDfd.promise();
            };//resolveSave

            if ( 0 === processing() ) {
                  resolveSave().done( function( hasNewMenu ) {
                        if ( hasNewMenu ) {
                              resolveSave( { saveGlobal :false, saveSkopes : true } );
                        }
                  } );
            } else {
                  submitWhenDoneProcessing = function () {
                        if ( 0 === processing() ) {
                              api.state.unbind( 'change', submitWhenDoneProcessing );
                              resolveSave();
                        }
                  };
                  api.state.bind( 'change', submitWhenDoneProcessing );
            }
            return self.globalSaveDeferred.promise();
      }//save
});//$.extend
})( wp.customize , jQuery, _ );
var CZRSkopeSaveMths = CZRSkopeSaveMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeSaveMths, {
      //@return a promise()
      getSubmitPromise : function( skope_id ) {
            var self = this,
                dfd = $.Deferred(),
                submittedChanges = {};

            if ( _.isEmpty( skope_id ) || ! api.czr_skope.has( skope_id ) ) {
                  api.consoleLog( 'getSubmitPromise : no skope id requested OR skope_id not registered : ' + skope_id );
                  return dfd.resolve().promise();
            }

            var skopeObjectToSubmit = api.czr_skope( skope_id )();

            // Resolve here if not dirty AND not global skope
            // always submit the global skope, even if not dirty => required to properly clean the changeset post server side
            if ( ! api.czr_skope( skope_id ).dirtyness() && skope_id !== self.globalSkopeId ) {
                return dfd.resolve().promise();
            }

            //////////////////////////////////SUBMIT THE ELIGIBLE SETTINGS OF EACH SKOPE ////////////////////////////
            //Ensure all revised settings (changes pending save) are also included, but not if marked for deletion in changes.

            // _.each( api.czr_skopeBase.getSkopeDirties( skope_id ) , function( dirtyValue, settingId ) {
            //       submittedChanges[ settingId ] = _.extend(
            //             { value: dirtyValue }
            //       );
            // } );

            _.each( api.czr_skope( skope_id ).dirtyValues(), function( dirtyValue, settingId ) {
                  submittedChanges[ settingId ] = _.extend(
                        { value: dirtyValue }
                  );
            } );

            //a submit call returns a promise resolved when the db ajax query is done().
            //api.consoleLog('submit request for skope : id, object, dirties : ', skope_id, skopeObjectToSubmit , api.czr_skopeBase.getSkopeDirties( skope_id ) );

            this.submit(
                  {
                        skope_id : skope_id,
                        customize_changeset_data : submittedChanges,//{}
                        dyn_type : skopeObjectToSubmit.dyn_type
                  })
                  .done( function(_resp) {
                        //api.consoleLog('GETSUBMIT DONE PROMISE FOR SKOPE : ', skope_id, _resp );
                        dfd.resolve( _resp );
                  } )
                  .fail( function( _resp ) {
                        api.consoleLog('GETSUBMIT FAILED PROMISE FOR SKOPE : ', skope_id, _resp );
                        dfd.reject( _resp );
                  } );

            return dfd.promise();
      },//getSubmitPromise



      // we do the WP 'customize_save' ajax request when skope is global => 'global' == query.skope
      submit : function( params ) {
            var self = this,
                default_params = {
                      skope_id : null,
                      the_dirties : {},
                      customize_changeset_data : {},
                      dyn_type : null,
                      opt_name : null
                },
                invalidSettings = [],
                settingInvalidities = [],
                modifiedWhileSaving = {},
                invalidControls = [],
                //<@4.9compat>
                invalidSettingLessControls = [],
                errorCode = 'client_side_error',
                //</@4.9compat>
                submit_dfd = $.Deferred();


            params = $.extend( default_params, params );

            if ( _.isNull( params.skope_id ) ) {
                  throw new Error( 'OVERRIDEN SAVE::submit : MISSING skope_id');
            }
            if ( _.isNull( params.the_dirties ) ) {
                  throw new Error( 'OVERRIDEN SAVE::submit : MISSING the_dirties');
            }

            //<@4.9compat>
            if ( _.has( api, 'notifications') ) {
                  api.notifications.remove( errorCode );
            }

            //</@4.9compat>
            //
            /*
             * Block saving if there are any settings that are marked as
             * invalid from the client (not from the server). Focus on
             * the control.
             */
            if ( _.has( api, 'notifications') ) {
                  api.each( function( setting ) {
                        setting.notifications.each( function( notification ) {
                              if ( 'error' === notification.type ) {
                                    api.consoleLog('NOTIFICATION ERROR on SUBMIT SAVE' , notification );
                              }
                              if ( 'error' === notification.type && ( ! notification.data || ! notification.data.from_server ) ) {
                                    invalidSettings.push( setting.id );
                                    if ( ! settingInvalidities[ setting.id ] ) {
                                          settingInvalidities[ setting.id ] = {};
                                    }
                                    settingInvalidities[ setting.id ][ notification.code ] = notification;
                              }
                        } );
                  } );

                  //<@4.9compat>
                  // Find all invalid setting less controls with notification type error.
                  api.control.each( function( control ) {
                    if ( ! control.setting || ! control.setting.id && control.active.get() ) {
                      control.notifications.each( function( notification ) {
                          if ( 'error' === notification.type ) {
                            invalidSettingLessControls.push( [ control ] );
                          }
                      } );
                    }
                  } );
                  invalidControls = _.union( invalidSettingLessControls, _.values( api.findControlsForSettings( invalidSettings ) ) );
                  // was : invalidControls = api.findControlsForSettings( invalidSettings );
                  //</@4.9compat>


                  if ( ! _.isEmpty( invalidControls ) ) {
                        _.values( invalidControls )[0][0].focus();
                        //api.unbind( 'change', captureSettingModifiedDuringSave );
                        //
                        //<@4.9compat>
                        if ( invalidSettings.length && _.has( api, 'notifications') && api.l10n.saveBlockedError ) {
                          api.notifications.add( new api.Notification( errorCode, {
                            message: ( 1 === invalidSettings.length ? api.l10n.saveBlockedError.singular : api.l10n.saveBlockedError.plural ).replace( /%s/g, String( invalidSettings.length ) ),
                            type: 'error',
                            dismissible: true,
                            saveFailure: true
                          } ) );
                        }
                        //</@4.9compat>

                        return submit_dfd.rejectWith( self.previewer, [
                              { setting_invalidities: settingInvalidities }
                        ] ).promise();
                  }
            }



            //BUILD THE QUERY OBJECT
            //the skope save query takes parameters
            var query_params = {
                  skope_id : params.skope_id,
                  action : 'save',
                  the_dirties : params.the_dirties,
                  dyn_type : params.dyn_type,
                  opt_name : params.opt_name
            };

            //since 4.7 : if changeset is on, let's add stuff to the query params
            if ( api.czr_isChangeSetOn() ) {
                  $.extend( query_params, { excludeCustomizedSaved: false } );
            }

            /*
             * Note that excludeCustomizedSaved is intentionally false so that the entire
             * set of customized data will be included if bypassed changeset update.
             */

            var query = $.extend( self.previewer.query( query_params ), {
                  nonce:  self.previewer.nonce.save,
                  // since 4.9 => api.state( 'selectedChangesetStatus' )() => draft || future || publish || trash || ''
                  customize_changeset_status: self.changesetStatus(),
                  customize_changeset_data : JSON.stringify( params.customize_changeset_data )
            } );

            //since 4.7 : if changeset is on, let's add stuff to the query object
            if ( api.czr_isChangeSetOn() ) {
                  if ( self.saveArgs && self.saveArgs.date ) {
                    query.customize_changeset_date = self.saveArgs.date;
                  }
                  //<@4.9compat>
                  else if ( 'future' === self.changesetStatus() && self.selectedChangesetDate() ) {
                    query.customize_changeset_date = self.selectedChangesetDate();
                  }
                  //</@4.9compat>
                  if ( self.saveArgs && self.saveArgs.title ) {
                    query.customize_changeset_title = self.saveArgs.title;
                  }
            }

            //<@4.9compat>
            // Allow plugins to modify the params included with the save request.
            api.trigger( 'save-request-params', query );
            //</@4.9compat>


            //api.consoleLog( 'in submit : ', params.skope_id, query, self.previewer.channel() );

            /*
             * Note that the dirty customized values will have already been set in the
             * changeset and so technically query.customized could be deleted. However,
             * it is remaining here to make sure that any settings that got updated
             * quietly which may have not triggered an update request will also get
             * included in the values that get saved to the changeset. This will ensure
             * that values that get injected via the saved event will be included in
             * the changeset. This also ensures that setting values that were invalid
             * will get re-validated, perhaps in the case of settings that are invalid
             * due to dependencies on other settings.
             */

            var request = wp.ajax.post(
                  'global' !== query.skope ? 'customize_skope_changeset_save' : 'customize_save',
                  query
            );

            // Disable save button during the save request.
            //<@4.9compat> => shall we keep that ?
            self.saveBtn.prop( 'disabled', true );
            //</@4.9compat>

            api.trigger( 'save', request );

            // request.always( function () {
            //       api.state( 'saving' ).set( false );
            //       self.saveBtn.prop( 'disabled', false );
            //       api.unbind( 'change', captureSettingModifiedDuringSave );
            // } );

            //<@4.9compat>
            // Remove notifications that were added due to save failures.
            if ( _.has( api, 'notifications') ) {
                  api.notifications.each( function( notification ) {
                    if ( notification.saveFailure ) {
                      api.notifications.remove( notification.code );
                    }
                  });
            }
            //</@4.9compat>

            request.fail( function ( response ) {
                  //<@4.9compat>
                  var notification, notificationArgs;
                  notificationArgs = {
                    type: 'error',
                    dismissible: true,
                    fromServer: true,
                    saveFailure: true
                  };
                  //</@4.9compat>
                  api.consoleLog('SUBMIT REQUEST FAIL', params.skope_id, response );
                  if ( '0' === response ) {
                        response = 'not_logged_in';
                  } else if ( '-1' === response ) {
                        // Back-compat in case any other check_ajax_referer() call is dying
                        response = 'invalid_nonce';
                  }

                  if ( 'invalid_nonce' === response ) {
                        self.previewer.cheatin();
                  } else if ( 'not_logged_in' === response ) {
                        self.previewer.preview.iframe.hide();
                        self.previewer.login().done( function() {
                              self.previewer.save();
                              self.previewer.preview.iframe.show();
                        } );
                  }
                  //<@4.9compat>
                  else if ( response.code ) {
                    if ( 'not_future_date' === response.code && api.section.has( 'publish_settings' ) && api.section( 'publish_settings' ).active.get() && api.control.has( 'changeset_scheduled_date' ) ) {
                      api.control( 'changeset_scheduled_date' ).toggleFutureDateNotification( true ).focus();
                    } else if ( 'changeset_locked' !== response.code ) {
                      notification = new api.Notification( response.code, _.extend( notificationArgs, {
                        message: response.message
                      } ) );
                    }
                  } else {
                    notification = new api.Notification( 'unknown_error', _.extend( notificationArgs, {
                      message: api.l10n.unknownRequestFail
                    } ) );
                  }
                  //</@4.9compat>

                  if ( notification ) {
                    api.notifications.add( notification );
                  }

                  //the response.setting_validities is done in alwaysAfterSubmission @see save()

                  api.trigger( 'error', response );
                  submit_dfd.reject( response );
            } );

            request.done( function( response ) {
                  //api.consoleLog('SUBMIT REQUEST DONE ?', params.skope_id, response );
                  submit_dfd.resolve( response );
            } );

            //return the promise
            return submit_dfd.promise();
      }//submit()
});//$.extend
})( wp.customize , jQuery, _ );
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
                __main_deferred__ = $.Deferred(),
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
                              __main_deferred__.reject( r );
                        })
                        .done( function( r ) {
                              //WE NEED TO BUILD A PROPER RESPONSE HERE
                              if ( _.isEmpty( _responses_ ) ) {
                                    _responses_ = r || {};
                              } else {
                                    _responses_ = $.extend( _responses_ , r );
                              }
                              __main_deferred__.resolve( { response : _responses_, hasNewMenu : _globalHasNewMenu } );
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
                                    __main_deferred__.reject( r );
                              })
                              .done( function( r ) {
                                    self.cleanSkopeChangesetMetas().always( function() {
                                          _submitGlobal();
                                    } );
                              });
                  } else if ( params.saveGlobal && ! params.saveSkopes ) {
                          _submitGlobal();
                  } else if ( ! params.saveGlobal && params.saveSkopes ) {
                          recursiveCall()
                              .fail( function( r ) {
                                    api.consoleLog('RECURSIVE SAVE CALL FAIL', r );
                                    __main_deferred__.reject( r );
                              })
                              .done( function( r ) {
                                   //WE NEED TO BUILD A PROPER RESPONSE HERE
                                    if ( _.isEmpty( _responses_ ) ) {
                                          _responses_ = r || {};
                                    } else {
                                          _responses_ = $.extend( _responses_ , r );
                                    }

                                    // When publishing,
                                    // let's send a request to the server to clean the temporary post metas used by $wp_customize->changeset_post_id(); during the draft changeset session
                                    self.cleanSkopeChangesetMetas().always( function() {
                                          __main_deferred__.resolve( { response : _responses_, hasNewMenu : _globalHasNewMenu } );
                                    });

                              });
                  }
            }//else

            return __main_deferred__.promise();
      },//fireAllSubmissions


      //Fired when the skopes metas have been published
      cleanSkopeChangesetMetas : function() {
            var self = this,
                dfd = $.Deferred();
            //<@4.9compat>
            // => we only want to clean the temporary post metas when the changesetStatus is 'publish'.
            // Not for a saved 'draft' or a scheduled 'future'.
            if ( 'publish' != self.changesetStatus() ) {
                  return dfd.resolve().promise();
            }
            //</@4.9compat>
            var _query = $.extend(
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
var CZRSkopeSaveMths = CZRSkopeSaveMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeSaveMths, {
      //Fired when all submissions are done and the preview has been refreshed
      //@param {} skopesServerData looks like :
      //{
      //    czr_skopes : [
      //        0 : { ... skope_model_0 ... },
      //        1 : { ... skope_model_1 ... },
      //        2 : { ... skope_model_2 ... }
      //    ],
      //    isChangesetDirty : boolean
      //}
      reactWhenSaveDone : function( skopesServerData ) {
            var saved_dirties = {};
            skopesServerData = _.extend(
                {
                      czr_skopes : [],
                      isChangesetDirty : false
                },
                skopesServerData
            );

            //STORE THE SAVED DIRTIES AND RESET THEM FOR EACH SKOPE
            // store the saved dirties with their opt name ! important because we will need to match the data sent by the server, before the skope id is generated
            // (will be used as param to update the db val property of each saved skope)
            // AND THEN reset them for each skope
            _.each( api.czr_skopeCollection(), function( _skp_ ) {
                  saved_dirties[ _skp_.opt_name ] = api.czr_skopeBase.getSkopeDirties( _skp_.id );
                  api.czr_skope( _skp_.id ).dirtyValues( {} );
                  api.czr_skope( _skp_.id ).changesetValues( {} );
            });


            //ARE THE SAVED DIRTIES AND THE UPDATED DB VALUES SENT BY SERVER SYNCHRONIZED ?
            // => let's check if the server sends the same saved values
            // => reset the czr_saveDirties to default.
            var _notSyncedSettings    = [],
                _sentSkopeCollection  = skopesServerData.czr_skopes;

            //api.consoleLog('REACT WHEN SAVE DONE', saved_dirties, _sentSkopeCollection );
            console.log('REACT WHEN SAVE DONE', saved_dirties, _sentSkopeCollection );

            _.each( saved_dirties, function( skp_data, _saved_opt_name ) {
                  _.each( skp_data, function( _val, _setId ) {
                        //first, let's check if the sent skopes have not changed ( typically, if a user has opened another page in the preview )
                        if ( _.isUndefined( _.findWhere( _sentSkopeCollection, { opt_name : _saved_opt_name } ) ) )
                          return;
                        //exclude ExcludedWPBuiltinSetting and not eligible theme settings from this check
                        if ( ! api.czr_skopeBase.isSettingSkopeEligible( _setId ) )
                          return;

                        var sent_skope_db_values  = _.findWhere( _sentSkopeCollection, { opt_name : _saved_opt_name } ).db,
                            sent_skope_level      = _.findWhere( _sentSkopeCollection, { opt_name : _saved_opt_name } ).skope,
                            wpSetId               = api.CZR_Helpers.build_setId( _setId ),
                            shortSetId            = api.CZR_Helpers.getOptionName( _setId ),
                            sent_set_val          = sent_skope_db_values[wpSetId];

                        //for the global skope, the server won't send the settings for which the value has been reset to default
                        //skip this case too
                        if ( _.isUndefined( sent_set_val ) && 'global' == sent_skope_level && _val === serverControlParams.defaultOptionsValues[shortSetId] )
                          return;

                        if ( _.isUndefined( sent_set_val ) || ! _.isEqual( sent_set_val, _val ) ) {
                              _notSyncedSettings.push( { opt_name : _saved_opt_name, setId : wpSetId, server_val : sent_set_val, api_val : _val } );
                        }
                  });
            });

            if ( ! _.isEmpty( _notSyncedSettings ) ) {
                  api.consoleLog('SOME SETTINGS HAVE NOT BEEN PROPERLY SAVED : ', _notSyncedSettings );
                  console.log('_notSyncedSettings', _notSyncedSettings );
            } else {
                  api.consoleLog('ALL RIGHT, SERVER AND API ARE SYNCHRONIZED AFTER SAVE' );
            }

            //SYNCHRONIZE THE API.SETTINGS.SETTINGS WITH THE SAVED VALUE FOR GLOBAL SKOPE
            //finally make sure the api.settings.settings values are always synchronized with the global skope instance
            api.czr_skopeBase.maybeSynchronizeGlobalSkope();

            //UPDATE CURRENT SKOPE CONTROL NOTICES IN THE CURRENTLY EXPANDED SECTION
            api.czr_skopeBase.updateCtrlSkpNot( api.CZR_Helpers.getSectionControlIds() );

            //MAKE SURE TO COLLAPSE THE CONTROL NOTICES AFTER SAVED IF CURRENT SKOPE IS GLOBAL
            var _setupSectionCtrlNotices = function() {
                  var sectionCtrls = api.CZR_Helpers.getSectionControlIds( api.czr_activeSectionId() );
                  _.each( sectionCtrls, function( ctrlId ) {
                        if ( ! api.has( ctrlId ) || _.isUndefined( api.control( ctrlId ) ) )
                          return;
                        var ctrl = api.control( ctrlId );
                        if ( ! _.has( ctrl, 'czr_states' ) )
                          return;
                        ctrl.czr_states( 'noticeVisible' )( api.czr_skopeBase.isCtrlNoticeVisible( ctrlId ) );
                  });
            };
            //_.delay( _setupSectionCtrlNotices, 500 );
      }
});//$.extend
})( wp.customize , jQuery, _ );
var CZRSkopeResetMths = CZRSkopeResetMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeResetMths, {
      initialize: function() {
            var self = this;
            self.previewer = api.previewer;
            api.state.create('czr-resetting')(false);
            api.state('czr-resetting').bind( function( state ) {
                  $( document.body ).toggleClass( 'czr-resetting', false !== state );
            });
      },

      //args : {
      //  is_setting : false,
      //  is_skope : false,
      //  skope_id : '',
      //  setId : ''
      //}
      resetChangeset : function( args ) {
            var dfd = $.Deferred(),
                self = this,
                processing = api.state( 'processing' ),
                submitWhenPossible,
                submit_reset,
                request,
                requestAjaxAction,
                query_params,
                query,
                defaults = {
                      is_setting  : false,
                      is_skope    : false,
                      skope_id    : api.czr_activeSkopeId() || '',
                      setId       : ''
                };

            args = _.extend( defaults, args );
            var skope_id = args.skope_id,
                setId = args.setId;

            if( ! api.czr_isChangeSetOn() )
              return dfd.resolve().promise();

            // => will be set to false always after asynchronous request
            //skope dependant submit()
            submit_reset = function( skope_id, setId ) {
                  if ( _.isUndefined( skope_id ) ) {
                      throw new Error( 'RESET: MISSING skope_id');
                  }
                  api.state( 'czr-resetting' )( true );
                  //the skope reset query takes parameters
                  query_params = {
                        skope_id : skope_id,
                        action : 'reset'
                  };
                  query = $.extend(
                        self.previewer.query( query_params ),
                        { nonce:  self.previewer.nonce.save }
                  );

                  //Several cases here :
                  //1) single setting reset
                  //2) entire skope reset
                  if ( args.is_setting ) {
                        $.extend( query , { setting_id : setId } );
                        requestAjaxAction = 'czr_changeset_setting_reset';
                  } else if ( args.is_skope ) {
                        requestAjaxAction = 'czr_changeset_skope_reset';
                  } else {
                        return dfd.reject( 'reset_ajax_action_not_specified' ).promise();
                  }

                  wp.ajax.post( requestAjaxAction , query )
                        .always( function () {
                              api.state( 'czr-resetting' )( false );
                        })
                        .fail( function ( response ) {
                              if ( '0' === response ) {
                                  response = 'not_logged_in';
                              } else if ( '-1' === response ) {
                                // Back-compat in case any other check_ajax_referer() call is dying
                                  response = 'invalid_nonce';
                              }

                              if ( 'invalid_nonce' === response ) {
                                  self.previewer.cheatin();
                              } else if ( 'not_logged_in' === response ) {
                                    self.previewer.preview.iframe.hide();
                                    self.previewer.login().done( function() {
                                          self.resetChangeset( args );
                                          self.previewer.preview.iframe.show();
                                    } );
                              }
                              api.consoleLog( requestAjaxAction + ' failed ', query, response );
                              response = api.czr_skopeBase.buildServerResponse( response );
                              api.trigger( 'error', response );

                              api.czr_serverNotification( { message: response, status : 'error' } );
                              dfd.reject( response );
                        })
                        .done( function( response ) {
                              dfd.resolve( response );
                        });
            };//submit_reset()

            if ( 0 === processing() && false === api.state( 'czr-resetting' )() ) {
                  submit_reset( skope_id, setId );
            } else {
                  submitWhenPossible = function () {
                        if ( 0 === processing() && false === api.state( 'czr-resetting' )() ) {
                              api.state.unbind( 'change', submitWhenPossible );
                              submit_reset( skope_id, setId );
                        }
                  };
                  api.state.bind( 'change', submitWhenPossible );
            }

            return dfd.promise();
      },





      //args : {
      //  is_setting : false,
      //  is_skope : false,
      //  skope_id : '',
      //  setId : ''
      //}
      resetPublished : function( args ) {
            var dfd = $.Deferred(),
                self = this,
                processing = api.state( 'processing' ),
                submitWhenPossible,
                submit_reset,
                request,
                requestAjaxAction,
                query_params,
                query,
                defaults = {
                      is_setting  : false,
                      is_skope    : false,
                      skope_id    : api.czr_activeSkopeId() || '',
                      setId       : ''
                };

            args = _.extend( defaults, args );
            var skope_id = args.skope_id,
                setId = args.setId;

            //skope dependant submit()
            submit_reset = function( skope_id, setId ) {
                  if ( _.isUndefined( skope_id ) ) {
                      throw new Error( 'RESET: MISSING skope_id');
                  }
                  api.state( 'czr-resetting' )( true );
                  //the skope reset query takes parameters
                  query_params = {
                        skope_id : skope_id,
                        action : 'reset'
                  };
                  query = $.extend(
                        self.previewer.query( query_params ),
                        { nonce:  self.previewer.nonce.save }
                  );

                  //Several cases here :
                  //1) single setting reset
                  //2) entire skope reset
                  if ( args.is_setting ) {
                      $.extend( query , { setting_id : setId } );
                      requestAjaxAction = 'czr_published_setting_reset';
                  } else if ( args.is_skope ) {
                      requestAjaxAction = 'czr_published_skope_reset';
                  } else {
                      return dfd.reject( 'reset_ajax_action_not_specified' ).promise();
                  }

                  api.consoleLog('in czr_reset submit : ', skope_id, query );

                  wp.ajax.post( requestAjaxAction , query )
                        .always( function () {
                              api.state( 'czr-resetting' )( false );
                        })
                        .fail( function ( response ) {
                              if ( '0' === response ) {
                                  response = 'not_logged_in';
                              } else if ( '-1' === response ) {
                                // Back-compat in case any other check_ajax_referer() call is dying
                                  response = 'invalid_nonce';
                              }

                              if ( 'invalid_nonce' === response ) {
                                  self.previewer.cheatin();
                              } else if ( 'not_logged_in' === response ) {
                                    self.previewer.preview.iframe.hide();
                                    self.previewer.login().done( function() {
                                          self.resetChangeset( args );
                                          self.previewer.preview.iframe.show();
                                    } );
                              }
                              api.consoleLog( requestAjaxAction + ' failed ', query, response );
                              response = api.czr_skopeBase.buildServerResponse( response );
                              api.trigger( 'error', response );

                              api.czr_serverNotification( { message: response, status : 'error' } );
                              dfd.reject( response );
                        })
                        .done( function( response ) {
                              dfd.resolve( response );
                        });

            };//submit_reset()

            if ( 0 === processing() && false === api.state( 'czr-resetting' )() ) {
                  submit_reset( skope_id, setId );
            } else {
                  submitWhenPossible = function () {
                        if ( 0 === processing() && false === api.state( 'czr-resetting' )() ) {
                              api.state.unbind( 'change', submitWhenPossible );
                              submit_reset( skope_id, setId );
                        }
                  };
                  api.state.bind( 'change', submitWhenPossible );
            }

            return dfd.promise();
      }
});//$.extend
})( wp.customize , jQuery, _ );

var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeBaseMths, {
      //fired in skopeBase initialize
      initWidgetSidebarSpecifics : function() {
            var self = this;
            if ( ! self.isExcludedSidebarsWidgets() ) {
                api.czr_activeSkopeId.bind( function( active_skope ) {
                    self.forceSidebarDirtyRefresh( api.czr_activeSectionId(), active_skope );
                });
            }

          //WHEN A WIDGET IS ADDED
          $( document ).bind( 'widget-added', function( e, $o ) {
              if ( self.isExcludedSidebarsWidgets() )
                  return;

              var wgtIdAttr = $o.closest('.customize-control').attr('id'),
                  //get the widget id from the customize-control id attr, and remove 'customize-control-' prefix to get the proper set id
                  wdgtSetId = api.czr_skopeBase.widgetIdToSettingId( wgtIdAttr, 'customize-control-' );
              if ( ! api.has( wdgtSetId ) ) {
                  throw new Error( 'AN ADDED WIDGET COULD NOT BE BOUND IN SKOPE. ' +  wdgtSetId);
              } else {
                  self.listenAPISettings( wdgtSetId );
              }
          });
      },


      forceSidebarDirtyRefresh : function( active_section, active_skope ) {
            var self = this;
            if ( self.isExcludedSidebarsWidgets() )
              return;
            var _save_state = api.state('saved')();

            //Specific for widget sidebars section
            var _debounced = function() {
                if ( api.section.has( active_section ) && "sidebar" == api.section(active_section).params.type ) {
                    var active_skope = active_skope || api.czr_activeSkopeId(),
                        related_setting_name = 'sidebars_widgets[' + api.section(active_section).params.sidebarId + ']',
                        related_setting_val = self.getSkopeSettingVal( related_setting_name, active_skope );

                    //api( related_setting_name )( self.getSkopeSettingVal( related_setting_name, api.czr_activeSkopeId() ) );
                    api.czr_skope( active_skope ).updateSkopeDirties( related_setting_name, related_setting_val );

                    api.previewer.refresh( { the_dirties : api.czr_skope( active_skope ).dirtyValues() } )
                          .done( function() {
                                api.state('saved')( _save_state );
                          });
                }
            };
            _debounced = _.debounce( _debounced, 500 );
            _debounced();
      }
} );//$.extend
})( wp.customize , jQuery, _ );

var CZRSkopeMths = CZRSkopeMths || {};
( function ( api, $, _ ) {
//The Active state is delegated to the scope base class
$.extend( CZRSkopeMths, {
      /*****************************************************************************
      * THE SKOPE MODEL
      *****************************************************************************/
      // 'id'          => 'global',
      // 'level'       => '_all_',
      // 'dyn_type'    => 'option',
      // 'opt_name'    => HU_THEME_OPTIONS,
      // 'is_winner'   => false,
      // 'db'    => array(),
      // 'has_db_val'  => false
      // 'is_forced'  => false,
      initialize: function( skope_id, constructor_options ) {
            var skope = this;
            api.Value.prototype.initialize.call( skope, null, constructor_options );

            skope.isReady = $.Deferred();
            skope.embedded = $.Deferred();
            skope.el = 'czr-scope-' + skope_id;//@todo replace with a css selector based on the scope name

            //write the options as properties, skope_id is included
            $.extend( skope, constructor_options || {} );

            //Make it alive with various Values
            skope.visible     = new api.Value( true );
            skope.winner      = new api.Value( false ); //is this skope the one that will be applied on front end in the current context?
            skope.priority    = new api.Value(); //shall this skope always win or respect the default skopes priority
            skope.active      = new api.Value( false ); //active, inactive. Are we currently customizing this skope ?
            skope.dirtyness   = new api.Value( false ); //true or false : has this skope been customized ?
            skope.skopeResetDialogVisibility = new api.Value( false );

            //setting values are stored in :
            skope.hasDBValues = new api.Value( false );
            skope.dirtyValues = new api.Value({});//stores the current customized value.
            skope.dbValues    = new api.Value({});//stores the latest db values => will be updated on each skope synced event
            skope.changesetValues = new api.Value({});//stores the latest changeset values => will be updated on each skope synced eventsynced event

            ////////////////////////////////////////////////////
            /// MODULE DOM EVENT MAP
            ////////////////////////////////////////////////////
            skope.userEventMap = new api.Value( [
                  //skope switch
                  {
                        trigger   : 'click keydown',
                        selector  : '.czr-scope-switch, .czr-skp-switch-link',
                        name      : 'skope_switch',
                        actions   : function() {
                              api.czr_activeSkopeId( skope().id );
                        }
                  },
                  //skope reset : display warning
                  {
                        trigger   : 'click keydown',
                        selector  : '.czr-scope-reset',
                        name      : 'skope_reset_warning',
                        actions   : 'reactOnSkopeResetUserRequest'
                  }
            ]);//module.userEventMap

            //Reset actions ( deferred cb )
            skope.skopeResetDialogVisibility.bind( function( to, from ) {
                  return skope.skopeResetDialogReact( to );
            }, { deferred : true } );


            //LISTEN TO API DIRTYNESS
            //@to is {setId1 : val1, setId2 : val2, ...}
            skope.dirtyValues.callbacks.add(function() { return skope.dirtyValuesReact.apply(skope, arguments ); } );

            //LISTEN TO CHANGESET VALUES
            skope.changesetValues.callbacks.add(function() { return skope.changesetValuesReact.apply(skope, arguments ); } );

            //LISTEN TO DB VALUES
            skope.dbValues.callbacks.add(function() { return skope.dbValuesReact.apply(skope, arguments ); } );

            //UPDATE global skope collection each time a skope model is populated or updated
            skope.callbacks.add(function() { return skope.skopeReact.apply( skope, arguments ); } );

            //PREPARE THE CONSTRUCTOR OPTIONS AND SET SKOPE MODEL WITH IT
            //=> we don't need to store the db , has_db_val, and changeset properties in the model statically
            //because it will be stored as observable values
            skope.set( _.omit( constructor_options, function( _v, _key ) {
                  return _.contains( [ 'db', 'changeset', 'has_db_val' ], _key );
            } ) );





            ////////////////////////////////////////////////////
            /// SETUP SKOPE OBSERVABLE VALUES LISTENERS
            /// => skope embedded dependants
            ////////////////////////////////////////////////////
            skope.setupObservableViewValuesCallbacks();

            //Now that the values are listened to. Let's set some initial values
            skope.dirtyness( ! _.isEmpty( constructor_options.changeset ) );
            skope.hasDBValues( ! _.isEmpty( constructor_options.db ) );
            skope.winner( constructor_options.is_winner );




            ////////////////////////////////////////////////////
            /// EMBED + SETUP DOM LISTENERS
            ////////////////////////////////////////////////////
            skope.embedded
                  .fail( function() {
                        throw new Error('The container of skope ' + skope().id + ' has not been embededd');
                  })
                  .done( function() {
                        //api.consoleLog('SKOPE : '  + skope().id + ' EMBEDDED');
                        //Setup the user event listeners
                        skope.setupDOMListeners( skope.userEventMap() , { dom_el : skope.container } );

                        skope.isReady.resolve();
                  });

      },//initialize



      //this skope model is instantiated at this point.
      ready : function() {
            var skope = this;
            //WAIT FOR THE SKOPE WRAPPER TO BE EMBEDDED
            //=> The skope wrapper is embedded when api.czr_skopeReady.state() == 'resolved'
            api.czr_skopeBase.skopeWrapperEmbedded.done( function() {
                  //EMBED THE SKOPE VIEW : EMBED AND STORE THE CONTAINER
                  try {
                        $.when( skope.embedSkopeDialogBox() ).done( function( $_container ){
                              if ( false !== $_container.length ) {
                                    //paint it
                                    $_container.css('background-color', skope.color );
                                    skope.container = $_container;
                                    skope.embedded.resolve( $_container );
                              } else {
                                    skope.embedded.reject();
                              }
                        });
                  } catch( er ) {
                        api.errorLog( "In skope base : " + er );
                        skope.embedded.reject();
                  }
            });
      },




      /*****************************************************************************
      * SKOPE API DIRTIES REACTIONS
      *****************************************************************************/
      dirtyValuesReact : function( to, from ) {
            //api.consoleLog('IN DIRTY VALUES REACT', this.id, to, from );
            var skope = this;

            //set the skope() dirtyness boolean state value
            skope.dirtyness( ! _.isEmpty( to ) );
            // skope.dirtyness(
            //       ! _.isEmpty(
            //             'global' != skope().skope ?
            //             to :
            //             _.omit( to, function( _val, _id ) {
            //                   return ! api.czr_skopeBase.isThemeSetting( _id );
            //             })
            //       )
            // );

            //set the API global dirtyness
            api.czr_dirtyness( ! _.isEmpty(to) );

            //build the collection of control ids for which the dirtyness has to be reset
            var ctrlIdDirtynessToClean = [];
            _.each( from, function( _val, _id ) {
                if ( _.has( to, _id ) )
                  return;
                ctrlIdDirtynessToClean.push( _id );
            });

            //SET THE ACTIVE SKOPE CONTROLS DIRTYNESSES
            //The ctrl.czr_state value looks like :
            //{
            // hasDBVal : false,
            // isDirty : false,
            // noticeVisible : false,
            // resetVisible : false
            //}
            if ( skope().id == api.czr_activeSkopeId() ) {
                  //RESET DIRTYNESS FOR THE CLEAN SETTINGS CONTROLS IN THE ACTIVE SKOPE
                  _.each( ctrlIdDirtynessToClean , function( setId ) {
                        if ( ! _.has( api.control( setId ), 'czr_states') )
                          return;
                        api.control( setId ).czr_states( 'isDirty' )( false );
                  });
                  //Set control dirtyness for dirty settings
                  _.each( to, function( _val, _setId ) {
                        if ( ! _.has( api.control( _setId ), 'czr_states') )
                          return;
                        api.control( _setId ).czr_states( 'isDirty' )( true );
                  });
            }
      },


      /*****************************************************************************
      * SKOPE API CHANGESET REACTIONS
      *****************************************************************************/
      changesetValuesReact : function( to, from ) {
            var skope = this,
                _currentServerDirties = $.extend( true, {}, skope.dirtyValues() );
            skope.dirtyValues( $.extend( _currentServerDirties, to ) );
      },


      /*****************************************************************************
      * SKOPE DB VALUES REACTIONS
      *****************************************************************************/
      dbValuesReact : function( to, from ) {
            var skope = this;

            //set the skope() db dirtyness boolean state value
            skope.hasDBValues(
                  ! _.isEmpty(
                        'global' != skope().skope ?
                        to :
                        _.omit( to, function( _val, _id ) {
                              return ! api.czr_skopeBase.isThemeSetting( _id );
                        })
                  )
            );

            //RESET DIRTYNESS FOR THE CONTROLS IN THE ACTIVE SKOPE
            //=> make sure this is set for the active skopes only
            var ctrlIdDbToReset = [];
            _.each( from, function( _val, _id ) {
                if ( _.has( to, _id ) )
                  return;
                ctrlIdDbToReset.push( _id );
            });
            //The ctrl.czr_state value looks like :
            //{
            // hasDBVal : false,
            // isDirty : false,
            // noticeVisible : false,
            // resetVisible : false
            //}
            if ( skope().id == api.czr_activeSkopeId() ) {
                  _.each( ctrlIdDbToReset , function( setId ) {
                        if ( ! _.has( api.control( setId ), 'czr_states') )
                          return;
                        api.control( setId ).czr_states( 'hasDBVal' )( false );
                  });
                  //Set control db dirtyness for settings with a db value
                  _.each( to, function( _val, _setId ) {
                        if ( ! _.has( api.control( _setId ), 'czr_states') )
                          return;

                        api.control( _setId ).czr_states( 'hasDBVal' )( true );
                  });
            }
      },


      /*****************************************************************************
      * SKOPE MODEL CHANGES CALLBACKS
      *****************************************************************************/
      //cb of skope.callbacks
      skopeReact : function( to, from ) {
            var skope = this,
                _current_collection = [],
                _new_collection = [];

            //INFORM COLLECTION
            //populate case
            if ( ! api.czr_skopeBase.isSkopeRegisteredInCollection( to.id ) ) {
                  //Add this new skope to the global skope collection
                  _current_collection = $.extend( true, [], api.czr_skopeCollection() );
                  _current_collection.push( to );
                  api.czr_skopeCollection( _current_collection );
            }
            //update case
            else {
                  //Add this new skope to the global skope collection
                  _current_collection = $.extend( true, [], api.czr_skopeCollection() );
                  _new_collection = _current_collection;
                  //update the collection with the current new skope model
                  _.each( _current_collection, function( _skope, _key ) {
                      if ( _skope.id != skope().id )
                        return;
                      _new_collection[_key] = to;
                  });
                  api.czr_skopeCollection( _new_collection );
            }
      },








      /*****************************************************************************
      * VALUES CALLBACKS WHEN SKOPE EMBEDDED AND READY
      * => The skope container exists at this stage
      *****************************************************************************/
      //@fired in initiliaze
      setupObservableViewValuesCallbacks : function() {
            var skope = this;
            //hide when this skope is not in the current skopes list
            skope.visible.bind( function( is_visible ){
                  if ( 'pending' == skope.embedded.state() ) {
                        skope.embedded.done( function() {
                              skope.container.toggle( is_visible );
                        });
                  } else {
                        skope.container.toggle( is_visible );
                  }

            });

            //How does the view react to model changes ?
            //When active :
            //1) add a green point to the view box
            //2) disable the switch-to icon
            skope.active.bind( function() {
                  if ( 'pending' == skope.embedded.state() ) {
                        skope.embedded.done( function() {
                              skope.activeStateReact.apply( skope, arguments );
                        });
                  } else {
                        skope.activeStateReact.apply( skope, arguments );
                  }
            });

            skope.dirtyness.bind( function() {
                  if ( 'pending' == skope.embedded.state() ) {
                        skope.embedded.done( function() {
                              skope.dirtynessReact.apply( skope, arguments );
                        });
                  } else {
                        skope.dirtynessReact.apply( skope, arguments );
                  }
            });

            skope.hasDBValues.bind( function() {
                  if ( 'pending' == skope.embedded.state() ) {
                        skope.embedded.done( function() {
                              skope.hasDBValuesReact.apply( skope, arguments );
                        });
                  } else {
                        skope.hasDBValuesReact.apply( skope, arguments );
                  }
            });

            skope.winner.bind( function() {
                  if ( 'pending' == skope.embedded.state() ) {
                        skope.embedded.done( function() {
                              skope.winnerReact.apply( skope, arguments );
                        });
                  } else {
                        skope.winnerReact.apply( skope, arguments );
                  }
            });
      },//setupObservableViewValuesCallbacks

      //cb of skope.active.callbacks
      activeStateReact : function( to, from ){
            var skope = this;
            skope.container.toggleClass('inactive', ! to ).toggleClass( 'active', to );
            //api.consoleLog('in the view : listen for scope state change', this.name, to, from );
            $('.czr-scope-switch', skope.container).toggleClass('fa-toggle-on', to).toggleClass('fa-toggle-off', !to);
      },

      //cb of skope.dirtyness.callbacks
      dirtynessReact : function( to, from ) {
            var skope = this;
            $.when( this.container.toggleClass( 'dirty', to ) ).done( function() {
                if ( to )
                  $( '.czr-scope-reset', skope.container).fadeIn('slow').attr('title', [ serverControlParams.i18n.skope['Reset the current customizations for'], skope().title ].join(' ') );
                else if ( ! skope.hasDBValues() )
                  $( '.czr-scope-reset', skope.container).fadeOut('fast');
            });
      },

      //cb of skope.hasDBValues.callbacks
      hasDBValuesReact : function( to, from ) {
            var skope = this;
            $.when( skope.container.toggleClass('has-db-val', to ) ).done( function() {
                if ( to ) {
                      $( '.czr-scope-reset', skope.container)
                            .fadeIn( 'slow')
                            .attr( 'title', [
                                  'global' == skope().skope ? serverControlParams.i18n.skope['Reset the theme options published sitewide'] : serverControlParams.i18n.skope['Reset your website published options for'],
                                  'global' == skope().skope ? '' : skope().title
                            ].join(' ') );
                }
                else if ( ! skope.dirtyness() ) {
                      $( '.czr-scope-reset', skope.container ).fadeOut('fast');
                }
            });
      },

      //cb of skope.winner.callbacks
      winnerReact : function( is_winner ) {
            var skope = this;
            this.container.toggleClass('is_winner', is_winner );

            if ( is_winner ) {
                  //make sure there's only one winner in the current skope collection
                  _.each( api.czr_currentSkopesCollection(), function( _skope ) {
                        if ( _skope.id == skope().id )
                          return;
                        var _current_model = $.extend( true, {}, _skope );
                        $.extend( _current_model, { is_winner : false } );
                        api.czr_skope( _skope.id )( _current_model );
                  });
            }
      },




      /*****************************************************************************
      * HELPERS
      *****************************************************************************/
      //this method updates a given skope instance dirty values
      //and returns the dirty values object
      //fired on api setting change and in the ajax query
      updateSkopeDirties : function( setId, new_val ) {
            var skope = this,
                shortSetId = api.CZR_Helpers.getOptionName( setId );

            //for the settings that are excluded from skope, the skope is always the global one
            if ( ! api.czr_skopeBase.isSettingSkopeEligible( setId ) && 'global' != skope().skope )
              return api.czr_skope( api.czr_skopeBase.getGlobalSkopeId() ).updateSkopeDirties( setId, new_val );

            var current_dirties = $.extend( true, {}, skope.dirtyValues() ),
                _dirtyCustomized = {};

            _dirtyCustomized[ setId ] = new_val;
            skope.dirtyValues.set( $.extend( current_dirties , _dirtyCustomized ) );
            return skope.dirtyValues();
      },



      //@return the boolean dirtyness state of a given setId for a given skope
      getSkopeSettingDirtyness : function( setId ) {
            var skope = this;
            return skope.getSkopeSettingAPIDirtyness( setId ) || skope.getSkopeSettingChangesetDirtyness( setId );
      },

      //Has this skope already be customized in the API ?
      getSkopeSettingAPIDirtyness : function( setId ) {
            var skope = this;
            return _.has( skope.dirtyValues(), api.CZR_Helpers.build_setId( setId ) );
      },

      //Has this skope already be customized in the API ?
      getSkopeSettingChangesetDirtyness : function( setId ) {
            var skope = this;
            if ( ! api.czr_isChangeSetOn() )
              return skope.getSkopeSettingAPIDirtyness( setId );
            return _.has( skope.changesetValues(), api.CZR_Helpers.build_setId( setId ) );
      },

      //@return boolean
      hasSkopeSettingDBValues : function( setId ) {
            var skope = this,
                _setId = api.CZR_Helpers.build_setId(setId);

            return ! _.isUndefined( api.czr_skope( api.czr_activeSkopeId() ).dbValues()[_setId] );
      }
});//$.extend(
})( wp.customize , jQuery, _ );
var CZRSkopeMths = CZRSkopeMths || {};
( function ( api, $, _ ) {
$.extend( CZRSkopeMths, {
      embedSkopeDialogBox : function() {
            var skope = this,
                skope_model = $.extend( true, {}, skope() ),
                _tmpl = '';

            //@todo will need to be refreshed on scopes change in the future
            if ( ! $('#customize-header-actions').find('.czr-scope-switcher').length ) {
                throw new Error('The skope switcher wrapper is not printed, the skope can not be embedded.');
            }
            try {
                  _tmpl =  wp.template('czr-skope')( _.extend( skope_model, { el : skope.el } ) );
            } catch( er ) {
                  api.errorLog( 'Error when parsing the template of a skope' + er );
                  return false;
            }

            $('.czr-skopes-wrapper', '#customize-header-actions').append( $( _tmpl ) );
            return $( '.' + skope.el , '.czr-skopes-wrapper' );
      },




      // setSkopeSwitcherButtonActive : function( dyn_type ) {
      //       $('.button', '.czr-scope-switcher').each( function( ind ) {
      //         $(this).toggleClass( 'active', dyn_type == $(this).attr('data-dyn-type') );
      //       });
      // },



      /*****************************************************************************
      * RESET
      *****************************************************************************/
      renderResetWarningTmpl : function() {
            var skope = this,
                skope_model = $.extend( true, {}, skope() ),
                _tmpl = '',
                warning_message,
                success_message;

            if ( skope.dirtyness() ) {
                  warning_message = [
                        serverControlParams.i18n.skope['Please confirm that you want to reset your current ( not published ) customizations for'],
                        skope().ctx_title
                  ].join(' ');
                  success_message = [
                        serverControlParams.i18n.skope['Your customizations have been reset for'],
                        skope().ctx_title
                  ].join(' ');
            } else {
                  warning_message = [
                        'global' == skope().skope ? serverControlParams.i18n.skope['Please confirm that you want to reset your sitewide published customizations. Note : this will not reset the customizations made in other option scopes'] : serverControlParams.i18n.skope['Please confirm that you want to reset your published customizations for'],
                        'global' == skope().skope ? '' : skope().ctx_title
                  ].join(' ');
                  success_message = [
                        serverControlParams.i18n.skope['Your published customizations have been reset for'],
                        skope().title
                  ].join(' ');
            }

            try {
                  _tmpl =  wp.template( 'czr-skope-pane' )(
                        _.extend( skope_model, {
                              el : skope.el,
                              warning_message : warning_message + '.',
                              success_message : success_message + '.'
                        } )
                  );
            } catch( er ) {
                  api.errorLog( 'Error when parsing the the reset skope template : ' + er );
                  return false;
            }

            $('#customize-preview').after( $( _tmpl ) );

            return $( '#czr-skope-pane' );
      },




      /*****************************************************************************
      * HELPERS
      *****************************************************************************/
      getEl : function() {
            var skope = this;
            return $( skope.el, '#customize-header-actions');
      }
});//$.extend()
})( wp.customize , jQuery, _ );

var CZRSkopeMths = CZRSkopeMths || {};
( function ( api, $, _ ) {
//The Active state is delegated to the skope base class
$.extend( CZRSkopeMths, {
      /*****************************************************************************
      * RESET
      *****************************************************************************/
      //Fired when on user click on ".czr-scope-reset", defined in skope model init
      //Handles several scenarios :
      //1) a reset ajax request (save, changeset, reset) can be currently processed, we need to wait for completion
      //2) another skope reset dialog panel might be already opened
      reactOnSkopeResetUserRequest : function() {
            var skope = this,
                _fireReaction = function() {
                      api.state( 'czr-resetting')( true );
                      if ( api.czr_activeSkopeId() != skope().id ) {
                            api.czr_activeSkopeId( skope().id )
                                  .done( function() {
                                        skope.skopeResetDialogVisibility( ! skope.skopeResetDialogVisibility() ).done( function() {
                                              api.state( 'czr-resetting')( false );
                                        });

                                  });
                      } else {
                            skope.skopeResetDialogVisibility( ! skope.skopeResetDialogVisibility() ).done( function() {
                                  api.state( 'czr-resetting')( false );
                            });
                      }
                };

            //Bail if other process currenty running
            if ( ( api.state( 'czr-resetting')() || 0 !== api.state( 'processing' )() ) ) {
                    api.czr_serverNotification( {
                          message: 'Slow down, you move too fast !',
                          status : 'success',
                          auto_collapse : true
                    });
                    return;
            }
            //Close the current panel if a reset for a different skope is requested
            if ( api.czr_activeSkopeId() != skope().id && api.czr_skope( api.czr_activeSkopeId() ).skopeResetDialogVisibility() ) {
                  api.czr_skope( api.czr_activeSkopeId() ).skopeResetDialogVisibility( false ).done( function() {
                        _fireReaction();
                  });
            } else {
                  _fireReaction();
            }
      },









      //cb of skope.skopeResetDialogVisibility.callbacks
      //Setup user DOM events listeners
      //Render the dialog box
      skopeResetDialogReact : function( visible ) {
            var skope = this, dfd = $.Deferred();
            //Are we currently performing a reset or any other processing task ? (reset setting or skope, saving )
            //=> if so, let's defer the current action when its possible
            // if ( api.state( 'czr-resetting')() || 0 !== api.state( 'processing' )() ) {
            //         var reactWhenPossible = function () {
            //               if ( 0 === api.state( 'processing' )() && false === api.state( 'czr-resetting' )() ) {
            //                     api.state.unbind( 'change', reactWhenPossible );
            //                     skope.skopeResetDialogReact( visible );
            //               }
            //         };
            //         api.state.bind( 'change', reactWhenPossible );
            //         return dfd.resolve().promise();
            // }

            //Event Map for the Reset Panel
            skope.userResetEventMap = skope.userResetEventMap || new api.Value( [
                  //skope reset : display warning
                  {
                        trigger   : 'click keydown',
                        selector  : '.czr-scope-reset-cancel',
                        name      : 'skope_reset_cancel',
                        actions   : function() {
                            skope.skopeResetDialogVisibility( ! skope.skopeResetDialogVisibility() );
                        }
                  },
                  //skope reset : do reset
                  {
                        trigger   : 'click keydown',
                        selector  : '.czr-scope-do-reset',
                        name      : 'skope_do_reset',
                        actions   : 'doResetSkopeValues'
                  }
              ]
            );

            if ( visible ) {
                  //inform the api that we are resetting
                  //=> some actions have to be frozen in this state
                  //like for example, resetting another skope
                  api.czr_isResettingSkope( skope().id );

                  //render reset warning template
                  $.when( skope.renderResetWarningTmpl() ).done( function( $_container ) {
                        skope.resetPanel = $_container;
                        //add the reset type class
                        skope.resetPanel.addClass( skope.dirtyness() ? 'dirty-reset' : 'db-reset' );
                        skope.setupDOMListeners( skope.userResetEventMap() , { dom_el : skope.resetPanel } );
                        //$('body').addClass('czr-skope-pane-open');
                  }).then( function() {
                        setTimeout( function() {
                              //set height
                              var _height = $('#customize-preview').height();
                              skope.resetPanel.css( 'line-height', _height +'px' ).css( 'height', _height + 'px' );
                              //display
                              $('body').addClass('czr-skope-pane-open');
                        }, 50 );
                  });
            } else {
                  $.when( $('body').removeClass('czr-skope-pane-open') ).done( function() {
                        if ( _.has( skope, 'resetPanel') && false !== skope.resetPanel.length ) {
                              setTimeout( function() {
                                    skope.resetPanel.remove();
                                    api.czr_isResettingSkope( false );
                              }, 300 );
                        }
                  });
            }

            //wait for panel sliding action before resolving
            _.delay( function() { dfd.resolve(); }, 350 );

            return dfd.promise();
      },



      //fired on user click
      //Is used for both resetting customized and db values, depending on the skope customization state
      doResetSkopeValues : function() {
            var skope = this,
                skope_id = skope().id,
                reset_method = skope.dirtyness() ? '_resetSkopeDirties' : '_resetSkopeAPIValues',
                _updateAPI = function() {
                      var _silentUpdate = function() {
                            api.czr_skopeBase.processSilentUpdates( { refresh : false } )
                                  .fail( function() { api.consoleLog( 'Silent update failed after resetting skope : ' + skope_id ); } )
                                  .done( function() {
                                        $.when( $('.czr-reset-warning', skope.resetPanel ).fadeOut('300') ).done( function() {
                                              $.when( $('.czr-reset-success', skope.resetPanel ).fadeIn('300') ).done( function() {
                                                    _.delay( function() {
                                                          api.czr_isResettingSkope( false );
                                                          skope.skopeResetDialogVisibility( false );
                                                    }, 2000 );
                                              });
                                        });
                                  });
                      };

                      skope[reset_method]()
                            .done( function() {
                                  //api.previewer.refresh() method is resolved with an object looking like :
                                  //{
                                  //    previewer : api.previewer,
                                  //    skopesServerData : {
                                  //        czr_skopes : _wpCustomizeSettings.czr_skopes || [],
                                  //        isChangesetDirty : boolean
                                  //    },
                                  // }
                                  api.previewer.refresh()
                                        .fail( function( refresh_data ) {
                                              api.consoleLog('SKOPE RESET REFRESH FAILED', refresh_data );
                                        })
                                        .done( function( refresh_data ) {
                                              if ( 'global' == api.czr_skope( skope_id )().skope && '_resetSkopeAPIValues' == reset_method ) {
                                                    var _sentSkopeCollection,
                                                        _serverGlobalDbValues = {},
                                                        _skope_opt_name = api.czr_skope( skope_id )().opt_name;

                                                    if ( ! _.isUndefined( refresh_data.skopesServerData ) && _.has( refresh_data.skopesServerData, 'czr_skopes' ) ) {
                                                          _sentSkopeCollection = refresh_data.skopesServerData.czr_skopes;
                                                          if ( _.isUndefined( _.findWhere( _sentSkopeCollection, { opt_name : _skope_opt_name } ) ) ) {
                                                                _serverGlobalDbValues = _.findWhere( _sentSkopeCollection, { opt_name : _skope_opt_name } ).db || {};
                                                          }
                                                    }
                                                    api.czr_skopeBase.maybeSynchronizeGlobalSkope( { isGlobalReset : true, isSkope : true, skopeIdToReset : skope_id } )
                                                          .done( function() {
                                                                _silentUpdate();
                                                          });
                                              } else {
                                                    _silentUpdate();
                                              }
                                        });

                            });
                };//_updateAPI

            $('body').addClass('czr-resetting-skope');
            //$('.czr-reset-warning', skope.resetPanel ).hide();

            //When resetting the db value, wait for the ajax promise to be done before reseting the api values.
            api.czr_skopeReset[ skope.dirtyness() ? 'resetChangeset' : 'resetPublished' ](
                        { skope_id : skope().id, is_skope : true } )
                        .always( function() {
                              $('body').removeClass('czr-resetting-skope');//hides the spinner
                        })
                        .done( function( r ) {
                              _updateAPI();
                        })
                        .fail( function( r ) {
                                skope.skopeResetDialogVisibility( false );
                                api.consoleLog('Skope reset failed', r );
                        });
      },


      //fired in doResetSkopeValues
      //@uses The ctrl.czr_states values
      _resetSkopeDirties : function() {
            var skope = this, dfd = $.Deferred();
            skope.dirtyValues({});
            skope.changesetValues({});
            return dfd.resolve().promise();
      },

      //fired in doResetSkopeValues
      //@uses The ctrl.czr_states values
      _resetSkopeAPIValues : function() {
            var skope = this, dfd = $.Deferred();
            //update the skope model db property
            skope.dbValues( {} );
            return dfd.resolve().promise();
      }
});//$.extend(
})( wp.customize , jQuery, _ );
( function ( api, $, _ ) {

      //SKOPE
      $.extend( CZRSkopeBaseMths, api.Events );
      $.extend( CZRSkopeMths, api.Events );
      $.extend( CZRSkopeMths, api.CZR_Helpers );
      api.CZR_skopeBase             = api.Class.extend( CZRSkopeBaseMths );
      api.CZR_skopeSave             = api.Class.extend( CZRSkopeSaveMths );
      api.CZR_skopeReset            = api.Class.extend( CZRSkopeResetMths );
      api.CZR_skope                 = api.Value.extend( CZRSkopeMths ); //=> used as constructor when creating the collection of skopes

      //Skope related :
      //=> Special case for the header image
      //Capture objects before they are overridden by WP.
      //=> needed when regenerating the header_image control.
      if ( _.has(api, 'HeaderTool') ) {
            api.czr_HeaderTool = $.extend(  true, {}, api.HeaderTool );
      }

})( wp.customize, jQuery, _ );