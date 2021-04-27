/**
 * Run some commands with `.env` file loaded to `process.env`
 */
const spawn = require('cross-spawn')
const dotenv = require('dotenv')
const expand = require('dotenv-expand')

const env = dotenv.config()
expand(env)

const args = process.argv.slice(2)
if (args.length === 0) throw new Error(`missing script name`)

console.log(`Running yarn ${args[0]}`)
const cmd = spawn.sync(`yarn`, args, {
  env: process.env,
  stdio: 'inherit',
})

if (cmd.error) {
  console.error(cmd.error)
  process.exitCode = 1
}
