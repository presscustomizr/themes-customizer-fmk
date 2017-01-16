//extends api.CZRDynModule

var CZRFeaturedPageModuleMths = CZRFeaturedPageModuleMths || {};

$.extend( CZRFeaturedPageModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          //run the parent initialize
          api.CZRDynModule.prototype.initialize.call( module, id, options );

          //extend the module with new template Selectors
          $.extend( module, {
                itemPreAddEl : 'czr-module-fp-pre-add-view-content',
                itemInputList : 'czr-module-fp-view-content'
          } );

          //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
          module.inputConstructor = api.CZRInput.extend( module.CZRFeaturedPagesInputMths || {} );
          //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor = api.CZRItem.extend( module.CZRFeaturedPagesItem || {} );

          //declares a default model
          this.defaultItemModel = {
              id : '',
              title : '' ,
              'fp-post'  : '',
              'fp-title' : '',
              'fp-text'  : '',
              'fp-image' : '',
          };

          //overrides the default success message
          this.itemAddedMessage = serverControlParams.translatedStrings.featuredPageAdded;
          api.section( module.control.section() ).expanded.bind(function(to) {
            if ( 'resolved' == module.isReady.state() )
                  return;
            module.ready();
          });

  },//initialize





  //@override
  // wait for the ajax result!
  //the item is manually added.
  //We should have a pre Item
  addItem : function(obj) {

          var module     = this,
              item       = module.preItem,
              item_model = item();

          if ( _.isEmpty(item_model) || ! _.isObject(item_model) ) {
              throw new Error('addItem : an item should be an object and not empty. In : ' + module.id +'. Aborted.' );
          }

          var _fp_post        = item_model['fp-post'];
          if ( typeof _fp_post  == "undefined" )
            return;

          _fp_post = _fp_post[0];

          //AJAX ACTIONS ON ADD ITEM
          //when a new featured page is added, update the model (text, featured image ) base on the selected post
          //The parent method is called on ajaxrequest.done()
          var done_callback =  function( _to_update ) {
                item.set( $.extend( item_model, _to_update) );
                api.CZRDynModule.prototype.addItem.call( module, obj );
          };

          var request = module.CZRFeaturedPagesItem.setContentAjaxInfo( _fp_post.id, {}, done_callback );

  },







  CZRFeaturedPagesInputMths : {
          ready : function() {
                  var input = this;
                  //update the item model on fp-post change
                  input.bind( 'fp-post:changed', function(){
                    input.updateItemModel();
                  });
                  //update the item title on fp-title change
                  input.bind( 'fp-title:changed', function(){
                    input.updateItemTitle();
                  });

                  api.CZRInput.prototype.ready.call( input );
          },
          //override czr img uploader input constructor
          //we need this otherwise we cannot add the buttons to the input container
          //when the input model is not, as the template will be rendered before the ready
          //method is called
          setupImageUploader:  function(){
                  var input = this;
                  //temporary
                  input.container.bind( 'fp-image:content_rendered', function(){
                    input.addResetDefaultButton();
                  });

                  //see add a reset to default image button
                  input.container.on('click keydown', '.default-fpimage-button', function(){
                    input.setThumbnailAjax();
                  });

                  api.CZRInput.prototype.setupImageUploader.call( input );
          },
          //ACTIONS ON fp-title change
          //Fired on 'fp-title:changed'
          //Don't fire in pre item case
          updateItemModel : function( _new_val ) {

                  var input = this,
                      item = this.input_parent,
                      is_preItemInput = _.has( input, 'is_preItemInput' ) && input.is_preItemInput;

                  //check if we are in the pre Item case => if so, the fp-post might be empty
                  if ( ! _.has( item(), 'fp-post') || _.isEmpty( item()['fp-post'] ) )
                    return;

                  var _new_model      = _.clone( item() ),
                      _fp_post        = _new_model['fp-post'][0],
                      _new_title      = _fp_post.title,
                      inputCollection = is_preItemInput ? input.module.preItemInput : item.czr_Input;

                  if ( is_preItemInput ) {
                        $.extend( _new_model, { title : _new_title, 'fp-title' : _new_title } );
                        item.set( _new_model );
                  } else {

                        var done_callback =  function( _to_update ) {
                          _.each( _to_update, function( value, id ){
                              item.czr_Input( id ).set( value );
                          });
                        };
                        //pass the fp-title so it gets updated after the ajax callback
                        var request = item.setContentAjaxInfo( _fp_post.id, {'fp-title' : _new_title}, done_callback );
                  }
          },


          updateItemTitle : function( _new_val ) {
                  var input = this,
                      item = this.input_parent,
                      is_preItemInput = _.has( input, 'is_preItemInput' ) && input.is_preItemInput;

                  if ( is_preItemInput )
                    return;
                  var _new_model  = _.clone( item() ),
                      _new_title  = "undefined" !== typeof _new_model['fp-title'] ? _new_model['fp-title'] : '';

                  $.extend( _new_model, { title : _new_title} );
                  item.set( _new_model );
          },


          setThumbnailAjax : function() {
                  var item     = this.input_parent,
                      _fp_post = item.czr_Input('fp-post')(),
                      _post_id;

                  if ( typeof _fp_post  == "undefined" )
                    return;

                  _fp_post = _fp_post[0];
                  _post_id = _fp_post.id;

                  $('.fpimage-reset-messages p').hide();

                  //AJAX STUFF
                  //retrieve some ajax info
                  request = wp.ajax.post( 'get-fp-post-tb', {
                          'wp_customize': 'on',
                          'id'          : _post_id,
                          'CZRFPNonce'  : serverControlParams.CZRFPNonce
                          //nonce needed USE 1 for everything?
                  });


                  request.done( function( data ){
                          var thumbnail = data,
                              input = item.czr_Input('fp-image');

                          if ( 0 !== thumbnail.length ) {
                            $('.fpimage-reset-messages .success', input.container ).show('fast').fadeOut();
                            input.set( thumbnail );
                          }else {
                            $('.fpimage-reset-messages .warning', input.container ).show('fast').delay(2000).fadeOut();
                          }
                  });

                  request.fail(function( data ) {
                          if ( typeof console !== 'undefined' && console.error ) {
                            console.error( data );
                          }
                  });
          },

          addResetDefaultButton : function( $_template_params ) {
                  var input        = this,
                      item         = input.input_parent,
                      buttonLabel  = serverControlParams.translatedStrings.featuredPageImgReset,
                      successMess  = serverControlParams.translatedStrings.featuredPageResetSucc,
                      errMess      = serverControlParams.translatedStrings.featuredPageResetErr,
                      messages     = '<div class="fpimage-reset-messages" style="clear:both"><p class="success" style="display:none">'+successMess+'</p><p class="warning" style="display:none">'+errMess+'</p></div>';

                  $('.actions', input.container)
                    .append('<button type="button" class="button default-fpimage-button">'+ buttonLabel +'</button>');
                  $('.fpimage-reset-messages', input.container ).detach();
                  $(input.container).append( messages );
          }
  },//CZRFeaturedPagesInputMths








  CZRFeaturedPagesItem : {
          setContentAjaxInfo : function( _post_id, _additional_inputs, done_callback ) {
                  //called be called from the input and from the item
                  var _to_update         = _additional_inputs || {};

                  //AJAX STUFF
                  //retrieve some ajax info
                  request = wp.ajax.post( 'get-fp-post', {
                        'wp_customize': 'on',
                        'id'          : _post_id,
                        'CZRFPNonce'  : serverControlParams.CZRFPNonce
                        //nonce needed USE 1 for everything?
                  });

                  request.done( function( data ){
                        var _post_info = data.post_info;

                        if ( 0 !== _post_info.length ) {
                          $.extend( _to_update, { 'fp-image' : _post_info.thumbnail, 'fp-text' : _post_info.excerpt } );
                          if ( "function" === typeof done_callback )
                            done_callback( _to_update );
                        }
                  });

                  request.fail(function( data ) {
                        if ( typeof console !== 'undefined' && console.error ) {
                          console.error( data );
                        }
                  });

                  return request;
          },

          //overrides the default parent method by a custom one
          //at this stage, the model passed in the obj is up to date
          writeItemViewTitle : function( model ) {
                  var item = this,
                            module  = item.module,
                            _model = model || item(),
                            _title = _model.title ? _model.title : serverControlParams.translatedStrings.featuredPageTitle;

                  _title = api.CZR_Helpers.truncate(_title, 25);
                  $( '.' + module.control.css_attr.item_title , item.container ).html( _title );
                }
        }
});
//extends api.CZRModule
var CZRTextModuleMths = CZRTextModuleMths || {};

$.extend( CZRTextModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          //run the parent initialize
          api.CZRModule.prototype.initialize.call( module, id, options );

          //extend the module with new template Selectors
          $.extend( module, {
                itemInputList : 'czr-module-text-view-content',
          } );

          //declares a default model
          module.defaultItemModel = {
                id : '',
                text : ''
          };
  }//initialize
});//extends api.CZRDynModule

var CZRSlideModuleMths = CZRSlideModuleMths || {};

$.extend( CZRSlideModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          //run the parent initialize
          api.CZRDynModule.prototype.initialize.call( module, id, options );

          //extend the module with new template Selectors
          $.extend( module, {
                itemPreAddEl : 'czr-module-slide-pre-item-input-list',
                itemInputList : 'czr-module-slide-item-input-list',
                modOptInputList : 'czr-module-slide-mod-opt-input-list'
          } );

          this.slider_layouts = { 'full-width' : 'Full Width', boxed : 'Boxed' };

          //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
          module.inputConstructor = api.CZRInput.extend( module.CZRSliderInputMths || {} );
          module.inputModOptConstructor = api.CZRInput.extend( module.CZRSliderModOptInputMths || {} );
          //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor = api.CZRItem.extend( module.CZRSliderItem || {} );

          //declares a default ModOpt model
          this.defaultModOptModel = {
              is_mod_opt : true,
              module_id : module.id,
              'slider-speed' : 6,
              'slider-layout' : 'full-width',
              'lazyload' : 1
          };

          //declares a default Item model
          this.defaultItemModel = {
              id : '',
              title : '',
              'slide-background' : '',
              'slide-title'      : '',
              'slide-subtitle'   : '',
          };

          //overrides the default success message
          this.itemAddedMessage = serverControlParams.translatedStrings.slideAdded;
          //fired ready :
          //1) on section expansion
          //2) or in the case of a module embedded in a regular control, if the module section is alreay opened => typically when skope is enabled
          if ( _.has( api, 'czr_activeSectionId' ) && module.control.section() == api.czr_activeSectionId() && 'resolved' != module.isReady.state() ) {
             module.ready();
          }
          api.section( module.control.section() ).expanded.bind(function(to) {
                if ( 'resolved' == module.isReady.state() )
                  return;
                module.ready();
          });

          module.isReady.then( function() {});

  },//initialize


  CZRSliderInputMths : {
          ready : function() {
                var input = this;
                //update the item title on slide-title change
                if ( ! input.is_mod_opt ) {
                      input.bind('slide-title:changed', function() {
                            input.updateItemTitle();
                      });
                }
                api.CZRInput.prototype.ready.call( input);
          },

          //ACTIONS ON slide-title change
          //Fired on 'slide-title:changed'
          //Don't fire in pre item case
          updateItemTitle : function( _new_val ) {
                var input = this,
                    item = input.input_parent,
                    is_preItemInput = _.has( input, 'is_preItemInput' ) && input.is_preItemInput;

                var _new_model  = $.extend( true, {}, item() ),
                    _new_title  = _new_model['slide-title'];

                $.extend( _new_model, { title : _new_title} );
                item.set( _new_model );
          }
  },//CZRSlidersInputMths


  CZRSliderModOptInputMths : {
          setupSelect : function() {
                var input      = this,
                    modOpt      = input.input_parent,
                    module     = input.module,
                    _slider_layouts   = module.slider_layouts,//{}
                    _model = modOpt();

                //generates the options
                _.each( _slider_layouts , function( _layout_name , _k ) {
                      var _attributes = {
                                value : _k,
                                html: _layout_name
                          };
                      if ( _k == _model['slider-layout'] ) {
                            $.extend( _attributes, { selected : "selected" } );
                      }

                      $( 'select[data-type="slider-layout"]', input.container ).append( $('<option>', _attributes) );
                });

                //fire select2
                $( 'select[data-type="slider-layout"]', input.container ).selecter();
        }
  },//CZRSlidersInputMths


  CZRSliderItem : {
          //overrides the default parent method by a custom one
          //at this stage, the model passed in the obj is up to date
          writeItemViewTitle : function( model ) {
                var item = this,
                          module  = item.module,
                          _model = model || item(),
                          _title = _model.title ? _model.title : serverControlParams.translatedStrings.slideTitle;

                _title = api.CZR_Helpers.truncate(_title, 25);
                _title = [
                      '<span class="slide-thumb"></span>',
                      _title,
                ].join('');
                wp.media.attachment( _model['slide-background'] ).fetch()
                      .always( function() {
                            var attachment = this;
                            $( '.' + module.control.css_attr.item_title , item.container ).html( _title );
                            if ( _.isObject( attachment ) && _.has( attachment, 'attributes' ) && _.has( attachment.attributes, 'sizes' ) ) {
                                 $( '.slide-thumb', item.container ).append( $('<img/>', { src : this.get('sizes').thumbnail.url, width : 32, height : 32, alt : attachment.attributes.title } ) );
                            }
                      });
          }
  }
});//extends api.CZRDynModule

var CZRTextEditorModuleMths = CZRTextEditorModuleMths || {};

$.extend( CZRTextEditorModuleMths, {
  initialize: function( id, options ) {
          var module = this;
          //run the parent initialize
          api.CZRModule.prototype.initialize.call( module, id, options );

          //extend the module with new template Selectors
          $.extend( module, {
                itemInputList : 'czr-module-text_editor-item-content'
          } );

          //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
          module.inputConstructor = api.CZRInput.extend( module.CZRTextEditorInputMths || {} );
          //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
          module.itemConstructor = api.CZRItem.extend( module.CZRTextEditorItem || {} );

          //declares a default model
          this.defaultItemModel   = {
            id : '',
            text: ''
          };

          // api.section( module.control.section() ).expanded.bind(function(to) {

          //   // if ( false !== module.container.length ) {
          //   //   //say it*/
          //   //   module.container.append( $_module_el );
          //   //   module.embedded.resolve();
          //   // }

          //   if ( 'resolved' == module.isReady.state() )
          //     return;

          //   module.ready();
          // });
  },//initialize




  CZRTextEditorInputMths : {
  },//CZRTextEditorsInputMths



  CZRTextEditorItem : {

  },
});//extends api.CZRDynModule
//This module populates the sektions setting.
//The each sektion is composed of columns (=> columns on front end)
//Each columns of modules ( => content module on front end like slider, text block, etc)

var CZRSektionMths = CZRSektionMths || {};

$.extend( CZRSektionMths, {
  initialize: function( id, options ) {
          var module = this;
          //run the parent initialize
          api.CZRDynModule.prototype.initialize.call( module, id, options );


          //extend the module with new template Selectors
          $.extend( module, {
                itemPreAddEl : 'czr-module-sektion-pre-add-view-content',
                rudItemPart : 'czr-module-sektion-rud-item-part',
                itemInputList : 'czr-module-sektion-view-content',
          } );

          //SEKTIONS
          //declares a default model (overrides parent module)
          module.defaultItemModel = {
                id : '',
                'sektion-layout' : 1,
                columns : []
          };

          //hook before a sektion is being remove from dom and api.
          //=> remove modules and columns from DOM
          //=> removes moduea and columns instances from API
          module.bind( 'pre_item_dom_remove', function( item ) {
                module.removeSektion( item );
          });


          //COLUMNS
          module.defaultDBColumnModel = {
                id : '',
                sektion_id : '',
                modules : [],
          };

          module.defaultAPIcolumnModel = {
                id : '',
                modules : [],
                sektion : {},//sektion instance
                module_id : '',
                control_id : '',
                is_added_by_user : false
          };

          //the column values
          module.czr_Column = new api.Values();
          //stores the column collection
          //set the initial value
          module.czr_columnCollection = new api.Value();
          module.czr_columnCollection.set([]);

          //react to column collection changes
          module.czr_columnCollection.callbacks.add( function() { return module.columnCollectionReact.apply(module, arguments ); } );

          //EXTEND THE DEFAULT CONSTRUCTORS FOR SEKTION ITEMS
          module.itemConstructor = api.CZRItem.extend( module.CZRSektionItem || {} );


          //DRAGULA
          // if ( ! _.has( module ,'dragInstance' ) )
          //   module.initDragula();
          if ( ! _.has( module ,'modsDragInstance' ) )
            module.initModulesDragula();


          //MODULE PANEL
          api.czrModulePanelState = api.czrModulePanelState || new api.Value( false );
          api.czrModulePanelEmbedded = api.czrModulePanelEmbedded || $.Deferred();

          //EXTEND THE USER EVENT MAP
          //=> adds the module list panel events
          //=> adds the sektion setting panel events
          module.userEventMap.set( _.union(
                module.userEventMap(),
                [
                  //module panel
                  {
                    trigger   : 'click keydown',
                    selector  : '.add-new-module',
                    name      : 'add_new_module',
                    actions   : 'toggleModuleListPanel'
                  },
                  {
                    trigger   : 'click keydown',
                    selector  : '.' + module.control.css_attr.open_pre_add_btn,
                    name      : 'close_module_panel',
                    actions   : function() {
                        //close the module panel id needed
                        api.czrModulePanelState(false);
                    },
                  }
                ]
          ));



          api.consoleLog('SEKTION MODULE INIT', module.control.params.czr_skope );
          if ( _.has( api, 'czr_activeSkopeId' ) )
            api.consoleLog('SEKTION MODULE INIT', api.czr_activeSkopeId() );

          //api.czrModulePanelEmbedded.done( function() {

          api.czrModulePanelBinded = api.czrModulePanelBinded || $.Deferred();
          if ( 'pending' == api.czrModulePanelBinded.state() ) {

                api.czrModulePanelState.bind( function( expanded ) {
                      var synced_control_id = api.CZR_Helpers.build_setId(  module.control.params.syncCollection ),
                              sek_module = api.control( synced_control_id ).syncSektionModule();

                      $('body').toggleClass('czr-adding-module', expanded );

                      if ( expanded ) {
                            sek_module.renderModulePanel();

                            api.consoleLog('REACT TO MODULE PANEL STATE', expanded,  module.control.params.syncCollection, sek_module() );
                            api.consoleLog('WHEN DOES THIS ACTION OCCUR?', api.czrModulePanelBinded.state() );

                            //api.consoleLog('IS EQUAL?', _.isEqual( module, api.control( synced_control_id ).syncSektionModule() ) );


                            // if ( _.isEqual( module, api.control( synced_control_id ).syncSektionModule() ) )
                            //   return;

                            //DRAGULIZE
                            sek_module.modsDragInstance.containers.push( $('#czr-available-modules-list')[0]);

                            // sek_module.modulePanelDragulized = sek_module.modulePanelDragulized || $.Deferred();
                            // if ( expanded && 'pending' == sek_module.modulePanelDragulized.state() ) {
                            //       sek_module.modsDragInstance.containers.push( $('#czr-available-modules-list')[0]);
                            //       sek_module.modulePanelDragulized.resolve();
                            // }
                      } else {
                            //remove from draginstance
                            var _containers = $.extend( true, [], sek_module.modsDragInstance.containers );
                                _containers =  _.filter( _containers, function( con) {
                                    return 'czr-available-modules-list' != $(con).attr('id');
                                });
                            sek_module.modsDragInstance.containers = _containers;
                            $('#czr-module-list-panel').remove();
                      }

                });
                api.czrModulePanelBinded.resolve();
          //});
          }//if pending





          //SEKTION SETTING PANEL
          api.czrSekSettingsPanelState = api.SekSettingsPanelState || new api.Value( false );
          api.czrSekSettingsPanelEmbedded = api.SekSettingsPanelEmbedded || $.Deferred();

          //EXTEND THE USER EVENT MAP
          //=> adds the module list panel events
          //=> adds the sektion setting panel events
          module.userEventMap.set( _.union(
                module.userEventMap(),
                [
                  //Sektion Settings
                  {
                    trigger   : 'click keydown',
                    selector  : '.czr-edit-sek-settings',
                    name      : 'edit_sek_settings',
                    actions   : 'toggleSekSettingsPanel'
                  },
                  {
                    trigger   : 'click keydown',
                    selector  : '.' + module.control.css_attr.open_pre_add_btn,
                    name      : 'close_sektion_panel',
                    actions   : function() {
                        //close the sektion settings panel if needed
                        api.czrSekSettingsPanelState.set(false);
                    },
                  }
                ]
          ));
          api.czrSekSettingsPanelEmbedded.done( function() {
                api.czrSekSettingsPanelState.callbacks.add( function() { return module.reactToSekSettingPanelState.apply(module, arguments ); } );
          });


          // if ( _.has( api, 'czr_activeSectionId' ) && module.control.section() == api.czr_activeSectionId()  ) {
          //     api.consoleLog('SECTION EXPANDED CASE. WHAT IS THE CURRENT MODULE-COLLECTION?', api('hu_theme_options[module-collection]')(), module.isReady.state() );
          //     _fire();
          // }
          api.section( module.control.section() ).expanded.bind(function(to) {
              api.consoleLog('FIRE SEKTION MODULE!', module.id );
              module.fireSektionModule();
          });
  },//initialize




  fireSektionModule : function() {
      var module = this;
      if ( 'resolved' == module.isReady.state() )
        return;
      //unleash hell
      module.ready();
      //provide the synchronized module-collection control with its synchronized sektions module instance
      module.control.getSyncCollectionControl().syncSektionModule.set( module );
  },



  /////////////////////////////////////////////////////////////////////////
  /// SEKTION
  ////////////////////////////////////////////////////////////////////////
  //the sekItem object looks like :
  //id : ''
  //columns : []
  //sektion-layout : int
  removeSektion : function( sekItem ) {
        var module = this;

        _.each( sekItem.columns, function( _col ) {

              _.each( _col.modules, function( _mod ){
                    module.control.getSyncCollectionControl().removeModule( _mod );
              });//_.each

              //remove column from DOM if it's been embedded
              if ( module.czr_Column.has(_col.id) && 'resolved' == module.czr_Column( _col.id ).embedded.state() )
                  module.czr_Column( _col.id ).container.remove();

              //remove column from API
              module.removeColumnFromCollection( _col );


        });//_.each

  },

  closeAllOtherSektions : function( $_clicked_el ) {
          var module = this;
              _clicked_sektion_id = $_clicked_el.closest('.czr-single-item').attr('data-id');

          module.czr_Item.each( function( _sektion ){
                if ( _clicked_sektion_id != _sektion.id ) {
                    _sektion.czr_ItemState.set( 'closed');
                } else {
                    _sektion.czr_ItemState.set( 'expanded' != _sektion.czr_ItemState() ? 'expanded_noscroll' : 'expanded' );
                }
          });
  }

});//extends api.CZRDynModule
//This module populates the sektions setting.
//The each sektion is composed of columns (=> columns on front end)
//Each columns of modules ( => content module on front end like slider, text block, etc)

var CZRSektionMths = CZRSektionMths || {};

$.extend( CZRSektionMths, {
  //extends api.CZRItem
  CZRSektionItem : {
          initialize: function(id, options ) {
                var sekItem = this;
                api.CZRItem.prototype.initialize.call( sekItem, null, options );

                //EXTEND THE USER EVENT MAP
                //=> adds the module list panel events
                sekItem.userEventMap.set( _.union(
                      sekItem.userEventMap(),
                      [
                        {
                          trigger   : 'click keydown',
                          selector  : [ '.' + sekItem.module.control.css_attr.edit_view_btn, '.' + sekItem.module.control.css_attr.display_alert_btn,'.' + sekItem.module.control.css_attr.item_title ].join(','),
                          name      : 'close_module_panel',
                          actions   : function() {
                              api.czrModulePanelState.set(false);
                          },
                        },
                        {
                          trigger   : 'mouseenter',
                          selector  : '.czr-item-header',
                          name      : 'hovering_sek',
                          actions   : function( obj ) {
                              sekItem.module.control.previewer.send( 'start_hovering_sek', {
                                    id : sekItem.id
                              });
                          }
                        },
                        {
                          trigger   : 'mouseleave',
                          selector  : '.czr-item-header',
                          name      : 'hovering_sek',
                          actions   : function( obj ) {
                              sekItem.module.control.previewer.send( 'stop_hovering_sek', {
                                    id : sekItem.id
                              });
                          }
                        },
                        {
                          trigger   : 'click keydown',
                          selector  : [ '.' + sekItem.module.control.css_attr.edit_view_btn, '.' + sekItem.module.control.css_attr.item_title ].join(','),
                          name      : 'send_edit_view',
                          actions   : function( obj ) {
                              sekItem.module.control.previewer.send( 'edit_sek', {
                                    id : sekItem.id
                              });
                          },
                        }
                      ]
                ));

                var _sektion_model = sekItem(),
                    module = options.module;

                if ( ! _.has(_sektion_model, 'sektion-layout') ) {
                    throw new Error('In Sektion Item initialize, no layout provided for ' + sekItem.id + '.');
                }

                sekItem.isReady.done( function() {

                      //When fetched from DB, the column model looks like :
                      //{
                      //  id : '',//string
                      //  sektion_id : '',//string
                      //  modules : [],//collection of module id strings
                      //}
                      //=> we need to extend it with the sektion instance
                      //=> make sure the columns are instantiated as well
                      if ( ! _.isEmpty( sekItem().columns ) ) {
                            _.each( sekItem().columns , function( _column ) {
                                  //instantiate the column and push it to the global column collection
                                  var column_candidate = $.extend( true, {}, _column );//create a deep clone
                                  module.instantiateColumn( $.extend( column_candidate, { sektion : sekItem } ) );
                            });
                      } else {
                            //the sektion has no columns yet. This is the case typically when a sektion has just been created
                            // => instantiate new columns based on the sektion layout property.
                            var _col_nb = parseInt( _sektion_model['sektion-layout'] || 1, 10 );
                            for( i = 1; i < _col_nb + 1 ; i++ ) {
                                  var _default_column = $.extend( true, {}, module.defaultDBColumnModel ),
                                      column_candidate = {
                                            id : '',//a unique id will be generated when preparing the column for API.
                                            sektion_id : sekItem.id
                                      };
                                      column_candidate = $.extend( _default_column, column_candidate );

                                  module.instantiateColumn( $.extend( column_candidate, { sektion : sekItem } ) );
                            }//for
                      }
                });//sekItem.isReady

          },


          //OVERRIDES PARENT MODULE METHOD
          //React to a single item change
          //cb of module.czr_Item(item.id).callbacks
          // itemInternalReact : function( to, from ) {
          //   api.consoleLog('in item internal React overridden', to, from );
          //       var sekItem = this,
          //           sektion_candidate = $.extend(true, {}, to);
          //       //we want to make sure that the item model is compliant with default model
          //       sektion_candidate = sekItem.prepareSekItemForDB( sektion_candidate );
          //       //Call the parent method => updates the collection
          //       api.CZRItem.prototype.itemInternalReact.call( sekItem, sektion_candidate, from );
          // },

          //OVERRIDES PARENT MODULE METHOD
          //React to a single item change
          //cb of module.czr_Item(item.id).callbacks
          itemReact : function( to, from ) {
                var sekItem = this,
                    sektion_candidate = $.extend(true, {}, to);
                //we want to make sure that the item model is compliant with default model
                sektion_candidate = sekItem.prepareSekItemForDB( sektion_candidate );
                //Call the parent method => updates the collection
                api.CZRItem.prototype.itemReact.call( sekItem, sektion_candidate );
          },


          //the sektion item model must have only the property set in
          //module.defaultItemModel = {
          //       id : '',
          //       'sektion-layout' : 1,
          //       columns : []
          // };
          prepareSekItemForDB : function( sektion_candidate ) {
                var sekItem = this,
                    db_ready_sektItem = {};

                _.each( sekItem.module.defaultItemModel, function( _value, _key ) {
                    var _candidate_val = sektion_candidate[_key];
                    switch( _key ) {
                          case 'id' :
                              if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                                  throw new Error('The sekItem id property must be a not empty string');
                              }
                              db_ready_sektItem[_key] = _candidate_val;
                          break;
                          case 'sektion-layout' :
                              if ( ! _.isNumber( parseInt( _candidate_val, 10 ) ) || ( parseInt( _candidate_val, 10 ) < 1 ) ) {
                                  throw new Error('The sekItem layout property must be an int number > 0');
                              }
                              db_ready_sektItem[_key] = _candidate_val;
                          break;
                          case 'columns' :
                              if ( ! _.isArray( _candidate_val ) ) {
                                  throw new Error('The sekItem columns property must be an array');
                              }
                              var _db_ready_columns = [];
                              _.each( _candidate_val, function( _col ) {
                                    var _db_ready_col = sekItem.module.prepareColumnForDB(_col);
                                    _db_ready_columns.push( _db_ready_col );
                              });

                              db_ready_sektItem[_key] = _db_ready_columns;
                          break;
                    }
                });//each

                return db_ready_sektItem;
          }

  }//Sektion

});//extends api.CZRDynModule
//This module populates the sektions setting.
//The each sektion is composed of columns (=> columns on front end)
//Each columns of modules ( => content module on front end like slider, text block, etc)

var CZRSektionMths = CZRSektionMths || {};

$.extend( CZRSektionMths, {

  //Each column shall be described by an object like the following one :
  //module.defaultDBColumnModel = {
  //       id : '',
  //       sektion_id : '',
  //       modules : [],
  // };
  // Fired in prepareSekItemForDB
  prepareColumnForDB : function( column_candidate ) {
        var module = this,
            _db_ready_col = {};

        _.each( module.defaultDBColumnModel, function( _value, _key ){
              var _candidate_val = column_candidate[_key];
              switch( _key ) {
                  case 'id' :
                      if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                          throw new Error('The column id property must be a not empty string');
                      }
                      _db_ready_col[_key] = _candidate_val;
                  break;
                  case 'sektion_id' :
                      if ( _.isString( _candidate_val ) && ! _.isEmpty( _candidate_val ) ) {
                          _db_ready_col[_key] = _candidate_val;
                      } else if ( _.has(column_candidate, 'sektion') ) {
                          _db_ready_col[_key] = column_candidate.sektion.id;
                      } else {
                          throw new Error('The column sektion-id property must be a not empty string');
                      }
                  break;
                  case 'modules' :
                      if ( ! _.isArray( _candidate_val ) ) {
                          throw new Error('The column modules property must be an array');
                      }
                      _db_ready_col[_key] = _candidate_val;
                  break;
              }

        } );
        return _db_ready_col;
  },











  /////////////////////////////////////////////////////////////////////////
  /// COLUMN
  ////////////////////////////////////////////////////////////////////////
  //At this point, the column model has been fetched from DB, or manually added.
  //It must look like
  //{
  //  id : '',//string
  //  sektion : {},//sektion instance
  //  sektion_id : '',//string
  //  modules : [],//collection of module id strings
  //}
  //Fired in CZRSektionItem::initialize
  instantiateColumn : function( _column, is_added_by_user  ) {
        var module = this,
            column_model = _.clone( _column );

        if ( ! _.isEmpty( column_model.id ) && module.czr_Column.has( column_model.id ) ) {
              throw new Error('The column id already exists in the collection in module : ' + module.id );
        }

        column_model = module.prepareColumnForAPI( column_model );

        //instanciate the column with the default constructor
        //=> makes sure that the column is ready for instanciation
        module.czr_Column.add( column_model.id , new api.CZRColumn( column_model.id, column_model ) );

        //the column is now ready and will listen to changes
        module.czr_Column(column_model.id).ready();
  },


  //Let's make sure the column holds all the necessary properties before API instanciation.
  // module.defaultAPIcolumnModel = {
  //       id : '',
  //       modules : [],
  //       sektion : {}, //sektion instance
  //       module_id : '',
  //       control_id : '',
  //       is_added_by_user : false
  // };
  prepareColumnForAPI : function( column_candidate ) {
      var module = this,
          api_ready_column = {};

      if ( ! _.isObject( column_candidate ) ) {
            throw new Error('Sektion Module::prepareColumnForAPI : a column must be an object to be instantiated.');
        }

      _.each( module.defaultAPIcolumnModel, function( _value, _key ) {
            var _candidate_val = column_candidate[_key];
            switch( _key ) {
                  case 'id' :
                      if ( _.isEmpty( _candidate_val ) ) {
                          api_ready_column[_key] = module.generateColId();
                      } else {
                          api_ready_column[_key] = _candidate_val;
                      }
                  break;
                  case 'modules' :
                      if ( ! _.isArray( _candidate_val )  ) {
                          throw new Error('Sektion Module::prepareColumnForAPI : a collection of modules must be an array. Error in column ' + column_candidate.id );
                      }
                      api_ready_column[_key] = _candidate_val;
                  break;
                  case  'sektion' :
                      if ( ! _.isObject( _candidate_val ) || _.isEmpty( _candidate_val )  ) {
                          throw new Error('Sektion Module::prepareColumnForAPI : a sektion instance is missing for column ' + column_candidate.id );
                      }
                      api_ready_column[_key] = _candidate_val;
                  break;
                  case  'module_id' :
                      api_ready_column[_key] = module.id;
                  break;
                  case  'control_id' :
                      api_ready_column[_key] = module.control.id;
                  break;
                  case 'is_added_by_user' :
                      api_ready_column[_key] =  _.isBoolean( _candidate_val ) ? _candidate_val : false;
                  break;
            }//switch
      });
      return api_ready_column;
  },




  //@param obj can be { collection : []}, or { module : {} }
  updateColumnCollection : function( obj ) {
        var module = this,
            _current_collection = module.czr_columnCollection();
            _new_collection = $.extend( true, [] , _current_collection );
        api.consoleLog('in update column collection', module.id, module.czr_columnCollection() );
        //if a collection is provided in the passed obj then simply refresh the collection
        //=> typically used when reordering the collection module with sortable or when a column is removed
        if ( _.has( obj, 'collection' ) ) {
              //reset the collection
              module.czr_columnCollection.set(obj.collection);
              return;
        }

        if ( ! _.has(obj, 'column') ) {
          throw new Error('updateColumnCollection, no column provided in module ' + module.id + '. Aborting');
        }
        var column = _.clone(obj.column);

        if ( ! _.has(column, 'id') ) {
          throw new Error('updateColumnCollection, no id provided for a column in module' + module.id + '. Aborting');
        }
        //the module already exist in the collection
        if ( _.findWhere( _new_collection, { id : column.id } ) ) {
              _.each( _current_collection , function( _elt, _ind ) {
                    if ( _elt.id != column.id )
                      return;

                    //set the new val to the changed property
                    _new_collection[_ind] = column;
              });
        }
        //the module has to be added
        else {
              _new_collection.push(column);
        }

        //Inform the global column collection
        module.czr_columnCollection.set(_new_collection);
  },


  removeColumnFromCollection : function( column ) {
        var module = this,
            _current_collection = module.czr_columnCollection(),
            _new_collection = $.extend( true, [], _current_collection);

        _new_collection = _.filter( _new_collection, function( _col ) {
              return _col.id != column.id;
        } );

        module.czr_columnCollection.set(_new_collection);
  },




  //cb of control.czr_columnCollection.callbacks
  //The job of this function is to set the column collection in their respective sektItems
  columnCollectionReact : function( to, from ) {
        var module = this,
            is_column_added   = _.size(from) < _.size(to),
            is_column_removed = _.size(from) > _.size(to),
            is_column_update  = _.size(from) == _.size(to),
            //is_column_collection_sorted = _.isEmpty(_to_add) && _.isEmpty(_to_remove)  && ! is_column_update,
            _current_sek_model = {},
            _new_sek_model = {};

        //COLUMN UPDATE CASE
        //parse the columns and find the one that has changed.
        if ( is_column_update ) {
              _.each( to, function( _col, _key ) {
                    if ( _.isEqual( _col, from[_key] ) )
                      return;
                    _current_sek_model = _col.sektion();
                    _new_sek_model = $.extend(true, {}, _current_sek_model);

                    //find the column and update it
                    _.each( _current_sek_model.columns, function( _c, _k ){
                          if ( _c.id != _col.id )
                            return;
                          _new_sek_model.columns[_k] = _col;
                    } );

                    _col.sektion.set( _new_sek_model );

              } );//_.each
        }//end if column update


        //NEW COLUMN CASE
        if ( is_column_added ) {
              //find the new column
              var _new_column = _.filter( to, function( _col ){
                  return _.isUndefined( _.findWhere( from, { id : _col.id } ) );
              });

              _new_column = _new_column[0];
              _current_sek_model = _new_column.sektion();
              //only add the column if the column does not exist in the sektion columns.
              if ( _.isUndefined( _.findWhere( _current_sek_model.columns, {id : _new_column.id } ) ) ) {
                    _new_sek_model = $.extend(true, {}, _current_sek_model);
                    _new_sek_model.columns.push( _new_column );
                    _new_column.sektion.set( _new_sek_model );
              }

        }//end if new column case

        //COLUMN REMOVED
        if ( is_column_removed ) {
              //find the column to remove
              var _to_remove = _.filter( from, function( _col ){
                  return _.isUndefined( _.findWhere( to, { id : _col.id } ) );
              });
              _to_remove = _to_remove[0];

              _current_sek_model = _to_remove.sektion();
              _new_sek_model = $.extend(true, {}, _current_sek_model);//_.clone() is not enough there, we need a deep cloning.

              //remove the column from the sekItem model
              _new_sek_model.columns = _.filter( _new_sek_model.columns, function( _col ) {
                    return _col.id != _to_remove.id;
              } );

              _to_remove.sektion.set( _new_sek_model );

              //remove the column instance from module
              module.czr_Column.remove( _to_remove.id );
        }


        //refreshes the preview frame  :
        //1) only needed if transport is postMessage, because is triggered by wp otherwise
        //2) only needed when : add, remove, sort item(s)
        //module update case
        // if ( 'postMessage' == api(control.id).transport && ! api.CZR_Helpers.has_part_refresh( control.id ) ) {
        //     if ( is_collection_sorted )
        //         control.previewer.refresh();
        // }
  },



  //recursive
  generateColId : function( key, i ) {
        //prevent a potential infinite loop
        i = i || 1;
        if ( i > 100 ) {
              throw new Error('Infinite loop when generating of a column id.');
        }

        var module = this;
        key = key || module._getNextColKeyInCollection();

        var id_candidate = 'col_' + key;

        //do we have a column collection value ?
        if ( ! _.has(module, 'czr_columnCollection') || ! _.isArray( module.czr_columnCollection() ) ) {
              throw new Error('The column collection does not exist or is not properly set in module : ' + module.id );
        }
        //make sure the column is not already instantiated
        if ( module.czr_Column.has( id_candidate ) ) {
          return module.generateColId( key++, i++ );
        }

        return id_candidate;
  },


  //helper : return an int
  //=> the next available id of the column collection
  _getNextColKeyInCollection : function() {
        var module = this,
            _max_col_key = {},
            _next_key = 0;

        //get the initial key
        //=> if we already have a collection, extract all keys, select the max and increment it.
        //else, key is 0
        if ( ! _.isEmpty( module.czr_columnCollection() ) ) {
            _max_col_key = _.max( module.czr_columnCollection(), function( _col ) {
                return parseInt( _col.id.replace(/[^\/\d]/g,''), 10 );
            });
            _next_key = parseInt( _max_col_key.id.replace(/[^\/\d]/g,''), 10 ) + 1;
        }
        return _next_key;
  },


  //@return bool
  moduleExistsInOneColumnMax : function( module_id ) {
        return 2 > this.getModuleColumn( module_id ).length;
  },


  //@return an array of columns
  //=> a module can't be embedded in several columns at a time
  //if the returned array has more than one item, it should trigger an Error.
  getModuleColumn : function( module_id ) {
        var module = this,
            _mod_columns = [];
        _.each( module.czr_columnCollection(), function( _col, _key ) {
              if ( _.findWhere( _col.modules, { id : module_id } ) )
                _mod_columns.push( _col.id );
        });
        return _mod_columns;
  }

});//extends api.CZRDynModule
//This module populates the sektions setting.
//The each sektion is composed of columns (=> columns on front end)
//Each columns of modules ( => content module on front end like slider, text block, etc)

var CZRSektionMths = CZRSektionMths || {};

$.extend( CZRSektionMths, {
  /////////////////////////////////////////////////////////////////////////
  /// DRAGULA
  ////////////////////////////////////////////////////////////////////////
 initModulesDragula : function() {
        var module = this;

        //instantiate dragula without container => they will be pushed on module instantiation
        module.modsDragInstance = dragula({
            // copySortSource : function() {
            //   api.consoleLog('copy sort source', arguments);
            // },
            copy: function (el, source) {
              return $(el).hasClass( 'czr-module-candidate' );
            },
            moves: function (el, source, handle, sibling) {
                return _.contains( handle.className.split(' '), 'czr-mod-drag-handler' );
            },
            // invalidTarget : function(el, handle) {
            //     api.consoleLog('invalidTarget', el, handle );
            //     return false;
            // },
            accepts: function ( el, target, source, sibling ) {
                //disable drop in module panel
                // if ( $(target).hasClass('czr-available-modules-list') )
                //   return false;
                // if ( $(target).closest('.czr-single-item').hasClass('open') )
                //   return ! _.contains( target.className.split(' '), 'czr-dragula-fake-container' );
                //api.consoleLog('in accepts', target, $(target).attr('id') );
                return ! _.isUndefined(target) && 'czr-available-modules-list' != $(target).attr('id') ;
            },
            isContainer : function( el ) {
              //api.consoleLog('isContainer?', el);
              return false;
            }
        });//dragula


        //react to drag events
        module.modsDragInstance.on('drag', function( el, source ){
                module.czr_Item.each( function( _sektion ){
                      _sektion.czr_ItemState.set( 'expanded' != _sektion.czr_ItemState() ? 'expanded_noscroll' : 'expanded' );
                });
        }).on('dragend', function( el, source ){
                // module.czr_Item.each( function( _sektion ){
                //       _sektion.container.removeClass('czr-show-fake-container');
                // });
        }).on('drop', function(el, target, source, sibling ) {
              var _dropped_module_id = $(el).attr('data-module-id'),
                  _dropped_module_type = $(el).attr('data-module-type'),
                  _target_col = $(target).closest('.czr-column').attr('data-id'),
                  _source_col = $(source).closest('.czr-column').attr('data-id'),
                  is_reorder = _target_col == _source_col,
                  is_module_candidate = $(el).hasClass('czr-module-candidate');

              if ( is_module_candidate ) {
                  if ( _.isUndefined(_target_col) || _.isUndefined(_dropped_module_type ) )
                    return;

                  module.userAddedModule( _target_col, _dropped_module_type );
                  module.reorderModulesInColumn( _target_col );
              }
              else if ( is_reorder ) {
                  module.reorderModulesInColumn( _target_col );
              } else {
                  module.control.getSyncCollectionControl().czr_Module( _dropped_module_id ).modColumn.set( _target_col );
              }
        });

        //expand a closed sektion on over
        // module.modsDragInstance.on('over', function( el, container, source ) {
        //   api.consoleLog('OVERING', container );
        //       if ( $(container).hasClass('czr-dragula-fake-container') ) {
        //           //get the sekItem id
        //           _target_sekId = $(container).closest('[data-id]').attr('data-id');
        //           module.czr_Item(_target_sekId).czr_ItemState.set('expanded_noscroll');
        //       }
        // });

        //make sure the scroll down is working
        var scroll = autoScroller([
                     module.control.container.closest('.accordion-section-content')[0]
                  ],
                  {
                    direction: "vertical",
                    margin: 20,
                    pixels: 100,
                    scrollWhenOutside: true,
                    autoScroll: function(){
                        //Only scroll when the pointer is down, and there is a child being dragged.
                        return module.modsDragInstance.dragging;
                    }
                  }
        );
  },


 //fired on DOM user action
  //=> in the future, the module to instantiate will be stored in a pre module Value(), just like the pre Item idea
  //
  //Fired on column instanciation => to populate the saved module collection of this column
  //the defautAPIModuleModel looks like :
  //id : '',//module.id,
  // module_type : '',//module.module_type,
  // items   : [],//$.extend( true, {}, module.items ),
  // crud : false,
  // multi_item : false,
  // control : {},//control,
  // column_id : '',
  // sektion : {},// => the sektion instance
  // sektion_id : '',
  // is_added_by_user : false,
  userAddedModule : function( column_id, module_type  ) {
        var module = this,
            syncedCollectionControl = module.control.getSyncCollectionControl(),
            defautAPIModuleModel = _.clone( syncedCollectionControl.getDefaultModuleApiModel() );

        syncedCollectionControl.trigger(
              'user-module-candidate',
              $.extend( defautAPIModuleModel, {
                    module_type : module_type, //'czr_text_editor_module', //'czr_text_module',
                    column_id : column_id,//a string
                    sektion : module.czr_Column(column_id).sektion,//instance
                    sektion_id : module.czr_Column(column_id).sektion.id,
                    is_added_by_user : true
              } )
        );

  },



  reorderModulesInColumn : function( col_id ) {
        var module = this,
        //get the updated collection from the DOM and update the column module collection
            _new_dom_module_collection = module.czr_Column( col_id  ).getColumnModuleCollectionFromDom( col_id  );

        //close the module panel id needed
        // if ( _.has( api, 'czrModulePanelState') )
        //   api.czrModulePanelState(false);

        module.czr_Column( col_id ).updateColumnModuleCollection( { collection : _new_dom_module_collection } );
  },

  //@param module obj
  //@param source col string
  //@param target column string
  moveModuleFromTo : function( moved_module, source_column, target_column ) {
        api.consoleLog( 'ALORS CE BUG?', this(), this.czr_columnCollection() );
        var module = this,
            _new_dom_module_collection = module.czr_Column( target_column ).getColumnModuleCollectionFromDom( source_column );

        //close the module panel id needed
        if ( _.has( api, 'czrModulePanelState') )
          api.czrModulePanelState(false);

        //update the target column collection with the new collection read from the DOM
        module.czr_Column( target_column ).updateColumnModuleCollection( { collection : _new_dom_module_collection } );
        //remove module from old column module collection
        module.czr_Column( source_column ).removeModuleFromColumnCollection( moved_module );
  }
});//extends api.Value
var CZRSektionMths = CZRSektionMths || {};

$.extend( CZRSektionMths, {

    toggleModuleListPanel : function( obj ) {
          var module = this;
          // if ( 'pending' == api.czrModulePanelEmbedded.state() ) {
          //     $.when( module.renderModulePanel() ).done( function(){
          //         api.consoleLog('MODULE PANEL EMBEDDED!');
          //         api.czrModulePanelEmbedded.resolve();
          //     });
          // }



          //close the sek setting panel if needed
          api.czrSekSettingsPanelState.set(false);

          api.czrModulePanelState.set( ! api.czrModulePanelState() );


          //close all sektions but the one from which the button has been clicked
          if ( ! api.czrModulePanelState() ) {
              module.closeAllOtherSektions( $(obj.dom_event.currentTarget, obj.dom_el ) );
          } else {
              module.czr_Item.each( function( _sektion ){
                  _sektion.czr_ItemState.set( 'expanded' != _sektion.czr_ItemState() ? 'expanded_noscroll' : 'expanded' );
              });
          }
    },

    //fired once, on first expansion
    renderModulePanel : function() {
          var module = this;
          //do we have template script?
          if ( 0 === $( '#tmpl-czr-available-modules' ).length ) {
            throw new Error('No template found to render the module panel list' );
          }

          $('#widgets-left').after( $( wp.template( 'czr-available-modules' )() ) );

          _.each( api.czrModuleMap, function( _data, _mod_type ) {
                  var $_mod_candidate = $('<li/>', {
                        class : 'czr-module-candidate',
                        'data-module-type' : _mod_type,
                        html : '<h3><span class="czr-mod-drag-handler fa fa-arrows-alt"></span>' + _data.name + '</h3>'
                  });
                  $('#czr-available-modules-list').append(  $_mod_candidate );
          });
    }
});//$.extend
//extends api.Value
var CZRColumnMths = CZRColumnMths || {};

//extends api.Value
//a column is instanciated with the typical set of options :
// id : '',
// modules : [],
// sektion : {},//sektion instance
// module_id : '',
// control_id : '',
// is_added_by_user : false
$.extend( CZRColumnMths , {
    initialize: function( name, options ) {
          var column = this;
          api.Value.prototype.initialize.call( column, null, options );

          //write the options as properties, name is included
          $.extend( column, options || {} );

          column.isReady = $.Deferred();
          column.embedded = $.Deferred();

          //stores the column collection
          //set the initial value
          column.czr_columnModuleCollection = new api.Value();
          column.czr_columnModuleCollection.set( column.modules );

          //set the column instance value
          column.set( options );

          //the modules are stored only with their id in a column
          column.defautModuleModelInColumn = { id : '' };

          //api.consoleLog('column.sektion.contentRendered.state()', column.sektion.contentRendered.state() );

          //defer the column rendering when the parent sektion content is rendered
          column.sektion.bind( 'contentRendered', function() {
                //render the column
                column.container = column.render();
                api.consoleLog('COLUMN CONTAINER?', column.container );
                //say it
                column.embedded.resolve();
          });







          //when column is embedded :
          //=> setup the DOM event handler
          column.embedded.done(function() {
                //at this point, the question is : are the modules assigned to this column instantiated ?
                //if not => let's instantiate them. => this should not change the module collection czr_moduleCollection of the module-collection control
                //=> because they should already be registered in it
                column.mayBeInstantiateColumnModules();

                //react to column value changes
                column.callbacks.add( function() { return column.columnReact.apply(column, arguments ); } );

                //react to the column module collection changes
                column.czr_columnModuleCollection.callbacks.add( function() { return column.columnModuleCollectionReact.apply( column, arguments ); } );

                //Setup the column event listeners
                api.CZR_Helpers.setupDOMListeners(
                        column.column_event_map,//actions to execute
                        { dom_el : column.container },//dom scope
                        column//instance where to look for the cb methods
                );

                //dragulize
                var syncCollectionControl = api.control(column.control_id).getSyncCollectionControl();
                api.consoleLog('////////////////////////////////////////////////////');
                api.consoleLog('column.container?', column.container);
                api.consoleLog('syncCollectionControl.syncSektionModule()', syncCollectionControl.syncSektionModule()() );
                api.consoleLog('////////////////////////////////////////////////////');
                syncCollectionControl.syncSektionModule().modsDragInstance.containers.push( $('.czr-module-collection-wrapper', column.container )[0] );

          });
    },



    //overridable method
    //Fired if column is instantiated.
    ready : function() {
          var column = this;
          //=>allows us to use the following event base method : column.isReady.done( function() {} ):
          column.isReady.resolve();

          //push it to the module collection
          column.sektion.module.updateColumnCollection( {column : column() });
    },

    //fired on column embedded
    mayBeInstantiateColumnModules : function() {
          var column = this,
              syncedCollectionControl = column.sektion.control.getSyncCollectionControl();

          //when the module collection is synchronized, instantiate the module of this column
          //=>fire ready when the module column is embedded
          $.when( syncedCollectionControl.moduleCollectionReady.promise() ).then(
                function() {
                  _.each( column.czr_columnModuleCollection() , function( _mod ) {
                            //is this module already instantiated ?
                            if ( syncedCollectionControl.czr_Module.has(_mod.id) )
                              return;

                            //first let's try to get it from the collection
                            //var _module_candidate = _.findWhere( syncedCollectionControl.czr_moduleCollection() , { id : _mod.id } );
                            $.when( _.findWhere( syncedCollectionControl.czr_moduleCollection() , { id : _mod.id } ) ).done( function( module_candidate ) {
                                  if ( _.isUndefined( module_candidate) ||_.isEmpty( module_candidate ) ) {
                                    throw new Error( 'Module ' + _mod.id + ' was not found in the module collection.');
                                  }
                                  //we have a candidate. Let's instantiate it + fire ready()
                                  syncedCollectionControl.instantiateModule( module_candidate, {} ).ready();
                            });


                            //push it to the collection of the sektions control
                            //@todo => shall we make sure that the module has actually been instatiated by the module-collection control?
                            // if ( ! syncedCollectionControl.czr_Module.has( _module_candidate.id ) )
                            //   return;

                            //column.updateColumnModuleCollection( { module : _module_candidate });
                  } );
                },//done callback
                function() {},//fail callback
                function() {
                  api.consoleLog( 'NOT SYNCHRONIZED YET');
                }
          );//.then()
    },




    //fired on parent section 'contentRendered'
    render : function() {
          var column   = this;
          $view     = $( wp.template('czr-sektion-column')( {id: column.id}) );
          $view.appendTo( $('.czr-column-wrapper', column.sektion.container ) );
          return $view;
    },


    //cb of column.callbacks.add()
    //the job is this callback is to inform the parent sektion collection that something happened
    //typically, a module has been added
    columnReact : function( to ,from ) {
          var column = this;
          this.sektion.module.updateColumnCollection( {column : to });
    }
});//$.extend
//extends api.Value
var CZRColumnMths = CZRColumnMths || {};

//extends api.Value
//a column is instanciated with the typical set of options :
// id : '',
// modules : [],
// sektion : {},//sektion instance
// module_id : '',
// control_id : '',
// is_added_by_user : false
$.extend( CZRColumnMths , {
    updateColumnModuleCollection : function( obj ) {
            var column = this,
                _current_collection = column.czr_columnModuleCollection();
                _new_collection = $.extend( true, [], _current_collection );

            api.consoleLog('column.czr_columnModuleCollection()', column.czr_columnModuleCollection() );

            //if a collection is provided in the passed obj then simply refresh the collection
            //=> typically used when reordering the collection module with sortable or when a column is removed
            if ( _.has( obj, 'collection' ) ) {
                  //reset the collection
                  column.czr_columnModuleCollection.set(obj.collection);
                  return;
            }

            if ( ! _.has(obj, 'module') ) {
              throw new Error('updateColumnModuleCollection, no module provided in column ' + column.id + '. Aborting');
            }

            //1) The module id must be a not empty string
            //2) The module shall not exist in another column
            var module_ready_for_column_api = column.prepareModuleForColumnAPI( _.clone(obj.module) );


            //the module already exist in the collection
            if ( _.findWhere( _new_collection, { id : module_ready_for_column_api.id } ) ) {
                  _.each( _current_collection , function( _elt, _ind ) {
                          if ( _elt.id != module_ready_for_column_api.id )
                            return;

                          //set the new val to the changed property
                          _new_collection[_ind] = module_ready_for_column_api;
                  });
            }
            //otherwise,the module has to be added
            else {
                  _new_collection.push(module_ready_for_column_api);
            }

            //set the collection
            column.czr_columnModuleCollection.set( _new_collection );
    },


    //cb of : column.czr_columnModuleCollection.callbacks.add()
    //the job of this method is to update the column instance value with a new collection of modules
    columnModuleCollectionReact : function( to, from ) {
            var column = this,
                _current_column_model = column(),
                _new_column_model = _.clone( _current_column_model ),
                _new_module_collection = [];

            _.each( to , function( _mod, _key ) {
                _new_module_collection[_key] = { id : _mod.id };
            });

            //say it to the column instance
            _new_column_model.modules = _new_module_collection;
            column.set( _new_column_model );
    },

    //remove a module base on the id
    //Note that the module param can include various properties (depending on where this method is called from) that won't be used in this function
    removeModuleFromColumnCollection : function( module ) {
            var column = this,
                _current_collection = column.czr_columnModuleCollection();
                _new_collection = $.extend( true, [], _current_collection );

            _new_collection = _.filter( _new_collection, function( _mod ){
                return _mod.id != module.id;
            } );
            //set the collection
            column.czr_columnModuleCollection.set( _new_collection );
    },


    //column.defautModuleModelInColumn = { id : '' };
    prepareModuleForColumnAPI : function( module_candidate ) {
            if ( ! _.isObject( module_candidate ) ) {
                throw new Error('prepareModuleForColumnAPI : a module must be an object.');
            }
            var column = this,
                api_ready_module = {};

            _.each( column.defautModuleModelInColumn, function( _value, _key ) {
                    var _candidate_val = module_candidate[ _key ];
                    switch( _key ) {
                          case 'id' :
                            if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                                throw new Error('prepareModuleForColumnAPI : a module id must a string not empty');
                            }
                            if ( ! column.sektion.module.moduleExistsInOneColumnMax( module_candidate.id ) ) {
                                throw new Error('A module can not be embedded in more than one column at a time. Module ' + module_candidate.id + ' exists in several columns : ' +  column.sektion.module.getModuleColumn( module_candidate.id ).join(',') );
                            }
                            api_ready_module[ _key ] = _candidate_val;
                          break;
                    }//switch
            });//each
            return api_ready_module;
    },


    //@param old_col_id is the column in which the module was embedded before being move to the current one
    getColumnModuleCollectionFromDom : function( old_col_id ) {
            var column = this,
                $_moduleWrapper = $('.czr-module-collection-wrapper', column.container ),
                _previous_column_collection = column.sektion.module.czr_Column( old_col_id ).czr_columnModuleCollection(),
                _new_collection = [];

            api.consoleLog('in GET COLUMN MODULE COLLECTION FROM DOM', old_col_id, $_moduleWrapper, column.container );

            $('.czr-single-module', $_moduleWrapper).each( function( _index ) {
                  //If the current module el was already there
                  //=> push it in the new collection and loop next
                  if ( ! _.isUndefined( _.findWhere( column.czr_columnModuleCollection(), { id: $(this).attr('data-module-id') } ) ) ) {
                        _new_collection[_index] = _.findWhere( column.czr_columnModuleCollection(), { id: $(this).attr('data-module-id') } );
                        return;
                  }

                  var _module_obj = _.findWhere( _previous_column_collection, { id: $(this).attr('data-module-id') } );

                  //do we have a match in the existing collection ?
                  if ( ! _module_obj ) {
                      throw new Error('The module  : ' + $(this).attr('data-module-id') + ' was not found in the collection of its previous column ' + old_col_id );
                  }
                  _new_collection[_index] = column.prepareModuleForColumnAPI( _module_obj );
            });

            if ( _.isEmpty( _new_collection ) ) {
                throw new Error('There was a problem when re-building the column module collection from the DOM in column : ' + column.id );
            }
            return _new_collection;
    }
});//$.extend//extends api.Value
var CZRSektionMths = CZRSektionMths || {};

$.extend( CZRSektionMths, {

    toggleSekSettingsPanel : function( obj ) {
          var module = this;
          if ( 'pending' == api.czrSekSettingsPanelEmbedded.state() ) {
              $.when( module.renderSekSettingsPanel() ).done( function(){
                  api.czrSekSettingsPanelEmbedded.resolve();
              });
          }
          //close the module panel if needed
          api.czrModulePanelState.set( false );

          api.czrSekSettingsPanelState.set( ! api.czrSekSettingsPanelState() );

          //close all sektions but the one from which the button has been clicked
          module.closeAllOtherSektions( $(obj.dom_event.currentTarget, obj.dom_el ) );
    },

    //cb of api.czrSekSettingsPanelState.callbacks
    reactToSekSettingPanelState : function( expanded ) {
         $('body').toggleClass('czr-editing-sektion', expanded );
    },

    //fired once, on first expansion
    renderSekSettingsPanel : function() {
          var module = this,
              _tmpl = '';
          //do we have template script?
          if ( 0 === $( '#tmpl-czr-sektion-settings-panel' ).length ) {
            throw new Error('No template found to render the sektion setting panel' );
          }
          try {
            _tmpl = wp.template( 'czr-sektion-settings-panel' )();
          }
          catch(e) {
            throw new Error('Error when parsing the template of the sektion setting panel' + e );
          }
          $('#widgets-left').after( $( _tmpl ) );

          // _.each( api.czrModuleMap, function( _data, _mod_type ) {
          //         var $_mod_candidate = $('<li/>', {
          //               class : 'czr-module-candidate',
          //               'data-module-type' : _mod_type,
          //               html : '<h3><span class="czr-mod-drag-handler fa fa-arrows-alt"></span>' + _data.name + '</h3>'
          //         });
          //         $('#czr-available-modules-list').append(  $_mod_candidate );
          // });
    }
});//$.extend
(function ( api, $, _ ) {

//provides a description of each module
      //=> will determine :
      //1) how to initialize the module model. If not crud, then the initial item(s) model shall be provided
      //2) which js template(s) to use : if crud, the module template shall include the add new and pre-item elements.
      //   , if crud, the item shall be removable
      //3) how to render : if multi item, the item content is rendered when user click on edit button.
      //    If not multi item, the single item content is rendered as soon as the item wrapper is rendered.
      //4) some DOM behaviour. For example, a multi item shall be sortable.
      api.czrModuleMap = api.czrModuleMap || {};
      $.extend( api.czrModuleMap, {
            czr_sektion_module : {
                  mthds : CZRSektionMths,
                  crud : true,
                  name : 'Sektions'
            },
            czr_fp_module : {
                  mthds : CZRFeaturedPageModuleMths,
                  crud : true,
                  name : 'Featured Pages'
            },
            czr_slide_module : {
                  mthds : CZRSlideModuleMths,
                  crud : true,
                  name : 'Slider',
                  has_mod_opt : true
            },
            czr_text_module : {
                  mthds : CZRTextModuleMths,
                  crud : false,
                  multi_item : false,
                  name : 'Simple Text'
            },
            czr_text_editor_module : {
                  mthds : CZRTextEditorModuleMths,
                  crud : false,
                  multi_item : false,
                  name : 'WP Text Editor'
            }
      });

})( wp.customize, jQuery, _ );