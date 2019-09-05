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
        console.log('se monto el component');
        console.log(Config);
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
            configAds: Config.homePage
        }
        let logicAds = new LogicAds(adsConfig);
    }

    render() {
        return (
            <div>
                <div>Componente del main</div>
                <div id="adHeader"></div>
            </div>
        )
    }
}
//  module.exports = MainServer;
 export default MainServer;