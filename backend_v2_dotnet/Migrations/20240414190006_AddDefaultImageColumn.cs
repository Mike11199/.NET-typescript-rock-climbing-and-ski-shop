using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_v2.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultImageColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
          
            migrationBuilder.AddColumn<bool>(
                name: "is_main_image",
                schema: "store",
                table: "images",
                type: "boolean",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_main_image",
                schema: "store",
                table: "images");
        }
    }
}
