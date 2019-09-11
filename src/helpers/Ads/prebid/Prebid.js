class Prebid {
    constructor() {
        this.PREBID_TIMEOUT = 1000;
        this.FAILSAFE_TIMEOUT = 3000;

        this._sizes = '';
    }

    get sizes() {
        return this._sizes;
    }

    set sizes(val) {
        this._sizes = val;
    }

    initializePrebid(idGranularidad, sizes) {
        this.sizes = sizes;
        let adUnits = this.prepareBidders(idGranularidad)

        let pbjs = window.pbjs || {};
        pbjs.que = pbjs.que || [];

        pbjs.que.push(() => {
            pbjs.addAdUnits(adUnits);
            pbjs.requestBids({
                adUnits: [adUnits],
                timeout: this.PREBID_TIMEOUT,
                bidsBackHandler: () => {
                    this.initAdserver([728, 90])
                },
            });
        });

        // in case PBJS doesn't load
        setTimeout(() => {
        //    this.initAdserver(sizes);
        }, this.FAILSAFE_TIMEOUT);
    }

    initAdserver(sizes) {
        console.log('recived', sizes)
        const SLOTS = window.googletag.pubads().getSlots();
        const DISPLAY_AD_SLOT = SLOTS.find(slot => slot.getSlotElementId() === 'ad_page_header');

        window.googletag.cmd.push(() => {
            window.pbjs.que.push(() => {
                window.pbjs.setConfig({
                    priceGranularity: "dense",
                    enableSendAllBids: true,
                    sizeConfig: sizes,
                });
                window.pbjs.setTargetingForGPTAsync();
                window.googletag.pubads().refresh([DISPLAY_AD_SLOT]);
            });
        });
    }

    prepareBidders(idGranularidad) {
        return {
            code: 'ad_page_header',
            mediaTypes: {
                banner: {
                    sizes: [728, 90]
                }
            },
            bids: [
                {
                    bidder: 'appnexus',
                    params: {
                        placementId: idGranularidad
                    }
                },
                {
                    bidder: 'rubicon',
                    params: {
                        accountId: "16302",
                        inventory: {
                            position: "atf"
                        },
                        siteId: "119754",
                        zoneId: "566568"
                    }
                }
            ]
        };
    }

    sizesConfig(sizes) {
        const DESKTOP = (Array.isArray(sizes.desktopSize[0])) ? sizes.desktopSize : [sizes.desktopSize];
        const TABLET = (Array.isArray(sizes.tabletSize[0])) ? sizes.tabletSize : [sizes.tabletSize];
        const MOBILE = (Array.isArray(sizes.mobileSize[0])) ? sizes.mobileSize : [sizes.mobileSize];

        const SIZE_CONFIG = [{
            mediaQuery: "(min-width: 1024px)",
            sizesSupported: DESKTOP,
            labels: ["desktop"],
        }, {
            mediaQuery: "(min-width: 768px) and (max-width: 1023px)",
            sizesSupported: TABLET,
            labels: ["tablet"],
        }, {
            mediaQuery: "(min-width: 0px)",
            sizesSupported: MOBILE,
            labels: ["phone"],
        }];

        console.log('return sizesConfig', SIZE_CONFIG);
        return SIZE_CONFIG;
    }
}

export default Prebid;
