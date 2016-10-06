sap.ui.define([
  "jquery.sap.global",
  "sap/ui/core/Control"
], function( $, Control )
{
  var SourceView = Control.extend( "me.reichwald.controls.SourceView",
  {
    
    metadata: {
      properties: {
        
        aceBaseUrl:     { type: "string",   defaultValue: "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/" },
        
        aceScript:      { type: "string",   defaultValue: "ace.js"      },
        aceTheme:       { type: "string",   defaultValue: "eclipse"     },
        aceMode:        { type: "string",   defaultValue: "javascript"  },
        readOnly:       { type: "boolean",  defaultValue: false         },
        
        code:           { type: "string",   defaultValue: ""            }
        
      }
    },
    
    renderer: {
      render: function ( rm, c )
      {
        rm.write( "<div" );
        rm.writeControlData( c );
        rm.addClass( "me-reichwald-controls-SourceView" );
        rm.addStyle( "width", "100%" );
        rm.addStyle( "min-height", "50em" );
        rm.addStyle( "height", "100%" );
        rm.writeClasses();
        rm.writeStyles();
        rm.write( ">" );
        rm.write( "</div>" );
        
      }
    },
    
    onAfterRendering: function ()
    {
      if ( window.ace )
        this._createEditor();
      else
        this._loadAce();
    },
    
    _createEditor: function()
    {
      var e = this.editor;
      if ( !e )
        e = this.editor = ace.edit( this.getId() );
      e.setTheme( "ace/theme/" + this.getAceTheme() );
      e.getSession().setMode( "ace/mode/" + this.getAceMode() );
      e.getSession().setTabSize( 2 );
      e.setValue( this.getCode() );
      e.setReadOnly( this.getReadOnly() );
      e.setShowPrintMargin( false );
    },
    
    _loadAce: function()
    {
      $.getScript( this.getAceBaseUrl() + this.getAceScript(), this._createEditor.bind( this ) );
    }
    
    
  });
  
  $.extend( SourceView.prototype,
  {
    
    setCode: function( code )
    {
      if ( !code ) code = "";
      code = "" + code;
      
      this.setProperty( "code", code, true );
      if ( this.editor )
        this.editor.setValue( code );
    },
    
    setAceTheme: function( theme )
    {
      if ( !theme ) theme = "eclipse";
      theme = theme + "";
      this.setProperty( "aceTheme", theme, true );
      if ( this.editor )
        this.editor.setTheme( "ace/theme/" + theme );
    },
    
    setAceMode: function( mode )
    {
      if ( !mode ) mode = "";
      mode = "" + mode;
      this.setProperty( "aceMode", mode, true );
      if ( this.editor )
        this.editor.getSession().setMode( "ace/mode/" + mode );
    },
    
    setReadOnly: function( mode )
    {
      mode = ( !mode && mode !== false ) ? true : !!mode ;
      this.setProperty( "readOnly", mode, true );
      if ( this.editor )
        this.editor.setReadOnly( mode );
    }
    
  });
  
  return SourceView;
  
});
