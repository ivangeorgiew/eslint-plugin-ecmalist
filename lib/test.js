'use strict'

const remoteRules = require('eslint-plugin-es').rules
const { localRules } = require('./utils/constants')

const getMissing = (a, b) => {
    const objKeys = Object.keys(a)

    return objKeys.filter(key => !(key in b))
}

const getMissingRules = ({ localRules, remoteRules }) => {
    try {
        const missingLocally = getMissing(remoteRules, localRules)
        const missingRemotely = getMissing(localRules, remoteRules)

        return { missingRemotely, missingLocally }
    } catch (error) {
        console.error(`Issue with: checking for missing rules\n`, error)

        return { missingRemotely: [], missingLocally: [] }
    }
}

console.log(getMissingRules({ localRules, remoteRules }))
