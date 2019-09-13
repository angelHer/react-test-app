export default {
    // new config to Ads component
    adUnit: {
        global: (process.env.CLUSTER_ENV && process.env.CLUSTER_ENV === "production") ? "/5644/es.televisa.lasestrellas" : "/5644/televisacom.test",
        amp: (process.env.CLUSTER_ENV && process.env.CLUSTER_ENV === "production") ? "/5644/es.televisa.lasestrellas/ampproject" : "/5644/es.networks.test/ampproject",
        canal: (process.env.CLUSTER_ENV && process.env.CLUSTER_ENV === "production") ? "es.televisa.lasestrellas.video" : "televisacom.test",
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
                desktop: "super banner",
                tablet: "super banner",
                mobile: "mobile banner",
            }
        },
    },

    adLayer: {
        unoPorUno: {
            contentTypes: ['Page'],
            id: '1x1'
        },
        dosPorDos: {
            contentTypes: [],
            id: '2x2'
        },
    },

    bidders: {
        appnexus: {
            visible: true,
            superBanner: "14862539",
            boxBanner: "14862542",
            largeBanner: "14862559",
            skyscrapper: "15408493",
            mobileBanner: "14862539",
            comboBox: "15408508",
            comboPortrait: "15408564",
            comboMaster: "14862543",
            boton: "15408567",
        },
        rubicon: {
            visible: true,
            placement: "11834950",
            account: "16302",
            site: "119754",
            zone: "566568",
        }
    },

    mockup: {
        uri: '/',
        _type: 'Page'
    }
};
