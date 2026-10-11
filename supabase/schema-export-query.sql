-- Read-only: describes the tables that were created in the Supabase dashboard, so they can be
-- saved as a migration. Run it in SQL Editor and copy the single "schema" value it returns.
with dashboard_tables as (
  select unnest(array['magazines', 'executive_members', 'gallery_items', 'public_stats']) as name
)
select json_build_object(
  'all_public_tables', (
    select json_agg(tablename order by tablename) from pg_tables where schemaname = 'public'
  ),
  'tables', (
    select json_agg(json_build_object(
      'table', t.name,
      'rls_enabled', (select c.relrowsecurity from pg_class c
                      join pg_namespace n on n.oid = c.relnamespace
                      where n.nspname = 'public' and c.relname = t.name),
      'columns', (
        select json_agg(json_build_object(
          'name', col.column_name,
          'type', format_type(a.atttypid, a.atttypmod),
          'nullable', col.is_nullable,
          'default', col.column_default,
          'identity', col.is_identity
        ) order by col.ordinal_position)
        from information_schema.columns col
        join pg_attribute a
          on a.attrelid = ('public.' || quote_ident(t.name))::regclass and a.attname = col.column_name
        where col.table_schema = 'public' and col.table_name = t.name
      ),
      'constraints', (
        select json_agg(json_build_object('name', con.conname, 'definition', pg_get_constraintdef(con.oid)))
        from pg_constraint con
        where con.conrelid = ('public.' || quote_ident(t.name))::regclass
      ),
      'indexes', (
        select json_agg(indexdef) from pg_indexes where schemaname = 'public' and tablename = t.name
      ),
      'triggers', (
        select json_agg(pg_get_triggerdef(tr.oid))
        from pg_trigger tr
        where tr.tgrelid = ('public.' || quote_ident(t.name))::regclass and not tr.tgisinternal
      ),
      'policies', (
        select json_agg(json_build_object(
          'name', policyname, 'command', cmd, 'roles', roles, 'using', qual, 'with_check', with_check
        ))
        from pg_policies where schemaname = 'public' and tablename = t.name
      ),
      'grants', (
        select json_agg(json_build_object('role', grantee, 'privilege', privilege_type))
        from information_schema.role_table_grants
        where table_schema = 'public' and table_name = t.name and grantee in ('anon', 'authenticated')
      )
    ) order by t.name)
    from dashboard_tables t
  ),
  'buckets', (
    select json_agg(json_build_object(
      'id', id, 'public', public, 'file_size_limit', file_size_limit,
      'allowed_mime_types', allowed_mime_types
    ) order by id)
    from storage.buckets
  )
) as schema;
