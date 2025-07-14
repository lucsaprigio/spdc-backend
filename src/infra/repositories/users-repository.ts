import { User } from "@/domain/spdc/dto/users";
import { FirebirdService } from "@/infra/services/firebird.service";
import { ICacheProvider } from "@/application/providers/ICacheProvider";
import { IUsersRepository } from "@/application/repositories/IUsersRepository";

export class UserRepository implements IUsersRepository {
    constructor(
        private readonly firebirdService: FirebirdService,
        private readonly cacheProvider: ICacheProvider
    ) { }

    async findById(id: string): Promise<User[] | null> {
        const cacheKey = `user:${id}`;

        const cachedUser = this.cacheProvider.get<User[]>(cacheKey);

        if (cachedUser) {
            return cachedUser;
        }

        const sql = `
                       SELECT
                        DB_CLIENTE_PAGINA.cd_cliente,
                        DB_CLIENTE_PAGINA.cnpj_cliente,
                        DB_CLIENTE_PAGINA.email_cliente,
                        DB_CLIENTE_PAGINA.NOME_CLIENTE,
                        DB_CLIENTE_PAGINA_EMPRESA.cnpj_matriz,
                        DB_CLIENTE_PAGINA_EMPRESA.cnpj_empresa,
                        DB_CLIENTE_PAGINA_EMPRESA.razao_empresa,
                        DB_CLIENTE_PAGINA_EMPRESA.EMP_CONCENTRADORA
                    FROM DB_CLIENTE_PAGINA
                    INNER JOIN DB_CLIENTE_PAGINA_EMPRESA ON DB_CLIENTE_PAGINA.CD_CLIENTE = DB_CLIENTE_PAGINA_EMPRESA.CD_CLIENTE
                    WHERE DB_CLIENTE_PAGINA_EMPRESA.CD_CLIENTE = ?
                    ORDER BY ITEN
        `

        const result = await this.firebirdService.executeTransaction(sql, [id]);

        this.cacheProvider.set(cacheKey, result, 300);
        return result as User[];
    }

    async findByEmail(email: string): Promise<User[] | null> {
        const sql = `
            SELECT * FROM DB_CLIENTE_PAGINA
            WHERE DB_CLIENTE_PAGINA.EMAIL_CLIENTE = ?
        `

        const result = await this.firebirdService.executeTransaction(sql, [email]);

        return result as User[] | null;
    }
}