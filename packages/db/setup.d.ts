export default function setup({ filePath }: {
    filePath: any;
}): {
    db: import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof schema> & {
        $client: Database;
    };
    schema: typeof schema;
};
import * as schema from './schema.js';
//# sourceMappingURL=setup.d.ts.map