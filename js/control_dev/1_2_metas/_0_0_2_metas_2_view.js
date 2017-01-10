//extends api.CZRBaseControl
var CZRModMetasMths = CZRModMetasMths || {};

$.extend( CZRModMetasMths , {
  // //fired on initialize for metas in module embedded in a regular control
  // //fired when user edit module for metas in modules embedded in a sektion
  // mayBeRenderMetasWrapper : function() {
  //       var metas = this;

  //       if ( 'pending' != metas.embedded.state() )
  //         return;

  //       $.when( metas.renderMetasWrapper() ).done( function( $_container ) {
  //             metas.container = $_container;
  //             if ( _.isUndefined(metas.container) || ! metas.container.length ) {
  //                 throw new Error( 'In mayBeRenderMetasWrapper the Metas view has not been rendered' );
  //             } else {
  //                 //say it
  //                 metas.embedded.resolve();
  //             }
  //       });
  // },

  // //the view wrapper has been rendered by WP
  // //the content ( the various inputs ) is rendered by the following methods
  // //an event is triggered on the control.container when content is rendered
  // renderMetasWrapper : function( metas_model ) {
  //       //=> an array of objects
  //       var metas = this,
  //           module = metas.module;

  //       metas_model = metas_model || metas();

  //       //render the metas wrapper
  //       $_view_el = $('<li>', { class : module.control.css_attr.metas_wrapper } );

  //       //append the metas view to the first module view wrapper
  //       //!!note : => there could be additional sub view wrapper inside !!
  //       //$( '.' + module.control.css_attr.items_wrapper , module.container).first().append( $_view_el );
  //       // module.itemsWrapper has been stored as a $ var in module initialize() when the tmpl has been embedded
  //       module.itemsWrapper.append( $_view_el );

  //       //then, append the metas content wrapper
  //       $_view_el.append( $( '<div/>', { class: module.control.css_attr.metas_content } ) );

  //       return $_view_el;
  // },



  //fired when metas is ready and embedded
  //define the metas view DOM event map
  //bind actions when the metas is embedded
  metasWrapperViewSetup : function( metas_model ) {
          var metas = this,
              module = this.module;

          metas_model = metas() || metas.initial_metas_model;//could not be set yet

          //czr_MetasState stores the current expansion status of a given view => one value by created by metas.id
          //czr_MetasState can take 3 values : expanded, expanded_noscroll (=> used on view creation), closed
          metas.czr_MetasState = new api.Value();
          //set initial state
          metas.czr_MetasState.set('closed');


          //When do we render the metas content ?
          var _updateMetasContentDeferred = function( $_content, to, from ) {
                //update the $.Deferred state
                if ( ! _.isUndefined( $_content ) && false !== $_content.length ) {
                    metas.contentRendered.resolve();
                    metas.toggleMetasExpansion(to, from );
                }
                else {
                    throw new Error( 'Module : ' + metas.module.id + ', the metas content has not been rendered' );
                }
          };


          //react to the metas state changes
          metas.czr_MetasState.callbacks.add( function( to, from ) {
              //toggle on view state change
              metas.toggleMetasExpansion.apply(metas, arguments );
          });

          //renderview content now
          $.when( metas.renderMetasContent( metas_model ) ).done( function( $_metas_content ) {
                _updateMetasContentDeferred( $_metas_content, true );
                //metas.czr_MetasState.set('expanded');
          });


          //DOM listeners for the user action in metas view wrapper
          // api.CZR_Helpers.setupDOMListeners(
          //       metas.userEventMap(),//actions to execute
          //       { model:metas_model, dom_el:metas.container },//model + dom scope
          //       metas //instance where to look for the cb methods
          // );
  },



  //renders saved metas views and attach event handlers
  //the saved metas look like :
  //array[ { id : 'sidebar-one', title : 'A Title One' }, {id : 'sidebar-two', title : 'A Title Two' }]
  renderMetasContent : function( metas_model ) {
          //=> an array of objects
          var metas = this,
              module = this.module;

          metas_model = metas_model || metas();

          //do we have view content template script?
          if ( 0 === $( '#tmpl-' + module.getTemplateEl( 'metasInputList', metas_model ) ).length ) {
              throw new Error('No metas content template defined for module ' + module.id + '. The template script id should be : #tmpl-' + module.getTemplateEl( 'metasInputList', metas_model ) );
          }
          var  metas_content_template = wp.template( module.getTemplateEl( 'metasInputList', metas_model ) );

          //do we have an html template ?
          if ( ! metas_content_template )
            return this;

          //the view content
          $( metas_content_template( metas_model )).appendTo( metas.container );

          return $( $( metas_content_template( metas_model )), metas.container );
  },




  //@param : obj = { event : {}, model : {}, view : ${} }
  //Fired on view_rendered:new when a new model has been added
  //Fired on click on edit_view_btn
  // setViewVisibility : function( obj, is_added_by_user ) {
  //         var item = this,
  //             module = this.module;
  //         if ( is_added_by_user ) {
  //               item.czr_MetasState.set( 'expanded_noscroll' );
  //         } else {
  //               module.closeAllItems( item.id );
  //               if ( _.has(module, 'preItem') ) {
  //                 module.preItemExpanded.set(false);
  //               }
  //               item.czr_ItemState.set( 'expanded' == item._getViewState() ? 'closed' : 'expanded' );
  //         }
  // },


  _getViewState : function() {
          return -1 == this.czr_MetasState().indexOf('expanded') ? 'closed' : 'expanded';
  },


  //callback of metas.czr_MetasState.callbacks
  toggleMetasExpansion : function( status, from, duration ) {
          var metas = this,
              module = this.module;

          //slide Toggle and toggle the 'open' class
          $( '.' + module.control.css_attr.metas_content , metas.container ).first().slideToggle( {
                duration : duration || 200,
                done : function() {
                      var _is_expanded = 'closed' != status;
                      metas.container.toggleClass('open' , _is_expanded );

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
                        module._adjustScrollExpandedBlock( metas.container );
                }//done callback
          } );
  }
});//$.extend
