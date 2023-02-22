import { Database } from "https://deno.land/x/sqlite3@0.8.0/mod.ts"
import { nextTick } from "https://deno.land/std@0.177.0/node/_next_tick.ts"

const db = new Database(':memory:')

db.exec('PRAGMA auto_vacuum = none')
db.exec('PRAGMA temp_store = memory')
db.exec('PRAGMA locking_mode = exclusive')
db.exec('PRAGMA user_version = 100')

const sql = 'pragma user_version'

let total = parseInt(Deno.args[0], 10)
const runs = parseInt(Deno.args[1], 10)

function bench (query) {
  const start = Date.now()
  for (let i = 0; i < runs; i++) query()
  const elapsed = Date.now() - start
  const rate = Math.floor(runs / (elapsed / 1000))
  console.log(`time ${elapsed} ms rate ${rate}`)
  if (--total) nextTick(() => bench(query))
}

const query = db.prepare(sql)
bench(() => query.get())
