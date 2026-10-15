create type public.app_role as enum ('admin','moderator','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- first registered user becomes admin
create or replace function public.handle_first_admin() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if not exists (select 1 from public.user_roles where role='admin') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_first_admin after insert on auth.users for each row execute function public.handle_first_admin();

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path=public as $$ begin new.updated_at = now(); return new; end $$;

create table public.site_settings (key text primary key, value jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());

create table public.members (
  id uuid primary key default gen_random_uuid(), slug text not null unique, full_name text not null, photo_url text,
  designation text, category text not null default 'General Members', short_bio text, full_bio text,
  email text, show_email boolean not null default false, skills text[] not null default '{}', education text,
  github_url text, linkedin_url text, website_url text, display_order int not null default 0,
  featured boolean not null default false, published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.projects (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, cover_url text,
  summary text, description text, problem text, solution text, methodology text, technologies text[] not null default '{}',
  category text not null default 'Robotics', status text not null default 'Planned', start_date date, end_date date,
  github_url text, demo_url text, featured boolean not null default false, published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.project_members (project_id uuid references public.projects(id) on delete cascade, member_id uuid references public.members(id) on delete cascade, primary key(project_id, member_id));

create table public.events (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, description text, poster_url text,
  starts_at timestamptz not null, ends_at timestamptz, venue text, category text, organizer text, registration_url text,
  results text, featured boolean not null default false, published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.achievements (
  id uuid primary key default gen_random_uuid(), title text not null, description text, achieved_on date, organization text,
  recipient text, category text, image_url text, link_url text, featured boolean not null default false, published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.news (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, cover_url text, summary text, content text,
  published_at date default current_date, author text, category text, published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(), image_url text not null, caption text, category text, album text,
  display_order int not null default 0, featured boolean not null default false, published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.applications (
  id uuid primary key default gen_random_uuid(), full_name text not null check (char_length(full_name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 255), level text check (char_length(level) <= 120),
  interests text check (char_length(interests) <= 500), skills text check (char_length(skills) <= 1000),
  motivation text not null check (char_length(motivation) between 1 and 3000), phone text check (char_length(phone) <= 40),
  extra text check (char_length(extra) <= 2000), status text not null default 'Pending', admin_notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 255), subject text check (char_length(subject) <= 200),
  message text not null check (char_length(message) between 1 and 5000), status text not null default 'New',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());

do $$ declare t text; begin
  foreach t in array array['site_settings','members','projects','events','achievements','news','gallery_images','applications','contact_messages'] loop
    execute format('create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at()', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "admin all %1$s" on public.%1$s for all to authenticated using (public.has_role(auth.uid(),''admin'')) with check (public.has_role(auth.uid(),''admin''))', t);
  end loop;
  foreach t in array array['members','projects','events','achievements','news','gallery_images'] loop
    execute format('grant select on public.%I to anon', t);
    execute format('create policy "public read %1$s" on public.%1$s for select to anon, authenticated using (published = true)', t);
  end loop;
end $$;

grant select, insert, update, delete on public.project_members to authenticated; grant select on public.project_members to anon; grant all on public.project_members to service_role;
alter table public.project_members enable row level security;
create policy "public read pm" on public.project_members for select to anon, authenticated using (true);
create policy "admin all pm" on public.project_members for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

grant select on public.site_settings to anon;
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);

grant insert on public.applications to anon; grant insert on public.contact_messages to anon;
create policy "anyone apply" on public.applications for insert to anon, authenticated with check (status = 'Pending' and admin_notes is null);
create policy "anyone contact" on public.contact_messages for insert to anon, authenticated with check (status = 'New');

create index on public.members(published, category, display_order);
create index on public.projects(published, featured);
create index on public.events(published, starts_at);
create index on public.news(published, published_at);

insert into public.site_settings(key, value) values
('general', '{"club_name":"Shanti Science ICT and Robotics Club","short_name":"SSIRC","tagline":"Inspiring Innovation Through Science, ICT and Robotics","intro":"Shanti Science ICT and Robotics Club brings together curious students to explore science, build robots, write code and solve real problems through collaboration and research.","email":"[Placeholder] contact@ssirc.example","phone":"","location":"[Placeholder] Club location","facebook":"","instagram":"","youtube":"","github":""}'),
('about', '{"introduction":"[Placeholder] SSIRC is a student-led club dedicated to science, information and communication technology, and robotics.","history":"[Placeholder] Add the club history here from the admin panel.","mission":"To nurture curiosity, technical skill and teamwork through hands-on learning in science, ICT and robotics.","vision":"A community of young innovators who apply science and technology to improve their school and society.","objectives":["Conduct workshops in robotics, programming and electronics","Encourage research and science experiments","Participate in competitions and exhibitions","Promote collaboration and peer learning"],"values":["Curiosity","Integrity","Collaboration","Excellence","Responsibility"]}'),
('homepage', '{"sections":["hero","about","stats","bod","projects","events","achievements","spotlight","gallery","join","contact"],"hidden":[]}');

insert into public.projects(slug,title,summary,description,category,status,technologies,featured,published) values
('sample-line-follower','[Sample] Line Following Robot','A sample project entry. Replace or delete it from the admin panel.','This is placeholder content to show how projects appear.','Robotics','In Progress','{Arduino,IR sensors}',true,true);
insert into public.events(slug,title,description,starts_at,venue,category,featured,published) values
('sample-robotics-workshop','[Sample] Introductory Robotics Workshop','Placeholder event. Edit or remove from the admin panel.', now() + interval '14 days','[Placeholder] School Lab','Workshop',true,true);