//extends api.CZRBaseControl
var CZRModOptMths = CZRModOptMths || {};

$.extend( CZRModOptMths , {
  //fired when modOpt is ready and embedded
  //define the modOpt view DOM event map
  //bind actions when the modOpt is embedded
  modOptWrapperViewSetup : function( modOpt_model ) {
          var modOpt = this,
              module = this.module,
              dfd = $.Deferred(),
              _setupDOMListeners = function( $_container ) {
                    //DOM listeners for the user action in modOpt view wrapper
                    api.CZR_Helpers.setupDOMListeners(
                         [
                                //toggle mod options
                                {
                                      trigger   : 'click keydown',
                                      selector  : '.' + module.control.css_attr.close_modopt_icon,
                                      name      : 'close_mod_option',
                                      actions   : function() {
                                            api.czr_ModOptVisible( false );
                                      }
                                }
                          ],//actions to execute
                          { dom_el: $_container },//model + dom scope
                          modOpt //instance where to look for the cb methods
                    );
              };

          modOpt_model = modOpt() || modOpt.initial_modOpt_model;//could not be set yet

          //renderview content now
          $.when( modOpt.renderModOptContent( modOpt_model ) ).done( function( $_container ) {
                //update the $.Deferred state
                if ( ! _.isUndefined( $_container ) && false !== $_container.length ) {
                      _setupDOMListeners( $_container );
                      dfd.resolve( $_container );
                }
                else {
                      throw new Error( 'Module : ' + modOpt.module.id + ', the modOpt content has not been rendered' );
                }
          });
          return dfd.promise();
  },



  //renders saved modOpt views and attach event handlers
  //the saved modOpt look like :
  //array[ { id : 'sidebar-one', title : 'A Title One' }, {id : 'sidebar-two', title : 'A Title Two' }]
  renderModOptContent : function( modOpt_model ) {
          //=> an array of objects
          var modOpt = this,
              module = this.module;

          modOpt_model = modOpt_model || modOpt();

          //do we have view content template script?
          if ( 0 === $( '#tmpl-' + module.getTemplateEl( 'modOptInputList', modOpt_model ) ).length ) {
              throw new Error('No modOpt content template defined for module ' + module.id + '. The template script id should be : #tmpl-' + module.getTemplateEl( 'modOptInputList', modOpt_model ) );
          }
          var  modOpt_content_template = wp.template( module.getTemplateEl( 'modOptInputList', modOpt_model ) );

          //do we have an html template ?
          if ( ! modOpt_content_template )
            return this;

          $('#widgets-left').after( $( '<div/>', {
                class : module.control.css_attr.mod_opt_wrapper,
                html : '<span class="fa fa-times ' + module.control.css_attr.close_modopt_icon + '" title="close"></span>'
          } ) );

          //render the mod opt content for this module
          $( '.' + module.control.css_attr.mod_opt_wrapper ).append( $( modOpt_content_template( modOpt_model ) ) );

          return $( '.' + module.control.css_attr.mod_opt_wrapper );
  },



  toggleModPanelView : function( visible ) {
        var modOpt = this,
            module = this.module,
            ctrl = module.control,
            dfd = $.Deferred();

        module.control.container.toggleClass( 'czr-modopt-visible', visible );
        $('body').toggleClass('czr-editing-modopt', visible );
        //Let the panel slide (  -webkit-transition: left .18s ease-in-out )
        _.delay( function() {
              dfd.resolve();
        }, 200 );
        return dfd.promise();
  }

});//$.extend