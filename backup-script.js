
import { backupDatabase, restoreDatabase } from "./server/backup.ts";

const command = process.argv[2];

switch (command) {
  case "backup":
    console.log("🔄 Starting manual backup...");
    backupDatabase().then((success) => {
      if (success) {
        console.log("✅ Backup completed successfully!");
        process.exit(0);
      } else {
        console.log("❌ Backup failed!");
        process.exit(1);
      }
    });
    break;
    
  case "restore":
    console.log("🔄 Starting manual restoration...");
    restoreDatabase().then((success) => {
      if (success) {
        console.log("✅ Restoration completed successfully!");
        process.exit(0);
      } else {
        console.log("❌ Restoration failed!");
        process.exit(1);
      }
    });
    break;
    
  default:
    console.log("Usage: node backup-script.js [backup|restore]");
    console.log("  backup  - Create a backup of the current database");
    console.log("  restore - Restore database from backup");
    process.exit(1);
}
