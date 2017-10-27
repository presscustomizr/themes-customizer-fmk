
( function ( api, $, _ ) {
      //SET THE ACTIVE STATE OF THE THEMES SECTION BASED ON WHAT THE SERVER SENT
      api.bind('ready', function() {
            var _do = function() {
                  api.section('themes').active.bind( function( active ) {
                        if ( ! _.has( serverControlParams, 'isThemeSwitchOn' ) || ! _.isEmpty( serverControlParams.isThemeSwitchOn ) )
                          return;
                        api.section('themes').active( serverControlParams.isThemeSwitchOn );
                        //reset the callbacks
                        api.section('themes').active.callbacks = $.Callbacks();
                  });
            };
            if ( api.section.has( 'themes') )
                _do();
            else
                api.section.when( 'themes', function( _s ) {
                      _do();
                });
      });



})( wp.customize , jQuery, _);
( function ( api, $, _ ) {
      /*****************************************************************************
      * DEFINE SOME USEFUL OBSERVABLE VALUES
      *****************************************************************************/
      //STORE THE CURRENTLY ACTIVE SECTION AND PANELS IN AN OBSERVABLE VALUE
      //BIND EXISTING AND FUTURE SECTIONS AND PANELS
      api.czr_activeSectionId = new api.Value('');
      api.czr_activePanelId = new api.Value('');

      /*****************************************************************************
      * OBSERVE UBIQUE CONTROL'S SECTIONS EXPANSION
      *****************************************************************************/
      if ( 'function' === typeof api.Section ) {
            //move controls back and forth in declared ubique sections
            //=> implemented in the customizr theme for the social links boolean visibility controls ( socials in header, sidebar, footer )
            api.control.bind( 'add', function( _ctrl ) {
                  if ( _ctrl.params.ubq_section && _ctrl.params.ubq_section.section ) {
                        //save original state
                        _ctrl.params.original_priority = _ctrl.params.priority;
                        _ctrl.params.original_section  = _ctrl.params.section;

                        api.section.when( _ctrl.params.ubq_section.section, function( _section_instance ) {
                                _section_instance.expanded.bind( function( expanded ) {
                                      if ( expanded ) {
                                            if ( _ctrl.params.ubq_section.priority ) {
                                                  _ctrl.priority( _ctrl.params.ubq_section.priority );
                                            }
                                            _ctrl.section( _ctrl.params.ubq_section.section );
                                      }
                                      else {
                                            _ctrl.priority( _ctrl.params.original_priority );
                                            _ctrl.section( _ctrl.params.original_section );
                                      }
                                });

                        } );
                  }
            });
      }


      /*****************************************************************************
      * OBSERVE UBIQUE CONTROL'S PANELS EXPANSION
      *****************************************************************************/
      if ( 'function' === typeof api.Panel ) {
            //move section back and forth in declared ubique panels
            api.section.bind( 'add', function( _sec ) {
                  if ( _sec.params.ubq_panel && _sec.params.ubq_panel.panel ) {
                        //save original state
                        _sec.params.original_priority = _sec.params.priority;
                        _sec.params.original_panel  = _sec.params.panel;

                        api.panel.when( _sec.params.ubq_panel.panel, function( _panel_instance ) {
                                _panel_instance.expanded.bind( function( expanded ) {
                                      if ( expanded ) {
                                            if ( _sec.params.ubq_panel.priority ) {
                                                  _sec.priority( _sec.params.ubq_panel.priority );
                                            }
                                            _sec.panel( _sec.params.ubq_panel.panel );
                                      }
                                      else {
                                            _sec.priority( _sec.params.original_priority );
                                            _sec.panel( _sec.params.original_panel );
                                      }
                                });

                        } );
                  }
            });
      }


      /*****************************************************************************
      * CLOSE THE MOD OPTION PANEL ( if exists ) ON : section change, panel change, skope switch
      *****************************************************************************/
      //@return void()
      var _closeModOpt = function() {
            if ( ! _.has( api, 'czr_ModOptVisible') )
              return;
            api.czr_ModOptVisible(false);
      };
      api.czr_activeSectionId.bind( _closeModOpt );
      api.czr_activePanelId.bind( _closeModOpt );

      /*****************************************************************************
      * OBSERVE SECTIONS AND PANEL EXPANSION
      * /store the current expanded section and panel
      *****************************************************************************/
      api.bind('ready', function() {
            if ( 'function' != typeof api.Section ) {
              throw new Error( 'Your current version of WordPress does not support the customizer sections needed for this theme. Please upgrade WordPress to the latest version.' );
            }
            var _storeCurrentSection = function( expanded, section_id ) {
                  api.czr_activeSectionId( expanded ? section_id : '' );
            };
            api.section.each( function( _sec ) {
                  _sec.expanded.bind( function( expanded ) { _storeCurrentSection( expanded, _sec.id ); } );
            });
            api.section.bind( 'add', function( section_instance ) {
                  api.trigger('czr-paint', { active_panel_id : section_instance.panel() } );
                  section_instance.expanded.bind( function( expanded ) { _storeCurrentSection( expanded, section_instance.id ); } );
            });

            var _storeCurrentPanel = function( expanded, panel_id ) {
                  api.czr_activePanelId( expanded ? panel_id : '' );
                  //if the expanded panel id becomes empty (typically when switching back to the root panel), make sure that no section is set as currently active
                  //=> fixes the problem of add_menu section staying expanded when switching back to another panel
                  if ( _.isEmpty( api.czr_activePanelId() ) ) {
                        api.czr_activeSectionId( '' );
                  }
            };
            api.panel.each( function( _panel ) {
                  _panel.expanded.bind( function( expanded ) { _storeCurrentPanel( expanded, _panel.id ); } );
            });
            api.panel.bind( 'add', function( panel_instance ) {
                  panel_instance.expanded.bind( function( expanded ) { _storeCurrentPanel( expanded, panel_instance.id ); } );
            });
      });


})( wp.customize , jQuery, _);
( function ( api, $, _ ) {
      /*****************************************************************************
      * ADD PRO BEFORE SPECIFIC SECTIONS AND PANELS
      *****************************************************************************/
      if ( serverControlParams.isPro ) {
            _.each( [
                  //WFC
                  'tc_font_customizer_settings',

                  //hueman pro
                  'header_image_sec',
                  'content_blog_sec',
                  'static_front_page',
                  'content_single_sec',

                  //customizr-pro
                  'tc_fpu',
                  'nav',
                  'post_lists_sec',
                  'custom_scripts_sec'

            ], function( _secId ) {
                  _.delay( function() {
                      api.section.when( _secId, function( _sec_ ) {
                            if ( 1 >= _sec_.headContainer.length ) {
                                _sec_.headContainer.find('.accordion-section-title').prepend( '<span class="pro-title-block">Pro</span>' );
                            }
                      });
                  }, 1000 );
            });
            _.each( [
                  //hueman pro
                  'hu-header-panel',
                  'hu-content-panel',

                  //customizr-pro
                  'tc-header-panel',
                  'tc-content-panel',
                  'tc-footer-panel',
                  'tc-advanced-panel'
            ], function( _secId ) {
                  api.panel.when( _secId, function( _sec_ ) {
                        if ( 1 >= _sec_.headContainer.length ) {
                            _sec_.headContainer.find('.accordion-section-title').prepend( '<span class="pro-title-block">Pro</span>' );
                        }
                  });
            });
      }


      /*****************************************************************************
      * PRO SECTION CONSTRUCTOR
      *****************************************************************************/
      if ( ! serverControlParams.isPro && _.isFunction( api.Section ) ) {
            proSectionConstructor = api.Section.extend( {
                  active : true,
                  // No events for this type of section.
                  attachEvents: function () {},
                  // Always make the section active.
                  isContextuallyActive: function () {
                    return this.active();
                  },
                  _toggleActive: function(){ return true; },

            } );

            $.extend( api.sectionConstructor, {
                  'czr-customize-section-pro' : proSectionConstructor
            });
      }
})( wp.customize , jQuery, _);
//extends api.CZRDynModule
var CZRSocialModuleMths = CZRSocialModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRSocialModuleMths, {
      initialize: function( id, options ) {
              var module = this;
              //run the parent initialize
              api.CZRDynModule.prototype.initialize.call( module, id, options );

              //extend the module with new template Selectors
              $.extend( module, {
                    itemPreAddEl : 'czr-module-social-pre-add-view-content',
                    itemInputList : 'czr-module-social-item-content',
                    modOptInputList : 'czr-module-social-mod-opt'
              } );


              this.social_icons = [
                '500px',
                'adn',
                'amazon',
                'android',
                'angellist',
                'apple',
                'behance',
                'behance-square',
                'bitbucket',
                'bitbucket-square',
                'black-tie',
                'btc',
                'buysellads',
                'chrome',
                'codepen',
                'codiepie',
                'connectdevelop',
                'contao',
                'dashcube',
                'delicious',
                'deviantart',
                'digg',
                'dribbble',
                'dropbox',
                'drupal',
                'edge',
                'empire',
                'envelope',
                'envelope-o',
                'envelope-square',
                'expeditedssl',
                'facebook',
                'facebook-f (alias)',
                'facebook-official',
                'facebook-square',
                'firefox',
                'flickr',
                'fonticons',
                'fort-awesome',
                'forumbee',
                'foursquare',
                'get-pocket',
                'gg',
                'gg-circle',
                'git',
                'github',
                'github-alt',
                'github-square',
                'gitlab',
                'git-square',
                'google',
                'google-plus',
                'google-plus-circle',
                'google-plus-official',
                'google-plus-square',
                'google-wallet',
                'gratipay',
                'hacker-news',
                'houzz',
                'instagram',
                'internet-explorer',
                'ioxhost',
                'joomla',
                'jsfiddle',
                'lastfm',
                'lastfm-square',
                'leanpub',
                'linkedin',
                'linkedin-square',
                'linux',
                'maxcdn',
                'meanpath',
                'medium',
                'mixcloud',
                'mobile',
                'modx',
                'odnoklassniki',
                'odnoklassniki-square',
                'opencart',
                'openid',
                'opera',
                'optin-monster',
                'pagelines',
                'paypal',
                'phone',
                'phone-square',
                'pied-piper',
                'pied-piper-alt',
                'pinterest',
                'pinterest-p',
                'pinterest-square',
                'product-hunt',
                'qq',
                'rebel',
                'reddit',
                'reddit-alien',
                'reddit-square',
                'renren',
                'rss',
                'rss-square',
                'safari',
                'scribd',
                'sellsy',
                'share-alt',
                'share-alt-square',
                'shirtsinbulk',
                'simplybuilt',
                'skyatlas',
                'skype',
                'slack',
                'slideshare',
                'snapchat',
                'soundcloud',
                'spotify',
                'stack-exchange',
                'stack-overflow',
                'steam',
                'steam-square',
                'stumbleupon',
                'stumbleupon-circle',
                'telegram',
                'tencent-weibo',
                'trello',
                'tripadvisor',
                'tumblr',
                'tumblr-square',
                'twitch',
                'twitter',
                'twitter-square',
                'usb',
                'viacoin',
                'vimeo',
                'vimeo-square',
                'vine',
                'vk',
                'weibo',
                'weixin',
                'whatsapp',
                'wikipedia-w',
                'windows',
                'wordpress',
                'xing',
                'xing-square',
                'yahoo',
                'y-combinator',
                'yelp',
                'youtube',
                'youtube-play',
                'youtube-square'
              ];
              //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
              module.inputConstructor = api.CZRInput.extend( module.CZRSocialsInputMths || {} );
              //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
              module.itemConstructor = api.CZRItem.extend( module.CZRSocialsItem || {} );

              //declares a default ModOpt model
              this.defaultModOptModel = {
                  is_mod_opt : true,
                  module_id : module.id,
                  'social-size' : serverControlParams.social_el_params.defaultSocialSize || 14
              };

              //declares a default model
              this.defaultItemModel = {
                    id : '',
                    title : '' ,
                    'social-icon' : '',
                    'social-link' : '',
                    'social-color' : serverControlParams.social_el_params.defaultSocialColor,
                    'social-target' : 1
              };

              //overrides the default success message
              this.itemAddedMessage = serverControlParams.i18n.socialLinkAdded;

              //fired ready :
              //1) on section expansion
              //2) or in the case of a module embedded in a regular control, if the module section is already opened => typically when skope is enabled
              if ( _.has( api, 'czr_activeSectionId' ) && module.control.section() == api.czr_activeSectionId() && 'resolved' != module.isReady.state() ) {
                    module.ready();
              }

              api.section( module.control.section() ).expanded.bind(function(to) {
                    //set module ready on section expansion
                    if ( 'resolved' != module.isReady.state() ) {
                          module.ready();
                    }
              });

              module.isReady.then( function() {
                    //specific update for the item preModel on social-icon change
                    module.preItem.bind( function( to, from ) {
                          if ( ! _.has(to, 'social-icon') )
                            return;
                          if ( _.isEqual( to['social-icon'], from['social-icon'] ) )
                            return;
                          module.updateItemModel( module.preItem, true );
                    });
              });
      },//initialize


      //ACTIONS ON ICON CHANGE
      //Fired on 'social-icon:changed'
      //Don't fire in pre item case
      //@item_instance an be the preItem or an already created item
      updateItemModel : function( item_instance, is_preItem ) {
              var item = item_instance;
              is_preItem = is_preItem || false;

              //check if we are in the pre Item case => if so, the social-icon might be empty
              if ( ! _.has( item(), 'social-icon') || _.isEmpty( item()['social-icon'] ) )
                return;

              var _new_model, _new_title, _new_color;

              _new_model  = $.extend( true, {}, item() );//always safer to deep clone ( alternative to _.clone() ) => we don't know how nested this object might be in the future
              _new_title  = this.getTitleFromIcon( _new_model['social-icon'] );
              _new_color  = serverControlParams.social_el_params.defaultSocialColor;
              if ( ! is_preItem && item.czr_Input.has( 'social-color' ) )
                _new_color = item.czr_Input('social-color')();

              //add text follow us... to the title
              _new_title = [ serverControlParams.i18n.followUs, _new_title].join(' ');

              if ( is_preItem ) {
                    _new_model = $.extend( _new_model, { title : _new_title, 'social-color' : _new_color } );
                    item.set( _new_model );
              } else {
                    item.czr_Input('title').set( _new_title );
                    //item.czr_Input('social-link').set( '' );
                    if ( item.czr_Input('social-color') ) { //optional
                      item.czr_Input('social-color').set( _new_color );
                    }
              }
      },

      /* Helpers */
      getTitleFromIcon : function( icon ) {
              return api.CZR_Helpers.capitalize( icon.replace('fa-', '').replace('envelope', 'email') );
      },

      getIconFromTitle : function( title ) {
              return  'fa-' . title.toLowerCase().replace('envelope', 'email');
      },







      CZRSocialsInputMths : {
              setupSelect : function() {
                    var input        = this,
                        item         = input.input_parent,
                        module       = input.module,
                        socialList   = module.social_icons,
                        _model       = item(),
                        //check if we are in the pre Item case => if so, the id is empty
                        is_preItem   = _.isEmpty( _model.id );

                    //=> add the select text in the pre Item case
                    if ( is_preItem ) {
                          socialList = _.union( [ serverControlParams.i18n.selectSocialIcon ], socialList );
                    }

                    //generates the options
                    _.each( socialList , function( icon_name, k ) {
                          // in the pre Item case the first select element is the notice "Select a social icon"
                          // doesn't need the fa-* class
                          var _value = ( is_preItem && 0 === k ) ? '' : 'fa-' + icon_name.toLowerCase(),
                              _attributes = {
                                    value : _value,
                                    html: module.getTitleFromIcon( icon_name )
                              };
                          if ( _value == _model['social-icon'] )
                            $.extend( _attributes, { selected : "selected" } );

                          $( 'select[data-type="social-icon"]', input.container ).append( $('<option>', _attributes) );
                    });

                    function addIcon( state ) {
                          if (! state.id) { return state.text; }
                          var $state = $(
                            '<span class="fa ' + state.element.value.toLowerCase() + '">&nbsp;&nbsp;' + state.text + '</span>'
                          );
                          return $state;
                    }

                    //fire select2
                    $( 'select[data-type="social-icon"]', input.container ).select2( {
                            templateResult: addIcon,
                            templateSelection: addIcon
                    });
            },

            setupColorPicker : function( obj ) {
                    var input      = this,
                        item       = input.input_parent,
                        module     = input.module,
                        $el        = $( 'input[data-type="social-color"]', input.container );

                    $el.iris( {
                              palettes: true,
                              hide:false,
                              defaultColor : serverControlParams.social_el_params.defaultSocialColor || 'rgba(255,255,255,0.7)',
                              change : function( e, o ) {
                                    //if the input val is not updated here, it's not detected right away.
                                    //weird
                                    //is there a "change complete" kind of event for iris ?
                                    //hack to reset the color to default...@todo => use another color picker.
                                    if ( _.has( o, 'color') && 16777215 == o.color._color )
                                      $(this).val( serverControlParams.social_el_params.defaultSocialColor || 'rgba(255,255,255,0.7)' );
                                    else
                                      $(this).val( o.color.toString() );

                                    $(this).trigger('colorpickerchange').trigger('change');
                              }
                    });

                    //when the picker opens, it might be below the visible viewport.
                    //No built-in event available to react on this in the wpColorPicker unfortunately
                    $el.closest('div').on('click keydown', function() {
                          module._adjustScrollExpandedBlock( input.container );
                    });
            }

      },//CZRSocialsInputMths









      CZRSocialsItem : {
              //Fired if the item has been instantiated
              //The item.callbacks are declared.
              ready : function() {
                    var item = this;
                    api.CZRItem.prototype.ready.call( item );

                    //update the item model on social-icon change
                    item.bind('social-icon:changed', function(){
                          item.module.updateItemModel( item );
                    });
              },


              _buildTitle : function( title, icon, color ) {
                      var item = this,
                          module     = item.module;

                      title = title || ( 'string' === typeof(icon) ? api.CZR_Helpers.capitalize( icon.replace( 'fa-', '') ) : '' );
                      title = api.CZR_Helpers.truncate(title, 20);
                      icon = icon || 'fa-' + module.social_icons[0];
                      color = color || serverControlParams.social_el_params.defaultSocialColor;

                      return '<div><span class="fa ' + icon + '" style="color:' + color + '"></span> ' + title + '</div>';
              },

              //overrides the default parent method by a custom one
              //at this stage, the model passed in the obj is up to date
              writeItemViewTitle : function( model ) {
                      var item = this,
                          module     = item.module,
                          _model = model || item(),
                          _title = module.getTitleFromIcon( _model['social-icon'] );

                      $( '.' + module.control.css_attr.item_title , item.container ).html(
                        item._buildTitle( _title, _model['social-icon'], _model['social-color'] )
                      );
              }
      },//CZRSocialsItem
});//$.extend
})( wp.customize , jQuery, _ );//extends api.CZRDynModule

var CZRWidgetAreaModuleMths = CZRWidgetAreaModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRWidgetAreaModuleMths, {
      initialize: function( id, constructorOptions ) {
              var module = this;

              api.CZRDynModule.prototype.initialize.call( this, id, constructorOptions );

              //extend the module with new template Selectors
              $.extend( module, {
                    itemPreAddEl : 'czr-module-widgets-pre-add-view-content',
                    itemInputList : 'czr-module-widgets-item-input-list',
                    itemInputListReduced : 'czr-module-widgets-item-input-list-reduced',
                    ruItemPart : 'czr-module-widgets-ru-item-part'
              } );

              //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
              module.inputConstructor = api.CZRInput.extend( module.CZRWZonesInputMths || {} );
              //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
              module.itemConstructor = api.CZRItem.extend( module.CZRWZonesItem || {} );

              module.serverParams = serverControlParams.widget_area_el_params || {};

              //add a shortcut to the server side json properties
              module.contexts = _.has( module.serverParams , 'sidebar_contexts') ? module.serverParams.sidebar_contexts : {};

              //context match map
              module.context_match_map = {
                      is_404 : '404',
                      is_category : 'archive-category',
                      is_home : 'home',
                      is_page : 'page',
                      is_search : 'search',
                      is_single : 'single'
              };


              module.locations = _.has( module.serverParams , 'sidebar_locations') ? module.serverParams.sidebar_locations : {};

              //declares a default model
              module.defaultItemModel = {
                      id : '',
                      title : serverControlParams.i18n.widgetZone,
                      contexts : _.without( _.keys(module.contexts), '_all_' ),//the server list of contexts is an object, we only need the keys, whitout _all_
                      locations : [ module.serverParams.defaultWidgetLocation ],
                      description : ''
              };

              //overrides the default success message
              this.itemAddedMessage = serverControlParams.i18n.widgetZoneAdded;

              //Observe and react to sidebar insights from the preview frame
              // SIDEBAR INSIGHTS => stores and observes the sidebars and widgets settings sent by the preview */
              if ( ! _.has( api, 'sidebar_insights' ) ) {
                    api.sidebar_insights = new api.Values();
                    api.sidebar_insights.create('candidates');//will store the sidebar candidates on preview refresh
                    api.sidebar_insights.create('actives');//will record the refreshed active list of active sidebars sent from the preview
                    api.sidebar_insights.create('inactives');
                    api.sidebar_insights.create('registered');
                    api.sidebar_insights.create('available_locations');
              }


              this.listenToSidebarInsights();

              //React on 'houston-widget-settings'
              //actives :  data.renderedSidebars,
              // inactives :  _inactives,
              // registered :  _registered,
              // candidates :  _candidates,
              // available_locations :  data.availableWidgetLocations//built server side
              api.czr_widgetZoneSettings = api.czr_widgetZoneSettings || new api.Value();
              api.czr_widgetZoneSettings.bind( function( updated_data_sent_from_preview , from ) {
                      module.isReady.then( function() {
                            _.each( updated_data_sent_from_preview, function( _data, _key ) {
                                  api.sidebar_insights( _key ).set( _data );
                            });
                      });
              });




              //AVAILABLE LOCATIONS FOR THE PRE MODEL
              //1) add an observable value to module.preItem to handle the alert visibility
              module.preItem_location_alert_view_state = new api.Value( 'closed');
              //2) add state listeners
              module.preItem_location_alert_view_state.callbacks.add( function( to, from ) {
                        module._toggleLocationAlertExpansion( module.container, to );
              });


              //REACT ON ADD / REMOVE ITEMS
              module.bind( 'item-added', function( model ) {
                      module.addWidgetSidebar( model );
              });

              module.bind( 'pre_item_api_remove' , function(model) {
                      module.removeWidgetSidebar( model );
              });


              //records the top margin value of the widgets panel on each expansion
              var fixTopMargin = new api.Values();
              fixTopMargin.create('fixed_for_current_session');
              fixTopMargin.create('value');

              api.section(module.serverParams.dynWidgetSection).fixTopMargin = fixTopMargin;
              api.section(module.serverParams.dynWidgetSection).fixTopMargin('fixed_for_current_session').set(false);


              //setup reactions on widget section expansion
              //change the expanded behaviour for the widget zone section
              //api.section(module.serverParams.dynWidgetSection).expanded.callbacks.add( function() { return module.widgetSectionReact.apply(module, arguments ); } );

              //bind actions on widget panel expansion and widget zone section expansion
              //Fire the module
              api.panel('widgets').expanded.callbacks.add( function(to, from) {
                    module.widgetPanelReact();//setup some visual adjustments, must be ran each time panel is closed or expanded

                    //Fire the module if not done already
                    if ( 'resolved' == module.isReady.state() )
                      return;
                    module.ready();
              });
      },//initialize




      //When the control is embedded on the page, this method is fired in api.CZRBaseModuleControl:ready()
      //=> right after the module is instantiated.
      ready : function() {
              var module = this;
              api.CZRDynModule.prototype.ready.call( module );

              //add state listener on pre Item view
              module.preItemExpanded.callbacks.add( function( to, from ) {
                    if ( ! to )
                      return;
                    //refresh the location list
                    module.preItem.czr_Input('locations')._setupLocationSelect( true );//true for refresh
                    //refresh the location alert message
                    module.preItem.czr_Input('locations').mayBeDisplayModelAlert();
              });
      },



      //overrides parent method
      //adds the default widget zones in the items
      initializeModuleModel : function( constructorOptions ) {
                  var module = this, dfd = $.Deferred();
                  constructorOptions.items = _.union( _.has( module.serverParams, 'default_zones' ) ? module.serverParams.default_zones : [], constructorOptions.items );
                  return dfd.resolve( constructorOptions ).promise();
      },
















      CZRWZonesInputMths : {
            ready : function() {
                    var input = this;

                    input.bind('locations:changed', function(){
                        input.mayBeDisplayModelAlert();
                    });

                    api.CZRInput.prototype.ready.call( input);
            },



            //////////////////////////////////////////////////
            ///SETUP SELECTS
            //////////////////////////////////////////////////
            //setup select on view_rendered|item_content_event_map
            setupSelect : function() {
                    var input      = this;
                    if ( 'locations' == this.id )
                      this._setupLocationSelect();
                    if ( 'contexts' == this.id )
                      this._setupContextSelect();

            },

            //helper
            _setupContextSelect : function() {
                    var input      = this,
                        input_contexts = input(),
                        item = input.input_parent,
                        module     = input.module;

                    //generates the contexts options
                    _.each( module.contexts, function( title, key ) {
                          var _attributes = {
                                value : key,
                                html: title
                              };
                          if ( key == input_contexts || _.contains( input_contexts, key ) )
                            $.extend( _attributes, { selected : "selected" } );

                          $( 'select[data-type="contexts"]', input.container ).append( $('<option>', _attributes) );
                    });
                    //fire select2
                    $( 'select[data-type="contexts"]', input.container ).select2();
            },


            //helper
            //the refresh param is a bool
            _setupLocationSelect : function(refresh ) {
                    var input      = this,
                        input_locations = input(),
                        item = input.input_parent,
                        module     = input.module,
                        available_locs = api.sidebar_insights('available_locations')();

                    //generates the locations options
                    //append them if not set yet
                    if ( ! $( 'select[data-type="locations"]', input.container ).children().length ) {
                          _.each( module.locations, function( title, key ) {
                                var _attributes = {
                                      value : key,
                                      html: title
                                    };

                                if ( key == input_locations || _.contains( input_locations, key ) )
                                  $.extend( _attributes, { selected : "selected" } );

                                $( 'select[data-type="locations"]', input.container ).append( $('<option>', _attributes) );
                          });
                    }//if

                    function setAvailability( state ) {
                          if (! state.id) { return state.text; }
                          if (  _.contains(available_locs, state.element.value) ) { return state.text; }
                          var $state = $(
                            '<span class="czr-unavailable-location fa fa-ban" title="' + serverControlParams.i18n.unavailableLocation + '">&nbsp;&nbsp;' + state.text + '</span>'
                          );
                          return $state;
                    }

                    if ( refresh ) {
                          $( 'select[data-type="locations"]', input.container ).select2( 'destroy' );
                    }

                    //fire select2
                    $( 'select[data-type="locations"]', input.container ).select2( {
                      templateResult: setAvailability,
                      templateSelection: setAvailability
                    });
            },

            //fired on view event map : 'locations:changed'
            //@param obj { dom_el: $() , model : {} )
            mayBeDisplayModelAlert : function() {
                    var input      = this,
                        item = input.input_parent,
                        module     = input.module;

                    //check if we are in the pre Item case => if so, the locations might be empty
                    if ( ! _.has( item(), 'locations') || _.isEmpty( item().locations ) )
                      return;

                    var _selected_locations = $('select[data-type="locations"]', input.container ).val(),
                        available_locs = api.sidebar_insights('available_locations')(),
                        _unavailable = _.filter( _selected_locations, function( loc ) {
                          return ! _.contains(available_locs, loc);
                        });

                    //check if we are in the pre Item case => if so, the id is empty
                    if ( ! _.has( item(), 'id' ) || _.isEmpty( item().id ) ) {
                          module.preItem_location_alert_view_state.set( ! _.isEmpty( _unavailable ) ? 'expanded' : 'closed' );
                    } else {
                          item.czr_itemLocationAlert.set( ! _.isEmpty( _unavailable ) ? 'expanded' : 'closed' );
                    }
            }
      },//CZRWZonesInputMths















      CZRWZonesItem : {
            initialize : function( id, options ) {
                    var item = this,
                        module = item.module;

                    //Add some observable values for this item
                    item.czr_itemLocationAlert = new api.Value();

                    api.CZRItem.prototype.initialize.call( item, null, options );
            },



            //extend parent setupview
            itemWrapperViewSetup : function() {
                    var item = this,
                        module = item.module;

                    api.CZRItem.prototype.itemWrapperViewSetup.call(item);

                    /// ALERT FOR NOT AVAILABLE LOCATION
                    item.czr_itemLocationAlert.set('closed');

                    //add a state listener on expansion change
                    item.czr_itemLocationAlert.callbacks.add( function( to, from ) {
                          module._toggleLocationAlertExpansion( item.container , to );
                    });

                    //update item title
                    item.writeSubtitleInfos(item());

                    //this is fired just after the itemWrapperViewSetupApiListeners
                    //=> add a callback to refresh the availability status of the locations in the select location picker
                    //add a state listener on expansion change
                    item.viewState.callbacks.add( function( to, from ) {
                          if ( -1 == to.indexOf('expanded') )//can take the expanded_noscroll value !
                            return;
                          //don't try to invoke the input instances before the content is actually rendered
                          //=> there might be cases when the content rendering is debounced...
                          item.bind('contentRendered', function() {
                                //refresh the location list
                                item.czr_Input('locations')._setupLocationSelect( true );//true for refresh
                                //refresh the location alert message
                                item.czr_Input('locations').mayBeDisplayModelAlert();
                          });

                    });
            },


            //extend parent listener
            itemReact : function(to, from) {
                    var item = this;
                    api.CZRItem.prototype.itemReact.call(item, to, from);

                    item.writeSubtitleInfos(to);
                    item.updateSectionTitle(to).setModelUpdateTimer();
            },



            //Fired in setupItemListeners. Reacts to model change.
            //Write html informations under the title : location(s) and context(s)
            writeSubtitleInfos : function(model) {
                    var item = this,
                        module = item.module,
                        _model = _.clone( model || item() ),
                        _locations = [],
                        _contexts = [],
                        _html = '';

                    if ( ! item.container.length )
                      return this;

                    //generate the locations and the contexts text from the json data if exists
                    _model.locations =_.isString(_model.locations) ? [_model.locations] : _model.locations;
                    _.each( _model.locations, function( loc ) {
                          if ( _.has( module.locations , loc ) )
                            _locations.push(module.locations[loc]);
                          else
                            _locations.push(loc);
                      }
                    );

                    //build the context list
                    _model.contexts =_.isString(_model.contexts) ? [_model.contexts] : _model.contexts;

                    //all contexts cases ?
                    if ( item._hasModelAllContexts( model ) ) {
                      _contexts.push(module.contexts._all_);
                    } else {
                      _.each( _model.contexts, function( con ) {
                              if ( _.has( module.contexts , con ) )
                                _contexts.push(module.contexts[con]);
                              else
                                _contexts.push(con);
                            }
                      );
                    }

                    //Translated strings
                    var _locationText = serverControlParams.i18n.locations,
                        _contextText = serverControlParams.i18n.contexts,
                        _notsetText = serverControlParams.i18n.notset;

                    _locations = _.isEmpty( _locations ) ? '<span style="font-weight: bold;">' + _notsetText + '</span>' : _locations.join(', ');
                    _contexts = _.isEmpty( _contexts ) ? '<span style="font-weight: bold;">' + _notsetText + '</span>' : _contexts.join(', ');

                    //write the description if builtin
                    //else, write the dynamic location
                    // if ( _.has(_model, 'description') && _.has(_model, 'is_builtin') )
                    //   _html =  _model.description + ' <strong>|</strong> <u>Contexts</u> : ' + _contexts;
                    // else

                    _html = '<u>' + _locationText + '</u> : ' + _locations + ' <strong>|</strong> <u>' + _contextText + '</u> : ' + _contexts;

                    if ( ! $('.czr-zone-infos', item.container ).length ) {
                          var $_zone_infos = $('<div/>', {
                            class : [ 'czr-zone-infos' , module.control.css_attr.item_sort_handle ].join(' '),
                            html : _html
                          });
                          $( '.' + module.control.css_attr.item_btns, item.container ).after($_zone_infos);
                    } else {
                          $('.czr-zone-infos', item.container ).html(_html);
                    }

                    return this;
            },//writeSubtitleInfos



            ////Fired in setupItemListeners
            updateSectionTitle : function(model) {
                    var _sidebar_id = 'sidebar-widgets-' + model.id,
                        _new_title  = model.title;
                    //does this section exists ?
                    if ( ! api.section.has(_sidebar_id) )
                      return this;

                    //update the section title
                    $('.accordion-section-title', api.section(_sidebar_id).container ).text(_new_title);

                    //update the top title ( visible when inside the expanded section )
                    $('.customize-section-title h3', api.section(_sidebar_id).container ).html(
                      '<span class="customize-action">' + api.section(_sidebar_id).params.customizeAction + '</span>' + _new_title
                    );
                    // $('.customize-section-title h3', api.section(_sidebar_id).container )
                    //   .append('<span>', {
                    //       class: 'customize-section-back',
                    //       html: api.section(_sidebar_id).params.customizeAction
                    //     } )
                    //   .append(_new_title);

                    //remove and re-instanciate
                    //=> works for the section but the controls are not activated anymore.
                    //Should be easy to fix but useless to go further here. Jquery does the job.
                    // var _params = _.clone( api.section(_sidebar_id).params );
                    // _params.title = _new_title;
                    // api.section(_sidebar_id).container.remove();
                    // api.section.remove(_sidebar_id);
                    // api.section.add( _sidebar_id, new api.sectionConstructor[_params.type]( _params.id ,{ params : _params } ) );
                    return this;
            },


            //fired on model_update
            //Don't hammer the preview with too many refreshs
            //2 seconds delay
            setModelUpdateTimer : function() {
                    var item = this,
                        module = item.module;

                    clearTimeout( $.data(this, 'modelUpdateTimer') );
                    $.data(
                        this,
                        'modelUpdateTimer',
                        setTimeout( function() {
                            //refresh preview
                            module.control.refreshPreview();
                        } , 1000)
                    );//$.data
            },


            //@return bool
            //takes the model unique id
            _hasModelAllContexts : function( model ) {
                    var item = this,
                        module = item.module,
                        moduleContexts = _.keys(module.contexts);

                    model = model || this();

                    if ( ! _.has(model, 'contexts') )
                      return;

                    if ( _.contains( model.contexts, '_all_') )
                      return true;

                    //case when model does not have _all_ but all the others
                    return _.isEmpty( _.difference( _.without(moduleContexts, '_all_') , model.contexts ) );
            },

            //@param contexts = array of contexts
            //api.czr_wpQueryInfos is refreshed on each preview refresh
            _getMatchingContexts : function( defaults ) {
                    var module = this,
                        _current = api.czr_wpQueryInfos().conditional_tags || {},
                        _matched = _.filter( module.context_match_map, function( hu, wp ) { return true === _current[wp]; } );

                    return _.isEmpty( _matched ) ? defaults : _matched;
            }
      },//CZRWZonesItem














      //DEPRECATED : THE CONTROLS TO SYNCHRONIZE HAVE BEEN REMOVED

      //fired on model_added_by_user and from the timer method
      //1) model_added, before renderItemWrapper action
      //    when a new model is manually added ( isTrigger is undefined )
      //    => refresh the select options of the other controls using this collection
      //2) model_updated, before updateCollection
      // addControlOptions : function(obj) {
      //   var _controls = _.where( api.settings.controls, {section:"sidebars_select_sec"});
      //   _.map( _controls, function( _control ) {
      //       var $_select = api.control( _control.settings.default ).container.find('select');

      //       //if this option has already been added, simply updates its attributes
      //       if ( 1 === $_select.find('option[value="' + obj.model.id + '"]').length ) {
      //         $_select.find('option[value="' + obj.model.id + '"]').html(obj.model.title);
      //         $_select.selecter("destroy").selecter();
      //       } else {
      //         $_select.append( $('<option>', {value: obj.model.id, html:obj.model.title } ) ).selecter("destroy").selecter();
      //       }
      //   });//map
      // },

      //fired on model_removed
      // removeControlOptions : function(obj) {
      //   var _controls = _.where( api.settings.controls, {section:"sidebars_select_sec"});

      //   _.map( _controls, function( _control ) {
      //       var $_select = api.control( _control.settings.default ).container.find('select');

      //       if ( ! $_select.find('option[value="' + obj.model.id + '"]').length )
      //         return;

      //       $( 'option[value="' + obj.model.id +'"]', $_select).remove();
      //       $_select.selecter("destroy").selecter();
      //   });//map
      // },












      /////////////////////////////////////////
      /// ADD / REMOVE WIDGET ZONES
      ////////////////////////////////////////
      //fired on model_added_by_user
      //
      //can also be called statically when a dynamic sidebar is added in the preview
      //in this case the parameter are the sidebar data with id and name
      addWidgetSidebar : function( model, sidebar_data ) {
            if ( ! _.isObject(model) && _.isEmpty(sidebar_data) ) {
                  throw new Error('No valid input were provided to add a new Widget Zone.');
            }


            //ADD the new sidebar to the existing collection
            //Clone the serverControlParams.defaultWidgetSidebar sidebar
            var module = this,
                _model        = ! _.isEmpty(model) ? _.clone(model) : sidebar_data,
                _new_sidebar  = _.isEmpty(model) ? sidebar_data : $.extend(
                      _.clone( _.findWhere( api.Widgets.data.registeredSidebars, { id: module.serverParams.defaultWidgetSidebar } ) ),
                      {
                            name : _model.title,
                            id : _model.id
                      }
                );

            //Add it to the backbone collection
            api.Widgets.registeredSidebars.add( _new_sidebar );

            //test if added:
            //api.Widgets.registeredSidebars('czr_sidebars_8');


            //ADD the sidebar section
            var _params = $.extend(
                    _.clone( api.section( "sidebar-widgets-" + module.serverParams.defaultWidgetSidebar ).params ),
                    {
                          id : "sidebar-widgets-" + _model.id,
                          instanceNumber: _.max(api.settings.sections, function(sec){ return sec.instanceNumber; }).instanceNumber + 1,
                          sidebarId: _new_sidebar.id,
                          title: _new_sidebar.name,
                          description : 'undefined' != typeof(sidebar_data) ? sidebar_data.description : api.section( "sidebar-widgets-" + module.serverParams.defaultWidgetSidebar ).params.description,
                          //always set the new priority to the maximum + 1 ( module.serverParams.dynWidgetSection is excluded from this calculation because it must always be at the bottom )
                          priority: _.max( _.omit( api.settings.sections, module.serverParams.dynWidgetSection), function(sec){ return sec.instanceNumber; }).priority + 1,
                    }
            );

            api.section.add( _params.id, new api.sectionConstructor[ _params.type ]( _params.id ,{ params : _params } ) );

            //add it to the static collection of settings
            api.settings.sections[ _params.id ] = _params.id;

            //ADD A SETTING
            //Clone the module.serverParams.defaultWidgetSidebar sidebar widget area setting
            var _new_set_id = 'sidebars_widgets['+_model.id+']',
                _new_set    = $.extend(
                      _.clone( api.settings.settings['sidebars_widgets[' + module.serverParams.defaultWidgetSidebar + ']'] ),
                      {
                            value:[]
                      }
                );

            //add it to the static collection of settings
            api.settings.settings[ _new_set_id ] = _new_set;

            //instanciate it
            api.create( _new_set_id, _new_set_id, _new_set.value, {
                    transport: _new_set.transport,
                    previewer: api.previewer,
                    dirty: false
            } );



            //ADD A CONTROL
            var _cloned_control = $.extend(
                      _.clone( api.settings.controls['sidebars_widgets[' + module.serverParams.defaultWidgetSidebar + ']'] ),
                      {
                        settings : { default : _new_set_id }
                  }),
                _new_control = {};


            //replace  serverControlParams.defaultWidgetSidebar  by the new sidebar id
            _.each( _cloned_control, function( param, key ) {
                    if ( 'string' == typeof(param) ) {
                      param = param.replace( module.serverParams.defaultWidgetSidebar , _model.id );
                    }
                    _new_control[key] = param;
            });

            //set the instance number (no sure if needed)
            _new_control.instanceNumber = _.max(api.settings.controls, function(con){ return con.instanceNumber; }).instanceNumber + 1;

            //add it to the static collection of controls
            api.settings.controls[_new_set_id] = _new_control;

            //instanciate it
            api.control.add( _new_set_id, new api.controlConstructor[ _new_control.type ]( _new_set_id, {
                    params: _new_control,
                    previewer: api.previewer
            } ) );


            //say it to the control container
            //only if we are in an instanciated object => because this method can be accessed statically
            if ( _.has(this, 'container') )
              this.container.trigger( 'widget_zone_created', { model : _model, section_id : "sidebar-widgets-" + _model.id , setting_id : _new_set_id });
      },//addWidgetSidebar


      //fired on "after_modelRemoved"
      removeWidgetSidebar : function( model ) {
            var module = this;
            if ( ! _.isObject(model) || _.isEmpty(model) ) {
                  throw new Error('No valid data were provided to remove a Widget Zone.');
            }

            //Remove this sidebar from the backbone collection
            api.Widgets.registeredSidebars.remove( model.id );

            //remove the section from the api values and the DOM if exists
            if ( api.section.has("sidebar-widgets-" + model.id) ) {
                    //Remove the section container from the DOM
                    api.section("sidebar-widgets-" + model.id).container.remove();
                    //Remove the sidebar section from the api
                    api.section.remove( "sidebar-widgets-" + model.id );
                    //Remove this section from the static collection
                    delete api.settings.sections[ "sidebar-widgets-" + model.id ];
            }

            //remove the setting from the api if exists
            if ( api.has('sidebars_widgets['+model.id+']') ) {
                    //Remove this setting from the api
                    api.remove( 'sidebars_widgets['+model.id+']' );
                    //Remove this setting from the static collection
                    delete api.settings.settings['sidebars_widgets['+model.id+']'];
            }

            //remove the widget control of this sidebar from the api and the DOM if exists
            if ( api.control.has('sidebars_widgets['+model.id+']') ) {
                    //Remove the control container from the DOM
                    api.control( 'sidebars_widgets['+model.id+']' ).container.remove();
                    //Remove this control from the api
                    api.control.remove( 'sidebars_widgets['+model.id+']' );
                    //Remove it to the static collection of controls
                    delete api.settings.controls['sidebars_widgets['+model.id+']'];
            }

            //refresh
            var _refresh = function() {
              api.previewer.refresh();
            };
            _refresh = _.debounce( _refresh, 500 );
            $.when( _refresh() ).done( function() {
                  //say it
                  module.trigger( 'widget_zone_removed',
                        {
                              model : model,
                              section_id : "sidebar-widgets-" + model.id ,
                              setting_id : 'sidebars_widgets['+model.id+']'
                        }
                  );
            });
      },











      /////////////////////////////////////////
      /// SET EXPANSION CALLBACKS FOR WIDGET PANEL AND WIDGET ZONE CREATION SECTION
      ////////////////////////////////////////
      //cb of : api.panel('widgets').expanded.callbacks.add
      widgetPanelReact : function() {
            var module = this;
            //will be used for adjustments
            var _top_margin = api.panel('widgets').container.find( '.control-panel-content' ).css('margin-top');

            api.section(module.serverParams.dynWidgetSection).fixTopMargin('value').set( _top_margin );

            var _section_content = api.section(module.serverParams.dynWidgetSection).container.find( '.accordion-section-content' ),
              _panel_content = api.panel('widgets').container.find( '.control-panel-content' ),
              _set_margins = function() {
                    _section_content.css( 'margin-top', '' );
                    _panel_content.css('margin-top', api.section(module.serverParams.dynWidgetSection).fixTopMargin('value')() );
              };

            // Fix the top margin after reflow.
            api.bind( 'pane-contents-reflowed', _.debounce( function() {
                  _set_margins();
            }, 150 ) );

            //Close all views on widget panel expansion/clos
            module.closeAllItems().closeRemoveDialogs();
            //Close preItem dialog box if exists
            if ( _.has( module, 'preItemExpanded' ) )
              module.preItemExpanded.set(false);
      },//widgetPanelReact()


      //cb of api.section(module.serverParams.dynWidgetSection).expanded.callbacks
      widgetSectionReact : function( to, from ) {
            var module = this,
                section =  api.section(module.serverParams.dynWidgetSection),
                container = section.container.closest( '.wp-full-overlay-sidebar-content' ),
                content = section.container.find( '.accordion-section-content' ),
                overlay = section.container.closest( '.wp-full-overlay' ),
                backBtn = section.container.find( '.customize-section-back' ),
                sectionTitle = section.container.find( '.accordion-section-title' ).first(),
                headerActionsHeight = $( '#customize-header-actions' ).height(),
                resizeContentHeight, expand, position, scroll;

            if ( to ) {
                  overlay.removeClass( 'section-open' );
                  content.css( 'height', 'auto' );
                  //section.container.removeClass( 'open' );
                  sectionTitle.attr( 'tabindex', '0' );
                  content.css( 'margin-top', '' );
                  container.scrollTop( 0 );
            }

            module.closeAllItems().closeRemoveDialogs();

            content.slideToggle();
      },







      /////////////////////////////////////////
      /// LISTEN TO SIDEBAR INSIGHTS FROM THE PREVIEW FRAME
      /// REACT TO THEM
      ////////////////////////////////////////
      listenToSidebarInsights : function() {
            var module = this;

            //VISIBILITY BASED ON THE SIDEBAR INSIGHTS
            api.sidebar_insights('registered').callbacks.add( function( _registered_zones ) {
                    var _current_collection = _.clone( module.itemCollection() );
                    _.each( _current_collection, function( _model ) {
                          if ( ! module.getViewEl(_model.id).length )
                            return;

                          module.getViewEl(_model.id).css('display' , _.contains( _registered_zones, _model.id ) ? 'block' : 'none' );
                    });
            });

            //OPACITY SIDEBAR INSIGHTS BASED
            api.sidebar_insights('inactives').callbacks.add( function( _inactives_zones ) {
                    var _current_collection = _.clone( module.itemCollection() );
                    _.each( _current_collection, function( _model ) {
                          if ( ! module.getViewEl(_model.id).length )
                            return;

                          if ( _.contains( _inactives_zones, _model.id ) ) {
                                module.getViewEl( _model.id ).addClass('inactive');
                                if ( ! module.getViewEl( _model.id ).find('.czr-inactive-alert').length ) {
                                      module.getViewEl( _model.id ).find('.czr-item-title').append(
                                        $('<span/>', {class : "czr-inactive-alert", html : " [ " + serverControlParams.i18n.inactiveWidgetZone + " ]" })
                                      );
                                }
                          }
                          else {
                                module.getViewEl( _model.id ).removeClass('inactive');
                                if ( module.getViewEl( _model.id ).find('.czr-inactive-alert').length )
                                  module.getViewEl( _model.id ).find('.czr-inactive-alert').remove();
                          }
                    });
            });

            //WIDGET SIDEBAR CREATION BASED ON SIDEBAR INSIGHTS
            //react to a new register candidate(s) on preview refresh
            api.sidebar_insights('candidates').callbacks.add( function(_candidates) {
                  if ( ! _.isArray(_candidates) )
                    return;
                  _.each( _candidates, function( _sidebar ) {
                        if ( ! _.isObject(_sidebar) )
                          return;
                        //add this widget sidebar and the related setting and control.
                        //Only if not added already
                        if ( api.section.has("sidebar-widgets-" +_sidebar.id ) )
                          return;

                        //access the registration method statically
                        module.addWidgetSidebar( {}, _sidebar );
                        //activate it if so
                        if ( _.has( api.sidebar_insights('actives')(), _sidebar.id ) && api.section.has("sidebar-widgets-" +_sidebar.id ) )
                          api.section( "sidebar-widgets-" +_sidebar.id ).activate();
                  });
            });
      },//listenToSidebarInsights()







      /////////////////////////////////////////
      /// OVERRIDEN METHODS
      ////////////////////////////////////////
      //fired in toggleItemExpansion()
      //has to be overridden for the widget zones control because this control is embedded directly in a panel and not in a section
      //therefore the module to animate the scrollTop is not the section container but $('.wp-full-overlay-sidebar-content')
      _adjustScrollExpandedBlock : function( $_block_el, adjust ) {
            if ( ! $_block_el.length )
              return;
            var module = this,
                _currentScrollTopVal = $('.wp-full-overlay-sidebar-content').scrollTop(),
                _scrollDownVal,
                _adjust = adjust || 90;
            setTimeout( function() {
                  if ( ( $_block_el.offset().top + $_block_el.height() + _adjust ) > $(window.top).height() ) {
                    _scrollDownVal = $_block_el.offset().top + $_block_el.height() + _adjust - $(window.top).height();
                    $('.wp-full-overlay-sidebar-content').animate({
                        scrollTop:  _currentScrollTopVal + _scrollDownVal
                    }, 600);
                  }
            }, 50);
      },



      //overrides the parent class default model getter
      //=> add a dynamic title
      getDefaultItemModel : function( id ) {
              var module = this,
                  _current_collection = module.itemCollection(),
                  _default = _.clone( module.defaultItemModel ),
                  _default_contexts = _default.contexts;
              return $.extend( _default, {
                  title : 'Widget Zone ' +  ( _.size(_current_collection)*1 + 1 )
                  //contexts : module._getMatchingContexts( _default_contexts )
                });
      },



      //overrides parent
      //called before rendering a view. Fired in module::renderItemWrapper()
      //can be overridden to set a specific view template depending on the model properties
      //@return string
      //@type can be
      //Read Update Delete (rud...)
      //Read Update (ru)
      //...
      //@item_model is an object describing the current item model
      getTemplateEl : function( type, item_model ) {
              var module = this, _el;
              //force view-content type to ru-item-part if the model is a built-in (primary, secondary, footer-1, ...)
              //=> user can't delete a built-in model.
              if ( 'rudItemPart' == type ) {
                  type = ( _.has(item_model, 'is_builtin') && item_model.is_builtin ) ? 'ruItemPart' : type;
              } else if ( 'itemInputList' == type ) {
                  type = ( _.has(item_model, 'is_builtin') && item_model.is_builtin ) ? 'itemInputListReduced' : type;
              }

              switch(type) {
                    case 'rudItemPart' :
                      _el = module.rudItemPart;
                        break;
                    case 'ruItemPart' :
                      _el = module.ruItemPart;
                      break;
                    case 'itemInputList' :
                      _el = module.itemInputList;
                      break;
                    case 'itemInputListReduced' :
                      _el = module.itemInputListReduced;
                      break;
              }

              if ( _.isEmpty(_el) ) {
                throw new Error( 'No valid template has been found in getTemplateEl()' );
              } else {
                return _el;
              }
      },


      _toggleLocationAlertExpansion : function( $view, to ) {
              var $_alert_el = $view.find('.czr-location-alert');
              if ( ! $_alert_el.length ) {
                    var _html = [
                      '<span>' + serverControlParams.i18n.locationWarning + '</span>',
                      api.CZR_Helpers.getDocSearchLink( serverControlParams.i18n.locationWarning ),
                    ].join('');

                    $_alert_el = $('<div/>', {
                          class:'czr-location-alert',
                          html:_html,
                          style:"display:none"
                    });

                    $('select[data-type="locations"]', $view ).closest('div').after($_alert_el);
              }
              $_alert_el.toggle( 'expanded' == to);
      }
});//$.extend()
})( wp.customize , jQuery, _ );
//extends api.CZRModule
var CZRBodyBgModuleMths = CZRBodyBgModuleMths || {};
( function ( api, $, _ ) {
$.extend( CZRBodyBgModuleMths, {
      initialize: function( id, options ) {
            var module = this;
            //run the parent initialize
            api.CZRModule.prototype.initialize.call( module, id, options );

            //extend the module with new template Selectors
            $.extend( module, {
                  itemInputList : 'czr-module-bodybg-item-content'
            } );

            //EXTEND THE DEFAULT CONSTRUCTORS FOR INPUT
            module.inputConstructor = api.CZRInput.extend( module.CZRBodyBgInputMths || {} );
            //EXTEND THE DEFAULT CONSTRUCTORS FOR MONOMODEL
            module.itemConstructor = api.CZRItem.extend( module.CZBodyBgItemMths || {} );

            //declares a default model
            module.defaultItemModel = {
                  'background-color' : '#eaeaea',
                  'background-image' : '',
                  'background-repeat' : 'no-repeat',
                  'background-attachment' : 'fixed',
                  'background-position' : 'center center',
                  'background-size' : 'cover'
            };
            api.consoleLog('New module instantiated : ', module.id );
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
      },//initialize



      CZRBodyBgInputMths : {
            //////////////////////////////////////////////////
            ///SETUP SELECTS
            //////////////////////////////////////////////////
            //setup select on view_rendered|item_content_event_map
            setupSelect : function() {
                  var input         = this,
                      _id_param_map = {
                        'background-repeat' : 'bg_repeat_options',
                        'background-attachment' : 'bg_attachment_options',
                        'background-position' : 'bg_position_options'
                      },
                      item          = input.input_parent,
                      serverParams  = serverControlParams.body_bg_module_params,
                      options       = {},
                      module        = input.module;

                  if ( ! _.has( _id_param_map, input.id ) )
                    return;

                  if ( _.isUndefined( serverParams ) || _.isUndefined( serverParams[ _id_param_map[input.id] ] ) )
                    return;
                  options = serverParams[ _id_param_map[input.id] ];
                  if ( _.isEmpty(options) )
                    return;
                  //generates the options
                  _.each( options, function( title, key ) {
                        var _attributes = {
                              value : key,
                              html: title
                            };
                        if ( key == input() || _.contains( input(), key ) )
                          $.extend( _attributes, { selected : "selected" } );

                        $( 'select[data-type]', input.container ).append( $('<option>', _attributes) );
                  });
                  //fire select2
                  $( 'select[data-type]', input.container ).select2();
            }
      },


      CZBodyBgItemMths : {
            //Fired if the item has been instantiated
            //The item.callbacks are declared.
            ready : function() {
                  var item = this;
                  api.CZRItem.prototype.ready.call( item );

                  item.inputCollection.bind( function( _col_ ) {
                        if ( ! _.isEmpty( _col ) && item.czr_Input && item.czr_Input.has( 'background-image' ) ) {
                              item.czr_Input('background-image').isReady.done( function( input_instance ) {
                                    var set_visibilities = function( bg_val  ) {
                                          var is_bg_img_set = ! _.isEmpty( bg_val ) ||_.isNumber( bg_val);
                                          _.each( ['background-repeat', 'background-attachment', 'background-position', 'background-size'], function( dep ) {
                                                item.czr_Input(dep).container.toggle( is_bg_img_set || false );
                                          });
                                    };
                                    set_visibilities( input_instance() );
                                    //update the item model on 'background-image' change
                                    item.bind('background-image:changed', function(){
                                          set_visibilities( item.czr_Input('background-image')() );
                                    });
                              });
                        }
                  });

            },

      }
});//$.extend
})( wp.customize , jQuery, _ );
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
            czr_widget_areas_module : {
                  mthds : CZRWidgetAreaModuleMths,
                  crud : true,
                  sektion_allowed : false,
                  name : 'Widget Areas'
            },
            czr_social_module : {
                  mthds : CZRSocialModuleMths,
                  crud : true,
                  name : 'Social Icons',
                  has_mod_opt : true
            },
            czr_background : {
                  mthds : CZRBodyBgModuleMths,
                  crud : false,
                  multi_item : false,
                  name : 'Slider'
            }
      });
})( wp.customize, jQuery, _ );
//named czr_multiple_picker in the php setting map
var CZRMultiplePickerMths = CZRMultiplePickerMths || {};
/* Multiple Picker */
/**
 * @constructor
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
( function ( api, $, _ ) {
$.extend( CZRMultiplePickerMths , {
      ready: function() {
            var control  = this,
                _select  = this.container.find('select');


            _select.select2({
                  closeOnSelect: false,
                  templateSelection: czrEscapeMarkup
            });

            function czrEscapeMarkup(obj) {
                  //trim dashes
                  return obj.text.replace(/\u2013|\u2014/g, "");
            }

            //handle case when all choices become unselected
            _select.on('change', function(e){
                  if ( 0 === $(this).find("option:selected").length )
                    control.setting.set([]);
            });
      }
});//$.extend
})( wp.customize , jQuery, _ );
//named czr_cropped_image in the php setting map
var CZRCroppedImageMths = CZRCroppedImageMths || {};

(function (api, $, _) {
      /* IMAGE UPLOADER CONTROL IN THE CUSTOMIZER */
      //CroppedImageControl is not available before wp 4.3
      if ( 'function' != typeof wp.media.controller.Cropper  || 'function' != typeof api.CroppedImageControl  )
        return;


      /* CZRCustomizeImage Cropper */
      /**
      * Custom version of:
      * wp.media.controller.CustomizeImageCropper (wp-includes/js/media-views.js)
      *
      * In order to use image destination sizes different than the suggested ones
      *
      * A state for cropping an image.
      *
      * @class
      * @augments wp.media.controller.Cropper
      * @augments wp.media.controller.State
      * @augments Backbone.Model
      */
      wp.media.controller.CZRCustomizeImageCropper = wp.media.controller.Cropper.extend({
            doCrop: function( attachment ) {
                  var cropDetails = attachment.get( 'cropDetails' ),
                      control = this.get( 'control' );

                  cropDetails.dst_width  = control.params.dst_width;
                  cropDetails.dst_height = control.params.dst_height;

                  return wp.ajax.post( 'crop-image', {
                        wp_customize: 'on',
                        nonce: attachment.get( 'nonces' ).edit,
                        id: attachment.get( 'id' ),
                        context: control.id,
                        cropDetails: cropDetails
                  } );
            }
      });



      /* CZRCroppedImageControl */
      $.extend( CZRCroppedImageMths , {
            /**
            * Create a media modal select frame, and store it so the instance can be reused when needed.
            * CZR: We don't want to crop svg (cropping fails), gif (animated gifs become static )
            * @Override
            * We need to override this in order to use our ImageCropper custom extension of wp.media.controller.Cropper
            *
            * See api.CroppedImageControl:initFrame() ( wp-admin/js/customize-controls.js )
            */
            initFrame: function() {

                  var l10n = _wpMediaViewsL10n;

                  this.frame = wp.media({
                        button: {
                            text: l10n.select,
                            close: false
                        },
                        states: [
                            new wp.media.controller.Library({
                                title: this.params.button_labels.frame_title,
                                library: wp.media.query({ type: 'image' }),
                                multiple: false,
                                date: false,
                                priority: 20,
                                suggestedWidth: this.params.width,
                                suggestedHeight: this.params.height
                            }),
                            new wp.media.controller.CZRCustomizeImageCropper({
                                imgSelectOptions: this.calculateImageSelectOptions,
                                control: this
                            })
                        ]
                  });

                  this.frame.on( 'select', this.onSelect, this );
                  this.frame.on( 'cropped', this.onCropped, this );
                  this.frame.on( 'skippedcrop', this.onSkippedCrop, this );
            },

            /**
            * After an image is selected in the media modal, switch to the cropper
            * state if the image isn't the right size.
            *
            * CZR: We don't want to crop svg (cropping fails), gif (animated gifs become static )
            * @Override
            * See api.CroppedImageControl:onSelect() ( wp-admin/js/customize-controls.js )
            */
            onSelect: function() {
                  var attachment = this.frame.state().get( 'selection' ).first().toJSON();
                  if ( ! ( attachment.mime && attachment.mime.indexOf("image") > -1 ) ){
                        //Todo: better error handling, show some message?
                        this.frame.trigger( 'content:error' );
                        return;
                  }
                  if ( ( _.contains( ['image/svg+xml', 'image/gif'], attachment.mime ) ) || //do not crop gifs or svgs
                          this.params.width === attachment.width && this.params.height === attachment.height && ! this.params.flex_width && ! this.params.flex_height ) {
                        this.setImageFromAttachment( attachment );
                        this.frame.close();
                  } else {
                        this.frame.setState( 'cropper' );
                  }
            },
      });//extend
})( wp.customize, jQuery, _);

//named czr_upload in the php setting map
var CZRUploadMths = CZRUploadMths || {};
( function ( api, $, _ ) {
/**
 * @constructor
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
$.extend( CZRUploadMths, {
      ready: function() {
            var control = this;

            this.params.removed = this.params.removed || '';

            this.success = $.proxy( this.success, this );

            this.uploader = $.extend({
                  container: this.container,
                  browser:   this.container.find('.czr-upload'),
                  //dropzone:  this.container.find('.upload-dropzone'),
                  success:   this.success,
                  plupload:  {},
                  params:    {}
            }, this.uploader || {} );

            if ( control.params.extensions ) {
                  control.uploader.plupload.filters = [{
                    title:      api.l10n.allowedFiles,
                    extensions: control.params.extensions
                  }];
            }

            if ( control.params.context )
              control.uploader.params['post_data[context]'] = this.params.context;

            if ( api.settings.theme.stylesheet )
              control.uploader.params['post_data[theme]'] = api.settings.theme.stylesheet;

            this.uploader = new wp.Uploader( this.uploader );

            this.remover = this.container.find('.remove');
            this.remover.on( 'click keydown', function( event ) {
                  if ( event.type === 'keydown' &&  13 !== event.which ) // enter
                    return;
                  control.setting.set( control.params.removed );
                  event.preventDefault();
            });

            this.removerVisibility = $.proxy( this.removerVisibility, this );
            this.setting.bind( this.removerVisibility );
            this.removerVisibility( this.setting() );
      },


      success: function( attachment ) {
            this.setting.set( attachment.get('id') );
      },
      removerVisibility: function( to ) {
            this.remover.toggle( to != this.params.removed );
      }
});//extend
})( wp.customize , jQuery, _ );
//named czr_layouts in the php setting map
var CZRLayoutSelectMths = CZRLayoutSelectMths || {};
( function ( api, $, _ ) {
$.extend( CZRLayoutSelectMths , {
      ready: function() {
            this.setupSelect();
      },

      setupSelect : function( obj ) {
            var control = this;
                $_select  = this.container.find('select');

            function addImg( state ) {
                  if (! state.id) { return state.text; }
                  if ( ! _.has( control.params.layouts, state.element.value ) )
                    return;

                  var _layout_data = control.params.layouts[state.element.value],
                      _src = _layout_data.src,
                      _title = _layout_data.label,
                      $state = $(
                    '<img src="' + _src +'" class="czr-layout-img" title="' + _title + '" /><span class="czr-layout-title">' + _title + '</span>'
                  );
                  return $state;
            }

            //destroy selected if set
            //$_select.selecter("destroy");

            //fire select2
            $_select.select2( {
                  templateResult: addImg,
                  templateSelection: addImg,
                  minimumResultsForSearch: Infinity
            });
      },
});//$.extend
})( wp.customize , jQuery, _ );
( function ( api, $, _ ) {
      //THEME CONTROLS
      //api.CZRBackgroundControl     = api.CZRItemControl.extend( CZRBackgroundMths );

      //api.CZRWidgetAreasControl    = api.CZRDynModule.extend( CZRWidgetAreasMths );

      api.CZRUploadControl          = api.Control.extend( CZRUploadMths );
      api.CZRLayoutControl          = api.Control.extend( CZRLayoutSelectMths );
      api.CZRMultiplePickerControl  = api.Control.extend( CZRMultiplePickerMths );


      $.extend( api.controlConstructor, {
            czr_upload     : api.CZRUploadControl,
            //czr_sidebars   : api.CZRWidgetAreasControl,
            //czr_socials    : api.CZRSocialControl,
            czr_multiple_picker : api.CZRMultiplePickerControl,
            czr_layouts    : api.CZRLayoutControl
            //czr_background : api.CZRBackgroundControl
      });

      if ( 'function' == typeof api.CroppedImageControl ) {
            api.CZRCroppedImageControl   = api.CroppedImageControl.extend( CZRCroppedImageMths );

            $.extend( api.controlConstructor, {
                  czr_cropped_image : api.CZRCroppedImageControl
            });
      }

      if ( 'function' == typeof api.CodeEditorControl ) {
            $.extend( api.controlConstructor, {
                  czr_code_editor : api.CodeEditorControl
            });
      }

})( wp.customize, jQuery, _ );
( function (api, $, _) {
      var $_nav_section_container,
          i18n = serverControlParams.i18n || {};

      api.czr_CrtlDependenciesReady = $.Deferred();

      api.bind( 'ready' , function() {
            if ( _.has( api, 'czr_ctrlDependencies') )
              return;
            if ( serverControlParams.isSkopOn ) {
                  // If skope is on, we need to wait for the initial setup to be finished
                  // otherwise, we might refer to not instantiated skopes when processing silent updates further in the code
                  //Skope is ready when :
                  //1) the initial skopes collection has been populated
                  //2) the initial skope has been switched to
                  if ( 'resolved' != api.czr_skopeReady.state() ) {
                        api.czr_skopeReady.done( function() {
                              api.czr_ctrlDependencies = new api.CZR_ctrlDependencies();
                              api.czr_CrtlDependenciesReady.resolve();
                        });
                  }
            } else {
                  api.czr_ctrlDependencies = new api.CZR_ctrlDependencies();
                  api.czr_CrtlDependenciesReady.resolve();
            }

      } );


      api.CZR_ctrlDependencies = api.Class.extend( {
              dominiDeps : [],
              initialize: function() {
                    var self = this;

                    this.defaultDominusParams = {
                          dominus : '',
                          servi : [],
                          visibility : null,
                          actions : null,
                          onSectionExpand : true
                    };

                    //store the default control dependencies
                    this.dominiDeps = _.extend( this.dominiDeps, this._getControlDeps() );
                    if ( ! _.isArray( self.dominiDeps ) ) {
                        throw new Error('Visibilities : the dominos dependency array is not an array.');
                    }
                    api.czr_activeSectionId.bind( function( section_id ) {
                          if ( ! _.isEmpty( section_id ) && api.section.has( section_id ) ) {
                                try {
                                      self.setServiDependencies( section_id );
                                } catch( er ) {
                                      api.errorLog( 'In api.CZR_ctrlDependencies : ' + er );
                                }
                          }
                    });


                    //@param target_source is an object :
                    // {
                    //    target : section_id to awake
                    //    source : section_id from which the request for awaking has been done
                    // }
                    api.bind( 'awaken-section', function( target_source ) {
                          //if skope on ( serverControlParams.isSkopOn ), then defer the visibility awakening after the silent updates
                          if ( serverControlParams.isSkopOn && _.has( api ,'czr_skopeBase' ) ) {
                                api.czr_skopeBase.processSilentUpdates( {
                                      candidates : {},
                                      section_id : target_source.target,
                                      refresh : false
                                } ).then( function() {
                                      try {
                                            self.setServiDependencies( target_source.target, target_source.source );
                                      } catch( er ) {
                                            api.errorLog( 'On awaken-section, ctrl deps : ' + er );
                                      }
                                });
                          } else {
                                try {
                                      self.setServiDependencies( target_source.target, target_source.source );
                                } catch( er ) {
                                      api.errorLog( 'On awaken-section, ctrl deps : ' + er );
                                }
                          }
                    });

                    //FAVICON SPECIFICS
                    //@todo => move to the theme ?
                    //favicon note on load and on change(since wp 4.3)
                    this._handleFaviconNote();
              },


              //Process the visibility callbacks for the controls of a target targetSectionId
              //@param targetSectionId : string
              //@param sourceSectionId : string, the section from which the request has been done
              setServiDependencies : function( targetSectionId, sourceSectionId, refresh ) {
                    var self = this, params, dfd = $.Deferred();

                    refresh = refresh || false;

                    if ( _.isUndefined( targetSectionId ) || ! api.section.has( targetSectionId ) ) {
                          throw new Error( 'Control Dependencies : the targetSectionId is missing or not registered : ' + targetSectionId );
                    }

                    //Assign a visibility state deferred to the target section
                    api.section( targetSectionId ).czr_ctrlDependenciesReady = api.section( targetSectionId ).czr_ctrlDependenciesReady || $.Deferred();

                    //Bail here if this section has already been setup for ctrl dependencies
                    if ( ! refresh && 'resolved' == api.section( targetSectionId ).czr_ctrlDependenciesReady.state() )
                      return dfd.resolve().promise();

                    //FIND DOMINI IN THE TARGET SECTION
                    //=> setup their callbacks
                    _.each( self.dominiDeps , function( params ) {
                          if ( ! _.has( params, 'dominus' ) || ! _.isString( params.dominus ) || _.isEmpty( params.dominus ) ) {
                                throw new Error( 'Control Dependencies : a dominus control id must be a not empty string.');
                          }

                          var wpDominusId = api.CZR_Helpers.build_setId( params.dominus );
                          if ( ! api.control.has( wpDominusId ) )
                            return;

                          if ( api.control( wpDominusId ).section() != targetSectionId )
                            return;

                          //Attempt to normalize the params
                          params = self._prepareDominusParams( params );
                          if ( _.isEmpty(params) )
                            return;

                          self._processDominusCallbacks( params.dominus, params, refresh )
                                .fail( function() {
                                      api.consoleLog( 'self._processDominusCallbacks fail for section ' + targetSectionId );
                                      dfd.reject();
                                })
                                .done( function() {
                                      dfd.resolve();
                                });
                    });


                    //EXTERNAL DOMINI : AWAKE THE SECTIONS
                    //check if any control of the current section is the servus of a dominus located in another section
                    var _secCtrls = api.CZR_Helpers.getSectionControlIds( targetSectionId ),
                        _getServusDomini = function( shortServudId ) {
                              var _dominiIds = [];
                              _.each( self.dominiDeps , function( params ) {
                                    if ( ! _.has( params, 'servi' ) || ! _.isArray( params.servi ) || ! _.has( params, 'dominus' ) || _.isEmpty( params.dominus ) ) {
                                          api.errorLog( 'Control Dependencies : wrong params in _getServusDomini.');
                                          return;
                                    }

                                    if ( _.contains( params.servi , shortServudId ) && ! _.contains( _dominiIds , params.dominus ) ) {
                                          //Attempt to normalize the params
                                          params = self._prepareDominusParams( params );
                                          if ( _.isEmpty(params) )
                                            return;
                                          else
                                            _dominiIds.push( params.dominus );
                                    }
                              });
                              return ! _.isArray( _dominiIds ) ? [] : _dominiIds;
                        },
                        _servusDominiIds = [];

                    //Build the domini array
                    _.each( _secCtrls, function( servusCandidateId ) {
                          if ( _.isEmpty( _getServusDomini( servusCandidateId ) ) )
                            return;

                          _servusDominiIds = _.union( _servusDominiIds, _getServusDomini( servusCandidateId ) );
                    });

                    //let's loop on the domini ids and check if we need to "awake" an external section
                    _.each( _servusDominiIds, function( shortDominusId ){

                          var wpDominusId = api.CZR_Helpers.build_setId( shortDominusId );
                          //This dominus must be located in another section
                          if ( api.control( wpDominusId ).section() == targetSectionId )
                              return;
                          //The dominus section can't be the current source if set. => otherwise potential infinite loop scenario.
                          if ( sourceSectionId == api.control( wpDominusId ).section() )
                              return;
                          //inform the api that a section has to be awaken
                          //=> first silently update the section controls if skope on
                          //=> then fire the visibilities
                          api.trigger( 'awaken-section', {
                                target : api.control( wpDominusId ).section(),
                                source : targetSectionId
                          } );
                    } );

                    //This section has been setup for ctrl dependencies
                    dfd.always( function() {
                          api.section( targetSectionId ).czr_ctrlDependenciesReady.resolve();
                    });
                    return dfd.promise();
              },


              //This method fires a callback when a control is registered in the api.
              //If the control is registered, then it fires the callback when it is embedded
              //If the control is embedeed, it fires the callback
              //=> typical use case : a control can be both removed from the API and the DOM, and then added back on skope switch
              //
              //@param wpCtrlId : string name of the control as registered in the WP API
              //@param callback : fn callback to fire
              //@param args : [] or callback arguments
              _deferCallbackForControl : function( wpCrtlId, callback, args ) {
                    var dfd = $.Deferred();
                    if ( _.isEmpty(wpCrtlId) || ! _.isString(wpCrtlId) ) {
                        throw new Error( '_deferCallbackForControl : the control id is missing.' );
                    }
                    if ( ! _.isFunction( callback ) ) {
                        throw new Error( '_deferCallbackForControl : callback must be a funtion.' );
                    }
                    args = ( _.isUndefined(args) || ! _.isArray( args ) ) ? [] : args;

                    if ( api.control.has( wpCrtlId ) ) {
                          if ( 'resolved' == api.control(wpCrtlId ).deferred.embedded.state() ) {
                                $.when( callback.apply( null, args ) )
                                      .fail( function() { dfd.reject(); })
                                      .done( function() { dfd.resolve(); });
                          } else {
                                api.control( wpCrtlId ).deferred.embedded.then( function() {
                                      $.when( callback.apply( null, args ) )
                                            .fail( function() { dfd.reject(); })
                                            .done( function() { dfd.resolve(); });
                                });
                          }
                    } else {
                          api.control.when( wpCrtlId, function() {
                                api.control( wpCrtlId ).deferred.embedded.then( function() {
                                      $.when( callback.apply( null, args ) )
                                            .fail( function() { dfd.reject(); })
                                            .done( function() { dfd.resolve(); });
                                });
                          });
                    }
                    return dfd.promise();
              },


              /*
              * @return void
              * show or hide setting according to the dependency + callback pair
              * @params setId = the short setting id, whitout the theme option prefix OR the WP built-in setting
              * @params o = { controls [], callback fn, onSectionExpand bool }
              */
              _processDominusCallbacks : function( shortDominusId, dominusParams, refresh ) {
                    var self = this,
                        wpDominusId = api.CZR_Helpers.build_setId( shortDominusId ),
                        dominusSetInst = api( wpDominusId ),
                        dfd = $.Deferred(),
                        hasProcessed = false;

                    //loop on the dominus servi and apply + bind the visibility cb
                    _.each( dominusParams.servi , function( servusShortSetId ) {
                            if ( ! api.control.has( api.CZR_Helpers.build_setId( servusShortSetId ) ) ) {
                                return;
                            }
                            //set visibility when control is embedded
                            //or when control is added to the api
                            //=> solves the problem of visibility callbacks lost when control are re-rendered
                            var _fireDominusCallbacks = function( dominusSetVal, servusShortSetId, dominusParams, refresh ) {
                                      var _toFire = [],
                                          _args = arguments;
                                      _.each( dominusParams, function( _item, _key ) {
                                            switch( _key ) {
                                                case 'visibility' :
                                                    self._setVisibility.apply( null, _args );
                                                break;
                                                case 'actions' :
                                                    if ( _.isFunction( _item ) )
                                                        _item.apply( null, _args );
                                                break;
                                            }
                                      });
                                },
                                _deferCallbacks = function( dominusSetVal ) {
                                      dominusSetVal = dominusSetVal  || dominusSetInst();
                                      var wpServusSetId = api.CZR_Helpers.build_setId( servusShortSetId );
                                      self._deferCallbackForControl(
                                                  wpServusSetId,
                                                  _fireDominusCallbacks,
                                                  [ dominusSetVal, servusShortSetId, dominusParams ]
                                            )
                                            .always( function() { hasProcessed = true; })
                                            .fail( function() { dfd.reject(); })
                                            .done( function() { dfd.resolve(); });
                                };


                            //APPLY THE DEPENDENCIES
                            _deferCallbacks();

                            //BIND THE DOMINUS SETTING INSTANCE
                            //store the visibility bound state
                            if ( ! _.has( dominusSetInst, 'czr_visibilityServi' ) )
                                dominusSetInst.czr_visibilityServi = new api.Value( [] );

                            //Maybe bind to react on setting _dirty change
                            var _currentDependantBound = dominusSetInst.czr_visibilityServi();
                            //Make sure a dependant visibility action is bound only once for a setting id to another setting control id
                            if ( ! _.contains( _currentDependantBound, servusShortSetId ) ) {
                                  dominusSetInst.bind( function( dominusSetVal ) {
                                      _deferCallbacks( dominusSetVal );
                                  });
                                  dominusSetInst.czr_visibilityServi( _.union( _currentDependantBound, [ servusShortSetId ] ) );
                            }
                    } );//_.each
                    if ( ! hasProcessed )
                      return dfd.resolve().promise();
                    return dfd.promise();
              },



              //@return void()
              _setVisibility : function ( dominusSetVal, servusShortSetId, dominusParams, refresh ) {
                    var wpServusSetId = api.CZR_Helpers.build_setId( servusShortSetId ),
                        visibility = dominusParams.visibility( dominusSetVal, servusShortSetId, dominusParams.dominus );

                    refresh = refresh || false;
                    //Allows us to filter between visibility callbacks and other actions
                    //a non visibility callback shall return null
                    if ( ! _.isBoolean( visibility ) || ( 'unchanged' == visibility && ! refresh ) )
                      return;

                    //when skope is enabled, we might be doing a silent update
                    //=> this method should be bailed if so
                    var _doVisibilitiesWhenPossible = function() {
                            if ( api.state.has( 'silent-update-processing' ) && api.state( 'silent-update-processing' )() )
                              return;
                            api.control( wpServusSetId, function( _controlInst ) {
                                  var _args = {
                                        duration : 'fast',
                                        completeCallback : function() {},
                                        unchanged : false
                                  };

                                  if ( _.has( _controlInst, 'active' ) )
                                    visibility = visibility && _controlInst.active();

                                  if ( _.has( _controlInst, 'defaultActiveArguments' ) )
                                    _args = control.defaultActiveArguments;

                                  _controlInst.onChangeActive( visibility , _controlInst.defaultActiveArguments );
                            });
                            if ( api.state.has( 'silent-update-processing' ) ) {
                                  api.state( 'silent-update-processing' ).unbind( _doVisibilitiesWhenPossible );
                            }
                    };

                    if ( api.state.has( 'silent-update-processing' ) && api.state( 'silent-update-processing' )() ) {
                          api.state( 'silent-update-processing' ).bind( _doVisibilitiesWhenPossible );
                    } else {
                          _doVisibilitiesWhenPossible();
                    }

              },










              /*****************************************************************************
              * HELPERS
              *****************************************************************************/
              /*
              * Abstract
              * Will be provided by the theme
              * @return main control dependencies object
              */
              _getControlDeps : function() {
                return {};
              },


              //@return a visibility ready object of param describing the dependencies between a dominus and its servi.
              //this.defaultDominusParams = {
              //       dominus : '',
              //       servi : [],
              //       visibility : fn() {},
              //       actions : fn() {},
              //       onSectionExpand : true
              // };
              _prepareDominusParams : function( params_candidate ) {
                    var self = this,
                        _ready_params = {};

                    //Check mandatory conditions
                    if ( ! _.isObject( params_candidate ) ) {
                          api.errorLog( 'Visibilities : a dominus param definition must be an object.');
                          return _ready_params;
                    }
                    if ( ! _.has( params_candidate, 'visibility' ) && ! _.has( params_candidate, 'actions' ) ) {
                          api.errorLog( 'Visibilities : a dominus definition must include a visibility or an actions callback.');
                          return _ready_params;
                    }
                    if ( ! _.has( params_candidate, 'dominus' ) || ! _.isString( params_candidate.dominus ) || _.isEmpty( params_candidate.dominus ) ) {
                          api.errorLog( 'Visibilities : a dominus control id must be a not empty string.');
                          return _ready_params;
                    }
                    var wpDominusId = api.CZR_Helpers.build_setId( params_candidate.dominus );
                    if ( ! api.control.has( wpDominusId ) ) {
                          api.errorLog( 'Visibilities : a dominus control id is not registered : ' + wpDominusId );
                          return _ready_params;
                    }
                    if ( ! _.has( params_candidate, 'servi' ) || _.isUndefined( params_candidate.servi ) || ! _.isArray( params_candidate.servi ) || _.isEmpty( params_candidate.servi ) ) {
                          api.errorLog( 'Visibilities : servi must be set as an array not empty.');
                          return _ready_params;
                    }

                    _.each( self.defaultDominusParams , function( _value, _key ) {
                        var _candidate_val = params_candidate[ _key ];

                        switch( _key ) {
                              case 'visibility' :
                                  if ( ! _.isUndefined( _candidate_val ) && ! _.isEmpty( _candidate_val ) && ! _.isFunction( _candidate_val ) ) {
                                        throw new Error( 'Visibilities : a dominus visibility callback must be a function : ' + params_candidate.dominus );
                                  }
                              break;
                              case 'actions' :
                                  if ( ! _.isUndefined( _candidate_val ) && ! _.isEmpty( _candidate_val ) && ! _.isFunction( _candidate_val ) ) {
                                        throw new Error( 'Visibilities : a dominus actions callback must be a function : ' + params_candidate.dominus );
                                  }
                              break;
                              case 'onSectionExpand' :
                                  if ( ! _.isUndefined( _candidate_val ) && ! _.isEmpty( _candidate_val ) && ! _.isBoolean( _candidate_val ) ) {
                                        throw new Error( 'Visibilities : a dominus onSectionExpand param must be a boolean : ' + params_candidate.dominus );
                                  }
                              break;
                        }
                        _ready_params[_key] = _candidate_val;
                    });

                    return _ready_params;
              },



              /*****************************************************************************
              * FAVICON SPECIFICS
              *****************************************************************************/
              /**
              * Fired on api ready
              * May change the site_icon description on load
              * May add a callback to site_icon
              * @return void()
              */
              _handleFaviconNote : function() {
                    var self = this,
                        _fav_setId = api.CZR_Helpers.build_setId( serverControlParams.faviconOptionName );
                    //do nothing if (||)
                    //1) WP version < 4.3 where site icon has been introduced
                    //2) User had not defined a favicon
                    //3) User has already set WP site icon
                    if ( ! api.has('site_icon') || ! api.control('site_icon') || ( api.has( _fav_setId ) && 0 === + api( _fav_setId )() ) || + api('site_icon')() > 0 )
                      return;

                    var _oldDes     = api.control('site_icon').params.description;
                        _newDes     = ['<strong>' , i18n.faviconNote || '' , '</strong><br/><br/>' ].join('') + _oldDes;

                    //on api ready
                    self._printFaviconNote(_newDes );

                    //on site icon change
                    api('site_icon').callbacks.add( function(to) {
                      if ( +to > 0 ) {
                        //reset the description to default
                        api.control('site_icon').container.find('.description').text(_oldDes);
                        //reset the previous favicon setting
                        if ( api.has( _fav_setId ) )
                          api( _fav_setId ).set("");
                      }
                      else {
                        self._printFaviconNote(_newDes );
                      }
                    });
              },

              //Add a note to the WP control description if user has already defined a favicon
              _printFaviconNote : function( _newDes ) {
                    api.control('site_icon').container.find('.description').html(_newDes);
              }
        }
      );//api.Class.extend() //api.CZR_ctrlDependencies
})( wp.customize, jQuery, _);
//DOM READY :
//1) FIRE SPECIFIC INPUT PLUGINS
//2) ADD SOME COOL STUFFS
//3) SPECIFIC CONTROLS ACTIONS
( function ( wp, $ ) {
      $( function($) {
            var api = wp.customize || api;

            //WHAT IS HAPPENING IN THE MESSENGER
            // $(window.parent).on( 'message', function(e, o) {
            //   api.consoleLog('SENT STUFFS', JSON.parse( e.originalEvent.data), e );
            // });
            // $( window ).on( 'message', function(e, o) {
            //   api.consoleLog('INCOMING MESSAGE', JSON.parse( e.originalEvent.data), e );
            // });
            // $(window.document).bind("ajaxSend", function(e, o){
            //    api.consoleLog('AJAX SEND', e, arguments );
            // }).bind("ajaxComplete", function(e, o){
            //    api.consoleLog('AJAX COMPLETE', e, o);
            // });

            /* RECENTER CURRENT SECTIONS */
            $('.accordion-section').not('.control-panel').click( function () {
                  _recenter_current_section($(this));
            });

            function _recenter_current_section( section ) {
                  var $siblings               = section.siblings( '.open' );
                  //check if clicked element is above or below sibling with offset.top
                  if ( 0 !== $siblings.length &&  $siblings.offset().top < 0 ) {
                        $('.wp-full-overlay-sidebar-content').animate({
                              scrollTop:  - $('#customize-theme-controls').offset().top - $siblings.height() + section.offset().top + $('.wp-full-overlay-sidebar-content').offset().top
                        }, 700);
                  }
            }//end of fn


            /* CHECKBOXES */
            api.czrSetupCheckbox = function( controlId, refresh ) {
                  var _ctrl = api.control( controlId );
                  $('input[type=checkbox]', _ctrl.container ).each( function() {
                        //Exclude font customizer
                        if ( 'tc_font_customizer_settings' == _ctrl.params.section )
                          return;
                        //first fix the checked / unchecked status
                        if ( 0 === $(this).val() || '0' == $(this).val() || 'off' == $(this).val() || _.isEmpty($(this).val() ) ) {
                              $(this).prop('checked', false);
                        } else {
                              $(this).prop('checked', true);
                        }

                        //then render icheck if not done already
                        if ( 0 !== $(this).closest('div[class^="icheckbox"]').length )
                          return;

                        $(this).iCheck({
                              checkboxClass: 'icheckbox_flat-grey',
                              //checkedClass: 'checked',
                              radioClass: 'iradio_flat-grey',
                        })
                        .on( 'ifChanged', function(e){
                              $(this).val( false === $(this).is(':checked') ? 0 : 1 );
                              $(e.currentTarget).trigger('change');
                        });
                  });
            };//api.czrSetupCheckbox()

            /* SELECT INPUT */
            api.czrSetupSelect = function(controlId, refresh) {
                  //Exclude no-selecter-js
                  $('select[data-customize-setting-link]', api.control(controlId).container )
                        .not('.no-selecter-js')
                        .each( function() {
                              $(this).selecter({
                              //triggers a change event on the view, passing the newly selected value + index as parameters.
                              // callback : function(value, index) {
                              //   self.triggerSettingChange( window.event || {} , value, index); // first param is a null event.
                              // }
                              });
                        });
            };//api.czrSetupSelect()


            /* NUMBER INPUT */
            api.czrSetupStepper = function( controlId, refresh ) {
                  //Exclude no-selecter-js
                  var _ctrl = api.control( controlId );
                  $('input[type="number"]', _ctrl.container ).each( function() {
                        //Exclude font customizer steppers
                        //the font customizer plugin has its own way to instantiate the stepper, with custom attributes previously set to the input like step, min, etc...
                        if ( 'tc_font_customizer_settings' != _ctrl.params.section ) {
                            $(this).stepper();
                        }
                  });
            };//api.czrSetupStepper()

            api.control.each(function(control){
                  if ( ! _.has(control,'id') )
                    return;
                  //exclude widget controls and menu controls for checkboxes
                  if ( 'widget_' != control.id.substring(0, 'widget_'.length ) && 'nav_menu' != control.id.substring( 0, 'nav_menu'.length ) ) {
                        api.czrSetupCheckbox(control.id);
                  }
                  if ( 'nav_menu_locations' != control.id.substring( 0, 'nav_menu_locations'.length ) ) {
                        api.czrSetupSelect(control.id);
                  }
                  api.czrSetupStepper(control.id);
            });


            var fireHeaderButtons = function() {
                  var $home_button = $('<span/>', { class:'customize-controls-home fa fa-home', html:'<span class="screen-reader-text">Home</span>' } );
                  $.when( $('#customize-header-actions').append( $home_button ) )
                        .done( function() {
                              $home_button
                                    .keydown( function( event ) {
                                          if ( 9 === event.which ) // tab
                                            return;
                                          if ( 13 === event.which ) // enter
                                            this.click();
                                          event.preventDefault();
                                    })
                                    .on( 'click.customize-controls-home', function() {
                                          //event.preventDefault();
                                          //close everything
                                          if ( api.section.has( api.czr_activeSectionId() ) ) {
                                                api.section( api.czr_activeSectionId() ).expanded( false );
                                          } else {
                                                api.section.each( function( _s ) {
                                                    _s.expanded( false );
                                                });
                                          }
                                          api.panel.each( function( _p ) {
                                                _p.expanded( false );
                                          });
                                    });
                        });
            };

            fireHeaderButtons();

      });//end of $( function($) ) dom ready
})( wp, jQuery );