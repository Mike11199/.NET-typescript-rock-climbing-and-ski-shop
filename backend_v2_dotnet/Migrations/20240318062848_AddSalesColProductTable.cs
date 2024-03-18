using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_v2.Migrations
{
    /// <inheritdoc />
    public partial class AddSalesColProductTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "sales",
                schema: "store",
                table: "products",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "sales",
                schema: "store",
                table: "products");
        }
    }
}
