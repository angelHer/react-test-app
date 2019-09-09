export default class AdsContainer {
    constructor({
        id = "",
        blackClass = "AdsBox",
        isEmpty = "",
        activewl = false,
        externalClass = "",
        ref = "",
        adStyle = "",
    }) {
        this._id = id;
        this._blackClass = blackClass;
        this._isEmpty = isEmpty;
        this._activewl = activewl;
        this._externalClass = externalClass;
        this._ref = ref;
        this._adStyle = adStyle;

        this._adClass = ''
        this._emptyClass = ''
    }

    /**
     * Getters de las propiedades de la clase AdsContainer
     */
    get id() {
        return this._id;
    }

    get blackClass() {
        return this._blackClass;
    }

    get isEmpty() {
        return this._isEmpty;
    }

    get activewl() {
        return this._activewl;
    }

    get externalClass() {
        return this._externalClass;
    }

    get ref() {
        return this._ref;
    }

    get adStyle() {
        return this._adStyle;
    }

    get adClass() {
        return this.id === 'ad_page_header' ? this.blackClass : this.emptyClass;
    }

    get emptyClass() {
        return this.isEmpty ? 'Ads__collaps' : '';
    }

    /**
     * Setter de las propiedades de la clase AdsContainer
     */
    set id(newId) {
        this._id = newId;
    }

    set blackClass(newClass) {
        this._blackClass = newClass;
    }

    set isEmpty(newVal) {
        this._isEmpty = newVal;
    }

    set activewl(newVal) {
        this._activewl = newVal;
    }

    set externalClass(newClass) {
        this._externalClass = newClass;
    }

    set ref(newRef) {
        this._ref = newRef;
    }

    set adStyle(newStyle) {
        this._adStyle = newStyle;
    }

    set adClass(newClass) {
        this._adClass = newClass;
    }

    /**
     * Funciones de la clase AdsContainer
     */

    get displayContainer() {
        return (this.activewl)
            ? this.getWhiteLabelContainer()
            : this.getDefaultContainer();
    }

    getDefaultContainer() {
        /**
         * TODO falta definir el ref y verificar para que se usa
         * @ data-google-query-id
         */
        const HTML = `
            <div className="Ads ${this.adStyle} ${this.adClass}">
                <div class="Ads__wrapper ${this.externalClass}">
                    <div class="Ads__title ${this.blackClass}">Publicidad</div>
                    <div class="Ads__container">
                        <div
                            id="${this.id}"
                        />
                    </div>
                </div>
            </div>`;

        return HTML;
    }

    getWhiteLabelContainer() {
        /**
         * TODO falta definir el ref y verificar para que se usa
         * @ data-google-query-id
         * TODO Mejorar la logica de la propiedad blackclass
         */
        const HTML = `
            <aside class="${this.blackClass} WhiteLabel ${this.isEmpty}">
                <div class="AdsBox__TitleContainer WhiteLabel">
                    <small class="AdsBox__Title WhiteLabel">Publicidad</small>
                </div>
                <div class="AdsBox__Container WhiteLabel">
                    <div
                        id="${this.id}"
                    />
                </div>
            </aside>
        `;

        return HTML;
    }

    insertLayerContainer(typeAdLayer) {
        const layerContainer = document.createElement("div");
        layerContainer.setAttribute("style", "margin:auto");
        layerContainer.setAttribute("id", typeAdLayer);
        document.body.insertBefore(layerContainer, document.body.firstChild);
    }
}
