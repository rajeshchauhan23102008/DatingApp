using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DataContext : DbContext
    {
        public DbSet<Like> Likes { get; set; }
        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
                                => optionsBuilder.UseLazyLoadingProxies();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            // Manually set 'Like' entity due to many to many relationship.

            modelBuilder.Entity<Like>().HasKey(l => new { l.LikerId, l.LikeeId });

            modelBuilder.Entity<Like>()
                    .HasOne(l => l.Likee)
                    .WithMany(u => u.Likers)
                    .HasForeignKey(l => l.LikerId)
                    .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Like>()
                    .HasOne(l => l.Liker)
                    .WithMany(u => u.Likees)
                    .HasForeignKey(l => l.LikeeId)
                    .OnDelete(DeleteBehavior.Restrict);

            // Manually set 'Message' entity due to many to many relationship.

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(u => u.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Recipient)
                .WithMany(u => u.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);
        }


    }
}