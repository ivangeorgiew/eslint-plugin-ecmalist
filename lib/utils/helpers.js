'use strict'

const { verReg } = require('./constants')

const verIsParsable = ver => typeof ver === 'string' && verReg.test(ver)

const verStrToArr = ver =>
    verReg
        .exec(ver)
        .slice(1, 4)
        .map(vers => (vers === undefined ? 0 : +vers))

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

module.exports = { verIsParsable, verStrToArr, getMissingRules }
