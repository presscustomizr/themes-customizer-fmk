
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
        api.previewer.query =  function( skope_id, action, the_dirties, dyn_type ) {
            var dirtyCustomized = {};

            ///TO CHANGE !!!!!
            if ( _.isUndefined(skope_id) ) {
              console.log( 'OVERRIDEN QUERY : NO SKOPE ID !!' );
              return _old_previewer_query.apply( this );
            }
            ///TO CHANGE !!!!

            skope_id = skope_id || api.czr_activeSkope() || api.czr_skopeBase.getGlobalSkopeId();
            //IS SKOP ON OR IS THIS SKOPE REGISTERED ?
            //falls back to WP core treatment if skope is not on or if the requested skope is not registered
            if ( ! _.has( api, 'czr_skope') || ! api.czr_skope.has( skope_id ) ) {
              console.log('OVERRIDEN QUERY : SKOPE IS NOT REGISTERED. FALLING BACK ON THE OLD PREVIEWER QUERY');
              return _old_previewer_query.apply( this );
            }

            if ( _.isUndefined(action) ) {
              console.log('OVERRIDEN QUERY :No action defined in api.previewer.query.');
            }

            console.log('!!!OVERRIDEN QUERY SKOPE ACTION DIRTIES!!!',skope_id, action, the_dirties);

            /// BUILD THE DIRTIES ///
            //on first load OR if the current skope is the customized one, build the dirtyCustomized the regular way : typically a refresh after setting change
            //otherwise, get the dirties from the requested skope instance : typically a save action on several skopes
            if ( 'refresh' == action || _.isUndefined(action) ) {
                api.each( function ( value, key ) {
                  if ( value._dirty ) {
                    dirtyCustomized[ key ] = value();
                  }
                } );
            } else {
                //do we have dirties ?
                if ( _.isUndefined(the_dirties) ) {
                  throw new Error( 'OVERRIDEN QUERY : NO DIRTIES ! THERE SHOULD BE DIRTIES FOR THIS ACTION : ' + action );
                }
                dirtyCustomized = the_dirties || api.czr_skopeBase.getSkopeDirties(skope_id);//api.czr_skope( skope_id ).dirtyValues();
            }
            console.log('OVERRIDEN QUERY : api.czr_skopeBase.getSkopeDirties(skope_id)', api.czr_skopeBase.getSkopeDirties(skope_id) );


            //INHERITANCE : FILTER THE DIRTIES
            //when previewing, we need to apply the skope inheritance to the customized values
            if ( 'refresh' == action ) {
                dirtyCustomized = api.czr_skopeBase.applyDirtyCustomizedInheritance( dirtyCustomized, skope_id );
            }

            //the previewer is now skope aware
            api.czr_isPreviewerSkopeAware.resolve();

            // api.consoleLog('DIRTY VALUES TO SUBMIT ? ', dirtyCustomized, api.czr_skopeBase.getSkopeDirties(skope_id) );
            // api.consoleLog('api.czr_skope( skope_id )().skope', api.czr_skope( skope_id )().skope );
            return {
                wp_customize: 'on',
                skope :       api.czr_skope( skope_id )().skope,
                //the dyn type might be passed as a param to the query in some cases
                //typically to save skope excluded settings. In this case the dyn_type is set to false, to fall back on the default wp one : theme_mod or option
                dyn_type:     dyn_type || api.czr_skope( skope_id )().dyn_type,//post_meta, term_meta, user_meta, trans, option
                opt_name:     api.czr_skope( skope_id )().opt_name,
                obj_id:       api.czr_skope( skope_id )().obj_id,
                theme:        _wpCustomizeSettings.theme.stylesheet,
                customized:   JSON.stringify( dirtyCustomized ),
                nonce:        this.nonce.preview
            };
        };
  });//api.bind('ready')

})( wp.customize , jQuery, _ );