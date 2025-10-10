-- Database schema for D1
CREATE TABLE pledges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  crane_count INTEGER NOT NULL,
  timestamp INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial settings
INSERT INTO settings (key, value) VALUES ('total-received', '0');

-- Indexes for better performance
CREATE INDEX idx_pledges_crane_count ON pledges(crane_count DESC);
CREATE INDEX idx_pledges_timestamp ON pledges(timestamp DESC);