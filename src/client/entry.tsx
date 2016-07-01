/**
 * Apply es6 promise polyfill
 */
import {polyfill} from "es6-promise";
polyfill();

// Import webrtc adapter
import "webrtc-adapter";

// Import bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import {Application} from "./components/application";

const reactContainer = document.getElementById("react_container");
ReactDOM.render(<Application/>, reactContainer);
