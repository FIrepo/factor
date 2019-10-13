export default Factor => {
  return new (class {
    constructor() {
      this._settings = {}
      this.added = {}
      this.setup()
    }

    async setup() {
      this.config = Factor.$configServer
        ? Factor.$configServer.settings()
        : Factor.$config.settings() || {}

      this.settingsFiles = require(`~/.factor/loader-settings.js`)

      this.load()
    }

    load() {
      const factories = { ...this.settingsFiles, ...this.added }

      const settingsArray = Factor.$filters.apply(
        "factor-settings",
        Object.values(factories).map(_obj => _obj(Factor))
      )

      const merged = Factor.$utils.deepMerge([this.config, ...settingsArray])

      this._settings = Factor.$filters.apply("merged-factor-settings", merged)
    }

    add(files = {}) {
      this.added = { ...this.added, ...files }
      this.load()
    }

    all() {
      return this._settings
    }

    get(key, defaultValue) {
      return Factor.$utils.dotSetting({ key, settings: this._settings }) || defaultValue
    }
  })()
}