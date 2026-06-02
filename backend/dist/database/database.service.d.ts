import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private readonly logger;
    private pgPool;
    private sqliteDb;
    private isSqlite;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private initializeDatabase;
    private initializeSqlite;
    private loadSchemaAndSeed;
    private translateToSqlite;
    private executeMultiStatementSqlite;
    private runSqliteQuery;
    query<T = any>(sql: string, params?: any[]): Promise<T[]>;
    private ensureAllergens;
    private ensureAllergenAliasTable;
    private seedAllergenAliases;
    getIsSqlite(): boolean;
}
