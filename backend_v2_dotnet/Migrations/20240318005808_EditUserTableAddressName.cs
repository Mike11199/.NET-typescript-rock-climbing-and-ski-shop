using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_v2.Migrations
{
    /// <inheritdoc />
    public partial class EditUserTableAddressName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Address",
                schema: "store",
                table: "users",
                newName: "address");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "address",
                schema: "store",
                table: "users",
                newName: "Address");
        }
    }
}
