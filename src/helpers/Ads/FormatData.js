class FormatData {
    static set format(dataUI) {
        const {
            content,
            uri,
            adunit,
            adUnitConfig,
        } = dataUI;
        const AD_CONFIG = Object.assign({}, {
            adunit,
            adUnitConfig,
            content,
            uri,
        });
        this.adUnitData = AD_CONFIG;
    }

    static get format() {
        return this.adUnitData;
    }
}

export default FormatData;
