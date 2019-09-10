// import Utils from "@televisadigital/utilities";
import GPT from "./GooglePublishTag";
import Ads from "./Ads";
import SlotNumbers from './SlotNumbers';
import AdsContainer from "./AdsContainer";
import { stringToCamel } from './Utils';

// Imports
import * as R from 'ramda';

class LogicAds {
    constructor(_configAds) {
        let {
            uri,
            contentType,
            adUnitConfig,
            adLayer
        } = _configAds;

        // 1.- instanciar ads y obtenet adUnit
        this.adLayer = adLayer;
        this.contentType = contentType

        this._slotNumbers = new SlotNumbers();

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
        const DATA_AD_HEADER = this.adsProps.configAds.adHeader;
        let PREPARED_SIZES = DATA_AD_HEADER.sizes;
        const POSITION = DATA_AD_HEADER.position;
        const ID = DATA_AD_HEADER.id;
        let tranformedSizes = R.map(size => stringToCamel(size), PREPARED_SIZES);

        const HEADER_CONTAINER = document.getElementById("adHeader");
        HEADER_CONTAINER.innerHTML = this._container.displayContainer;

        const bannerSize = this.getBannerSizeForDevice(tranformedSizes, this.deviceType);

        let desktopSize = this._ads.getBannerSize(tranformedSizes.desktopSize)
        let tabletSize = this._ads.getBannerSize(tranformedSizes.tabletSize)
        let mobileSize = this._ads.getBannerSize(tranformedSizes.mobileSize)

        let sizeMapping = await this._googleTag.createSizeMApping(
            desktopSize,
            tabletSize,
            mobileSize
        );

        this.initializeLayerAds();

        this.initializeDisplayAds(
            bannerSize,
            ID,
            sizeMapping,
            POSITION
        );

        this.initializeNativeAds();
    }

    initializeNativeAds() {
        this._slotNumbers.counter++;
        /**
         * TODO cambiar los parametros, se recibiran desde el constructor
         */
        this._googleTag.getNativeBanner('fiveitems_native', 'FiveItem', this._slotNumbers.counter)
    }

    initializeDisplayAds(bannerSize, id, sizeMapping, position) {
        this._slotNumbers.counter++;

        this._googleTag.getDisplayBanner(
            bannerSize,
            id,
            sizeMapping,
            position,
            this._slotNumbers.counter
        );
    }

    initializeLayerAds() {
        /**
         * Insert Ads de tipo Layer
         * 1x1 y 2x2
         */
        R.map(layer => {
            if(R.includes(this.contentType, layer.contentTypes)) {
                this._slotNumbers.counter++;
                this._container.insertLayerContainer(layer.id)
                this._googleTag.getLayerBanner(this.adUnit, layer.id);
            }
        }, this.adLayer)
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
