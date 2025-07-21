
1. **After `git pull`, check if new migrations exist:**
   ```bash
   ls backend/migrations/
   ```
2. **Run migrations:**
   ```bash
   ./run-migrations.sh
   ```
3. **Or, if things are broken, reset everything:**
   ```bash
   sudo mysql -u root -e "DROP DATABASE IF EXISTS IMOKTOO;"
   sudo mysql -u root < backend/database.sql
   ```