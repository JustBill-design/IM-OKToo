
DB_HOST="127.0.0.1"
DB_USER="root"
DB_NAME="IMOKTOO"
echo "Rundatabase "
mysql -u $DB_USER -h $DB_HOST -e "
CREATE DATABASE IF NOT EXISTS $DB_NAME;
USE $DB_NAME;
CREATE TABLE IF NOT EXISTS migrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    migration_name VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);"
for migration_file in backend/migrations/*.sql; do
    if [ -f "$migration_file" ]; then
        migration_name=$(basename "$migration_file" .sql)
        result=$(mysql -u $DB_USER -h $DB_HOST -se "
            USE $DB_NAME;
            SELECT COUNT(*) FROM migrations WHERE migration_name = '$migration_name';
        ")
        if [ "$result" -eq "0" ]; then
            echo "Running migration: $migration_name"
            mysql -u $DB_USER -h $DB_HOST $DB_NAME < "$migration_file"
            mysql -u $DB_USER -h $DB_HOST -e "
                USE $DB_NAME;
                INSERT INTO migrations (migration_name) VALUES ('$migration_name');
            "
            echo "Completed: $migration_name"
        else
            echo "Skipped: $migration_name (alr run)"
        fi
    fi
done
echo "All migrations complete!"
