using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_v2.Migrations
{
    public partial class AddUserTableAddress : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add the Address column to the users table
            migrationBuilder.AddColumn<string>(
                name: "Address",
                schema: "store",
                table: "users",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove the Address column from the users table
            migrationBuilder.DropColumn(
                name: "Address",
                schema: "store",
                table: "users");
        }
    }
}
