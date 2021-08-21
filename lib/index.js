'use strict'

const remoteRules = require('eslint-plugin-es').rules
const { localRules } = require('./utils/constants')
const { getMissingRules } = require('./utils/helpers')
const { filteredRules } = require('./utils/rules')

// console.log(getMissingRules({ localRules, remoteRules }))
const { missingRemotely } = getMissingRules({ localRules, remoteRules })

const eslintRules = Object.keys(filteredRules).reduce((acc, ruleName) => {
    try {
        if (!missingRemotely.includes(ruleName)) {
            const { meta, create } = remoteRules[ruleName]
            const { blName, blVer } = filteredRules[ruleName]

            try {
                const origMsg = meta.messages.forbidden

                meta.messages.forbidden = `For ${blName} ${blVer}: ${origMsg}`
            } catch (error) {
                // the rule didn't have meta.messages.forbidden
            }

            acc[ruleName] = { meta, create }
        }

        return acc
    } catch (error) {
        console.error(`Issue with: making rule ${ruleName}\n`, error)

        return acc
    }
}, {})

const prefixedRules = Object.keys(eslintRules).reduce((acc, ruleName) => {
    acc[`ecmalist/${ruleName}`] = 'error'

    return acc
}, {})

// console.dir(eslintRules, { depth: null })
// console.dir(prefixedRules, { depth: null })

module.exports = {
    configs: {
        recommended: {
            plugins: ['ecmalist'],
            rules: prefixedRules
        }
    },
    rules: eslintRules
}
