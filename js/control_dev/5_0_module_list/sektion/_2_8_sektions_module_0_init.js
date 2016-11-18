//extends api.CZRDynModule
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
                            //       api.consoleLog('JOIE ?');
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

});