using System.ComponentModel.DataAnnotations;

public class Student
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public string ClassName { get; set; }

    [Required]
    public string Section { get; set; }
}