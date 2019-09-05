import * as R from "ramda";

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
        });
    }

    getBanner(type, id) {
        window.googletag.cmd.push(() => {
            const SLOT_LAYER = window.googletag.defineSlot(this.adUnit, type, id)
                .addService(window.googletag.pubads());
            window.googletag.pubads()
                .setTargeting("skey", (window.location.search.match(/skey=(\w+)/) || ["", ""])[1]);
            window.googletag.enableServices();
            window.googletag.display(id);

            /*
              TODO Agregar un mejor control como un async y await
            * Aqui tenia un setTimeOut para esperar respuesta y despues renderizar
            */
            window.googletag.pubads().refresh([SLOT_LAYER]);
        });
    }
}
