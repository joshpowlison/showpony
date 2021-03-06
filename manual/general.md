**v1.0.0+**

# Easy Setup

1. [Download Showpony's latest release](https://github.com/Josh-Powlison/showpony/releases) (click "Source code (zip)").
2. Put the _showpony_ folder and the _story_ folder on your website.
3. Put your story files into _story/en/_. Your files must be in alphabetical order. You can number them with leading zeroes to make this easy, like: "001.jpg", "002.jpg", "003.jpg", and so on.
4. Load _showpony.php_ in a sized div on your website.
    <div class="custom-class" style="width:640px;height:480px;">
        <script src="showpony/showpony.php"></script>
    </div>

You should now have a functional Showpony in your webpage!

# File Names

For Showpony to work at a basic level, your story files just need to be in order. But you can add quite a bit of useful info into filenames, and in some cases it's pretty much essential.

By putting data into your filenames, you can:

1. Have them go live at specific dates (and be hidden until then)
2. Display a title in the menu
3. Scrub video and audio properly in the menu
4. Mix media (like text and video) effectively, with each taking up a reasonable amount of the scrub area in the menu

## The convention

```
001 The Adventure Begins.jpg				// This will work
001 2019-01-01 {The Adventure Begins} 20s 0q.jpg	// But this has a lot more functionality
```

### Release Date

Release dates can look like any of the following:

```
// 2019, January, 1st
2019-01-01.jpg
19-01-01.jpg
19-1-1.jpg
19-1.jpg

2019-01-01-09-30.jpg	// Still January 1st, but at 9:30 AM
2019-01-01-09-30-01.jpg	// Still January 1st at 9:30 AM, but 1 second in
```

You can put them anywhere in your filename.

Note that the times you put in will be based on UTC and not on your local timezone.

If the file shouldn't be live yet, it will be prepended with a "~" and be hidden from users. Once it's time for it to go live, the "~" will be removed and your audience will be able to view it.

### Title

Titles have to be between brackets.

```
19-12-25 {Christmas Special}.vn
```

These will show up as titles for your story file, at the top of Showpony.

### Duration

Durations are integers and decimals denoted by an "s" at the end of them. They're the length of your file in seconds.

```
0001 30s.html		// 30 seconds long
0002 40.25s.html	// 40.25 seconds long
```

This is essential to add for videos and audio to display their times correctly, and will make scrubbing between files of different media much smoother.

### Quality

If you have different levels of quality for the same file (such as 480p, 720p, 1080p...), you can denote a quality value with "q" and an integer:

```
001 q0.mp4
001 q1.mp4
001 q2.mp4
```

The higher the number after q, the higher the level of quality.

If you have multiple levels of quality, one of them must always be 0.

You can set the names for each tier of quality in _settings.php_ in `QUALITY_NAMES`. These names will show up in the menu's quality popup.

You can have multiple quality levels for just a few files in your story. For example, maybe you want your video cutscenes to have multiple quality levels, but your Visual Novel portions to all be the same level of quality.

Everything else in the filename must stay exactly the same if you use this method- date to go live, title, etc.

### Hiding Char: ~

~ appears before files that aren't ready to go live and keeps users from directly accessing that file. When it's time for that file to go live, Showpony will automatically remove the ~.

Even if users try to access files that start with ~ directly, they'll be met with a 404 error (this is why the _.htaccess_ file is important!). If they try to see a list of files by going to a directory, they will be blocked.

~ will only be automatically applied and removed if the file has a valid date in the name. You can manually apply and remove it instead if you don't use properly formatted dates.

You can also add ~ to files in the _subtitles_ and _resources_ folders. If you unhide a Kinetic Novel or Text file, and it needs a file from _resources_, it'll automatically unhide it. Subtitles will also automatically be unhidden.

You can still access ~ files from the server side, and using the admin console you can still access them.

The only catch: if a folder is publicly accessible (no ~ at the start), and you go to the directory, it will show as 403, not 404. This is important: you need to make sure folders are hidden if you want nobody to discover that the folder exists. Otherwise, the 403 will confirm that the folder exists.

You can change this character by replacing it in _.htaccess_ and in _settings.php_ with `HIDING_CHAR`.

## Folders

You can put your files into folders, but the folders must be in alphabetical order and the files inside must be in alphabetical order for this to work correctly.

Folders are handy for organization, but folders can also have titles:

_c1 {Chapter 1}/_

If you have a title on a folder, that title will be passed along to the Showpony. So let's say you have a file in a path like so:

_en/c1 {Chapter 1}/001.txt_

Your title will be "Chapter 1" for the file, and any other files in the folder will have the same title. If a folder and contained file have a title:

_en/c1 {Chapter 1}/001 {The Adventure Begins}.txt_

They'll be combined and separated by a colon, like so: "Chapter 1: The Adventure Begins".

This allows you to specify section titles and chapter titles, which can be really helpful for user scrubbing through your story!

## Keeping Files at the End

You can have a file stay at the end, past all other files (even as new ones are unhidden), by naming it "end (Credits) 10.ext". This can let you have credits files and the like.

Assuming you start with dates or numbers with leading zeroes, the file starting with letters will always be at the very end of the set.

## Replacement Characters

Not all characters are supported in Windows (dagnabit Windows!). If you want to display certain characters in your story's titles, you'll have to use these codes instead:

```[q] ?
[dq] "
[c] :
[bs] \
[fs] /
[b] |
[a] *
[gt] >
[lt] <
```

# Required Showpony Files

You can remove module files you won't be using by going to _showpony/modules/_. Unused modules won't be loaded into Showpony- only loaded ones- so you don't have much to worry about it.

You can also remove _admin.php_ and _get-hidden-file.php_ if you don't want to support admin settings.

# Cover

You can add a cover by putting a file called _cover.jpg_ in the _story_ folder. This image will show up on initial load behind the menu and disappear when the user starts interacting with the Showpony.

# Locales

I recommend you enable PHP's ```intl``` extension. If it's not enabled, Showpony will still work, but in the settings dropdowns languages and subtitles won't be written out in their full names: they'll be "en" instead of "English", for example.

# Referencing the Showpony

The Showpony will be created as a JS object and passed to the Event Listener 'built' on the parent element. The parent element is whatever element you place the Showpony script inside of.

## Window Event Listeners

Showpony's window lets off the following event listeners. You'll have to check them on `showponyObject.window`:

`'play'`: We've unpaused.

`'pause'`: We've paused.

`'timeupdate'`: We've moved in the story at least a tiny bit. Contains `detail:{file,time}` that can be checked. (Note that file will be 0 for the first file, because this is computer counting. You may have to add 1 to this value before presenting it to users.)

`'end'`: We've hit the end of the story.

`'fullscreenEnter'`: Showpony's entered fullscreen.

`'fullscreenExit'`: Showpony's exited fullscreen.

## Functions

You can see the functions on the Showpony object by going to the [demo page](https://showpony.heybard.com/) and looking through the attributes below.

If you'd like more details here or that would be helpful, let me know! I figure seeing it in context and in action would be more helpful though.

### progress()

Used to go forward. It's functionality will differ for different modules, but it will always take the user forward a bit, whether it's to the next page in a comic, an upcoming time in a video, or the next keyframe in a visual novel.

`story.progress();`

### regress()

Used to go back. It's functionality will differ for different modules, but it will always take the user a bit back in time, whether it's to the previous page in a comic, a recent time in a video, or the previous keyframe in a visual novel.

`story.regress();`

### time

Set to a time in your overall story.

`story.time = 60;`

### file

Set to a file in your overall story. Starts at 0.

`story.file = 7;`

### fullscreen

Set to `true` or `false`, or use `'toggle'`.

`story.fullscreen = true;`

### subtitles

Set to the shortname of supported subtitles.

```
story.subtitles = 'en';		// Use English subtitles
story.subtitles = 'en-cc';	// Use English closed captions
story.subtitles = null;		// Turn off subtitles
```

### language

Set to the shortname of a supported language.

```
story.language = 'en';		// Use English files
story.language = 'es';		// Use Spanish files
```

### paused

Pause and unpause Showpony.

```
story.paused = false;		// Plays the Showpony
story.paused = true;		// Pauses the Showpony
story.paused = 'toggle';	// Plays if paused, and pauses if playing the Showpony
```

# Styles

Showpony has its own stylesheet, but each module also has their own stylesheet. You may have to go into a module's stylesheet to make the tweaks you want, or you can overwrite it with another stylesheet. You may have to place a new stylesheet into the body though, to make sure it comes after and not before any styles that Showpony loads in.

# Subtitles

Files go into the _subtitles_ folder, and into separate language folders like so:

_subtitles/en/_
_subtitles/es/_

If you want a subtitles folder to be for Closed Captions, end it with _-cc_, and it will be recognized in Showpony:

_subtitles/en-cc/_
_subtitles/zh-Hans-cc/_

All subtitle files must be:
1. 4 numbers long with leading zeroes
2. vtt extension

_0001.vtt_
_0002.vtt_
_0038.vtt_

Different modules handle subtitles different ways. Go to wiki pages for those modules to see how they handle subtitles.

You can hide subtitle files using ~, and they will be unhidden when the file its connected to is unhidden. So once the 5th file is unhidden in a story, _0005.vtt_ will be unhidden.

# Settings

_showpony/settings.php_ has some useful settings for you to set up. (wow, what a great sentence)

Below are the defaults.

```php
const DEFAULT_PATH			= 'story/';			// The path to the files we'll play
const DEFAULT_LANGUAGE		= 'en';				// If a language isn't set by the user, assume this one
const DEFAULT_SUBTITLES		= null;				// If subtitles aren't set by the user, assume this one
const DEFAULT_QUALITY		= 1;				// If quality level isn't set by the user, assume this one
const DEFAULT_FILE_DURATION	= 10;				// How long files without a duration in their filename will be assumed to be
const DEFAULT_START			= 0;				// Where we'll start in the Showpony by default
const DEFAULT_PROGRESS		= 'time';			// How to display progress in the menu. 'file', 'time', or 'percent'
const DEFAULT_DIRECTION		= 'left-to-right';	// 'left-to-right' or 'right-to-left'
const HIDING_CHAR			= '~';				// Start a filename with this char to hide it. Change in .htaccess too, to block direct URL access
const PRELOAD_BYTES			= .5 * 1048576;		// How many file bytes to preload
const RELEASE_DATES			= 1;				// How many upcoming files to show release dates for
const DEBUG					= false;			// Passes PHP notices and errors to Showpony's creation event
date_default_timezone_set('UTC');				// The timezone we're reading times in

const QUALITY_NAMES = [
	'480p'		// 0$
	,'720p'		// 1$
	,'1080p'	// 2$
	,'4K'		// 3$
];

// What modules to load for what file types
const FILE_GET_MODULE = [
	'mime:text'			=> 'text'
	,'mime:image'		=> 'image'
	,'ext:svg'			=> 'image' // Not all servers recognize SVGs as images by default
	,'mime:audio'		=> 'audio'
	,'mime:video'		=> 'video'
	,'ext:vn'			=> 'visualNovel'
	,'mime:application'	=> null
];

// This function is run on a new file's release. THIS WILL ONLY WORK IF THE FILE IS UNHIDDEN BY ITS DATE, not if a file's just manually added.
function NEW_RELEASE($number, $info){
	// $number: the file's number
	// $info: an array of the file's info, same layout as passed to Showpony JS
}
```

Most of these are pretty straightforward (let me know if they're not), but a few deserve special discussion:

## FILE_GET_MODULE

This associative array determines which modules to use for which file types.

File types available are partial MIME types, full MIME types, or extensions. It checks for a match to files in these order: extension > full MIME > partial MIME > `'default'`.

MIME types are information on the file type. You can pass a partial or complete MIME type- partial being everything before the slash in a type like "image/jpeg" and full being the whole "image/jpeg" bit.

The module's name here will be the name of the module's folder. If you set a file type's module to `null` you'll prevent that file from being opened.

## NEW_RELEASE

This function is meant to let you send emails, push notifications, etc when a new part of your story is released.

Note that this will only trigger if a file is unhidden by date, and at that time. If you have a file scheduled to go live at 1 PM, and nobody checks your website until 2 PM, `NEW_RELEASE()` won't trigger until 2 PM.