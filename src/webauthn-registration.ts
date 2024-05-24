import {
  create,
  parseCreationOptionsFromJSON,
  supported,
  type CredentialCreationOptionsJSON,
} from '@github/webauthn-json/browser-ponyfill'

type PublicKeyCredentialCreationOptionsJSON = CredentialCreationOptionsJSON['publicKey']

export class WebauthnRegistration extends HTMLElement {
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
    if (this._submitting) return

    this._submitting = true
    event.preventDefault()
    const creationOptions = parseCreationOptionsFromJSON({publicKey: this.options})

    try {
      const credential = await create(creationOptions)
      this._internals.setFormValue(JSON.stringify(credential))
      this._internals.form?.submit()
    } catch (error) {
      this.dispatchEvent(new CustomEvent('error', {detail: error}))
    }

    this._submitting = false
  }

  set options(value: PublicKeyCredentialCreationOptionsJSON) {
    this.setAttribute('options', JSON.stringify(value))
  }

  get options(): PublicKeyCredentialCreationOptionsJSON {
    const value = this.getAttribute('options')
    if (!value) throw new Error('options attribute is missing')

    return JSON.parse(value)
  }
}

declare global {
  interface Window {
    WebauthnRegistration: typeof WebauthnRegistration
  }
}

if (!window.customElements.get('webauthn-registration')) {
  window.WebauthnRegistration = WebauthnRegistration
  window.customElements.define('webauthn-registration', WebauthnRegistration)
}
