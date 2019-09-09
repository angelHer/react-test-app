// import Utils from "@televisadigital/utilities";
import GPT from "./GooglePublishTag";
import FormatData from "./FormatData";
import Ads from "./Ads";
import AdsContainer from "./AdsContainer";
import { stringToCamel } from './Utils';
// import Prebid from "./prebid";
import { ConfigAds } from "./ConfigAds";

// Imports
import * as R from 'ramda';

class LogicAds {
    constructor(_configAds) {
        let {
            uri,
            contentType,
            adUnitConfig
        } = _configAds;


        // 1.- instanciar ads y obtenet adUnit
        this._ads = new Ads();
        this._adUnit = this._ads.getAdUnit(uri, adUnitConfig);
        this._adsProps = _configAds;

        this._container = new AdsContainer({
            id: this._adsProps.configAds.adHeader.id,
            activewl: this._adsProps.configAds.adHeader.activewl,
        });
        this._googleTag = new GPT(this._adUnit);

        /**
         * TODO cambiar propiedad por Utils.isMobile
         */
        // this.this._deviceType = Utils.isMobile;
        this._deviceType = 'mobile';

        this.initializeAds()
    }

    get adUnit() {
        return this._adUnit;
    }

    get adsProps() {
        return this._adsProps;
    }

    get deviceType() {
        return this._deviceType;
    }

    async initializeAds() {
        let preparedSizes = this.adsProps.configAds.adHeader.sizes;
        let tranformedSizes = R.map(size => stringToCamel(size), preparedSizes);

        const HEADER_CONTAINER = document.getElementById("adHeader");
        HEADER_CONTAINER.innerHTML = this._container.container;

        const bannerSize = this.getBannerSizeForDevice(tranformedSizes, this.deviceType);
        this._googleTag.getDisplayBanner(bannerSize, this.adsProps.configAds.adHeader.id);

        let desktopSize = this._ads.getBannerSize(tranformedSizes.desktopSize)
        let tabletSize = this._ads.getBannerSize(tranformedSizes.tabletSize)
        let mobileSize = this._ads.getBannerSize(tranformedSizes.mobileSize)

        let sizeMapping = await this._googleTag.createSizeMApping(
            desktopSize,
            tabletSize,
            mobileSize
        );
    }

    getBannerSizeForDevice(bannerSizes, deviceType) {
        let device;
        if (deviceType === "desktop") {
            device = this._ads.getBannerSize(bannerSizes.desktopSize);;
        } else if (deviceType === "tablet") {
            device = this._ads.getBannerSize(bannerSizes.tabletSize);;
        } else {
            device = this._ads.getBannerSize(bannerSizes.mobileSize);
        }
        return device;
    }
}

export default LogicAds;
