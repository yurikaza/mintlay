package main

import (
	"fmt"
	"os"
	"strings"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// AuthMiddleware checks the "Authorization: Bearer <token>" header
func AuthMiddleware(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(401).JSON(fiber.Map{"error": "No token provided"})
	}

	// Extract "Bearer " from the string
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	
	// Use your secret from .env (Must match Node.js secret!)
	secret := []byte(os.Getenv("JWT_SECRET"))

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return secret, nil
	})

	if err != nil || !token.Valid {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid or expired token"})
	}

	// Extract the walletAddress/user info and pass it to the next handler
	claims := token.Claims.(jwt.MapClaims)
	c.Locals("user_wallet", claims["walletAddress"])

	return c.Next()
}

func main() {
	app := fiber.New()

	// Protected Route Group
	api := app.Group("/api/projects", AuthMiddleware)

	api.Get("/my-scripts", func(c *fiber.Ctx) error {
		wallet := c.Locals("user_wallet")
		return c.JSON(fiber.Map{
			"message": "Access granted",
			"wallet":  wallet,
		})
	})

	app.Listen(":8080")
}