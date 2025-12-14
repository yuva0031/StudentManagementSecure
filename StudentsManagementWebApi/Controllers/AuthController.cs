using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using StudentsManagementWebApi.Entities;
using StudentsManagementWebApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StudentManagementWebApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(Microsoft.AspNetCore.Identity.Data.RegisterRequest model)
    {
        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new { message = "User registered successfully" });
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(Microsoft.AspNetCore.Identity.Data.LoginRequest model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);

        if (user == null)
            return Unauthorized("Invalid credentials");

        var validPassword =
            await _userManager.CheckPasswordAsync(user, model.Password);

        if (!validPassword)
            return Unauthorized("Invalid credentials");

        var jwt = _configuration.GetSection("JwtSettings");

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwt["Secret"]!)
        );

        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims: new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!)
            },
            expires: DateTime.UtcNow.AddMinutes(
                int.Parse(jwt["ExpiryMinutes"]!)
            ),
            signingCredentials:
                new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return Ok(new AuthResponse
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            ExpiresAt = token.ValidTo
        });
    }
}