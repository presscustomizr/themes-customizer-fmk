
(function (api, $, _) {

  /*****************************************************************************
  * A SKOPE AWARE PREVIEWER QUERY
  *****************************************************************************/
  //PREPARE THE SKOPE AWARE PREVIEWER
  if ( serverControlParams.isSkopOn ) {
        var _old_preview = api.Setting.prototype.preview;
        api.Setting.prototype.preview = function( to, from , o) {
            if ( 'pending' == api.czr_isPreviewerSkopeAware.state() )
              return this.previewer.refresh();
            //as soon as the previewer is setup, let's behave as usual
            //=> but don't refresh when silently updating
            if ( ! _.has(o, 'silent') || false === o.silent ) {
                _old_preview.call(this);
            }
        };
  }


  api.bind('ready', function() {
        if ( ! serverControlParams.isSkopOn )
          return;

        /**
        * Build the query to send along with the Preview request.
        *
        * @return {object}
        */
        var _old_previewer_query = api.previewer.query;


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
              //IS SKOP ON
              //falls back to WP core treatment if skope is not on or if the requested skope is not registered
              if ( ! _.has( api, 'czr_skope') ) {
                    api.consoleLog('QUERY : SKOPE IS NOT ON. FALLING BACK ON CORE QUERY');
                    return _old_previewer_query.apply( this );
              }

              //HAS THE FIRST SKOPE COLLECTION BEEN POPULATED ?
              if ( 'pending' == api.czr_initialSkopeCollectionPopulated.state() ) {
                    api.consoleLog('QUERY : INITIAL SKOPE COLLECTION NOT POPULATED YET. FALLING BACK ON CORE QUERY');
                    return _old_previewer_query.apply( this );
              }

              //the previewer is now skope aware
              if ( 'pending' == api.czr_isPreviewerSkopeAware.state() ) {
                    api.czr_isPreviewerSkopeAware.resolve();
                    //return _old_previewer_query.apply( this );
              }

              if ( ! _.isObject( queryVars ) ) {
                    api.consoleLog('QUERY VARS : ', queryVars );
                    throw new Error( 'QUERY VARS MUST BE AN OBJECT.' );
              }

              //IS THE SKOPE ID PROVIDED ?
              //When navigating in the preview, the skope_id might not be provided.
              //In this case, falls back on the activeSkope() or the global skope
              //skope_id = skope_id || api.czr_activeSkope() || api.czr_skopeBase.getGlobalSkopeId();
              if ( _.isUndefined( queryVars.skope_id ) || ! _.isString( queryVars.skope_id ) ) {
                    queryVars.skope_id = api.czr_activeSkope() || api.czr_skopeBase.getGlobalSkopeId();
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
                    //return _old_previewer_query.apply( this );
              }

              //IS THE REQUESTED ACTION AUTHORIZED ?
              if ( ! _.contains( [ null, 'refresh', 'save', 'reset', 'changeset_update' ], queryVars.action ) ) {
                    api.consoleLog('QUERY PARAMS : ', queryVars );
                    throw new Error( 'A REQUESTED QUERY HAS NO AUTHORIZED ACTION. Requested action : ' + queryVars.action );
              }


              //console.log('IN QUERY!', queryVars, queryVars.action );

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
                      skopeCustomized[ api.czr_activeSkope() ] = queryVars.the_dirties;
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

                          globalCustomized = api.czr_skopeBase.applyDirtyCustomizedInheritance( globalCustomized, api.czr_skopeBase.getGlobalSkopeId() );
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
                          globalCustomized = queryVars.the_dirties; //was : api.czr_skope( skope_id ).dirtyValues();
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
                    skope_id:         queryVars.skope_id,
                    dyn_type:         queryVars.dyn_type,
                    opt_name:         ! _.isNull( queryVars.opt_name ) ? queryVars.opt_name : api.czr_skope( queryVars.skope_id )().opt_name,
                    obj_id:           api.czr_skope( queryVars.skope_id )().obj_id,
                    current_skopes:   JSON.stringify( _current_skopes ) || {}
              };

              //since 4.7
              if ( api.czr_isChangedSetOn() ) {
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
              //api.consoleLog('QUERY VARS ?', _to_return );
              return _to_return;

        };//api.previewer.query
  });//api.bind('ready')

})( wp.customize , jQuery, _ );