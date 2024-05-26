import {
  get,
  parseRequestOptionsFromJSON,
  supported,
  type CredentialRequestOptionsJSON,
} from '@github/webauthn-json/browser-ponyfill'

type PublicKeyCredentialRequestOptionsJSON = NonNullable<CredentialRequestOptionsJSON['publicKey']>

export class WebauthnLogin extends HTMLElement {
  static formAssociated = true

  private _internals: ElementInternals
  private _submitting = false

  // eslint-disable-next-line custom-elements/no-constructor
  constructor() {
    super()
    this._internals = this.attachInternals()
    this.hidden = true
  }

  connectedCallback(): void {
    if (!supported()) {
      this.dispatchEvent(new CustomEvent('unsupported'))
      return
    }

    this._internals.form?.addEventListener('submit', this.handleSubmit)
  }

  disconnectedCallback(): void {
    this._internals.form?.removeEventListener('submit', this.handleSubmit)
  }

  private handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()
    if (this._submitting) return

    this._submitting = true
    const credentialOptions = parseRequestOptionsFromJSON({publicKey: this.options})

    try {
      const credential = await get(credentialOptions)
      this._internals.setFormValue(JSON.stringify(credential))
      this._internals.form?.submit()
    } catch (error) {
      this.dispatchEvent(new CustomEvent('error', {detail: error}))
    }

    this._submitting = false
  }

  set options(value: PublicKeyCredentialRequestOptionsJSON) {
    this.setAttribute('options', JSON.stringify(value))
  }

  get options(): PublicKeyCredentialRequestOptionsJSON {
    const value = this.getAttribute('options')
    if (!value) throw new Error('options attribute is missing')

    return JSON.parse(value)
  }
}

declare global {
  interface Window {
    WebauthnLogin: typeof WebauthnLogin
  }
}

if (!window.customElements.get('webauthn-login')) {
  window.WebauthnLogin = WebauthnLogin
  window.customElements.define('webauthn-login', WebauthnLogin)
}
