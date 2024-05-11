using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_v2.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIdToReviewsModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "user_id",
                schema: "store",
                table: "reviews",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("ad960249-e2bc-4a88-8c30-fb88149ffba4"));

            migrationBuilder.CreateIndex(
                name: "IX_reviews_user_id",
                schema: "store",
                table: "reviews",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_reviews_users_user_id",
                schema: "store",
                table: "reviews",
                column: "user_id",
                principalSchema: "store",
                principalTable: "users",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_reviews_users_user_id",
                schema: "store",
                table: "reviews");

            migrationBuilder.DropIndex(
                name: "IX_reviews_user_id",
                schema: "store",
                table: "reviews");

            migrationBuilder.DropColumn(
                name: "user_id",
                schema: "store",
                table: "reviews");
        }
    }
}
