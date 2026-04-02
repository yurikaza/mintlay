package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"
)

type UserData struct {
	WalletAddress string `json:"walletAddress"`
	UserName string `json:"username"`
	Plan   string `json:"plan"`
}

func Protect(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	
	if authHeader == "" {
		authHeader = c.Query("authorization")
	}

	fmt.Printf("[AUTH MIDDLEWARE] Received Auth: %s\n", authHeader)

    if authHeader == "" {
        return c.Status(401).JSON(fiber.Map{"error": "No token provided"})
    }

	token := strings.TrimPrefix(authHeader, "Bearer ")

	// Call Node.js Auth Service to verify
	client := &http.Client{}
	req, err := http.NewRequest("GET", "http://localhost:3001/me?authorization="+token, nil)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Internal Server Error"})
	}
	req.Header.Set("Authorization", token)

	resp, err := client.Do(req)
	if err != nil || resp.StatusCode != 200 {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized Architect"})
	}
	defer resp.Body.Close()

	var user UserData
	err = json.NewDecoder(resp.Body).Decode(&user)
	if err != nil {
 	   fmt.Printf("[AUTH ERROR] Failed to decode user: %v\n", err)
  	  return c.Status(500).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	fmt.Printf("[AUTH MIDDLEWARE] Verified User: %s | Plan: %s\n", user.UserName, user.Plan)

	// Store user data in Fiber context for the handler to use
	c.Locals("wallet", user.WalletAddress)
	c.Locals("plan", user.Plan)

	return c.Next()
}