-- Create table for tracking game statistics
CREATE TABLE game_stats (
    id SERIAL PRIMARY KEY,
    stat_type VARCHAR(50) NOT NULL,
    total_games_played INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on stat_type to ensure only one global record
CREATE UNIQUE INDEX idx_game_stats_stat_type ON game_stats(stat_type);

-- Enable Row Level Security (RLS)
ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to everyone
CREATE POLICY "Allow read access to game stats" ON game_stats
    FOR SELECT USING (true);

-- Create policy to allow insert/update from authenticated users or anonymous users
CREATE POLICY "Allow insert/update game stats" ON game_stats
    FOR ALL USING (true);

-- Insert initial record for global stats
INSERT INTO game_stats (stat_type, total_games_played, created_at, updated_at)
VALUES ('global', 0, NOW(), NOW())
ON CONFLICT (stat_type) DO NOTHING; 