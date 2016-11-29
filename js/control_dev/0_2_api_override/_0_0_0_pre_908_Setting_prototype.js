
(function (api, $, _) {
  //PREPARE THE SKOPE AWARE PREVIEWER
  if ( serverControlParams.isSkopOn ) {
        var _old_preview = api.Setting.prototype.preview;
        api.Setting.prototype.preview = function( to, from , o) {
            if ( _.has( api, 'czr_isPreviewerSkopeAware' ) && 'pending' == api.czr_isPreviewerSkopeAware.state() )
              this.previewer.refresh();
            //as soon as the previewer is setup, let's behave as usual
            //=> but don't refresh when silently updating
            if ( ! _.has(o, 'silent') || false === o.silent ) {
                return _old_preview.call(this);
            }
        };
  }

})( wp.customize , jQuery, _ );