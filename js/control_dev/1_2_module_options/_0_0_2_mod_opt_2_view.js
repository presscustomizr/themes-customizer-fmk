//extends api.CZRBaseControl
var CZRModOptMths = CZRModOptMths || {};

$.extend( CZRModOptMths , {
  // //fired on initialize for modOpt in module embedded in a regular control
  // //fired when user edit module for modOpt in modules embedded in a sektion
  // mayBeRenderModOptWrapper : function() {
  //       var modOpt = this;

  //       if ( 'pending' != modOpt.embedded.state() )
  //         return;

  //       $.when( modOpt.renderModOptWrapper() ).done( function( $_container ) {
  //             modOpt.container = $_container;
  //             if ( _.isUndefined(modOpt.container) || ! modOpt.container.length ) {
  //                 throw new Error( 'In mayBeRenderModOptWrapper the ModOpt view has not been rendered' );
  //             } else {
  //                 //say it
  //                 modOpt.embedded.resolve();
  //             }
  //       });
  // },

  // //the view wrapper has been rendered by WP
  // //the content ( the various inputs ) is rendered by the following methods
  // //an event is triggered on the control.container when content is rendered
  // renderModOptWrapper : function( modOpt_model ) {
  //       //=> an array of objects
  //       var modOpt = this,
  //           module = modOpt.module;

  //       modOpt_model = modOpt_model || modOpt();

  //       //render the modOpt mod_opt_wrapper
  //       $_view_el = $('<li>', { class : module.control.css_attr.mod_opt_wrapper } );

  //       //append the modOpt view to the first module view wrapper
  //       //!!note : => there could be additional sub view wrapper inside !!
  //       //$( '.' + module.control.css_attr.items_wrapper , module.container).first().append( $_view_el );
  //       // module.itemsWrapper has been stored as a $ var in module initialize() when the tmpl has been embedded
  //       module.itemsWrapper.append( $_view_el );

  //       //then, append the modOpt content wrapper
  //       $_view_el.append( $( '<div/>', { class: module.control.css_attr.modOpt_content } ) );

  //       return $_view_el;
  // },



  //fired when modOpt is ready and embedded
  //define the modOpt view DOM event map
  //bind actions when the modOpt is embedded
  modOptWrapperViewSetup : function( modOpt_model ) {
          var modOpt = this,
              module = this.module;

          modOpt_model = modOpt() || modOpt.initial_modOpt_model;//could not be set yet

          //czr_ModOptState stores the current expansion status of a given view => one value by created by modOpt.id
          //czr_ModOptState can take 3 values : expanded, expanded_noscroll (=> used on view creation), closed
          modOpt.czr_ModOptState = new api.Value();
          //set initial state
          modOpt.czr_ModOptState.set('closed');


          //When do we render the modOpt content ?
          var _updateModOptContentDeferred = function( $_content, to, from ) {
                //update the $.Deferred state
                if ( ! _.isUndefined( $_content ) && false !== $_content.length ) {
                    modOpt.modOptRendered.resolve();
                    modOpt.toggleModOptExpansion(to, from );
                }
                else {
                    throw new Error( 'Module : ' + modOpt.module.id + ', the modOpt content has not been rendered' );
                }
          };


          //react to the modOpt state changes
          modOpt.czr_ModOptState.callbacks.add( function( to, from ) {
              //toggle on view state change
              modOpt.toggleModOptExpansion.apply(modOpt, arguments );
          });

          //renderview content now
          $.when( modOpt.renderModOptContent( modOpt_model ) ).done( function( $_modOpt_content ) {
                _updateModOptContentDeferred( $_modOpt_content, true );
                //modOpt.czr_ModOptState.set('expanded');
          });


          //DOM listeners for the user action in modOpt view wrapper
          // api.CZR_Helpers.setupDOMListeners(
          //       modOpt.userEventMap(),//actions to execute
          //       { model:modOpt_model, dom_el:modOpt.container },//model + dom scope
          //       modOpt //instance where to look for the cb methods
          // );
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

          //the view content
          $( modOpt_content_template( modOpt_model )).appendTo( modOpt.container );

          return $( $( modOpt_content_template( modOpt_model )), modOpt.container );
  },




  //@param : obj = { event : {}, model : {}, view : ${} }
  //Fired on view_rendered:new when a new model has been added
  //Fired on click on edit_view_btn
  // setViewVisibility : function( obj, is_added_by_user ) {
  //         var item = this,
  //             module = this.module;
  //         if ( is_added_by_user ) {
  //               item.czr_ModOptState.set( 'expanded_noscroll' );
  //         } else {
  //               module.closeAllItems( item.id );
  //               if ( _.has(module, 'preItem') ) {
  //                 module.preItemExpanded.set(false);
  //               }
  //               item.czr_ItemState.set( 'expanded' == item._getViewState() ? 'closed' : 'expanded' );
  //         }
  // },


  _getViewState : function() {
          return -1 == this.czr_ModOptState().indexOf('expanded') ? 'closed' : 'expanded';
  },


  //callback of modOpt.czr_ModOptState.callbacks
  toggleModOptExpansion : function( status, from, duration ) {
          var modOpt = this,
              module = this.module;

          //slide Toggle and toggle the 'open' class
          $( '.' + module.control.css_attr.mod_opt_content , modOpt.container ).first().slideToggle( {
                duration : duration || 200,
                done : function() {
                      var _is_expanded = 'closed' != status;
                      modOpt.container.toggleClass('open' , _is_expanded );

                      //close all alerts
                      module.closeAllAlerts();

                      //toggle the icon activate class depending on the status
                      //switch icon
                      var $_edit_icon = $(this).siblings().find('.' + module.control.css_attr.edit_view_btn );

                      $_edit_icon.toggleClass('active' , _is_expanded );
                      if ( _is_expanded )
                        $_edit_icon.removeClass('fa-pencil').addClass('fa-minus-square').attr('title', serverControlParams.translatedStrings.close );
                      else
                        $_edit_icon.removeClass('fa-minus-square').addClass('fa-pencil').attr('title', serverControlParams.translatedStrings.edit );

                      //scroll to the currently expanded view
                      if ( 'expanded' == status )
                        module._adjustScrollExpandedBlock( modOpt.container );
                }//done callback
          } );
  }
});//$.extend
