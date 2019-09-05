// import Utils from "@televisadigital/utilities";
import GPT from "./GooglePublishTag";
import FormatData from "./FormatData";
import Ads from "./Ads";
import AdsContainer from "./AdsContainer";
// import Prebid from "./prebid";
import { ConfigAds } from "./ConfigAds";

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

        this._googleTag = new GPT(this._adUnit);
        // 2.- Inicializar la libreria ads y agregar script al dom
        this.initializeAds()
    }

    get adUnit() {
        return this._adUnit;
    }

    get adsProps() {
        return this._adsProps;
    }

    initializeAds() {
        // const {
        //     desktopSize,
        //     tabletSize,
        //     mobileSize,
        // } = this.adProps;

        // Inicializar la libreria y scripts


        // Crear contenedores
        const CONTAINER = new AdsContainer({
            id: this.adsProps.configAds.adHeader.id,
            activewl: this.adsProps.configAds.adHeader.activewl,
        });

        const HEADER_CONTAINER = document.getElementById("adHeader");
        HEADER_CONTAINER.innerHTML = CONTAINER.container;

        /**
         * TODO mandarle los tamaños como propiedad
         */
        let desktopSize = this._ads.getBannerSize('superBanner');
        console.log('size', desktopSize);

        this._googleTag.getBanner(desktopSize, this.adsProps.configAds.adHeader.id);
        // pedir banner e imprimirlos
        // const SIZES = this.getAdForDevice();
        // const BANNER_SIZE = Ads.getBannerTypes()[SIZES];
        // GOOGLE_TAG.getBanner(BANNER_SIZE, this.adsProps.configAds.adHeader.id);

        // const DESKTOP = Ads.getBannerTypes()[desktopSize];
        // const TABLET = Ads.getBannerTypes()[tabletSize];
        // const MOBILE = Ads.getBannerTypes()[mobileSize];
        // setTimeout(() => {
        //     Prebid.loadPrebid({
        //         id: "ad_page_header",
        //         adUnit: this.adUnit,
        //         DESKTOP,
        //         TABLET,
        //         MOBILE,
        //     });
        // }, 2000);
    }

    getAdForDevice() {
        const {
            desktopSize,
            tabletSize,
            mobileSize,
        } = this.adProps;
        const IS_MOBILE = "desktop";
        let device = "";
        if (IS_MOBILE === "desktop") {
            device = desktopSize;
        } else if (IS_MOBILE === "tablet") {
            device = tabletSize;
        } else {
            device = mobileSize;
        }
        return device;
    }
}

export default LogicAds;
