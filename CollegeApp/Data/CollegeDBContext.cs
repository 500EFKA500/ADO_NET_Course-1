using College_DB.Models;
using Microsoft.EntityFrameworkCore;
namespace College_DB.Data;
public class CollegeDbContext(DbContextOptions<CollegeDbContext> options) : DbContext(options)
{
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Group> Groups => Set<Group>();
    public DbSet<Teacher> Teachers => Set<Teacher>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<Grade> Grades => Set<Grade>();
    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Student>().ToTable("Students").HasKey(x => x.StudentId);
        b.Entity<Group>().ToTable("Groups").HasKey(x => x.GroupId);
        b.Entity<Teacher>().ToTable("Teachers").HasKey(x => x.TeacherId);
        b.Entity<Subject>().ToTable("Subjects").HasKey(x => x.SubjectId);
        b.Entity<Grade>().ToTable("Grades").HasKey(x => x.GradeId);
        b.Entity<Student>().Property(x => x.FirstName).HasMaxLength(50).IsRequired();
        b.Entity<Student>().Property(x => x.LastName).HasMaxLength(50).IsRequired();
        b.Entity<Group>().Property(x => x.GroupName).HasMaxLength(20).IsRequired();
        b.Entity<Student>().HasOne<Group>().WithMany().HasForeignKey(x => x.GroupId).OnDelete(DeleteBehavior.Restrict);
        b.Entity<Subject>().HasOne<Teacher>().WithMany().HasForeignKey(x => x.TeacherId).OnDelete(DeleteBehavior.Restrict);
        b.Entity<Grade>().HasOne<Student>().WithMany().HasForeignKey(x => x.StudentId).OnDelete(DeleteBehavior.Restrict);
        b.Entity<Grade>().HasOne<Subject>().WithMany().HasForeignKey(x => x.SubjectId).OnDelete(DeleteBehavior.Restrict);
    }
}