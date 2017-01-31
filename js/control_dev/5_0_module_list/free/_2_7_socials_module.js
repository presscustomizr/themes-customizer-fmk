//extends api.CZRDynModule

var CZRSocialModuleMths = CZRSocialModuleMths || {};

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
          this.itemAddedMessage = serverControlParams.translatedStrings.socialLinkAdded;

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
          _new_title = [ serverControlParams.translatedStrings.followUs, _new_title].join(' ');

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
                    is_preItem   = _.isEmpty(_model.id);

                //=> add the select text in the pre Item case
                if ( is_preItem ) {
                      socialList = _.union( [ serverControlParams.translatedStrings.selectSocialIcon ], socialList );
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
                                if ( _.has(o, 'color') && 16777215 == o.color._color )
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

});
