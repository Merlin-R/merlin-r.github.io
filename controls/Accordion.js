sap.ui.define([
  "sap/m/Panel",
  "me/reichwald/controls/AccordionRenderer",
  "jquery.sap.global"
], function( Panel, Renderer, $ )
{
  "use strict";
  
  var debufferMs = 200;
  
  // Virtual function binding, with delegation of callee context to function arguments
  var delegateBrowserEvent = function( context, func )
  {
    return function() { var that = this; func.call( context, { cxt: that, args: arguments } ); };
  };
  
  var Accordion = Panel.extend( "me.reichwald.controls.Accordion",
  {
    
    metadata: {
      properties: {
        multiExpand: { type: "boolean", defaultValue: false }
      },
      
      aggregations: {
        content: { type: "sap.m.Panel", multiple: true, visibility: "public" }
      },
      
      assosiations: {
        
      },
      
      events: {
        itemExpand: {
          enablePreventDefault: true, 
          parameters: { 
            expand:  { type: "boolean" }
          }
        }
      }
    },
    
    init: function()
    {
      
      // Lock dispatcher context
      this.addStyleClass( "sapUiNoMargin" );
      this._dispatchItemExpand = this._dispatchItemExpand.bind( this );
      this._dispatchBrowserEvents = delegateBrowserEvent( this, this._dispatchBrowserEvents );
      
    },
    
    renderer: Renderer,
    
    _dispatchItemExpand: function( event )
    {
      // Debuffer event - Prevent double fire of handler for firefox
      // ( "click" and "tap" are both called )
      this._lastDispatchedBrowserEvent = $.now();
      
      
      var source = event.getSource();
      var expand = event.getParameter( "expand" );
      
      if ( !this.fireItemExpand({ item: source, expand: expand }) )
      {
        event.preventDefault();
        return;
      }
      
      if ( this.getMultiExpand() || !expand )
        return;
      
      this.getContent().forEach((function( panel ){
        if ( panel !== source )
        {
          if ( this.fireItemExpand({ item: panel, expand: false }) )
          {
            panel.setExpanded( false );
          }
          else
          {
            event.preventDefault();
            return;
          }
        }
      }).bind(this));
    },
    _lastDispatchedBrowserEvent: 0,
    _dispatchBrowserEvents: function( event )
    {
      
      var nEvt = event.args[ 0 ];
      var source = event.cxt;
      
      var $element = $( nEvt.target );
      
      do 
      {
        if ( $element.parent().attr( 'id' ) === source.getId() )
        {
          if (
            !$element.hasClass( "sapMPanelWrappingDivTb" ) &&
            !$element.hasClass( "sapMPanelWrappingDiv" )
          )
            return;
        }
        
        
      }
      while ( ( $element = $element.parent() ) && $element.attr( 'id' ) !== this.getId() )
      
      nEvt.preventDefault();
      nEvt.stopImmediatePropagation();
      
      // Debuffer event - Prevent double fire of handler for firefox
      // ( "click" and "tap" are both called )
      if ( this._lastDispatchedBrowserEvent > ( $.now() - debufferMs ) )
        return;
      
      
      source.setExpanded( !source.getExpanded() );
      
    },
    
    onBeforeRendering: function()
    {
      var panels = this.getContent();
      var accordion = this;
      panels.forEach( function( panel )
      {
        panel.setExpandable( true );
        panel.addStyleClass( "comCproControlsAccordion" );
        
        try {
          panel.detachExpand( accordion._dispatchItemExpand );
          panel.detachBrowserEvent( "click", accordion._dispatchBrowserEvents );
          panel.detachBrowserEvent( "tap", accordion._dispatchBrowserEvents );
        } catch ( ex ) {}
        
        panel.attachExpand( accordion._dispatchItemExpand );
        panel.attachBrowserEvent( "click", accordion._dispatchBrowserEvents );
        panel.attachBrowserEvent( "tap", accordion._dispatchBrowserEvents );
        
      });
    }
    
  });
  
  return Accordion;
});