'use strict'
const config = require('../templates')
const chalk = require('chalk')
const prompt = require('./prompt.js')
const fs = require('fs')
module.exports = async () => {
    // 分步接收用户输入的参数
    let tplName = await prompt("Template name:")
    let gitUrl = await prompt('Git https link: ')
    let branch = await prompt('Branch: ')
    let description = await prompt('Description: ')
    // 避免重复添加
    if (!config.tpl[tplName]) {
        config.tpl[tplName] = {}
        config.tpl[tplName]['url'] = gitUrl.replace(/[\u0000-\u0019]/g, '') // 过滤unicode字符
        config.tpl[tplName]['branch'] = branch
        config.tpl[tplName]['description'] = description
    } else {
        console.log(chalk.red('Template has already existed!'))
        process.exit(0)
    }
    // 把模板信息写入templates.json
   	 	fs.writeFileSync(__dirname + '/../templates.json',JSON.stringify(config));
    	fs.closeSync(0)
    	console.log(chalk.green('New template added!\n'))
    	console.log(chalk.grey('The last template list is: \n'))
    	console.log(config)
    	process.exit(0)
}