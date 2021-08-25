'use strict'

const jsData = require('@mdn/browser-compat-data').javascript
const { mdnToBl, localRules } = require('./constants')
const { verIsParsable, verStrToArr } = require('./helpers')
const { browsers } = require('./browsers')

// console.dir(jsData, { depth: null })

const filteredRules = Object.keys(localRules).reduce((acc, ruleName) => {
    try {
        const path = localRules[ruleName]
        const info = path.reduce((acc, key) => acc[key], jsData).__compat.support
        const mdnBrows = Object.keys(info).reduce((acc, key) => {
            const obj = Array.isArray(info[key]) ? info[key][0] : info[key]
            const ver = obj['version_added']
            const value = verIsParsable(ver) ? verStrToArr(ver) : ver

            acc[key] = value

            return acc
        }, {})

        Object.keys(browsers).some(browName => {
            try {
                const blVer = browsers[browName]
                const mdnVer = mdnBrows[browName]
                let shouldHaveRule

                if (typeof mdnVer === 'boolean' || mdnVer === null) {
                    shouldHaveRule = !mdnVer
                } else {
                    const [af, as, at] = blVer
                    const [bf, bs, bt] = mdnVer

                    if (
                        af > bf ||
                        (af === bf && as > bs) ||
                        (af === bf && as === bs && at > bt) ||
                        (af === bf && as === bs && at === bt)
                    ) {
                        shouldHaveRule = false
                    } else {
                        shouldHaveRule = true
                    }
                }

                if (shouldHaveRule) {
                    acc[ruleName] = {
                        blName: mdnToBl[browName],
                        blVer: Array.isArray(blVer) ? blVer.join('.') : blVer,
                        mdnVer: Array.isArray(mdnVer) ? mdnVer.join('.') : mdnVer,
                    }
                }

                return shouldHaveRule
            } catch (error) {
                console.error(
                    `Issue with: matching versions for ${browName}\n`,
                    error
                )

                return true
            }
        })

        return acc
    } catch (error) {
        console.error(`Issue with: filtering ${ruleName}\n`, error)

        return acc
    }
}, {})

module.exports = { filteredRules }
