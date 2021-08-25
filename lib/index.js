'use strict'

const remoteRules = require('eslint-plugin-es').rules
const { filteredRules } = require('./utils/rules')

const eslintRules = Object.keys(remoteRules).reduce((acc, ruleName) => {
    try {
        const { meta, create } = remoteRules[ruleName]

        if (ruleName in filteredRules) {
            const { blName, blVer } = filteredRules[ruleName]

            try {
                const origMsg = meta.messages.forbidden

                meta.messages.forbidden = `For ${blName} ${blVer}: ${origMsg}`
            } catch (error) {
                // the rule didn't have meta.messages.forbidden
            }
        }

        acc[ruleName] = { meta, create }

        return acc
    } catch (error) {
        console.error(`Issue with: making rule ${ruleName}\n`, error)

        return acc
    }
}, {})

const prefixedRules = Object.keys(filteredRules).reduce((acc, ruleName) => {
    acc[`ecmalist/${ruleName}`] = 'error'

    return acc
}, {})

// const { localRules } = require('./utils/constants')
// const { getMissingRules } = require('./utils/helpers')
// console.log(getMissingRules({ localRules, remoteRules }))

// console.dir(eslintRules, { depth: null })
// console.dir(prefixedRules, { depth: null })

module.exports = {
    configs: {
        recommended: {
            parserOptions: { ecmaVersion: 2021 },
            env: { es2021: true },
            plugins: ['ecmalist'],
            rules: prefixedRules,
        },
    },
    rules: eslintRules,
}
