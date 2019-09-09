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
            adLayer: Config.adLayer
        }
        let logicAds = new LogicAds(adsConfig);
        localStorage.setItem("increment", "1");
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

 export default MainServer;
