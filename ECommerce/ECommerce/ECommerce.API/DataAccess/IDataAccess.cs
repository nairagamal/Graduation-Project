﻿using System.Collections.Generic;
using ECommerce.API.Models;

namespace ECommerce.API.DataAccess
{
    public interface IDataAccess
    {
        List<ProductCategory> GetProductCategories();
        ProductCategory GetProductCategory(int id);
        Offer GetOffer(int id);
        List<Product> GetProducts(string category, string subcategory, int count);
        Product GetProduct(int id);
        bool InsertUser(User user);
        string IsUserPresent(string email, string password);
        void InsertReview(Review review);
        List<Review> GetProductReviews(int productId);
        User GetUser(int id);
        bool InsertCartItem(int userId, int productId);
        Cart GetActiveCartOfUser(int userid);
        Cart GetCart(int cartid);
        List<Cart> GetAllPreviousCartsOfUser(int userid);
        PaymentMethod GetPaymentMethodById(int id);
        List<PaymentMethod> GetPaymentMethods();
        int InsertPayment(Payment payment);
        int InsertOrder(Order order);
        bool InsertProduct(Product product);
        List<Offer> GetOffers();
        List<Product> GetAllProducts();
        bool DeleteProduct(int productId);
        bool EditProduct(int productId, Product product);
        List<User> GetAllUsers();
        bool AddUser(User user);
        bool EditUser(int userId, User user);
        bool DeleteUser(int userId);
        Order GetOrder(int orderId);
        Payment GetPayment(int paymentId);
        List<Order> GetAllOrders();
        List<Order> GetPendingOrders();
        void AcceptOrder(int orderId);
        void RejectOrder(int orderId);
        List<Order> GetOrdersThisWeek();
        List<Order> GetOrdersLastMonth();
        List<Product> GetAllProductsFlat();
        string GetProductImage(int id);
        void SaveImageData(int productId, byte[] imageData);

        bool RemoveCartItem(int cartItemId);

    }
}
