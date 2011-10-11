# KeyIt - a jQuery Hotkey/Combo Plugin

Want to attach functions to key events? Combinations of keys? BOOM done.

## bind to shift-up
    $( '#someElement' ).key( 's38', function( event, cache, key ) {
      // event is the original event
      // cache is the internal object stored with $.data
      // key is the key (or combo of keys) that fired this handler
    });

## konami code
    $( document ).key( '38,38,40,40,37,39,37,39,66,65', function( event, cache, combo) {
        // yay! \o/
    });

## Built-in tool to get keycodes
Just fire `$().key( 'help' )` or `$.fn.key( 'help' )` to launch a simple
tool to echo the appropriate key combo as you type.

## Handles Mac Command/Control
While independent mappings exist for explicit use of control or command
(`c` and `m`) you can bind to either using a capital `C`. So `c38' will
match control-↑, `m38` will match command-↑ and `C38` will match either
control or command ↑.

## Need to kill off a handler?
Just rebind with false instead of a function.
    $( document ).key( '38,38,40,40,37,39,37,39,66,65', false );

## Settings
You can pass settings as the third argument. Keep in mind, though, that
these are attached for that particular DOM element (so that you don't
have to pass in settings each time) - so if you change the time-out to
300ms for an input later on, that will definitely affect attached keys
previously attached to that same input.

### bubbleInputs
By default, events text boxes, textareas, and selects won't bubble
up. If you want them to, pass `bubbleInputs: true` in the settings
object.

### time
This is the time before ignoring previous keys. The default is 2000
milliseconds.

### holdTab
Handy option to let tab work in inputs as a keypress and not actually
tab-out of the element. This would be for snippet-like behavior, such
as:
    var $someTextarea = $( '#someTextarea' );

    // if `f` and then tab is pressed
    $contentBox.key( '70,9', function() {
      var oldVal = $contentBox.val();
      // append 'unction' to the f :)
      $contentBox.val( oldVal + 'unction' );
    }, {
      holdTab: true
    });

## A note about coding style
There's definitely some areas of the code that could be written in a
more condensed fashion. This is on purpose. The minifier can do the
work of condensing the code; I'd rather it be easily understood by
everyone. I figured I'd mention this before any pull requests come
in to make the code super-duper compact/optimized.
