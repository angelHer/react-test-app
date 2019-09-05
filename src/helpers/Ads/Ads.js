import * as R from 'ramda';

class Ads {
    constructor() {
        this._bannerTypes = {
            superBanner: [728, 90],
            boxBanner: [300, 250],
            largeBanner: [300, 600],
            skyscrapper: [120, 600],
            mobileBanner: [320, 50],
            comboBox: [[300, 250], [300, 600]],
            comboPortrait: [[120, 600], [300, 600]],
            comboMaster: [[728, 90], [955, 90], [970, 250], [970, 90]],
            boton: [[320, 40], [280, 40]],
        };
    }

    get getBannerTypes() {
        return this._bannerTypes;
    }

    getBannerSize(bannerType) {
        return this.getBannerTypes[bannerType];
    }

    getAdUnit(uri, config) {
        if (!config) return "";
        let adUnit = config.global;
        let uriSections = R.filter(section => section !== "", uri.split("/"));

        uriSections.length > 0
            ? adUnit += uriSections.reduce((previous, current) => `${previous}/${current}`, "")
            : adUnit += "/home";

        return adUnit;
    }

    /**
     * TODO Eliminar funcion
     * @param {*} contentType
     * @param {*} uri
     * @param {*} UIConfig
     */
    getAdUnitOld(contentType, uri, adUnit, adUnitConfig) {
        let result = adUnit;
        const AD_UNIT_CONFIG = adUnitConfig;
        const URI_SECTIONS = uri.split("/").filter(section => section !== "");
        // apply rules.
        if (AD_UNIT_CONFIG.length > 0) {
            AD_UNIT_CONFIG.forEach((config) => {
                if (this.validateConfig(contentType, config.contentType)) {
                    if (config.remove) {
                        for (let i = 0; i < config.remove; i += 1) URI_SECTIONS.pop();
                    }
                }
            });
        }
        if (URI_SECTIONS.length > 0) {
            result += URI_SECTIONS.reduce((previous, current) => `${previous}/${current}`, "");
        } else {
            result += "/home";
        }
        return result;
    }

    validateConfig(value, config) {
        return (config.include && config.include.includes(value))
            || (config.exclude && !config.exclude.includes(value));
    }
}

export default Ads;
