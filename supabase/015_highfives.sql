-- 015: High fives table for friend activity feed
CREATE TABLE IF NOT EXISTS highfives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_highfive_unique ON highfives(from_user_id, activity_id);
CREATE INDEX idx_highfive_to_user ON highfives(to_user_id);

ALTER TABLE highfives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can send high fives" ON highfives FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "Users can view their own high fives" ON highfives FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
