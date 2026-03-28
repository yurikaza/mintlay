package main

import (
	"log"
	"os"

	"yurikaza/mintlay/project-service/api/handlers" // Import your handlers
	"yurikaza/mintlay/project-service/pkg/db"
	"yurikaza/mintlay/project-service/pkg/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	db.ConnectDB()

	app := fiber.New()
	app.Use(cors.New())

	// cmd/main.go
	api := app.Group("/api/projects")

	// Protected Routes
	api.Use(middleware.Protect) 
	api.Post("/save", handlers.SaveProject)
	api.Get("/my-projects", handlers.GetProjects) // Logic updated to use c.Locals("wallet")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Fatal(app.Listen(":" + port))
}