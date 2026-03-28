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

	// 1. Architect-Grade CORS
app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
		AllowCredentials: true, // Required if you pass cookies or specific Auth headers
	}))

	// 2. Define Service URLs
	authServiceURL := "http://localhost:3001"
	projectServiceURL := "http://localhost:8080"

	// 3. Routing Table (Proxy)
	
	// Route: Auth Service
// Route: Auth Service
app.All("/api/auth/*", func(c *fiber.Ctx) error {
    // 1. Get the path after /api/auth
    // c.Path() is "/api/auth/nonce"
    // we want "/nonce"
    path := strings.Replace(c.Path(), "/api/auth", "", 1)
    
    // 2. Get the full query string (e.g., "?address=0x123...")
    // This is the safest way to get the raw query string as a string
    queryString := string(c.Request().URI().QueryString())
    
    targetURL := authServiceURL + path
    if queryString != "" {
        targetURL += "?" + queryString
    }
    
    log.Printf("[PROXY] Forwarding to: %s", targetURL)
    return proxy.Do(c, targetURL)
})

	// Route: Project Service (Go)
	app.All("/api/projects/*", func(c *fiber.Ctx) error {
		// No path rewrite needed if Go service expects /api/projects
		return proxy.Do(c, projectServiceURL+c.Path())
	})

	// 4. Gateway Health Check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "GATEWAY_ALIVE"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("🚀 Go Gateway running on port %s", port)
	log.Fatal(app.Listen(":3000"))
}