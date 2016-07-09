(function (api, $, _) {
  //WHAT IS A SCOPE ?
  //A scope is an object describing a set of options for a given customization context
  //It is constructed by the czr_skopeModel constructor
  //it has a model with the following properties
  // - a name : 'global', 'all_posts'
  // - a corresponding database option name
  // - a database option type (dyn_type)
  // - a customization status : active, inactive. Are we currently customizing this scope ?
  // - a priority status that can be forced
  // - an applied status => is this scope the one that will be applied on front end in the current context?
  //  => this status depends on :
  //      1) a default priority local (post id ) > global specific (all posts) > global (default options)
  //      2) a user decision : a priority can be forced. For example who is the winner when two categories have been customized ?
  // - a dirtyness status : has this scope been customized ?
  // - a set of values, each one having a dirtyness state => the  : { optname#2 : { value : ..., _dirty : bool }, optname#2 : {...}, ...  }
  //
  // It is rendered with a view which includes DOM listeners.
  // Users can :
  //  - customize each scope separately,
  //  - force a priority
  //  - reset a scope set of option
  //  - copy the values of one scope to another
  //
  //  What is the default scope ?
  //  - 'global' when accessing the customizer from appearance > customize
  //  - 'local' when customizing from the front end, or an edit screen : post (post, cpt, page, attachment), tax term, user
  //
  //  What are the options eligibile for the scope customization ?
  //  - the scope customization can be applied to all theme settings 'hu_theme_options'. The option not eligible have been flagged 'no-scope' when registered server side.
  //  - the WP built-in settings like blogname, site-icon,... are also eligible
  //  - all other settings like menu, widgets, sidebars are excluded for the moment.
  //
  //  On init, the default scope is set as active.
  //  if the default scope is not 'global', then the switch to the relevant scope is triggered and the eligible settings values are updated "silently"
  //  the dirties are stored in each scope models when the user customize
  //
  //
  //  On scope switch,
  //  1) the values of the dirty values of the current scope are stored in the model
  //  2) the values of the new scope are fetched from the db if they have not been yet.
  //  3) all eligible settings are updated with the new values.
  //  4) if the new scope has no dirty value yet, the saved state is reset.
  //
  //
  //
  //
  //
  // WHAT IS THE SCOPE PRIORITY CONCEPT ?
  // Since a given option can have its value set differently for each scope level, a priority must be defined, in order to know what is the value to use.
  //
  //  => The scope priority defines which option value will be used if this option has been customized in several scopes.
  //
  // There are 3 main levels of scopes :
  // 1) GLOBAL : the options applied to the entire website. Those are saved in the regular (the old) theme options
  // 2) SPECIAL GROUP : those groups are dynamically set, depending on how a user creates a post or a page
  //      all posts from a specific author,
  //      all posts tagged with a specific tag,
  //      all posts tagged with a specific category,
  //      all pages using a specific template
  // 3) GROUP : the options applied to a group of contexts. Those are saved as long life transients
  //      all pages,
  //      all posts,
  //      all tags,
  //      all categories,
  //      all authors,
  // 4) LOCAL : the options applied to a specific context :
  //      a page,
  //      a post (or a CPT),
  //      an attachment,
  //      a tag archive page,
  //      a category archive page,
  //      an author archive page,
  //      the home page,
  //      the 404 page,
  //      the search results page,
  // Note: except for home, 404 and search which are saved as transients, the other local scopes are saved as metas : post metas, term metas, user metas
  //
  // Priorities without the special group (tag, cat, author):
  //    - For a post, page or term : LOCAL (this post id) > GROUP (all posts)  > GLOBAL (entire website options)
  //    - For home, 404, search : LOCAL > GLOBAL. There's no GROUP in this case.
  //    - for a term archive (tag, cat, custom tax) : LOCAL (the term id) > GROUP ( all terms of this type ) > GLOBAL
  //
  // Priorities with the special groups : this is relevant for post and pages only.
  // Let's take a post example.
  // A user can decide to define a set of option (a scope) for all posts tagged with a specific tag.
  // In this case the priority is : LOCAL > SPECIAL GROUP (the "post tagged with {tag}") > GROUP > GLOBAL
  // CONFLICT CASE : If a given post has several terms, and if more than one term have a customized scope.
  //  => since no priority can be defined between two terms, the priority is back to the default : LOCAL > GROUP > GLOBAL
  // How to fix a conflict case ?
  // It is possible to force a "winner" within the special groups. When editing a scope, the user can check an option (! => force this scope when relevant )
  // => if there's a forced winner the priority becomes : LOCAL > FORCED SPECIAL GROUP > GROUP > GLOBAL
  // In the customizer, only one special group winner can be set at a time.
  // If different winners have been set in separate customization sessions, and that the user add several winners term in the post edit screen, it might happen that
  // a the customizer ends up to have several special group winners. In this case, a conflict notice is displayed in the scope dialog box, explaining how to resolve this
  // winner conflict. As long as the winner conflict is unresolved, the priority falls back to : LOCAL > GROUP > GLOBAL.
  //
  //
  //
  //
  //
  //
  // WHAT IS THE SCOPE INHERITANCE CONCEPT ?
  // In the customizer, all scopes are partially customized => For example, a page can only have specific layout options set
  // The question to adress is then : What about all the un-customized options of this scope? Which value should be applied ?
  //
  // The scope inheritance is the complement of the scope priority.
  // It addresses the problem of which values should be used for un-customized options in a given scope.
  //
  // Taking the same page example, if the "skin" option has not been set locally, then it checks the lower scope priority level.
  // In this case, the previous level is "All Pages".
  // If nothing has been set in the "All Pages", we'll go to the previous one : "Global."
  //
  // In the customizer, this scope inheritance has to be reflected so that user can immediately understand which option is applied to which scope.
  // For a given scope, all un-customized settings will inherit their value from the lower priority levels, down to GLOBAL.
  //
  //
  //
  // HOW DOES THIS WORK ?
  // CZR_skopeBase listens to scope collection changes
  // 1) instantiate new models (CZR_skope), remove old ones and their view
  // 2) sets each scope models active scope state changes


  // CZR_skope
  // 1) instantiate, the scope view (CZR_skopeView)
  // 2) listens to the active state
  //   => store dirtyness on switch
  //   => fetch the db values, build the full set of values ( db + dirties + default) and update the settings

  // CZR_skopeView
  // 1) renders the view
  // 2) listens to model active state
  //   => change the view display elements
  // 3) listen to DOM interactions and set scope values : state, priority

  // @todo in the view, return the $() element to store the view.container




  /*****************************************************************************
  * THE SCOPE BASE OBJECT
  *****************************************************************************/
  /* SCOPE COLLECTION AND ACTIVE SKOPE => stores and observes the collection sent by the preview */
  api.czr_skopeCollection = new api.Value([]);//all available scope, including the current scope
  api.czr_activeSkope = new api.Value();//the currently active scope

  api.bind( 'ready' , function() {
    if ( serverControlParams.isSkopOn ) {
      api.czr_skopeBase = new api.CZR_skopeBase();
    }
  } );

  api.CZR_skopeBase = api.Class.extend( {
    globalSettingVal : {},//will store the global setting val. Populated on init.

    initialize: function() {
          var self = this;
          //declare the collection
          api.czr_skope = new api.Values();
          //store the embed state
          self.scopeWrapperEmbedded = $.Deferred();

          //Embed the scopes wrapper if needed
          if ( 'pending' == self.scopeWrapperEmbedded.state() ) {
              $.when( self.embedSkopeWrapper() ).done( function() {
                  self.scopeWrapperEmbedded.resolve();
              });
          }

          //store the initial state of the global option
          this.initialGlobalSettingVal = this.getGlobalSettingVal();

          //REACT TO ACTIVE SCOPE UPDATE
          api.czr_activeSkope.callbacks.add( function() { return self.activeSkopeReact.apply(self, arguments ); } );

          //SCOPE COLLECTION LISTENER
          //The scope collection is set on 'czr-scopes-ready' triggered by the preview
          //setup the callbacks of the scope collection update
          //on init and on preview change : the collection of scopes is populated with new scopes
          //=> instanciate the relevant scope object + render them
          api.czr_skopeCollection.callbacks.add( function() { return self.instantiateSkopes.apply(self, arguments ); } );

          //LISTEN TO API SETTING CHANGES => POPULATE THE DIRTYNESS OF THE ACTIVE SCOPE
          this.addAPISettingsListener();

    },





    //fired on 'czr-scopes-ready' triggered by the preview
    updateSkopeCollection : function( collection ) {
          console.log('skope Collection?', collection );
          var self = this;
              _api_ready_collection = [];
          _.each( collection, function( _skope, _key ) {
              _api_ready_collection.push( self.prepareSkopeForAPI( _skope ) );
          });
          api.czr_skopeCollection( _api_ready_collection );
    },



    prepareSkopeForAPI : function( skope_candidate ) {
          if ( ! _.isObject( skope_candidate ) ) {
              throw new Error('prepareSkopeForAPI : a skope must be an object to be API ready');
          }
          console.log('in prepareSkope', serverControlParams.defaultSkopeModel, skope_candidate );

          var control = this,
              api_ready_skope = {};

          _.each( serverControlParams.defaultSkopeModel , function( _value, _key ) {
                var _candidate_val = skope_candidate[_key];
                switch( _key ) {
                      //PROPERTIES COMMON TO ALL MODULES IN ALL CONTEXTS
                      case 'id' :
                          if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                              throw new Error('prepareSkopeForAPI : a skope id must a string not empty');
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case 'level' :
                          if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                              throw new Error('prepareSkopeForAPI : a skope level must a string not empty for skope ' + _candidate_val.id );
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case 'dyn_type' :
                          if ( ! _.isString( _candidate_val ) || ! _.contains( serverControlParams.skopeDynTypes, _candidate_val ) ) {
                              throw new Error('prepareSkopeForAPI : missing or invalid dyn type for skope ' + _candidate_val.id );
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case 'opt_name' :
                          if ( ! _.isString( _candidate_val ) || _.isEmpty( _candidate_val ) ) {
                              throw new Error('prepareSkopeForAPI : invalid "opt_name" property for skope ' + _candidate_val.id );
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case 'obj_id' :
                          if ( ! _.isString( _candidate_val ) ) {
                              throw new Error('prepareSkopeForAPI : invalid "obj_id" for skope ' + _candidate_val.id );
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case  'is_default' :
                          if ( ! _.isUndefined( _candidate_val) && ! _.isBoolean( _candidate_val )  ) {
                              throw new Error('prepareSkopeForAPI : skope property "is_default" must be a boolean');
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case  'is_winner' :
                          if ( ! _.isUndefined( _candidate_val) && ! _.isBoolean( _candidate_val )  ) {
                              throw new Error('prepareSkopeForAPI : skope property "is_winner" must be a boolean');
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case  'is_primary' :
                          if ( ! _.isUndefined( _candidate_val) && ! _.isBoolean( _candidate_val )  ) {
                              throw new Error('prepareSkopeForAPI : skope property "is_primary" must be a boolean');
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                      case  'db' :
                          if ( _.isUndefined( _candidate_val) && ! _.isArray( _candidate_val ) && ! _.isObject( _candidate_val ) ) {
                              throw new Error('prepareSkopeForAPI : skope property "db" must be a empty array or an object');
                          }
                          api_ready_skope[_key] = _candidate_val;
                      break;
                }//switch
          });
          return api_ready_skope;
    },













    //fired in initialize
    embedSkopeWrapper : function() {
        var self = this;
        $('#customize-header-actions').append( $('<div/>', {class:'czr-scope-switcher'}) );
    },



    //setup the czr_skopeCollection callbacks
    //fired in initialize
    instantiateSkopes : function(to, from) {
          console.log('SCOPES SENT BY THE PREVIEW, FROM AND TO : ', from, to);
          var self = this,
              _new_collection = _.clone(to) || {},
              _old_collection = _.clone(from) || {};

          //destroy the previous scopes views and models
          //Instantiate the scopes collection
          _.each( _old_collection, function( _skope ) {
              //remove the view DOM el
              api.czr_skope( _skope.id ).container.remove();
              //remove the model from the collection
              api.czr_skope.remove( _skope.id );
          });


          //Instantiate the scopes collection
          _.each( _new_collection, function( _skope ) {
              var params = $.extend( true, {}, _skope );//IMPORTANT => otherwise the data object is actually a copy and share the same reference as the model and view params
              api.czr_skope.add( _skope.id , new api.CZR_skope( _skope.id , _skope ) );

              //fire this right after instantiation for the views (we need the model instances in the views)
              if ( ! api.czr_skope.has( _skope.id ) ) {
                  throw new Error( 'Skope id : ' + _skope.id + ' has not been instantiated.');
              }
              api.czr_skope( _skope.id ).ready();
          });

          //set relevant scope as active. Falls back on 'global'
          api.czr_activeSkope( self.getActiveSkopeOnInit( _new_collection ) );
    },//listenToSkopeCollection()




    //fired in initialize
    activeSkopeReact : function( to, from ) {
          var self = this;
          //set the to and from scope state on init and switch
          if ( ! _.isUndefined(from) && api.czr_skope.has(from) )
            api.czr_skope(from).active(false);
          else if ( ! _.isUndefined(from) )
            throw new Error('listenToActiveSkope : previous scope does not exist in the collection');

          if ( ! _.isUndefined(to) && api.czr_skope.has(to) )
            api.czr_skope(to).active(true);
          else
            throw new Error('listenToActiveSkope : requested scope ' + to + ' does not exist in the collection');



          //update the settings values based on the one of the active skope
          //test with copyright
          console.log( 'ACTIVE SKOPE MODEL', api.czr_skope( api.czr_activeSkope() )() );
          //store the current api save state()
          var _save_state = api.state('saved')(),
              current_skope_instance = api.czr_skope( api.czr_activeSkope() );//the active scope instance

          $.when( self.updateSettingValues( 'copyright', current_skope_instance.getSkopeSettingVal( 'copyright' ) ) ).done( function() {
              api.state('saved')( _save_state );
          });

          // if ( 'global' != api.czr_activeSkope() ) {
          //     // if ( _.has( api.czr_skope( api.czr_activeSkope() )().db, 'copyright' ) ) {

          //     // }

          // } else {
          //     var _set_val = current_skope_instance._getDBSettingVal('copyright'),

          //     api(api.CZR_Helpers.build_setId('copyright') ).silent_set( _set_val );
          //     console.log('IS DIRTY?', api(api.CZR_Helpers.build_setId('copyright') ).value );
          //     api.state('saved')( _save_state );
          // }
    },






    /*****************************************************************************
    * UPDATE SETTING VALUE
    *****************************************************************************/
    updateSettingValues : function( setId, val ) {
          var self = this,
              current_skope_instance = api.czr_skope( api.czr_activeSkope() );

          api( api.CZR_Helpers.build_setId(setId) ).silent_set( val, current_skope_instance.getSkopeSettingDirtyness( setId ) );

          //TEST UPDATE DYNAMIC STYLE CHECKBOX ON SWITCH
          // if ( 'trans' == to.dyn_type ) {
          //   api('hu_theme_options[dynamic-styles]').set(true);
          //   //api('hu_theme_options[dynamic-styles]').set(23);
          //   $('input[type=checkbox]', api.control('hu_theme_options[dynamic-styles]').container ).iCheck('update');
          // }

          //TEST UPDATE FONT SELECT ON SWITCH
          // if ( 'trans' == to.dyn_type ) {
          //   api('hu_theme_options[font]').set('raleway');
          //   //api('hu_theme_options[dynamic-styles]').set(23);
          //   $('select[data-customize-setting-link]', api.control('hu_theme_options[font]').container ).selecter('destroy').selecter();
          // }

          // var _img_id = 'trans' == to.dyn_type ? 23 : 25;
          // //TEST UPDATE LOGO ON SWITCH
          // api.control('hu_theme_options[custom-logo]').container.remove();

          // api.control.remove('hu_theme_options[custom-logo]');

          // var _constructor = api.controlConstructor.czr_cropped_image;
          // var _data = api.settings.controls['hu_theme_options[custom-logo]'];
          // api('hu_theme_options[custom-logo]').set(_img_id);

          // //add the control when the new image has been fetched asynchronously.
          // wp.media.attachment( _img_id ).fetch().done( function() {
          //   _data.attachment = this.attributes;
          //   api.control.add(
          //   'hu_theme_options[custom-logo]',
          //     new _constructor('hu_theme_options[custom-logo]', { params : _data, previewer :api.previewer })
          //   );
          // } );

    },







    /*****************************************************************************
    * WORDPRESS API ACTIONS ON INIT
    *****************************************************************************/
    getGlobalSettingVal : function() {
          var self = this, _vals = {};
          //parse the current eligible scope settings and write an setting val object
          api.each( function ( value, key ) {
            //only the current theme options are eligible
            if ( ! self.isSettingEligible(key) )
              return;
            var _k = self._extractOptName(key);
            _vals[_k] = { value : value(), dirty : value._dirty };
          });
          return _vals;
    },

    //fired in initialize
    addAPISettingsListener : function() {
          var self = this;
          console.log('BEFORE SETTING UP DIRTY VALUE LISTENER');
          //parse the current eligible scope settings and write an setting val object
          api.each( function ( value, key ) {

                //only the current theme options + some WP built in settings are eligible
                if ( ! self.isSettingEligible(key) )
                  return;

                api(key).callbacks.add( function(to, from, o) {
                      console.log('in api cb ', key, to, from, o);
                      console.log('DIRTY', api(key)._dirty  );

                      if( ! api(key)._dirty )
                        return;

                      var current_skope_instance = api.czr_skope( api.czr_activeSkope() );//the active scope instance

                      console.log('getSkopeSettingDirtyness', current_skope_instance.getSkopeSettingDirtyness( key ) );

                      if ( _.isUndefined(current_skope_instance) ) {
                        throw new Error('Skope base class : the active scope is not defined.');
                      }

                      var current_dirties = _.clone( current_skope_instance.dirtyValues.get() ),
                          _dirtyCustomized = {},
                          _k = self._extractOptName(key);

                      _dirtyCustomized[ _k ] = { value : to, dirty : api(key)._dirty };
                      current_skope_instance.dirtyValues.set( $.extend( current_dirties , _dirtyCustomized ) );
                });

          });
    },




    /*****************************************************************************
    * HELPERS
    *****************************************************************************/
    //@return the current active skope
    //If a skope different than global has saved db values, let's set it as active
    getActiveSkopeOnInit : function( collection ) {
          var _active_candidates = [],
              _def = _.findWhere( collection, {is_default : true } ).id;
          _def = ! _.isUndefined(_def) ? _def : 'global';

          _.each( collection, function( _skop ) {
              if ( ! _.isEmpty( _skop.db ) )
                _active_candidates.push( _skop.id );
          });

          //Apply a basic skope priority. => @todo refine this treatment
          if ( _.contains( _active_candidates, 'local' ) )
            return 'local';
          if ( _.contains( _active_candidates, 'group' ) )
            return 'group';
          if ( _.contains( _active_candidates, 'special_group' ) )
            return 'special_group';
          return _def;
    },


    isSettingEligible : function( setId ) {
          return -1 != setId.indexOf(serverControlParams.themeOptions) || _.contains( serverControlParams.wpBuiltinSettings, setId );
    },

    _extractOptName : function( setId ) {
          return setId.replace(serverControlParams.themeOptions, '').replace(/\[|\]/gi, '' );
    }

  });//api.Class.extend()


})( wp.customize , jQuery, _);