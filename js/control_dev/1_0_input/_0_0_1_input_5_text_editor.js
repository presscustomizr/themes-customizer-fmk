var CZRInputMths = CZRInputMths || {};
( function ( api, $, _ ) {
$.extend( CZRInputMths , {
      setupTextEditor : function() {
            var input        = this,
                _model       = input();

            //do we have an html template and a input container?
            if ( ! input.container ) {
                throw new Error( 'The input container is not set for WP text editor in module.' + input.module.id );
            }

            if ( ! input.czrRenderInputTextEditorTemplate() )
              return;

            input.editor       = tinyMCE( 'czr-customize-content_editor' );
            input.textarea     = $( '#czr-customize-content_editor' );
            input.editorPane   = $( '#czr-customize-content_editor-pane' );
            input.dragbar      = $( '#czr-customize-content_editor-dragbar' );
            input.editorFrame  = $( '#czr-customize-content_editor_ifr' );
            input.mceTools     = $( '#wp-czr-customize-content_editor-tools' );
            input.mceToolbar   = input.editorPane.find( '.mce-toolbar-grp' );
            input.mceStatusbar = input.editorPane.find( '.mce-statusbar' );

            input.preview      = $( '#customize-preview' );
            input.collapse     = $( '.collapse-sidebar' );

            input.textpreview  = input.container.find('textarea');
            input.toggleButton = input.container.find('button.text_editor-button');

            //status
            input.editorExpanded   = new api.Value( false );


            //initial filling of the textpreview and button text
            input.czrUpdateTextPreview();
            input.czrSetToggleButtonText( input.editorExpanded() );

            input.czrTextEditorBinding();

            input.czrResizeEditorOnUserRequest();
      },

      czrTextEditorBinding : function() {
              var input = this,
                  editor = input.editor,
                  textarea = input.textarea,
                  toggleButton = input.toggleButton,
                  editorExpanded = input.editorExpanded,
                  editorPane   = input.editorPane;


              input.bind( input.id + ':changed', input.czrUpdateTextPreview );

              _.bindAll( input, 'czrOnVisualEditorChange', 'czrOnTextEditorChange', 'czrResizeEditorOnWindowResize' );

              toggleButton.on( 'click', function() {
                    input.editorExpanded.set( ! input.editorExpanded() );
                    if ( input.editorExpanded() ) {
                      editor.focus();
                    }
              });

              //on this module section close close the editor and unbind this input
              input.module.czr_ModuleState.bind(
                function( state ) {
                  if ( 'expanded' != state )
                    input.editorExpanded.set( false );
              });

              input.editorExpanded.bind( function (expanded) {

                    api.consoleLog('in input.editorExpanded', expanded, input() );
                    /*
                    * Ensure only the latest input is bound
                    */
                    if ( editor.locker && editor.locker !== input ) {
                        editor.locker.editorExpanded.set(false);
                        editor.locker = null;
                    }if ( ! editor.locker || editor.locker === input ) {
                        $(document.body).toggleClass('czr-customize-content_editor-pane-open', expanded);
                        editor.locker = input;
                    }

                    //set toggle button text
                    input.czrSetToggleButtonText( expanded );

                    if ( expanded ) {
                        editor.setContent( wp.editor.autop( input() ) );
                        editor.on( 'input change keyup', input.czrOnVisualEditorChange );
                        textarea.on( 'input', input.czrOnTextEditorChange );
                        input.czrResizeEditor( window.innerHeight - editorPane.height() );
                        $( window ).on('resize', input.czrResizeEditorOnWindowResize );

                    } else {
                        editor.off( 'input change keyup', input.czrOnVisualEditorChange );
                        textarea.off( 'input', input.czrOnTextEditorChange );
                        $( window ).off('resize', input.czrResizeEditorOnWindowResize );

                        //resize reset
                        input.czrResizeReset();
                    }
              } );
      },

      czrOnVisualEditorChange : function() {
              var input = this,
                  editor = input.editor,
                  value;

              value = wp.editor.removep( editor.getContent() );
              input.set(value);
      },

      czrOnTextEditorChange : function() {
              var input = this,
                  textarea = input.textarea,
                  value;

              value = textarea.val();
              input.set(value);
      },
      czrUpdateTextPreview: function() {
              var input   = this,
                  input_model = input(),
                  value;

              //TODO: better stripping
              value = input_model.replace(/(<([^>]+)>)/ig,"");
              //max 30 chars
              if ( value.length > 30 )
                value = value.substring(0, 34) + '...';

              input.textpreview.val( value );
      },
      //////////////////////////////////////////////////
      /// HELPERS
      //////////////////////////////////////////////////
      czrRenderInputTextEditorTemplate: function() {
              var input  = this;

              //do we have view template script?
              if ( 0 === $( '#tmpl-czr-input-text_editor-view-content' ).length ) {
                  throw new Error('Missing js template for text editor input in module : ' + input.module.id );
              }

              var view_template = wp.template('czr-input-text_editor-view-content'),
                      $_view_el = input.container.find('input');

              //  //do we have an html template and a module container?
              if ( ! view_template  || ! input.container )
                return;

              api.consoleLog('Model injected in text editor tmpl : ', input() );

              $_view_el.after( view_template( input() ) );

              return true;
      },
      czrIsEditorExpanded : function() {
              return $( document.body ).hasClass('czr-customize-content_editor-pane-open');
      },
      czrResizeReset  : function() {
              var input = this,
                  preview = input.preview,
                  collapse = input.collapse,
                  sectionContent = input.container.closest('ul.accordion-section-content');

              sectionContent.css( 'padding-bottom', '' );
              preview.css( 'bottom', '' );
              collapse.css( 'bottom', '' );
      },
      czrResizeEditor : function( position ) {
              var windowHeight = window.innerHeight,
                  windowWidth = window.innerWidth,
                  minScroll = 40,
                  maxScroll = 1,
                  mobileWidth = 782,
                  collapseMinSpacing = 56,
                  collapseBottomOutsideEditor = 8,
                  collapseBottomInsideEditor = 4,
                  args = {},
                  input = this,
                  sectionContent = input.container.closest('ul.accordion-section-content'),
                  mceTools = input.mceTools,
                  mceToolbar = input.mceToolbar,
                  mceStatusbar = input.mceStatusbar,
                  preview      = input.preview,
                  collapse     = input.collapse,
                  editorPane   = input.editorPane,
                  editorFrame  = input.editorFrame;

              if ( ! input.editorExpanded() ) {
                return;
              }

              if ( ! _.isNaN( position ) ) {
                resizeHeight = windowHeight - position;
              }

              args.height = resizeHeight;
              args.components = mceTools.outerHeight() + mceToolbar.outerHeight() + mceStatusbar.outerHeight();

              if ( resizeHeight < minScroll ) {
                args.height = minScroll;
              }

              if ( resizeHeight > windowHeight - maxScroll ) {
                args.height = windowHeight - maxScroll;
              }

              if ( windowHeight < editorPane.outerHeight() ) {
                args.height = windowHeight;
              }

              preview.css( 'bottom', args.height );
              editorPane.css( 'height', args.height );
              editorFrame.css( 'height', args.height - args.components );
              collapse.css( 'bottom', args.height + collapseBottomOutsideEditor );

              if ( collapseMinSpacing > windowHeight - args.height ) {
                collapse.css( 'bottom', mceStatusbar.outerHeight() + collapseBottomInsideEditor );
              }

              if ( windowWidth <= mobileWidth ) {
                sectionContent.css( 'padding-bottom', args.height );
              } else {
                sectionContent.css( 'padding-bottom', '' );
              }
      },
      czrResizeEditorOnWindowResize : function() {
              var input = this,
                  resizeDelay = 50,
                  editorPane   = input.editorPane;

              if ( ! input.editorExpanded() ) {
                return;
              }

              _.delay( function() {
                input.czrResizeEditor( window.innerHeight - editorPane.height() );
              }, resizeDelay );

      },
      czrResizeEditorOnUserRequest : function() {
              var input = this,
                  dragbar = input.dragbar,
                  editorFrame = input.editorFrame;

              dragbar.on( 'mousedown', function() {
                if ( ! input.editorExpanded() )
                  return;

                $( document ).on( 'mousemove.czr-customize-content_editor', function( event ) {
                    event.preventDefault();
                    $( document.body ).addClass( 'czr-customize-content_editor-pane-resize' );
                    editorFrame.css( 'pointer-events', 'none' );
                    input.czrResizeEditor( event.pageY );
                  } );
                } );

              dragbar.on( 'mouseup', function() {
                if ( ! input.editorExpanded() )
                  return;

                $( document ).off( 'mousemove.czr-customize-content_editor' );
                $( document.body ).removeClass( 'czr-customize-content_editor-pane-resize' );
                editorFrame.css( 'pointer-events', '' );
              } );

      },
      czrSetToggleButtonText : function( $_expanded ) {
              var input = this;

              input.toggleButton.text( serverControlParams.i18n.mods.textEditor[ ! $_expanded ? 'Edit' : 'Close Editor' ] );
      }
});//$.extend
})( wp.customize , jQuery, _ );