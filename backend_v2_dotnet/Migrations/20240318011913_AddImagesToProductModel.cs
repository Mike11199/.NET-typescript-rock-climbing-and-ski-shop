using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_v2.Migrations
{
    /// <inheritdoc />
    public partial class AddImagesToProductModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "city",
                schema: "store",
                table: "users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "country",
                schema: "store",
                table: "users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "phone_number",
                schema: "store",
                table: "users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "state",
                schema: "store",
                table: "users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "zip_code",
                schema: "store",
                table: "users",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_images_product_id",
                schema: "store",
                table: "images",
                column: "product_id");

            migrationBuilder.AddForeignKey(
                name: "FK_images_products_product_id",
                schema: "store",
                table: "images",
                column: "product_id",
                principalSchema: "store",
                principalTable: "products",
                principalColumn: "product_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_images_products_product_id",
                schema: "store",
                table: "images");

            migrationBuilder.DropIndex(
                name: "IX_images_product_id",
                schema: "store",
                table: "images");

            migrationBuilder.DropColumn(
                name: "city",
                schema: "store",
                table: "users");

            migrationBuilder.DropColumn(
                name: "country",
                schema: "store",
                table: "users");

            migrationBuilder.DropColumn(
                name: "phone_number",
                schema: "store",
                table: "users");

            migrationBuilder.DropColumn(
                name: "state",
                schema: "store",
                table: "users");

            migrationBuilder.DropColumn(
                name: "zip_code",
                schema: "store",
                table: "users");
        }
    }
}
