"use strict"

const browserslist = require("browserslist")
const { blToMdn } = require("./constants")
const { verIsParsable, verStrToArr } = require("./helpers")

const hasConfig = browserslist.findConfig(".") !== undefined
const defaultQuery = ["defaults", "not IE 11"]
const blResult = (function () {
    try {
        return browserslist(hasConfig ? undefined : defaultQuery)
    } catch (error) {
        console.error(`Your browserslist setup has issues.\n`, error)

        return browserslist(defaultQuery)
    }
})()

// if config not found, remove support for IE 11, because it simply adds too many
// rules for a browser, which is going to be removed soon
const blInfo = blResult
    .map(fullInfo => fullInfo.split(" "))
    .reduce((acc, [brow, ver]) => {
        acc[brow] = ver
        return acc
    }, {})

const browsers = Object.keys(blInfo).reduce((acc, blBrow) => {
    const ver = blInfo[blBrow]

    try {
        if (!(blBrow in blToMdn)) {
            return acc
        }

        const mdnBrow = blToMdn[blBrow]

        if (!verIsParsable(ver)) {
            acc[mdnBrow] = [999, 0, 0]
            return acc
        }

        if (!(mdnBrow in acc)) {
            acc[mdnBrow] = verStrToArr(ver)

            return acc
        } else {
            const [af, as, at] = verStrToArr(ver)
            const [bf, bs, bt] = acc[mdnBrow]

            if (
                af < bf ||
                (af === bf && as < bs) ||
                (af === bf && as === bs && at < bt) ||
                (af === bf && as === bs && at === bt)
            ) {
                acc[mdnBrow] = [af, as, at]
            }

            return acc
        }
    } catch (error) {
        console.error(`Issue with: parsing ${blBrow}, version ${ver}\n`, error)

        return acc
    }
}, {})

module.exports = { browsers }
