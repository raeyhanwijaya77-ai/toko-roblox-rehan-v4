import { neon } from '@neondatabase/serverless';
export const sql = neon(process.env.DATABASE_URL || 'postgres://u:p@localhost/db');
let ready;
export function init() {
  return (ready ??= (async () => {
    await sql`create table if not exists users(id serial primary key,email text unique not null,pass text not null)`;
    await sql`create table if not exists accounts(id serial primary key,title text not null,description text default '',price int not null,images jsonb default '[]',username text not null,password text not null,status text default 'available',reserved_at timestamptz,buyer_id int,created timestamptz default now())`;
    await sql`create table if not exists orders(id text primary key,user_id int,account_id int,amount int,qr text,status text default 'pending',created timestamptz default now())`;
    await sql`create table if not exists otps(email text primary key,code text,sent timestamptz default now(),tries int default 0)`;
    await sql`create table if not exists meta(k text primary key,v text)`;
    const [d] = await sql`select 1 from meta where k='admin_seed'`;
    if (!d) {
      const em = (process.env.ADMIN_EMAIL || 'raeyhanwijaya77@gmail.com').toLowerCase().trim();
      await sql`insert into users(email,pass) values(${em},${'3ed890b1d8079e1b794f49e9051a2d0f:a8a7300a677263497457ea6cbc77a77a41464a92ee23bb6bc5cbe684d69a087e'}) on conflict(email) do update set pass=${'3ed890b1d8079e1b794f49e9051a2d0f:a8a7300a677263497457ea6cbc77a77a41464a92ee23bb6bc5cbe684d69a087e'}`;
      await sql`insert into meta(k,v) values('admin_seed','1')`;
    }
    await sql`alter table users add column if not exists username text`;
    await sql`alter table users add column if not exists role text default 'user'`;
    await sql`alter table accounts add column if not exists specs text default ''`;
    await sql`create unique index if not exists users_username_key on users(lower(username))`;
    const [d2] = await sql`select 1 from meta where k='admin_role'`;
    if (!d2) {
      const em2 = (process.env.ADMIN_EMAIL || 'raeyhanwijaya77@gmail.com').toLowerCase().trim();
      await sql`update users set username='admin_rehan', role='admin_rehan' where email=${em2}`;
      await sql`insert into meta(k,v) values('admin_role','1') on conflict(k) do nothing`;
    }
  })());
}
