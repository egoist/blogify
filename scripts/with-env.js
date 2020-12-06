/**
 * Run some commands with `.env` file loaded to `process.env`
 */
const spawn = require('cross-spawn')
const dotenv = require('dotenv')
const expand = require('dotenv-expand')

const env = dotenv.config()
expand(env)

const args = process.argv.slice(2)
const cmd = spawn.sync(args[0], args.slice(1), {
  env: process.env,
  stdio: 'inherit',
})

if (cmd.error) {
  console.error(cmd.error)
  process.exitCode = 1
}
