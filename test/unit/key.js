var $document = $( document );

test( 'Basic Plugin Goodies', function() {
	expect(3);

  ok( typeof $.fn.key === 'function', 'ey defined' );
  ok( $( document ).key('*', function(){}).is( document ), 'Chaining goodness' );
  ok( $( document ).key().is( document ), 'Chaining goodness on bad api call' );
});

test( 'Bind and fire', function() {
  expect(1);

  stop();
  $document.key( '38' , function() {
    ok( true, 'Up pressed' );
    start();
  }).trigger( jQuery.Event('keydown', { keyCode: 38 } ) );
});

test( 'Bind and fire multiple', function() {
  expect(2);
  stop(2);
  $document.key( '37,39,37' , function() {
    ok( true, 'Left,Right,Left Pressed' );
    start();
  }).trigger( jQuery.Event('keydown', { keyCode: 37 }) )
    .trigger( jQuery.Event('keydown', { keyCode: 39 }) )
    .trigger( jQuery.Event('keydown', { keyCode: 37 }) );

    var notFired = true;
    $document.key( '40,37', function() {
        notFired = false;
      },{
        time: 200
      }).trigger( jQuery.Event('keydown', { keyCode: 37 }) )
        .trigger( jQuery.Event('keydown', { keyCode: 40 }) );
    // fire the keydown after our timeout time
    setTimeout( function() {
      $document.trigger( jQuery.Event( 'keydown', { keyCode: 37 } ) );
    }, 400);
    // check if the keypress triggered the bound hander (it shouldnt)
    setTimeout( function() {
      ok( notFired , 'Key Delay Timeout working' );
      start();
    }, 500);
});

test( 'Modifier Keys', function(){
  expect(1);
  stop();
  var passed = false;
  $( '#test-input' ).key( 's38,c79,m85,a229', function() {
    passed = true;
    ok( true, 'all modifier keys work' );
    start();
  }).trigger( jQuery.Event( 'keydown', { keyCode: 38, shiftKey: true } ) )
    .trigger( jQuery.Event( 'keydown', { keyCode: 79, ctrlKey: true } ) )
    .trigger( jQuery.Event( 'keydown', { keyCode: 85, metaKey: true } ) )
    .trigger( jQuery.Event( 'keydown', { keyCode: 229, altKey: true } ) )

  setTimeout( function(){
    if ( !passed ) {
      ok( false, 'Modifier keys not working' );
      start();
    }
  }, 3000 );

});

test( "Bubbling", function(){
  expect(2);
  stop(1);

  $document.key( '38', function() {
    ok( false, 'Document handler was hit on text-input (default)' );
    start();
  });
  $( '#test-textarea' ).trigger( jQuery.Event( 'keydown', { keyCode: 38 } ) );

  $document.key( '37', function() {
      ok( true, 'Document handler was hit on explicit bubbling option' );
      start();
    }, {
      bubbleInputs: true
    });
  $( '#test-textarea' ).trigger( jQuery.Event( 'keydown', { keyCode: 37 } ) );

  // reset the defaults
  $document.key( '*', function() { }, { bubbleInputs: false } );
  $document.key( '85', function() {
    ok( true, 'Bubbled from non-input' );
    start();
  });
  $( '#test-div' ).trigger( jQuery.Event( 'keydown', { keyCode: 85 } ) );
});

test( 'Unbind key', function(){
  expect(1);
  stop(1);

  $( document ).key( '86', function() {
    ok( true, 'This should only fire once!' );
    start();
  }).trigger( jQuery.Event( 'keydown', { keyCode: 86 } ));

  $( document ).key( '86', false ).trigger( jQuery.Event( 'keydown', { keyCode: 86 } ));


});

test( 'States', function(){
  expect( 2 );
  stop( 2 );

  var $test = $( '<div>' ),
      state = $test.key( '*', function(){}).key( 'data' ).state;

  if ( !state[ 100 ] ) {
    $test.trigger( jQuery.Event( 'keydown', { keyCode: 100 } ) );
    setTimeout( function() {
      ok ( state[ 100 ], "key currently pressed " + JSON.stringify( state ) );
      start();
      setTimeout( function() {
        $test.trigger( jQuery.Event( 'keyup', { keyCode: 100 } ) );
        setTimeout( function() {
          ok( !state[ 100 ], "key no longer pressed" );
          start();
        }, 50 );
      },50);
    }, 50 );

  }





});

