//extends api.CZRBaseControl

var CZRModOptMths = CZRModOptMths || {};
( function ( api, $, _ ) {
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
                                    },
                                    //tabs navigation
                                    {
                                          trigger   : 'click keydown',
                                          selector  : '.tabs nav li',
                                          name      : 'tab_nav',
                                          actions   : function( args ) {
                                                //toggleTabVisibility is defined in the module ctor and its this is the item or the modOpt
                                                this.module.toggleTabVisibility.call( this, args );
                                          }
                                    }
                              ],//actions to execute
                              { dom_el: $_container },//model + dom scope
                              modOpt //instance where to look for the cb methods
                        );
                  };

              modOpt_model = modOpt() || modOpt.initial_modOpt_model;//could not be set yet

              //renderview content now
              $.when( modOpt.renderModOptContent( modOpt_model ) )
                    .done( function( $_container ) {
                          //update the $.Deferred state
                          if ( ! _.isUndefined( $_container ) && false !== $_container.length ) {
                                _setupDOMListeners( $_container );
                                dfd.resolve( $_container );
                          }
                          else {
                                throw new Error( 'Module : ' + modOpt.module.id + ', the modOpt content has not been rendered' );
                          }
                    })
                    .then( function() {
                          //the modOpt.container is now available
                          //Setup the tabs navigation
                          //setupTabNav is defined in the module ctor and its this is the item or the modOpt
                          modOpt.module.setupTabNav.call( modOpt );
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
              if ( 0 === $( '#tmpl-' + module.getTemplateSelectorPart( 'modOptInputList', modOpt_model ) ).length ) {
                    api.errorLog('renderModOptContent : No modOpt content template defined for module ' + module.id + '. The template script id should be : #tmpl-' + module.getTemplateSelectorPart( 'modOptInputList', modOpt_model ) );
                    return;
              }
              var  modOpt_content_template = wp.template( module.getTemplateSelectorPart( 'modOptInputList', modOpt_model ) );

              //do we have an html template ?
              if ( ! modOpt_content_template )
                return this;

              var _ctrlLabel = '';
              try {
                    _ctrlLabel = [ serverControlParams.i18n['Options for'], module.control.params.label ].join(' ');
              } catch( er ) {
                    api.errorLog( 'In renderModOptContent : ' + er );
                    _ctrlLabel = serverControlParams.i18n['Settings'];
              }

              $('#widgets-left').after( $( '<div/>', {
                    class : module.control.css_attr.mod_opt_wrapper,
                    html : [
                          [ '<h2 class="mod-opt-title">', _ctrlLabel , '</h2>' ].join(''),
                          '<span class="fas fa-times ' + module.control.css_attr.close_modopt_icon + '" title="close"></span>'
                    ].join('')
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
})( wp.customize , jQuery, _ );