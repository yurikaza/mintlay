package main

import (
	"log"
	"os"

	"yurikaza/mintlay/project-service/api/handlers" // Import your handlers
	"yurikaza/mintlay/project-service/pkg/db"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	db.ConnectDB()

	app := fiber.New()
	app.Use(cors.New())

	// API Grouping
	api := app.Group("/api/projects")

	// Routes pointing to Handlers
	api.Get("/:wallet", handlers.GetProjects)
	api.Post("/save", handlers.SaveProject)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Fatal(app.Listen(":" + port))
}