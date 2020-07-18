# Mason Plus 

Current changes by Raafi Rivero

Forked from : ![Flagrow logo](https://avatars0.githubusercontent.com/u/16413865?v=3&s=20) [Flagrow](https://flagrow.io/)

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/raafirivero/mason/blob/master/LICENSE.md) [![Latest Stable Version](https://img.shields.io/packagist/v/raafirivero/mason.svg)](https://packagist.org/packages/raafirivero/mason) [![Total Downloads](https://img.shields.io/packagist/dt/raafirivero/mason.svg)](https://packagist.org/packages/raafirivero/mason) [![Support Us]

Add custom fields to your discussions. Features:

- Create custom fields with name, icon and description
- Fields can be required or optional
- Fields accept a dropdown selector or user-provided answers
- User answers can be validated with custom Laravel Validator rules
- You can choose the number of columns of the layout
- (experimental) show the tags field as a Mason field

**Note:** due to the way the Flarum discussion composer works, it currently cannot be automatically resized to fit all fields. If you have many fields you will have to manually increase the composer height with the mouse handle.

Looking for a similar extension but for user profiles ? Check out [Masquerade](https://github.com/flagrow/masquerade).

## Installation

Use [Bazaar](https://discuss.flarum.org/d/5151-flagrow-bazaar-the-extension-marketplace) or install manually:

```bash
composer require raafirivero/mason
```

## Updating

```bash
composer update raafirivero/mason
php flarum migrate
php flarum cache:clear
```

## Configuration

Once enabled, a new Mason tab will show up in the admin.

### Fields

Fields can be created, edited and reordered on the page.
New fields are immediately visible in the frontend.

If you delete a field, it will be removed from all discussion that used it.
Fields use a "soft delete" feature so the data is preserved in the database even if you delete it.
You can bring the field and its answers back by editing the database if you need.

### Answers

Answers are pre-made answers for a field.
If you want to keep an answer visible but prevent new discussions from using it, you can change its suggestion state.
If the field accepts user values, these will show up as non-suggested answers.

You can rename an answer (either admin or user made) and it will be updated everywhere it's used.

Deleting an answer will **permanently** remove it from all discussion using it.
Unlike fields it doesn't use "soft deletes" and as such cannot be recovered.

### Permissions

The extension comes with several permissions to choose who can interact with custom fields. Check the Permissions tab to configure them.

## Usage

The custom fields form will display on the discussion composer, on the first post of the discussion and as an option in the discussion edit menu.
The layout can be customized via the settings available in the Mason page of the admin panel.

## Support our work

Check out how to support Flagrow extensions at [flagrow.io/support-us](https://flagrow.io/support-us).

## Security

If you discover a security vulnerability within Mason, please send an email to the Gravure team at security@raafirivero.io. All security vulnerabilities will be promptly addressed.

Please include as many details as possible. You can use `php flarum info` to get the PHP, Flarum and extension versions installed.

## Links

- [Flarum Discuss post](https://discuss.flarum.org/d/7028)
- [Source code on GitHub](https://github.com/raafirivero/mason)
- [Report an issue](https://github.com/raafirivero/mason/issues)
- [Download via Packagist](https://packagist.org/packages/raafirivero/mason)

Original extension by [Flagrow](https://flagrow.io/).
Forked by [Raafi Rivero](https://raafirivero.com/).
