using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class FixDocumentToUserRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "DocumentToUsers",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DocumentToUsers_UserId1",
                table: "DocumentToUsers",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentToUsers_AspNetUsers_UserId1",
                table: "DocumentToUsers",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DocumentToUsers_AspNetUsers_UserId1",
                table: "DocumentToUsers");

            migrationBuilder.DropIndex(
                name: "IX_DocumentToUsers_UserId1",
                table: "DocumentToUsers");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "DocumentToUsers");
        }
    }
}
