namespace DatingApp.API.Helpers
{
    public class UserParams
    {
        public int PageNumber { get; set; } = 1;

        private int maxPageSize = 20;
        private int pageSize = 10;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value > maxPageSize) ? maxPageSize : value; }
        }

        public int userId { get; set; }
        public int minAge { get; set; } = 18;
        public int maxAge { get; set; } = 99;

        public string gender { get; set; }

        public string orderBy { get; set; }

        public bool likers { get; set; } = false;
        public bool likees { get; set; } = false;

    }
}