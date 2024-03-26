using ECommerce.API.DataAccess;
using ECommerce.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoppingController : ControllerBase
    {
        readonly IDataAccess dataAccess;
        private readonly string DateFormat;

        public ShoppingController(IDataAccess dataAccess, IConfiguration configuration)
        {
            this.dataAccess = dataAccess;
            DateFormat = configuration["Constants:DateFormat"];
        }

        [HttpGet("GetCategoryList")]
        public IActionResult GetCategoryList()
        {
            var result = dataAccess.GetProductCategories();
            return Ok(result);
        }

        [HttpGet("GetProducts")]
        public IActionResult GetProducts(string category, string subcategory, int count)
        {
            var result = dataAccess.GetProducts(category, subcategory, count);
            return Ok(result);
        }

        [HttpGet("GetProduct/{id}")]
        public IActionResult GetProduct(int id)
        {
            var result = dataAccess.GetProduct(id);
            return Ok(result);
        }

        [HttpPost("RegisterUser")]
        public IActionResult RegisterUser([FromBody] User user)
        {
            user.CreatedAt = DateTime.Now.ToString(DateFormat);
            user.ModifiedAt = DateTime.Now.ToString(DateFormat);

            var result = dataAccess.InsertUser(user);

            string? message;
            if (result) message = "inserted";
            else message = "email not available";
            return Ok(message);
        }

        [HttpGet("GetAllProducts")]
        public IActionResult GetAllProducts()
        {
            var result = dataAccess.GetAllProducts(); // Assuming GetAllProducts() method fetches all products from the database
            return Ok(result);
        }


        [HttpPost("LoginUser")]
        public IActionResult LoginUser([FromBody] User user)
        {
            var token = dataAccess.IsUserPresent(user.Email, user.Password);
            if (token == "") token = "invalid";
            return Ok(token);
        }

        [HttpPost("InsertReview")]
        public IActionResult InsertReview([FromBody] Review review)
        {
            review.CreatedAt = DateTime.Now.ToString(DateFormat);
            dataAccess.InsertReview(review);
            return Ok("inserted");
        }

        [HttpGet("GetProductReviews/{productId}")]
        public IActionResult GetProductReviews(int productId)
        {
            var result = dataAccess.GetProductReviews(productId);
            return Ok(result);
        }

        [HttpPost("InsertCartItem/{userid}/{productid}")]
        public IActionResult InsertCartItem(int userid, int productid)
        {
            var result = dataAccess.InsertCartItem(userid, productid);
            return Ok(result ? "inserted" : "not inserted");
        }

        [HttpGet("GetActiveCartOfUser/{id}")]
        public IActionResult GetActiveCartOfUser(int id)
        {
            var result = dataAccess.GetActiveCartOfUser(id);
            return Ok(result);
        }

        [HttpGet("GetAllPreviousCartsOfUser/{id}")]
        public IActionResult GetAllPreviousCartsOfUser(int id)
        {
            var result = dataAccess.GetAllPreviousCartsOfUser(id);
            return Ok(result);
        }

        [HttpGet("GetPaymentMethods")]
        public IActionResult GetPaymentMethods()
        {
            var result = dataAccess.GetPaymentMethods();
            return Ok(result);
        }

        [HttpGet("GetOffers")] 
        public IActionResult GetOffers()
        {
            var result = dataAccess.GetOffers();
            return Ok(result);
        }

        [HttpPost("InsertPayment")]
        public IActionResult InsertPayment(Payment payment)
        {
            payment.CreatedAt = DateTime.Now.ToString();
            var id = dataAccess.InsertPayment(payment);
            return Ok(id.ToString());
        }

        [HttpPost("InsertOrder")]
        public IActionResult InsertOrder(Order order)
        {
            order.CreatedAt = DateTime.Now.ToString();
            var id = dataAccess.InsertOrder(order);
            return Ok(id.ToString());
        }

        [HttpPost("UploadImage")]
        public IActionResult UploadImage(IFormFile file)
        {
            try
            {
                // Check if the file is null
                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded.");

                // Get the file extension
                var extension = Path.GetExtension(file.FileName);

                // Generate a unique filename
                var uniqueFileName = Guid.NewGuid().ToString() + extension;

                // Get the path where the file will be saved
                var imagePath = Path.Combine("wwwroot", "images", "products", uniqueFileName);

                // Save the file to the server
                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                // Return the path to the saved image
                var imageUrl = $"~/images/products/{uniqueFileName}";
                return Ok(new { imageUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPost("InsertProduct")]
        public IActionResult InsertProduct([FromBody] Product product)
        {
            
            var result = dataAccess.InsertProduct(product);
            if (result)
            {
                return Ok(new { success = true, message = "Product inserted successfully" });
            }
            else
            {
                return Ok(new { success = false, message = "Failed to insert product" });
            }
        }


        [HttpDelete("DeleteProduct/{id}")]
        public IActionResult DeleteProduct(int id)
        {
            try
            {
                // Call the data access layer to delete the product by its ID
                bool result = dataAccess.DeleteProduct(id);

                if (result)
                {
                    return Ok(new { success = true, message = "Product deleted successfully" });
                }
                else
                {
                    return NotFound(new { success = false, message = "Product not found or failed to delete" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }



        [HttpPost("EditProduct/{productId}")]
        public IActionResult EditProduct(int productId, [FromBody] Product product)
        {
            var result = dataAccess.EditProduct(productId, product);
            if (result)
            {
                return Ok(new { success = true, message = "Product updated successfully" });
            }
            else
            {
                return Ok(new { success = false, message = "Failed to update product" });
            }
        }



        [HttpGet("GetAllUsers")]
        public IActionResult GetAllUsers()
        {
            var result = dataAccess.GetAllUsers();
            return Ok(result);
        }

        [HttpPost("InsertUser")]
        public IActionResult AddUser([FromBody] User user)
        {
            // You may want to perform validation on the user object before inserting
            var result = dataAccess.AddUser(user);
            if (result)
            {
                return Ok("User inserted successfully");
            }
            else
            {
                return BadRequest("Failed to insert user");
            }
        }

        [HttpPut("EditUser/{userId}")]
        public IActionResult EditUser(int userId, [FromBody] User user)
        {
            // You may want to perform validation on the user object before editing
            var result = dataAccess.EditUser(userId, user);
            if (result)
            {
                return Ok("User updated successfully");
            }
            else
            {
                return BadRequest("Failed to update user");
            }
        }

        [HttpDelete("DeleteUser/{userId}")]
        public IActionResult DeleteUser(int userId)
        {
            var result = dataAccess.DeleteUser(userId);
            if (result)
            {
                return Ok("User deleted successfully");
            }
            else
            {
                return NotFound("User not found or failed to delete");
            }
        }




        //[HttpGet("GetOrder/{orderId}")]
        //public IActionResult GetOrder(int orderId)
        //{
        //    var order = dataAccess.GetOrder(orderId);
        //    if (order != null)
        //    {
        //        return Ok(order);
        //    }
        //    else
        //    {
        //        return NotFound();
        //    }
        //}
    }
}
