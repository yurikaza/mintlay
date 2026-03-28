package main

import (
	"log"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/proxy"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	app := fiber.New()

	// 1. Heavy-Duty CORS (Must be FIRST)
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
		AllowCredentials: true,
		ExposeHeaders:    "Content-Length",
	}))

	authServiceURL := "http://localhost:3001"
	projectServiceURL := "http://localhost:8080"

	// 2. Auth Proxy Logic
	app.All("/api/auth/*", func(c *fiber.Ctx) error {
		// Use OriginalURL to keep the ?address=0x... query string intact
		// We just swap "/api/auth" with ""
		targetPath := strings.Replace(c.OriginalURL(), "/api/auth", "", 1)
		targetURL := authServiceURL + targetPath

		log.Printf("[GATEWAY] Routing to Auth: %s", targetURL)
		
		return proxy.Do(c, targetURL)
	})

	// 3. Project Proxy Logic
	app.All("/api/projects/*", func(c *fiber.Ctx) error {
		targetPath := strings.Replace(c.OriginalURL(), "/api/projects", "", 1)
		targetURL := projectServiceURL + "/api/projects" + targetPath

		log.Printf("[GATEWAY] Routing to Go Engine: %s", targetURL)

		return proxy.Do(c, targetURL)
	})

	port := os.Getenv("PORT")
	if port == "" { port = "3000" }

	log.Printf("🚀 Architect Gateway Active on Port %s", port)
	log.Fatal(app.Listen(":" + port))
}