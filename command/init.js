'use strict'
const exec = require('child_process').exec
const config = require('../templates')
const chalk = require('chalk')
const prompt = require('./prompt')
module.exports =async () => {
 // 处理用户输入
 let tplName = await prompt('Template name: ')
 let projectName = await prompt('Project name: ')
 let gitUrl
 let branch
 if (!config.tpl[tplName]) {
 console.log(chalk.red('\n × Template does not exit!'))
 process.exit(0)
 }
 gitUrl = config.tpl[tplName].url
 branch = config.tpl[tplName].branch
 // git命令，远程拉取项目并自定义项目名
 let cmdStr = `git clone ${gitUrl} ${projectName} && cd ${projectName} && git checkout ${branch}`
 console.log(chalk.white('\n Start generating...'))
 exec(cmdStr, (error, stdout, stderr) => {
 if (error) {
 console.log(error)
 process.exit(0)
 }
 console.log(chalk.green('\n √ Generation completed!'))
 console.log(`\n cd ${projectName} && npm install \n`)
 process.exit(0)
 })
}