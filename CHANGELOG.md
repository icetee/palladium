# Change Log

## [Unreleased]

## [1.0.0] - 2016-09-04

## Added

- Supported mailing list

## [0.11.1] - 2016-09-03

## Added

- Is it possible to turn off Grammars
- In Developer mode not sending mail
- Optimalize startup time

## Changed

- Remove "Cheerio" dependency
- Change keymaps and menus filename
- Remove support mailgun (-800ms "gratis")
- Rename lib.js -> helpers.js

## Fixed

- Cleaning up cids
- Faulty querySelector
- After switching showStatusbarIcon memory leak
- Regulation
- Package dependencies

## [0.10.5] - 2016-08-30

## Added

- If no open pane then remove rocket icon
- New option to Settings (Show status bar icon)
- Add new listing for status bar icon (onDidChangeGrammar)
- Added status colors
- Cleaning up cids

## Fixed

- Validation problem
- No send HTML content
- After changing settings 'undefined' value

## Changed

- Optimalize .jsbeautifyrc
- Base CSS to LESS

## [0.9.4] - 2016-08-28

### Added

- Attach plaintext in multipart email
- New option to Settings (Plaintext save to file)

## Changed

- CHANGELOG structure
- README informations

## [0.9.3] - Code Simplification - 2016-08-27 :panda_face:

# Added

- Travis CI (beta)
- SMTP Authentication checker (Mailgun no supperted)

## Changed

- Settings structure
- Remove all 'self' variable
- Remove all 'require'
- Separate components and config files

## [0.9.2] - First Stable Release - 2016-08-27 :rocket:

### Added

- View class
- Status-bar icon
- LICENCE and CHANGELOG file
- Keywords, author to the package.json
- Spec folder from Atom package generator
- AppVeyor (beta)

### Fixed

- Fix .editorconfig
- Use Beautify all file
- Change name components class to functions
