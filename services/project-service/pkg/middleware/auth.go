package middleware

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"
)

type UserData struct {
	Wallet string `json:"wallet"`
	Plan   string `json:"plan"`
}

func Protect(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(401).JSON(fiber.Map{"error": "No token provided"})
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	// Call Node.js Auth Service to verify
	client := &http.Client{}
	req, _ := http.NewRequest("GET", "http://localhost:3001/me", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := client.Do(req)
	if err != nil || resp.StatusCode != 200 {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized Architect"})
	}
	defer resp.Body.Close()

	var user UserData
	json.NewDecoder(resp.Body).Decode(&user)

	// Store user data in Fiber context for the handler to use
	c.Locals("wallet", user.Wallet)
	c.Locals("plan", user.Plan)

	return c.Next()
}