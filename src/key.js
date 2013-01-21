/*
 * key
 * https://github.com/danheberden/jquery-key
 *
 * Copyright (c) 2013 Dan Heberden
 * Licensed under the MIT license.
 */

(function( $ ) {

  // process the keydown event
  var handler = function( e, cache ){
            var el = this,
                key = e.keyCode || e.which,
                now = +new Date(),
                mod = '';

            // ignore control keyes (shft,cntrl,opt,cmnd,caps)
            if ( ( key > 15 && key < 19 )  || key === 20 || key === 91 ||
                // if we didn't ask to include inputs and didn't
                // directly bind to the input-ish element
                  ( !cache.options.bubbleInputs && el !== e.target &&
                // if we're in an input-ish item ( SELect, teXTArea, iNPut )
                  ( el.contentEditable === "true" || /(SEL|XTA|NP)/i.test( e.target.nodeName ) ) ) ) {
                return;
            }

            // standard mod keys
            if ( e.altKey ) {
              mod += 'a';
            }
            if ( e.ctrlKey ) {
               mod += 'c';
            }
            if ( e.metaKey ) {
              mod += 'm';
            }
            if ( e.shiftKey ) {
              mod += 's';
            }
            mod += key;

            if ( e.type === "keyup" ) {
              // un-flag state
              cache.state[ mod ] = false;

            } else {

              // flag state
              cache.state[ mod ] = true;
               // it's been longer than our limit time since anything
              if (  now - cache.lastKeyTime > cache.options.time ) {
                // kill any existing cache
                cache.keyLog = [];
              }
              // update our lastKeyTime with right now to check on the
              // next keydown event
              cache.lastKeyTime = now;

              // tab magic (dont tab out)
              if ( key === 9 && cache.options.holdTab  ) {
                e.preventDefault();
              }

              // check for a global handler (one that gets every keypress)
              if ( cache.actions[ '*' ] ) {
                cache.actions[ '*' ].call( el, e, cache, mod );
              }
              // store into combo log
              cache.keyLog.unshift( mod );

              // truncate the array if it's too long
              if ( cache.keyLog.length > cache.maxLength ) {
                cache.keyLog.length = cache.maxLength;
              }

              // check the combo log - go through each key
              for ( var i = 0; i < cache.keyLog.length; i++ ) {
                // and for each key, build a list of permutations
                // work backwards, since our keys are stored like that
                for ( var j = cache.keyLog.length - 1 - i, combo = []; j >= 0; j-- ) {
                  combo.push( cache.keyLog[j] );
                }
                // make the string permutation
                combo = combo.join(',');
                // and give it a shot, yo
                if ( cache.actions[ combo ] ) {
                  cache.actions[ combo ].call( el, e, cache, combo );
                }
              }

            }
        },

        // default options
        defaultOptions =  {
          // time until keypresses get forgotten
          time: 2000,
          // collect events from inputs on non-inputs/directly bound
          // events
          bubbleInputs: false,
          // if user presses tab in input, don't lose focus
          holdTab: false
        },

        // Add key->action to _key_actions object via $.data
        // wrap the keyup handler to use the _key_cache object
        bindAction = function( key, action, options ) {
          var $this = $( this ),
              data = $this.data() || {},
              cache,
              keyLength = key.split(',').length;

          // make our default object to hold everything
          // that's associated with the dom node bound
          if ( !data._key_cache ) {
            data._key_cache = {
              actions: {},
              handler: undefined,
              keyLog: [],
              maxLength: 0,
              lastKeyTime: 0,
              state: {},
              options: $.extend( {}, defaultOptions )
            };
          }
          cache = data._key_cache;

          // mesh in the custom options with this node's optinos
          $.extend( cache.options, options );

          // bind up the action to the key
          cache.actions[ key ] = action;

          // make sure our maxLength buffer is updated
          if ( keyLength > cache.maxLength ) {
            cache.maxLength = keyLength;
          }

          // we only want one handler bound to this element
          // since it's the same actions obj, future el:key->action
          // binds will work
          if ( !cache.handler ) {
            // make the handler with a wrapper fn to preserve
            // the actions and log in scope
            cache.handler = function(e){
              handler.call( $this[0], e, cache );
            };

            // actually bind/make the handler
            $this.keydown( cache.handler );
            $this.keyup( cache.handler );
          }

          return this;
        },

        // preprocessor for using C 'n stuff
        addKey = function( keys, action, opts ) {
           var controlCopy = keys,
              metaCopy;

          // handle capital C
          // if there's a capital C, we need to make one with `c` and one with `m`
          // as of now, not supporting permutations of them for useability sake
          if ( /C/.test( keys ) ) {
            controlCopy = keys.replace( '/C/g', 'c' );
            metaCopy = keys.replace( '/C/g', 'm' );
          }

          //bind up control to this
          bindAction.call( this, controlCopy, action, opts);

          // wanna bind some meta?
          if ( metaCopy ) {
            bindAction.call( this, metaCopy, action, opts );
          }
        },

        // Just a little thing to record the combo you want -
        // run $.fn.key( 'help' ) or $().key('help') to launch the
        // dialog/popup to track keyinputs
        help = function() {
          // add content to dom
          var $input = $('<input style="width:100%;border:1px solid #CCC;font-size:1.3em;">'),
              $output = $( '<div>' ),
              $clear = $( '<button>CLEAR</button>'),
              $halp = $( '<div style="position:absolute;top:0;left:0;width:100%;z-index:9001;background:#000;color:#FFF;font-size:1.3em;">' ).append( $input, $clear, $output );

          // bind input log
          $input.key('*', function( e, cache, key ) {
              var prev = $output.html();
              $output.html( prev + ( prev.length ? ',': '' ) + key );
            }, {
              keepTabInInput: true
            });

          // clear button
          $clear.bind( 'click', function() {
            $output.html('');
            $input.val('');
          });

          // oh harro dom
          $( document.body ).append( $halp );
        };

        // make the actual plugin
        $.fn.key = function( keys, action, opts ) {
          // asking for the combo maker tool thingy?
          if ( keys === "help" ) {
            help();
            return false;
          }

          if ( keys === "data" ) {
            return this.data( '_key_cache' );
          }

          var _this = this;

          // make keys an object if one wasn't passed
          if ( $.type( keys ) !== 'object' ) {
            var newKeys = {};
            newKeys[ keys ] = action;
            keys = newKeys;
          } else {
            opts = action;
          }
        // for each key-set, bind it up
          $.each( keys, function( i, v ) {
            addKey.call( _this, i, v, opts );
          });

        // chain this shit, yo
        return this;
      };
})( jQuery );
