
set -e

source .env

PROXY_LOG="backend/proxy.log"
CLOUD_SQL_PROXY="backend/cloud_sql_proxy"
if [ -z "$INSTANCE_CONNECTION_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASS" ] || [ -z "$DB_NAME" ]; then
    echo "error missing env vars check .env file"
    echo "need INSTANCE_CONNECTION_NAME DB_USER DB_PASS DB_NAME"
    exit 1
fi
if ! pgrep -f "$CLOUD_SQL_PROXY" > /dev/null; then
    echo "starting cloud sql proxy"
    $CLOUD_SQL_PROXY $INSTANCE_CONNECTION_NAME --port 3307 > "$PROXY_LOG" 2>&1 &
    PROXY_PID=$!

    echo "waiting for sql proxy"
    sleep 5
    
    if ! pgrep -f "$CLOUD_SQL_PROXY" > /dev/null; then
        echo "error failed to start cloud sql proxy check $PROXY_LOG"
        exit 1
    fi
    echo "cloud sql proxy running PID $PROXY_PID"
fi

DB_HOST="127.0.0.1"
DB_PORT="3307"

echo "running database migrations on cloud sql"
echo "instance $INSTANCE_CONNECTION_NAME"
echo "database $DB_NAME"
mysql -u $DB_USER -p$DB_PASS -h $DB_HOST -P $DB_PORT -e "
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
        result=$(mysql -u $DB_USER -p$DB_PASS -h $DB_HOST -P $DB_PORT -se "
            USE $DB_NAME;
            SELECT COUNT(*) FROM migrations WHERE migration_name = '$migration_name';
        ")
        if [ "$result" -eq "0" ]; then
            echo "running migration $migration_name"
            mysql -u $DB_USER -p$DB_PASS -h $DB_HOST -P $DB_PORT $DB_NAME < "$migration_file"
            mysql -u $DB_USER -p$DB_PASS -h $DB_HOST -P $DB_PORT -e "
                USE $DB_NAME;
                INSERT INTO migrations (migration_name) VALUES ('$migration_name');
            "
            echo "completed $migration_name"
        else
            echo "skipped $migration_name already run"
        fi
    fi
done
echo "all migrations done"
