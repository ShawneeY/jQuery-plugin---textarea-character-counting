/* This is a jQuery plugin adding character limit function to HTML textarea
   element.

	Current limitations(June,2012):
	1. character count will NOT update when delete from contextmenu. As of
	current, there is no way to detect contextmenu delete event without using a
	jQuery contextmenu plugin(contextmenu is the menu brought up by right
	clicking the mouse on a web page)

	2. drop event does not work on desktop safari (cause not yet determined)

	For more information about the structure of a jQuery plugin, go to:
	http://docs.jquery.com/Plugins/Authoring

	This javascript file is used with htdocs/presentation/form/textarea.comp
*/

/* create closure */
(function( $ ) {

	/* plugin definition */
	$.fn.character_limit = function( options ) {

		/* plugin default options */
		var defaults = {
			max_char : 200,
			strict_mode : false
		};

		var options = $.extend(defaults, options);

		/*
			This helper function returns text:
			'character' or 'charactets' plural form
			based on input parameter length.
		*/
		function get_character_text(length) {
			return 'character' + ( length !== 1 ? 's' : '' );
		}

		/*
			This function tracks the number of character already
			inputted and updates the prompt text below the textarea accordingly
			Arguments:
				textarea: the textarea jQuery object
		*/
		function update_char_count(textarea) {

			var current_value = textarea.val()

			var current_char_length = current_value.length;

			var remaining_char_length = options.max_char - current_char_length;

			/* no more remaining character left, need to display prompt text differently */
			if ( remaining_char_length < 0 ) {

				// if ( options.strict_mode ) {
				// 	textarea.val(current_value.substr(0, options.max_char - 1));
				// }

				var exceeded_char_lenth = Math.abs(remaining_char_length);

				/*set the text color to red as a warning*/
				textarea.next('.char_counting_message').css('color', '#FF0000');

				/* update text message */
				textarea.next().children('span.current_count').html(current_char_length + ' ' + get_character_text(current_char_length) + ' entered.');
				textarea.next().children('span.remaining_count').html(exceeded_char_lenth + ' ' + get_character_text(exceeded_char_lenth) + ' over the limit.');

			} else { /* character limit not yet reached, just need to update character count */
				/* set the text color back to black */
				if (remaining_char_length == 0 && options.strict_mode ) {
					textarea.val(current_value.substr(0, options.max_char - 1));
				}

				textarea.next('.char_counting_message').css('color', '#000000');

				/* update text message */
				textarea.next().children('span.current_count').html(current_char_length + ' ' + get_character_text(current_char_length) + ' entered.');
				textarea.next().children('span.remaining_count').html(remaining_char_length + ' ' + get_character_text(remaining_char_length) + ' remaining.');
			}
		}

		/* return this keyword to maintain chainability */
		return this.each(function() {

			var textarea = $(this);

			/* insert prompt text template below the selected textarea */
			textarea.after(
				  '<p class="char_counting_message" style="margin: 0.5em 0 0 0; font-size: 80%;">'
				+ '<span class="current_count"></span>'
				+ '&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;'
				+ '<span class="remaining_count"></span>'
				+ '</p>'
			);

			/* initialize character count */
			update_char_count(textarea);

			/*
				bind keyup and mouseup event
				namespace bound events to avoid interfering with other events
				that might have been bound to the same type of event (when unbind)
			*/
			textarea.bind('keyup.character_limit mouseup.character_limit', function(e){
				update_char_count(textarea);
			});

			/* bind cut, paste and drop event using setTimeout function */
			textarea.bind('cut.character_limit paste.character_limit drop.character_limit', function(e){

				/*
					For javascript's purposes the text is not in the text area
					when the cut/paste/drop is made. It happens after.
					The setTimeout() to zero pushes the statement inside to the
					bottom of the current stack so the bound events could finish
					firing.
				*/
				setTimeout(function(){
					update_char_count(textarea);
				}, 0);
			});
		});
	};
// end of closure
})( jQuery );
