
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
              //=> this is optional, if not set, then the transport will be inherited from the the module, which inherits from the control.
              //
              //If the input transport is specifically set to postMessage, then we don't want to send the 'setting' event to the preview
              //=> this will prevent any partial refresh to be triggered if the input control parent is defined has a partial refresh one.
              //=> the input will be sent to preview with module.control.previewer.send( 'czr_input', {...} )
              //
              //One exception : if the input transport is set to postMessage but the setting has not been set yet in the api (from is undefined, null, or empty) , we usually need to make an initial refresh
              //=> typically, the initial refresh can be needed to set the relevant module css id selector that will be used afterwards for the postMessage input preview

              //If we are in an input postMessage situation, the not_preview_sent param has been set in the czr_Input.inputReact method
              //=> 1) We bail here
              //=> 2) and we will send a custom event to the preview looking like :
              //module.control.previewer.send( 'czr_input', {
              //       set_id        : module.control.id,
              //       module_id     : module.id,//<= will allow us to target the right dom element on front end
              //       input_id      : input.id,
              //       value         : to
              // });

              //=> if no from (setting not set yet => fall back on defaut transport)
              if ( ! _.isUndefined( from ) && ! _.isEmpty( from ) && ! _.isNull( from ) ) {
                    if ( _.isObject( data ) && true === data.not_preview_sent ) {
                          return;
                    }
              }

              //don't do anything id we are silent
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