-- NutriGuide Database Schema for Supabase
-- Run this in Supabase SQL Editor to create all tables

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT,
    avatar TEXT,
    weight DECIMAL NOT NULL,
    height DECIMAL NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female')) NOT NULL,
    goal TEXT CHECK (goal IN ('lose', 'maintain', 'gain')) NOT NULL,
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active')) NOT NULL,
    calorie_goal INTEGER DEFAULT 2000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 如果表已存在，添加缺失的列
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;

-- 饮食日记表
CREATE TABLE IF NOT EXISTS meal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    calories INTEGER NOT NULL,
    protein DECIMAL,
    carbs DECIMAL,
    fats DECIMAL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 周计划表
CREATE TABLE IF NOT EXISTS weekly_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')) NOT NULL,
    scheduled_time TIME,
    name TEXT NOT NULL,
    description TEXT,
    calories INTEGER NOT NULL,
    protein DECIMAL,
    image_url TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 食谱收藏表
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    calories INTEGER NOT NULL,
    prep_time TEXT,
    tags TEXT[],
    image_url TEXT,
    is_favorite BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 饮水记录表
CREATE TABLE IF NOT EXISTS hydration_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    glasses INTEGER DEFAULT 0,
    goal INTEGER DEFAULT 8,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_meal_entries_user_date ON meal_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_user_date ON weekly_plans(user_id, date);
CREATE INDEX IF NOT EXISTS idx_hydration_logs_user_date ON hydration_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_recipes_user ON recipes(user_id);

-- 启用 Row Level Security (可选但推荐)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE meal_entries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE hydration_logs ENABLE ROW LEVEL SECURITY;
