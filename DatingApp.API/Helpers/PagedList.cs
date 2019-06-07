using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Helpers
{
    public class PagedList<T> : List<T>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int ItemCount { get; set; }

        public PagedList(List<T> items, int pageNumber, int pageSize, int itemCount)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
            TotalPages = (int)Math.Ceiling(itemCount / (double)pageSize);
            ItemCount = itemCount;
            this.AddRange(items);
        }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            // var itemCount = await source.CountAsync();
            var items = await source
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize).ToListAsync();

            return new PagedList<T>(items, pageNumber, pageSize, items.Count());

        }
    }
}