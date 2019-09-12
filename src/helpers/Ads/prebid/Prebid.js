import * as R from 'ramda';

class Prebid {
    constructor() {
        this.PREBID_TIMEOUT = 1000;
        this.FAILSAFE_TIMEOUT = 3000;

        this._sizes = '';
        this._idBanner = '';
        this._bannerSize = '';
    }

    get sizes() {
        return this._sizes;
    }

    get idBanner() {
        return this._idBanner;
    }

    get bannerSize() {
        return this._bannerSize;
    }

    set sizes(val) {
        this._sizes = val;
    }

    set idBanner(val) {
        this._idBanner = val;
    }

    set bannerSize(val) {
        this._bannerSize = val;
    }

    initializePrebid(idGranularidad, sizes, idBanner, bannerSize) {
        this.sizes = sizes;
        this.idBanner = idBanner;
        this.bannerSize = bannerSize;

        let adUnits = this.prepareBidders(idGranularidad)

        let pbjs = window.pbjs || {};
        pbjs.que = pbjs.que || [];

        /**
         * TODO a la propiedad pbjs.addAdUnits(), pasar como parametro un array en lugar de un OBJ
        */
        pbjs.que.push(() => {
            pbjs.addAdUnits([adUnits]);
            pbjs.requestBids({
                adUnits: [adUnits],
                timeout: this.PREBID_TIMEOUT,
                bidsBackHandler: () => {
                    this.initAdserver()
                },
            });
        });

        // in case PBJS doesn't load
        setTimeout(() => {
            // this.initAdserver();
        }, this.FAILSAFE_TIMEOUT);
    }

    initAdserver() {
        const SLOTS = window.googletag.pubads().getSlots();
        let adSlot = R.filter(slot => slot.getSlotElementId() === this.idBanner, SLOTS)

        window.googletag.cmd.push(() => {
            window.pbjs.que.push(() => {
                window.pbjs.setConfig({
                    priceGranularity: "dense",
                    enableSendAllBids: true,
                    sizeConfig: this.sizesConfig(),
                });
                window.pbjs.setTargetingForGPTAsync();
                window.googletag.pubads().refresh(adSlot);
            });
        });
    }

    prepareBidders(idGranularidad) {
        return {
            code: this.idBanner,
            mediaTypes: {
                banner: {
                    sizes: this.bannerSize
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

    sizesConfig() {
        return [
            {
                mediaQuery: "(min-width: 1024px)",
                sizesSupported: this.sizes.desktopSize,
                labels: ["desktop"],
            },{
                mediaQuery: "(min-width: 768px) and (max-width: 1023px)",
                sizesSupported: this.sizes.tabletSize,
                labels: ["tablet"],
            }, {
                mediaQuery: "(min-width: 0px)",
                sizesSupported: this.sizes.mobileSize,
                labels: ["phone"],
            }
        ];
    }
}

export default Prebid;
