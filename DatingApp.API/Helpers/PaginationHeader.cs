namespace DatingApp.API.Helpers {

    public class PaginationHeader { 
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int ItemCount { get; set; }

        public PaginationHeader(int pageNumber, int pageSize, int totalPages, int itemCount)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
            TotalPages = totalPages;
            ItemCount = itemCount;
        }
    }
}