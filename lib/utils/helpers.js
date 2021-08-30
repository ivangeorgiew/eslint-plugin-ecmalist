"use strict"

const { verReg } = require("./constants")

const verIsParsable = ver => typeof ver === "string" && verReg.test(ver)

const verStrToArr = ver =>
    verReg
        .exec(ver)
        .slice(1, 4)
        .map(vers => (vers === undefined ? 0 : +vers))

module.exports = { verIsParsable, verStrToArr }
