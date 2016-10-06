sap.ui.define( [
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel",
  "sap/m/Dialog",
  "sap/m/Button",
  "me/reichwald/classes/validation/RecursiveValidator"
], function( Controller, MessageToast, JSONModel, Dialog, Button, RecursiveValidator )
{
  "use strict";
  
  var Fragment = sap.ui.xmlfragment;
  
  return Controller.extend( "me.reichwald.pages.index.ControllerBase",
  {
    
    
    onInit: function()
    {
      var v = this.getView();
      
      this.validator = new RecursiveValidator({
        control: v
      });
      
      this.getRouter()
        .attachRouteMatched( this.onRouteMatched.bind( this ) )
        .attachRoutePatternMatched( this.onRoutePatternMatched.bind( this ) );
      
    },
    
    onRouteMatched: function() {},
    onRoutePatternMatched: function() {},
    
    getRouter: function()
    {
      return this.getOwnerComponent().getRouter();
    },
    
    
    getLanguage: function()
    {
      return c.getConfiguration().getLanguage() || 'de';
    },
    
    
    onNavBack: function()
    {
      var history = History.getInstance();
      if ( history.getPreviousHash() !== undefined )
        window.history.go( -1 );
      else
        this.getRouter().navTo( "" );
    },
    
    
    getModel: function( model )
    {
      return this.getOwnerComponent().getModel( model );
    },
    
    
    validate: function()
    {
      return this.validator.validate();
    },
    
    
    toast: function( text )
    {
      MessageToast.show( this.translate( text ) );
    },
    
    formatI18N: function()
    {
      var property = Array.prototype.join.call( arguments, '' );
      return this.getOwnerComponent().getModel( 'i18n' ).getProperty( property ) || property;
    },
    
    formatModel: function()
    {
      if ( arguments.length < 2 )
        return arguments[ 0 ];
      
      var models = Array.prototype.slice.call( arguments, 1 );
      var str = arguments[ 0 ];
      
      for ( var i in models )
        str = this.getView().getModel( models[ i ] ).getProperty( str ) || str;
      
      return str;
    },
    
    formatEval: function()
    {
      var evalStr = Array.prototype.join.call( arguments, '' );
      return eval( evalStr );
    },
    
    formatPadLeft: function( str, char, length )
    {
      var padStr = '';
      var actualPadLength = length * char.length - str.length;
      
      while( actualPadLength-- )
        padStr += char;
      
      if ( actualPadLength > 0 )
        padStr += char.substring( 0, actualPadLength * char.length );
      
      return padStr + str;
    },
    
    formatPadRight: function( str, char, length )
    {
      var padStr = '';
      var actualPadLength = length * char.length - str.length;
      
      while( actualPadLength-- )
        padStr += char;
      
      if ( actualPadLength > 0 )
        padStr += char.substring( 0, actualPadLength * char.length );
      
      return str+ padStr;
    },
    
    formatRegex: function( str, regex, repl )
    {
      return str.replace( eval( regex ), repl );
    },
    
    formatGet: function( str )
    {
      var ret = "";
      $.get({
        async: false,
        url: str,
        success: function( data ){ ret = data; }
      });
      return ret;
    }
    
  } );
} );
