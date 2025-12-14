using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentsManagementWebApi.Entities;
using StudentsManagementWebApi.Services;

namespace StudentsManagementWebApi.Controllers;

[ApiController]
[Route("api/students")]
[Authorize] 
public class StudentsController : ControllerBase
{
    private readonly IStudentService _studentService;

    public StudentsController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_studentService.GetAll());
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var student = _studentService.GetById(id);
        return student == null ? NotFound() : Ok(student);
    }

    [HttpPost]
    public IActionResult Create([FromBody] Student student)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var createdStudent = _studentService.Add(student);

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdStudent.Id },
            createdStudent
        );
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] Student student)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updated = _studentService.Update(id, student);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        return _studentService.Delete(id) ? NoContent() : NotFound();
    }
}