

var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {
      //fired in skopeBase initialize
      initWidgetSidebarSpecifics : function() {
            var self = this;
            if ( ! self.isExcludedSidebarsWidgets() ) {
                api.czr_activeSkopeId.bind( function( active_skope ) {
                    self.forceSidebarDirtyRefresh( api.czr_activeSectionId(), active_skope );
                });
            }

          //WHEN A WIDGET IS ADDED
          $( document ).bind( 'widget-added', function( e, $o ) {
              if ( self.isExcludedSidebarsWidgets() )
                  return;

              var wgtIdAttr = $o.closest('.customize-control').attr('id'),
                  //get the widget id from the customize-control id attr, and remove 'customize-control-' prefix to get the proper set id
                  wdgtSetId = api.czr_skopeBase.widgetIdToSettingId( wgtIdAttr, 'customize-control-' );
              if ( ! api.has( wdgtSetId ) ) {
                  throw new Error( 'AN ADDED WIDGET COULD NOT BE BOUND IN SKOPE. ' +  wdgtSetId);
              } else {
                  self.listenAPISettings( wdgtSetId );
              }
          });
      },


      forceSidebarDirtyRefresh : function( active_section, active_skope ) {
            var self = this;
            if ( self.isExcludedSidebarsWidgets() )
              return;
            var _save_state = api.state('saved')();

            //Specific for widget sidebars section
            var _debounced = function() {
                if ( api.section.has( active_section ) && "sidebar" == api.section(active_section).params.type ) {
                    var active_skope = active_skope || api.czr_activeSkopeId(),
                        related_setting_name = 'sidebars_widgets[' + api.section(active_section).params.sidebarId + ']',
                        related_setting_val = self.getSkopeSettingVal( related_setting_name, active_skope );

                    //api( related_setting_name )( self.getSkopeSettingVal( related_setting_name, api.czr_activeSkopeId() ) );
                    api.czr_skope( active_skope ).updateSkopeDirties( related_setting_name, related_setting_val );

                    api.previewer.refresh( { the_dirties : api.czr_skope( active_skope ).dirtyValues() } )
                          .done( function() {
                                api.state('saved')( _save_state );
                          });
                }
            };
            _debounced = _.debounce( _debounced, 500 );
            _debounced();
      }
} );//$.extend(