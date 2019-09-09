export default {
    // new config to Ads component
    adUnit: {
        global: (process.env.CLUSTER_ENV && process.env.CLUSTER_ENV === "production") ? "/5644/es.televisa.lasestrellas" : "/5644/es.networks.bandamax",
        amp: (process.env.CLUSTER_ENV && process.env.CLUSTER_ENV === "production") ? "/5644/es.televisa.lasestrellas/ampproject" : "/5644/es.networks.test/ampproject",
        config: {
            include: [
                "ArticlePage",
                "ClipPage",
                "EpisodePage",
                "SlideshowPage",
                "VideoPage",
            ],
            remove: 1,
        },
    },
    homePage: {
        adHeader: {
            id: "ad_page_header",
            position: "atf",
            idContainer: "AdsHeader",
            activewl: false,
            sizes: {
                desktopSize: "super banner",
                tabletSize: "super banner",
                mobileSize: "mobile banner",
            }
        },
    },
    mockup: {
        uri: '/',
        _type: 'Page'
    }
};
