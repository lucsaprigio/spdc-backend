/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from "@/infra/env";
import firebird from 'node-firebird';
import { DatabaseOptions } from "@/core/shared/@types/database-options";
import { FirebirdError } from "@/core/shared/errors/FirebirdError";

class FirebirdService {
    private options: DatabaseOptions;

    constructor() {
        this.options = {
            host: env.DATABASE_URL,
            port: env.DATABASE_PORT,
            database: env.DATABASE_NAME,
            user: env.DATABASE_USER,
            password: env.DATABASE_PASSWORD
        }
    }

    async executeTransaction(ssql: string, params: any[]): Promise<[]> {
        return new Promise<[]>((resolve, reject) => {
            try {
                firebird.attach(this.options, (err, db) => {
                    if (err) {
                        return reject(new FirebirdError({ message: err.message, originalError: err.error }, 500, err.gdscode));
                    };

                    db.transaction(firebird.ISOLATION_READ_COMMITTED, async (err, transaction) => {
                        if (err) {
                            db.detach();
                            return reject(err);
                        };

                        transaction.query(ssql, params, (err, result) => {
                            if (err) {
                                transaction.rollback(() => {
                                    db.detach();
                                    return reject(new FirebirdError({ message: err.message, originalError: err.error }, 500, err.gdscode));
                                });
                            } else {
                                transaction.commit(() => {
                                    db.detach();
                                    return resolve(result as []);
                                })
                            };
                        })
                    })
                })
            } catch (error) {
                throw new Error(String(error));
            }
        })
    }

    async executeQuery<T>(query: string, params: any[]): Promise<[]> {
        return new Promise<[]>((resolve, reject) => {
            firebird.attachOrCreate(this.options, (err, db) => {
                if (err) {
                    db.detach();
                    return reject(this.createFirebirdError(err, { info: "Erro ao conectar ao firebird" }));
                }

                db.query(query, params, (err, result) => {
                    if (err) {
                        return reject(this.createFirebirdError(err, { info: "Erro ao executar a query" }));
                    }

                    return resolve(result as [])
                })

                db.detach();
            })
        })
    }

    private createFirebirdError(
        error: any,
        additionalInfo?: Record<string, any>
    ): FirebirdError {
        return new FirebirdError(
            {
                message: error.message || 'Unknown Firebird error',
                originalError: error,
                ...additionalInfo
            },
            error.statusCode || 500,
            error.gdscode || 0
        );
    }
}

export { FirebirdService };