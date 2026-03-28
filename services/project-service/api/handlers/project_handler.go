package handlers

import (
	"context"
	"time"

	"yurikaza/mintlay/project-service/pkg/db"
	"yurikaza/mintlay/project-service/pkg/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
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

func SaveProject(c *fiber.Ctx) error {
	wallet := c.Locals("wallet").(string)
	plan := c.Locals("plan").(string)

	project := new(models.Project)
	if err := c.BodyParser(project); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid data"})
	}

	// Logic: Enforce Plan Limits
	if plan == "free" {
		// Check if they already have a project
		count, _ := db.ProjectCollection.CountDocuments(context.TODO(), bson.M{"wallet": wallet})
		if count >= 1 {
			return c.Status(403).JSON(fiber.Map{
				"error": "FREE_PLAN_LIMIT_REACHED",
				"message": "Upgrade to Architect Plan for unlimited projects",
			})
		}
	}

	project.Wallet = wallet
	project.Plan = plan
	project.UpdatedAt = time.Now()

	// ... existing UpdateOne logic ...
    return c.JSON(fiber.Map{"status": "SAVED", "plan": plan})
}