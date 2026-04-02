package handlers

import (
	"context"
	"time"

	"yurikaza/mintlay/project-service/pkg/db"
	"yurikaza/mintlay/project-service/pkg/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GetProjects - Fetches all projects for a specific wallet
func GetProjects(c *fiber.Ctx) error {
	wallet := c.Query("wallet")
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

func CreateProject(c *fiber.Ctx) error {
	// 1. Define the input structure
	type CreateRequest struct {
		Name   string `json:"name"`
		Wallet string `json:"wallet"`
		Plan   string `json:"plan"`
	}

	req := new(CreateRequest)
	if err := c.BodyParser(req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "INVALID_INPUT"})
	}

	// 2. Define Limits based on the Plan Parameter
	limit := 1
	switch req.Plan {
	case "pro":
		limit = 10
	case "architect":
		limit = 100
	default:
		limit = 1 // Free plan
	}

	// 3. Check current project count for this wallet
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	count, err := db.ProjectCollection.CountDocuments(ctx, bson.M{"wallet": req.Wallet})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "DB_COUNT_ERROR"})
	}

	// 4. Block if limit is reached
	if int(count) >= limit {
		return c.Status(403).JSON(fiber.Map{
			"error":   "PLAN_LIMIT_REACHED",
			"message": "Insufficient blueprint slots for your current plan.",
			"current": count,
			"max":     limit,
		})
	}

	// 5. If okay, proceed to create the project
	newProject := models.Project{
		ID:        primitive.NewObjectID().Hex(),
		Name:      req.Name,
		Wallet:    req.Wallet,
		Plan:      req.Plan,
		Scripts:   []string{},
		UpdatedAt: time.Now(),
	}

	_, err = db.ProjectCollection.InsertOne(ctx, newProject)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "INITIALIZATION_FAILED"})
	}

	return c.Status(201).JSON(newProject)
}

// api/handlers/project_handler.go

func GetProjectByID(c *fiber.Ctx) error {
	id := c.Params("id")
	
	// Convert string ID to MongoDB ObjectID


	var project models.Project
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	
	 db.ProjectCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&project)
	if project.ID == "" {
		return c.Status(404).JSON(fiber.Map{"error": "Project not found"})
	}	

	return c.JSON(project)
}

func UpdateProject(c *fiber.Ctx) error {
    id := c.Params("id")
    

    var body struct {
        Scripts []string `json:"scripts"`
    }
    if err := c.BodyParser(&body); err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "INVALID_BODY"})
    }

    update := bson.M{"$set": bson.M{"scripts": body.Scripts}}
    
    _, err := db.ProjectCollection.UpdateOne(context.TODO(), bson.M{"_id": id}, update)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "DATABASE_UPDATE_FAILED"})
    }

    return c.JSON(fiber.Map{"status": "SYNC_COMPLETE"})
}