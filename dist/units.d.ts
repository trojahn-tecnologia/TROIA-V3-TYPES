import type { Address, ActiveStatus } from './common';
export type UnitUserRole = 'manager' | 'member';
export interface UnitLocation {
    latitude: number;
    longitude: number;
}
export interface Unit {
    _id?: string;
    appId: string;
    companyId: string;
    name: string;
    code?: string;
    /**
     * CPF/CNPJ da unidade, SÓ DÍGITOS (sem máscara) — é assim que o índice único
     * parcial `(appId, companyId, document)` compara. É também a chave que liga
     * uma fonte externa de visitas à unidade: o contador de fluxo identifica a
     * loja pelo CNPJ, não por um id nosso.
     */
    document?: string;
    description?: string;
    address?: Address;
    location?: UnitLocation;
    status: ActiveStatus;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
export interface UnitResponse extends Omit<Unit, '_id'> {
    id: string;
    /** Two-Phase Fetch: nome do gerente (unit-users role manager ativo de maior prioridade) */
    managerName?: string;
    membersCount?: number;
}
export interface CreateUnitRequest {
    name: string;
    code?: string;
    /** CPF/CNPJ. Aceita com ou sem máscara — o backend normaliza para dígitos. */
    document?: string;
    description?: string;
    address?: Address;
    location?: UnitLocation;
}
/**
 * `null` = LIMPAR o campo (o backend traduz para `$unset`).
 *
 * Sem o `null` explícito, esvaziar Código/Descrição/Endereço/Localização no
 * formulário só conseguia OMITIR a chave — e omitir significa "não mexer",
 * então o valor antigo sobrevivia enquanto a UI dizia "Unidade atualizada com
 * sucesso!". `undefined` (chave ausente) continua significando "não mexer".
 */
export interface UpdateUnitRequest extends Omit<Partial<CreateUnitRequest>, 'code' | 'document' | 'description' | 'address' | 'location'> {
    status?: ActiveStatus;
    code?: string | null;
    document?: string | null;
    description?: string | null;
    address?: Address | null;
    location?: UnitLocation | null;
}
/** Campos aceitos em `sortBy` — o backend rejeita qualquer outro. */
export type UnitSortField = 'name' | 'code' | 'status' | 'createdAt' | 'updatedAt';
export interface UnitQuery {
    page?: number;
    limit?: number;
    search?: string;
    /** Ordenação no SERVIDOR — sem ela a tabela ordena só a página carregada. */
    sortBy?: UnitSortField;
    sortOrder?: 'asc' | 'desc';
    filters?: {
        status?: ActiveStatus;
    };
}
export interface UnitUser {
    _id?: string;
    appId: string;
    companyId: string;
    unitId: string;
    userId: string;
    role: UnitUserRole;
    priority?: number;
    status: ActiveStatus;
    assignedAt: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
export interface UnitUserResponse extends Omit<UnitUser, '_id'> {
    id: string;
    userName?: string;
    userEmail?: string;
    userAvatar?: string;
}
export interface AddUnitUserRequest {
    userId: string;
    role: UnitUserRole;
    priority?: number;
}
export interface UpdateUnitUserRequest {
    role?: UnitUserRole;
    priority?: number;
    status?: ActiveStatus;
}
