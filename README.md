## front-end-sword

+ 前端脚手架学习

### 从零开始搭建前端脚手架

####  CLI原理

+ 从远程拉取项目模板到本地
+ 根据命令行自动生成各种不同的项目。
+ 如vue-cli提供了相当丰富的选项和设定功能，



### 所用技术

+ node.js

+ commander TJ大神开发的工具，能够更好地组织和处理命令行的输入。

+ inquirer —— 一个用户与命令行交互的工具

  [https://blog.csdn.net/qq_26733915/article/details/80461257](inquirer)

  ![image-20200228151452571](C:\Users\TR\AppData\Roaming\Typora\typora-user-images\image-20200228151452571.png)



项目目录

```
=================
 |__ bin
 	|__ sword
 |__ command
 	|__ add.js
	|__ delete.js
	|__ init.js
 	|__ list.js
 |__ node_modules
 |__ package.json
 |__ templates.json
```

首先建立项目，在package.json里面写入依赖并执行npm install

```json
"dependencies": {
 "chalk": "^1.1.3",
 "commander": "^2.9.0",
 "inquirer": "^7.0.4"
 
 }
```

在根目录下建立\bin文件夹，在里面建立一个无后缀名的scion文件。这个bin\scion文件是整个脚手架的入口文件。

初始化代码：

```js
#!/usr/bin/env node --harmony
'use strict'
 // 定义脚手架的文件路径
process.env.NODE_PATH = __dirname + '/../node_modules/'
const program = require('commander')
 // 定义当前版本
program
 .version(require('../package').version )
// 定义使用方法
program
 .usage('<command>')
```

此次脚手架支持用户输入4种不同的命令。现在我们来写处理这4种命令的方法：

+ command('add')   =>命令
+ description('Add a new template')  =>描述
+ alias('a') =>别名
+ action()  =>回调执行函数

```js
program
    .command('add')
    .description('Add a new template')
    .alias('a')
    .action(async () => {
        await require('../command/add')()
    })
program
    .command('list')
    .description('List all the templates')
    .alias('l')
    .action(async () => {
        await require('../command/list')()
    })
program
    .command('init')
    .description('Generate a new project')
    .alias('i')
    .action(async () => {
        await require('../command/init')()
    })
program
    .command('delete')
    .description('Delete a template')
    .alias('d')
    .action(async () => {
        await require('../command/delete')()
    })
  
```

完整代码

```js
#!/usr/bin/env node --harmony

'use strict'
// 定义脚手架的文件路径
process.env.NODE_PATH = __dirname + '/../node_modules/'
const program = require('commander')
// 定义当前版本
program
    .version(require('../package').version)
// 定义使用方法
program
    .usage('<command>')

program
    .command('add')
    .description('Add a new template')
    .alias('a')
    .action(async () => {
        await require('../command/add')()
    })
program
    .command('list')
    .description('List all the templates')
    .alias('l')
    .action(async () => {
        await require('../command/list')()
    })
program
    .command('init')
    .description('Generate a new project')
    .alias('i')
    .action(async () => {
        await require('../command/init')()
    })
program
    .command('delete')
    .description('Delete a template')
    .alias('d')
    .action(async () => {
        await require('../command/delete')()
    })
// 数组的第一个元素process.argv[0]——返回启动Node.js进程的可执行文件所在的绝对路径
// 第二个元素process.argv[1]——为当前执行的JavaScript文件路径
// 剩余的元素为其他命令行参数
program.parse(process.argv)
//无参数时，输出帮助
if (!program.args.length) {
    program.help()
}
```

使用node运行这个文件，看到输出如下，证明入口文件已经编写完成了。

```bash
node bin/sword

Usage: sword <command>

Options:
  -V, --version  output the version number
  -h, --help     output usage information

Commands:
  add|a          Add a new template
  list|l         List all the templates
  init|i         Generate a new project
  delete|d       Delete a template

```

#### 处理用户输入命令

在项目根目录下建立\command文件夹，专门用来存放命令处理文件。

在根目录下建立templates.json文件并写入如下内容，用来存放模版信息：

```json
{"tpl":{}}
```

在command目录下新建prompt.js文件封装用户从命令行输入的信息

```js
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
```



添加模板

在command目录下新建add.js文件

```js
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
```

删除模板

同样的，在command文件夹下建立delete.js文件：

```js
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
```

输出模板详情

同样的，在command文件夹下建立list.js文件：

```js
'use strict'
const config = require('../templates')
module.exports = () => {
 console.log(config.tpl)
 process.exit()
}

```

## 构建项目

现在来到我们最重要的部分——构建项目。同样的，在command目录下新建一个叫做init.js的文件：

重点部分是开辟一个子进程用来执行shell 命令

```
let cmdStr = `git clone ${gitUrl} ${projectName} && cd ${projectName} && git checkout ${branch}`
```

它的作用正是从远程仓库克隆到自定义目录，并切换到对应的分支。

```js
'use strict'
const exec = require('child_process').exec
const config = require('../templates')
const chalk = require('chalk')
const prompt = require('./prompt')
module.exports = async () => {
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
```

发布到npm

 - 登录到npm

   ```bash
   npm login  --registry=https://registry.npmjs.org
   ```

   根据提示输入用户名，密码，邮箱

- 运行命令

  ```
  npm publish --registry=https://registry.npmjs.org
  ```

  

