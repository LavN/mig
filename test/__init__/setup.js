global.chai = require("chai");
global.should = require("chai").should();
global.expect = require("expect.js");
chai.use(require("chai-spies"));
global.Q = require('q');
global._ = require('underscore');
global.__mcfg__ = { serverMode: "testing",
    path: require("path").normalize(__dirname+"/../..")
};
global.async = require("async");
require("muon");

