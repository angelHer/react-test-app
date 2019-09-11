import React, { Component } from "react";

import Config from '../config'

/**
 * Ads imports
 */
// import { Ads, AdLayer, LibraryAds } from "@televisadigital/accesories";
import { LogicAds } from "../helpers/Ads";
/**
 * Ads imports ends
 */

class MainServer extends Component {
    componentDidMount() {
        /**
         * Test new ads
         */
        /**
         * TODO reemplazar con datos de las props
         */
        const {
            _type,
            uri
        } = Config.mockup;

        const adsConfig = {
            uri,
            contentType: _type,
            adUnitConfig: Config.adUnit,
            configAds: Config.homePage,
            adLayer: Config.adLayer,
            bidders: Config.bidders
        }
        let logicAds = new LogicAds(adsConfig);
    }

    render() {
        return (
            <div>
                <div>Ads tipo display</div>
                <div id="adHeader"></div>

                <div>Ads tipo native</div>
                <div id="fiveitems_native"></div>
            </div>
        )
    }
}

 export default MainServer;
