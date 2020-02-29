'use strict'
const prompt = require('./prompt')
const config = require('../templates')
const chalk = require('chalk')
const fs = require('fs')
module.exports = async () => {
            // 接收用户输入的参数
            let tplName = await prompt('Template name: ')
            // 删除对应的模板
            if (config.tpl[tplName]) {
                delete config.tpl[tplName]
            } else {
                console.log(chalk.red('Template does not exist!'))
                process.exit(0)
            }
            // 写入template.json
            fs.writeFileSync(__dirname + '/../templates.json', JSON.stringify(config));
            fs.closeSync(0)
            console.log(chalk.green('New template added!\n'))
            console.log(chalk.grey('The last template list is: \n'))
            console.log(config)
            process.exit(0)
            }