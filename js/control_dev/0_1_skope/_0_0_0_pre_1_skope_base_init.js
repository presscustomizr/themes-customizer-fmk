

  //WHAT IS A SKOPE ?
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
  // WHAT IS THE SKOPE PRIORITY CONCEPT ?
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
  // WHAT IS THE SKOPE INHERITANCE CONCEPT ?
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
* THE SKOPE BASE OBJECT
*****************************************************************************/
var CZRSkopeBaseMths = CZRSkopeBaseMths || {};
$.extend( CZRSkopeBaseMths, {

    globalSettingVal : {},//will store the global setting val. Populated on init.

    initialize: function() {
          var self = this;
          //the czr_skopeCollection stores all skopes instantiated by the user
          api.czr_skopeCollection = new api.Value([]);//all available skope, including the current skopes
          //the current skopes collection get updated each time the 'czr-skopes-ready' event is triggered on the api by the preview
          api.czr_currentSkopesCollection = new api.Value([]);
          //the currently active scope
          api.czr_activeSkope = new api.Value();
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

          //REACT TO ACTIVE SKOPE UPDATE
          api.czr_activeSkope.callbacks.add( function() { return self.activeSkopeReact.apply(self, arguments ); } );

          //GLOBAL SKOPE COLLECTION LISTENER
          //api.czr_skopeCollection.callbacks.add( function() { return self.globalSkopeCollectionReact.apply(self, arguments ); } );

          //CURRENT SKOPE COLLECTION LISTENER
          //The scope collection is set on 'czr-skopes-ready' triggered by the preview
          //setup the callbacks of the scope collection update
          //on init and on preview change : the collection of scopes is populated with new scopes
          //=> instanciate the relevant scope object + render them
          api.czr_currentSkopesCollection.callbacks.add( function() { return self.currentSkopesCollectionReact.apply(self, arguments ); } );


          //LISTEN TO EACH API SETTING CHANGES
          //=>POPULATE THE DIRTYNESS OF THE CURRENTLY ACTIVE SKOPE
          this.updateActiveSkopeDirties();


          //LISTEN TO SKOPE SAVE EVENT
          self.bind( 'skopes-saved', function( _saved_dirties ) {
              self.updateSavedSkopesDbValues( _saved_dirties );
          });
    },

    //cb of 'current-skopes-saved' event
    updateSavedSkopesDbValues : function( _saved_dirties ) {
          _.each( _saved_dirties, function( _dirties, _skope_id ) {

               var _current_model = $.extend( true, {}, api.czr_skope( _skope_id )() ),
                  _api_ready_dirties = {};
               //build the api ready db value for the skope.
               //=> it shall contains only the option name, not the full name
               //=> 'background_color', not 'hu_theme_options[background_color]'
                _.each( _dirties, function( _val, _wp_opt_name ) {
                      var _k = api.CZR_Helpers.getOptionName( _wp_opt_name );
                      _api_ready_dirties[_k] = _val;
                });

               $.extend( _current_model.db, _api_ready_dirties );
               api.czr_skope( _skope_id )( _current_model );
          });
    },


    //fired in initialize
    //=> embed the wrapper for all skope boxes
    embedSkopeWrapper : function() {
        var self = this;
        $('#customize-header-actions').append( $('<div/>', {class:'czr-scope-switcher'}) );
    },



    /*****************************************************************************
    * WORDPRESS API ACTIONS ON INIT
    *****************************************************************************/

    //fired in initialize
    ////UPDATE THE CURRENT SKOPE DIRTIES
    updateActiveSkopeDirties : function() {
          var self = this;
          //parse the current eligible scope settings and write an setting val object
          api.each( function ( value, setId ) {

                //only the current theme options + some WP built in settings are eligible
                if ( ! self.isSettingEligible(setId) )
                  return;

                api( setId ).callbacks.add( function( new_val, old_val, o ) {
                      if( ! api(setId)._dirty )
                        return;

                      //UPDATE THE CURRENT SKOPE DIRTIES
                      var current_skope_instance = api.czr_skope( api.czr_activeSkope() );//the active scope instance
                      if ( _.isUndefined(current_skope_instance) ) {
                        throw new Error('Skope base class : the active scope is not defined.');
                      }

                      var current_dirties = $.extend( true, {}, current_skope_instance.dirtyValues() ),
                          _dirtyCustomized = {};

                      _dirtyCustomized[ setId ] = new_val;
                      current_skope_instance.dirtyValues.set( $.extend( current_dirties , _dirtyCustomized ) );
                });

          });
    }

});//$.extend()