using StudentsManagementWebApi.Data;
using StudentsManagementWebApi.Entities;
using System;

namespace StudentsManagementWebApi.Services;

public class StudentService : IStudentService
{
    private readonly AppDbContext _context;

    public StudentService(AppDbContext context)
    {
        _context = context;
    }

    public List<Student> GetAll()
    {
        Console.WriteLine("hittings");
        return _context.Students.ToList();
    }

    public Student? GetById(int id)
    {
        return _context.Students.FirstOrDefault(s => s.Id == id);
    }

    public Student Add(Student student)
    {
        _context.Students.Add(student);
        _context.SaveChanges();
        return student;
    }

    public Student? Update(int id, Student student)
    {
        var existing = _context.Students.FirstOrDefault(s => s.Id == id);
        if (existing == null)
            return null;

        existing.Name = student.Name;
        existing.ClassName = student.ClassName;
        existing.Section = student.Section;

        _context.SaveChanges();
        return existing;
    }

    public bool Delete(int id)
    {
        var student = _context.Students.FirstOrDefault(s => s.Id == id);
        if (student == null)
            return false;

        _context.Students.Remove(student);
        _context.SaveChanges();
        return true;
    }
}