-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES Table
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  display_name text,
  fcm_token text,
  is_pro boolean default false,
  alarm_permission boolean default false,
  uid_code text unique, -- 친구 추가용 고유 코드 (예: 랜덤 6자리)
  avatar_url text,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(display_name) >= 2)
);

-- RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone" 
  on profiles for select 
  using ( true );

create policy "Users can insert their own profile" 
  on profiles for insert 
  with check ( auth.uid() = id );

create policy "Users can update own profile" 
  on profiles for update 
  using ( auth.uid() = id );

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, uid_code)
  values (
    new.id, 
    new.email, 
    split_part(new.email, '@', 1), -- 초기 닉네임은 이메일 앞부분
    substr(md5(random()::text), 1, 6) -- 랜덤 코드 생성 (중복 처리 미포함, 간단 구현)
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger logic for new user
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. CONNECTIONS Table (Friendship)
create table public.connections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  friend_id uuid references public.profiles(id) not null,
  status text default 'accepted', -- requested, accepted, blocked
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint unique_friendship unique (user_id, friend_id)
);

alter table public.connections enable row level security;

create policy "Users can view their own connections"
  on connections for select
  using ( auth.uid() = user_id or auth.uid() = friend_id );

create policy "Users can insert connections"
  on connections for insert
  with check ( auth.uid() = user_id );


-- 3. ALARMS Table
create table public.alarms (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null,
  trigger_time timestamp with time zone not null,
  message text,
  message_type text default 'default', -- default, tts, voice
  status text default 'pending', -- pending, ringing, success, failed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.alarms enable row level security;

create policy "Users can view alarms sent to or by them"
  on alarms for select
  using ( auth.uid() = sender_id or auth.uid() = receiver_id );

create policy "Users can create alarms"
  on alarms for insert
  with check ( auth.uid() = sender_id );

create policy "Receiver can update alarm status"
  on alarms for update
  using ( auth.uid() = receiver_id );


-- 4. TRACKING_SESSIONS Table
create table public.tracking_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null, -- 위치를 공유하는 사람 (Receiver)
  viewer_id uuid references public.profiles(id) not null, -- 보는 사람 (Controller)
  current_lat double precision,
  current_lng double precision,
  is_active boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tracking_sessions enable row level security;

create policy "Participants can view tracking session"
  on tracking_sessions for select
  using ( auth.uid() = user_id or auth.uid() = viewer_id );

create policy "User can update their own location"
  on tracking_sessions for update
  using ( auth.uid() = user_id );

create policy "User can create tracking session"
  on tracking_sessions for insert
  with check ( auth.uid() = user_id );
