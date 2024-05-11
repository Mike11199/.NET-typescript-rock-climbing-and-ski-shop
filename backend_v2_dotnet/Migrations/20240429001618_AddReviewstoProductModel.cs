using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_v2.Migrations
{
    /// <inheritdoc />
    public partial class AddReviewstoProductModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "product_id",
                schema: "store",
                table: "reviews",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_reviews_product_id",
                schema: "store",
                table: "reviews",
                column: "product_id");

            migrationBuilder.AddForeignKey(
                name: "FK_reviews_products_product_id",
                schema: "store",
                table: "reviews",
                column: "product_id",
                principalSchema: "store",
                principalTable: "products",
                principalColumn: "product_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_reviews_products_product_id",
                schema: "store",
                table: "reviews");

            migrationBuilder.DropIndex(
                name: "IX_reviews_product_id",
                schema: "store",
                table: "reviews");

            migrationBuilder.DropColumn(
                name: "product_id",
                schema: "store",
                table: "reviews");

        }
    }
}
