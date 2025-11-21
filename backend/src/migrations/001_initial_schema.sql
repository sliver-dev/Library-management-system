-- Library Management System Database Schema
-- Generated based on planning.md specifications

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user roles enum
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Create transaction status enum
CREATE TYPE transaction_status AS ENUM ('issued', 'returned', 'overdue', 'lost');

-- Create reservation status enum
CREATE TYPE reservation_status AS ENUM ('active', 'fulfilled', 'expired', 'cancelled');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    phone VARCHAR(20),
    address TEXT,
    is_banned BOOLEAN DEFAULT FALSE,
    registration_date TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    profile_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Books table
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    isbn VARCHAR(20) UNIQUE,
    title VARCHAR(500) NOT NULL,
    author VARCHAR(200) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    publisher VARCHAR(200),
    edition VARCHAR(50),
    publication_year INTEGER,
    description TEXT,
    cover_image_url VARCHAR(500),
    total_copies INTEGER NOT NULL DEFAULT 1,
    available_copies INTEGER NOT NULL DEFAULT 1,
    barcode VARCHAR(100) UNIQUE,
    rfid_tag VARCHAR(100) UNIQUE,
    location VARCHAR(100),
    acquisition_date DATE,
    cost DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT positive_copies CHECK (total_copies >= 0),
    CONSTRAINT available_not_more_than_total CHECK (available_copies <= total_copies)
);

-- Borrowing transactions table
CREATE TABLE borrowing_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    issue_date TIMESTAMP NOT NULL,
    due_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP,
    actual_return_date TIMESTAMP,
    status transaction_status NOT NULL DEFAULT 'issued',
    fine_amount DECIMAL(10, 2) DEFAULT 0,
    fine_paid BOOLEAN DEFAULT FALSE,
    notes TEXT,
    issued_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT non_negative_fine CHECK (fine_amount >= 0)
);

-- Reservations table
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    reservation_date TIMESTAMP DEFAULT NOW(),
    expiry_date TIMESTAMP NOT NULL,
    status reservation_status DEFAULT 'active',
    priority INTEGER DEFAULT 1,
    notification_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT positive_priority CHECK (priority > 0)
);

-- User reading history table
CREATE TABLE user_reading_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    started_reading_date DATE,
    completed_reading_date DATE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    pages_read INTEGER,
    reading_time_minutes INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT positive_pages CHECK (pages_read >= 0),
    CONSTRAINT positive_time CHECK (reading_time_minutes >= 0)
);

-- User preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    favorite_genres JSONB DEFAULT '[]',
    favorite_authors JSONB DEFAULT '[]',
    preferred_language VARCHAR(10) DEFAULT 'en',
    notification_preferences JSONB DEFAULT '{}',
    reading_goals JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- System analytics table
CREATE TABLE system_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type VARCHAR(100) NOT NULL,
    metric_value JSONB NOT NULL,
    date_recorded DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_banned ON users(is_banned);

CREATE INDEX idx_books_title ON books USING gin(to_tsvector('english', title));
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_books_is_active ON books(is_active);
CREATE INDEX idx_books_available_copies ON books(available_copies);

CREATE INDEX idx_transactions_user_id ON borrowing_transactions(user_id);
CREATE INDEX idx_transactions_book_id ON borrowing_transactions(book_id);
CREATE INDEX idx_transactions_status ON borrowing_transactions(status);
CREATE INDEX idx_transactions_issue_date ON borrowing_transactions(issue_date);
CREATE INDEX idx_transactions_due_date ON borrowing_transactions(due_date);

CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_book_id ON reservations(book_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_expiry_date ON reservations(expiry_date);

CREATE INDEX idx_reading_history_user_id ON user_reading_history(user_id);
CREATE INDEX idx_reading_history_book_id ON user_reading_history(book_id);

CREATE INDEX idx_analytics_metric_type ON system_analytics(metric_type);
CREATE INDEX idx_analytics_date_recorded ON system_analytics(date_recorded);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON borrowing_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update available copies when books are borrowed/returned
CREATE OR REPLACE FUNCTION update_available_copies()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status = 'issued') THEN
        UPDATE books
        SET available_copies = available_copies - 1
        WHERE id = NEW.book_id;
    END IF;

    IF TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status = 'returned' THEN
        UPDATE books
        SET available_copies = available_copies + 1
        WHERE id = NEW.book_id;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_available_copies
    AFTER INSERT OR UPDATE ON borrowing_transactions
    FOR EACH ROW EXECUTE FUNCTION update_available_copies();