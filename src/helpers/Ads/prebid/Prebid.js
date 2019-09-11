class Prebid {
    constructor(adUnit) {
        this.PREBID_TIMEOUT = 1000;
        this.FAILSAFE_TIMEOUT = 3000;

        this.adUnit = adUnit;
    }

    initializePrebid(idGranularidad, sizes) {
        var adUnits = [
            {
                code: 'ad_page_header',
                mediaTypes: {
                    banner: {
                        sizes: sizes
                    }
                },
                bids: [{
                    bidder: 'appnexus',
                    params: {
                        placementId: idGranularidad
                    }
                }]
            }
        ];

        var pbjs = window.pbjs || {};
        pbjs.que = pbjs.que || [];

        pbjs.que.push(() => {
            console.log('aqui', adUnits)
            pbjs.addAdUnits(adUnits);
            try{
                pbjs.requestBids({
                    adUnits: [adUnits],
                    timeout: this.PREBID_TIMEOUT,
                    bidsBackHandler: () => {
                        console.log('dentro')
                        this.initAdserver(sizes)
                    },
                });
            } catch (e) {
                console.log('eeeeee', e)
            }
        });

        // static sendDataPrebid(id, sizes, prebid) {
        //     console.log('sendDataPrebid', id, sizes, prebid)
        //     const PB_JS = window.pbjs || {};
        //     PB_JS.que = PB_JS.que || [];

        //     PB_JS.que.push(() => {
        //         PB_JS.addAdUnits(prebid);
        //         PB_JS.requestBids({
        //             adUnits: [prebid],
        //             timeout: PREBID_TIMEOUT,
        //             bidsBackHandler: () => {
        //                 this.sendAdserverRequest(id, sizes);
        //             },
        //         });
        //     });
        //     setTimeout(() => {
        //         this.sendAdserverRequest(id, sizes);
        //     }, FAILSAFE_TIMEOUT);
        // }


        // in case PBJS doesn't load
        setTimeout(() => {
           // this.initAdserver(sizes);
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

    // static sendAdserverRequest(slotId, sizes) {
    //     console.log('sendAdserverRequest', slotId, sizes)
    //     if (BID_REQUESTS.find(id => id === slotId)) return;
    //     const SLOTS = window.googletag.pubads().getSlots();
    //     const DISPLAY_AD_SLOT = SLOTS.find(slot => slot.getSlotElementId() === slotId);
    //     BID_REQUESTS.push(slotId);
    //     window.googletag.cmd.push(() => {
    //         window.pbjs.que.push(() => {
    //             window.pbjs.setConfig({
    //                 priceGranularity: "dense",
    //                 enableSendAllBids: true,
    //                 sizeConfig: this.sizesConfig(sizes),
    //             });
    //             window.pbjs.setTargetingForGPTAsync();
    //             window.googletag.pubads().refresh([DISPLAY_AD_SLOT]);
    //         });
    //     });
    // }
}

export default Prebid;
