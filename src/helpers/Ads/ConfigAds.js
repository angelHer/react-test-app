module.exports.ConfigAds = {
    homePage: {
        adHeader: {
            id: "ad_page_header",
            desktopSize: "super banner",
            tabletSize: "super banner",
            mobileSize: "mobile banner",
            position: "atf",
            idContainer: "AdsHeader",
            activewl: false,
        },
    },
    adUnit: {
        global: "/5644/televisacom.test",
        amp: "/5644/es.networks.test/ampproject",
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
    }
};
