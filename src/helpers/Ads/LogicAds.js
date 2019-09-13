// import Utils from "@televisadigital/utilities";
import GPT from "./GooglePublishTag";
import Ads from "./Ads";
import SlotNumbers from './SlotNumbers';
import AdsContainer from "./AdsContainer";
import { stringToCamel } from './Utils';

import Prebid from './prebid/Prebid';

// Imports
import * as R from 'ramda';

class LogicAds {
    constructor(_configAds) {
        let {
            uri,
            contentType,
            adUnitConfig,
            adLayer,
            bidders
        } = _configAds;

        // 1.- instanciar ads y obtenet adUnit
        this._bidders = bidders;
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
        this._deviceType = 'desktop';

        // prebid
        this._prebid = new Prebid(this._bidders, this._deviceType);

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

    get bidders() {
        return this._bidders;
    }

    async initializeAds() {
        const DATA_AD_HEADER = this.adsProps.configAds.adHeader;
        let PREPARED_SIZES = DATA_AD_HEADER.sizes;
        const POSITION = DATA_AD_HEADER.position;
        const ID = DATA_AD_HEADER.id;
        let sizesByDevice = R.map(size => stringToCamel(size), PREPARED_SIZES);

        const HEADER_CONTAINER = document.getElementById("adHeader");
        HEADER_CONTAINER.innerHTML = this._container.displayContainer;

        const bannerSize = this.getBannerSizeForDevice(sizesByDevice, this.deviceType);

        let desktopSize = this._ads.getBannerSize(sizesByDevice.desktop)
        let tabletSize = this._ads.getBannerSize(sizesByDevice.tablet)
        let mobileSize = this._ads.getBannerSize(sizesByDevice.mobile)

        let sizeMapping = await this._googleTag.createSizeMApping(
            desktopSize,
            tabletSize,
            mobileSize
        );

        let sizesPrebid = {
            desktopSize,
            tabletSize,
            mobileSize
        }

        let mainSize = this._ads.getBannerSize(sizesByDevice[this.deviceType]);
        /**
         * Se inicializan los servicios de prebid
         * TODO revibir position desde prop
         */
        let position = 'atf';
        this._prebid.initializePrebid(
            sizesPrebid,
            this._adsProps.configAds.adHeader.id,
            mainSize,
            sizesByDevice,
            position
        );
        /**
         * Termina configuracion de prebid
         */

        this.initializeLayerAds();

        this.initializeDisplayAds(
            bannerSize,
            ID,
            sizeMapping,
            POSITION
        );
        // this.initializeNativeAds();
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
            return layer;
        }, this.adLayer)
    }

    getBannerSizeForDevice(bannerSizes, deviceType) {
        let device;
        if (deviceType === "desktop") {
            device = this._ads.getBannerSize(bannerSizes.desktop);
        } else if (deviceType === "tablet") {
            device = this._ads.getBannerSize(bannerSizes.tablet);
        } else {
            device = this._ads.getBannerSize(bannerSizes.mobile);
        }
        return device;
    }
}

export default LogicAds;
