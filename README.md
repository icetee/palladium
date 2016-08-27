# palladium [![Build Status](https://secure.travis-ci.org/icetee/palladium.png?branch=master)](http://travis-ci.org/icetee/palladium)

Send easily. Test for free. Send e-mail from Atom.

## Getting Started

```
apm install palladium
```

Or, Settings → Install → Search for palladium

## Usage

Open the Command Palette and type `palladium`.

![palladium](https://cloud.githubusercontent.com/assets/1855340/18030528/d83ff42c-6cb8-11e6-850e-979ab3f1e65e.gif)

## Keyboard shortcut

Set the keyboard shortcut you want in your [keymap](http://flight-manual.atom.io/using-atom/sections/basic-customization/#customizing-keybindings):

```cson
'atom-workspace atom-text-editor:not([mini])':
  'alt-m': 'palladium:send-mail'
```

## Features

- Simply create a configuration file
- [Nodemailer](https://github.com/nodemailer/nodemailer) use, lot of [setting](https://github.com/nodemailer/nodemailer#e-mail-message-fields) possibility.

## Troubleshooting

For help with common problems, see [ISSUES](https://github.com/icetee/palladium/issues).

## Release History

Read the [CHANGELOG](CHANGELOG.md).

## License

Copyright (c) 2016 . Licensed under the MIT license.
