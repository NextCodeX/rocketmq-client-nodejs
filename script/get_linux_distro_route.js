"use strict";

const assert = require("assert");

const getos = require("getos");

const RHEL_MAP_ARRAY = [
    "Centos",
    "Red Hat Linux",
    "RHEL",
    "Scientific Linux",
    "ScientificSL",
    "ScientificCERNSLC",
    "ScientificFermiLTS",
    "ScientificSLF"
];
const NORMAL_MAP_ARRAY = [
    "Alpine Linux",
    "Amazon Linux",
    "Arch Linux",
    "Chakra",
    "Debian",
    "elementary OS",
    "IYCC",
    "Linux Mint",
    "Manjaro Linux",
    "Ubuntu Linux"
];

function realGetLinuxDistroRoute(dist, release) {
    let major;
    if(release) {
        major = Number(release.split(".")[0]);
    }

    // RHEL Distros
    if(RHEL_MAP_ARRAY.includes(dist)) {
        assert(major >= 5 && major <= 7, `Only support ${dist} 5-7.`);
        return `RHEL${major}.x`;
    }

    // Fedora
    if("Fedora" === dist) {
        if(major <= 18) {
            return "RHEL6.x";
        } else if(major === 19) {
            return "RHEL7.x";
        }
    }

    if("Ubuntu Linux" === dist) {
        assert([ 14, 16, 18 ].includes(major));
        return `UBUNTU/${major}.04`;
    }

    if("Debian" === dist) {
        assert(major >= 8 && major <= 10);
        return `UBUNTU/${(major + 2) / 2}.04`;
    }

    // Ubuntu Distros
    if(!NORMAL_MAP_ARRAY.includes(dist)) {
        console.error(`[rocketmq sdk] [warn] ${dist} may not supported, fallback to use Ubuntu library.`);
    }

    return "UBUNTU/14.04";
}

function getLinuxDistroRoute() {
    return new Promise((resolve, reject) => {
        getos(function(err, ret) {
            if(err) return reject(err);

            let route;
            try {
                route = realGetLinuxDistroRoute(ret.dist, ret.release);
            } catch(e) {
                return reject(e);
            }

            resolve(route);
        });
    });
}

module.exports = getLinuxDistroRoute;
