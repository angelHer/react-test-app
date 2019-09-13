import * as R from 'ramda';

class Prebid {
    constructor(_bidders, deviceType) {
        this.PREBID_TIMEOUT = 1000;
        this.FAILSAFE_TIMEOUT = 3000;

        this._sizes = '';
        this._idBanner = '';
        this._bannerSize = '';
        this._bidders = _bidders;
        this._deviceType = deviceType;
        this._sizesByDevice = ''
        this._position = '';
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

    get bidders() {
        return this._bidders;
    }

    get deviceType() {
        return this._deviceType;
    }

    get sizesByDevice() {
        return this._sizesByDevice;
    }

    get position() {
        return this._position;
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

    set sizesByDevice(val) {
        this._sizesByDevice = val;
    }

    set position(val) {
        this._position = val;
    }

    async initializePrebid(sizes, idBanner, bannerSize, sizesByDevice, position) {
        this.sizes = sizes;
        this.idBanner = idBanner;
        this.bannerSize = bannerSize;
        this.sizesByDevice = sizesByDevice;
        this.position = position;

        let adUnits = await this.prepareBidders()

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

    prepareBidders() {
        let bidders = R.values(this.getBidders());

        return {
            code: this.idBanner,
            mediaTypes: {
                banner: {
                    sizes: this.bannerSize
                }
            },
            bids: bidders
        };
    }

    getBidders() {
        let availableBidders = R.filter(bid => bid.visible, this.bidders);

        return R.mapObjIndexed((val, key, obj) => {
            switch(key) {
                case 'appnexus':
                    return this.getAppNexus()
                case 'rubicon':
                    return this.getRubIcon(val)
                default:
                    break;
            }
        }, availableBidders);
    }

    getRubIcon(data) {
        return {
            bidder: 'rubicon',
            params: {
                accountId: data.account,
                siteId: data.site,
                zoneId: data.zone,
                inventory: {
                    position: this.position
                }
            }
        }
    }

    getAppNexus() {
        let idGranularidad = R.prop(
            R.prop(this.deviceType, this.sizesByDevice),
            this.bidders.appnexus
        );

        return {
            bidder: 'appnexus',
            params: {
                placementId: idGranularidad
            }
        }
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
