'use strict'
const inquirer = require('inquirer')
module.exports = async (prompt = "Are you handsome") => {
    let msg = await inquirer.prompt([{
        type: 'input',
        name: 'value',
        message: prompt
    }])
    return msg.value
}