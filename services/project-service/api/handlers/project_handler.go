package handlers

import (
	"context"
	"time"

	"yurikaza/mintlay/project-service/pkg/db"
	"yurikaza/mintlay/project-service/pkg/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// GetProjects - Fetches all projects for a specific wallet
func GetProjects(c *fiber.Ctx) error {
	wallet := c.Params("wallet")
	var projects []models.Project

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := db.ProjectCollection.Find(ctx, bson.M{"wallet": wallet})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch projects"})
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &projects); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Error parsing project data"})
	}

	return c.JSON(projects)
}

// SaveProject - Upserts (Create or Update) a project script
func SaveProject(c *fiber.Ctx) error {
	project := new(models.Project)

	if err := c.BodyParser(project); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	project.UpdatedAt = time.Now()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Update if Wallet + Name matches, otherwise Create (Upsert)
	filter := bson.M{"wallet": project.Wallet, "name": project.Name}
	update := bson.M{"$set": project}
	opts := options.Update().SetUpsert(true)

	_, err := db.ProjectCollection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to save project to MongoDB"})
	}

	return c.Status(200).JSON(fiber.Map{
		"message":   "PROJECT_SAVED_SUCCESSFULLY",
		"timestamp": project.UpdatedAt,
	})
}