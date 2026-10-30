using College_DB.Models;
using Microsoft.EntityFrameworkCore;
namespace College_DB.Data;
public class CollegeDbContext(DbContextOptions<CollegeDbContext> options) : DbContext(options) {
public DbSet<Student> Students => Set<Student>();
public DbSet<Group> Groups => Set<Group>();
protected override void OnModelCreating(ModelBuilder b) {
b.Entity<Student>().ToTable("Students").HasKey(x => x.StudentId);
b.Entity<Group>().ToTable("Groups").HasKey(x => x.GroupId);
b.Entity<Student>().Property(x=>x.FirstName).HasMaxLength(50).IsRequired(); b.Entity<Student>().Property(x=>x.LastName).HasMaxLength(50).IsRequired(); b.Entity<Group>().Property(x=>x.GroupName).HasMaxLength(20).IsRequired(); b.Entity<Student>().HasOne<Group>().WithMany().HasForeignKey(x=>x.GroupId).OnDelete(DeleteBehavior.Restrict);
}}