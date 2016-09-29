
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

        api.previewer.query =  function( skope_id, action, the_dirties ) {
            var dirtyCustomized = the_dirties || {},
                _wpDirtyCustomized = {};

            if ( _.isUndefined(action) ) {
              throw new Error('No action defined in api.previewer.query.');
            }
            console.log('!!!!!!!!!!!!OVERRIDEN QUERY SKOPE AND ACTION!!!!!!!!!!!',skope_id, action, the_dirties);

            ////////////////////////////////////////////
            ///EXPERIMENTAL
            //build the dirties from the wp settings excluded from skope
            api.each( function ( value, setId ) {
                  if ( value._dirty ) {
                    _wpDirtyCustomized[ setId ] = value();
                  }
            } );

            if ( 'refresh' == action ) {
                api.each( function ( value, key ) {
                  if ( value._dirty ) {
                    dirtyCustomized[ key ] = value();
                  }
                } );
            } else {
              dirtyCustomized = the_dirties;
            }
            console.log('api.czr_skopeBase.getSkopeDirties(skope_id)', api.czr_skopeBase.getSkopeDirties(skope_id) );
            console.log( '_wpDirtyCustomized', _wpDirtyCustomized );

            // if ( ! _.isEmpty(_wpDirtyCustomized) )
            //   return _old_previewer_query.apply( this );

            ////////////////////////////////////////////
            ///EXPERIMENTAL


            skope_id = skope_id || api.czr_activeSkope() || api.czr_skopeBase.getGlobalSkopeId();


            //IS SKOP ON OR IS THIS SKOPE REGISTERED ?
            //falls back to WP core treatment if skope is not on or if the requested skope is not registered
            if ( ! _.has( api, 'czr_skope') || ! api.czr_skope.has( skope_id ) )
              return _old_previewer_query.apply( this );



            /// BUILD THE DIRTIES ///
            //on first load OR if the current skope is the customized one, build the dirtyCustomized the regular way : typically a refresh after setting change
            //otherwise, get the dirties from the requested skope instance : typically a save action on several skopes
            if ( 'save' != action && 'reset' != action && api.czr_activeSkope() == skope_id ) {
                  api.each( function ( value, setId ) {
                        if ( value._dirty ) {
                          dirtyCustomized[ setId ] = value();
                        }
                  } );
            } else {
                  dirtyCustomized = api.czr_skopeBase.getSkopeDirties(skope_id);//api.czr_skope( skope_id ).dirtyValues();
            }

            //when previewing, we need to apply the skope inheritance to the customized values
            if ( 'save' != action && 'reset' != action ) {
                dirtyCustomized = api.czr_skopeBase.applyDirtyCustomizedInheritance( dirtyCustomized, skope_id );
            }

            //the previewer is now skope aware
            api.czr_isPreviewerSkopeAware.resolve();

            api.consoleLog('DIRTY VALUES TO SUBMIT ? ', dirtyCustomized, api.czr_skopeBase.getSkopeDirties(skope_id) );
            api.consoleLog('api.czr_skope( skope_id )().skope', api.czr_skope( skope_id )().skope );
            return {
                wp_customize: 'on',
                skope :       api.czr_skope( skope_id )().skope,
                dyn_type:     api.czr_skope( skope_id )().dyn_type,//post_meta, term_meta, user_meta, trans, option
                opt_name:     api.czr_skope( skope_id )().opt_name,
                obj_id:       api.czr_skope( skope_id )().obj_id,
                theme:        _wpCustomizeSettings.theme.stylesheet,
                customized:   JSON.stringify( dirtyCustomized ),
                nonce:        this.nonce.preview
            };
        };
  });//api.bind('ready')

})( wp.customize , jQuery, _ );