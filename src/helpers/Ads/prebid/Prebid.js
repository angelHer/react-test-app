import { ConfigAds } from "./ConfigAds";

class Prebid {
    static loadPrebid({
        dinamicID = "",
        adUnit = "",
        desktop,
        tablet,
        mobile,
    }) {
        console.log("dinamicID", dinamicID);
        console.log("adUnit", adUnit);
        console.log("in prebid!!!!!!", desktop);
        console.log("tablettablettablet--->", tablet);
        console.log("mobile-------->", mobile);
        const {
            desktopSize,
            id,
            mobileSize,
            tabletSize,
            position,
        } = ConfigAds;
        const TYPE_BANNER = [
            { desktop: desktopSize },
            { tablet: tabletSize },
            { mobile: mobileSize },
        ];
        // const UI_CONFIG = config || {};
        // const DATA_CONFIG = Object.assign(UI_CONFIG, {});
        const SIZES_ADS = {
            desktopSize: desktop,
            tabletSize: tablet,
            mobileSize: mobile,
        };
        /* const RESULT = new Promise(() => {
            if (window.pbjs && window.googletag) {
                this.createAdSlot(
                    id,
                    DATA_CONFIG,
                    SIZES_ADS.desktopSize,
                    SIZES_ADS.tabletSize,
                    SIZES_ADS.mobileSize,
                    position,
                    adUnit,
                    Utils.isMobile,
                    tags,
                    native,
                    typeOfBanner,
                );
            }
        });
        return RESULT; */
    }

    static createAdSlot(
        containerId,
        uiConfig,
        desktopSize,
        tabletSize,
        mobileSize,
        position,
        adUnit,
        device,
        tags,
        native,
        typeOfAds,
    ) {
        let sizeLoad = "";
        if (device === "desktop") {
            sizeLoad = desktopSize;
        } else if (device === "tablet") {
            sizeLoad = tabletSize;
        } else {
            sizeLoad = mobileSize;
        }
        let slotTelevisa = {};
        window.googletag.cmd.push(() => {
            if (native) {
                slotTelevisa = this.pushNativeAd(adUnit, containerId, native);
            } else {
                const SIZES_ADS = {
                    desktopSize,
                    tabletSize,
                    mobileSize,
                };
                const MAPPING = window.googletag.sizeMapping()
                    .addSize([980, 140], desktopSize)
                    .addSize([740, 140], tabletSize)
                    .addSize([320, 140], mobileSize)
                    .build();
                this.requestHeaderBidding(
                    containerId,
                    sizeLoad,
                    position,
                    uiConfig,
                    typeOfAds,
                    device,
                    SIZES_ADS,
                );
                slotTelevisa = this.configureAdSlot(
                    adUnit,
                    sizeLoad,
                    containerId,
                    MAPPING,
                    position,
                    tags,
                );
            }
        });

        if (slotTelevisa === null) {
            console.log("[Error DFP]");
        }
    }
}

export default Prebid;
