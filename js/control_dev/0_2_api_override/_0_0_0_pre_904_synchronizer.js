
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