
(function (api, $, _) {
  //PREPARE THE SKOPE AWARE PREVIEWER
  if ( serverControlParams.isSkopOn ) {
        //var _old_preview = api.Setting.prototype.preview;
        api.Setting.prototype.preview = function( to, from , data ) {
              var setting = this, transport;
                  transport = setting.transport;

              if ( _.has( api, 'czr_isPreviewerSkopeAware' ) && 'pending' == api.czr_isPreviewerSkopeAware.state() )
                this.previewer.refresh();
              //as soon as the previewer is setup, let's behave as usual
              //=> but don't refresh when silently updating

              //Each input instantiated in an item or a modOpt can have a specific transport set.
              //the input transport is hard coded in the module js template, with the attribute : data-transport="postMessage" or "refresh"
              //=> this is optional, if not set, then the transport will be inherited from the one of the module, which is inherited from the control.
              //
              //If the input transport is specifically set to postMessage, then we don't want to send the 'setting' event to the preview
              //=> this will prevent any partial refresh to be triggered if the input control parent is defined has a partial refresh one.
              //=> the input will be sent to preview with module.control.previewer.send( 'czr_input', {...} )
              if ( _.isObject( data ) && true === data.not_preview_sent ) {
                    return;
              }

              if ( ! _.has( data, 'silent' ) || false === data.silent ) {
                    //CORE PREVIEW AS OF WP 4.7+
                    if ( 'postMessage' === transport && ! api.state( 'previewerAlive' ).get() ) {
                          transport = 'refresh';
                    }

                    if ( 'postMessage' === transport ) {
                          setting.previewer.send( 'setting', [ setting.id, setting() ] );
                    } else if ( 'refresh' === transport ) {
                          setting.previewer.refresh();
                    }
              }
        };
  }

})( wp.customize , jQuery, _ );