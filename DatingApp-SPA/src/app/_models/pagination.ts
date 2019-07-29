export interface Pagination {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    itemCount: number;
}

export class PaginatedResult<T> {

    result: T;
    pagination: Pagination;
}
