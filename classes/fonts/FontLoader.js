sap.ui.define([
  "sap/ui/core/Component",
  "sap/ui/core/IconPool",
  "jquery.sap.global"
], function( Component, IconPool, $ ){
  
  return Component.extend( "me.reichwald.classes.fonts.FontLoader",
  {
    /** @memberOf me.reichwald.classes.fonts.FontLoader */
    metadata: {
      properties: {
        fontAwesomeUrl:        { type: "string",  defaultValue: "https://use.fontawesome.com:443" },
        fontAwesomeCdn:        { type: "string",  defaultValue: "https://cdn.fontawesome.com:443" },
        fontAwesomeVersion:    { type: "string",  defaultValue: "v4.6.3" },
        fontAwesomeScrapper:   { type: "regexp",  defaultValue:
          /\.fa-([A-Za-z0-9-]*):before\s*{\s*content:\s*"\\([0-9a-fA-F]{4})/g },
        
        fontAwesomeCollection: { type: "string",  defaultValue: "fa" },
        fontAwesomeFontName:   { type: "string",  defaultValue: "FontAwesome" },
        fontAwesomeCode:       { type: "string" },
        
        async:                 { type: "boolean", defaultValue: false },
        defaultScrapper:       { type: "string",  defaultValue:
          /\.{{PREFIX}}([A-Za-z0-9-]*){{SUFFIX}}:before\s*{\s*content\s*:\s*('([^']*)|"([^"]*))/g.toString() }
        
      },
      publicMethods: [ "loadFontAwesome", "loadFont" ]
    },
    
    /** @memberOf me.reichwald.classes.fonts.FontLoader */
    loadFont: function( options, fontCssLocation, fontClassesCssLocation, fontClassesPrefix, fontClassesSuffix, fontCollection )
    {
      // Proxy Arguments
      if ( typeof options === "string" )
        options = {
          fontName: options,
          fontCssLocation: fontCssLocation,
          fontClassesCssLocation: fontClassesCssLocation,
          fontClassesPrefix: fontClassesPrefix,
          fontClassesSuffix: fontClassesSuffix,
          fontCollection: fontCollection
        };
      
      // Default Argument Transversion
      options.fontClassesPrefix = options.fontClassesPrefix || '';
      options.fontClassesSuffix = options.fontClassesSuffix || '';
      options.fontClassesCssLocation = options.fontClassesCssLocation || options.fontCssLocation;
      options.fontCollection = options.fontCollection || options.fontName;
      
      // Assign Callback, if existing
      var callback;
      Array.prototype.slice.call(arguments).forEach(function(arg){
        if ( arg.call )
          callback = arg;
      });
      
      // Adjust Default Regexp to wanted Font
      var regex = this.getDefaultScrapper();
      regex = regex.replace( /{{PREFIX}}/g, options.fontClassesPrefix );
      regex = regex.replace( /{{SUFFIX}}/g, options.fontClassesSuffix );
      regex = eval( regex );
      
      this._loadStyle( options.fontCssLocation );
      this._getData( options.fontClassesCssLocation, function( data )
      {
        data.replace( regex, function( __, name, charCode ){
          if ( !charCode ) return "";
          charCode = charCode.substring( 1 );
          if ( charCode.indexOf( '\\E' ) === 0 )
            charCode = charCode.substring( 1 );
          else if ( charCode.length === 1 )
            charCode = ( "0000" + charCode.charCodeAt(0).toString( 16 ).toUpperCase() ).slice( -4 );
          else return '';
          IconPool.addIcon( name, options.fontCollection, options.fontName, charCode );
          return '';
        });
        if ( callback )
          callback.call( this );
      });
      
      return this;
    },
    
    /** @memberOf me.reichwald.classes.fonts.FontLoader */
    loadFontAwesome: function( callback )
    {
      var url        = this.getFontAwesomeUrl();
      var cdn        = this.getFontAwesomeCdn();
      var version    = this.getFontAwesomeVersion();
      var scrapper   = this.getFontAwesomeScrapper();
      var collection = this.getFontAwesomeCollection();
      var fontName   = this.getFontAwesomeFontName();
      var code       = this.getFontAwesomeCode();
      
      var styleUrl   = url + '/' + code + '.css';
      var mapUrl     = url + '/releases/' + version + '/css/font-awesome-css.min.css';
      
      this._loadStyle( styleUrl );
      
      this._getData( mapUrl, function( data )
      {
        data.replace( scrapper, function( __, name, charCode )
        { IconPool.addIcon( name, collection, fontName, charCode ); });
        
        if ( callback ) callback.call( this );
      });
      
      return this;
    },
    
    /** @private @memberOf me.reichwald.classes.fonts.FontLoader */
    _createStyleTag: function( source, attributes )
    {
      attributes = $.extend({
        rel: 'stylesheet',
        type: 'text/css',
        href: source + ''
      }, attributes );
      
      var tag = document.createElement( "link" );
      var key;
      
      for ( key in attributes )
        tag.setAttribute( key, attributes[ key ] );
      
      return tag;
    },
    
    /** @private @memberOf me.reichwald.classes.fonts.FontLoader */
    _createScriptTag: function( source, attributes )
    {
      attributes = $.extend({
        src: source + '',
        type: 'text/javascript'
      }, attributes );
      
      var tag = document.createElement( "script" );
      var key;
      
      for ( key in attributes )
        tag.setAttribute( attributes[ key ] );
      
      return tag;
    },
    
    /** @private @memberOf me.reichwald.classes.fonts.FontLoader */
    _appendTagToHead: function( tag )
    {
      $('head').append( tag );
    },
    
    /** @private @memberOf me.reichwald.classes.fonts.FontLoader */
    _loadStyle: function( source, attributes )
    {
      this._appendTagToHead( this._createStyleTag( source, attributes ) );
    },
    
    /** @private @memberOf me.reichwald.classes.fonts.FontLoader */
    _loadScript: function( source, attributes )
    {
      this._appendTagToHead( this._createScriptTag( source, attributes ) );
    },
    
    /** @private @memberOf me.reichwald.classes.fonts.FontLoader */
    _getData: function( url, callback )
    {
      var async = this.getAsync();
      $.get({
        url: url,
        async: async,
        success: callback
      });
    }
  });
});
