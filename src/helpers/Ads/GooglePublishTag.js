import * as R from "ramda";
import "idempotent-babel-polyfill";

export default class GPT {
    constructor(adUnit) {
        this.adsSources = [
            "https://securepubads.g.doubleclick.net/tag/js/gpt.js",
            "https://i2.esmas.com/las-estrellas/assets/webapp/js/prebid2.0.0.js",
        ];
        this.loadScript(this.adsSources);
        this.adUnit = adUnit;
        this.initializeGPT();
    }

    loadScript(urlSources) {
        R.map( (src) => {
            // Get the first script element on the page
            const ref = document.getElementsByTagName("script")[0];

            // Create a new script element
            const script = document.createElement("script");

            // Set the script element `src`
            // script.async = true;
            script.src = src;

            // Inject the script into the DOM
            ref.parentNode.insertBefore( script, ref );
        }, urlSources);
    }

    initializeGPT() {
        window.googletag = window.googletag || {};
        window.googletag.cmd = window.googletag.cmd || [];
        window.googletag.cmd.push(() => {
            // Configure general DFP behavior.
            window.googletag.pubads().enableAsyncRendering();
            window.googletag.pubads().disableInitialLoad();
            window.googletag.pubads().enableSingleRequest();
        })
    }

    createSizeMApping(desktop, tablet, mobile) {
        return new Promise((resolve, reject) => {
            window.googletag.cmd.push(() => {
                let sizes = window.googletag.sizeMapping()
                    .addSize([980, 140], desktop)
                    .addSize([740, 140], tablet)
                    .addSize([320, 140], mobile)
                    .build();
                resolve(sizes);
            });
        });
    }

    createContainer(adUnit, typeAdLayer = "2x2") {
        const AD = Number(typeAdLayer.substr(0, 1));
        const AD_CONTAINER_ONE = document.createElement("div");
        AD_CONTAINER_ONE.setAttribute("style", "margin:auto");
        AD_CONTAINER_ONE.setAttribute("id", typeAdLayer);
        const SLOT_NUMBER = (SLOT) => {
            const RESULT = (SLOT === 2)
                ? ""
                : window.googletag.pubads().setTargeting("slot", `slot_${SLOT}`);
            return RESULT;
        };
        document.body.insertBefore(AD_CONTAINER_ONE, document.body.firstChild);
        window.googletag.cmd.push(() => {
            const SLOT_LAYER = window.googletag.defineSlot(adUnit, [AD, AD], typeAdLayer)
                .addService(window.googletag.pubads());
            window.googletag.pubads()
                .setTargeting("skey", (window.location.search.match(/skey=(\w+)/) || ["", ""])[1]);
            SLOT_NUMBER(AD);
            window.googletag.enableServices();
            window.googletag.display(typeAdLayer);
            window.googletag.pubads().refresh([SLOT_LAYER]);
        });
    }

    pushNativeAd(containerId, native, incrementSlot) {
        try {
            const SLOT_TELEVISA_FLUID = window.googletag.defineSlot(this.adUnit, ["fluid"], containerId)
                .addService(window.googletag.pubads());
            window.googletag.pubads().enableSingleRequest();
            window.googletag.pubads().setTargeting("slot", `slot_${incrementSlot}`);
            window.googletag.pubads().enableLazyLoad({
                fetchMarginPercent: 200,
                renderMarginPercent: 400,
                mobileScaling: 2.0,
            });
            window.googletag.enableServices();
            if (native && native !== "fluid") {
                window.googletag.pubads()
                    .setTargeting("native", native)
                    .setTargeting("skey", (window.location.search.match(/skey=(\w+)/) || ["", ""])[1]);
            }
            window.googletag.display(containerId);
            window.googletag.pubads().refresh([SLOT_TELEVISA_FLUID]);
            return SLOT_TELEVISA_FLUID;
        } catch (err) {
            return null;
        }
    }

    getDisplayBanner(type, id, mapping, position, incrementSlot) {
        window.googletag.cmd.push(() => {
            const SLOT_LAYER = window.googletag.defineSlot(this.adUnit, type, id)
                .addService(window.googletag.pubads())
                .defineSizeMapping(mapping);
            window.googletag.pubads()
                .setTargeting("position", position)
                .setTargeting("slot", `slot_${incrementSlot}`)
                .setTargeting("skey", (window.location.search.match(/skey=(\w+)/) || ["", ""])[1])
                .enableLazyLoad({
                    fetchMarginPercent: 200,
                    renderMarginPercent: 400,
                    mobileScaling: 2.0,
                });
            window.googletag.enableServices();
            window.googletag.display(id);

            window.googletag.pubads().refresh([SLOT_LAYER]);
        });
    }
}
