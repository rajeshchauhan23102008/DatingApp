namespace DatingApp.API.Helpers
{
    public class MessageParams
    {
        // Pagination Data.

        private const int _maxPageSize = 50;
        private int _pageSize = 10;
        public int PageSize
        {
            get { return _pageSize; }
            set { _pageSize = value > _maxPageSize ? _maxPageSize : value; }
        }

        public int PageNumber { get; set; } = 1;

        // Message Data.

        public int UserId { get; set; }
        public string MessageType { get; set; } = "unread";
    }
}