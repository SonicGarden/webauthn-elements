# &lt;webauthn&gt; elements

This package provides two custom HTML elements for WebAuthn registration(`webauthn-registration`) and WebAuthn login(`webauthn-login`).
WebAuthn is a web standard for authenticating users using public key credentials.
These custom elements are designed to easily integrate the WebAuthn registration and login process.

## Installation
Available on [npm](https://www.npmjs.com/) as [**@sonicgarden/webauthn-elements**](https://www.npmjs.com/package/@sonicgarden/webauthn-elements).
```
$ npm install --save @sonicgarden/webauthn-elements
```

## Usage

### Script

Import as ES modules:

```js
import '@sonicgarden/webauthn-elements'
```

These custom elements can be used within HTML forms. The registration and login process is triggered by the form's submit event.

```html
<!-- Registration -->
<form method="post">
  <webauthn-registration name="credential" options="PublicKeyCredentialCreationOptionsJSON"></webauthn-registration>
  <button type="submit">Register</button>
</form>

<!-- Login -->
<form method="post">
  <webauthn-login name="credential" options="PublicKeyCredentialRequestOptionsJSON"></webauthn-login>
  <button type="submit">Login</button>
</form>
```

### Events
- `unsupported`: Triggered during the connectedCallback timing if the browser does not support WebAuthn.
- `error`: Triggered when the authentication dialog is cancelled, etc.

## License

Distributed under the MIT license. See LICENSE for details.
