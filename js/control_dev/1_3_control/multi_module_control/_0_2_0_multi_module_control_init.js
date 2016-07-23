
//extends api.CZRBaseModuleControl
var CZRMultiModuleControlMths = CZRMultiModuleControlMths || {};

$.extend( CZRMultiModuleControlMths, {

  initialize: function( id, options ) {
          var control = this;

          //listen to the module-collection setting changes
          //=> synchronize the columns in the sektion setting
          console.log('IN MULTI MODULE INITIALIZE ? ', options );
          api(id).callbacks.add( function() { return control.syncColumn.apply( control, arguments ); } );

          //when the synchronized sektion module sends its instance, check the consistency with the module-collection setting
          //=> each modules of the module-collection setting should be present in a column of the synchronized sektion
          // control.syncSektionModule().bind( function( sektion_module_instance ) {
          //     sektion_module_instance.czr_columnCollection.each( function( _col ) {
          //           console.log('_col.modules', _col.modules);
          //     });
          // });

          api.CZRBaseModuleControl.prototype.initialize.call( control, id, options );

  },


  ready : function() {
      var control = this;
      console.log('MODULE-COLLECTION CONTROL READY', this.id );
      api.CZRBaseModuleControl.prototype.ready.apply( control, arguments);
  },

  //cb of : api(control.id).callbacks.
  syncColumn : function( to, from, data ) {
        console.log('IN SYNC COLUMN', to, from, data );
        if ( ! _.isUndefined(data) && data.silent )
          return;
        console.log('IN SYNXXX', api.control('hu_theme_options[module-collection]').syncSektionModule()(), this.syncSektionModule()() );

        //ORPHANS MODULE REMOVED ON INIT, VOID()
        //=> there's no column to synchronize
        if ( _.has( data, 'orphans_module_removal' ) )
          return;

        var control = api.control('hu_theme_options[module-collection]');
        //MODULE ADDED
        //determine if a module has been added
        var added_mod = _.filter( to, function( _mod, _key ){
            return ! _.findWhere( from, { id : _mod.id } );
        } );
        if ( ! _.isEmpty( added_mod ) ) {
              console.log('ADDED MODULE?', added_mod );
              _.each( added_mod, function( _mod ) {
                      control.syncSektionModule().czr_Column( _mod.column_id ).updateColumnModuleCollection( { module : _mod } );
              });
        }

        //MODULE REMOVED
        var removed_mod = _.filter( from, function( _mod, _key ){
            return ! _.findWhere( to, { id : _mod.id } );
        } );
        if ( ! _.isEmpty( removed_mod ) ) {
              _.each( removed_mod, function( _mod ) {
                      control.syncSektionModule().czr_Column( _mod.column_id ).removeModuleFromColumnCollection( _mod );
              });
        }

        //MODULE HAS BEEN MOVED TO ANOTHER COLUMN
        if ( _.size(from) == _.size(to) && _.has( data, 'module') && _.has( data, 'source_column') && _.has( data, 'target_column') ) {
                $.when( control.syncSektionModule().moveModuleFromTo( data.module, data.source_column, data.target_column ) ).done( function() {
                      control.syncSektionModule().control.trigger('module-moved', { module : data.module, source_column: data.source_column, target_column :data.target_column });
                } );
        }
        control.trigger( 'columns-synchronized', to );
  },


  ////////////////////////////////////////////
  /// REMOVE MODULE
  ///////////////////////////////////////////
  //@param module = obj => the module model
  removeModule : function( module ) {
        var control = this;
        //remove module from DOM if it's been embedded
        if ( control.czr_Module.has( module.id ) && 'resolved' == control.czr_Module( module.id ).embedded.state() )
            control.czr_Module( module.id ).container.remove();

        //remove module from API
        control.removeModuleFromCollection( module );
  },


  removeModuleFromCollection : function( module ) {
        var control = this,
            _current_collection = control.czr_moduleCollection(),
            _new_collection = $.extend( true, [], _current_collection);

        _new_collection = _.filter( _new_collection, function( _mod ) {
              return _mod.id != module.id;
        } );
        control.czr_moduleCollection.set( _new_collection );
  }

});//$.extend//CZRBaseControlMths