import assert from 'node:assert/strict'
import { createHash, randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Client } from 'pg'
import { createClient } from '@supabase/supabase-js'
import { closureLab, readClosureFixtures, safeFailure } from './closure-lab.mjs'
import { AUTH_VIEWPORTS } from './auth-lab.mjs'

const secrets: string[] = []
async function main() {
  const { root, status, evidence } = closureLab()
  assert.ok(existsSync(join(root, 'auth-prepared.json')), 'Prepare the actual email-auth surfaces first')
  const fixturePath = join(root, 'auth-fixtures.private.json')
  assert.ok(!existsSync(fixturePath), 'Never reuse email-auth fixtures')
  const previous = JSON.parse(readFileSync(join(root, 'fixtures.private.json'), 'utf8'))
  const returning = readClosureFixtures(root)
  const password = `Auth-${randomBytes(24).toString('hex')}`
  secrets.push(password, status.ANON_KEY, status.SERVICE_ROLE_KEY, status.DB_URL)
  for (const secret of secrets) console.log(`::add-mask::${secret}`)
  const db = new Client({ connectionString: status.DB_URL })
  await db.connect()
  try {
    // Both endpoint guards and previous exact synthetic identities are required.
    const expected = [...previous.users, ...returning.users]
    assert.equal(expected.length, 6)
    const found = await db.query('select id,email from auth.users order by id')
    assert.equal(found.rowCount, expected.length, 'Unexpected Auth users in the disposable stack')
    for (const user of expected) {
      assert.equal(user.email, `dtc-qa-${user.label}@example.invalid`)
      assert.ok(found.rows.some(row => row.id === user.id && row.email === user.email), 'Local Auth sentinel missing')
    }
    const admin = createClient(status.API_URL, status.SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const users: Array<{ label: string; id: string; email: string; invitationToken?: string; invitationId?: string }> = []
    for (const viewport of AUTH_VIEWPORTS) {
      for (const kind of ['invited', 'outsider']) {
        const label = `auth-${kind}-${viewport.name}`, email = `dtc-qa-${label}@example.invalid`
        const created = await admin.auth.admin.createUser({ email, password, email_confirm: true,
          user_metadata: { full_name: `QA sintético ${label}` } })
        assert.ok(!created.error && created.data.user, 'Unable to create a new synthetic local Auth user')
        const user: typeof users[number] = { label, id: created.data.user!.id, email }
        await db.query('insert into public.users(id,email,full_name) values($1,$2,$3)',
          [user.id, email, `QA sintético ${label}`])
        if (kind === 'invited') {
          user.invitationToken = randomBytes(32).toString('base64url')
          secrets.push(user.invitationToken)
          console.log(`::add-mask::${user.invitationToken}`)
          const tokenHash = createHash('sha256').update(user.invitationToken).digest('hex')
          const invitation = await db.query(`insert into public.pilot_invitations(token_hash,status,expires_at)
            values($1,'issued',now()+interval '1 hour') returning id`, [tokenHash])
          user.invitationId = invitation.rows[0].id
        }
        // Do not seed membership, profile flags, journey state or completed work.
        const clean = await db.query(`select
          (select count(*)::integer from public.pilot_memberships where user_id=$1) as membership,
          (select count(*)::integer from public.despega_user_profiles where user_id=$1) as profile,
          (select count(*)::integer from public.despega_journey_state where user_id=$1) as journey`, [user.id])
        assert.deepEqual(clean.rows[0], { membership: 0, profile: 0, journey: 0 })
        users.push(user)
      }
    }
    writeFileSync(fixturePath, JSON.stringify({ scope: 'disposable-local-real-email-auth', users, password }), { mode: 0o600 })
    writeFileSync(join(evidence, 'auth-seed.json'), JSON.stringify({
      realLocalAuthUsersCreated: users.length, issuedInvitations: 2, pilotMembershipsSeeded: 0,
      profilesOrProgressSeeded: 0, migrationsChanged: 0, remoteOperations: 0, verdict: 'PASS',
    }, null, 2))
    console.log('Email-auth seed: four new local Auth users, two issued invitations, zero pre-granted memberships.')
  } finally { await db.end() }
}
main().catch(error => {
  console.error('Email-auth setup failed:', safeFailure(error, secrets))
  process.exitCode = 1
})
