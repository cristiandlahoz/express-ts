import { Request } from 'express';
import Boom from '@hapi/boom';

export interface ApiLink {
  href: string;
  method?: string;
  title?: string;
}

export interface ApiLinks {
  [key: string]: ApiLink;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
  path: string;
  _links?: ApiLinks;
}

export interface PaginatedResponse<T = unknown> extends Omit<ApiResponse<T[]>, 'data'> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class ApiResponseBuilder {
  private baseUrl: string;

  constructor(private req: Request) {
    this.baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
  }

  success<T>(data: T, message?: string, links?: ApiLinks): ApiResponse<T> {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      path: this.req.path
    };

    if (links) {
      response._links = links;
    }

    return response;
  }

  error(error: Boom.Boom): ApiResponse {
    return {
      success: false,
      ...error.output.payload,
      timestamp: new Date().toISOString(),
      path: this.req.path
    };
  }

  paginated<T>(data: T[], page: number, limit: number, total: number, links?: ApiLinks): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);

    const response: PaginatedResponse<T> = {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      timestamp: new Date().toISOString(),
      path: this.req.path
    };

    if (links) {
      response._links = links;
    }

    return response;
  }
} 