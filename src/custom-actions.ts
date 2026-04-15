import { ObjectId } from 'mongodb';
import { ActiveStatus, PaginationQuery } from './common';

export interface ToolFilterCondition {
  field: string;
  operator: string;
  value: string;
}

export interface CustomAction {
  _id?: ObjectId | undefined;
  id?: string | undefined;
  name: string;
  displayName: string;
  description?: string | undefined;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
    }>;
    required?: string[] | undefined;
  };
  endpoint: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    headers?: Record<string, string> | undefined;
    body?: Record<string, unknown> | undefined;
  };
  credentials?: Record<string, string> | undefined;
  responseMapping?: {
    successPath?: string | undefined;
    errorPath?: string | undefined;
    transform?: string | undefined;
  } | undefined;
  aiProcessing?: {
    enabled: boolean;
    prompt: string;
    parameters: {
      type: 'object';
      properties: Record<string, {
        type: string;
        description: string;
      }>;
      required?: string[] | undefined;
    };
  } | undefined;
  filters?: ToolFilterCondition[] | undefined;
  appId: ObjectId | string;
  companyId: ObjectId | string;
  status: ActiveStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string | undefined;
}

export interface CustomActionResponse extends Omit<CustomAction, '_id'> {
  id: string;
}

export interface CreateCustomActionRequest {
  name: string;
  displayName: string;
  description?: string | undefined;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
    }>;
    required?: string[] | undefined;
  };
  endpoint: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    headers?: Record<string, string> | undefined;
    body?: Record<string, unknown> | undefined;
  };
  credentials?: Record<string, string> | undefined;
  responseMapping?: {
    successPath?: string | undefined;
    errorPath?: string | undefined;
    transform?: string | undefined;
  } | undefined;
  aiProcessing?: {
    enabled: boolean;
    prompt: string;
    parameters: {
      type: 'object';
      properties: Record<string, {
        type: string;
        description: string;
      }>;
      required?: string[] | undefined;
    };
  } | undefined;
  filters?: ToolFilterCondition[] | undefined;
}

export interface UpdateCustomActionRequest {
  name?: string | undefined;
  displayName?: string | undefined;
  description?: string | undefined;
  parameters?: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
    }>;
    required?: string[] | undefined;
  } | undefined;
  endpoint?: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    headers?: Record<string, string> | undefined;
    body?: Record<string, unknown> | undefined;
  } | undefined;
  credentials?: Record<string, string> | undefined;
  responseMapping?: {
    successPath?: string | undefined;
    errorPath?: string | undefined;
    transform?: string | undefined;
  } | undefined;
  aiProcessing?: {
    enabled: boolean;
    prompt: string;
    parameters: {
      type: 'object';
      properties: Record<string, {
        type: string;
        description: string;
      }>;
      required?: string[] | undefined;
    };
  } | undefined;
  filters?: ToolFilterCondition[] | undefined;
}

export interface CustomActionQuery extends PaginationQuery {
  status?: ActiveStatus | undefined;
}

// Additional type exports for frontend use
export type CustomActionParameter = {
  type: string;
  description: string;
};

export type CustomActionEndpoint = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
};

export type CustomActionCredentials = Record<string, string>;

export type CustomActionResponseMapping = {
  successPath?: string;
  errorPath?: string;
  transform?: string;
};
