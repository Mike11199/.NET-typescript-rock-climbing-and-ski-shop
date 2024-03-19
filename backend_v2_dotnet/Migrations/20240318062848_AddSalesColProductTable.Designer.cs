﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using backend_v2.Models;

#nullable disable

namespace backend_v2.Migrations
{
    [DbContext(typeof(AlpinePeakDbContext))]
    [Migration("20240318062848_AddSalesColProductTable")]
    partial class AddSalesColProductTable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.16")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("backend_v2.Models.Category", b =>
                {
                    b.Property<Guid>("CategoryId")
                        .HasColumnType("uuid")
                        .HasColumnName("category_id");

                    b.Property<string>("Description")
                        .HasColumnType("character varying")
                        .HasColumnName("description");

                    b.Property<string>("Image")
                        .HasColumnType("character varying")
                        .HasColumnName("image");

                    b.Property<string>("Name")
                        .HasColumnType("character varying")
                        .HasColumnName("name ");

                    b.HasKey("CategoryId")
                        .HasName("categories_pkey");

                    b.ToTable("categories", "store");
                });

            modelBuilder.Entity("backend_v2.Models.Image", b =>
                {
                    b.Property<Guid>("ImageId")
                        .HasColumnType("uuid")
                        .HasColumnName("image_id");

                    b.Property<string>("ImageUrl")
                        .HasColumnType("character varying")
                        .HasColumnName("image_url");

                    b.Property<Guid?>("ProductId")
                        .HasColumnType("uuid")
                        .HasColumnName("product_id");

                    b.HasKey("ImageId")
                        .HasName("images_pkey");

                    b.HasIndex("ProductId");

                    b.ToTable("images", "store");
                });

            modelBuilder.Entity("backend_v2.Models.Order", b =>
                {
                    b.Property<Guid>("OrderId")
                        .HasColumnType("uuid")
                        .HasColumnName("order_id");

                    b.Property<DateTime?>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<int?>("IsDelivered")
                        .HasColumnType("integer")
                        .HasColumnName("is_delivered");

                    b.Property<int?>("IsPaid")
                        .HasColumnType("integer")
                        .HasColumnName("is_paid");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at");

                    b.Property<Guid?>("UserId")
                        .HasColumnType("uuid")
                        .HasColumnName("user_id");

                    b.HasKey("OrderId")
                        .HasName("orders_pkey");

                    b.ToTable("orders", "store");
                });

            modelBuilder.Entity("backend_v2.Models.OrderProductItem", b =>
                {
                    b.Property<Guid?>("OrderId")
                        .HasColumnType("uuid")
                        .HasColumnName("order_id");

                    b.Property<decimal?>("Price")
                        .HasPrecision(10, 5)
                        .HasColumnType("numeric(10,5)")
                        .HasColumnName("price");

                    b.Property<Guid?>("ProductId")
                        .HasColumnType("uuid")
                        .HasColumnName("product_id");

                    b.Property<int?>("Quantity")
                        .HasColumnType("integer")
                        .HasColumnName("quantity");

                    b.ToTable("order_product_items", "store", t =>
                        {
                            t.HasComment("Intersection table between orders and products.");
                        });
                });

            modelBuilder.Entity("backend_v2.Models.Product", b =>
                {
                    b.Property<Guid>("ProductId")
                        .HasColumnType("uuid")
                        .HasColumnName("product_id");

                    b.Property<Guid?>("CategoryId")
                        .HasColumnType("uuid")
                        .HasColumnName("category_id");

                    b.Property<int?>("Count")
                        .HasColumnType("integer")
                        .HasColumnName("count");

                    b.Property<string>("Description")
                        .HasColumnType("character varying")
                        .HasColumnName("description");

                    b.Property<string>("Name")
                        .HasColumnType("character varying")
                        .HasColumnName("name");

                    b.Property<decimal?>("Price")
                        .HasPrecision(10, 5)
                        .HasColumnType("numeric(10,5)")
                        .HasColumnName("price");

                    b.Property<int?>("Sales")
                        .HasColumnType("integer")
                        .HasColumnName("sales");

                    b.HasKey("ProductId")
                        .HasName("products_pkey");

                    b.HasIndex("CategoryId");

                    b.ToTable("products", "store");
                });

            modelBuilder.Entity("backend_v2.Models.Review", b =>
                {
                    b.Property<Guid>("ReviewId")
                        .HasColumnType("uuid")
                        .HasColumnName("review_id");

                    b.Property<string>("Comment")
                        .HasColumnType("character varying")
                        .HasColumnName("comment");

                    b.Property<DateTime?>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<int?>("Rating")
                        .HasColumnType("integer")
                        .HasColumnName("rating");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at");

                    b.HasKey("ReviewId")
                        .HasName("reviews_pkey");

                    b.ToTable("reviews", "store");
                });

            modelBuilder.Entity("backend_v2.Models.User", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid")
                        .HasColumnName("user_id");

                    b.Property<string>("Address")
                        .HasColumnType("text")
                        .HasColumnName("address");

                    b.Property<string>("City")
                        .HasColumnType("text")
                        .HasColumnName("city");

                    b.Property<string>("Country")
                        .HasColumnType("text")
                        .HasColumnName("country");

                    b.Property<DateTime?>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<string>("Email")
                        .HasColumnType("character varying")
                        .HasColumnName("email");

                    b.Property<int?>("IsAdmin")
                        .HasColumnType("integer")
                        .HasColumnName("is_admin");

                    b.Property<string>("LastName")
                        .HasColumnType("character varying")
                        .HasColumnName("last_name");

                    b.Property<string>("Name")
                        .HasColumnType("character varying")
                        .HasColumnName("name");

                    b.Property<string>("Password")
                        .HasColumnType("character varying")
                        .HasColumnName("password");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text")
                        .HasColumnName("phone_number");

                    b.Property<string>("State")
                        .HasColumnType("text")
                        .HasColumnName("state");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at");

                    b.Property<string>("ZipCode")
                        .HasColumnType("text")
                        .HasColumnName("zip_code");

                    b.HasKey("UserId")
                        .HasName("users_pkey");

                    b.ToTable("users", "store");
                });

            modelBuilder.Entity("backend_v2.Models.Image", b =>
                {
                    b.HasOne("backend_v2.Models.Product", null)
                        .WithMany("Images")
                        .HasForeignKey("ProductId");
                });

            modelBuilder.Entity("backend_v2.Models.Product", b =>
                {
                    b.HasOne("backend_v2.Models.Category", "Category")
                        .WithMany("Products")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .HasConstraintName("fk_categories_products");

                    b.Navigation("Category");
                });

            modelBuilder.Entity("backend_v2.Models.Category", b =>
                {
                    b.Navigation("Products");
                });

            modelBuilder.Entity("backend_v2.Models.Product", b =>
                {
                    b.Navigation("Images");
                });
#pragma warning restore 612, 618
        }
    }
}