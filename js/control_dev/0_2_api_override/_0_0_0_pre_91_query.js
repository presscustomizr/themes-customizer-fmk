
(function (api, $, _) {

  /*****************************************************************************
  * A SKOPE AWARE PREVIEWER QUERY
  *****************************************************************************/
  //PREPARE THE SKOPE AWARE PREVIEWER
  if ( serverControlParams.isSkopOn ) {
        //this deferred is used to make sure the overriden api.previewer.query method has been taken into account
        api.czr_isPreviewerSkopeAware = $.Deferred();

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
        //@query_params = {
        //    skope_id : string,
        //    action : string,
        //    the_dirties : {},
        //    dyn_type : string,
        //    opt_name : string
        // }
        api.previewer.query =  function( query_params ) {
            query_params = query_params || {};



            //IS SKOP ON
            //falls back to WP core treatment if skope is not on or if the requested skope is not registered
            if ( ! _.has( api, 'czr_skope') ) {
                api.consoleLog('QUERY : SKOPE IS NOT ON. FALLING BACK ON CORE QUERY');
                return _old_previewer_query.apply( this );
            }

            //HAS THE FIRST SKOPE COLLECTION BEEN POPULATED ?
            if ( 'pending' == api.czr_skopeBase.initialSkopeCollectionPopulated.state() ) {
                api.consoleLog('QUERY : INITIAL SKOPE COLLECTION NOT POPULATED YET. FALLING BACK ON CORE QUERY');
                return _old_previewer_query.apply( this );
            }

            //the previewer is now skope aware
            if ( 'pending' == api.czr_isPreviewerSkopeAware.state() ) {
                api.czr_isPreviewerSkopeAware.resolve();
                //return _old_previewer_query.apply( this );
            }

            if ( ! _.isObject( query_params ) ) {
                api.consoleLog('QUERY PARAMS : ', query_params );
                throw new Error( 'QUERY PARAMS MUST BE AN OBJECT.' );
            }

            //IS THE SKOPE ID PROVIDED ?
            //When navigating in the preview, the skope_id might not be provided.
            //In this case, falls back on the activeSkope() or the global skope
            //skope_id = skope_id || api.czr_activeSkope() || api.czr_skopeBase.getGlobalSkopeId();
            if ( _.isUndefined( query_params.skope_id ) || ! _.isString( query_params.skope_id ) ) {
                query_params.skope_id = api.czr_activeSkope() || api.czr_skopeBase.getGlobalSkopeId();
            }
            console.log('IN QUERY!', query_params );

            var dirtyCustomized = {},
                default_params = {
                  skope_id : null,
                  action : null,
                  the_dirties : {},
                  dyn_type : null,
                  opt_name : null
                },
                _defaults = $.extend( true, {}, default_params );

            query_params = $.extend( _defaults, query_params );

            //ARE THE DIRTIES WELL FORMED OR NOT EMPTY ?
            if ( ! _.isObject( query_params.the_dirties ) ) {
                api.consoleLog('QUERY PARAMS : ', query_params );
                throw new Error( 'QUERY DIRTIES MUST BE AN OBJECT. Requested action : ' + query_params.action );
            }

            ///TO CHANGE ?
            if ( 'pending' != api.czr_isPreviewerSkopeAware.state() && _.isNull( query_params.skope_id ) ) {
                api.consoleLog('QUERY PARAMS : ', query_params );
                //api.consoleLog( 'OVERRIDEN QUERY : NO SKOPE ID. FALLING BACK ON CORE QUERY.' );
                throw new Error( 'OVERRIDEN QUERY : NO SKOPE ID. FALLING BACK ON CORE QUERY. Requested action : ' + query_params.action );
                //return _old_previewer_query.apply( this );
            }

            //IS THE REQUESTED ACTION AUTHORIZED ?
            if ( ! _.contains( [ null, 'refresh', 'save', 'reset' ], query_params.action ) ) {
                api.consoleLog('QUERY PARAMS : ', query_params );
                throw new Error( 'A REQUESTED QUERY HAS NO AUTHORIZED ACTION. Requested action : ' + query_params.action );
            }

            ///BUILD THE DIRTIES
            ///SET THE DYN TYPE FOR A SAVE ACTION
            //on first load OR if the current skope is the customized one, build the dirtyCustomized the regular way : typically a refresh after setting change
            //otherwise, get the dirties from the requested skope instance : typically a save action on several skopes
            switch( query_params.action ) {
                case null :
                case 'refresh' :
                    if ( _.isNull( query_params.the_dirties ) || _.isEmpty( query_params.the_dirties ) ) {
                        //build the dirties the regular way
                        api.each( function ( value, key ) {
                            if ( value._dirty ) {
                              dirtyCustomized[ key ] = value();
                            }
                        } );
                    } else {
                        dirtyCustomized = query_params.the_dirties;
                    }
                    //INHERITANCE : FILTER THE DIRTIES
                    //when refreshing the preview, we need to apply the skope inheritance to the customized values
                    dirtyCustomized = api.czr_skopeBase.applyDirtyCustomizedInheritance( dirtyCustomized, query_params.skope_id );

                break;

                case 'save' :
                    if ( _.isEmpty( query_params.the_dirties ) ) {
                      throw new Error( 'QUERY : A SAVE QUERY MUST HAVE A NOT EMPTY DIRTY OBJECT TO SUBMIT' );
                    }
                    //Set the Dyn type
                    //the dyn type might be passed as a param to the query in some cases
                    //typically to save skope excluded settings. In this case the dyn_type is set to false, to fall back on the default wp one : theme_mod or option
                    if ( _.isNull( query_params.dyn_type ) )
                      query_params.dyn_type = api.czr_skope( query_params.skope_id )().dyn_type;//post_meta, term_meta, user_meta, trans, option
                    if ( _.isNull( query_params.dyn_type ) || _.isUndefined( query_params.dyn_type ) ) {
                      throw new Error( 'QUERY : A SAVE QUERY MUST HAVE A VALID DYN TYPE.' + query_params.skope_id );
                    }
                    //Set the dirties  || api.czr_skopeBase.getSkopeDirties(skope_id) ?
                    dirtyCustomized = query_params.the_dirties; //was : api.czr_skope( skope_id ).dirtyValues();
                break;

                case 'reset' :
                    //no specific treatment for reset
                    if ( _.isNull( query_params.dyn_type ) )
                      query_params.dyn_type = api.czr_skope( query_params.skope_id )().dyn_type;//post_meta, term_meta, user_meta, trans, option
                    if ( _.isNull( query_params.dyn_type ) || _.isUndefined( query_params.dyn_type ) ) {
                      throw new Error( 'QUERY : A RESET QUERY MUST HAVE A VALID DYN TYPE.' + query_params.skope_id );
                    }
                break;
            }

            // api.consoleLog('DIRTY VALUES TO SUBMIT ? ', dirtyCustomized, api.czr_skopeBase.getSkopeDirties(skope_id) );
            // api.consoleLog('api.czr_skope( skope_id )().skope', api.czr_skope( skope_id )().skope );
            return {
                wp_customize: 'on',
                skope :       api.czr_skope( query_params.skope_id )().skope,
                dyn_type:     query_params.dyn_type,
                opt_name:     ! _.isNull( query_params.opt_name ) ? query_params.opt_name : api.czr_skope( query_params.skope_id )().opt_name,
                obj_id:       api.czr_skope( query_params.skope_id )().obj_id,
                theme:        _wpCustomizeSettings.theme.stylesheet,
                customized:   JSON.stringify( dirtyCustomized ),
                nonce:        this.nonce.preview
            };
        };
  });//api.bind('ready')

})( wp.customize , jQuery, _ );